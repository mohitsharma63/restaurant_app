import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Plus, Edit, Trash2, QrCode, Download, Save, X, ImageIcon } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { generateQrCodeUrl, downloadQrCode } from "@/lib/qr-generator";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface MenuItem {
  id: string;
  restaurantId: string;
  name: string;
  description: string;
  price: string;
  category: string;
  imageUrl: string;
  isAvailable: boolean;
}

interface QrCodeData {
  id: string;
  tableNumber: number;
  qrData: string;
  isActive: boolean;
  createdAt: string;
}

interface MenuItemForm {
  name: string;
  description: string;
  price: string;
  category: string;
  imageUrl: string;
  isAvailable: boolean;
}

interface Category {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  sortOrder: number;
}

export default function AdminMenu() {
  const [activeTab, setActiveTab] = useState<"menu" | "qr" | "categories">("menu");
  const [tableNumber, setTableNumber] = useState<number>(1);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Static categories data
  const [categoriesData, setCategoriesData] = useState<Category[]>([
    { id: "1", name: "Appetizers", description: "Starter dishes and small plates", isActive: true, sortOrder: 1 },
    { id: "2", name: "Main Courses", description: "Primary dishes and entrees", isActive: true, sortOrder: 2 },
    { id: "3", name: "Desserts", description: "Sweet treats and desserts", isActive: true, sortOrder: 3 },
    { id: "4", name: "Beverages", description: "Drinks and refreshments", isActive: true, sortOrder: 4 },
    { id: "5", name: "Soups", description: "Hot and cold soups", isActive: true, sortOrder: 5 },
    { id: "6", name: "Salads", description: "Fresh salads and greens", isActive: true, sortOrder: 6 },
    { id: "7", name: "Pizza", description: "Wood-fired pizzas", isActive: true, sortOrder: 7 },
    { id: "8", name: "Pasta", description: "Italian pasta dishes", isActive: true, sortOrder: 8 },
    { id: "9", name: "Seafood", description: "Fresh seafood options", isActive: true, sortOrder: 9 },
    { id: "10", name: "Vegetarian", description: "Plant-based options", isActive: true, sortOrder: 10 },
    { id: "11", name: "Specials", description: "Chef's special dishes", isActive: true, sortOrder: 11 }
  ]);

  const [categoryForm, setCategoryForm] = useState({
    name: "",
    description: "",
    isActive: true,
    sortOrder: 1
  });

  // Computed categories for dropdowns
  const categories = categoriesData
    .filter(cat => cat.isActive)
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map(cat => cat.name);

  const [menuForm, setMenuForm] = useState<MenuItemForm>({
    name: "",
    description: "",
    price: "",
    category: "Appetizers",
    imageUrl: "",
    isAvailable: true
  });

  // Get restaurant data
  const { data: restaurants } = useQuery({
    queryKey: ['/api/restaurants'],
  });

  const restaurant = restaurants?.[0];

  // Get menu items
  const { data: menuItems = [], isLoading: menuLoading } = useQuery({
    queryKey: [`/api/restaurants/${restaurant?.id}/menu`],
    enabled: !!restaurant?.id,
  });

  // Get QR codes for the restaurant
  const { data: qrCodes = [], isLoading: qrLoading } = useQuery({
    queryKey: [`/api/restaurants/${restaurant?.id}/qr-codes`],
    enabled: !!restaurant?.id,
  });

  // Create menu item mutation
  const createMenuItemMutation = useMutation({
    mutationFn: async (data: MenuItemForm) => {
      if (!restaurant) throw new Error("No restaurant available");

      const menuItemData = {
        ...data,
        restaurantId: restaurant.id
      };

      return await apiRequest("POST", "/api/menu-items", menuItemData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/restaurants/${restaurant?.id}/menu`] });
      toast({
        title: "Menu Item Added",
        description: "New menu item has been created successfully."
      });
      resetForm();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create menu item.",
        variant: "destructive"
      });
    }
  });

  // Update menu item mutation
  const updateMenuItemMutation = useMutation({
    mutationFn: async (data: { id: string; updates: Partial<MenuItemForm> }) => {
      return await apiRequest("PATCH", `/api/menu-items/${data.id}`, data.updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/restaurants/${restaurant?.id}/menu`] });
      toast({
        title: "Menu Item Updated",
        description: "Menu item has been updated successfully."
      });
      setEditingItem(null);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update menu item.",
        variant: "destructive"
      });
    }
  });

  // Delete menu item mutation
  const deleteMenuItemMutation = useMutation({
    mutationFn: async (id: string) => {
      return await apiRequest("DELETE", `/api/menu-items/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/restaurants/${restaurant?.id}/menu`] });
      toast({
        title: "Menu Item Deleted",
        description: "Menu item has been deleted successfully."
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error", 
        description: error.message || "Failed to delete menu item.",
        variant: "destructive"
      });
    }
  });

  // Generate QR code mutation
  const generateQrMutation = useMutation({
    mutationFn: async () => {
      if (!restaurant) throw new Error("No restaurant available");

      const qrData = {
        restaurantId: restaurant.id,
        tableNumber: tableNumber,
        qrData: `/menu/${restaurant.id}/${tableNumber}`,
        isActive: true
      };

      await apiRequest("POST", "/api/qr-codes", qrData);
      return generateQrCodeUrl(`${window.location.origin}/menu/${restaurant.id}/${tableNumber}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/restaurants/${restaurant?.id}/qr-codes`] });
      toast({
        title: "QR Code Generated",
        description: `QR code for Table ${tableNumber} has been created successfully.`
      });
      setTableNumber(tableNumber + 1);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to generate QR code. Please try again.",
        variant: "destructive"
      });
    }
  });

  const resetForm = () => {
    setMenuForm({
      name: "",
      description: "",
      price: "",
      category: "Appetizers",
      imageUrl: "",
      isAvailable: true
    });
    setIsAddingItem(false);
    setEditingItem(null);
  };

  const resetCategoryForm = () => {
    setCategoryForm({
      name: "",
      description: "",
      isActive: true,
      sortOrder: categoriesData.length + 1
    });
    setIsAddingCategory(false);
    setEditingCategory(null);
  };

  const handleCreateCategory = () => {
    if (!categoryForm.name.trim()) {
      toast({
        title: "Validation Error",
        description: "Category name is required.",
        variant: "destructive"
      });
      return;
    }

    const newCategory: Category = {
      id: Date.now().toString(),
      name: categoryForm.name.trim(),
      description: categoryForm.description.trim(),
      isActive: categoryForm.isActive,
      sortOrder: categoryForm.sortOrder
    };

    setCategoriesData(prev => [...prev, newCategory]);
    toast({
      title: "Category Added",
      description: "New category has been created successfully."
    });
    resetCategoryForm();
  };

  const handleUpdateCategory = () => {
    if (!editingCategory || !categoryForm.name.trim()) {
      toast({
        title: "Validation Error",
        description: "Category name is required.",
        variant: "destructive"
      });
      return;
    }

    setCategoriesData(prev => prev.map(cat => 
      cat.id === editingCategory.id 
        ? { ...cat, name: categoryForm.name.trim(), description: categoryForm.description.trim(), isActive: categoryForm.isActive, sortOrder: categoryForm.sortOrder }
        : cat
    ));

    toast({
      title: "Category Updated",
      description: "Category has been updated successfully."
    });
    resetCategoryForm();
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setCategoryForm({
      name: category.name,
      description: category.description,
      isActive: category.isActive,
      sortOrder: category.sortOrder
    });
    setIsAddingCategory(false);
  };

  const handleDeleteCategory = (categoryId: string) => {
    const category = categoriesData.find(cat => cat.id === categoryId);
    if (!category) return;

    // Check if category has menu items
    const hasItems = menuItems.some((item: MenuItem) => item.category === category.name);
    if (hasItems) {
      toast({
        title: "Cannot Delete",
        description: "Cannot delete category that contains menu items.",
        variant: "destructive"
      });
      return;
    }

    if (confirm(`Are you sure you want to delete "${category.name}" category?`)) {
      setCategoriesData(prev => prev.filter(cat => cat.id !== categoryId));
      toast({
        title: "Category Deleted",
        description: "Category has been deleted successfully."
      });
    }
  };

  const handleToggleCategoryStatus = (categoryId: string) => {
    setCategoriesData(prev => prev.map(cat => 
      cat.id === categoryId ? { ...cat, isActive: !cat.isActive } : cat
    ));
  };

  const handleCreateMenuItem = () => {
    if (!menuForm.name || !menuForm.price) {
      toast({
        title: "Validation Error",
        description: "Name and price are required fields.",
        variant: "destructive"
      });
      return;
    }
    createMenuItemMutation.mutate(menuForm);
  };

  const handleUpdateMenuItem = (item: MenuItem) => {
    updateMenuItemMutation.mutate({
      id: item.id,
      updates: menuForm
    });
  };

  const handleEditItem = (item: MenuItem) => {
    setEditingItem(item);
    setMenuForm({
      name: item.name,
      description: item.description,
      price: item.price,
      category: item.category,
      imageUrl: item.imageUrl,
      isAvailable: item.isAvailable
    });
    setIsAddingItem(false);
  };

  const handleDeleteItem = (id: string) => {
    if (confirm("Are you sure you want to delete this menu item?")) {
      deleteMenuItemMutation.mutate(id);
    }
  };

  const handleToggleAvailability = (item: MenuItem) => {
    updateMenuItemMutation.mutate({
      id: item.id,
      updates: { isAvailable: !item.isAvailable }
    });
  };

  const handleDownloadQr = (qrCode: QrCodeData) => {
    const qrUrl = generateQrCodeUrl(`${window.location.origin}${qrCode.qrData}`);
    downloadQrCode(qrUrl, `table-${qrCode.tableNumber}-qr.png`);

    toast({
      title: "Downloaded",
      description: `QR code for Table ${qrCode.tableNumber} downloaded successfully.`
    });
  };

  const handleGenerateQr = () => {
    generateQrMutation.mutate();
  };

  const filteredMenuItems = selectedCategory === "all" 
    ? menuItems 
    : menuItems.filter((item: MenuItem) => item.category === selectedCategory);

  const menuItemsByCategory = categories.reduce((acc, category) => {
    acc[category] = menuItems.filter((item: MenuItem) => item.category === category);
    return acc;
  }, {} as Record<string, MenuItem[]>);

  if (menuLoading || qrLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Loading...</h2>
          <p className="text-muted-foreground">Please wait while we load your data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Digital Menu Management</h1>
          <p className="text-gray-600">Manage your restaurant's digital menu and QR codes</p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab("menu")}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === "menu"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Menu Items ({menuItems.length})
          </button>
          <button
            onClick={() => setActiveTab("categories")}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === "categories"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Categories ({categoriesData.length})
          </button>
          <button
            onClick={() => setActiveTab("qr")}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === "qr"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            QR Codes ({qrCodes.length})
          </button>
        </nav>
      </div>

      {/* Categories Management Tab */}
      {activeTab === "categories" && (
        <div className="space-y-6">
          {/* Add/Edit Category Form */}
          {(isAddingCategory || editingCategory) && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  {editingCategory ? "Edit Category" : "Add New Category"}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={resetCategoryForm}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="category-name">Name *</Label>
                    <Input
                      id="category-name"
                      value={categoryForm.name}
                      onChange={(e) => setCategoryForm({...categoryForm, name: e.target.value})}
                      placeholder="Enter category name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="sort-order">Sort Order</Label>
                    <Input
                      id="sort-order"
                      type="number"
                      value={categoryForm.sortOrder}
                      onChange={(e) => setCategoryForm({...categoryForm, sortOrder: parseInt(e.target.value) || 1})}
                      placeholder="1"
                      min="1"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="category-description">Description</Label>
                  <Textarea
                    id="category-description"
                    value={categoryForm.description}
                    onChange={(e) => setCategoryForm({...categoryForm, description: e.target.value})}
                    placeholder="Enter category description"
                    rows={3}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="category-active"
                    checked={categoryForm.isActive}
                    onCheckedChange={(checked) => setCategoryForm({...categoryForm, isActive: checked})}
                  />
                  <Label htmlFor="category-active">Active category</Label>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={editingCategory ? handleUpdateCategory : handleCreateCategory}
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {editingCategory ? "Update Category" : "Add Category"}
                  </Button>
                  <Button variant="outline" onClick={resetCategoryForm}>
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Actions Bar */}
          <div className="flex justify-between items-center">
            <Button
              onClick={() => setIsAddingCategory(true)}
              disabled={isAddingCategory || editingCategory}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Category
            </Button>
          </div>

          {/* Categories List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categoriesData
              .sort((a, b) => a.sortOrder - b.sortOrder)
              .map((category) => {
                const itemCount = menuItems.filter((item: MenuItem) => item.category === category.name).length;
                return (
                  <Card key={category.id} className="overflow-hidden">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-lg">{category.name}</h3>
                        <Badge variant={category.isActive ? "default" : "secondary"}>
                          {category.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">{category.description}</p>
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-sm text-gray-500">
                          {itemCount} item{itemCount !== 1 ? 's' : ''}
                        </span>
                        <Badge variant="outline">Order: {category.sortOrder}</Badge>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEditCategory(category)}
                          className="flex-1"
                        >
                          <Edit className="w-3 h-3 mr-1" />
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleToggleCategoryStatus(category.id)}
                          className="flex-1"
                        >
                          {category.isActive ? "Disable" : "Enable"}
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDeleteCategory(category.id)}
                          disabled={itemCount > 0}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
          </div>

          {categoriesData.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">No categories yet</p>
              <Button onClick={() => setIsAddingCategory(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add First Category
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Menu Management Tab */}
      {activeTab === "menu" && (
        <div className="space-y-6">
          {/* Add/Edit Menu Item Form */}
          {(isAddingItem || editingItem) && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  {editingItem ? "Edit Menu Item" : "Add New Menu Item"}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={resetForm}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="item-name">Name *</Label>
                    <Input
                      id="item-name"
                      value={menuForm.name}
                      onChange={(e) => setMenuForm({...menuForm, name: e.target.value})}
                      placeholder="Enter item name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="item-price">Price *</Label>
                    <Input
                      id="item-price"
                      type="number"
                      step="0.01"
                      value={menuForm.price}
                      onChange={(e) => setMenuForm({...menuForm, price: e.target.value})}
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <Label htmlFor="item-category">Category</Label>
                    <Select
                      value={menuForm.category}
                      onValueChange={(value) => setMenuForm({...menuForm, category: value})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="item-image">Image URL</Label>
                    <Input
                      id="item-image"
                      value={menuForm.imageUrl}
                      onChange={(e) => setMenuForm({...menuForm, imageUrl: e.target.value})}
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="item-description">Description</Label>
                  <Textarea
                    id="item-description"
                    value={menuForm.description}
                    onChange={(e) => setMenuForm({...menuForm, description: e.target.value})}
                    placeholder="Enter item description"
                    rows={3}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="item-available"
                    checked={menuForm.isAvailable}
                    onCheckedChange={(checked) => setMenuForm({...menuForm, isAvailable: checked})}
                  />
                  <Label htmlFor="item-available">Available for ordering</Label>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={editingItem ? () => handleUpdateMenuItem(editingItem) : handleCreateMenuItem}
                    disabled={createMenuItemMutation.isPending || updateMenuItemMutation.isPending}
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {editingItem ? "Update Item" : "Add Item"}
                  </Button>
                  <Button variant="outline" onClick={resetForm}>
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Actions Bar */}
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Button
                onClick={() => setIsAddingItem(true)}
                disabled={isAddingItem || editingItem}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Menu Item
              </Button>
              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category} ({menuItemsByCategory[category]?.length || 0})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Menu Items Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMenuItems.map((item: MenuItem) => (
              <Card key={item.id} className="overflow-hidden">
                <div className="aspect-w-16 aspect-h-9 bg-gray-200">
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-full h-48 object-cover"
                    />
                  ) : (
                    <div className="w-full h-48 bg-gray-100 flex items-center justify-center">
                      <ImageIcon className="w-12 h-12 text-gray-400" />
                    </div>
                  )}
                </div>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-lg">{item.name}</h3>
                    <Badge variant={item.isAvailable ? "default" : "secondary"}>
                      {item.isAvailable ? "Available" : "Unavailable"}
                    </Badge>
                  </div>
                  <p className="text-gray-600 text-sm mb-2 line-clamp-2">{item.description}</p>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-xl font-bold text-green-600">${item.price}</span>
                    <Badge variant="outline">{item.category}</Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEditItem(item)}
                      className="flex-1"
                    >
                      <Edit className="w-3 h-3 mr-1" />
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleToggleAvailability(item)}
                      className="flex-1"
                    >
                      <Switch
                        checked={item.isAvailable}
                        className="w-3 h-3 mr-1"
                      />
                      Toggle
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDeleteItem(item.id)}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredMenuItems.length === 0 && (
            <div className="text-center py-12">
              <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">
                {selectedCategory === "all" ? "No menu items yet" : `No items in ${selectedCategory}`}
              </p>
              <Button onClick={() => setIsAddingItem(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add First Menu Item
              </Button>
            </div>
          )}
        </div>
      )}

      {/* QR Code Management Tab */}
      {activeTab === "qr" && (
        <div className="space-y-6">
          {/* QR Code Generator */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <QrCode className="w-5 h-5" />
                Generate New QR Code
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end gap-4">
                <div className="flex-1 max-w-xs">
                  <Label htmlFor="table-number" className="block text-sm font-medium mb-2">
                    Table Number
                  </Label>
                  <Input
                    id="table-number"
                    type="number"
                    placeholder="Enter table number"
                    value={tableNumber}
                    onChange={(e) => setTableNumber(parseInt(e.target.value) || 1)}
                    min="1"
                    className="w-full"
                  />
                </div>
                <Button 
                  onClick={handleGenerateQr}
                  disabled={generateQrMutation.isPending}
                  className="flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  {generateQrMutation.isPending ? "Generating..." : "Generate QR Code"}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Existing QR Codes */}
          <Card>
            <CardHeader>
              <CardTitle>Existing QR Codes ({qrCodes.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {qrCodes.length === 0 ? (
                <div className="text-center py-12">
                  <QrCode className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 mb-4">No QR codes generated yet</p>
                  <p className="text-sm text-gray-400">Generate your first QR code above to get started</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {qrCodes.map((qrCode: QrCodeData) => (
                    <Card key={qrCode.id} className="border">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="font-semibold text-lg">Table {qrCode.tableNumber}</h3>
                          <Badge variant={qrCode.isActive ? "default" : "secondary"}>
                            {qrCode.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </div>

                        {/* QR Code Preview */}
                        <div className="w-32 h-32 mx-auto bg-muted rounded-lg flex items-center justify-center mb-4">
                          <img 
                            src={generateQrCodeUrl(`${window.location.origin}${qrCode.qrData}`)}
                            alt={`QR Code for Table ${qrCode.tableNumber}`}
                            className="w-28 h-28"
                          />
                        </div>

                        <div className="text-xs text-gray-500 mb-4">
                          Created: {new Date(qrCode.createdAt).toLocaleDateString()}
                        </div>

                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDownloadQr(qrCode)}
                            className="flex-1"
                          >
                            <Download className="w-3 h-3 mr-1" />
                            Download
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => window.open(qrCode.qrData, '_blank')}
                            className="flex-1"
                          >
                            <Edit className="w-3 h-3 mr-1" />
                            Preview
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button 
                  variant="outline" 
                  className="p-4 h-auto flex-col"
                  onClick={() => {
                    const startTable = Math.max(...qrCodes.map((qr: QrCodeData) => qr.tableNumber), 0) + 1;
                    setTableNumber(startTable);
                  }}
                >
                  <Plus className="w-6 h-6 mb-2" />
                  <span className="font-medium">Generate Next Table</span>
                  <span className="text-xs text-gray-500">Auto-increment table number</span>
                </Button>

                <Button 
                  variant="outline" 
                  className="p-4 h-auto flex-col"
                  onClick={() => {
                    qrCodes.forEach((qrCode: QrCodeData) => {
                      handleDownloadQr(qrCode);
                    });
                    toast({
                      title: "Bulk Download Started",
                      description: `Downloading ${qrCodes.length} QR codes...`
                    });
                  }}
                >
                  <Download className="w-6 h-6 mb-2" />
                  <span className="font-medium">Download All</span>
                  <span className="text-xs text-gray-500">Bulk download QR codes</span>
                </Button>

                <Button 
                  variant="outline" 
                  className="p-4 h-auto flex-col"
                  onClick={() => window.open('/qr-landing', '_blank')}
                >
                  <QrCode className="w-6 h-6 mb-2" />
                  <span className="font-medium">QR Generator Tool</span>
                  <span className="text-xs text-gray-500">Open advanced generator</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
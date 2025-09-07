
import { useState, useEffect } from "react";
import { useParams } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { apiRequest } from "@/lib/queryClient";
import { 
  ShoppingCart, 
  Search, 
  Plus, 
  Minus, 
  Star,
  Clock,
  MapPin,
  Phone,
  Wifi,
  ArrowLeft,
  Heart,
  Share2,
  Grid3X3,
  List,
  Leaf,
  Flame,
  ChefHat,
  Timer,
  User,
  Bell,
  Filter,
  X,
  Check,
  AlertCircle,
  Truck,
  DollarSign
} from "lucide-react";

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image?: string;
  isAvailable: boolean;
  preparationTime: number;
  isVegetarian?: boolean;
  isSpicy?: boolean;
  rating?: number;
  reviews?: number;
}

interface CartItem extends MenuItem {
  quantity: number;
}

interface Restaurant {
  id: string;
  name: string;
  address: string;
  phone?: string;
  rating?: number;
}

const mockMenuItems: MenuItem[] = [
  {
    id: "1",
    name: "Grilled Salmon with Herbs",
    description: "Fresh Atlantic salmon grilled to perfection with aromatic herbs and lemon butter sauce",
    price: 28.99,
    category: "Main Course",
    image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&h=300&fit=crop",
    isAvailable: true,
    preparationTime: 20,
    isVegetarian: false,
    isSpicy: false,
    rating: 4.8,
    reviews: 124
  },
  {
    id: "2",
    name: "Truffle Mushroom Risotto",
    description: "Creamy Arborio rice cooked with wild mushrooms and finished with truffle oil",
    price: 24.99,
    category: "Main Course",
    image: "https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=400&h=300&fit=crop",
    isAvailable: true,
    preparationTime: 25,
    isVegetarian: true,
    isSpicy: false,
    rating: 4.6,
    reviews: 89
  },
  {
    id: "3",
    name: "Spicy Thai Basil Chicken",
    description: "Authentic Thai stir-fry with fresh basil, chili, and jasmine rice",
    price: 22.99,
    category: "Main Course",
    image: "https://images.unsplash.com/photo-1559314809-0f31657def5e?w=400&h=300&fit=crop",
    isAvailable: true,
    preparationTime: 15,
    isVegetarian: false,
    isSpicy: true,
    rating: 4.7,
    reviews: 156
  },
  {
    id: "4",
    name: "Caesar Salad Supreme",
    description: "Crisp romaine lettuce, parmesan cheese, croutons with our signature dressing",
    price: 16.99,
    category: "Appetizers",
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop",
    isAvailable: true,
    preparationTime: 10,
    isVegetarian: true,
    isSpicy: false,
    rating: 4.4,
    reviews: 78
  },
  {
    id: "5",
    name: "Chocolate Lava Cake",
    description: "Warm chocolate cake with molten center, served with vanilla ice cream",
    price: 12.99,
    category: "Desserts",
    image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400&h=300&fit=crop",
    isAvailable: true,
    preparationTime: 15,
    isVegetarian: true,
    isSpicy: false,
    rating: 4.9,
    reviews: 203
  },
  {
    id: "6",
    name: "Fresh Mango Smoothie",
    description: "Tropical mango blended with yogurt and honey, topped with coconut flakes",
    price: 8.99,
    category: "Beverages",
    image: "https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=400&h=300&fit=crop",
    isAvailable: true,
    preparationTime: 5,
    isVegetarian: true,
    isSpicy: false,
    rating: 4.5,
    reviews: 67
  },
  {
    id: "7",
    name: "BBQ Chicken Wings",
    description: "Crispy chicken wings tossed in our signature BBQ sauce with celery sticks",
    price: 18.99,
    category: "Appetizers",
    image: "https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=400&h=300&fit=crop",
    isAvailable: true,
    preparationTime: 18,
    isVegetarian: false,
    isSpicy: true,
    rating: 4.5,
    reviews: 95
  },
  {
    id: "8",
    name: "Vanilla Bean Panna Cotta",
    description: "Silky smooth vanilla panna cotta topped with fresh berries and mint",
    price: 9.99,
    category: "Desserts",
    image: "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400&h=300&fit=crop",
    isAvailable: true,
    preparationTime: 5,
    isVegetarian: true,
    isSpicy: false,
    rating: 4.3,
    reviews: 52
  }
];

const categories = ["All", "Appetizers", "Main Course", "Desserts", "Beverages"];

export default function Menu() {
  // Get URL parameters for restaurant and table
  const params = useParams<{ restaurantId?: string; tableNumber?: string }>();
  const restaurantId = params.restaurantId || "default";
  const tableNumber = params.tableNumber || "1";

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch restaurant data
  const { data: restaurant } = useQuery<Restaurant>({
    queryKey: [`/api/restaurants/${restaurantId}`],
    enabled: !!restaurantId && restaurantId !== "default",
  });

  // Fetch menu items
  const { data: menuItems = mockMenuItems } = useQuery<MenuItem[]>({
    queryKey: [`/api/restaurants/${restaurantId}/menu`],
    enabled: !!restaurantId && restaurantId !== "default",
  });

  // Check QR code validity
  const { data: qrCode } = useQuery({
    queryKey: [`/api/qr-codes/${restaurantId}/${tableNumber}`],
    enabled: !!restaurantId && !!tableNumber && restaurantId !== "default",
  });

  // Show welcome message for QR scan
  useEffect(() => {
    if (restaurantId !== "default" && tableNumber) {
      toast({
        title: "Welcome! 🎉",
        description: `You've successfully scanned the QR code for Table ${tableNumber}. Browse our delicious menu below!`,
        duration: 5000,
      });
    }
  }, [restaurantId, tableNumber, toast]);

  // Filter menu items
  const filteredItems = menuItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
    return matchesSearch && matchesCategory && item.isAvailable;
  });

  // Cart functions
  const addToCart = (item: MenuItem) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(cartItem => cartItem.id === item.id);
      if (existingItem) {
        return prevCart.map(cartItem =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      }
      return [...prevCart, { ...item, quantity: 1 }];
    });
    toast({
      title: "Added to cart! 🛒",
      description: `${item.name} has been added to your cart.`,
    });
  };

  const removeFromCart = (itemId: string) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(cartItem => cartItem.id === itemId);
      if (existingItem && existingItem.quantity > 1) {
        return prevCart.map(cartItem =>
          cartItem.id === itemId
            ? { ...cartItem, quantity: cartItem.quantity - 1 }
            : cartItem
        );
      }
      return prevCart.filter(cartItem => cartItem.id !== itemId);
    });
  };

  const clearCart = () => {
    setCart([]);
    toast({
      title: "Cart cleared",
      description: "All items have been removed from your cart.",
    });
  };

  const toggleFavorite = (itemId: string) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(itemId)) {
        newFavorites.delete(itemId);
        toast({ title: "Removed from favorites ❤️" });
      } else {
        newFavorites.add(itemId);
        toast({ title: "Added to favorites! ❤️" });
      }
      return newFavorites;
    });
  };

  const getCartItemQuantity = (itemId: string) => {
    const item = cart.find(cartItem => cartItem.id === itemId);
    return item ? item.quantity : 0;
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const placeOrder = async () => {
    if (cart.length === 0) {
      toast({
        title: "Cart is empty",
        description: "Please add items to your cart before placing an order.",
        variant: "destructive"
      });
      return;
    }

    try {
      const orderData = {
        restaurantId: restaurantId,
        tableNumber: parseInt(tableNumber),
        items: cart.map(item => ({
          menuItemId: item.id,
          quantity: item.quantity,
          price: item.price,
          name: item.name
        })),
        totalAmount: getTotalPrice(),
        status: "pending" as const,
        customerNotes: ""
      };

      if (restaurantId !== "default") {
        await apiRequest("POST", "/api/orders", orderData);
      }
      
      toast({
        title: "Order placed successfully! 🎉",
        description: `Your order for $${getTotalPrice().toFixed(2)} has been placed. Estimated delivery time: 25-30 minutes.`,
      });
      setCart([]);
      setShowCart(false);
    } catch (error) {
      toast({
        title: "Order failed",
        description: "There was an error placing your order. Please try again.",
        variant: "destructive"
      });
    }
  };

  const restaurantName = restaurant?.name || "Delicious Bistro";

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50">
      {/* Mobile Header */}
      <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-lg border-b border-gray-200 shadow-lg">
        <div className="px-4 py-4">
          {/* Top Row - Restaurant Info */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <Button 
                variant="ghost" 
                size="sm" 
                className="p-2 hover:bg-orange-100 rounded-full"
                onClick={() => window.history.back()}
              >
                <ArrowLeft className="w-5 h-5 text-gray-700" />
              </Button>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                  🍽️ {restaurantName}
                </h1>
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-3 h-3 text-orange-500" />
                    <span>Table {tableNumber}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-3 h-3 text-green-500" />
                    <span>15-20 min</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                    <span>{restaurant?.rating || "4.6"}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" className="p-2 hover:bg-red-100 rounded-full relative">
                <Heart className={`w-5 h-5 ${favorites.size > 0 ? 'text-red-500 fill-red-500' : 'text-gray-600'}`} />
                {favorites.size > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                    {favorites.size}
                  </span>
                )}
              </Button>
              <Button variant="ghost" size="sm" className="p-2 hover:bg-blue-100 rounded-full">
                <Share2 className="w-5 h-5 text-gray-600" />
              </Button>
              <Button variant="ghost" size="sm" className="p-2 hover:bg-green-100 rounded-full">
                <Bell className="w-5 h-5 text-gray-600" />
              </Button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Search for delicious food..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-11 pr-4 py-3 bg-gray-50 border-gray-200 rounded-2xl focus:ring-2 focus:ring-orange-500 focus:border-transparent text-base"
            />
            {searchTerm && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSearchTerm("")}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 rounded-full"
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>

          {/* Category Pills & Controls */}
          <div className="flex items-center justify-between">
            <div className="flex space-x-2 overflow-x-auto pb-1 flex-1">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className={`whitespace-nowrap rounded-full px-5 py-2 text-sm font-medium transition-all duration-300 ${
                    selectedCategory === category
                      ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg transform scale-105'
                      : 'bg-white text-gray-600 border-gray-200 hover:bg-orange-50 hover:border-orange-200 hover:text-orange-600'
                  }`}
                >
                  {category}
                  {category !== "All" && (
                    <span className="ml-1 text-xs">
                      ({menuItems.filter(item => item.category === category).length})
                    </span>
                  )}
                </Button>
              ))}
            </div>
            <div className="flex items-center space-x-2 ml-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
                className="p-2 rounded-xl border-gray-200 hover:bg-gray-50"
              >
                {viewMode === "grid" ? <List className="w-4 h-4" /> : <Grid3X3 className="w-4 h-4" />}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="p-2 rounded-xl border-gray-200 hover:bg-gray-50"
              >
                <Filter className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="mt-4 p-4 bg-gray-50 rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-gray-700">Filters</h3>
                <Button variant="ghost" size="sm" onClick={() => setShowFilters(false)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm" className="rounded-full">
                  <Leaf className="w-3 h-3 mr-1 text-green-500" />
                  Vegetarian
                </Button>
                <Button variant="outline" size="sm" className="rounded-full">
                  <Flame className="w-3 h-3 mr-1 text-red-500" />
                  Spicy
                </Button>
                <Button variant="outline" size="sm" className="rounded-full">
                  <Timer className="w-3 h-3 mr-1 text-blue-500" />
                  Quick (≤15 min)
                </Button>
                <Button variant="outline" size="sm" className="rounded-full">
                  <Star className="w-3 h-3 mr-1 text-yellow-500" />
                  Top Rated
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Menu Items */}
      <div className="px-4 py-6">
        {/* Results Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">
              {selectedCategory === "All" ? "All Items" : selectedCategory}
            </h2>
            <p className="text-sm text-gray-600">
              {filteredItems.length} item{filteredItems.length !== 1 ? 's' : ''} available
            </p>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Truck className="w-4 h-4" />
            <span>Free delivery over $25</span>
          </div>
        </div>

        <div className={`grid gap-4 ${
          viewMode === "grid" 
            ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" 
            : "grid-cols-1"
        }`}>
          {filteredItems.map((item) => (
            <Card 
              key={item.id} 
              className="group overflow-hidden bg-white/90 backdrop-blur-sm border-0 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 rounded-3xl"
            >
              <CardContent className="p-0">
                {viewMode === "grid" ? (
                  <>
                    {/* Image */}
                    <div className="relative overflow-hidden h-52 bg-gradient-to-br from-gray-100 to-gray-200">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ChefHat className="w-12 h-12 text-gray-400" />
                        </div>
                      )}
                      
                      {/* Overlay Badges */}
                      <div className="absolute top-3 left-3 flex flex-col space-y-2">
                        {item.isVegetarian && (
                          <Badge className="bg-green-500/90 hover:bg-green-600 text-white px-3 py-1 text-xs rounded-full">
                            <Leaf className="w-3 h-3 mr-1" />
                            Veg
                          </Badge>
                        )}
                        {item.isSpicy && (
                          <Badge className="bg-red-500/90 hover:bg-red-600 text-white px-3 py-1 text-xs rounded-full">
                            <Flame className="w-3 h-3 mr-1" />
                            Spicy
                          </Badge>
                        )}
                      </div>

                      {/* Favorite Button */}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleFavorite(item.id)}
                        className="absolute top-3 right-3 bg-white/80 backdrop-blur-sm rounded-full p-2 hover:bg-white"
                      >
                        <Heart className={`w-4 h-4 ${favorites.has(item.id) ? 'text-red-500 fill-red-500' : 'text-gray-600'}`} />
                      </Button>

                      {/* Rating */}
                      {item.rating && (
                        <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-sm rounded-full px-3 py-1 flex items-center space-x-1">
                          <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                          <span className="text-xs text-white font-medium">{item.rating}</span>
                        </div>
                      )}

                      {/* Prep Time */}
                      <div className="absolute bottom-3 right-3 bg-orange-500/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center space-x-1">
                        <Timer className="w-3 h-3 text-white" />
                        <span className="text-xs text-white font-medium">{item.preparationTime}m</span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5">
                      <div className="mb-3">
                        <h3 className="font-bold text-gray-900 text-lg mb-2 line-clamp-1">
                          {item.name}
                        </h3>
                        <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed">
                          {item.description}
                        </p>
                      </div>

                      <div className="flex items-center justify-between mt-4">
                        <div className="flex flex-col">
                          <span className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                            ${item.price}
                          </span>
                          {item.reviews && (
                            <span className="text-xs text-gray-500 flex items-center">
                              <Star className="w-3 h-3 text-yellow-400 fill-yellow-400 mr-1" />
                              {item.reviews} reviews
                            </span>
                          )}
                        </div>

                        <div className="flex items-center space-x-2">
                          {getCartItemQuantity(item.id) > 0 ? (
                            <div className="flex items-center bg-orange-100 rounded-full border-2 border-orange-200">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => removeFromCart(item.id)}
                                className="w-9 h-9 p-0 rounded-full hover:bg-orange-200 text-orange-600"
                              >
                                <Minus className="w-4 h-4" />
                              </Button>
                              <span className="mx-3 font-bold text-orange-700 min-w-[24px] text-center text-lg">
                                {getCartItemQuantity(item.id)}
                              </span>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => addToCart(item)}
                                className="w-9 h-9 p-0 rounded-full hover:bg-orange-200 text-orange-600"
                              >
                                <Plus className="w-4 h-4" />
                              </Button>
                            </div>
                          ) : (
                            <Button
                              size="sm"
                              onClick={() => addToCart(item)}
                              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-6 py-2.5 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                            >
                              <Plus className="w-4 h-4 mr-2" />
                              Add
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  /* List View */
                  <div className="flex p-5 space-x-4">
                    <div className="relative w-28 h-28 rounded-2xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 flex-shrink-0">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ChefHat className="w-6 h-6 text-gray-400" />
                        </div>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleFavorite(item.id)}
                        className="absolute top-1 right-1 bg-white/80 rounded-full p-1"
                      >
                        <Heart className={`w-3 h-3 ${favorites.has(item.id) ? 'text-red-500 fill-red-500' : 'text-gray-600'}`} />
                      </Button>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h3 className="font-bold text-gray-900 text-base mb-1 line-clamp-1">
                            {item.name}
                          </h3>
                          <div className="flex items-center space-x-3 mb-2">
                            {item.isVegetarian && <Leaf className="w-3 h-3 text-green-500" />}
                            {item.isSpicy && <Flame className="w-3 h-3 text-red-500" />}
                            {item.rating && (
                              <div className="flex items-center space-x-1">
                                <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                                <span className="text-xs text-gray-600 font-medium">{item.rating}</span>
                              </div>
                            )}
                            <div className="flex items-center space-x-1">
                              <Timer className="w-3 h-3 text-gray-400" />
                              <span className="text-xs text-gray-500">{item.preparationTime}m</span>
                            </div>
                          </div>
                        </div>
                        <span className="text-xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                          ${item.price}
                        </span>
                      </div>
                      
                      <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                        {item.description}
                      </p>

                      <div className="flex items-center justify-between">
                        {item.reviews && (
                          <span className="text-xs text-gray-500">{item.reviews} reviews</span>
                        )}
                        
                        <div className="flex items-center space-x-2">
                          {getCartItemQuantity(item.id) > 0 ? (
                            <div className="flex items-center bg-orange-100 rounded-full">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => removeFromCart(item.id)}
                                className="w-8 h-8 p-0 rounded-full hover:bg-orange-200 text-orange-600"
                              >
                                <Minus className="w-3 h-3" />
                              </Button>
                              <span className="mx-2 font-bold text-orange-700 text-sm min-w-[20px] text-center">
                                {getCartItemQuantity(item.id)}
                              </span>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => addToCart(item)}
                                className="w-8 h-8 p-0 rounded-full hover:bg-orange-200 text-orange-600"
                              >
                                <Plus className="w-3 h-3" />
                              </Button>
                            </div>
                          ) : (
                            <Button
                              size="sm"
                              onClick={() => addToCart(item)}
                              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-4 py-2 rounded-full text-sm"
                            >
                              <Plus className="w-3 h-3 mr-1" />
                              Add
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-16">
            <ChefHat className="w-20 h-20 text-gray-300 mx-auto mb-6" />
            <h3 className="text-xl font-semibold text-gray-500 mb-2">No items found</h3>
            <p className="text-gray-400 mb-4">Try adjusting your search or category filter</p>
            <Button 
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("All");
              }}
              className="bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full px-6"
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>

      {/* Cart Modal */}
      {showCart && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm">
          <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl max-h-[80vh] overflow-hidden">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Your Cart</h2>
                <Button variant="ghost" onClick={() => setShowCart(false)}>
                  <X className="w-6 h-6" />
                </Button>
              </div>
              
              <div className="space-y-4 max-h-[40vh] overflow-y-auto">
                {cart.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-2xl">
                    <img
                      src={item.image || ""}
                      alt={item.name}
                      className="w-16 h-16 rounded-xl object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{item.name}</h3>
                      <p className="text-gray-600 text-sm">${item.price}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => removeFromCart(item.id)}
                        className="w-8 h-8 p-0 rounded-full"
                      >
                        <Minus className="w-3 h-3" />
                      </Button>
                      <span className="font-semibold min-w-[30px] text-center">{item.quantity}</span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => addToCart(item)}
                        className="w-8 h-8 p-0 rounded-full"
                      >
                        <Plus className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xl font-bold">Total:</span>
                  <span className="text-2xl font-bold text-orange-600">${getTotalPrice().toFixed(2)}</span>
                </div>
                <div className="flex space-x-3">
                  <Button variant="outline" onClick={clearCart} className="flex-1">
                    Clear Cart
                  </Button>
                  <Button onClick={placeOrder} className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 text-white">
                    Place Order
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating Cart Button */}
      {getTotalItems() > 0 && (
        <div className="fixed bottom-6 left-4 right-4 z-40">
          <Button 
            onClick={() => setShowCart(true)}
            className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white py-5 rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 border-2 border-white"
          >
            <div className="flex items-center justify-between w-full px-4">
              <div className="flex items-center space-x-4">
                <div className="bg-white/20 rounded-full p-3">
                  <ShoppingCart className="w-6 h-6" />
                </div>
                <div className="text-left">
                  <div className="font-bold text-lg">View Cart</div>
                  <div className="text-sm text-white/80">{getTotalItems()} items added</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-xl">${getTotalPrice().toFixed(2)}</div>
                <div className="text-sm text-white/80">Total Amount</div>
              </div>
            </div>
          </Button>
        </div>
      )}

      {/* Bottom Spacing */}
      <div className="h-32"></div>
    </div>
  );
}

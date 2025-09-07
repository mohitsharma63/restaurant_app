import { useState, useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import Navigation from "@/components/navigation";
import {
  Search,
  Plus,
  Minus,
  Heart,
  Star,
  Clock,
  MapPin,
  ArrowLeft,
  Grid3X3,
  List,
  Filter,
  Leaf,
  TrendingUp,
  ChefHat,
  ShoppingCart,
  Eye,
  Info,
  Share2,
  Bell,
  MoreHorizontal,
  X
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
  isPopular?: boolean;
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
    reviews: 124,
    isPopular: true
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
    reviews: 156,
    isPopular: true
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
    reviews: 203,
    isPopular: true
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

const categories = [
  "All", 
  "Appetizers", 
  "Main Course", 
  "Desserts", 
  "Beverages", 
  "Soups", 
  "Salads", 
  "Seafood",
  "Vegetarian",
  "Pizza",
  "Pasta"
];

// Mock API request function
const apiRequest = async (method: string, url: string, data?: any) => {
  console.log(`API Request: ${method} ${url}`, data);
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  // Simulate a successful response
  return { status: 200, data: {} };
};

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
  const [activeFilters, setActiveFilters] = useState<Set<string>>(new Set());
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("restaurant-cart");
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  // Save cart to localStorage and dispatch custom event
  useEffect(() => {
    localStorage.setItem("restaurant-cart", JSON.stringify(cart));
    window.dispatchEvent(new Event('cartUpdated'));
  }, [cart]);

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

    // Advanced filters
    const matchesFilters = Array.from(activeFilters).every(filter => {
      switch (filter) {
        case "vegetarian": return item.isVegetarian;
        case "spicy": return item.isSpicy;
        case "quick": return item.preparationTime <= 15;
        case "topRated": return (item.rating || 0) >= 4.5;
        case "popular": return item.isPopular;
        default: return true;
      }
    });

    return matchesSearch && matchesCategory && matchesFilters && item.isAvailable;
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

  const toggleFilter = (filter: string) => {
    setActiveFilters(prev => {
      const newFilters = new Set(prev);
      if (newFilters.has(filter)) {
        newFilters.delete(filter);
      } else {
        newFilters.add(filter);
      }
      return newFilters;
    });
  };

  const getItemQuantity = (itemId: string) => {
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
  const cartCount = getTotalItems();

  // Mobile Card Component
  const MobileMenuCard = ({ item }: { item: MenuItem }) => (
    <Card className="group overflow-hidden bg-white shadow-sm hover:shadow-md transition-all duration-300 rounded-2xl mb-4">
      <CardContent className="p-0">
        <div className="relative">
          {/* Image */}
          <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden rounded-t-2xl">
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

            {/* Top Badges */}
            <div className="absolute top-2 left-2 flex flex-wrap gap-1.5">
              {item.isPopular && (
                <Badge className="bg-red-500/90 text-white px-1.5 py-0.5 text-xs rounded-full backdrop-blur-sm">
                  Popular
                </Badge>
              )}
              {item.isVegetarian && (
                <Badge className="bg-green-500/90 text-white px-1.5 py-0.5 text-xs rounded-full backdrop-blur-sm">
                  Veg
                </Badge>
              )}
              {item.isSpicy && (
                <Badge className="bg-orange-500/90 text-white px-1.5 py-0.5 text-xs rounded-full backdrop-blur-sm">
                  Spicy
                </Badge>
              )}
            </div>

            {/* Favorite Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => toggleFavorite(item.id)}
              className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm rounded-full p-1.5 hover:bg-white shadow-md"
            >
              <Heart className={`w-4 h-4 ${favorites.has(item.id) ? 'text-red-500 fill-red-500' : 'text-gray-600'}`} />
            </Button>

            {/* Bottom Info */}
            <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-white">
              <div className="flex items-center space-x-2">
                {item.rating && (
                  <div className="flex items-center space-x-0.5 bg-black/30 rounded-full px-1.5 py-0.5">
                    <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                    <span className="text-xs font-medium">{item.rating}</span>
                  </div>
                )}
                <div className="flex items-center space-x-0.5 bg-black/30 rounded-full px-1.5 py-0.5">
                  <Clock className="w-3 h-3" />
                  <span className="text-xs font-medium">{item.preparationTime}m</span>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-4">
            <div className="mb-3">
              <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-1">
                {item.name}
              </h3>
              <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed">
                {item.description}
              </p>
            </div>

            {/* Price & Add Button */}
            <div className="flex items-center justify-between">
              <div className="flex items-baseline space-x-1">
                <span className="text-xl font-bold text-gray-900">${item.price}</span>
              </div>

              <div className="flex items-center space-x-2">
                {getItemQuantity(item.id) > 0 ? (
                  <div className="flex items-center space-x-2 bg-orange-50 rounded-full px-3 py-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFromCart(item.id)}
                      className="w-6 h-6 p-0 rounded-full bg-orange-100 text-orange-600 hover:bg-orange-200"
                    >
                      <Minus className="w-3 h-3" />
                    </Button>
                    <span className="text-sm font-semibold text-orange-600 min-w-[16px] text-center">
                      {getItemQuantity(item.id)}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => addToCart(item)}
                      className="w-6 h-6 p-0 rounded-full bg-orange-500 text-white hover:bg-orange-600"
                    >
                      <Plus className="w-3 h-3" />
                    </Button>
                  </div>
                ) : (
                  <Button
                    onClick={() => addToCart(item)}
                    size="sm"
                    className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-full text-sm"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      

      {/* Menu Content */}
      <div className="flex-1 px-4 py-4 pb-20">
        {/* Search Bar */}
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Search dishes, ingredients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-3 w-full rounded-2xl border-gray-200 focus:border-orange-500 focus:ring-orange-500"
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
        </div>

        {/* Category Filter Bar */}
        <div className="mb-6">
          <div className="flex items-center space-x-3 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map((category) => {
              const categoryCount = mockMenuItems.filter(item => 
                category === "All" || item.category === category
              ).length;
              
              return (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category)}
                  className={`
                    flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300
                    ${selectedCategory === category 
                      ? 'bg-orange-500 text-white shadow-md hover:bg-orange-600' 
                      : 'bg-white text-gray-600 border-gray-200 hover:bg-orange-50 hover:text-orange-600 hover:border-orange-200'
                    }
                  `}
                >
                  <span>{category}</span>
                  <Badge 
                    variant="secondary" 
                    className={`
                      ml-2 px-1.5 py-0.5 text-xs
                      ${selectedCategory === category 
                        ? 'bg-white/20 text-white' 
                        : 'bg-gray-100 text-gray-500'
                      }
                    `}
                  >
                    {categoryCount}
                  </Badge>
                </Button>
              );
            })}
          </div>
        </div>

        {/* Advanced Filters */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-gray-700">Quick Filters</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="text-orange-600 hover:text-orange-700"
            >
              <Filter className="w-4 h-4 mr-1" />
              {showFilters ? 'Hide' : 'More'}
            </Button>
          </div>
          
          <div className="flex items-center space-x-2 overflow-x-auto pb-2">
            {[
              { key: 'vegetarian', label: 'Vegetarian', icon: Leaf },
              { key: 'spicy', label: 'Spicy', icon: TrendingUp },
              { key: 'quick', label: 'Quick (≤15min)', icon: Clock },
              { key: 'topRated', label: 'Top Rated', icon: Star },
              { key: 'popular', label: 'Popular', icon: TrendingUp }
            ].map(filter => (
              <Button
                key={filter.key}
                variant={activeFilters.has(filter.key) ? "default" : "outline"}
                size="sm"
                onClick={() => toggleFilter(filter.key)}
                className={`
                  flex-shrink-0 rounded-full text-xs transition-all duration-300
                  ${activeFilters.has(filter.key)
                    ? 'bg-orange-500 text-white hover:bg-orange-600'
                    : 'bg-white text-gray-600 border-gray-200 hover:bg-orange-50 hover:text-orange-600'
                  }
                `}
              >
                <filter.icon className="w-3 h-3 mr-1" />
                {filter.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Section Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                {selectedCategory === "All" ? "All Items" : selectedCategory}
              </h2>
              <p className="text-sm text-gray-500">
                {filteredItems.length} item{filteredItems.length !== 1 ? 's' : ''} 
                {searchTerm && ` matching "${searchTerm}"`}
                {activeFilters.size > 0 && ` with ${activeFilters.size} filter${activeFilters.size !== 1 ? 's' : ''}`}
              </p>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <ShoppingCart className="w-4 h-4" />
              <span>Free delivery over $25</span>
            </div>
          </div>
        </div>
        {/* Menu Items Grid */}
        <div className="space-y-0">
          {filteredItems.map((item) => (
            <MobileMenuCard key={item.id} item={item} />
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-16">
            <ChefHat className="w-20 h-20 text-gray-300 mx-auto mb-6" />
            <h3 className="text-xl font-semibold text-gray-500 mb-2">No items found</h3>
            <p className="text-gray-400 mb-4">
              {searchTerm 
                ? `No items match "${searchTerm}"` 
                : "Try adjusting your search or filters"
              }
            </p>
            <div className="space-y-2">
              {(searchTerm || activeFilters.size > 0 || selectedCategory !== "All") && (
                <Button
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedCategory("All");
                    setActiveFilters(new Set());
                  }}
                  className="bg-orange-500 hover:bg-orange-600 text-white rounded-full px-6 py-3 mr-2"
                >
                  Clear All Filters
                </Button>
              )}
              <Button
                onClick={() => setSelectedCategory("All")}
                variant="outline"
                className="rounded-full px-6 py-3"
              >
                View All Items
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Cart Modal */}
      {showCart && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm">
          <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl max-h-[85vh] overflow-hidden">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Your Cart</h2>
                <Button variant="ghost" onClick={() => setShowCart(false)} className="p-2 rounded-full">
                  <X className="w-6 h-6" />
                </Button>
              </div>

              <div className="space-y-4 max-h-[45vh] overflow-y-auto">
                {cart.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-3xl">
                    <div className="w-16 h-16 rounded-2xl overflow-hidden bg-gray-200 flex-shrink-0">
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
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 text-sm line-clamp-1">{item.name}</h3>
                      <p className="text-gray-600 text-sm">${item.price}</p>
                      <p className="text-xs text-gray-500">${(item.price * item.quantity).toFixed(2)} total</p>
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
                      <span className="font-semibold min-w-[30px] text-center text-lg">{item.quantity}</span>
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
                  <div>
                    <span className="text-lg font-semibold text-gray-600">Total ({getTotalItems()} items):</span>
                    <p className="text-xs text-gray-500">Including taxes & fees</p>
                  </div>
                  <span className="text-3xl font-bold text-orange-600">${getTotalPrice().toFixed(2)}</span>
                </div>
                <div className="flex space-x-3">
                  <Button
                    variant="outline"
                    onClick={clearCart}
                    className="flex-1 rounded-2xl py-3"
                    disabled={cart.length === 0}
                  >
                    Clear Cart
                  </Button>
                  <Button
                    onClick={placeOrder}
                    className="flex-1 bg-orange-500 hover:bg-orange-600 text-white rounded-2xl py-3 font-semibold"
                    disabled={cart.length === 0}
                  >
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
            className="w-full bg-orange-500 hover:bg-orange-600 text-white py-4 rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 border-2 border-white"
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

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { 
  ShoppingCart, 
  Search, 
  Plus, 
  Minus, 
  Filter,
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
  Sparkles
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
  specialInstructions?: string;
}

// Enhanced static menu data
const menuItems: MenuItem[] = [
  {
    id: "1",
    name: "Truffle Risotto",
    description: "Creamy arborio rice with wild mushrooms, black truffle, and aged parmesan",
    price: 28.99,
    category: "mains",
    isAvailable: true,
    preparationTime: 25,
    isVegetarian: true,
    rating: 4.8,
    reviews: 156,
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop"
  },
  {
    id: "2",
    name: "Grilled Atlantic Salmon",
    description: "Fresh salmon fillet with lemon herb butter, seasonal vegetables, and quinoa",
    price: 32.50,
    category: "mains",
    isAvailable: true,
    preparationTime: 20,
    rating: 4.7,
    reviews: 203,
    image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&h=300&fit=crop"
  },
  {
    id: "3",
    name: "Wagyu Beef Burger",
    description: "Premium wagyu patty, truffle aioli, caramelized onions, artisan bun",
    price: 24.99,
    category: "mains",
    isAvailable: true,
    preparationTime: 18,
    isSpicy: true,
    rating: 4.9,
    reviews: 342,
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop"
  },
  {
    id: "4",
    name: "Chocolate Lava Cake",
    description: "Warm chocolate cake with molten center, vanilla ice cream, berry compote",
    price: 12.99,
    category: "desserts",
    isAvailable: true,
    preparationTime: 15,
    isVegetarian: true,
    rating: 4.6,
    reviews: 89,
    image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400&h=300&fit=crop"
  },
  {
    id: "5",
    name: "Craft Beer Selection",
    description: "Local IPA, wheat beer, or seasonal special - ask your server",
    price: 8.50,
    category: "drinks",
    isAvailable: true,
    preparationTime: 2,
    rating: 4.4,
    reviews: 124,
    image: "https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=400&h=300&fit=crop"
  },
  {
    id: "6",
    name: "Mediterranean Mezze",
    description: "Hummus, tapenade, olives, feta, fresh bread, olive oil selection",
    price: 18.99,
    category: "appetizers",
    isAvailable: true,
    preparationTime: 10,
    isVegetarian: true,
    rating: 4.5,
    reviews: 67,
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=400&h=300&fit=crop"
  }
];

const categories = [
  { id: "all", name: "All Items", icon: Grid3X3 },
  { id: "appetizers", name: "Appetizers", icon: Sparkles },
  { id: "mains", name: "Main Course", icon: Star },
  { id: "desserts", name: "Desserts", icon: Heart },
  { id: "drinks", name: "Beverages", icon: Star }
];

export default function Menu() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showCart, setShowCart] = useState(false);
  const { toast } = useToast();
  const isMobile = useIsMobile();

  // Load cart from localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem("restaurant-cart");
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  // Save cart to localStorage
  useEffect(() => {
    localStorage.setItem("restaurant-cart", JSON.stringify(cart));
  }, [cart]);

  const filteredItems = menuItems.filter(item => {
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch && item.isAvailable;
  });

  const addToCart = (item: MenuItem) => {
    setCart(prev => {
      const existingItem = prev.find(cartItem => cartItem.id === item.id);
      if (existingItem) {
        return prev.map(cartItem =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
    
    toast({
      title: "Added to cart",
      description: `${item.name} has been added to your cart`,
    });
  };

  const updateQuantity = (id: string, change: number) => {
    setCart(prev => {
      return prev.map(item => {
        if (item.id === id) {
          const newQuantity = Math.max(0, item.quantity + change);
          return newQuantity === 0 ? null : { ...item, quantity: newQuantity };
        }
        return item;
      }).filter(Boolean) as CartItem[];
    });
  };

  const getTotalItems = () => cart.reduce((sum, item) => sum + item.quantity, 0);
  const getTotalPrice = () => cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="sm" className="p-2">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-lg font-bold text-gray-900">Delicious Bistro</h1>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <MapPin className="w-3 h-3" />
                <span>Table 5</span>
                <Clock className="w-3 h-3 ml-2" />
                <span>15-20 min</span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" className="p-2">
              <Share2 className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="sm" className="p-2">
              <Heart className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="px-4 pb-4 space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search menu items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-gray-50 border-gray-200"
            />
          </div>
          
          {/* Category Pills */}
          <div className="flex overflow-x-auto space-x-2 pb-2">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
                className="whitespace-nowrap flex items-center space-x-1"
              >
                <category.icon className="w-3 h-3" />
                <span>{category.name}</span>
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="p-4 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems.map((item) => {
            const cartItem = cart.find(c => c.id === item.id);
            const quantity = cartItem?.quantity || 0;

            return (
              <Card key={item.id} className="overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow">
                <div className="relative">
                  <div className="aspect-video bg-gradient-to-br from-orange-100 to-red-100 flex items-center justify-center">
                    {item.image ? (
                      <img 
                        src={item.image} 
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-gray-400 text-center">
                        <Star className="w-8 h-8 mx-auto mb-1" />
                        <span className="text-sm">Delicious</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Badges */}
                  <div className="absolute top-2 left-2 flex space-x-1">
                    {item.isVegetarian && (
                      <Badge className="bg-green-100 text-green-700 text-xs">
                        Veg
                      </Badge>
                    )}
                    {item.isSpicy && (
                      <Badge className="bg-red-100 text-red-700 text-xs">
                        Spicy
                      </Badge>
                    )}
                  </div>

                  {/* Rating */}
                  {item.rating && (
                    <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center space-x-1">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-xs font-medium">{item.rating}</span>
                    </div>
                  )}
                </div>

                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-gray-900 text-sm line-clamp-1">
                      {item.name}
                    </h3>
                    <div className="text-right">
                      <div className="text-lg font-bold text-gray-900">
                        ${item.price}
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-xs text-gray-600 mb-3 line-clamp-2">
                    {item.description}
                  </p>

                  <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>{item.preparationTime} min</span>
                    </div>
                    {item.reviews && (
                      <span>({item.reviews} reviews)</span>
                    )}
                  </div>

                  {/* Add to Cart Controls */}
                  {quantity === 0 ? (
                    <Button
                      onClick={() => addToCart(item)}
                      className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                      size="sm"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Add to Cart
                    </Button>
                  ) : (
                    <div className="flex items-center justify-between bg-orange-50 rounded-lg p-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => updateQuantity(item.id, -1)}
                        className="p-1 h-8 w-8 text-orange-600 hover:bg-orange-100"
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                      <span className="font-semibold text-orange-700 px-3">
                        {quantity}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => updateQuantity(item.id, 1)}
                        className="p-1 h-8 w-8 text-orange-600 hover:bg-orange-100"
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="w-12 h-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No items found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>

      {/* Floating Cart Button */}
      {cart.length > 0 && (
        <div className="fixed bottom-4 left-4 right-4 z-50">
          <Button
            onClick={() => setShowCart(true)}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white py-4 rounded-xl shadow-lg flex items-center justify-between"
          >
            <div className="flex items-center space-x-2">
              <div className="bg-white/20 rounded-full p-1">
                <ShoppingCart className="w-5 h-5" />
              </div>
              <span className="font-semibold">
                {getTotalItems()} item{getTotalItems() !== 1 ? 's' : ''}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-lg">
                ${getTotalPrice().toFixed(2)}
              </span>
              <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                <Plus className="w-4 h-4" />
              </div>
            </div>
          </Button>
        </div>
      )}

      {/* Restaurant Info Footer */}
      <div className="bg-white border-t border-gray-200 p-4 mt-8">
        <div className="text-center space-y-2">
          <h3 className="font-semibold text-gray-900">Delicious Bistro</h3>
          <div className="flex justify-center items-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center space-x-1">
              <Phone className="w-4 h-4" />
              <span>(555) 123-4567</span>
            </div>
            <div className="flex items-center space-x-1">
              <Wifi className="w-4 h-4" />
              <span>Free WiFi</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

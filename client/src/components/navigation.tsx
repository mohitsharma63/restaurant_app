import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLocation, Link } from "wouter";
import { useIsMobile } from "@/hooks/use-mobile";
import { 
  Menu, 
  X, 
  Home, 
  UtensilsCrossed, 
  ShoppingCart, 
  Clock,
  MapPin,
  Phone,
  Star,
  Wifi,
  CreditCard,
  Users,
  Heart,
  Share2,
  QrCode,
  ChevronDown,
  Utensils // Imported Utensils icon
} from "lucide-react";

// Define CartItem type for better type safety
type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
};

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [location, setLocation] = useLocation();
  const isMobile = useIsMobile();

  // Helper function to get total items in cart
  const getTotalItems = () => {
    const savedCart = localStorage.getItem("restaurant-cart");
    if (savedCart) {
      const cart = JSON.parse(savedCart) as CartItem[];
      return cart.reduce((sum: number, item: CartItem) => sum + item.quantity, 0);
    }
    return 0;
  };

  // Update cart count from localStorage
  useEffect(() => {
    const updateCartCount = () => {
      setCartCount(getTotalItems());
    };

    updateCartCount();

    // Listen for cart updates
    const handleStorageChange = () => updateCartCount();
    window.addEventListener("storage", handleStorageChange);

    // Also listen for custom cart update events
    window.addEventListener("cartUpdated", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("cartUpdated", handleStorageChange);
    };
  }, []);

  const navigationItems = [
    { 
      icon: Home, 
      label: "Home", 
      path: "/", 
      description: "Welcome page",
      color: "text-orange-500"
    },
    { 
      icon: UtensilsCrossed, 
      label: "Digital Menu", 
      path: "/menu", 
      description: "Browse delicious items",
      color: "text-green-500"
    },
    { 
      icon: ShoppingCart, 
      label: "My Cart", 
      path: "/cart", 
      description: "View your orders",
      color: "text-blue-500",
      badge: cartCount > 0 ? cartCount : undefined
    },
    { 
      icon: Clock, 
      label: "Order Status", 
      path: "/order-status", 
      description: "Track your orders",
      color: "text-purple-500"
    }
  ];

  const quickActions = [
    { label: "Call Restaurant", icon: Phone, action: () => window.open("tel:+15551234567") },
    { label: "Table Location", icon: MapPin, action: () => {} },
    { label: "WiFi Password", icon: Wifi, action: () => {} },
    { label: "Share Menu", icon: Share2, action: () => {} }
  ];

  const restaurantInfo = {
    name: "Delicious Bistro",
    rating: 4.7,
    reviews: 1248,
    table: "Table 5",
    status: "Open until 11:00 PM"
  };

  // Function to generate dynamic paths based on current location
  function getCurrentPath(basePath: string) {
    // Extract restaurant and table from current location if available
    const pathParts = location.split('/');
    // Check if the current path has the expected structure for restaurant/table
    if (pathParts.length >= 4 && (pathParts[1] === 'menu' || pathParts[1] === 'cart' || pathParts[1] === 'order-status')) {
      const restaurantId = pathParts[2];
      const tableNumber = pathParts[3];
      return `${basePath}/${restaurantId}/${tableNumber}`;
    }
    // Fallback to base path if structure is not as expected
    return basePath;
  }

  // Modified menuItems to use dynamic paths
  const menuItems = [
    { 
      id: 'home',
      label: 'Home', 
      icon: Home,
      path: '/',
      isActive: location === '/',
      description: 'Welcome page',
      color: 'text-orange-500'
    },
    { 
      id: 'menu', 
      label: 'Digital Menu', 
      icon: Utensils,
      path: getCurrentPath('/menu'),
      isActive: location.includes('/menu'),
      description: 'Browse delicious items',
      color: 'text-green-500'
    },
    { 
      id: 'cart', 
      label: 'My Cart', 
      icon: ShoppingCart,
      path: getCurrentPath('/cart'),
      isActive: location.includes('/cart'),
      badge: cartCount,
      description: 'View your orders',
      color: 'text-blue-500'
    },
    { 
      id: 'orders', 
      label: 'Order Status', 
      icon: Clock,
      path: '/order-status/ORD-2024-001',
      isActive: location.includes('/order-status'),
      description: 'Track your orders',
      color: 'text-purple-500'
    }
  ];

  return (
    <>
      {/* Mobile Header */}
      {isMobile && (
        <div className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
          <div className="px-4 py-3">
            {/* Top Row */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="p-1.5 hover:bg-gray-100 rounded-lg"
                >
                  {isMenuOpen ? <X className="w-5 h-5 text-gray-800" /> : <Menu className="w-5 h-5 text-gray-800" />}
                </Button>
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg">
                    <UtensilsCrossed className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h1 className="font-bold text-gray-900 text-base">{restaurantInfo.name}</h1>
                    <div className="flex items-center space-x-2 text-xs text-gray-500">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                      <span>Table 5 • Live</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setLocation("/cart")}
                  className="relative p-2 hover:bg-gray-100 rounded-xl"
                >
                  <ShoppingCart className="w-5 h-5 text-gray-700" />
                  {cartCount > 0 && (
                    <div className="absolute -top-1 -right-1 h-5 w-5 bg-orange-500 text-white text-xs rounded-full flex items-center justify-center font-bold shadow-lg">
                      {cartCount}
                    </div>
                  )}
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="p-2 hover:bg-gray-100 rounded-xl"
                >
                  <Heart className="w-5 h-5 text-gray-700" />
                </Button>
              </div>
            </div>

            {/* Status Row */}
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center space-x-4 text-gray-600">
                <div className="flex items-center space-x-1">
                  <Clock className="w-3 h-3 text-green-500" />
                  <span>Open until 11:00 PM</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                  <span>4.6 (1.2k reviews)</span>
                </div>
              </div>
              {cartCount > 0 && (
                <div className="text-orange-600 font-medium">
                  {cartCount} items in cart
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Desktop Header */}
      {!isMobile && (
        <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-8">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                    <UtensilsCrossed className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h1 className="font-bold text-gray-900">{restaurantInfo.name}</h1>
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      <span>{restaurantInfo.rating} ({restaurantInfo.reviews} reviews)</span>
                    </div>
                  </div>
                </div>

                {/* Desktop Navigation Items */}
                <nav className="hidden md:flex items-center space-x-1">
                  {navigationItems.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        location === item.path
                          ? 'bg-orange-100 text-orange-700'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                      }`}
                    >
                      <item.icon className={`w-4 h-4 ${item.color}`} />
                      <span>{item.label}</span>
                      {item.badge && item.badge > 0 && (
                        <Badge className="bg-orange-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                          {item.badge}
                        </Badge>
                      )}
                    </Link>
                  ))}
                </nav>
              </div>

              {/* Desktop Actions */}
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span>{restaurantInfo.table} • {restaurantInfo.status}</span>
                </div>

                <div className="flex items-center space-x-2">
                  {quickActions.map((action, index) => (
                    <Button
                      key={index}
                      variant="ghost"
                      size="sm"
                      onClick={action.action}
                      className="text-gray-600 hover:text-gray-900"
                    >
                      <action.icon className="w-4 h-4" />
                    </Button>
                  ))}
                </div>

                <Button
                  onClick={() => setLocation("/cart")}
                  className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-4 py-2 rounded-lg shadow-lg relative"
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  My Cart
                  {cartCount > 0 && (
                    <Badge className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                      {cartCount}
                    </Badge>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Slide Menu */}
      {isMobile && (
        <>
          {/* Overlay */}
          {isMenuOpen && (
            <div 
              className="fixed inset-0 bg-black/50 z-40 transition-opacity duration-300"
              onClick={() => setIsMenuOpen(false)}
            />
          )}

          <div className={`fixed inset-y-0 left-0 transform ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'} w-80 bg-white shadow-2xl transition duration-300 ease-in-out z-50`}>
            <div className="flex flex-col h-full">
              {/* Menu Header */}
              <div className="bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 p-6 text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold">Digital Menu</h2>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsMenuOpen(false)}
                      className="text-white hover:bg-white/20 p-2 rounded-full"
                    >
                      <X className="w-5 h-5" />
                    </Button>
                  </div>

                  <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 border border-white/30">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-10 h-10 bg-white/30 rounded-xl flex items-center justify-center">
                        <MapPin className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="font-semibold text-white">Table 5</div>
                        <div className="text-white/80 text-sm">Active Session</div>
                      </div>
                      <div className="ml-auto">
                        <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm text-white/90">
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4" />
                        <span>Open until 11:00 PM</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Star className="w-4 h-4 text-yellow-300 fill-yellow-300" />
                        <span>4.6</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Cart Summary Section */}
              {cartCount > 0 && (
                <div className="mx-4 mb-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl p-4 border border-orange-200">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                      <ShoppingCart className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 text-lg">Your Cart</h3>
                      <p className="text-sm text-gray-600">{cartCount} items • Ready in 20-25 min</p>
                    </div>
                    <div className="bg-orange-500 text-white text-sm font-bold px-3 py-1 rounded-full">
                      {cartCount}
                    </div>
                  </div>

                  <div
                    onClick={() => {
                      setLocation("/cart");
                      setIsMenuOpen(false);
                    }}
                    className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-xl py-3 font-semibold shadow-lg cursor-pointer transition-all"
                  >
                    <div className="flex items-center justify-between w-full px-4">
                      <div className="flex items-center space-x-2">
                        <ShoppingCart className="w-5 h-5" />
                        <span>View Cart</span>
                      </div>
                      <span className="bg-white/20 px-2 py-1 rounded-lg text-sm">
                        {cartCount} items
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Main Navigation */}
              <div className="flex-1 overflow-y-auto p-4">
                <div className="space-y-3 mb-6">
                  {menuItems.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => {
                        setLocation(item.path);
                        setIsMenuOpen(false);
                      }}
                      className={`relative flex items-center p-4 rounded-xl transition-all duration-300 cursor-pointer ${
                        item.isActive
                          ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg' 
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <div className={`w-12 h-12 rounded-xl mr-4 flex items-center justify-center transition-all duration-200 ${
                        item.isActive 
                          ? 'bg-white/20' 
                          : 'bg-gray-100'
                      }`}>
                        <item.icon className={`w-6 h-6 ${
                          item.isActive 
                            ? 'text-white' 
                            : item.color
                        } transition-transform hover:scale-110`} />
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-lg">{item.label}</div>
                        <div className={`text-sm ${
                          item.isActive 
                            ? 'text-white/80' 
                            : 'text-gray-500'
                        }`}>
                          {item.description}
                        </div>
                      </div>
                      {item.badge && item.badge > 0 && (
                        <div className={`px-3 py-1 rounded-full text-sm font-bold ${
                          item.isActive 
                            ? 'bg-white text-orange-500' 
                            : 'bg-orange-500 text-white'
                        }`}>
                          {item.badge}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Digital Menu Features */}
                <div className="border-t border-gray-200 pt-4 mb-6">
                  <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
                    Digital Menu Features
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <Phone className="w-4 h-4 text-green-600" />
                      </div>
                      <div>
                        <div className="font-medium text-sm text-gray-900">Contactless Ordering</div>
                        <div className="text-xs text-gray-600">Order directly from your phone</div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <Clock className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <div className="font-medium text-sm text-gray-900">Real-time Updates</div>
                        <div className="text-xs text-gray-600">Live order tracking</div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
                      <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                        <CreditCard className="w-4 h-4 text-purple-600" />
                      </div>
                      <div>
                        <div className="font-medium text-sm text-gray-900">Easy Payment</div>
                        <div className="text-xs text-gray-600">Multiple payment options</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="border-t border-gray-200 pt-4 mb-6">
                  <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
                    Quick Actions
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div 
                      onClick={() => window.open("tel:+15551234567")}
                      className="flex flex-col items-center justify-center h-20 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                    >
                      <Phone className="w-5 h-5 mb-1 text-green-600" />
                      <span className="text-xs font-medium">Call</span>
                    </div>
                    <div className="flex flex-col items-center justify-center h-20 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                      <Share2 className="w-5 h-5 mb-1 text-blue-600" />
                      <span className="text-xs font-medium">Share</span>
                    </div>
                    <div className="flex flex-col items-center justify-center h-20 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                      <Heart className="w-5 h-5 mb-1 text-red-600" />
                      <span className="text-xs font-medium">Favorite</span>
                    </div>
                    <div className="flex flex-col items-center justify-center h-20 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                      <Wifi className="w-5 h-5 mb-1 text-purple-600" />
                      <span className="text-xs font-medium">WiFi</span>
                    </div>
                  </div>
                </div>

                {/* Restaurant Features */}
                <div className="border-t border-gray-200 pt-4">
                  <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
                    Restaurant Features
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center space-x-2 text-sm text-gray-600 p-2 bg-gray-50 rounded-lg">
                      <Wifi className="w-4 h-4 text-green-500" />
                      <span>Free WiFi</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600 p-2 bg-gray-50 rounded-lg">
                      <CreditCard className="w-4 h-4 text-blue-500" />
                      <span>All Cards</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600 p-2 bg-gray-50 rounded-lg">
                      <Users className="w-4 h-4 text-purple-500" />
                      <span>Family Friendly</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600 p-2 bg-gray-50 rounded-lg">
                      <QrCode className="w-4 h-4 text-orange-500" />
                      <span>QR Menu</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Menu Footer */}
              <div className="p-4 border-t border-gray-200 bg-gray-50">
                <div className="space-y-3">
                  <div 
                    onClick={() => window.open("tel:+15551234567")}
                    className="w-full flex items-center justify-center py-2 px-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                  >
                    <Phone className="w-4 h-4 mr-2" />
                    <span className="font-medium">Call Restaurant</span>
                  </div>
                  <div className="text-center text-xs text-gray-500">
                    Need help? Contact us anytime
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
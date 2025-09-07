
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLocation } from "wouter";
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
  ChevronDown
} from "lucide-react";

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [location, setLocation] = useLocation();
  const isMobile = useIsMobile();

  // Update cart count from localStorage
  useEffect(() => {
    const updateCartCount = () => {
      const savedCart = localStorage.getItem("restaurant-cart");
      if (savedCart) {
        const cart = JSON.parse(savedCart);
        const count = cart.reduce((sum: number, item: any) => sum + item.quantity, 0);
        setCartCount(count);
      } else {
        setCartCount(0);
      }
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
    { path: "/", label: "Home", icon: Home },
    { path: "/menu", label: "Menu", icon: UtensilsCrossed },
    { path: "/cart", label: "Cart", icon: ShoppingCart, badge: cartCount },
    { path: "/order-status", label: "Orders", icon: Clock }
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

  return (
    <>
      {/* Mobile Header */}
      {isMobile ? (
        <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMenuOpen(true)}
                className="p-2"
              >
                <Menu className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="font-bold text-gray-900 text-sm">{restaurantInfo.name}</h1>
                <div className="flex items-center space-x-2 text-xs text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    <span>{restaurantInfo.rating}</span>
                    <span>({restaurantInfo.reviews})</span>
                  </div>
                  <span>•</span>
                  <span className="flex items-center space-x-1">
                    <MapPin className="w-3 h-3" />
                    <span>{restaurantInfo.table}</span>
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setLocation("/cart")}
                className="relative p-2"
              >
                <ShoppingCart className="w-5 h-5" />
                {cartCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-orange-500 text-white text-xs">
                    {cartCount}
                  </Badge>
                )}
              </Button>
              <Button variant="ghost" size="sm" className="p-2">
                <Heart className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      ) : (
        /* Desktop Header */
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
                
                <nav className="flex items-center space-x-6">
                  {navigationItems.map((item) => (
                    <Button
                      key={item.path}
                      variant={location === item.path ? "default" : "ghost"}
                      onClick={() => setLocation(item.path)}
                      className="relative flex items-center space-x-2"
                    >
                      <item.icon className="w-4 h-4" />
                      <span>{item.label}</span>
                      {item.badge && item.badge > 0 && (
                        <Badge className="ml-1 h-5 w-5 p-0 flex items-center justify-center bg-orange-500 text-white text-xs">
                          {item.badge}
                        </Badge>
                      )}
                    </Button>
                  ))}
                </nav>
              </div>

              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900">{restaurantInfo.table}</div>
                  <div className="text-xs text-green-600">{restaurantInfo.status}</div>
                </div>
                <Button className="bg-orange-500 hover:bg-orange-600 text-white">
                  <QrCode className="w-4 h-4 mr-2" />
                  Scan Menu
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Slide-out Menu */}
      {isMobile && (
        <div className={`fixed inset-0 z-50 transition-opacity ${isMenuOpen ? 'block' : 'hidden'}`}>
          <div className="absolute inset-0 bg-black/50" onClick={() => setIsMenuOpen(false)} />
          
          <div className={`absolute left-0 top-0 bottom-0 w-80 bg-white transform transition-transform ${
            isMenuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}>
            {/* Menu Header */}
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-orange-500 to-red-500 text-white">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold">{restaurantInfo.name}</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsMenuOpen(false)}
                  className="text-white hover:bg-white/20 p-2"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-sm">
                  <Star className="w-4 h-4 fill-yellow-300 text-yellow-300" />
                  <span>{restaurantInfo.rating} rating • {restaurantInfo.reviews} reviews</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <MapPin className="w-4 h-4" />
                  <span>{restaurantInfo.table} • Open until 11:00 PM</span>
                </div>
              </div>
            </div>

            {/* Main Navigation */}
            <div className="p-4">
              <div className="space-y-1 mb-6">
                {navigationItems.map((item) => (
                  <Button
                    key={item.path}
                    variant={location === item.path ? "default" : "ghost"}
                    onClick={() => {
                      setLocation(item.path);
                      setIsMenuOpen(false);
                    }}
                    className="w-full justify-start h-12 text-base"
                  >
                    <item.icon className="w-5 h-5 mr-3" />
                    <span className="flex-1 text-left">{item.label}</span>
                    {item.badge && item.badge > 0 && (
                      <Badge className="bg-orange-500 text-white">
                        {item.badge}
                      </Badge>
                    )}
                  </Button>
                ))}
              </div>

              {/* Quick Actions */}
              <div className="border-t border-gray-200 pt-4 mb-6">
                <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
                  Quick Actions
                </h3>
                <div className="space-y-1">
                  {quickActions.map((action) => (
                    <Button
                      key={action.label}
                      variant="ghost"
                      onClick={action.action}
                      className="w-full justify-start h-10"
                    >
                      <action.icon className="w-4 h-4 mr-3" />
                      <span>{action.label}</span>
                    </Button>
                  ))}
                </div>
              </div>

              {/* Restaurant Features */}
              <div className="border-t border-gray-200 pt-4">
                <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
                  Features
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Wifi className="w-4 h-4 text-green-500" />
                    <span>Free WiFi</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <CreditCard className="w-4 h-4 text-blue-500" />
                    <span>All Cards</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Users className="w-4 h-4 text-purple-500" />
                    <span>Family Friendly</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <QrCode className="w-4 h-4 text-orange-500" />
                    <span>QR Menu</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Menu Footer */}
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-gray-50">
              <div className="text-center">
                <div className="text-sm text-gray-600 mb-2">Need help?</div>
                <Button variant="outline" size="sm" className="w-full">
                  <Phone className="w-4 h-4 mr-2" />
                  Call Restaurant
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

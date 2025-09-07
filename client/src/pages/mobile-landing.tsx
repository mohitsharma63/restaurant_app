
import { useState, useEffect } from "react";
import { useLocation, useParams } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { 
  Star,
  Clock,
  MapPin,
  Phone,
  Share2,
  Heart,
  QrCode,
  Utensils,
  ShoppingCart,
  Truck,
  CheckCircle,
  Timer,
  ChefHat,
  Bell,
  Calendar,
  Users,
  Wifi,
  CreditCard,
  Gift,
  Info,
  ArrowRight,
  PlayCircle,
  UtensilsCrossed,
  Zap,
  Shield,
  Sparkles,
  TrendingUp
} from "lucide-react";

interface Restaurant {
  id: string;
  name: string;
  address: string;
  phone?: string;
  rating?: number;
  reviews?: number;
  openingHours?: string;
  description?: string;
  image?: string;
}

interface Order {
  id: string;
  status: string;
  estimatedTime: string;
  total: number;
  items: any[];
}

export default function MobileLanding() {
  const [, setLocation] = useLocation();
  const params = useParams<{ restaurantId?: string; tableNumber?: string }>();
  const restaurantId = params.restaurantId || "default";
  const tableNumber = params.tableNumber || "5";
  const { toast } = useToast();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Mock restaurant data
  const restaurant: Restaurant = {
    id: restaurantId,
    name: "Delicious Bistro",
    address: "123 Gourmet Street, Food District",
    phone: "+1 (555) 123-4567",
    rating: 4.8,
    reviews: 1248,
    openingHours: "Open until 11:00 PM",
    description: "Experience the future of dining with our contactless ordering system",
    image: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800&h=400&fit=crop"
  };

  // Check for active orders
  const { data: activeOrders = [] } = useQuery<Order[]>({
    queryKey: [`/api/orders/active/${tableNumber}`],
    enabled: !!tableNumber && restaurantId !== "default",
  });

  const handleStartOrdering = () => {
    setLocation(`/menu/${restaurantId}/${tableNumber}`);
    toast({
      title: "Welcome! 🍽️",
      description: "Browse our delicious menu and start ordering!",
    });
  };

  const handleTrackOrder = (orderId: string) => {
    setLocation(`/order-status/${orderId}`);
  };

  const handleCallRestaurant = () => {
    window.open(`tel:${restaurant.phone}`);
  };

  const handleShareMenu = () => {
    if (navigator.share) {
      navigator.share({
        title: `${restaurant.name} - Digital Menu`,
        text: "Check out this amazing restaurant!",
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({ title: "Link copied to clipboard!" });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'preparing': return 'bg-blue-100 text-blue-800';
      case 'ready': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Timer className="w-4 h-4" />;
      case 'preparing': return <ChefHat className="w-4 h-4" />;
      case 'ready': return <Bell className="w-4 h-4" />;
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-orange-200/30 to-red-200/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-blue-200/20 to-purple-200/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-gradient-to-br from-yellow-200/20 to-orange-200/20 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Hero Section */}
      <div className="relative z-10">
        {/* Background Image with Enhanced Overlay */}
        <div className="h-72 bg-gradient-to-br from-orange-400 via-red-500 to-pink-500 relative overflow-hidden">
          {restaurant.image && (
            <img
              src={restaurant.image}
              alt={restaurant.name}
              className="w-full h-full object-cover opacity-40"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
          
          {/* Animated Sparkles */}
          <div className="absolute inset-0">
            <Sparkles className="absolute top-16 left-8 w-4 h-4 text-white/60 animate-pulse" />
            <Sparkles className="absolute top-24 right-12 w-3 h-3 text-white/40 animate-pulse delay-300" />
            <Sparkles className="absolute bottom-20 left-16 w-3 h-3 text-white/50 animate-pulse delay-700" />
          </div>

          {/* Header Controls */}
          <div className="absolute top-8 left-4 right-4 flex items-center justify-between">
            <div className={`flex items-center space-x-3 transform transition-all duration-1000 ${isVisible ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'}`}>
              <div className="w-10 h-10 bg-white/20 backdrop-blur-lg rounded-2xl flex items-center justify-center border border-white/30 shadow-lg">
                <QrCode className="w-5 h-5 text-white" />
              </div>
              <div className="text-white">
                <p className="text-base font-bold">{restaurant.name}</p>
                <div className="flex items-center space-x-2 text-sm">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-lg"></div>
                  <MapPin className="w-3 h-3" />
                  <span>Table {tableNumber} • Live Session</span>
                </div>
              </div>
            </div>
            <div className={`flex items-center space-x-2 transform transition-all duration-1000 delay-300 ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'}`}>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleShareMenu}
                className="w-11 h-11 bg-white/20 backdrop-blur-lg rounded-2xl p-0 hover:bg-white/30 border border-white/20 shadow-lg hover:scale-105 transition-all duration-300"
              >
                <Share2 className="w-5 h-5 text-white" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="w-11 h-11 bg-white/20 backdrop-blur-lg rounded-2xl p-0 hover:bg-white/30 border border-white/20 shadow-lg hover:scale-105 transition-all duration-300"
              >
                <Heart className="w-5 h-5 text-white" />
              </Button>
            </div>
          </div>

          {/* Status Banner */}
          <div className={`absolute bottom-6 left-4 right-4 transform transition-all duration-1000 delay-500 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <div className="bg-white/15 backdrop-blur-lg rounded-2xl p-4 border border-white/20 shadow-xl">
              <div className="flex items-center justify-between text-white text-sm">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-green-400" />
                    <span className="font-medium">{restaurant.openingHours}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    <span className="font-bold">{restaurant.rating}</span>
                    <span className="text-white/80">({restaurant.reviews?.toLocaleString()})</span>
                  </div>
                </div>
                <div className="bg-green-500/20 backdrop-blur-sm rounded-full px-3 py-1 border border-green-400/30">
                  <span className="text-green-300 font-medium text-xs">● ONLINE</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Restaurant Info Card with Enhanced Design */}
        <div className="absolute -bottom-20 left-4 right-4 z-20">
          <Card className={`bg-white/95 backdrop-blur-xl shadow-2xl border-0 rounded-3xl overflow-hidden transform transition-all duration-1000 delay-700 ${isVisible ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-10 opacity-0 scale-95'}`}>
            <CardContent className="p-0">
              <div className="p-8">
                {/* Restaurant Icon with Glow Effect */}
                <div className="relative mb-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 rounded-3xl flex items-center justify-center mb-4 shadow-2xl shadow-orange-500/30 hover:shadow-orange-500/50 transition-all duration-300 hover:scale-105">
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-400 to-red-600 rounded-3xl blur-lg opacity-30"></div>
                    <Utensils className="w-10 h-10 text-white relative z-10" />
                  </div>
                  <div className="absolute -top-2 -right-2">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                      <Zap className="w-3 h-3 text-white" />
                    </div>
                  </div>
                </div>

                {/* Welcome Text with Gradient */}
                <div className="mb-6 text-center">
                  <h1 className="text-2xl font-light text-gray-700 mb-2">
                    Welcome to
                  </h1>
                  <h2 className="text-4xl font-black bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 bg-clip-text text-transparent mb-3">
                    {restaurant.name}
                  </h2>
                  <p className="text-gray-600 font-medium">Experience the future of dining</p>
                </div>

                {/* Enhanced Stats */}
                <div className="flex items-center justify-center space-x-6 mb-8">
                  <div className="text-center">
                    <div className="flex items-center justify-center space-x-1 mb-1">
                      <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                      <span className="font-bold text-xl text-gray-900">{restaurant.rating}</span>
                    </div>
                    <span className="text-sm text-gray-600">{restaurant.reviews?.toLocaleString()} reviews</span>
                  </div>
                  <div className="w-px h-12 bg-gray-200"></div>
                  <div className="text-center">
                    <div className="flex items-center justify-center space-x-1 mb-1">
                      <TrendingUp className="w-5 h-5 text-green-500" />
                      <span className="font-bold text-xl text-gray-900">95%</span>
                    </div>
                    <span className="text-sm text-gray-600">satisfaction</span>
                  </div>
                  <div className="w-px h-12 bg-gray-200"></div>
                  <div className="text-center">
                    <div className="flex items-center justify-center space-x-1 mb-1">
                      <Timer className="w-5 h-5 text-blue-500" />
                      <span className="font-bold text-xl text-gray-900">15</span>
                    </div>
                    <span className="text-sm text-gray-600">min avg</span>
                  </div>
                </div>

                {/* Main CTA Button with Enhanced Animation */}
                <Button
                  onClick={() => setLocation(`/menu/${restaurantId}/${tableNumber}`)}
                  className="w-full bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 hover:from-orange-600 hover:via-red-600 hover:to-pink-600 text-white py-6 rounded-3xl shadow-2xl hover:shadow-orange-500/50 transition-all duration-500 transform hover:scale-105 hover:-translate-y-1 mb-6 group relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                  <div className="flex items-center justify-center space-x-4 relative z-10">
                    <div className="bg-white/20 rounded-2xl p-3 group-hover:scale-110 transition-transform duration-300">
                      <UtensilsCrossed className="w-7 h-7" />
                    </div>
                    <div className="text-left">
                      <div className="font-bold text-xl">Start Ordering Now</div>
                      <div className="text-sm text-white/90">Browse our delicious menu items</div>
                    </div>
                    <ArrowRight className="w-6 h-6 ml-2 group-hover:translate-x-2 transition-transform duration-300" />
                  </div>
                </Button>

                <p className="text-center text-sm text-gray-500 mb-6">
                  <Shield className="w-4 h-4 inline mr-1 text-green-500" />
                  Secure QR ordering • Real-time updates • Contactless experience
                </p>

                {/* Action Buttons with Enhanced Design */}
                <div className="grid grid-cols-3 gap-4">
                  <Button
                    variant="outline"
                    onClick={handleCallRestaurant}
                    className="flex flex-col items-center space-y-2 h-20 rounded-2xl border-2 border-blue-100 hover:bg-blue-50 hover:border-blue-200 hover:scale-105 transition-all duration-300 group"
                  >
                    <div className="w-8 h-8 bg-blue-100 rounded-xl flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                      <Phone className="w-4 h-4 text-blue-600" />
                    </div>
                    <span className="text-sm font-medium">Call</span>
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleShareMenu}
                    className="flex flex-col items-center space-y-2 h-20 rounded-2xl border-2 border-green-100 hover:bg-green-50 hover:border-green-200 hover:scale-105 transition-all duration-300 group"
                  >
                    <div className="w-8 h-8 bg-green-100 rounded-xl flex items-center justify-center group-hover:bg-green-200 transition-colors">
                      <Share2 className="w-4 h-4 text-green-600" />
                    </div>
                    <span className="text-sm font-medium">Share</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="flex flex-col items-center space-y-2 h-20 rounded-2xl border-2 border-purple-100 hover:bg-purple-50 hover:border-purple-200 hover:scale-105 transition-all duration-300 group"
                  >
                    <div className="w-8 h-8 bg-purple-100 rounded-xl flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                      <Heart className="w-4 h-4 text-purple-600" />
                    </div>
                    <span className="text-sm font-medium">Save</span>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Content Area with Enhanced Spacing */}
      <div className="pt-28 pb-8 px-4 relative z-10">
        {/* Active Orders Section */}
        {activeOrders.length > 0 && (
          <div className="mb-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <div className="w-8 h-8 bg-orange-100 rounded-xl flex items-center justify-center mr-3">
                <ShoppingCart className="w-5 h-5 text-orange-600" />
              </div>
              Your Active Orders
            </h3>
            <div className="space-y-4">
              {activeOrders.map((order) => (
                <Card key={order.id} className="bg-white/80 backdrop-blur-sm shadow-xl border-0 rounded-3xl overflow-hidden hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h4 className="font-bold text-lg text-gray-900">Order #{order.id.slice(-6)}</h4>
                        <p className="text-gray-600">{order.items.length} items • ${order.total.toFixed(2)}</p>
                      </div>
                      <Badge className={`${getStatusColor(order.status)} px-4 py-2 rounded-2xl flex items-center space-x-2 font-medium`}>
                        {getStatusIcon(order.status)}
                        <span className="capitalize">{order.status}</span>
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 text-gray-600">
                        <Timer className="w-5 h-5 text-orange-500" />
                        <span className="font-medium">Est. {order.estimatedTime}</span>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => handleTrackOrder(order.id)}
                        className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-2xl px-6 py-2 font-medium shadow-lg hover:shadow-blue-500/30 transition-all duration-300 hover:scale-105"
                      >
                        Track Order
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Why Choose Section with Enhanced Design */}
        <Card className="bg-white/90 backdrop-blur-sm shadow-2xl border-0 rounded-3xl overflow-hidden mb-12 hover:shadow-3xl transition-all duration-500">
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <h3 className="text-3xl font-bold text-gray-900 mb-3">
                Why Choose Our Digital Menu?
              </h3>
              <p className="text-gray-600 text-lg">Experience the future of dining technology</p>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="text-center group hover:scale-105 transition-all duration-300">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-100 to-orange-200 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-orange-500/30 group-hover:from-orange-200 group-hover:to-orange-300 transition-all duration-300">
                  <Truck className="w-8 h-8 text-orange-600" />
                </div>
                <h4 className="font-bold text-gray-900 text-lg mb-2">Contactless</h4>
                <p className="text-sm text-gray-600">Order directly from your phone safely</p>
              </div>

              <div className="text-center group hover:scale-105 transition-all duration-300">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-blue-500/30 group-hover:from-blue-200 group-hover:to-blue-300 transition-all duration-300">
                  <Timer className="w-8 h-8 text-blue-600" />
                </div>
                <h4 className="font-bold text-gray-900 text-lg mb-2">Real-time</h4>
                <p className="text-sm text-gray-600">Track your order status live</p>
              </div>

              <div className="text-center group hover:scale-105 transition-all duration-300">
                <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-green-200 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-green-500/30 group-hover:from-green-200 group-hover:to-green-300 transition-all duration-300">
                  <CreditCard className="w-8 h-8 text-green-600" />
                </div>
                <h4 className="font-bold text-gray-900 text-lg mb-2">Easy Payment</h4>
                <p className="text-sm text-gray-600">Secure payment options</p>
              </div>

              <div className="text-center group hover:scale-105 transition-all duration-300">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-purple-200 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-purple-500/30 group-hover:from-purple-200 group-hover:to-purple-300 transition-all duration-300">
                  <Gift className="w-8 h-8 text-purple-600" />
                </div>
                <h4 className="font-bold text-gray-900 text-lg mb-2">Special Offers</h4>
                <p className="text-sm text-gray-600">Exclusive deals & rewards</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Final CTA Section */}
        <Card className="bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 shadow-2xl border-0 rounded-3xl overflow-hidden relative">
          <div className="absolute inset-0 bg-black/10"></div>
          <CardContent className="p-8 text-center relative z-10">
            <div className="w-20 h-20 bg-white/20 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
              <Utensils className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-3xl font-bold text-white mb-4">Ready to Order?</h3>
            <p className="text-white/90 text-lg mb-8 max-w-md mx-auto">
              Join thousands of satisfied customers and experience seamless dining today!
            </p>
            <Button
              onClick={handleStartOrdering}
              size="lg"
              className="bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 font-bold px-8 py-4 rounded-3xl shadow-2xl border border-white/30 hover:scale-105 transition-all duration-300 group"
            >
              <PlayCircle className="w-6 h-6 mr-3 group-hover:scale-110 transition-transform" />
              Start Ordering Now
              <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform" />
            </Button>
          </CardContent>
        </Card>

        {/* Footer Info */}
        <div className="mt-12 text-center">
          <div className="flex items-center justify-center space-x-6 mb-4 text-gray-600">
            <div className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-2xl shadow-lg">
              <Wifi className="w-4 h-4 text-green-500" />
              <span className="font-medium">Free WiFi</span>
            </div>
            <div className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-2xl shadow-lg">
              <Truck className="w-4 h-4 text-blue-500" />
              <span className="font-medium">Free Delivery $25+</span>
            </div>
          </div>
          <p className="text-gray-500 font-medium">Powered by Digital Menu System</p>
        </div>
      </div>
    </div>
  );
}

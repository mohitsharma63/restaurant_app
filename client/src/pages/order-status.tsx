
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useLocation } from "wouter";
import { 
  Clock, 
  CheckCircle, 
  ChefHat, 
  Truck, 
  ArrowLeft,
  MapPin,
  Phone,
  Star,
  MessageCircle,
  Receipt,
  RefreshCw,
  Bell,
  Utensils,
  Timer,
  AlertCircle
} from "lucide-react";

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  specialInstructions?: string;
}

interface Order {
  id: string;
  items: OrderItem[];
  status: "pending" | "confirmed" | "preparing" | "ready" | "completed";
  total: number;
  estimatedTime: number;
  actualTime?: number;
  orderTime: string;
  table: string;
  paymentMethod: string;
  specialInstructions?: string;
}

// Mock order data
const mockOrder: Order = {
  id: "ORD-2024-001",
  items: [
    { id: "1", name: "Truffle Risotto", quantity: 1, price: 28.99 },
    { id: "2", name: "Grilled Atlantic Salmon", quantity: 1, price: 32.50 },
    { id: "3", name: "Chocolate Lava Cake", quantity: 2, price: 12.99 }
  ],
  status: "preparing",
  total: 98.47,
  estimatedTime: 25,
  orderTime: "2:15 PM",
  table: "Table 5",
  paymentMethod: "Credit Card",
  specialInstructions: "Please make the salmon well done"
};

const statusSteps = [
  { key: "pending", label: "Order Placed", icon: Receipt, description: "We've received your order" },
  { key: "confirmed", label: "Confirmed", icon: CheckCircle, description: "Order confirmed by restaurant" },
  { key: "preparing", label: "Preparing", icon: ChefHat, description: "Chef is preparing your meal" },
  { key: "ready", label: "Ready", icon: Bell, description: "Your order is ready to serve" },
  { key: "completed", label: "Served", icon: Utensils, description: "Enjoy your meal!" }
];

export default function OrderStatus() {
  const [order, setOrder] = useState<Order>(mockOrder);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [, setLocation] = useLocation();

  // Update current time every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  // Mock order status updates
  useEffect(() => {
    const interval = setInterval(() => {
      setOrder(prev => {
        if (prev.status === "pending") return { ...prev, status: "confirmed" };
        if (prev.status === "confirmed") return { ...prev, status: "preparing" };
        if (prev.status === "preparing") return { ...prev, status: "ready" };
        if (prev.status === "ready") return { ...prev, status: "completed" };
        return prev;
      });
    }, 10000); // Update every 10 seconds for demo
    
    return () => clearInterval(interval);
  }, []);

  const getCurrentStepIndex = () => {
    return statusSteps.findIndex(step => step.key === order.status);
  };

  const getTimeRemaining = () => {
    const orderDate = new Date();
    orderDate.setHours(14, 15, 0); // 2:15 PM
    const estimatedComplete = new Date(orderDate.getTime() + order.estimatedTime * 60000);
    const remaining = Math.max(0, Math.floor((estimatedComplete.getTime() - currentTime.getTime()) / 60000));
    return remaining;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'confirmed': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'preparing': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'ready': return 'bg-green-100 text-green-800 border-green-200';
      case 'completed': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const timeRemaining = getTimeRemaining();
  const currentStepIndex = getCurrentStepIndex();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-3">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setLocation("/menu")}
              className="p-2"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-lg font-bold text-gray-900">Order Status</h1>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <span>Order {order.id}</span>
                <span>•</span>
                <span>{order.orderTime}</span>
              </div>
            </div>
          </div>
          <Button variant="ghost" size="sm" className="p-2">
            <RefreshCw className="w-5 h-5" />
          </Button>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Order Status Card */}
        <Card className="bg-gradient-to-r from-orange-500 to-red-500 text-white border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <ChefHat className="w-8 h-8" />
              </div>
              <h2 className="text-xl font-bold mb-2">
                {statusSteps[currentStepIndex]?.label || "Unknown Status"}
              </h2>
              <p className="text-white/80 mb-4">
                {statusSteps[currentStepIndex]?.description || "Processing your order"}
              </p>
              
              {order.status !== "completed" && timeRemaining > 0 && (
                <div className="flex items-center justify-center space-x-2 bg-white/20 rounded-xl py-2 px-4">
                  <Timer className="w-4 h-4" />
                  <span className="font-semibold">
                    {timeRemaining} min remaining
                  </span>
                </div>
              )}
              
              {order.status === "ready" && (
                <div className="flex items-center justify-center space-x-2 bg-green-500/20 rounded-xl py-2 px-4 border border-green-300">
                  <Bell className="w-4 h-4" />
                  <span className="font-semibold">Ready to serve!</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Progress Timeline */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Order Progress</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {statusSteps.map((step, index) => {
              const isCompleted = index <= currentStepIndex;
              const isCurrent = index === currentStepIndex;
              const StepIcon = step.icon;
              
              return (
                <div key={step.key} className="flex items-center space-x-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                    isCompleted 
                      ? isCurrent 
                        ? 'bg-orange-500 border-orange-500 text-white' 
                        : 'bg-green-500 border-green-500 text-white'
                      : 'bg-gray-100 border-gray-300 text-gray-400'
                  }`}>
                    {isCompleted && !isCurrent ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      <StepIcon className="w-5 h-5" />
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <div className={`font-medium ${
                      isCompleted ? 'text-gray-900' : 'text-gray-500'
                    }`}>
                      {step.label}
                    </div>
                    <div className={`text-sm ${
                      isCompleted ? 'text-gray-600' : 'text-gray-400'
                    }`}>
                      {step.description}
                    </div>
                  </div>
                  
                  {isCurrent && (
                    <Badge className="bg-orange-100 text-orange-700 animate-pulse">
                      Current
                    </Badge>
                  )}
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Order Details */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center justify-between">
              <span>Order Details</span>
              <Badge className={getStatusColor(order.status)}>
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Order Info */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-gray-500">Order ID</div>
                <div className="font-medium">{order.id}</div>
              </div>
              <div>
                <div className="text-gray-500">Table</div>
                <div className="font-medium flex items-center">
                  <MapPin className="w-3 h-3 mr-1" />
                  {order.table}
                </div>
              </div>
              <div>
                <div className="text-gray-500">Order Time</div>
                <div className="font-medium">{order.orderTime}</div>
              </div>
              <div>
                <div className="text-gray-500">Payment</div>
                <div className="font-medium">{order.paymentMethod}</div>
              </div>
            </div>

            <Separator />

            {/* Order Items */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Items Ordered</h4>
              <div className="space-y-3">
                {order.items.map((item) => (
                  <div key={item.id} className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{item.name}</div>
                      <div className="text-sm text-gray-500">Qty: {item.quantity}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">${(item.price * item.quantity).toFixed(2)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {order.specialInstructions && (
              <>
                <Separator />
                <div>
                  <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Special Instructions
                  </h4>
                  <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                    {order.specialInstructions}
                  </p>
                </div>
              </>
            )}

            <Separator />

            <div className="flex justify-between items-center font-semibold text-lg">
              <span>Total Amount</span>
              <span>${order.total.toFixed(2)}</span>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3">
          <Button 
            variant="outline" 
            className="flex items-center justify-center space-x-2"
            onClick={() => window.open("tel:+15551234567")}
          >
            <Phone className="w-4 h-4" />
            <span>Call Restaurant</span>
          </Button>
          <Button 
            variant="outline"
            onClick={() => setLocation("/menu")}
            className="flex items-center justify-center space-x-2"
          >
            <Utensils className="w-4 h-4" />
            <span>Order More</span>
          </Button>
        </div>

        {/* Help Section */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-blue-900 mb-1">Need Help?</h4>
                <p className="text-sm text-blue-700 mb-3">
                  Our staff is here to assist you with your order or any questions.
                </p>
                <Button size="sm" variant="outline" className="border-blue-300 text-blue-700 hover:bg-blue-100">
                  <MessageCircle className="w-3 h-3 mr-2" />
                  Contact Support
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Rate Experience */}
        {order.status === "completed" && (
          <Card className="bg-green-50 border-green-200">
            <CardContent className="p-4">
              <div className="text-center">
                <h4 className="font-medium text-green-900 mb-2">How was your experience?</h4>
                <p className="text-sm text-green-700 mb-4">
                  Help us improve by rating your dining experience
                </p>
                <div className="flex justify-center space-x-2 mb-4">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <Button
                      key={rating}
                      variant="ghost"
                      size="sm"
                      className="p-1 hover:bg-green-100"
                    >
                      <Star className="w-6 h-6 text-yellow-400 hover:fill-yellow-400" />
                    </Button>
                  ))}
                </div>
                <Button className="bg-green-600 hover:bg-green-700 text-white">
                  Submit Rating
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}


import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Clock, 
  ChefHat, 
  CheckCircle, 
  Timer, 
  Bell,
  Truck,
  Star,
  Phone,
  MapPin
} from "lucide-react";

interface OrderTrackingProps {
  orderId: string;
  status: 'pending' | 'preparing' | 'ready' | 'completed';
  estimatedTime: string;
  items: any[];
  total: number;
  tableNumber: string;
  onTrackOrder?: () => void;
  className?: string;
}

export default function OrderTrackingCard({ 
  orderId, 
  status, 
  estimatedTime, 
  items, 
  total, 
  tableNumber,
  onTrackOrder,
  className = ""
}: OrderTrackingProps) {
  
  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'pending':
        return {
          color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
          icon: <Timer className="w-4 h-4" />,
          message: 'Order received, waiting for confirmation',
          progress: 25
        };
      case 'preparing':
        return {
          color: 'bg-blue-100 text-blue-800 border-blue-200',
          icon: <ChefHat className="w-4 h-4" />,
          message: 'Chef is preparing your delicious food',
          progress: 60
        };
      case 'ready':
        return {
          color: 'bg-green-100 text-green-800 border-green-200',
          icon: <Bell className="w-4 h-4" />,
          message: 'Your order is ready for pickup!',
          progress: 90
        };
      case 'completed':
        return {
          color: 'bg-gray-100 text-gray-800 border-gray-200',
          icon: <CheckCircle className="w-4 h-4" />,
          message: 'Order completed. Enjoy your meal!',
          progress: 100
        };
      default:
        return {
          color: 'bg-gray-100 text-gray-800 border-gray-200',
          icon: <Clock className="w-4 h-4" />,
          message: 'Processing order...',
          progress: 0
        };
    }
  };

  const statusInfo = getStatusInfo(status);

  return (
    <Card className={`bg-white shadow-lg border-0 rounded-3xl overflow-hidden ${className}`}>
      <CardContent className="p-0">
        <div className="bg-gradient-to-r from-orange-500 to-red-500 p-4 text-white">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="font-bold text-lg">Order #{orderId.slice(-6)}</h3>
              <div className="flex items-center space-x-3 text-sm text-white/80">
                <div className="flex items-center space-x-1">
                  <MapPin className="w-3 h-3" />
                  <span>Table {tableNumber}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="w-3 h-3" />
                  <span>Est. {estimatedTime}</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">${total.toFixed(2)}</div>
              <div className="text-sm text-white/80">{items.length} items</div>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-white/20 rounded-full h-2 mb-2">
            <div 
              className="bg-white rounded-full h-2 transition-all duration-500"
              style={{ width: `${statusInfo.progress}%` }}
            />
          </div>
        </div>

        <div className="p-4">
          {/* Status Badge */}
          <div className="flex items-center justify-between mb-4">
            <Badge className={`${statusInfo.color} px-3 py-2 rounded-full flex items-center space-x-2 border`}>
              {statusInfo.icon}
              <span className="font-medium capitalize">{status}</span>
            </Badge>
            <div className="flex items-center space-x-1 text-orange-600">
              <Star className="w-4 h-4 fill-current" />
              <span className="text-sm font-medium">4.8</span>
            </div>
          </div>

          {/* Status Message */}
          <p className="text-gray-600 text-sm mb-4 text-center">
            {statusInfo.message}
          </p>

          {/* Order Items Preview */}
          <div className="mb-4">
            <h4 className="font-semibold text-gray-900 mb-2">Order Items:</h4>
            <div className="space-y-2 max-h-24 overflow-y-auto">
              {items.slice(0, 3).map((item: any, index: number) => (
                <div key={index} className="flex justify-between text-sm">
                  <span className="text-gray-700">{item.quantity}x {item.name}</span>
                  <span className="text-gray-900 font-medium">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
              {items.length > 3 && (
                <div className="text-xs text-gray-500 text-center">
                  +{items.length - 3} more items
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <Button
              variant="outline"
              className="flex-1 rounded-2xl py-3 border-gray-200 hover:bg-blue-50"
              onClick={() => window.open("tel:+15551234567")}
            >
              <Phone className="w-4 h-4 mr-2" />
              Call
            </Button>
            <Button
              onClick={onTrackOrder}
              className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-2xl py-3 font-medium hover:from-orange-600 hover:to-red-600"
            >
              <Truck className="w-4 h-4 mr-2" />
              Track Order
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

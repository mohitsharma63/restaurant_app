import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useWebSocket } from "@/hooks/use-websocket";
import { Check, Clock, Utensils, Bell, CheckCheck, Phone, Plus } from "lucide-react";
import { useLocation } from "wouter";
import { type Order } from "@shared/schema";

export default function OrderStatus() {
  const [, setLocation] = useLocation();
  const [orderId, setOrderId] = useState<string>("");

  // Extract order ID from URL
  useEffect(() => {
    const path = window.location.pathname;
    const matches = path.match(/\/order-status\/(.+)/);
    if (matches) {
      setOrderId(matches[1]);
    }
  }, []);

  const { data: order, refetch } = useQuery({
    queryKey: ['/api/orders', orderId],
    enabled: !!orderId,
  });

  // WebSocket for real-time order updates
  useWebSocket((message) => {
    if (message.type === 'order_status_update' && message.orderId === orderId) {
      refetch();
    }
  });

  const getStatusIcon = (status: string, isActive: boolean) => {
    const iconClass = `w-6 h-6 ${isActive ? 'text-white' : 'text-muted-foreground'}`;
    
    switch (status) {
      case 'pending':
      case 'accepted':
        return <Check className={iconClass} />;
      case 'preparing':
        return <Utensils className={iconClass} />;
      case 'ready':
        return <Bell className={iconClass} />;
      case 'completed':
        return <CheckCheck className={iconClass} />;
      default:
        return <Clock className={iconClass} />;
    }
  };

  const getStatusColor = (status: string, isActive: boolean) => {
    if (!isActive) return 'bg-muted';
    
    switch (status) {
      case 'pending':
      case 'accepted':
        return 'bg-accent';
      case 'preparing':
        return 'bg-primary animate-pulse';
      case 'ready':
        return 'bg-green-500';
      case 'completed':
        return 'bg-green-500';
      default:
        return 'bg-muted';
    }
  };

  const statusSteps = [
    { status: 'pending', title: 'Order Placed', description: 'Your order has been confirmed' },
    { status: 'accepted', title: 'Order Accepted', description: 'Restaurant has accepted your order' },
    { status: 'preparing', title: 'Preparing', description: 'Your food is being prepared' },
    { status: 'ready', title: 'Ready', description: 'Your order is ready for pickup' },
    { status: 'completed', title: 'Served', description: 'Enjoy your meal!' },
  ];

  const getCurrentStepIndex = (orderStatus: string) => {
    const statusOrder = ['pending', 'accepted', 'preparing', 'ready', 'completed'];
    return statusOrder.indexOf(orderStatus);
  };

  const getEstimatedTime = (status: string) => {
    switch (status) {
      case 'pending':
        return '2-5 minutes';
      case 'accepted':
        return '15-20 minutes';
      case 'preparing':
        return '10-15 minutes';
      case 'ready':
        return 'Ready now!';
      case 'completed':
        return 'Completed';
      default:
        return 'Unknown';
    }
  };

  const handleBackToMenu = () => {
    const restaurantId = localStorage.getItem('restaurantId');
    const tableNumber = localStorage.getItem('tableNumber');
    
    if (restaurantId && tableNumber) {
      setLocation(`/menu/${restaurantId}/${tableNumber}`);
    } else {
      setLocation('/');
    }
  };

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Loading Order...</h2>
          <p className="text-muted-foreground">Please wait while we load your order status</p>
        </div>
      </div>
    );
  }

  const currentStepIndex = getCurrentStepIndex(order.status);
  const orderItems = Array.isArray(order.items) ? order.items : [];

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-6 max-w-md">
        {/* Order Status Header */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="text-center mb-6">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
                order.status === 'completed' ? 'bg-green-500' : 'bg-accent'
              }`}>
                {order.status === 'completed' ? (
                  <CheckCheck className="w-8 h-8 text-white" />
                ) : (
                  <Check className="w-8 h-8 text-white" />
                )}
              </div>
              <h2 className="text-xl font-semibold mb-2" data-testid="heading-order-confirmed">
                {order.status === 'completed' ? 'Order Completed!' : 'Order Confirmed!'}
              </h2>
              <p className="text-muted-foreground" data-testid="text-order-info">
                Order #{order.id.slice(-6)} • Table {order.tableNumber}
              </p>
            </div>

            {/* Status Timeline */}
            <div className="space-y-4">
              {statusSteps.map((step, index) => {
                const isActive = index <= currentStepIndex;
                const isCurrent = index === currentStepIndex;
                
                return (
                  <div key={step.status} className="flex items-center space-x-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getStatusColor(step.status, isActive)}`}>
                      {getStatusIcon(step.status, isActive)}
                    </div>
                    <div className="flex-1">
                      <h4 className={`font-medium ${isActive ? '' : 'text-muted-foreground'}`}>
                        {step.title}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {step.description}
                      </p>
                      {isCurrent && order.status === 'preparing' && (
                        <p className="text-xs text-primary">Currently preparing...</p>
                      )}
                    </div>
                    {isActive && (
                      <div className="text-xs text-muted-foreground">
                        {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Estimated Time */}
            <div className="mt-6 p-4 bg-muted rounded-lg text-center">
              <p className="text-sm text-muted-foreground mb-1">Estimated Time</p>
              <p className="text-lg font-semibold" data-testid="text-estimated-time">
                {getEstimatedTime(order.status)}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Order Details */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <h3 className="font-semibold mb-4">Order Details</h3>
            
            <div className="space-y-3 mb-4">
              {orderItems.map((item: any, index: number) => (
                <div key={index} className="flex justify-between">
                  <span data-testid={`text-item-${index}`}>
                    {item.quantity}x {item.name}
                  </span>
                  <span data-testid={`text-item-price-${index}`}>
                    ${(parseFloat(item.price) * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <Separator className="my-3" />
            
            <div className="flex justify-between font-semibold">
              <span>Total</span>
              <span data-testid="text-order-total">
                ${parseFloat(order.totalAmount).toFixed(2)}
              </span>
            </div>
            
            <div className="mt-2 text-sm text-muted-foreground">
              <p>Payment: {order.paymentMethod}</p>
              <p>Order Type: {order.orderType}</p>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="space-y-3">
          <Button 
            variant="secondary" 
            className="w-full"
            data-testid="button-call-restaurant"
          >
            <Phone className="w-4 h-4 mr-2" />
            Call Restaurant
          </Button>
          <Button 
            variant="outline" 
            className="w-full"
            onClick={handleBackToMenu}
            data-testid="button-add-more-items"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add More Items
          </Button>
        </div>
      </div>
    </div>
  );
}

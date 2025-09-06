import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Order, OrderItem, MenuItem } from "@shared/schema";
import { Loader2, Check, Utensils, Bell, CheckCheck } from "lucide-react";

const statusConfig = {
  pending: { label: "Received", icon: Check, color: "bg-primary" },
  confirmed: { label: "Confirmed", icon: Check, color: "bg-primary" },
  preparing: { label: "Preparing", icon: Utensils, color: "bg-primary" },
  ready: { label: "Ready", icon: Bell, color: "bg-primary" },
  served: { label: "Served", icon: CheckCheck, color: "bg-primary" },
  cancelled: { label: "Cancelled", icon: Check, color: "bg-destructive" },
};

export default function OrderStatusPage({ params }: { params: { orderId: string } }) {
  const [, setLocation] = useLocation();

  // Fetch order
  const { data: order, isLoading: orderLoading } = useQuery<Order>({
    queryKey: ["/api/orders", params.orderId],
    refetchInterval: 10000, // Poll every 10 seconds
  });

  // Fetch order items
  const { data: orderItems = [] } = useQuery<(OrderItem & { menuItem: MenuItem })[]>({
    queryKey: ["/api/orders", params.orderId, "items"],
    enabled: !!order,
  });

  if (orderLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card>
          <CardContent className="p-8 text-center">
            <h2 className="text-xl font-serif font-semibold mb-2">Order Not Found</h2>
            <p className="text-muted-foreground mb-4">
              The order you're looking for doesn't exist.
            </p>
            <Button onClick={() => setLocation("/")} data-testid="button-back-home">
              Back to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const statusSteps = ["pending", "preparing", "ready", "served"];
  const currentStepIndex = statusSteps.indexOf(order.status);

  const formatCurrency = (amount: string | number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(typeof amount === 'string' ? parseFloat(amount) : amount);
  };

  return (
    <div className="min-h-screen bg-card">
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Order Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-primary-foreground" />
          </div>
          <h2 className="text-2xl font-serif font-semibold text-card-foreground mb-2">
            Order Confirmed
          </h2>
          <p className="text-muted-foreground" data-testid="text-order-id">
            Order #{order.id}
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            Estimated time: {order.estimatedTime} minutes
          </p>
        </div>

        {/* Progress Tracker */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex items-center justify-between relative">
              {/* Progress line */}
              <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-border -translate-y-1/2"></div>
              <div 
                className="absolute top-1/2 left-0 h-0.5 bg-primary -translate-y-1/2 transition-all duration-300"
                style={{ width: `${(currentStepIndex / (statusSteps.length - 1)) * 100}%` }}
              ></div>
              
              {/* Steps */}
              {statusSteps.map((status, index) => {
                const config = statusConfig[status as keyof typeof statusConfig];
                const IconComponent = config.icon;
                const isCompleted = index <= currentStepIndex;
                
                return (
                  <div key={status} className="flex flex-col items-center relative bg-card px-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${
                      isCompleted ? config.color : 'bg-muted-foreground'
                    }`}>
                      <IconComponent className="w-4 h-4 text-white" />
                    </div>
                    <span className={`text-xs font-medium ${
                      isCompleted ? 'text-card-foreground' : 'text-muted-foreground'
                    }`}>
                      {config.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Order Details */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <h3 className="text-lg font-serif font-semibold text-card-foreground mb-4">
              Order Details
            </h3>
            <div className="space-y-3">
              {orderItems.map((item) => (
                <div key={item.id} className="flex justify-between py-2 border-b border-border last:border-b-0">
                  <div>
                    <span className="font-medium text-card-foreground" data-testid={`text-item-${item.id}`}>
                      {item.menuItem?.name || 'Unknown Item'}
                    </span>
                    <span className="text-muted-foreground ml-2">×{item.quantity}</span>
                    {item.modifications && (
                      <div className="text-xs text-muted-foreground mt-1">
                        {item.modifications}
                      </div>
                    )}
                  </div>
                  <span className="text-card-foreground font-medium">
                    {formatCurrency(item.totalPrice)}
                  </span>
                </div>
              ))}
            </div>
            
            <div className="mt-4 pt-4 border-t border-border space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatCurrency(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tax</span>
                <span>{formatCurrency(order.tax)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Service Fee</span>
                <span>{formatCurrency(order.serviceFee)}</span>
              </div>
              <div className="flex justify-between font-semibold text-lg pt-2 border-t border-border">
                <span>Total</span>
                <span className="text-primary">{formatCurrency(order.total)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex space-x-4">
          <Button
            variant="secondary"
            className="flex-1"
            onClick={() => setLocation("/")}
            data-testid="button-back-menu"
          >
            Back to Menu
          </Button>
          <Button
            className="flex-1"
            data-testid="button-call-server"
          >
            Call Server
          </Button>
        </div>
      </div>
    </div>
  );
}

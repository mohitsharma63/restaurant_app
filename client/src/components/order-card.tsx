import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Check, X, Bell, CheckCheck } from "lucide-react";
import { type Order } from "@shared/schema";

interface OrderCardProps {
  order: Order;
  onStatusUpdate: (orderId: string, status: string) => void;
  isUpdating: boolean;
}

export default function OrderCard({ order, onStatusUpdate, isUpdating }: OrderCardProps) {
  const getStatusBadge = (status: string) => {
    const baseClasses = "text-xs font-medium";
    
    switch (status) {
      case 'pending':
        return <Badge className={`${baseClasses} bg-yellow-100 text-yellow-800`}>Pending</Badge>;
      case 'accepted':
        return <Badge className={`${baseClasses} bg-blue-100 text-blue-800`}>Accepted</Badge>;
      case 'preparing':
        return <Badge className={`${baseClasses} bg-blue-100 text-blue-800`}>Preparing</Badge>;
      case 'ready':
        return <Badge className={`${baseClasses} bg-green-100 text-green-800`}>Ready</Badge>;
      case 'completed':
        return <Badge className={`${baseClasses} bg-gray-100 text-gray-800`}>Completed</Badge>;
      case 'rejected':
        return <Badge className={`${baseClasses} bg-red-100 text-red-800`}>Rejected</Badge>;
      default:
        return <Badge className={baseClasses}>{status}</Badge>;
    }
  };

  const getTimeAgo = (createdAt: Date | string) => {
    const now = new Date();
    const orderTime = new Date(createdAt);
    const diffMs = now.getTime() - orderTime.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    
    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} min ago`;
    
    const diffHours = Math.floor(diffMins / 60);
    return `${diffHours}h ${diffMins % 60}m ago`;
  };

  const renderActionButtons = () => {
    switch (order.status) {
      case 'pending':
        return (
          <div className="space-y-2">
            <Button
              onClick={() => onStatusUpdate(order.id, 'accepted')}
              disabled={isUpdating}
              className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
              data-testid={`button-accept-${order.id}`}
            >
              <Check className="w-4 h-4 mr-2" />
              Accept Order
            </Button>
            <Button
              onClick={() => onStatusUpdate(order.id, 'rejected')}
              disabled={isUpdating}
              variant="destructive"
              className="w-full"
              data-testid={`button-reject-${order.id}`}
            >
              <X className="w-4 h-4 mr-2" />
              Reject Order
            </Button>
          </div>
        );
      
      case 'accepted':
        return (
          <Button
            onClick={() => onStatusUpdate(order.id, 'preparing')}
            disabled={isUpdating}
            className="w-full"
            data-testid={`button-start-preparing-${order.id}`}
          >
            <Bell className="w-4 h-4 mr-2" />
            Start Preparing
          </Button>
        );
      
      case 'preparing':
        return (
          <Button
            onClick={() => onStatusUpdate(order.id, 'ready')}
            disabled={isUpdating}
            className="w-full"
            data-testid={`button-mark-ready-${order.id}`}
          >
            <Bell className="w-4 h-4 mr-2" />
            Mark Ready
          </Button>
        );
      
      case 'ready':
        return (
          <Button
            onClick={() => onStatusUpdate(order.id, 'completed')}
            disabled={isUpdating}
            className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
            data-testid={`button-mark-completed-${order.id}`}
          >
            <CheckCheck className="w-4 h-4 mr-2" />
            Mark Completed
          </Button>
        );
      
      default:
        return null;
    }
  };

  const orderItems = Array.isArray(order.items) ? order.items : [];

  return (
    <Card className="h-fit">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold" data-testid={`text-order-id-${order.id}`}>
              Order #{order.id.slice(-6)}
            </h3>
            <p className="text-sm text-muted-foreground" data-testid={`text-order-details-${order.id}`}>
              Table {order.tableNumber} • {order.orderType}
            </p>
          </div>
          {getStatusBadge(order.status)}
        </div>

        <div className="space-y-2 mb-4">
          {orderItems.map((item: any, index: number) => (
            <div key={index} className="flex justify-between text-sm">
              <span data-testid={`text-order-item-${order.id}-${index}`}>
                {item.quantity}x {item.name}
              </span>
              <span data-testid={`text-order-item-price-${order.id}-${index}`}>
                ${(parseFloat(item.price) * item.quantity).toFixed(2)}
              </span>
            </div>
          ))}
        </div>

        <Separator className="my-3" />

        <div className="mb-4">
          <div className="flex justify-between font-semibold">
            <span>Total</span>
            <span data-testid={`text-order-total-${order.id}`}>
              ${parseFloat(order.totalAmount).toFixed(2)}
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1" data-testid={`text-order-time-${order.id}`}>
            {order.createdAt ? getTimeAgo(order.createdAt) : "Time unknown"}
          </p>
        </div>

        {order.specialInstructions && (
          <div className="mb-4 p-2 bg-muted rounded text-sm">
            <strong>Special Instructions:</strong> {order.specialInstructions}
          </div>
        )}

        {renderActionButtons()}
      </CardContent>
    </Card>
  );
}

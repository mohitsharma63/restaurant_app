import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import type { OrderWithDetails } from "@shared/schema";

interface OrderCardProps {
  order: OrderWithDetails;
}

export default function OrderCard({ order }: OrderCardProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const updateStatusMutation = useMutation({
    mutationFn: async (status: string) => {
      const response = await apiRequest("PATCH", `/api/orders/${order.id}/status`, { status });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/orders"] });
      toast({
        title: "Order Updated",
        description: "Order status has been updated successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update order status.",
        variant: "destructive",
      });
    },
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-primary text-primary-foreground";
      case "preparing": return "bg-accent text-accent-foreground";
      case "ready": return "bg-secondary text-secondary-foreground";
      case "completed": return "bg-muted text-muted-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getNextStatusAction = () => {
    switch (order.status) {
      case "pending": 
        return [
          { status: "preparing", label: "Accept", icon: "fas fa-check", variant: "secondary" },
          { status: "cancelled", label: "Reject", icon: "fas fa-times", variant: "destructive" }
        ];
      case "preparing": 
        return [{ status: "ready", label: "Mark Ready", icon: "fas fa-utensils", variant: "secondary" }];
      case "ready": 
        return [{ status: "completed", label: "Mark Served", icon: "fas fa-check-double", variant: "primary" }];
      default: 
        return [];
    }
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const actions = getNextStatusAction();

  return (
    <div className="bg-card border border-border rounded-lg shadow-sm p-4" data-testid={`card-order-${order.id}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status!)}`} data-testid={`badge-order-status-${order.id}`}>
            Order #{order.id?.slice(-4) || '0000'}
          </span>
        </div>
        <span className="text-sm text-muted-foreground" data-testid={`text-order-time-${order.id}`}>
          {order.createdAt ? formatTime(order.createdAt) : 'Unknown'}
        </span>
      </div>
      
      <div className="mb-3">
        {order.table && (
          <div className="flex items-center text-sm text-muted-foreground mb-1">
            <i className="fas fa-table mr-2"></i>
            <span data-testid={`text-order-table-${order.id}`}>
              Table {order.table.tableNumber} • {order.table.section}
            </span>
          </div>
        )}
        <div className="flex items-center text-sm text-muted-foreground">
          <i className="fas fa-user mr-2"></i>
          <span data-testid={`text-order-customer-${order.id}`}>
            {order.customerName}
          </span>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        {order.orderItems.map((item, index) => (
          <div key={index} className="flex justify-between text-sm" data-testid={`order-item-${order.id}-${index}`}>
            <span data-testid={`text-order-item-name-${order.id}-${index}`}>
              {item.quantity}x {item.menuItem.name}
            </span>
            <span data-testid={`text-order-item-price-${order.id}-${index}`}>
              ${item.totalPrice}
            </span>
          </div>
        ))}
        
        <div className="border-t border-border pt-2">
          <div className="flex justify-between font-semibold">
            <span>Total</span>
            <span data-testid={`text-order-total-${order.id}`}>
              ${order.totalAmount}
            </span>
          </div>
        </div>
      </div>

      {order.status === "preparing" && (
        <div className="mb-3">
          <div className="bg-accent/20 border border-accent/30 rounded p-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Preparing</span>
              <span className="text-xs text-muted-foreground" data-testid={`text-preparing-duration-${order.id}`}>
                Started {Math.floor((Date.now() - new Date(order.updatedAt!).getTime()) / 60000)} min ago
              </span>
            </div>
            <div className="w-full bg-muted rounded-full h-2 mt-2">
              <div className="bg-accent h-2 rounded-full w-3/4"></div>
            </div>
          </div>
        </div>
      )}

      {order.status === "ready" && (
        <div className="mb-3">
          <div className="bg-secondary/20 border border-secondary/30 rounded p-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Ready for Pickup</span>
              <i className="fas fa-bell text-secondary"></i>
            </div>
          </div>
        </div>
      )}

      {actions.length > 0 && (
        <div className="flex space-x-2">
          {actions.map((action, index) => (
            <Button
              key={index}
              onClick={() => updateStatusMutation.mutate(action.status)}
              disabled={updateStatusMutation.isPending}
              variant={action.variant as any}
              className="flex-1"
              data-testid={`button-${action.status}-${order.id}`}
            >
              {updateStatusMutation.isPending ? (
                <i className="fas fa-spinner fa-spin mr-1"></i>
              ) : (
                <i className={`${action.icon} mr-1`}></i>
              )}
              {action.label}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}

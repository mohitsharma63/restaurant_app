import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import OrderCard from "@/components/order-card";
import { useWebSocket } from "@/hooks/use-websocket";
import { useToast } from "@/hooks/use-toast";
import { type Order } from "@shared/schema";

export default function Dashboard() {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Get all orders
  const { data: orders = [], isLoading } = useQuery({
    queryKey: ['/api/orders'],
  });

  // WebSocket for real-time updates
  useWebSocket((message) => {
    if (message.type === 'new_order') {
      queryClient.invalidateQueries({ queryKey: ['/api/orders'] });
      toast({
        title: "New Order!",
        description: `Order #${message.order.id.slice(-6)} has been placed.`
      });
    } else if (message.type === 'order_status_update') {
      queryClient.invalidateQueries({ queryKey: ['/api/orders'] });
    }
  });

  // Filter orders based on status
  const filteredOrders = orders.filter((order: Order) => {
    if (statusFilter === "all") return true;
    return order.status === statusFilter;
  });

  // Count orders by status
  const statusCounts = orders.reduce((acc: Record<string, number>, order: Order) => {
    acc[order.status] = (acc[order.status] || 0) + 1;
    return acc;
  }, {});

  // Update order status mutation
  const updateStatusMutation = useMutation({
    mutationFn: async ({ orderId, status }: { orderId: string, status: string }) => {
      const response = await apiRequest("PATCH", `/api/orders/${orderId}/status`, { status });
      return response.json();
    },
    onSuccess: (updatedOrder) => {
      queryClient.invalidateQueries({ queryKey: ['/api/orders'] });
      toast({
        title: "Order Updated",
        description: `Order #${updatedOrder.id.slice(-6)} is now ${updatedOrder.status}.`
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update order status.",
        variant: "destructive"
      });
    }
  });

  const handleStatusUpdate = (orderId: string, status: string) => {
    updateStatusMutation.mutate({ orderId, status });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Loading Dashboard...</h2>
          <p className="text-muted-foreground">Please wait while we load your orders</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Dashboard Header */}
      <div className="bg-card border-b border-border">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold" data-testid="heading-dashboard">
                Restaurant Dashboard
              </h1>
              <p className="text-muted-foreground">Delicious Bistro - Order Management</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600" data-testid="count-pending">
                  {statusCounts.pending || 0}
                </div>
                <div className="text-xs text-muted-foreground">Pending</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600" data-testid="count-preparing">
                  {statusCounts.preparing || 0}
                </div>
                <div className="text-xs text-muted-foreground">Preparing</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600" data-testid="count-ready">
                  {statusCounts.ready || 0}
                </div>
                <div className="text-xs text-muted-foreground">Ready</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Orders Filter */}
      <div className="bg-muted border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex space-x-4">
            {["all", "pending", "preparing", "ready", "completed"].map((status) => (
              <Button
                key={status}
                variant={statusFilter === status ? "default" : "outline"}
                size="sm"
                onClick={() => setStatusFilter(status)}
                data-testid={`button-filter-${status}`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)} Orders
                {status !== "all" && statusCounts[status] > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {statusCounts[status]}
                  </Badge>
                )}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Orders Grid */}
      <div className="container mx-auto px-4 py-6">
        {filteredOrders.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <h3 className="text-lg font-semibold mb-2" data-testid="text-no-orders">
                No orders found
              </h3>
              <p className="text-muted-foreground">
                {statusFilter === "all" 
                  ? "No orders have been placed yet." 
                  : `No ${statusFilter} orders at the moment.`
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredOrders.map((order: Order) => (
              <OrderCard
                key={order.id}
                order={order}
                onStatusUpdate={handleStatusUpdate}
                isUpdating={updateStatusMutation.isPending}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

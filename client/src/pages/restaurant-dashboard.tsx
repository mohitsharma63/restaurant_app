import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import OrderCard from "@/components/order-card";
import { useWebSocket } from "@/hooks/use-websocket";
import type { OrderWithDetails } from "@shared/schema";

export default function RestaurantDashboard() {
  const [selectedStatus, setSelectedStatus] = useState("pending");
  
  const { data: allOrders = [], isLoading, refetch } = useQuery<OrderWithDetails[]>({
    queryKey: ["/api/orders"],
  });

  // WebSocket for real-time updates
  useWebSocket({
    onMessage: (data) => {
      if (data.type === 'new_order' || data.type === 'order_status_update') {
        refetch();
      }
    },
  });

  const statusTabs = [
    { key: "pending", label: "Pending Orders", color: "bg-primary" },
    { key: "preparing", label: "Preparing", color: "bg-accent" },
    { key: "ready", label: "Ready", color: "bg-secondary" },
    { key: "completed", label: "Completed", color: "bg-muted" },
  ];

  const getOrdersByStatus = (status: string) => {
    return allOrders.filter(order => order.status === status);
  };

  const getTotalRevenue = () => {
    const todayOrders = allOrders.filter(order => {
      const orderDate = new Date(order.createdAt!);
      const today = new Date();
      return orderDate.toDateString() === today.toDateString();
    });
    
    return todayOrders.reduce((total, order) => {
      return total + parseFloat(order.totalAmount);
    }, 0);
  };

  if (isLoading) {
    return (
      <div className="pt-16 p-4">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-1/3"></div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-48 bg-muted rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-16">
      {/* Dashboard Header */}
      <div className="bg-card border-b border-border p-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold font-serif" data-testid="text-dashboard-title">
              Restaurant Dashboard
            </h1>
            <p className="text-muted-foreground">Manage orders and restaurant operations</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm font-medium">Today's Revenue</p>
              <p className="text-2xl font-bold text-primary" data-testid="text-revenue">
                ${getTotalRevenue().toFixed(2)}
              </p>
            </div>
            <button className="bg-secondary text-secondary-foreground px-4 py-2 rounded-lg hover:bg-secondary/90 transition-colors" data-testid="button-logout">
              <i className="fas fa-sign-out-alt mr-2"></i>Logout
            </button>
          </div>
        </div>
      </div>

      {/* Order Status Tabs */}
      <div className="bg-card border-b border-border">
        <div className="max-w-6xl mx-auto">
          <div className="flex space-x-6 px-4">
            {statusTabs.map((tab) => {
              const count = getOrdersByStatus(tab.key).length;
              return (
                <button
                  key={tab.key}
                  onClick={() => setSelectedStatus(tab.key)}
                  className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                    selectedStatus === tab.key
                      ? "border-primary text-primary bg-primary/5"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                  data-testid={`tab-status-${tab.key}`}
                >
                  {tab.label}{" "}
                  <span className={`ml-1 px-2 py-1 rounded-full text-xs ${tab.color} ${
                    selectedStatus === tab.key ? 'text-white' : 'text-muted-foreground'
                  }`} data-testid={`badge-count-${tab.key}`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Orders List */}
      <div className="max-w-6xl mx-auto p-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {getOrdersByStatus(selectedStatus).map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
        
        {getOrdersByStatus(selectedStatus).length === 0 && (
          <div className="text-center py-12" data-testid={`text-no-orders-${selectedStatus}`}>
            <i className="fas fa-inbox text-4xl text-muted-foreground mb-4"></i>
            <h3 className="text-lg font-medium mb-2">No {selectedStatus} orders</h3>
            <p className="text-muted-foreground">
              Orders with "{selectedStatus}" status will appear here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

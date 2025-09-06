import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Restaurant, MenuItem, Order, Table as TableType } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Loader2, Utensils, List, TableIcon, BarChart, Edit, Trash2, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type AdminSection = "menu-management" | "orders" | "tables" | "analytics";

export default function AdminPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeSection, setActiveSection] = useState<AdminSection>("menu-management");

  // Fetch restaurant
  const { data: restaurant, isLoading: restaurantLoading } = useQuery<Restaurant>({
    queryKey: ["/api/restaurants/mine"],
    enabled: !!user,
  });

  // Fetch menu items
  const { data: menuItems = [] } = useQuery<MenuItem[]>({
    queryKey: ["/api/restaurants", restaurant?.id, "menu-items"],
    enabled: !!restaurant,
  });

  // Fetch orders
  const { data: orders = [] } = useQuery<Order[]>({
    queryKey: ["/api/restaurants", restaurant?.id, "orders"],
    enabled: !!restaurant,
    refetchInterval: 10000, // Poll every 10 seconds
  });

  // Fetch tables
  const { data: tables = [] } = useQuery<TableType[]>({
    queryKey: ["/api/restaurants", restaurant?.id, "tables"],
    enabled: !!restaurant,
  });

  // Update order status mutation
  const updateOrderStatusMutation = useMutation({
    mutationFn: async ({ orderId, status }: { orderId: string; status: string }) => {
      const res = await apiRequest("PATCH", `/api/orders/${orderId}/status`, { status });
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/restaurants", restaurant?.id, "orders"] });
      toast({
        title: "Order Updated",
        description: "Order status has been updated successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Update Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const formatCurrency = (amount: string | number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(typeof amount === 'string' ? parseFloat(amount) : amount);
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "pending": return "secondary";
      case "confirmed": return "default";
      case "preparing": return "default";
      case "ready": return "default";
      case "served": return "outline";
      case "cancelled": return "destructive";
      default: return "secondary";
    }
  };

  if (restaurantLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted">
        <Card>
          <CardContent className="p-8 text-center">
            <h2 className="text-xl font-serif font-semibold mb-2">No Restaurant Found</h2>
            <p className="text-muted-foreground mb-4">
              You need to create a restaurant first to access the admin panel.
            </p>
            <Button data-testid="button-create-restaurant">
              Create Restaurant
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const activeOrders = orders.filter(order => !["served", "cancelled"].includes(order.status));

  return (
    <div className="min-h-screen bg-muted">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Admin Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-serif font-semibold text-foreground">Admin Dashboard</h2>
            <p className="text-muted-foreground">Manage {restaurant.name}</p>
          </div>
          <Button variant="secondary" onClick={() => window.history.back()} data-testid="button-back">
            Back
          </Button>
        </div>

        {/* Admin Navigation */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Button
            variant={activeSection === "menu-management" ? "default" : "outline"}
            className="h-auto p-4 flex-col"
            onClick={() => setActiveSection("menu-management")}
            data-testid="button-menu-management"
          >
            <Utensils className="w-8 h-8 text-primary mb-2" />
            <span className="font-medium">Menu Management</span>
          </Button>
          <Button
            variant={activeSection === "orders" ? "default" : "outline"}
            className="h-auto p-4 flex-col"
            onClick={() => setActiveSection("orders")}
            data-testid="button-orders"
          >
            <List className="w-8 h-8 text-primary mb-2" />
            <span className="font-medium">Orders ({activeOrders.length})</span>
          </Button>
          <Button
            variant={activeSection === "tables" ? "default" : "outline"}
            className="h-auto p-4 flex-col"
            onClick={() => setActiveSection("tables")}
            data-testid="button-tables"
          >
            <TableIcon className="w-8 h-8 text-primary mb-2" />
            <span className="font-medium">Tables</span>
          </Button>
          <Button
            variant={activeSection === "analytics" ? "default" : "outline"}
            className="h-auto p-4 flex-col"
            onClick={() => setActiveSection("analytics")}
            data-testid="button-analytics"
          >
            <BarChart className="w-8 h-8 text-primary mb-2" />
            <span className="font-medium">Analytics</span>
          </Button>
        </div>

        {/* Menu Management Section */}
        {activeSection === "menu-management" && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Menu Items</CardTitle>
              <Button data-testid="button-add-item">
                Add Item
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {menuItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium" data-testid={`text-item-name-${item.id}`}>
                            {item.name}
                          </div>
                          <div className="text-sm text-muted-foreground line-clamp-1">
                            {item.description}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">
                        {formatCurrency(item.price)}
                      </TableCell>
                      <TableCell>
                        <Badge variant={item.isAvailable ? "default" : "destructive"}>
                          {item.isAvailable ? "Available" : "Out of Stock"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="sm" data-testid={`button-edit-${item.id}`}>
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" data-testid={`button-delete-${item.id}`}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        {/* Orders Section */}
        {activeSection === "orders" && (
          <Card>
            <CardHeader>
              <CardTitle>Active Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {activeOrders.map((order) => (
                  <Card key={order.id} className="border">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-semibold" data-testid={`text-order-table-${order.id}`}>
                          Table {/* You'd need to join with table data to show table number */}
                        </span>
                        <Badge variant={getStatusBadgeVariant(order.status)}>
                          {order.status}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground mb-3">
                        Order #{order.id.slice(0, 8)}...
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-primary">
                          {formatCurrency(order.total)}
                        </span>
                        <div className="flex space-x-2">
                          {order.status === "pending" && (
                            <Button
                              size="sm"
                              onClick={() => updateOrderStatusMutation.mutate({
                                orderId: order.id,
                                status: "confirmed"
                              })}
                              data-testid={`button-confirm-${order.id}`}
                            >
                              Confirm
                            </Button>
                          )}
                          {order.status === "confirmed" && (
                            <Button
                              size="sm"
                              onClick={() => updateOrderStatusMutation.mutate({
                                orderId: order.id,
                                status: "preparing"
                              })}
                              data-testid={`button-preparing-${order.id}`}
                            >
                              Preparing
                            </Button>
                          )}
                          {order.status === "preparing" && (
                            <Button
                              size="sm"
                              onClick={() => updateOrderStatusMutation.mutate({
                                orderId: order.id,
                                status: "ready"
                              })}
                              data-testid={`button-ready-${order.id}`}
                            >
                              Ready
                            </Button>
                          )}
                          {order.status === "ready" && (
                            <Button
                              size="sm"
                              onClick={() => updateOrderStatusMutation.mutate({
                                orderId: order.id,
                                status: "served"
                              })}
                              data-testid={`button-served-${order.id}`}
                            >
                              Served
                            </Button>
                          )}
                          <Button variant="outline" size="sm" data-testid={`button-view-${order.id}`}>
                            <Eye className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tables Section */}
        {activeSection === "tables" && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Tables</CardTitle>
              <Button data-testid="button-add-table">
                Add Table
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {tables.map((table) => (
                  <Card key={table.id} className="border">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-lg" data-testid={`text-table-${table.id}`}>
                          Table {table.tableNumber}
                        </span>
                        <Badge variant={table.isActive ? "default" : "secondary"}>
                          {table.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground mb-3">
                        QR: {table.qrCode}
                      </div>
                      <Button variant="outline" size="sm" className="w-full" data-testid={`button-qr-${table.id}`}>
                        View QR Code
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Analytics Section */}
        {activeSection === "analytics" && (
          <Card>
            <CardHeader>
              <CardTitle>Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">{orders.length}</div>
                  <div className="text-sm text-muted-foreground">Total Orders</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">{activeOrders.length}</div>
                  <div className="text-sm text-muted-foreground">Active Orders</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">
                    {formatCurrency(orders.reduce((sum, order) => sum + parseFloat(order.total), 0))}
                  </div>
                  <div className="text-sm text-muted-foreground">Total Revenue</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

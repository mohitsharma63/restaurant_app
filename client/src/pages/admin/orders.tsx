
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Filter, Search, Clock, ChefHat, CheckCircle, XCircle, Eye } from "lucide-react";

// Static orders data
const staticOrders = [
  {
    id: "ORD-2024-001",
    customerName: "John Smith",
    customerPhone: "+1 555-0123",
    table: "Table 5",
    items: [
      { name: "Grilled Salmon", quantity: 1, price: 28.99, notes: "Medium rare" },
      { name: "Caesar Salad", quantity: 1, price: 12.99, notes: "Extra dressing" },
      { name: "Red Wine", quantity: 1, price: 8.99, notes: "" }
    ],
    total: 50.97,
    status: "preparing",
    orderTime: "2024-01-15 12:30:00",
    estimatedTime: "15 mins",
    paymentStatus: "paid",
    specialInstructions: "No onions please"
  },
  {
    id: "ORD-2024-002",
    customerName: "Sarah Johnson",
    customerPhone: "+1 555-0124",
    table: "Table 12",
    items: [
      { name: "Beef Burger", quantity: 1, price: 18.50, notes: "Well done" },
      { name: "French Fries", quantity: 1, price: 6.99, notes: "Extra crispy" },
      { name: "Coca Cola", quantity: 2, price: 2.99, notes: "With ice" }
    ],
    total: 31.47,
    status: "ready",
    orderTime: "2024-01-15 12:25:00",
    estimatedTime: "Ready",
    paymentStatus: "paid",
    specialInstructions: ""
  },
  {
    id: "ORD-2024-003",
    customerName: "Mike Davis",
    customerPhone: "+1 555-0125",
    table: "Table 8",
    items: [
      { name: "Chicken Pasta", quantity: 1, price: 24.99, notes: "Extra sauce" },
      { name: "Garlic Bread", quantity: 2, price: 4.99, notes: "Well toasted" }
    ],
    total: 34.97,
    status: "pending",
    orderTime: "2024-01-15 12:35:00",
    estimatedTime: "20 mins",
    paymentStatus: "pending",
    specialInstructions: "Allergic to nuts"
  },
  {
    id: "ORD-2024-004",
    customerName: "Emily Chen",
    customerPhone: "+1 555-0126",
    table: "Table 3",
    items: [
      { name: "Vegetarian Pizza", quantity: 1, price: 19.99, notes: "Thin crust" },
      { name: "Side Salad", quantity: 1, price: 7.99, notes: "Balsamic dressing" }
    ],
    total: 27.98,
    status: "preparing",
    orderTime: "2024-01-15 12:28:00",
    estimatedTime: "12 mins",
    paymentStatus: "paid",
    specialInstructions: ""
  },
  {
    id: "ORD-2024-005",
    customerName: "David Wilson",
    customerPhone: "+1 555-0127",
    table: "Table 7",
    items: [
      { name: "Fish Tacos", quantity: 3, price: 16.99, notes: "Spicy sauce" },
      { name: "Guacamole", quantity: 1, price: 6.99, notes: "Extra chips" }
    ],
    total: 57.96,
    status: "completed",
    orderTime: "2024-01-15 11:45:00",
    estimatedTime: "Completed",
    paymentStatus: "paid",
    specialInstructions: ""
  },
  {
    id: "ORD-2024-006",
    customerName: "Lisa Brown",
    customerPhone: "+1 555-0128",
    table: "Table 15",
    items: [
      { name: "Steak Dinner", quantity: 1, price: 32.99, notes: "Medium" },
      { name: "Mashed Potatoes", quantity: 1, price: 4.99, notes: "" },
      { name: "Green Beans", quantity: 1, price: 3.99, notes: "" }
    ],
    total: 41.97,
    status: "pending",
    orderTime: "2024-01-15 12:40:00",
    estimatedTime: "25 mins",
    paymentStatus: "paid",
    specialInstructions: "Birthday celebration - please add candle to dessert"
  }
];

export default function AdminOrders() {
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);

  // Filter orders based on status and search
  const filteredOrders = staticOrders.filter((order) => {
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    const matchesSearch = order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.table.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Count orders by status
  const statusCounts = staticOrders.reduce((acc: Record<string, number>, order) => {
    acc[order.status] = (acc[order.status] || 0) + 1;
    return acc;
  }, {});

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'preparing': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'ready': return 'bg-green-100 text-green-800 border-green-200';
      case 'completed': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'preparing': return <ChefHat className="w-4 h-4" />;
      case 'ready': return <CheckCircle className="w-4 h-4" />;
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      default: return <XCircle className="w-4 h-4" />;
    }
  };

  const formatTime = (timeString: string) => {
    const date = new Date(timeString);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Page Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Order Management</h1>
          <p className="text-gray-600 mt-1">Manage all restaurant orders</p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="bg-white">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-gray-900">{staticOrders.length}</div>
            <p className="text-sm text-gray-600">Total Orders</p>
          </CardContent>
        </Card>
        <Card className="bg-yellow-50 border-yellow-200">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">{statusCounts.pending || 0}</div>
            <p className="text-sm text-yellow-700">Pending</p>
          </CardContent>
        </Card>
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{statusCounts.preparing || 0}</div>
            <p className="text-sm text-blue-700">Preparing</p>
          </CardContent>
        </Card>
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{statusCounts.ready || 0}</div>
            <p className="text-sm text-green-700">Ready</p>
          </CardContent>
        </Card>
        <Card className="bg-gray-50 border-gray-200">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-gray-600">{statusCounts.completed || 0}</div>
            <p className="text-sm text-gray-700">Completed</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filter & Search Orders
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by customer name, order ID, or table..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Orders</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="preparing">Preparing</SelectItem>
                <SelectItem value="ready">Ready</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Orders Grid */}
      <div>
        {filteredOrders.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <h3 className="text-lg font-semibold mb-2">No orders found</h3>
              <p className="text-muted-foreground">
                {statusFilter === "all" 
                  ? "No orders match your search criteria." 
                  : `No ${statusFilter} orders match your search.`
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredOrders.map((order) => (
              <Card key={order.id} className="bg-white hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{order.customerName}</CardTitle>
                      <p className="text-sm text-gray-600">{order.table} • {formatTime(order.orderTime)}</p>
                    </div>
                    <Badge className={`${getStatusColor(order.status)} flex items-center gap-1`}>
                      {getStatusIcon(order.status)}
                      {order.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Order Items:</h4>
                    <div className="space-y-1">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span>{item.quantity}x {item.name}</span>
                          <span className="font-medium">${item.price.toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {order.specialInstructions && (
                    <div className="p-2 bg-yellow-50 rounded border-l-4 border-yellow-400">
                      <p className="text-xs font-medium text-yellow-800">Special Instructions:</p>
                      <p className="text-sm text-yellow-700">{order.specialInstructions}</p>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-2 border-t">
                    <div>
                      <p className="text-sm text-gray-600">Total Amount</p>
                      <p className="text-xl font-bold text-gray-900">${order.total.toFixed(2)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">ETA</p>
                      <p className="font-medium">{order.estimatedTime}</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {order.status === 'pending' && (
                      <Button size="sm" className="flex-1">
                        Start Preparing
                      </Button>
                    )}
                    {order.status === 'preparing' && (
                      <Button size="sm" className="flex-1" variant="secondary">
                        Mark Ready
                      </Button>
                    )}
                    {order.status === 'ready' && (
                      <Button size="sm" className="flex-1" variant="default">
                        Mark Served
                      </Button>
                    )}
                    <Button size="sm" variant="outline" className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      View
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

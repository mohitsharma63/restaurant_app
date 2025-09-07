
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  ShoppingCart, 
  Users, 
  DollarSign, 
  Clock,
  TrendingUp,
  AlertCircle,
  Star,
  ChefHat,
  Calendar,
  Target
} from "lucide-react";

// Static data
const staticStats = {
  totalOrders: 247,
  pendingOrders: 12,
  preparingOrders: 8,
  readyOrders: 5,
  completedOrders: 222,
  totalRevenue: 18450.75,
  todayRevenue: 1250.50,
  avgOrderValue: 74.80,
  totalCustomers: 189,
  activeCustomers: 45
};

const recentOrders = [
  {
    id: "ORD-2024-001",
    customerName: "John Smith",
    table: "Table 5",
    items: ["Grilled Salmon", "Caesar Salad"],
    total: 45.99,
    status: "preparing",
    orderTime: "12:30 PM",
    estimatedTime: "15 mins"
  },
  {
    id: "ORD-2024-002", 
    customerName: "Sarah Johnson",
    table: "Table 12",
    items: ["Beef Burger", "French Fries", "Coke"],
    total: 28.50,
    status: "ready",
    orderTime: "12:25 PM",
    estimatedTime: "Ready"
  },
  {
    id: "ORD-2024-003",
    customerName: "Mike Davis",
    table: "Table 8",
    items: ["Chicken Pasta", "Garlic Bread"],
    total: 32.75,
    status: "pending",
    orderTime: "12:35 PM",
    estimatedTime: "20 mins"
  },
  {
    id: "ORD-2024-004",
    customerName: "Emily Chen",
    table: "Table 3",
    items: ["Vegetarian Pizza", "Side Salad"],
    total: 24.99,
    status: "preparing",
    orderTime: "12:28 PM",
    estimatedTime: "12 mins"
  }
];

const topMenuItems = [
  { name: "Grilled Salmon", orders: 45, revenue: 1125.50 },
  { name: "Beef Burger", orders: 38, revenue: 874.50 },
  { name: "Chicken Pasta", orders: 32, revenue: 1048.00 },
  { name: "Vegetarian Pizza", orders: 28, revenue: 699.72 }
];

export default function AdminDashboard() {
  const [timeFilter, setTimeFilter] = useState("today");

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'preparing': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'ready': return 'bg-green-100 text-green-800 border-green-200';
      case 'completed': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Page Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Restaurant management overview</p>
        </div>
        <div className="flex gap-2">
          {["today", "week", "month"].map((filter) => (
            <Button
              key={filter}
              variant={timeFilter === filter ? "default" : "outline"}
              size="sm"
              onClick={() => setTimeFilter(filter)}
              className="capitalize"
            >
              {filter}
            </Button>
          ))}
        </div>
      </div>

      {/* Main Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-700">Total Orders</CardTitle>
            <ShoppingCart className="h-5 w-5 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-900">{staticStats.totalOrders}</div>
            <p className="text-xs text-blue-600 mt-1 flex items-center">
              <TrendingUp className="w-3 h-3 mr-1" />
              +12% from last month
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-700">Revenue</CardTitle>
            <DollarSign className="h-5 w-5 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-900">
              ${staticStats.totalRevenue.toLocaleString()}
            </div>
            <p className="text-xs text-green-600 mt-1">
              Today: ${staticStats.todayRevenue}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-700">Customers</CardTitle>
            <Users className="h-5 w-5 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-900">{staticStats.totalCustomers}</div>
            <p className="text-xs text-purple-600 mt-1">
              {staticStats.activeCustomers} active today
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-700">Avg Order</CardTitle>
            <Target className="h-5 w-5 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-900">
              ${staticStats.avgOrderValue}
            </div>
            <p className="text-xs text-orange-600 mt-1">Per order value</p>
          </CardContent>
        </Card>
      </div>

      {/* Order Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-yellow-400">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-yellow-600">{staticStats.pendingOrders}</div>
                <p className="text-sm text-gray-600">Pending Orders</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-400">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-blue-600">{staticStats.preparingOrders}</div>
                <p className="text-sm text-gray-600">Preparing</p>
              </div>
              <ChefHat className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-400">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-green-600">{staticStats.readyOrders}</div>
                <p className="text-sm text-gray-600">Ready to Serve</p>
              </div>
              <AlertCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-gray-400">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-gray-600">{staticStats.completedOrders}</div>
                <p className="text-sm text-gray-600">Completed</p>
              </div>
              <Star className="h-8 w-8 text-gray-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="w-5 h-5" />
              Recent Orders
            </CardTitle>
            <p className="text-sm text-gray-600">Latest orders requiring attention</p>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="font-semibold text-gray-900">{order.customerName}</h4>
                    <Badge variant="outline" className="text-xs">
                      {order.table}
                    </Badge>
                    <Badge className={`text-xs ${getStatusColor(order.status)}`}>
                      {order.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">
                    {order.items.join(", ")}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span>Order: {order.orderTime}</span>
                    <span>ETA: {order.estimatedTime}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-gray-900">${order.total}</div>
                  <Button size="sm" variant="outline" className="mt-2">
                    Update Status
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Top Menu Items */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="w-5 h-5" />
              Top Menu Items
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {topMenuItems.map((item, index) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-sm">
                    {index + 1}
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{item.name}</h4>
                    <p className="text-sm text-gray-500">{item.orders} orders</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-green-600">
                    ${item.revenue.toFixed(2)}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

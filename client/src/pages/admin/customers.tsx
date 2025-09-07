
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Users, 
  Search, 
  Star, 
  Phone, 
  Mail, 
  Calendar,
  MapPin,
  TrendingUp,
  ShoppingBag,
  Heart,
  Filter
} from "lucide-react";

// Static customer data
const staticCustomers = [
  {
    id: "CUST-001",
    name: "John Smith",
    email: "john.smith@email.com",
    phone: "+1 555-0123",
    address: "123 Main St, New York, NY 10001",
    joinDate: "2023-08-15",
    totalOrders: 24,
    totalSpent: 1842.56,
    avgOrderValue: 76.77,
    lastOrder: "2024-01-10",
    status: "active",
    favoriteItems: ["Grilled Salmon", "Caesar Salad", "Red Wine"],
    loyaltyPoints: 380,
    preferredTable: "Table 5",
    dietaryRestrictions: ["None"],
    rating: 4.8
  },
  {
    id: "CUST-002",
    name: "Sarah Johnson",
    email: "sarah.johnson@email.com",
    phone: "+1 555-0124",
    address: "456 Oak Ave, Brooklyn, NY 11201",
    joinDate: "2023-09-22",
    totalOrders: 18,
    totalSpent: 1256.34,
    avgOrderValue: 69.80,
    lastOrder: "2024-01-12",
    status: "active",
    favoriteItems: ["Beef Burger", "French Fries", "Chocolate Cake"],
    loyaltyPoints: 251,
    preferredTable: "Table 12",
    dietaryRestrictions: ["Gluten-sensitive"],
    rating: 4.9
  },
  {
    id: "CUST-003",
    name: "Mike Davis",
    email: "mike.davis@email.com",
    phone: "+1 555-0125",
    address: "789 Pine St, Manhattan, NY 10002",
    joinDate: "2023-07-08",
    totalOrders: 31,
    totalSpent: 2145.78,
    avgOrderValue: 69.22,
    lastOrder: "2024-01-08",
    status: "vip",
    favoriteItems: ["Chicken Pasta", "Garlic Bread", "Tiramisu"],
    loyaltyPoints: 642,
    preferredTable: "Table 8",
    dietaryRestrictions: ["Nut Allergy"],
    rating: 4.7
  },
  {
    id: "CUST-004",
    name: "Emily Chen",
    email: "emily.chen@email.com",
    phone: "+1 555-0126",
    address: "321 Elm St, Queens, NY 11101",
    joinDate: "2023-11-03",
    totalOrders: 12,
    totalSpent: 768.92,
    avgOrderValue: 64.08,
    lastOrder: "2024-01-05",
    status: "active",
    favoriteItems: ["Vegetarian Pizza", "Side Salad", "Green Tea"],
    loyaltyPoints: 154,
    preferredTable: "Table 3",
    dietaryRestrictions: ["Vegetarian"],
    rating: 4.6
  },
  {
    id: "CUST-005",
    name: "David Wilson",
    email: "david.wilson@email.com",
    phone: "+1 555-0127",
    address: "654 Maple Dr, Bronx, NY 10451",
    joinDate: "2023-06-14",
    totalOrders: 45,
    totalSpent: 3892.45,
    avgOrderValue: 86.50,
    lastOrder: "2024-01-14",
    status: "vip",
    favoriteItems: ["Fish Tacos", "Guacamole", "Margarita"],
    loyaltyPoints: 973,
    preferredTable: "Table 7",
    dietaryRestrictions: ["None"],
    rating: 4.9
  },
  {
    id: "CUST-006",
    name: "Lisa Brown",
    email: "lisa.brown@email.com",
    phone: "+1 555-0128",
    address: "987 Cedar Ln, Staten Island, NY 10301",
    joinDate: "2023-12-01",
    totalOrders: 8,
    totalSpent: 456.78,
    avgOrderValue: 57.10,
    lastOrder: "2024-01-06",
    status: "new",
    favoriteItems: ["Steak Dinner", "Mashed Potatoes", "Apple Pie"],
    loyaltyPoints: 91,
    preferredTable: "Table 15",
    dietaryRestrictions: ["Low-sodium"],
    rating: 4.5
  }
];

export default function AdminCustomers() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("totalSpent");

  // Filter and sort customers
  const filteredCustomers = staticCustomers
    .filter((customer) => {
      const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           customer.phone.includes(searchTerm);
      const matchesStatus = statusFilter === "all" || customer.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "totalSpent":
          return b.totalSpent - a.totalSpent;
        case "totalOrders":
          return b.totalOrders - a.totalOrders;
        case "rating":
          return b.rating - a.rating;
        case "joinDate":
          return new Date(b.joinDate).getTime() - new Date(a.joinDate).getTime();
        default:
          return 0;
      }
    });

  // Calculate stats
  const stats = {
    total: staticCustomers.length,
    active: staticCustomers.filter(c => c.status === 'active').length,
    vip: staticCustomers.filter(c => c.status === 'vip').length,
    new: staticCustomers.filter(c => c.status === 'new').length,
    avgSpent: staticCustomers.reduce((sum, c) => sum + c.totalSpent, 0) / staticCustomers.length
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'vip': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'active': return 'bg-green-100 text-green-800 border-green-200';
      case 'new': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Customer Management</h1>
        <p className="text-gray-600 mt-1">View and manage customer data</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-blue-900">{stats.total}</div>
                <p className="text-sm text-blue-700">Total Customers</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-green-900">{stats.active}</div>
                <p className="text-sm text-green-700">Active Customers</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-purple-900">{stats.vip}</div>
                <p className="text-sm text-purple-700">VIP Customers</p>
              </div>
              <Star className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-orange-900">{stats.new}</div>
                <p className="text-sm text-orange-700">New Customers</p>
              </div>
              <Calendar className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-emerald-900">
                  ${stats.avgSpent.toFixed(0)}
                </div>
                <p className="text-sm text-emerald-700">Avg. Spent</p>
              </div>
              <ShoppingBag className="h-8 w-8 text-emerald-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Search & Filter Customers
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by name, email, or phone..."
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
                <SelectItem value="all">All Customers</SelectItem>
                <SelectItem value="vip">VIP</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="new">New</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="totalSpent">Total Spent</SelectItem>
                <SelectItem value="totalOrders">Total Orders</SelectItem>
                <SelectItem value="rating">Rating</SelectItem>
                <SelectItem value="joinDate">Join Date</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Customers Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredCustomers.map((customer) => (
          <Card key={customer.id} className="bg-white hover:shadow-lg transition-shadow">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold">
                      {getInitials(customer.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-lg">{customer.name}</h3>
                    <p className="text-sm text-gray-500">{customer.id}</p>
                  </div>
                </div>
                <Badge className={`${getStatusColor(customer.status)} uppercase text-xs`}>
                  {customer.status}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Contact Info */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Mail className="w-4 h-4" />
                  <span>{customer.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Phone className="w-4 h-4" />
                  <span>{customer.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="w-4 h-4" />
                  <span className="truncate">{customer.address}</span>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 py-3 border-t border-gray-100">
                <div>
                  <p className="text-sm text-gray-500">Total Orders</p>
                  <p className="font-semibold">{customer.totalOrders}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Spent</p>
                  <p className="font-semibold text-green-600">${customer.totalSpent.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Avg Order</p>
                  <p className="font-semibold">${customer.avgOrderValue.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Rating</p>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold">{customer.rating}</span>
                  </div>
                </div>
              </div>

              {/* Favorite Items */}
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Favorite Items:</p>
                <div className="flex flex-wrap gap-1">
                  {customer.favoriteItems.slice(0, 2).map((item, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {item}
                    </Badge>
                  ))}
                  {customer.favoriteItems.length > 2 && (
                    <Badge variant="outline" className="text-xs">
                      +{customer.favoriteItems.length - 2} more
                    </Badge>
                  )}
                </div>
              </div>

              {/* Loyalty & Preferences */}
              <div className="space-y-2 text-xs text-gray-500">
                <div className="flex justify-between">
                  <span>Loyalty Points:</span>
                  <span className="font-medium text-purple-600">{customer.loyaltyPoints}</span>
                </div>
                <div className="flex justify-between">
                  <span>Preferred Table:</span>
                  <span className="font-medium">{customer.preferredTable}</span>
                </div>
                <div className="flex justify-between">
                  <span>Last Order:</span>
                  <span className="font-medium">{formatDate(customer.lastOrder)}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <Button size="sm" variant="outline" className="flex-1">
                  View Profile
                </Button>
                <Button size="sm" className="flex-1">
                  Contact
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

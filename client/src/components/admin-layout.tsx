
import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  LayoutDashboard, 
  Menu, 
  ShoppingCart, 
  Users, 
  Settings, 
  LogOut,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

interface AdminLayoutProps {
  children: React.ReactNode;
  onLogout?: () => void;
}

export default function AdminLayout({ children, onLogout }: AdminLayoutProps) {
  const [location, setLocation] = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Static admin user data
  const adminUser = {
    name: "Admin User",
    email: "admin@deliciousbistro.com",
    avatar: "",
    role: "Administrator"
  };

  const navigationItems = [
    { path: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { path: "/admin/orders", label: "Orders", icon: ShoppingCart },
    { path: "/admin/menu", label: "Menu Management", icon: Menu },
    { path: "/admin/customers", label: "Customers", icon: Users },
    { path: "/admin/settings", label: "Settings", icon: Settings },
  ];

  const isActive = (path: string) => location === path;

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    } else {
      setLocation("/admin");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className={`fixed left-0 top-0 h-full bg-white border-r border-gray-200 transition-all duration-300 ${
        sidebarOpen ? 'w-64' : 'w-16'
      } z-50`}>
        {/* Sidebar Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            {sidebarOpen && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Admin Panel</h2>
                <p className="text-sm text-gray-500">Delicious Bistro</p>
              </div>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2"
            >
              {sidebarOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        {/* Admin User Info */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <Avatar className="w-10 h-10">
              <AvatarImage src={adminUser.avatar} alt={adminUser.name} />
              <AvatarFallback className="bg-blue-100 text-blue-600">
                {adminUser.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            {sidebarOpen && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {adminUser.name}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {adminUser.email}
                </p>
                <Badge variant="secondary" className="text-xs mt-1">
                  {adminUser.role}
                </Badge>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="p-4 space-y-2">
          {navigationItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <Button
                key={item.path}
                variant={isActive(item.path) ? "default" : "ghost"}
                onClick={() => setLocation(item.path)}
                className={`w-full justify-start ${!sidebarOpen && 'px-2'}`}
              >
                <IconComponent className={`w-4 h-4 ${sidebarOpen ? 'mr-3' : ''}`} />
                {sidebarOpen && item.label}
              </Button>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className="absolute bottom-4 left-4 right-4">
          <Button
            variant="outline"
            onClick={handleLogout}
            className={`w-full justify-start ${!sidebarOpen && 'px-2'}`}
          >
            <LogOut className={`w-4 h-4 ${sidebarOpen ? 'mr-3' : ''}`} />
            {sidebarOpen && "Logout"}
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className={`transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-16'}`}>
        {children}
      </div>
    </div>
  );
}

import { Route, Switch, useLocation } from "wouter";
import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin-layout";
import AdminLogin from "@/components/admin-login";
import AdminDashboard from "@/pages/admin/dashboard";
import AdminOrders from "@/pages/admin/orders";
import AdminMenu from "@/pages/admin/menu";
import AdminCustomers from "@/pages/admin/customers";
import AdminSettings from "@/pages/admin/settings";
import UnauthorizedAccess from "@/components/unauthorized-access";

export default function AdminRouter() {
  const [location, setLocation] = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check authentication status
    const checkAuth = () => {
      const token = localStorage.getItem('admin_token');
      setIsAuthenticated(!!token);
    };

    checkAuth();
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
    setLocation('/admin/dashboard');
  };

  // Use useEffect to handle redirects to avoid setState during render
  useEffect(() => {
    if (isAuthenticated && location.includes('/admin/login')) {
      setLocation('/admin/dashboard');
    }
  }, [isAuthenticated, location, setLocation]);

  // If not authenticated and not on login page, show login
  if (!isAuthenticated && !location.includes('/admin/login')) {
    return <AdminLogin onLogin={handleLogin} />;
  }

  return (
    <Switch>
      <Route path="/admin/login">
        <AdminLogin onLogin={handleLogin} />
      </Route>

      <Route path="/admin/:path*">
        <AdminLayout>
          <Switch>
            <Route path="/admin/dashboard" component={AdminDashboard} />
            <Route path="/admin/orders" component={AdminOrders} />
            <Route path="/admin/menu" component={AdminMenu} />
            <Route path="/admin/customers" component={AdminCustomers} />
            <Route path="/admin/settings" component={AdminSettings} />
            <Route component={UnauthorizedAccess} />
          </Switch>
        </AdminLayout>
      </Route>
    </Switch>
  );
}
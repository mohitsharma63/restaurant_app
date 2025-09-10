
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
      // Add your authentication logic here
      const token = localStorage.getItem('admin_token');
      setIsAuthenticated(!!token);
    };
    
    checkAuth();
  }, []);

  // If not authenticated and not on login page, redirect to login
  if (!isAuthenticated && !location.includes('/admin/login')) {
    return <AdminLogin />;
  }

  // If authenticated and on login page, redirect to dashboard
  if (isAuthenticated && location.includes('/admin/login')) {
    setLocation('/admin/dashboard');
    return null;
  }

  return (
    <Switch>
      <Route path="/admin/login">
        <AdminLogin />
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


import { useState } from "react";
import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import AdminLayout from "@/components/admin-layout";
import AdminLogin from "@/components/admin-login";

import NotFound from "@/pages/not-found";
import AdminDashboard from "@/pages/admin/dashboard";
import AdminOrders from "@/pages/admin/orders";
import AdminMenu from "@/pages/admin/menu";
import AdminCustomers from "@/pages/admin/customers";
import AdminSettings from "@/pages/admin/settings";
import Menu from "@/pages/menu";

function AdminRouter() {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  if (!isAdminLoggedIn) {
    return <AdminLogin onLogin={() => setIsAdminLoggedIn(true)} />;
  }

  return (
    <AdminLayout>
      <Switch>
        <Route path="/admin/dashboard" component={AdminDashboard} />
        <Route path="/admin/orders" component={AdminOrders} />
        <Route path="/admin/menu" component={AdminMenu} />
        <Route path="/admin/customers" component={AdminCustomers} />
        <Route path="/admin/settings" component={AdminSettings} />
        <Route path="/admin" component={AdminDashboard} />
        <Route component={NotFound} />
      </Switch>
    </AdminLayout>
  );
}

function App() {
  const [location] = useLocation();
  
  // Check if current route is admin route
  const isAdminRoute = location.startsWith('/admin');

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen bg-background">
          <Switch>
            {/* Customer menu routes - available without login */}
            <Route path="/menu" component={Menu} />
            <Route path="/menu/:restaurantId/:tableNumber" component={Menu} />
            
            {/* Admin routes - protected with login */}
            <Route path="/admin/:path*">
              <AdminRouter />
            </Route>
            
            {/* Default route */}
            <Route path="/">
              <Menu />
            </Route>
            
            {/* 404 for other routes */}
            <Route component={NotFound} />
          </Switch>
        </div>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;

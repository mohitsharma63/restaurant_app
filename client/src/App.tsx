import { useState, useEffect } from "react";
import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import AdminLayout from "@/components/admin-layout";
import AdminLogin from "@/components/admin-login";

import Menu from "@/pages/menu";
import Cart from "@/pages/cart";
import Dashboard from "@/pages/dashboard";
import OrderStatus from "@/pages/order-status";
import QrLanding from "@/pages/qr-landing";
import MobileLanding from "@/pages/mobile-landing";
import NotFound from "@/pages/not-found";
import UnauthorizedAccess from "@/components/unauthorized-access";

// Admin components
import AdminDashboard from "@/pages/admin/dashboard";
import AdminOrders from "@/pages/admin/orders";
import AdminMenu from "@/pages/admin/menu";
import AdminCustomers from "@/pages/admin/customers";
import AdminSettings from "@/pages/admin/settings";

function AdminRouter() {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [, setLocation] = useLocation();

  const handleLogin = () => {
    setIsAdminLoggedIn(true);
    setLocation('/admin/dashboard');
  };

  const handleLogout = () => {
    setIsAdminLoggedIn(false);
    setLocation('/admin/loging');
  };

  if (!isAdminLoggedIn) {
    return <AdminLogin onLogin={handleLogin} />;
  }

  return (
    <AdminLayout onLogout={handleLogout}>
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

// QR Authentication Component
function QRAuthWrapper({ children, restaurantId, tableNumber }: { 
  children: React.ReactNode; 
  restaurantId?: string; 
  tableNumber?: string; 
}) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Always allow access if restaurantId and tableNumber are provided
    if (restaurantId && tableNumber) {
      // Check if user came from QR scan
      const qrScanAuth = sessionStorage.getItem('qr_scan_auth');
      let authData = qrScanAuth ? JSON.parse(qrScanAuth) : null;
      
      // Create or update auth session for this table
      authData = {
        restaurantId: restaurantId,
        tableNumber: tableNumber,
        timestamp: Date.now()
      };
      sessionStorage.setItem('qr_scan_auth', JSON.stringify(authData));
      setIsAuthenticated(true);
    }
    
    setIsChecking(false);
  }, [restaurantId, tableNumber]);

  if (isChecking) {
    return <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-4"></div>
        <p>Loading...</p>
      </div>
    </div>;
  }

  if (!isAuthenticated) {
    return <UnauthorizedAccess />;
  }

  return <>{children}</>;
}

function App() {
  const [location] = useLocation();

  // Check if current route is admin route
  const isAdminRoute = location.startsWith('/admin/loging');

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen bg-background">
          <Switch>
            {/* QR Generator - always accessible */}
            <Route path="/qr-landing" component={QrLanding} />
            
            {/* QR Scan entry points - always accessible */}
            <Route path="/welcome/:restaurantId/:tableNumber">
              {(params) => <MobileLanding {...params} />}
            </Route>
            <Route path="/scan/:restaurantId/:tableNumber">
              {(params) => <MobileLanding {...params} />}
            </Route>
            
            {/* Protected customer routes - require QR scan authentication */}
            <Route path="/menu/:restaurantId/:tableNumber">
              {(params) => (
                <QRAuthWrapper restaurantId={params.restaurantId} tableNumber={params.tableNumber}>
                  <Menu {...params} />
                </QRAuthWrapper>
              )}
            </Route>
            <Route path="/menu">
              {() => (
                <QRAuthWrapper restaurantId="default" tableNumber="1">
                  <Menu restaurantId="default" tableNumber="1" />
                </QRAuthWrapper>
              )}
            </Route>
            <Route path="/cart/:restaurantId/:tableNumber">
              {(params) => (
                <QRAuthWrapper restaurantId={params.restaurantId} tableNumber={params.tableNumber}>
                  <Cart {...params} />
                </QRAuthWrapper>
              )}
            </Route>
            <Route path="/cart">
              {() => (
                <QRAuthWrapper restaurantId="default" tableNumber="1">
                  <Cart />
                </QRAuthWrapper>
              )}
            </Route>
            
            {/* Order status accessible with order ID */}
            <Route path="/order-status/:orderId" component={OrderStatus} />

            {/* Admin routes - protected with login */}
            <Route path="/admin/:path*">
              <AdminRouter />
            </Route>

            {/* Default route - Redirect to admin login */}
            <Route path="/">
              {() => {
                const [, setLocation] = useLocation();
                setLocation('/admin/loging');
                return null;
              }}
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
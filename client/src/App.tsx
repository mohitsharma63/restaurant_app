
import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import AdminRouter from "@/components/admin-route";

import Menu from "@/pages/menu";
import Cart from "@/pages/cart";
import Dashboard from "@/pages/dashboard"
import OrderStatus from "@/pages/order-status";
import QrLanding from "@/pages/qr-landing";
import MobileLanding from "@/pages/mobile-landing";
import NotFound from "@/pages/not-found";

function App() {
  const [, setLocation] = useLocation();

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen bg-background">
          <Switch>
            {/* Customer routes */}
            <Route path="/menu/:restaurantId?" component={Menu} />
            <Route path="/cart" component={Cart} />
            <Route path="/dashboard" component={Dashboard} />
            <Route path="/order-status/:orderId?" component={OrderStatus} />
            <Route path="/qr/:tableId?" component={QrLanding} />
            <Route path="/mobile" component={MobileLanding} />

            {/* Admin routes - protected with login */}
            <Route path="/admin/:path*">
              <AdminRouter />
            </Route>

            {/* Default route - Redirect to admin login */}
            <Route path="/" component={() => {
              setLocation('/admin/login');
              return null;
            }} />

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

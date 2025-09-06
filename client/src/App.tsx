import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Navigation from "@/components/navigation";
import QrLanding from "@/pages/qr-landing";
import Menu from "@/pages/menu";
import Cart from "@/pages/cart";
import Dashboard from "@/pages/dashboard";
import OrderStatus from "@/pages/order-status";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={QrLanding} />
      <Route path="/menu/:restaurantId/:tableNumber" component={Menu} />
      <Route path="/cart" component={Cart} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/order-status/:orderId" component={OrderStatus} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen bg-background">
          <Navigation />
          <Router />
        </div>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;

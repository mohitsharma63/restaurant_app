import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import CustomerMenu from "@/pages/customer-menu";
import RestaurantDashboard from "@/pages/restaurant-dashboard";
import QRGenerator from "@/pages/qr-generator";
import NavigationTabs from "@/components/navigation-tabs";

function Router() {
  return (
    <div className="min-h-screen bg-background">
      <NavigationTabs />
      <Switch>
        <Route path="/" component={CustomerMenu} />
        <Route path="/customer-menu" component={CustomerMenu} />
        <Route path="/dashboard" component={RestaurantDashboard} />
        <Route path="/qr-generator" component={QRGenerator} />
        <Route path="/menu/:restaurantId/:tableId" component={CustomerMenu} />
        <Route component={NotFound} />
      </Switch>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;

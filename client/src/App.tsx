import { Route, Switch, Redirect } from "wouter";
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

// Dummy components to satisfy the provided changes, as they were not in the original code.
// In a real scenario, these would be imported from their respective files.
const AdminLogin = () => <div>Admin Login</div>;
const AdminDashboard = () => <div>Admin Dashboard</div>;
const AdminOrders = () => <div>Admin Orders</div>;
const AdminMenu = () => <div>Admin Menu</div>;
const AdminCustomers = () => <div>Admin Customers</div>;
const AdminSettings = () => <div>Admin Settings</div>;
const MenuPage = () => <div>Menu Page</div>;
const CartPage = () => <div>Cart Page</div>;
const OrderStatusPage = () => <div>Order Status Page</div>;
const QrLandingPage = () => <div>QR Landing Page</div>;
const MobileLandingPage = () => <div>Mobile Landing Page</div>;

function App() {
  const [, setLocation] = useLocation();

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen bg-background">
          <Switch>
            <Route path="/" component={() => <Redirect to="/mobile" />} />
            <Route path="/admin/login" component={AdminLogin} />
            <Route path="/admin/dashboard" component={() => <AdminRouter><AdminDashboard /></AdminRouter>} />
            <Route path="/admin/orders" component={() => <AdminRouter><AdminOrders /></AdminRouter>} />
            <Route path="/admin/menu" component={() => <AdminRouter><AdminMenu /></AdminRouter>} />
            <Route path="/admin/customers" component={() => <AdminRouter><AdminCustomers /></AdminRouter>} />
            <Route path="/admin/settings" component={() => <AdminRouter><AdminSettings /></AdminRouter>} />
            <Route path="/dashboard" component={Dashboard} />
            <Route path="/menu" component={MenuPage} />
            <Route path="/cart" component={CartPage} />
            <Route path="/order-status" component={OrderStatusPage} />
            <Route path="/qr/:restaurantId/:tableNumber" component={QrLandingPage} />
            <Route path="/mobile" component={MobileLandingPage} />
            <Route component={NotFound} />
          </Switch>
        </div>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
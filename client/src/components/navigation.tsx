import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { QrCode, Menu, ShoppingCart, BarChart3, ClipboardList } from "lucide-react";

export default function Navigation() {
  const [location, setLocation] = useLocation();

  const navItems = [
    { path: "/", label: "QR Landing", icon: QrCode },
    { path: "/menu/sample/5", label: "Digital Menu", icon: Menu },
    { path: "/cart", label: "Cart", icon: ShoppingCart },
    { path: "/dashboard", label: "Dashboard", icon: BarChart3 },
    { path: "/order-status/sample", label: "Order Status", icon: ClipboardList },
  ];

  const isActive = (path: string) => {
    if (path === "/") return location === "/";
    return location.startsWith(path.split("/")[1] ? `/${path.split("/")[1]}` : path);
  };

  return (
    <nav className="menu-sticky bg-card border-b border-border">
      <div className="flex justify-center space-x-0">
        {navItems.map((item) => {
          const IconComponent = item.icon;
          return (
            <Button
              key={item.path}
              variant="ghost"
              onClick={() => setLocation(item.path)}
              className={`px-6 py-3 text-sm font-medium rounded-none border-b-2 transition-colors ${
                isActive(item.path)
                  ? "text-primary border-primary"
                  : "text-muted-foreground border-transparent hover:text-foreground hover:border-primary"
              }`}
              data-testid={`nav-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
            >
              <IconComponent className="w-4 h-4 mr-2" />
              {item.label}
            </Button>
          );
        })}
      </div>
    </nav>
  );
}

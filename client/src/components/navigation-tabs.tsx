import { useLocation } from "wouter";
import { Link } from "wouter";

export default function NavigationTabs() {
  const [location] = useLocation();

  const tabs = [
    {
      id: "customer-menu",
      path: "/",
      label: "Customer Menu",
      icon: "fas fa-utensils",
    },
    {
      id: "dashboard",
      path: "/dashboard",
      label: "Restaurant Dashboard",
      icon: "fas fa-tachometer-alt",
    },
    {
      id: "qr-generator",
      path: "/qr-generator",
      label: "QR Generator",
      icon: "fas fa-qrcode",
    },
  ];

  const isActiveTab = (path: string) => {
    if (path === "/" && (location === "/" || location === "/customer-menu")) {
      return true;
    }
    return location === path;
  };

  return (
    <div className="fixed top-0 w-full bg-white shadow-sm border-b border-border z-50">
      <div className="flex overflow-x-auto">
        {tabs.map((tab) => (
          <Link
            key={tab.id}
            href={tab.path}
            className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
              isActiveTab(tab.path)
                ? "border-primary text-primary bg-primary/5"
                : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
            }`}
            data-testid={`tab-${tab.id}`}
          >
            <i className={`${tab.icon} mr-2`}></i>
            {tab.label}
          </Link>
        ))}
      </div>
    </div>
  );
}

import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import MenuItemCard from "@/components/menu-item-card";
import { ShoppingCart } from "lucide-react";
import { type MenuItem, type CartItem } from "@shared/schema";

interface MenuParams {
  restaurantId: string;
  tableNumber: string;
}

export default function Menu() {
  const [, setLocation] = useLocation();
  const [restaurantId, setRestaurantId] = useState<string>("");
  const [tableNumber, setTableNumber] = useState<string>("");
  const [activeCategory, setActiveCategory] = useState("Appetizers");
  const [cart, setCart] = useState<Record<string, CartItem>>({});
  const [cartCount, setCartCount] = useState(0);

  // Extract params from URL
  useEffect(() => {
    const path = window.location.pathname;
    const matches = path.match(/\/menu\/([^\/]+)\/([^\/]+)/);
    if (matches) {
      setRestaurantId(matches[1]);
      setTableNumber(matches[2]);
    }
  }, []);

  const { data: restaurant } = useQuery({
    queryKey: ['/api/restaurants', restaurantId],
    enabled: !!restaurantId,
  });

  const { data: menuItems } = useQuery({
    queryKey: ['/api/restaurants', restaurantId, 'menu'],
    enabled: !!restaurantId,
  });

  // Group menu items by category
  const groupedMenuItems = menuItems?.reduce((acc: Record<string, MenuItem[]>, item: MenuItem) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {}) || {};

  const categories = Object.keys(groupedMenuItems);

  const addToCart = (item: MenuItem) => {
    const cartItem: CartItem = {
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: 1
    };

    setCart(prev => {
      const newCart = { ...prev };
      if (newCart[item.id]) {
        newCart[item.id] = {
          ...newCart[item.id],
          quantity: newCart[item.id].quantity + 1
        };
      } else {
        newCart[item.id] = cartItem;
      }
      return newCart;
    });
  };

  // Update cart count when cart changes
  useEffect(() => {
    const count = Object.values(cart).reduce((total, item) => total + item.quantity, 0);
    setCartCount(count);
    
    // Store cart in localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    localStorage.setItem('restaurantId', restaurantId);
    localStorage.setItem('tableNumber', tableNumber);
  }, [cart, restaurantId, tableNumber]);

  const handleGoToCart = () => {
    setLocation('/cart');
  };

  if (!restaurant) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Loading...</h2>
          <p className="text-muted-foreground">Please wait while we load the menu</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Restaurant Header */}
      <div className="bg-card border-b border-border">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold" data-testid="text-restaurant-name">
                {restaurant.name}
              </h1>
              <p className="text-muted-foreground" data-testid="text-table-info">
                Table {tableNumber} • Dine-in
              </p>
            </div>
            <div className="text-right">
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-accent rounded-full"></span>
                <span className="text-sm text-muted-foreground" data-testid="status-open">
                  {restaurant.isOpen ? "Open" : "Closed"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Menu Categories */}
      <div className="menu-sticky bg-card border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex space-x-6 py-4 overflow-x-auto">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`text-sm font-medium whitespace-nowrap transition-colors ${
                  activeCategory === category
                    ? "text-primary border-b-2 border-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                data-testid={`button-category-${category.toLowerCase().replace(/\s+/g, '-')}`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="container mx-auto px-4 py-6">
        <div className="space-y-6">
          {categories.map((category) => (
            <div key={category} className={activeCategory === category ? "" : "hidden"}>
              <h2 className="text-xl font-semibold mb-4" data-testid={`heading-${category.toLowerCase().replace(/\s+/g, '-')}`}>
                {category}
              </h2>
              <div className="grid gap-4">
                {groupedMenuItems[category]?.map((item) => (
                  <MenuItemCard
                    key={item.id}
                    item={item}
                    onAddToCart={addToCart}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Floating Cart Button */}
      {cartCount > 0 && (
        <div className="cart-floating">
          <Button
            onClick={handleGoToCart}
            className="w-16 h-16 rounded-full shadow-lg relative"
            data-testid="button-cart-floating"
          >
            <ShoppingCart className="w-6 h-6" />
            <Badge 
              className="absolute -top-2 -right-2 w-6 h-6 rounded-full text-xs flex items-center justify-center"
              data-testid="badge-cart-count"
            >
              {cartCount}
            </Badge>
          </Button>
        </div>
      )}
    </div>
  );
}

import { useState, useMemo } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, MenuItem, Category, Restaurant, Order, OrderItem } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { MenuItemCard } from "@/components/menu-item-card";
import { CartModal } from "@/components/cart-modal";
import { CheckoutModal } from "@/components/checkout-modal";
import { Loader2, ShoppingCart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CartItem {
  menuItem: MenuItem;
  quantity: number;
  modifications?: string;
}

export default function MenuPage({ params }: { params: { qrCode: string } }) {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);

  // Fetch table by QR code
  const { data: table, isLoading: tableLoading } = useQuery<Table>({
    queryKey: ["/api/tables/qr", params.qrCode],
  });

  // Fetch restaurant data
  const { data: restaurant, isLoading: restaurantLoading } = useQuery<Restaurant>({
    queryKey: ["/api/restaurants", table?.restaurantId],
    enabled: !!table?.restaurantId,
  });

  // Fetch categories
  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ["/api/restaurants", table?.restaurantId, "categories"],
    enabled: !!table?.restaurantId,
  });

  // Fetch menu items
  const { data: menuItems = [] } = useQuery<MenuItem[]>({
    queryKey: ["/api/restaurants", table?.restaurantId, "menu-items"],
    enabled: !!table?.restaurantId,
  });

  const filteredItems = useMemo(() => {
    if (!selectedCategory) return menuItems;
    return menuItems.filter(item => item.categoryId === selectedCategory);
  }, [menuItems, selectedCategory]);

  const cartTotal = useMemo(() => {
    const subtotal = cart.reduce((sum, item) => sum + (parseFloat(item.menuItem.price) * item.quantity), 0);
    const tax = subtotal * 0.08; // 8% tax
    const serviceFee = subtotal * 0.05; // 5% service fee
    return {
      subtotal,
      tax,
      serviceFee,
      total: subtotal + tax + serviceFee,
    };
  }, [cart]);

  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Order placement mutation
  const placeOrderMutation = useMutation({
    mutationFn: async () => {
      if (!table) throw new Error("No table selected");
      
      // Create order
      const orderRes = await apiRequest("POST", "/api/orders", {
        restaurantId: table.restaurantId,
        tableId: table.id,
        subtotal: cartTotal.subtotal.toString(),
        tax: cartTotal.tax.toString(),
        serviceFee: cartTotal.serviceFee.toString(),
        total: cartTotal.total.toString(),
        estimatedTime: 25,
      });
      const order: Order = await orderRes.json();

      // Create order items
      for (const cartItem of cart) {
        await apiRequest("POST", `/api/orders/${order.id}/items`, {
          menuItemId: cartItem.menuItem.id,
          quantity: cartItem.quantity,
          unitPrice: cartItem.menuItem.price,
          totalPrice: (parseFloat(cartItem.menuItem.price) * cartItem.quantity).toString(),
          modifications: cartItem.modifications,
        });
      }

      return order;
    },
    onSuccess: (order) => {
      toast({
        title: "Order Placed!",
        description: `Order #${order.id} has been confirmed.`,
      });
      setCart([]);
      setShowCheckout(false);
      setLocation(`/order/${order.id}`);
    },
    onError: (error) => {
      toast({
        title: "Order Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const addToCart = (menuItem: MenuItem, modifications?: string) => {
    setCart(prev => {
      const existingIndex = prev.findIndex(
        item => item.menuItem.id === menuItem.id && item.modifications === modifications
      );
      
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex].quantity += 1;
        return updated;
      } else {
        return [...prev, { menuItem, quantity: 1, modifications }];
      }
    });
    
    toast({
      title: "Added to Cart",
      description: `${menuItem.name} added to your order.`,
    });
  };

  const updateCartItem = (index: number, quantity: number) => {
    if (quantity <= 0) {
      setCart(prev => prev.filter((_, i) => i !== index));
    } else {
      setCart(prev => {
        const updated = [...prev];
        updated[index].quantity = quantity;
        return updated;
      });
    }
  };

  const proceedToCheckout = () => {
    setShowCart(false);
    setShowCheckout(true);
  };

  if (tableLoading || restaurantLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!table || !restaurant) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card>
          <CardContent className="p-8 text-center">
            <h2 className="text-xl font-serif font-semibold mb-2">Table Not Found</h2>
            <p className="text-muted-foreground mb-4">
              The QR code you scanned doesn't correspond to a valid table.
            </p>
            <Button onClick={() => setLocation("/")} data-testid="button-back-home">
              Back to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-card">
      {/* Table Info Header */}
      <div className="bg-background text-foreground p-4 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h2 className="text-lg font-serif font-semibold" data-testid="text-restaurant-name">
              {restaurant.name}
            </h2>
            <p className="text-sm text-muted-foreground" data-testid="text-table-number">
              Table {table.tableNumber}
            </p>
          </div>
          <Button
            onClick={() => setShowCart(true)}
            className="relative"
            data-testid="button-view-cart"
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            Cart
            {cartItemCount > 0 && (
              <Badge variant="destructive" className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0">
                {cartItemCount}
              </Badge>
            )}
          </Button>
        </div>
      </div>

      {/* Category Navigation */}
      <div className="sticky top-0 bg-card border-b border-border z-40">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex space-x-2 overflow-x-auto">
            <Button
              variant={!selectedCategory ? "default" : "secondary"}
              onClick={() => setSelectedCategory("")}
              className="whitespace-nowrap"
              data-testid="button-category-all"
            >
              All Items
            </Button>
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "secondary"}
                onClick={() => setSelectedCategory(category.id)}
                className="whitespace-nowrap"
                data-testid={`button-category-${category.id}`}
              >
                {category.name}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Menu Items Grid */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <MenuItemCard
              key={item.id}
              item={item}
              onAddToCart={addToCart}
            />
          ))}
        </div>
      </div>

      {/* Cart Modal */}
      <CartModal
        isOpen={showCart}
        onClose={() => setShowCart(false)}
        cartItems={cart}
        cartTotal={cartTotal}
        onUpdateItem={updateCartItem}
        onProceedToCheckout={proceedToCheckout}
      />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={showCheckout}
        onClose={() => setShowCheckout(false)}
        cartTotal={cartTotal}
        onPlaceOrder={() => placeOrderMutation.mutate()}
        isPlacing={placeOrderMutation.isPending}
      />
    </div>
  );
}

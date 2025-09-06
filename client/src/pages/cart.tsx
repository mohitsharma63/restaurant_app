import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { ArrowLeft, Minus, Plus, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { type CartItem } from "@shared/schema";

export default function Cart() {
  const [, setLocation] = useLocation();
  const [cart, setCart] = useState<Record<string, CartItem>>({});
  const [restaurantId, setRestaurantId] = useState<string>("");
  const [tableNumber, setTableNumber] = useState<string>("");
  const [orderType, setOrderType] = useState("dine-in");
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [specialInstructions, setSpecialInstructions] = useState("");
  const { toast } = useToast();

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    const savedRestaurantId = localStorage.getItem('restaurantId');
    const savedTableNumber = localStorage.getItem('tableNumber');

    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
    if (savedRestaurantId) {
      setRestaurantId(savedRestaurantId);
    }
    if (savedTableNumber) {
      setTableNumber(savedTableNumber);
    }
  }, []);

  const cartItems = Object.values(cart);
  const subtotal = cartItems.reduce((sum, item) => sum + (parseFloat(item.price) * item.quantity), 0);
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + tax;

  const updateQuantity = (itemId: string, change: number) => {
    setCart(prev => {
      const newCart = { ...prev };
      if (newCart[itemId]) {
        newCart[itemId] = {
          ...newCart[itemId],
          quantity: Math.max(0, newCart[itemId].quantity + change)
        };
        
        if (newCart[itemId].quantity === 0) {
          delete newCart[itemId];
        }
      }
      
      // Update localStorage
      localStorage.setItem('cart', JSON.stringify(newCart));
      return newCart;
    });
  };

  const placeOrderMutation = useMutation({
    mutationFn: async () => {
      const orderData = {
        restaurantId,
        tableNumber: parseInt(tableNumber),
        items: cartItems,
        totalAmount: total.toFixed(2),
        orderType,
        paymentMethod,
        specialInstructions: specialInstructions || undefined,
        status: "pending",
        paymentStatus: "pending"
      };

      const response = await apiRequest("POST", "/api/orders", orderData);
      return response.json();
    },
    onSuccess: (order) => {
      // Clear cart
      setCart({});
      localStorage.removeItem('cart');
      
      toast({
        title: "Order Placed Successfully!",
        description: `Your order #${order.id.slice(-6)} has been sent to the restaurant.`
      });
      
      // Navigate to order status
      setLocation(`/order-status/${order.id}`);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to place order. Please try again.",
        variant: "destructive"
      });
    }
  });

  const handlePlaceOrder = () => {
    if (cartItems.length === 0) {
      toast({
        title: "Empty Cart",
        description: "Please add items to your cart before placing an order.",
        variant: "destructive"
      });
      return;
    }
    
    placeOrderMutation.mutate();
  };

  const handleBackToMenu = () => {
    setLocation(`/menu/${restaurantId}/${tableNumber}`);
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2" data-testid="heading-empty-cart">Your cart is empty</h2>
          <p className="text-muted-foreground mb-4">Add some delicious items to get started!</p>
          <Button onClick={handleBackToMenu} data-testid="button-back-to-menu">
            Back to Menu
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-6 max-w-md">
        {/* Cart Header */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold" data-testid="heading-your-cart">Your Cart</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBackToMenu}
                data-testid="button-back-arrow"
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </div>

            {/* Order Type Selection */}
            <RadioGroup value={orderType} onValueChange={setOrderType} className="mb-6">
              <div className="flex space-x-2">
                <div className="flex items-center space-x-2 flex-1">
                  <RadioGroupItem value="dine-in" id="dine-in" />
                  <Label htmlFor="dine-in" className="text-sm font-medium cursor-pointer">
                    Dine-in
                  </Label>
                </div>
                <div className="flex items-center space-x-2 flex-1">
                  <RadioGroupItem value="takeaway" id="takeaway" />
                  <Label htmlFor="takeaway" className="text-sm font-medium cursor-pointer">
                    Takeaway
                  </Label>
                </div>
                <div className="flex items-center space-x-2 flex-1">
                  <RadioGroupItem value="delivery" id="delivery" />
                  <Label htmlFor="delivery" className="text-sm font-medium cursor-pointer">
                    Delivery
                  </Label>
                </div>
              </div>
            </RadioGroup>

            {/* Cart Items */}
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between py-3 border-b border-border">
                  <div className="flex-1">
                    <h4 className="font-medium" data-testid={`text-item-name-${item.id}`}>
                      {item.name}
                    </h4>
                    <p className="text-sm text-muted-foreground" data-testid={`text-item-price-${item.id}`}>
                      ${parseFloat(item.price).toFixed(2)}
                    </p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateQuantity(item.id, -1)}
                      className="w-8 h-8 p-0"
                      data-testid={`button-decrease-${item.id}`}
                    >
                      <Minus className="w-3 h-3" />
                    </Button>
                    <span className="w-8 text-center" data-testid={`text-quantity-${item.id}`}>
                      {item.quantity}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateQuantity(item.id, 1)}
                      className="w-8 h-8 p-0"
                      data-testid={`button-increase-${item.id}`}
                    >
                      <Plus className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {/* Cart Summary */}
            <div className="mt-6 pt-4 border-t border-border">
              <div className="flex justify-between mb-2">
                <span className="text-muted-foreground">Subtotal</span>
                <span data-testid="text-subtotal">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-muted-foreground">Tax</span>
                <span data-testid="text-tax">${tax.toFixed(2)}</span>
              </div>
              <Separator className="my-2" />
              <div className="flex justify-between font-semibold text-lg">
                <span>Total</span>
                <span data-testid="text-total">${total.toFixed(2)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Special Instructions */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <h3 className="font-medium mb-3">Special Instructions</h3>
            <Textarea
              placeholder="Any special requests..."
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              className="resize-none h-20"
              data-testid="textarea-special-instructions"
            />
          </CardContent>
        </Card>

        {/* Payment Method */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <h3 className="font-medium mb-4">Payment Method</h3>
            <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <RadioGroupItem value="card" id="card" />
                  <Label htmlFor="card" className="cursor-pointer">
                    Credit/Debit Card
                  </Label>
                </div>
                <div className="flex items-center space-x-3">
                  <RadioGroupItem value="upi" id="upi" />
                  <Label htmlFor="upi" className="cursor-pointer">
                    UPI Payment
                  </Label>
                </div>
                <div className="flex items-center space-x-3">
                  <RadioGroupItem value="cash" id="cash" />
                  <Label htmlFor="cash" className="cursor-pointer">
                    Cash on Delivery
                  </Label>
                </div>
              </div>
            </RadioGroup>
          </CardContent>
        </Card>

        {/* Place Order Button */}
        <Button
          onClick={handlePlaceOrder}
          disabled={placeOrderMutation.isPending}
          className="w-full py-4 text-lg font-semibold bg-accent hover:bg-accent/90 text-accent-foreground"
          data-testid="button-place-order"
        >
          {placeOrderMutation.isPending ? (
            "Placing Order..."
          ) : (
            <>
              <Check className="w-4 h-4 mr-2" />
              Place Order • ${total.toFixed(2)}
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

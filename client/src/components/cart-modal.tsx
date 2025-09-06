import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCart } from "@/hooks/use-cart";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
  restaurantId?: string;
  tableId?: string;
}

export default function CartModal({ isOpen, onClose, restaurantId, tableId }: CartModalProps) {
  const { items, updateItemQuantity, getTotalPrice, clearCart } = useCart();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [notes, setNotes] = useState("");

  const createOrderMutation = useMutation({
    mutationFn: async (orderData: any) => {
      const response = await apiRequest("POST", "/api/orders", orderData);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Order Placed Successfully",
        description: "Your order has been sent to the kitchen!",
      });
      clearCart();
      onClose();
      queryClient.invalidateQueries({ queryKey: ["/api/orders"] });
    },
    onError: (error) => {
      toast({
        title: "Order Failed",
        description: error.message || "Failed to place order. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmitOrder = async () => {
    if (!customerName.trim()) {
      toast({
        title: "Missing Information",
        description: "Please enter your name.",
        variant: "destructive",
      });
      return;
    }

    if (items.length === 0) {
      toast({
        title: "Empty Cart",
        description: "Please add items to your cart first.",
        variant: "destructive",
      });
      return;
    }

    const orderItems = items.map(item => ({
      menuItemId: item.menuItem.id,
      quantity: item.quantity,
      notes: item.notes || null,
    }));

    const orderData = {
      orderData: {
        restaurantId: restaurantId || "default", // For demo purposes
        tableId: tableId || null,
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim() || null,
        orderType: "dine-in",
        notes: notes.trim() || null,
      },
      items: orderItems,
    };

    createOrderMutation.mutate(orderData);
  };

  if (!isOpen) return null;

  const subtotal = getTotalPrice();
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + tax;

  return (
    <div className="fixed inset-0 bg-black/50 z-50" data-testid="modal-cart">
      <div className="flex items-end justify-center min-h-screen p-4">
        <div className="bg-card rounded-t-xl max-w-md w-full max-h-[80vh] overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-border">
            <h2 className="text-xl font-bold" data-testid="text-cart-title">Your Order</h2>
            <button 
              onClick={onClose} 
              className="text-muted-foreground hover:text-foreground"
              data-testid="button-close-cart"
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
          
          <div className="p-4 space-y-4 overflow-y-auto max-h-96">
            {items.length === 0 ? (
              <p className="text-center text-muted-foreground py-8" data-testid="text-empty-cart">
                Your cart is empty
              </p>
            ) : (
              items.map((item) => (
                <div key={item.menuItem.id} className="flex items-center justify-between" data-testid={`cart-item-${item.menuItem.id}`}>
                  <div className="flex items-center flex-1">
                    {item.menuItem.imageUrl && (
                      <img 
                        src={item.menuItem.imageUrl} 
                        alt={item.menuItem.name}
                        className="w-12 h-12 rounded object-cover mr-3"
                        data-testid={`img-cart-item-${item.menuItem.id}`}
                      />
                    )}
                    <div className="flex-1">
                      <p className="font-medium" data-testid={`text-cart-item-name-${item.menuItem.id}`}>
                        {item.menuItem.name}
                      </p>
                      <p className="text-sm text-muted-foreground" data-testid={`text-cart-item-price-${item.menuItem.id}`}>
                        ${parseFloat(item.menuItem.price).toFixed(2)} each
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => updateItemQuantity(item.menuItem.id, item.quantity - 1)}
                      className="w-6 h-6 bg-muted rounded-full flex items-center justify-center hover:bg-primary hover:text-white text-xs"
                      data-testid={`button-cart-decrease-${item.menuItem.id}`}
                    >
                      <i className="fas fa-minus"></i>
                    </button>
                    <span className="text-sm w-8 text-center" data-testid={`text-cart-quantity-${item.menuItem.id}`}>
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateItemQuantity(item.menuItem.id, item.quantity + 1)}
                      className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center hover:bg-primary/90 text-xs"
                      data-testid={`button-cart-increase-${item.menuItem.id}`}
                    >
                      <i className="fas fa-plus"></i>
                    </button>
                    <span className="font-semibold text-sm w-16 text-right" data-testid={`text-cart-item-total-${item.menuItem.id}`}>
                      ${(parseFloat(item.menuItem.price) * item.quantity).toFixed(2)}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
          
          {items.length > 0 && (
            <>
              <div className="p-4 border-t border-border space-y-4">
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="customerName">Name *</Label>
                    <Input
                      id="customerName"
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Enter your name"
                      data-testid="input-customer-name"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="customerPhone">Phone (optional)</Label>
                    <Input
                      id="customerPhone"
                      type="tel"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="Enter your phone number"
                      data-testid="input-customer-phone"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="notes">Special Instructions (optional)</Label>
                    <Textarea
                      id="notes"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Any special requests..."
                      rows={2}
                      data-testid="input-order-notes"
                    />
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between" data-testid="text-order-subtotal">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between" data-testid="text-order-tax">
                    <span>Tax</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg border-t border-border pt-2" data-testid="text-order-total">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
                
                <Button
                  onClick={handleSubmitOrder}
                  disabled={createOrderMutation.isPending}
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                  data-testid="button-place-order"
                >
                  {createOrderMutation.isPending ? (
                    <>
                      <i className="fas fa-spinner fa-spin mr-2"></i>
                      Placing Order...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-credit-card mr-2"></i>
                      Place Order
                    </>
                  )}
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

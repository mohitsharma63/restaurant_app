import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { MenuItem } from "@shared/schema";
import { X, Minus, Plus } from "lucide-react";

interface CartItem {
  menuItem: MenuItem;
  quantity: number;
  modifications?: string;
}

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  cartTotal: {
    subtotal: number;
    tax: number;
    serviceFee: number;
    total: number;
  };
  onUpdateItem: (index: number, quantity: number) => void;
  onProceedToCheckout: () => void;
}

export function CartModal({
  isOpen,
  onClose,
  cartItems,
  cartTotal,
  onUpdateItem,
  onProceedToCheckout,
}: CartModalProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-hidden flex flex-col" data-testid="modal-cart">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle>Your Order</DialogTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            data-testid="button-close-cart"
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        {cartItems.length === 0 ? (
          <div className="flex-1 flex items-center justify-center py-8">
            <p className="text-muted-foreground">Your cart is empty</p>
          </div>
        ) : (
          <>
            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto space-y-4 py-4">
              {cartItems.map((item, index) => (
                <div
                  key={`${item.menuItem.id}-${index}`}
                  className="flex items-center justify-between py-3 border-b border-border last:border-b-0"
                  data-testid={`cart-item-${index}`}
                >
                  <div className="flex-1 mr-4">
                    <h4 className="font-medium text-card-foreground" data-testid={`text-cart-item-name-${index}`}>
                      {item.menuItem.name}
                    </h4>
                    {item.modifications && (
                      <p className="text-sm text-muted-foreground">
                        {item.modifications}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => onUpdateItem(index, item.quantity - 1)}
                        data-testid={`button-decrease-${index}`}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-8 text-center" data-testid={`text-quantity-${index}`}>
                        {item.quantity}
                      </span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => onUpdateItem(index, item.quantity + 1)}
                        data-testid={`button-increase-${index}`}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                    <span className="font-semibold text-primary w-16 text-right" data-testid={`text-item-total-${index}`}>
                      {formatCurrency(parseFloat(item.menuItem.price) * item.quantity)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Cart Summary */}
            <div className="border-t border-border pt-4">
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span data-testid="text-subtotal">{formatCurrency(cartTotal.subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tax</span>
                  <span data-testid="text-tax">{formatCurrency(cartTotal.tax)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Service Fee</span>
                  <span data-testid="text-service-fee">{formatCurrency(cartTotal.serviceFee)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span className="text-primary" data-testid="text-total">
                    {formatCurrency(cartTotal.total)}
                  </span>
                </div>
              </div>
              <Button 
                onClick={onProceedToCheckout} 
                className="w-full"
                data-testid="button-proceed-checkout"
              >
                Proceed to Checkout
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

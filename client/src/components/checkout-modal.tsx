import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { X, CreditCard, Smartphone } from "lucide-react";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartTotal: {
    subtotal: number;
    tax: number;
    serviceFee: number;
    total: number;
  };
  onPlaceOrder: () => void;
  isPlacing: boolean;
}

export function CheckoutModal({
  isOpen,
  onClose,
  cartTotal,
  onPlaceOrder,
  isPlacing,
}: CheckoutModalProps) {
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const handlePlaceOrder = () => {
    if (paymentMethod === "card" && (!cardNumber || !expiry || !cvv)) {
      return; // Basic validation
    }
    onPlaceOrder();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto" data-testid="modal-checkout">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle>Checkout</DialogTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            data-testid="button-close-checkout"
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Payment Method */}
          <div>
            <Label className="text-base font-medium mb-3 block">Payment Method</Label>
            <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-3">
              <div className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-muted/50">
                <RadioGroupItem value="card" id="card" />
                <CreditCard className="w-5 h-5 text-muted-foreground" />
                <Label htmlFor="card" className="cursor-pointer">Credit Card</Label>
              </div>
              <div className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-muted/50">
                <RadioGroupItem value="apple-pay" id="apple-pay" />
                <Smartphone className="w-5 h-5 text-muted-foreground" />
                <Label htmlFor="apple-pay" className="cursor-pointer">Apple Pay</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Card Details */}
          {paymentMethod === "card" && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="card-number">Card Number</Label>
                <Input
                  id="card-number"
                  type="text"
                  placeholder="1234 5678 9012 3456"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  data-testid="input-card-number"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="expiry">Expiry</Label>
                  <Input
                    id="expiry"
                    type="text"
                    placeholder="MM/YY"
                    value={expiry}
                    onChange={(e) => setExpiry(e.target.value)}
                    data-testid="input-expiry"
                  />
                </div>
                <div>
                  <Label htmlFor="cvv">CVV</Label>
                  <Input
                    id="cvv"
                    type="text"
                    placeholder="123"
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value)}
                    data-testid="input-cvv"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Order Summary */}
          <Card>
            <CardContent className="p-4">
              <h4 className="font-medium text-card-foreground mb-2">Order Summary</h4>
              <div className="text-sm space-y-1">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span data-testid="text-checkout-subtotal">{formatCurrency(cartTotal.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span data-testid="text-checkout-tax">{formatCurrency(cartTotal.tax)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Service Fee</span>
                  <span data-testid="text-checkout-service-fee">{formatCurrency(cartTotal.serviceFee)}</span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span className="text-primary" data-testid="text-checkout-total">
                    {formatCurrency(cartTotal.total)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Button
            onClick={handlePlaceOrder}
            disabled={isPlacing}
            className="w-full"
            data-testid="button-place-order"
          >
            {isPlacing ? "Placing Order..." : "Place Order"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

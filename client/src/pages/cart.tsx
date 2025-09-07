
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { 
  ShoppingCart, 
  Plus, 
  Minus, 
  Trash2, 
  ArrowLeft,
  Clock,
  MapPin,
  CreditCard,
  Wallet,
  Smartphone,
  Tag,
  Gift,
  MessageCircle,
  Star,
  Utensils
} from "lucide-react";

interface CartItem {
  id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  category: string;
  specialInstructions?: string;
  preparationTime: number;
  isVegetarian?: boolean;
  isSpicy?: boolean;
}

const paymentMethods = [
  { id: "card", name: "Credit/Debit Card", icon: CreditCard, subtitle: "Visa, Mastercard, Amex" },
  { id: "upi", name: "UPI Payment", icon: Smartphone, subtitle: "GPay, PhonePe, Paytm" },
  { id: "cash", name: "Cash Payment", icon: Wallet, subtitle: "Pay at the table" }
];

export default function Cart() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [specialInstructions, setSpecialInstructions] = useState("");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("card");
  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  // Load cart from localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem("restaurant-cart");
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  // Save cart to localStorage
  useEffect(() => {
    localStorage.setItem("restaurant-cart", JSON.stringify(cart));
  }, [cart]);

  const updateQuantity = (id: string, change: number) => {
    setCart(prev => {
      return prev.map(item => {
        if (item.id === id) {
          const newQuantity = Math.max(0, item.quantity + change);
          return newQuantity === 0 ? null : { ...item, quantity: newQuantity };
        }
        return item;
      }).filter(Boolean) as CartItem[];
    });
  };

  const removeItem = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
    toast({
      title: "Item removed",
      description: "Item has been removed from your cart",
    });
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem("restaurant-cart");
    toast({
      title: "Cart cleared",
      description: "All items have been removed from your cart",
    });
  };

  const applyPromoCode = () => {
    // Mock promo code validation
    if (promoCode.toUpperCase() === "SAVE10") {
      setAppliedPromo("SAVE10");
      toast({
        title: "Promo code applied!",
        description: "You saved $5.00 with SAVE10",
      });
    } else if (promoCode.toUpperCase() === "FIRST20") {
      setAppliedPromo("FIRST20");
      toast({
        title: "Promo code applied!",
        description: "You saved 20% on your first order",
      });
    } else {
      toast({
        title: "Invalid promo code",
        description: "Please check your promo code and try again",
        variant: "destructive"
      });
    }
    setPromoCode("");
  };

  const getSubtotal = () => cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const getTax = () => getSubtotal() * 0.08; // 8% tax
  const getServiceCharge = () => getSubtotal() * 0.05; // 5% service charge
  const getDiscount = () => {
    if (appliedPromo === "SAVE10") return 5.00;
    if (appliedPromo === "FIRST20") return getSubtotal() * 0.20;
    return 0;
  };
  const getTotal = () => getSubtotal() + getTax() + getServiceCharge() - getDiscount();
  const getTotalItems = () => cart.reduce((sum, item) => sum + item.quantity, 0);
  const getEstimatedTime = () => Math.max(...cart.map(item => item.preparationTime), 0);

  const placeOrder = async () => {
    if (cart.length === 0) return;
    
    setIsPlacingOrder(true);
    
    // Mock order placement
    setTimeout(() => {
      setIsPlacingOrder(false);
      clearCart();
      toast({
        title: "Order placed successfully!",
        description: "Your order will be ready in 20-25 minutes",
      });
      setLocation("/order-status");
    }, 2000);
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center space-x-3">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setLocation("/menu")}
                className="p-2"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <h1 className="text-lg font-bold text-gray-900">Your Cart</h1>
            </div>
          </div>
        </div>

        {/* Empty Cart */}
        <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 text-center">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
            <ShoppingCart className="w-12 h-12 text-gray-400" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Your cart is empty</h2>
          <p className="text-gray-500 mb-6 max-w-sm">
            Add some delicious items from our menu to get started
          </p>
          <Button 
            onClick={() => setLocation("/menu")}
            className="bg-orange-500 hover:bg-orange-600 text-white px-8"
          >
            <Utensils className="w-4 h-4 mr-2" />
            Browse Menu
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-3">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setLocation("/menu")}
              className="p-2"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-lg font-bold text-gray-900">Your Cart</h1>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <MapPin className="w-3 h-3" />
                <span>Table 5</span>
                <Clock className="w-3 h-3 ml-2" />
                <span>{getEstimatedTime()} min</span>
              </div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={clearCart}
            className="text-red-600 hover:text-red-700"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="p-4 pb-32 space-y-4">
        {/* Cart Items */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center justify-between">
              <span>Order Items ({getTotalItems()})</span>
              <Badge variant="secondary" className="text-xs">
                {getEstimatedTime()} min prep
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {cart.map((item) => (
              <div key={item.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-100 to-red-100 rounded-lg flex items-center justify-center">
                  <Utensils className="w-6 h-6 text-orange-500" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-1">
                    <h3 className="font-medium text-gray-900 text-sm line-clamp-1">
                      {item.name}
                    </h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeItem(item.id)}
                      className="p-1 h-6 w-6 text-gray-400 hover:text-red-500 ml-2"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                  
                  <p className="text-xs text-gray-600 mb-2 line-clamp-1">
                    {item.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {item.isVegetarian && (
                        <Badge className="bg-green-100 text-green-700 text-xs px-1 py-0">
                          Veg
                        </Badge>
                      )}
                      {item.isSpicy && (
                        <Badge className="bg-red-100 text-red-700 text-xs px-1 py-0">
                          Spicy
                        </Badge>
                      )}
                    </div>
                    <div className="text-sm font-semibold text-gray-900">
                      ${(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center justify-between mt-3">
                    <div className="text-sm text-gray-600">
                      ${item.price.toFixed(2)} each
                    </div>
                    <div className="flex items-center bg-white rounded-lg border border-gray-200">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => updateQuantity(item.id, -1)}
                        className="p-1 h-8 w-8 text-gray-600 hover:bg-gray-100"
                      >
                        <Minus className="w-3 h-3" />
                      </Button>
                      <span className="font-medium text-gray-900 px-3 text-sm">
                        {item.quantity}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => updateQuantity(item.id, 1)}
                        className="p-1 h-8 w-8 text-gray-600 hover:bg-gray-100"
                      >
                        <Plus className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Special Instructions */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center space-x-2">
              <MessageCircle className="w-4 h-4" />
              <span>Special Instructions</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Any special requests for your order..."
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              className="resize-none"
              rows={3}
            />
          </CardContent>
        </Card>

        {/* Promo Code */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center space-x-2">
              <Tag className="w-4 h-4" />
              <span>Promo Code</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {appliedPromo ? (
              <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Gift className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium text-green-800">{appliedPromo} applied</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setAppliedPromo(null)}
                  className="text-green-600 hover:text-green-700 p-1"
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            ) : (
              <div className="flex space-x-2">
                <Input
                  placeholder="Enter promo code"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                  className="flex-1"
                />
                <Button
                  onClick={applyPromoCode}
                  disabled={!promoCode.trim()}
                  variant="outline"
                >
                  Apply
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Payment Method */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Payment Method</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {paymentMethods.map((method) => (
              <div
                key={method.id}
                onClick={() => setSelectedPaymentMethod(method.id)}
                className={`flex items-center space-x-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                  selectedPaymentMethod === method.id
                    ? "border-orange-500 bg-orange-50"
                    : "border-gray-200 hover:bg-gray-50"
                }`}
              >
                <div className={`p-2 rounded-lg ${
                  selectedPaymentMethod === method.id ? "bg-orange-100" : "bg-gray-100"
                }`}>
                  <method.icon className={`w-4 h-4 ${
                    selectedPaymentMethod === method.id ? "text-orange-600" : "text-gray-600"
                  }`} />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-gray-900 text-sm">{method.name}</div>
                  <div className="text-xs text-gray-500">{method.subtitle}</div>
                </div>
                <div className={`w-4 h-4 rounded-full border-2 ${
                  selectedPaymentMethod === method.id
                    ? "border-orange-500 bg-orange-500"
                    : "border-gray-300"
                }`}>
                  {selectedPaymentMethod === method.id && (
                    <div className="w-full h-full rounded-full bg-white scale-50"></div>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Order Summary */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Order Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Subtotal ({getTotalItems()} items)</span>
              <span className="font-medium">${getSubtotal().toFixed(2)}</span>
            </div>
            
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Service charge (5%)</span>
              <span className="font-medium">${getServiceCharge().toFixed(2)}</span>
            </div>
            
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Tax (8%)</span>
              <span className="font-medium">${getTax().toFixed(2)}</span>
            </div>
            
            {getDiscount() > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-green-600">Discount ({appliedPromo})</span>
                <span className="font-medium text-green-600">-${getDiscount().toFixed(2)}</span>
              </div>
            )}
            
            <Separator />
            
            <div className="flex justify-between font-semibold">
              <span>Total</span>
              <span className="text-lg">${getTotal().toFixed(2)}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Fixed Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-50">
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="text-sm text-gray-600">Total Amount</div>
            <div className="text-xl font-bold text-gray-900">${getTotal().toFixed(2)}</div>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-600">Estimated Time</div>
            <div className="text-sm font-medium text-orange-600">{getEstimatedTime()} minutes</div>
          </div>
        </div>
        
        <Button
          onClick={placeOrder}
          disabled={isPlacingOrder || cart.length === 0}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-xl text-base font-semibold"
        >
          {isPlacingOrder ? (
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              <span>Placing Order...</span>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <CreditCard className="w-5 h-5" />
              <span>Place Order • ${getTotal().toFixed(2)}</span>
            </div>
          )}
        </Button>
      </div>
    </div>
  );
}


import { Button } from "@/components/ui/button";
import { ChefHat, ArrowRight } from "lucide-react";
import { useLocation } from "wouter";

interface StartOrderingButtonProps {
  restaurantId?: string;
  tableNumber?: string;
  className?: string;
}

export default function StartOrderingButton({ 
  restaurantId = "default", 
  tableNumber = "5",
  className = ""
}: StartOrderingButtonProps) {
  const [, setLocation] = useLocation();

  const handleStartOrdering = () => {
    setLocation(`/menu/${restaurantId}/${tableNumber}`);
  };

  return (
    <Button 
      onClick={handleStartOrdering}
      className={`w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white py-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 ${className}`}
    >
      <div className="flex items-center justify-center space-x-3">
        <div className="bg-white/20 rounded-full p-2">
          <ChefHat className="w-6 h-6" />
        </div>
        <div className="text-left">
          <div className="font-bold text-lg">Start Ordering Now</div>
          <div className="text-sm text-white/90">Browse our delicious menu</div>
        </div>
        <ArrowRight className="w-5 h-5 ml-2" />
      </div>
    </Button>
  );
}

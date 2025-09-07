
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Minus, Star, Clock } from "lucide-react";
import { type MenuItem } from "@shared/schema";
import { useState } from "react";

interface MenuItemCardProps {
  item: MenuItem;
  onAddToCart: (item: MenuItem) => void;
}

export default function MenuItemCard({ item, onAddToCart }: MenuItemCardProps) {
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = async () => {
    setIsAdding(true);
    onAddToCart(item);
    
    // Add a small delay for visual feedback
    setTimeout(() => {
      setIsAdding(false);
    }, 300);
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-200 border-0 shadow-md">
      <CardContent className="p-0">
        <div className="flex">
          {/* Item Image */}
          <div className="w-24 h-24 flex-shrink-0 relative">
            {item.imageUrl ? (
              <img 
                src={item.imageUrl} 
                alt={item.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-orange-100 to-amber-100 flex items-center justify-center">
                <span className="text-2xl">🍽️</span>
              </div>
            )}
            
            {/* Availability Badge */}
            {!item.isAvailable && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <Badge variant="destructive" className="text-xs">
                  Out of Stock
                </Badge>
              </div>
            )}

            {/* Popular Badge */}
            <div className="absolute top-1 left-1">
              <div className="w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center">
                <Star className="w-3 h-3 text-white fill-current" />
              </div>
            </div>
          </div>

          {/* Item Details */}
          <div className="flex-1 p-4 min-w-0">
            <div className="flex justify-between items-start mb-2">
              <div className="flex-1 pr-2">
                <h3 className="font-semibold text-gray-900 text-base leading-tight mb-1">
                  {item.name}
                </h3>
                <p className="text-gray-600 text-sm line-clamp-2 leading-snug">
                  {item.description || "Delicious and freshly prepared"}
                </p>
              </div>
              
              {/* Price */}
              <div className="text-right">
                <p className="font-bold text-orange-600 text-lg">
                  ₹{item.price}
                </p>
              </div>
            </div>

            {/* Additional Info */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1">
                  <Clock className="w-3 h-3 text-gray-400" />
                  <span className="text-xs text-gray-500">15-20 min</span>
                </div>
                <Badge variant="outline" className="text-xs py-0 px-2 h-5">
                  {item.category}
                </Badge>
              </div>

              {/* Add to Cart Button */}
              <Button
                onClick={handleAddToCart}
                disabled={!item.isAvailable || isAdding}
                size="sm"
                className={`min-w-[80px] h-8 text-xs transition-all duration-200 ${
                  isAdding 
                    ? "bg-green-500 hover:bg-green-600" 
                    : "bg-orange-500 hover:bg-orange-600"
                }`}
              >
                {isAdding ? (
                  <>
                    <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin mr-1"></div>
                    Added!
                  </>
                ) : (
                  <>
                    <Plus className="w-3 h-3 mr-1" />
                    Add
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

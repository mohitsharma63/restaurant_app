
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Minus, Star, Clock, Heart, Flame, Leaf, Timer } from "lucide-react";
import { useState } from "react";

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image?: string;
  isAvailable: boolean;
  preparationTime: number;
  isVegetarian?: boolean;
  isSpicy?: boolean;
  rating?: number;
  reviews?: number;
  isPopular?: boolean;
}

interface HorizontalMenuCardProps {
  item: MenuItem;
  onAddToCart: (item: MenuItem) => void;
  onRemoveFromCart?: (itemId: string) => void;
  quantity?: number;
  onToggleFavorite?: (itemId: string) => void;
  isFavorite?: boolean;
}

export default function HorizontalMenuCard({ 
  item, 
  onAddToCart, 
  onRemoveFromCart,
  quantity = 0,
  onToggleFavorite,
  isFavorite = false
}: HorizontalMenuCardProps) {
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = async () => {
    setIsAdding(true);
    onAddToCart(item);
    setTimeout(() => setIsAdding(false), 300);
  };

  return (
    <Card className="w-80 flex-shrink-0 bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-3xl overflow-hidden mr-4">
      <CardContent className="p-0 h-full">
        <div className="relative h-40 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
          {/* Image */}
          {item.image ? (
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-orange-100 to-red-100">
              <span className="text-4xl">🍽️</span>
            </div>
          )}
          
          {/* Top Badges */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-2">
            {item.isPopular && (
              <Badge className="bg-red-500/90 text-white px-2 py-1 text-xs rounded-full backdrop-blur-sm">
                ⭐ Popular
              </Badge>
            )}
            {item.isVegetarian && (
              <Badge className="bg-green-500/90 text-white px-2 py-1 text-xs rounded-full backdrop-blur-sm">
                <Leaf className="w-3 h-3 mr-1" />
                Veg
              </Badge>
            )}
            {item.isSpicy && (
              <Badge className="bg-orange-500/90 text-white px-2 py-1 text-xs rounded-full backdrop-blur-sm">
                <Flame className="w-3 h-3 mr-1" />
                Spicy
              </Badge>
            )}
          </div>

          {/* Favorite Button */}
          {onToggleFavorite && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onToggleFavorite(item.id)}
              className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full p-2 hover:bg-white shadow-md"
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'text-red-500 fill-red-500' : 'text-gray-600'}`} />
            </Button>
          )}

          {/* Bottom Info Overlay */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
            <div className="flex items-center justify-between text-white">
              <div className="flex items-center space-x-2">
                {item.rating && (
                  <div className="flex items-center space-x-1 bg-black/30 rounded-full px-2 py-1">
                    <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                    <span className="text-xs font-medium">{item.rating}</span>
                  </div>
                )}
                <div className="flex items-center space-x-1 bg-black/30 rounded-full px-2 py-1">
                  <Timer className="w-3 h-3" />
                  <span className="text-xs font-medium">{item.preparationTime}m</span>
                </div>
              </div>
            </div>
          </div>

          {/* Availability Overlay */}
          {!item.isAvailable && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <Badge variant="destructive" className="px-3 py-1">
                Out of Stock
              </Badge>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col h-36">
          <div className="flex-1">
            <h3 className="font-bold text-gray-900 text-lg mb-2 line-clamp-1">
              {item.name}
            </h3>
            <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed mb-2">
              {item.description}
            </p>
            {item.reviews && (
              <div className="flex items-center text-xs text-gray-500 mb-3">
                <Star className="w-3 h-3 text-yellow-400 fill-yellow-400 mr-1" />
                <span>{item.reviews} reviews</span>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between">
            <div>
              <span className="text-xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                ${item.price}
              </span>
            </div>

            <div className="flex items-center space-x-2">
              {quantity > 0 ? (
                <div className="flex items-center bg-orange-100 rounded-full border-2 border-orange-200">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onRemoveFromCart?.(item.id)}
                    className="w-8 h-8 p-0 rounded-full hover:bg-orange-200 text-orange-600"
                    disabled={!item.isAvailable}
                  >
                    <Minus className="w-3 h-3" />
                  </Button>
                  <span className="mx-3 font-bold text-orange-700 min-w-[20px] text-center">
                    {quantity}
                  </span>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={handleAddToCart}
                    className="w-8 h-8 p-0 rounded-full hover:bg-orange-200 text-orange-600"
                    disabled={!item.isAvailable || isAdding}
                  >
                    <Plus className="w-3 h-3" />
                  </Button>
                </div>
              ) : (
                <Button
                  size="sm"
                  onClick={handleAddToCart}
                  disabled={!item.isAvailable || isAdding}
                  className={`px-6 py-2 rounded-full shadow-md transition-all duration-200 ${
                    isAdding 
                      ? "bg-green-500 hover:bg-green-600 text-white" 
                      : "bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white"
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
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

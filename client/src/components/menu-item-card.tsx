import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";
import { type MenuItem } from "@shared/schema";

interface MenuItemCardProps {
  item: MenuItem;
  onAddToCart: (item: MenuItem) => void;
}

export default function MenuItemCard({ item, onAddToCart }: MenuItemCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="flex">
          <img 
            src={item.imageUrl || "https://via.placeholder.com/200x150?text=No+Image"} 
            alt={item.name}
            className="w-24 h-24 object-cover"
            data-testid={`img-menu-item-${item.id}`}
          />
          <div className="flex-1 p-4">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-medium" data-testid={`text-item-name-${item.id}`}>
                {item.name}
              </h3>
              <div className="flex items-center space-x-2">
                <span className="text-lg font-semibold text-primary" data-testid={`text-item-price-${item.id}`}>
                  ${parseFloat(item.price).toFixed(2)}
                </span>
                {!item.isAvailable && (
                  <Badge variant="destructive" className="text-xs">
                    Unavailable
                  </Badge>
                )}
              </div>
            </div>
            {item.description && (
              <p className="text-sm text-muted-foreground mb-3" data-testid={`text-item-description-${item.id}`}>
                {item.description}
              </p>
            )}
            <Button
              onClick={() => onAddToCart(item)}
              disabled={!item.isAvailable}
              size="sm"
              className="hover:opacity-90 transition-opacity"
              data-testid={`button-add-to-cart-${item.id}`}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add to Cart
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MenuItem } from "@shared/schema";
import { Plus } from "lucide-react";

interface MenuItemCardProps {
  item: MenuItem;
  onAddToCart: (item: MenuItem, modifications?: string) => void;
}

export function MenuItemCard({ item, onAddToCart }: MenuItemCardProps) {
  const formatCurrency = (amount: string | number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(typeof amount === 'string' ? parseFloat(amount) : amount);
  };

  const handleAddToCart = () => {
    onAddToCart(item);
  };

  return (
    <Card className="card-hover overflow-hidden" data-testid={`card-menu-item-${item.id}`}>
      {item.imageUrl && (
        <img
          src={item.imageUrl}
          alt={item.name}
          className="w-full h-48 object-cover"
        />
      )}
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-serif font-semibold text-card-foreground line-clamp-1" data-testid={`text-item-name-${item.id}`}>
            {item.name}
          </h3>
          <span className="text-lg font-semibold text-primary ml-2" data-testid={`text-item-price-${item.id}`}>
            {formatCurrency(item.price)}
          </span>
        </div>
        
        {item.description && (
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2" data-testid={`text-item-description-${item.id}`}>
            {item.description}
          </p>
        )}
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {item.tags?.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
            {!item.isAvailable && (
              <Badge variant="destructive" className="text-xs">
                Out of Stock
              </Badge>
            )}
          </div>
          <Button
            onClick={handleAddToCart}
            disabled={!item.isAvailable}
            size="sm"
            data-testid={`button-add-to-cart-${item.id}`}
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

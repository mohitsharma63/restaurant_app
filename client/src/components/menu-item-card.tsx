import { useState } from "react";
import { useCart } from "@/hooks/use-cart";
import type { MenuItemWithCategory } from "@shared/schema";

interface MenuItemCardProps {
  item: MenuItemWithCategory;
}

export default function MenuItemCard({ item }: MenuItemCardProps) {
  const { addItem, removeItem, getItemQuantity } = useCart();
  const [isLoading, setIsLoading] = useState(false);
  
  const quantity = getItemQuantity(item.id);
  const price = parseFloat(item.price);

  const handleAdd = async () => {
    setIsLoading(true);
    await addItem(item);
    setIsLoading(false);
  };

  const handleRemove = async () => {
    setIsLoading(true);
    await removeItem(item.id);
    setIsLoading(false);
  };

  return (
    <div className="bg-card border border-border rounded-lg shadow-sm overflow-hidden" data-testid={`card-menu-item-${item.id}`}>
      {item.imageUrl && (
        <img 
          src={item.imageUrl} 
          alt={item.name}
          className="w-full h-40 object-cover"
          data-testid={`img-menu-item-${item.id}`}
        />
      )}
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-lg" data-testid={`text-item-name-${item.id}`}>
            {item.name}
          </h3>
          <span className="text-primary font-bold text-lg" data-testid={`text-item-price-${item.id}`}>
            ${price.toFixed(2)}
          </span>
        </div>
        
        {item.description && (
          <p className="text-muted-foreground text-sm mb-3" data-testid={`text-item-description-${item.id}`}>
            {item.description}
          </p>
        )}
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <button
              onClick={handleRemove}
              disabled={quantity === 0 || isLoading}
              className="w-8 h-8 bg-muted rounded-full flex items-center justify-center hover:bg-primary hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              data-testid={`button-decrease-${item.id}`}
            >
              <i className="fas fa-minus text-xs"></i>
            </button>
            
            <span className="font-medium min-w-[2rem] text-center" data-testid={`text-quantity-${item.id}`}>
              {quantity}
            </span>
            
            <button
              onClick={handleAdd}
              disabled={isLoading}
              className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              data-testid={`button-increase-${item.id}`}
            >
              <i className="fas fa-plus text-xs"></i>
            </button>
          </div>
          
          <button
            onClick={handleAdd}
            disabled={isLoading}
            className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            data-testid={`button-add-to-cart-${item.id}`}
          >
            {isLoading ? (
              <i className="fas fa-spinner fa-spin"></i>
            ) : (
              "Add to Cart"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

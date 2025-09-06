import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "wouter";
import MenuItemCard from "@/components/menu-item-card";
import CartModal from "@/components/cart-modal";
import { useCart } from "@/hooks/use-cart";
import type { MenuCategory, MenuItemWithCategory } from "@shared/schema";

export default function CustomerMenu() {
  const { restaurantId, tableId } = useParams();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showCart, setShowCart] = useState(false);
  const { items: cartItems, getTotalPrice, getTotalItems } = useCart();

  const { data: categories = [], isLoading: categoriesLoading } = useQuery<MenuCategory[]>({
    queryKey: ["/api/categories"],
  });

  const { data: menuItems = [], isLoading: menuLoading } = useQuery<MenuItemWithCategory[]>({
    queryKey: selectedCategory ? ["/api/menu", selectedCategory] : ["/api/menu"],
  });

  // Auto-select first category when categories load
  useEffect(() => {
    if (categories.length > 0 && !selectedCategory) {
      setSelectedCategory(null); // Show all items initially
    }
  }, [categories, selectedCategory]);

  const filteredItems = selectedCategory 
    ? menuItems.filter(item => item.categoryId === selectedCategory)
    : menuItems;

  const groupedItems = filteredItems.reduce((acc, item) => {
    const categoryName = item.category?.name || "Other";
    if (!acc[categoryName]) {
      acc[categoryName] = [];
    }
    acc[categoryName].push(item);
    return acc;
  }, {} as Record<string, MenuItemWithCategory[]>);

  if (categoriesLoading || menuLoading) {
    return (
      <div className="pt-16 p-4">
        <div className="max-w-md mx-auto space-y-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-card border border-border rounded-lg p-4 animate-pulse">
              <div className="h-40 bg-muted rounded mb-4"></div>
              <div className="h-4 bg-muted rounded mb-2"></div>
              <div className="h-3 bg-muted rounded w-2/3"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="pt-16">
      {/* Restaurant Header */}
      <div className="relative">
        <div className="h-64 bg-gradient-to-br from-primary to-accent relative overflow-hidden">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <h1 className="text-3xl font-bold font-serif mb-2" data-testid="restaurant-name">
              Bella Vista Restaurant
            </h1>
            <p className="text-white/90 mb-1">Authentic Italian Cuisine</p>
            <div className="flex items-center text-sm text-white/80">
              <i className="fas fa-map-marker-alt mr-1"></i>
              <span data-testid="table-info">
                {tableId ? `Table ${tableId} • Section A` : "Select your table"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Category Filters */}
      <div className="sticky top-16 bg-white shadow-sm border-b border-border z-40">
        <div className="flex overflow-x-auto p-4 space-x-3">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              !selectedCategory
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            }`}
            data-testid="category-all"
          >
            All Items
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                selectedCategory === category.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              }`}
              data-testid={`category-${category.name.toLowerCase().replace(/\s+/g, '-')}`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Menu Items */}
      <div className="p-4 pb-32">
        <div className="max-w-md mx-auto space-y-6">
          {Object.entries(groupedItems).map(([categoryName, items]) => (
            <div key={categoryName}>
              <h2 className="text-xl font-bold mb-4 font-serif" data-testid={`section-${categoryName.toLowerCase().replace(/\s+/g, '-')}`}>
                {categoryName}
              </h2>
              <div className="space-y-4">
                {items.map((item) => (
                  <MenuItemCard key={item.id} item={item} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Floating Cart Button */}
      {getTotalItems() > 0 && (
        <div className="fixed bottom-4 left-4 right-4 z-50">
          <div className="max-w-md mx-auto">
            <button
              onClick={() => setShowCart(true)}
              className="w-full bg-primary text-primary-foreground rounded-lg py-4 px-6 shadow-lg hover:bg-primary/90 transition-colors flex items-center justify-between"
              data-testid="button-view-cart"
            >
              <div className="flex items-center">
                <i className="fas fa-shopping-cart mr-2"></i>
                <span className="font-medium" data-testid="text-cart-items">
                  {getTotalItems()} {getTotalItems() === 1 ? 'item' : 'items'}
                </span>
              </div>
              <span className="font-bold" data-testid="text-cart-total">
                ${getTotalPrice().toFixed(2)}
              </span>
            </button>
          </div>
        </div>
      )}

      {/* Cart Modal */}
      {showCart && (
        <CartModal
          isOpen={showCart}
          onClose={() => setShowCart(false)}
          restaurantId={restaurantId}
          tableId={tableId}
        />
      )}
    </div>
  );
}

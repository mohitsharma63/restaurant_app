import { useState, useCallback } from "react";
import type { MenuItem, CartItem } from "@shared/schema";

export function useCart() {
  const [items, setItems] = useState<CartItem[]>([]);

  const addItem = useCallback((menuItem: MenuItem, quantity: number = 1) => {
    setItems(current => {
      const existingIndex = current.findIndex(item => item.menuItem.id === menuItem.id);
      
      if (existingIndex >= 0) {
        const updated = [...current];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity
        };
        return updated;
      } else {
        return [...current, { menuItem, quantity }];
      }
    });
  }, []);

  const removeItem = useCallback((menuItemId: string, quantity: number = 1) => {
    setItems(current => {
      const existingIndex = current.findIndex(item => item.menuItem.id === menuItemId);
      
      if (existingIndex >= 0) {
        const updated = [...current];
        const newQuantity = updated[existingIndex].quantity - quantity;
        
        if (newQuantity <= 0) {
          updated.splice(existingIndex, 1);
        } else {
          updated[existingIndex] = {
            ...updated[existingIndex],
            quantity: newQuantity
          };
        }
        return updated;
      }
      return current;
    });
  }, []);

  const updateItemQuantity = useCallback((menuItemId: string, quantity: number) => {
    setItems(current => {
      if (quantity <= 0) {
        return current.filter(item => item.menuItem.id !== menuItemId);
      }
      
      const existingIndex = current.findIndex(item => item.menuItem.id === menuItemId);
      
      if (existingIndex >= 0) {
        const updated = [...current];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity
        };
        return updated;
      }
      return current;
    });
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const getItemQuantity = useCallback((menuItemId: string) => {
    const item = items.find(item => item.menuItem.id === menuItemId);
    return item?.quantity || 0;
  }, [items]);

  const getTotalItems = useCallback(() => {
    return items.reduce((total, item) => total + item.quantity, 0);
  }, [items]);

  const getTotalPrice = useCallback(() => {
    return items.reduce((total, item) => {
      return total + (parseFloat(item.menuItem.price) * item.quantity);
    }, 0);
  }, [items]);

  return {
    items,
    addItem,
    removeItem,
    updateItemQuantity,
    clearCart,
    getItemQuantity,
    getTotalItems,
    getTotalPrice,
  };
}

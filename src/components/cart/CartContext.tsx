"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Cart, CartItem, addToCart, removeFromCart, updateQuantity, parseCart, serializeCart } from "@/lib/cart";

type CartContextType = {
  cart: Cart;
  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (id: number) => void;
  updateItem: (id: number, quantity: number) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Cart>([]);

  useEffect(() => {
    const stored = localStorage.getItem("cart");
    if (stored) setCart(parseCart(stored));
  }, []);

  const save = (newCart: Cart) => {
    setCart(newCart);
    localStorage.setItem("cart", serializeCart(newCart));
  };

  const addItem = (item: Omit<CartItem, "quantity">) => save(addToCart(cart, item));
  const removeItem = (id: number) => save(removeFromCart(cart, id));
  const updateItem = (id: number, quantity: number) => save(updateQuantity(cart, id, quantity));
  const clearCart = () => save([]);

  return (
    <CartContext.Provider value={{ cart, addItem, removeItem, updateItem, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}

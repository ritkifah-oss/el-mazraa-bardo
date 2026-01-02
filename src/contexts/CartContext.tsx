import React, { createContext, useContext, useState, useEffect } from 'react';
import { Produit, CartItem } from '@/types';
import { getCart, saveCart, clearCart as clearCartStorage } from '@/lib/storage';

interface CartContextType {
  cart: CartItem[];
  addToCart: (produit: Produit, quantite: number) => boolean;
  removeFromCart: (produitId: string) => void;
  updateQuantity: (produitId: string, quantite: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    const savedCart = getCart();
    setCart(savedCart);
  }, []);

  useEffect(() => {
    saveCart(cart);
  }, [cart]);

  const addToCart = (produit: Produit, quantite: number): boolean => {
    if (!produit.actif || produit.stock < quantite) {
      return false;
    }

    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.produit.id === produit.id);
      
      if (existingItem) {
        const newQuantite = existingItem.quantite + quantite;
        if (newQuantite > produit.stock) {
          return prevCart;
        }
        return prevCart.map(item =>
          item.produit.id === produit.id
            ? { ...item, quantite: newQuantite }
            : item
        );
      }
      
      return [...prevCart, { produit, quantite }];
    });
    
    return true;
  };

  const removeFromCart = (produitId: string) => {
    setCart(prevCart => prevCart.filter(item => item.produit.id !== produitId));
  };

  const updateQuantity = (produitId: string, quantite: number) => {
    if (quantite <= 0) {
      removeFromCart(produitId);
      return;
    }

    setCart(prevCart =>
      prevCart.map(item => {
        if (item.produit.id === produitId) {
          const newQuantite = Math.min(quantite, item.produit.stock);
          return { ...item, quantite: newQuantite };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCart([]);
    clearCartStorage();
  };

  const getTotal = () => {
    return cart.reduce((total, item) => total + item.produit.prix * item.quantite, 0);
  };

  const getItemCount = () => {
    return cart.reduce((count, item) => count + item.quantite, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotal,
        getItemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
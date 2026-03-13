'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export interface CartItem {
    id: number;
    name: string;
    localizedName: string;
    emoji: string;
    farmer: string;
    farmerId: number;
    farmerPhone: string;
    location: string;
    price: number;
    qty: number;
    minOrder: number;
    organic: boolean;
}

interface CartContextType {
    cartItems: CartItem[];
    cartCount: number;
    cartTotal: number;
    addToCart: (item: CartItem) => void;
    updateQty: (id: number, qty: number) => void;
    removeFromCart: (id: number) => void;
    clearCart: () => void;
    isInCart: (id: number) => boolean;
    getItemQty: (id: number) => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const STORAGE_KEY = 'kisanmart_cart';

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);

    // Load from localStorage on mount
    useEffect(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) setCartItems(JSON.parse(saved));
        } catch { }
    }, []);

    // Persist on every change
    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(cartItems));
    }, [cartItems]);

    const addToCart = useCallback((item: CartItem) => {
        setCartItems(prev => {
            const existing = prev.find(i => i.id === item.id);
            if (existing) {
                return prev.map(i => i.id === item.id ? { ...i, qty: i.qty + item.qty } : i);
            }
            return [...prev, item];
        });
    }, []);

    const updateQty = useCallback((id: number, qty: number) => {
        setCartItems(prev => prev.map(i => i.id === id ? { ...i, qty } : i));
    }, []);

    const removeFromCart = useCallback((id: number) => {
        setCartItems(prev => prev.filter(i => i.id !== id));
    }, []);

    const clearCart = useCallback(() => {
        setCartItems([]);
        localStorage.removeItem(STORAGE_KEY);
    }, []);

    const isInCart = useCallback((id: number) => cartItems.some(i => i.id === id), [cartItems]);
    const getItemQty = useCallback((id: number) => cartItems.find(i => i.id === id)?.qty ?? 0, [cartItems]);

    const cartCount = cartItems.length;
    const cartTotal = cartItems.reduce((sum, i) => sum + i.price * i.qty, 0);

    return (
        <CartContext.Provider value={{ cartItems, cartCount, cartTotal, addToCart, updateQty, removeFromCart, clearCart, isInCart, getItemQty }}>
            {children}
        </CartContext.Provider>
    );
}

export const useCart = () => {
    const ctx = useContext(CartContext);
    if (!ctx) throw new Error('useCart must be used within CartProvider');
    return ctx;
};

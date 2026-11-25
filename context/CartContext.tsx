/**
 * Cart Context
 * 
 * Global cart state management with:
 * - Add to cart
 * - Remove from cart
 * - Update quantity
 * - Cart persistence across screens
 */

import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import Toast from 'react-native-toast-message';

import type { CartItem } from '@/src/data/types';

interface CartContextType {
    items: CartItem[];
    addItem: (item: Omit<CartItem, 'quantity'>) => void;
    removeItem: (id: string) => void;
    updateQuantity: (id: string, quantity: number) => void;
    clearCart: () => void;
    getItemQuantity: (id: string) => number;
    itemCount: number;
    subtotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);

    const addItem = useCallback((newItem: Omit<CartItem, 'quantity'>) => {
        setItems(prev => {
            const existingItem = prev.find(item => item.id === newItem.id);
            if (existingItem) {
                // Increment quantity if item exists
                Toast.show({
                    type: 'success',
                    text1: 'Quantity Updated',
                    text2: `${newItem.name} quantity increased`,
                    position: 'bottom',
                    visibilityTime: 2000,
                });
                return prev.map(item =>
                    item.id === newItem.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }
            // Add new item with quantity 1
            Toast.show({
                type: 'success',
                text1: 'Added to Cart',
                text2: `${newItem.name} added to your cart`,
                position: 'bottom',
                visibilityTime: 2000,
            });
            return [...prev, { ...newItem, quantity: 1 }];
        });
    }, []);

    const removeItem = useCallback((id: string) => {
        setItems(prev => {
            const item = prev.find(i => i.id === id);
            if (item) {
                Toast.show({
                    type: 'info',
                    text1: 'Removed from Cart',
                    text2: `${item.name} removed`,
                    position: 'bottom',
                    visibilityTime: 2000,
                });
            }
            return prev.filter(item => item.id !== id);
        });
    }, []);

    const updateQuantity = useCallback((id: string, quantity: number) => {
        if (quantity <= 0) {
            removeItem(id);
            return;
        }
        setItems(prev =>
            prev.map(item =>
                item.id === id ? { ...item, quantity } : item
            )
        );
    }, [removeItem]);

    const clearCart = useCallback(() => {
        if (items.length > 0) {
            Toast.show({
                type: 'success',
                text1: 'Cart Cleared',
                text2: 'All items have been removed',
                position: 'bottom',
                visibilityTime: 2000,
            });
        }
        setItems([]);
    }, [items.length]);

    const getItemQuantity = useCallback((id: string) => {
        const item = items.find(item => item.id === id);
        return item?.quantity ?? 0;
    }, [items]);

    const itemCount = useMemo(() =>
        items.reduce((sum, item) => sum + item.quantity, 0),
        [items]
    );

    const subtotal = useMemo(() =>
        items.reduce((sum, item) => sum + item.price * item.quantity, 0),
        [items]
    );

    const value = useMemo(() => ({
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        getItemQuantity,
        itemCount,
        subtotal,
    }), [items, addItem, removeItem, updateQuantity, clearCart, getItemQuantity, itemCount, subtotal]);

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}


/**
 * Core Data Types
 * 
 * Strongly typed interfaces for all domain entities.
 * Single source of truth for TypeScript types.
 */

// ============================================
// PRODUCT TYPES
// ============================================

export interface Product {
    readonly id: string;
    readonly name: string;
    readonly price: number;
    /** Primary product image */
    readonly image: string;
    /** Multiple images for carousel (optional, falls back to image) */
    readonly images?: readonly string[];
    readonly category: string;
    readonly rating?: number;
    readonly reviews?: number;
    /** Display name of the backend category */
    readonly categoryName?: string;
    readonly code?: string;
    readonly stock?: number;
    readonly description: string;
    /** Product details/specifications */
    readonly details?: string;
    readonly color?: string;
    readonly inStock?: boolean;
    readonly subCategory?: string;
    /** New arrival flag */
    readonly isNew?: boolean;
    /** Date when product was added (ISO string) */
    readonly addedAt?: string;
}

export interface Category {
    readonly id: string;
    readonly name: string;
    readonly icon: string;
    readonly color: string;
    /** Thumbnail image URL for category display */
    readonly thumbnail?: string;
    readonly productCount: number;
    readonly products: readonly Product[];
    readonly subCategories?: readonly string[];
}

// ============================================
// CART TYPES
// ============================================

export interface CartItem {
    readonly id: string;
    readonly name: string;
    readonly price: number;
    readonly image: string;
    readonly quantity: number;
    readonly color?: string;
}

export interface CartState {
    readonly items: CartItem[];
    readonly itemCount: number;
    readonly subtotal: number;
}

export interface CartActions {
    addItem: (item: Omit<CartItem, 'quantity'>) => void;
    removeItem: (id: string) => void;
    updateQuantity: (id: string, quantity: number) => void;
    clearCart: () => void;
    getItemQuantity: (id: string) => number;
}

export type CartContextType = CartState & CartActions;

// ============================================
// CHECKOUT TYPES
// ============================================

export interface Address {
    readonly id: string;
    readonly name: string;
    readonly street: string;
    readonly city: string;
    readonly state: string;
    readonly zip: string;
    readonly phone: string;
    readonly isDefault?: boolean;
}

export interface PaymentMethod {
    readonly id: string;
    readonly type: 'card' | 'upi' | 'wallet';
    readonly brand?: string;
    readonly last4?: string;
    readonly expiryMonth?: number;
    readonly expiryYear?: number;
    readonly isDefault?: boolean;
}

export interface DeliveryOption {
    readonly id: string;
    readonly name: string;
    readonly description: string;
    readonly price: number;
    readonly estimatedDays: string;
}

export interface OrderSummary {
    readonly subtotal: number;
    readonly shipping: number;
    readonly tax: number;
    readonly discount: number;
    readonly total: number;
}

export interface CheckoutState {
    readonly address: Address | null;
    readonly paymentMethod: PaymentMethod | null;
    readonly deliveryOption: DeliveryOption | null;
    readonly promoCode: string | null;
    readonly isProcessing: boolean;
}

// ============================================
// UI TYPES
// ============================================

export type ProductSortOption = 'price-asc' | 'price-desc' | 'rating' | 'newest';

export interface ProductFilters {
    category: string;
    searchQuery: string;
    sortBy: ProductSortOption;
    priceRange?: [number, number];
}

// ============================================
// NAVIGATION TYPES
// ============================================

export type RootStackParamList = {
    login: undefined;
    otp: { phone: string };
    '(tabs)': undefined;
    'product/[id]': { id: string };
    checkout: undefined;
    modal: undefined;
};

// ============================================
// UTILITY TYPES
// ============================================

/** Ensures a value is a string for safe JSX rendering */
export const ensureString = (value: unknown): string => {
    if (typeof value === 'string') return value;
    if (value === null || value === undefined) return '';
    return String(value);
};

/** Formats price to 2 decimal places */
export const formatPrice = (price: number): string => {
    return `$${price.toFixed(2)}`;
};

/** Calculates order totals */
export const calculateOrderTotals = (
    subtotal: number,
    shipping: number,
    taxRate: number = 0.08,
    discount: number = 0
): OrderSummary => {
    const tax = subtotal * taxRate;
    const total = subtotal + shipping + tax - discount;
    return { subtotal, shipping, tax, discount, total };
};

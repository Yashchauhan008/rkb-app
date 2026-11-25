/**
 * Mock Data
 * 
 * Mock data for checkout flow (addresses, payment methods, etc.)
 */

import { Address, DeliveryOption, PaymentMethod } from './types';

export const mockAddresses: readonly Address[] = [
    {
        id: '1',
        name: 'Ravi Sorathiya',
        street: '123 Main Street, Apt 4B',
        city: 'Mumbai',
        state: 'Maharashtra',
        zip: '400001',
        phone: '+91 98765 43210',
        isDefault: true,
    },
    {
        id: '2',
        name: 'Ravi Sorathiya',
        street: '456 Office Complex, Tower A',
        city: 'Mumbai',
        state: 'Maharashtra',
        zip: '400051',
        phone: '+91 98765 43210',
        isDefault: false,
    },
] as const;

export const mockPaymentMethods: readonly PaymentMethod[] = [
    {
        id: '1',
        type: 'card',
        brand: 'Visa',
        last4: '4242',
        expiryMonth: 12,
        expiryYear: 2026,
        isDefault: true,
    },
    {
        id: '2',
        type: 'card',
        brand: 'Mastercard',
        last4: '8888',
        expiryMonth: 6,
        expiryYear: 2025,
        isDefault: false,
    },
] as const;

export const deliveryOptions: readonly DeliveryOption[] = [
    {
        id: 'standard',
        name: 'Standard Delivery',
        description: '3-5 business days',
        price: 9.99,
        estimatedDays: '3-5',
    },
    {
        id: 'express',
        name: 'Express Delivery',
        description: '1-2 business days',
        price: 19.99,
        estimatedDays: '1-2',
    },
    {
        id: 'overnight',
        name: 'Overnight Delivery',
        description: 'Next business day',
        price: 29.99,
        estimatedDays: '1',
    },
] as const;

/**
 * Get default address
 */
export const getDefaultAddress = (): Address => {
    return mockAddresses.find(a => a.isDefault) || mockAddresses[0];
};

/**
 * Get default payment method
 */
export const getDefaultPaymentMethod = (): PaymentMethod => {
    return mockPaymentMethods.find(p => p.isDefault) || mockPaymentMethods[0];
};

/**
 * Get default delivery option
 */
export const getDefaultDeliveryOption = (): DeliveryOption => {
    return deliveryOptions[0];
};

/**
 * Format address for display
 */
export const formatAddress = (address: Address): string => {
    return `${address.street}, ${address.city}, ${address.state} ${address.zip}`;
};

/**
 * Valid promo codes
 */
export const promoCodes: Record<string, number> = {
    'SAVE10': 0.10,
    'SAVE20': 0.20,
    'WELCOME': 0.15,
} as const;

/**
 * Validate promo code and return discount percentage
 */
export const validatePromoCode = (code: string): number | null => {
    const normalizedCode = code.toUpperCase().trim();
    return promoCodes[normalizedCode] ?? null;
};

/**
 * useCheckout Hook
 * 
 * Encapsulates checkout state, calculations, and order placement.
 */

import { useCart } from '@/context/CartContext';
import type { Address, DeliveryOption, OrderSummary, PaymentMethod } from '@/src/data';
import {
    calculateOrderTotals,
    getDefaultAddress,
    getDefaultDeliveryOption,
    getDefaultPaymentMethod,
    validatePromoCode,
} from '@/src/data';
import { useCallback, useMemo, useState } from 'react';

interface UseCheckoutReturn {
    // State
    address: Address;
    paymentMethod: PaymentMethod;
    deliveryOption: DeliveryOption;
    promoCode: string;
    appliedDiscount: number;
    isProcessing: boolean;
    orderPlaced: boolean;

    // Calculations
    orderSummary: OrderSummary;

    // Actions
    setAddress: (address: Address) => void;
    setPaymentMethod: (method: PaymentMethod) => void;
    setDeliveryOption: (option: DeliveryOption) => void;
    applyPromoCode: (code: string) => boolean;
    removePromoCode: () => void;
    placeOrder: () => Promise<void>;
    resetCheckout: () => void;
}

const TAX_RATE = 0.08; // 8% tax
const FREE_SHIPPING_THRESHOLD = 100;

export function useCheckout(): UseCheckoutReturn {
    const { subtotal, clearCart } = useCart();

    // State
    const [address, setAddress] = useState<Address>(getDefaultAddress());
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(getDefaultPaymentMethod());
    const [deliveryOption, setDeliveryOption] = useState<DeliveryOption>(getDefaultDeliveryOption());
    const [promoCode, setPromoCode] = useState('');
    const [appliedDiscount, setAppliedDiscount] = useState(0);
    const [isProcessing, setIsProcessing] = useState(false);
    const [orderPlaced, setOrderPlaced] = useState(false);

    // Calculate shipping (free over threshold)
    const shippingCost = useMemo(() => {
        if (subtotal >= FREE_SHIPPING_THRESHOLD) return 0;
        return deliveryOption.price;
    }, [subtotal, deliveryOption.price]);

    // Calculate order totals
    const orderSummary = useMemo((): OrderSummary => {
        const discountAmount = subtotal * appliedDiscount;
        return calculateOrderTotals(subtotal, shippingCost, TAX_RATE, discountAmount);
    }, [subtotal, shippingCost, appliedDiscount]);

    // Apply promo code
    const applyPromoCode = useCallback((code: string): boolean => {
        const discount = validatePromoCode(code);
        if (discount !== null) {
            setAppliedDiscount(discount);
            setPromoCode(code.toUpperCase());
            return true;
        }
        return false;
    }, []);

    // Remove promo code
    const removePromoCode = useCallback(() => {
        setAppliedDiscount(0);
        setPromoCode('');
    }, []);

    // Place order
    const placeOrder = useCallback(async (): Promise<void> => {
        setIsProcessing(true);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));

        setIsProcessing(false);
        setOrderPlaced(true);
    }, []);

    // Reset checkout (after order or navigation)
    const resetCheckout = useCallback(() => {
        setOrderPlaced(false);
        setIsProcessing(false);
        clearCart();
    }, [clearCart]);

    return {
        address,
        paymentMethod,
        deliveryOption,
        promoCode,
        appliedDiscount,
        isProcessing,
        orderPlaced,
        orderSummary,
        setAddress,
        setPaymentMethod,
        setDeliveryOption,
        applyPromoCode,
        removePromoCode,
        placeOrder,
        resetCheckout,
    };
}

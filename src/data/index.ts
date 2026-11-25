/**
 * Data Layer Index
 *
 * Types + checkout helpers. Catalog / orders / ledger come from the RKB API (see src/hooks).
 */

export * from './types';

export {
    deliveryOptions, formatAddress, getDefaultAddress, getDefaultDeliveryOption, getDefaultPaymentMethod, mockAddresses,
    mockPaymentMethods, promoCodes,
    validatePromoCode
} from './mock';

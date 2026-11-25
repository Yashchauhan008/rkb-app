/**
 * OrderSummary Component
 * 
 * Reusable order summary used in Cart and Checkout screens.
 * Displays subtotal, shipping, tax, discount, and total.
 */

import { Truck } from 'lucide-react-native';
import { Text, View } from 'react-native';

import { Colors, Shadows } from '@/constants/theme';
import { formatPrice, OrderSummary as OrderSummaryType } from '@/src/data';

interface OrderSummaryProps {
    summary: OrderSummaryType;
    showFreeShippingMessage?: boolean;
    index?: number;
    isDark: boolean;
    colors: typeof Colors.light;
}

export function OrderSummary({
    summary,
    showFreeShippingMessage = true,
    index = 0,
    isDark,
    colors,
}: OrderSummaryProps) {
    const { subtotal, shipping, tax, discount, total } = summary;
    const isFreeShipping = shipping === 0;

    return (
        <View
            style={Shadows.sm}
            className={`rounded-2xl p-5 ${isDark ? 'bg-neutral-900' : 'bg-white'}`}
        >
            <Text className={`font-semibold mb-4 ${isDark ? 'text-white' : 'text-neutral-900'}`}>
                Order Summary
            </Text>

            <SummaryRow label="Subtotal" value={formatPrice(subtotal)} isDark={isDark} />

            <SummaryRow
                label="Shipping"
                value={isFreeShipping ? 'Free' : formatPrice(shipping)}
                valueColor={isFreeShipping ? colors.success : undefined}
                isDark={isDark}
            />

            <SummaryRow label="Tax (8%)" value={formatPrice(tax)} isDark={isDark} />

            {discount > 0 && (
                <SummaryRow
                    label="Discount"
                    value={`-${formatPrice(discount)}`}
                    valueColor={colors.success}
                    isDark={isDark}
                />
            )}

            <View className={`h-px my-3 ${isDark ? 'bg-neutral-800' : 'bg-neutral-100'}`} />

            <View className="flex-row justify-between">
                <Text className={`text-lg font-bold ${isDark ? 'text-white' : 'text-neutral-900'}`}>
                    Total
                </Text>
                <Text className="text-lg font-bold text-primary">
                    {formatPrice(total)}
                </Text>
            </View>

            {/* Free Shipping Message */}
            {showFreeShippingMessage && isFreeShipping && (
                <View className={`rounded-xl p-3 mt-4 flex-row items-center ${isDark ? 'bg-green-900/20' : 'bg-green-50'}`}>
                    <Truck size={16} color={colors.success} strokeWidth={1.5} />
                    <Text className={`text-sm flex-1 ml-2 ${isDark ? 'text-green-400' : 'text-green-600'}`}>
                        You've unlocked free shipping!
                    </Text>
                </View>
            )}
        </View>
    );
}

// Internal row component
interface SummaryRowProps {
    label: string;
    value: string;
    valueColor?: string;
    isDark: boolean;
}

function SummaryRow({ label, value, valueColor, isDark }: SummaryRowProps) {
    return (
        <View className="flex-row justify-between mb-2">
            <Text className={isDark ? 'text-neutral-400' : 'text-neutral-500'}>
                {label}
            </Text>
            <Text
                className={`font-medium`}
                style={valueColor ? { color: valueColor } : undefined}
            >
                {!valueColor && (
                    <Text className={isDark ? 'text-white' : 'text-neutral-900'}>
                        {value}
                    </Text>
                )}
                {valueColor && value}
            </Text>
        </View>
    );
}

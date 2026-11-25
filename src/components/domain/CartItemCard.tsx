/**
 * CartItemCard Component
 * 
 * Reusable cart item card used in Cart and Checkout screens.
 * Stateless - all logic handled by parent.
 */

import { Image } from 'expo-image';
import { Minus, Plus, X } from 'lucide-react-native';
import { Pressable, Text, View } from 'react-native';

import { Colors, Shadows } from '@/constants/theme';
import { formatPrice } from '@/src/data';

interface CartItemCardProps {
    // Required primitive props
    id: string;
    name: string;
    price: number;
    image: string;
    quantity: number;

    // Optional
    index?: number;
    compact?: boolean;
    showQuantityControls?: boolean;

    // Callbacks
    onIncrease?: () => void;
    onDecrease?: () => void;
    onRemove?: () => void;

    // Theme
    isDark: boolean;
    colors: typeof Colors.light;
}

export function CartItemCard({
    name,
    price,
    image,
    quantity,
    index = 0,
    compact = false,
    showQuantityControls = true,
    onIncrease,
    onDecrease,
    onRemove,
    isDark,
    colors,
}: CartItemCardProps) {
    const imageSize = compact ? 16 : 20;
    const imageContainerClass = compact ? 'w-16 h-16' : 'w-20 h-20';

    return (
        <View>
            <Pressable
                style={Shadows.sm}
                className={`rounded-2xl p-4 mb-3 ${isDark ? 'bg-neutral-900' : 'bg-white'}`}
            >
                <View className="flex-row">
                    {/* Product Image */}
                    <View className={`${imageContainerClass} rounded-xl overflow-hidden mr-4 bg-neutral-100 dark:bg-neutral-800`}>
                        <Image
                            source={{ uri: image }}
                            style={{ width: '100%', height: '100%' }}
                            contentFit="cover"
                        />
                    </View>

                    {/* Product Info */}
                    <View className="flex-1 justify-between">
                        <View>
                            <Text className={`text-base font-semibold ${isDark ? 'text-white' : 'text-neutral-900'}`} numberOfLines={1}>
                                {name}
                            </Text>
                            <Text className={`text-sm mt-0.5 ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`}>
                                {formatPrice(price)} each
                            </Text>
                        </View>

                        {/* Quantity Controls */}
                        {showQuantityControls ? (
                            <View className="flex-row items-center justify-between">
                                <View className="flex-row items-center">
                                    <QuantityButton
                                        type="decrease"
                                        onPress={onDecrease}
                                        isDark={isDark}
                                        colors={colors}
                                    />
                                    <Text className={`mx-4 text-base font-semibold ${isDark ? 'text-white' : 'text-neutral-900'}`}>
                                        {quantity}
                                    </Text>
                                    <QuantityButton
                                        type="increase"
                                        onPress={onIncrease}
                                        isDark={isDark}
                                        colors={colors}
                                    />
                                </View>

                                <Text className="text-base font-bold text-primary">
                                    {formatPrice(price * quantity)}
                                </Text>
                            </View>
                        ) : (
                            <View className="flex-row items-center justify-between mt-2">
                                <Text className={`text-sm ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>
                                    Qty: {quantity}
                                </Text>
                                <Text className="text-base font-bold text-primary">
                                    {formatPrice(price * quantity)}
                                </Text>
                            </View>
                        )}
                    </View>
                </View>

                {/* Remove Button */}
                {onRemove && (
                    <Pressable
                        onPress={onRemove}
                        className={`absolute top-3 right-3 w-7 h-7 rounded-full items-center justify-center ${isDark ? 'bg-neutral-800' : 'bg-neutral-100'}`}
                    >
                        <X size={14} color={colors.error} strokeWidth={2} />
                    </Pressable>
                )}
            </Pressable>
        </View>
    );
}

// Internal quantity button component
interface QuantityButtonProps {
    type: 'increase' | 'decrease';
    onPress?: () => void;
    isDark: boolean;
    colors: typeof Colors.light;
}

function QuantityButton({ type, onPress, isDark, colors }: QuantityButtonProps) {
    return (
        <Pressable
            onPress={onPress}
            className={`w-8 h-8 rounded-lg items-center justify-center ${type === 'decrease'
                ? isDark ? 'bg-neutral-800' : 'bg-neutral-100'
                : 'bg-primary'
                }`}
        >
            {type === 'increase'
                ? <Plus size={16} color="#FFFFFF" strokeWidth={2} />
                : <Minus size={16} color={colors.textSecondary} strokeWidth={2} />
            }
        </Pressable>
    );
}

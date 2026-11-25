/**
 * ProductCard Component
 * 
 * Reusable product card used in Products and Categories screens.
 * Stateless - all logic handled by parent.
 */

import { Image } from 'expo-image';
import { Heart, Plus, Star } from 'lucide-react-native';
import { Pressable, Text, View } from 'react-native';

import { Colors, Shadows } from '@/constants/theme';
import { formatPrice } from '@/src/data';

interface ProductCardProps {
    // Required primitive props (prevents [object Object] errors)
    id: number;
    name: string;
    price: number;
    image: string;
    category: string;
    rating: number;
    reviews: number;

    // Optional
    index?: number;
    width?: number;
    showFavorite?: boolean;

    // Callbacks
    onPress: () => void;
    onAddToCart: () => void;

    // Theme
    isDark: boolean;
    colors: typeof Colors.light;
}

export function ProductCard({
    name,
    price,
    image,
    category,
    rating,
    reviews,
    index = 0,
    width,
    showFavorite = true,
    onPress,
    onAddToCart,
    isDark,
    colors,
}: ProductCardProps) {
    const handleAddToCart = (e: any) => {
        e?.stopPropagation?.();
        onAddToCart();
    };

    return (
        <View style={width ? { width } : undefined}>
            <Pressable
                style={Shadows.md}
                onPress={onPress}
                className={`rounded-3xl overflow-hidden ${isDark ? 'bg-neutral-900' : 'bg-white'}`}
            >
                {/* Product Image */}
                <View className="relative">
                    <View className="h-40 bg-neutral-100 dark:bg-neutral-800">
                        <Image
                            source={{ uri: image }}
                            style={{ width: '100%', height: '100%' }}
                            contentFit="cover"
                        />
                    </View>

                    {showFavorite && (
                        <Pressable className={`absolute top-2 right-2 w-8 h-8 rounded-full items-center justify-center ${isDark ? 'bg-neutral-900/80' : 'bg-white/90'}`}>
                            <Heart size={16} color={colors.textTertiary} strokeWidth={1.5} />
                        </Pressable>
                    )}
                </View>

                {/* Product Info */}
                <View className="p-3">
                    <Text className={`text-xs uppercase tracking-wider mb-1 ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`}>
                        {category}
                    </Text>
                    <Text className={`text-sm font-semibold mb-2 ${isDark ? 'text-white' : 'text-neutral-900'}`} numberOfLines={1}>
                        {name}
                    </Text>

                    {/* Rating */}
                    <View className="flex-row items-center mb-3">
                        <Star size={12} color={colors.warning} fill={colors.warning} />
                        <Text className={`text-xs ml-1 font-medium ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>
                            {rating} <Text className="font-normal">({reviews})</Text>
                        </Text>
                    </View>

                    {/* Price & Add Button */}
                    <View className="flex-row items-center justify-between">
                        <Text className="text-lg font-bold text-primary">
                            {formatPrice(price)}
                        </Text>
                        <Pressable
                            style={Shadows.glowSm}
                            onPress={handleAddToCart}
                            className="w-9 h-9 bg-primary rounded-xl items-center justify-center"
                        >
                            <Plus size={18} color="#FFFFFF" strokeWidth={2.5} />
                        </Pressable>
                    </View>
                </View>
            </Pressable>
        </View>
    );
}

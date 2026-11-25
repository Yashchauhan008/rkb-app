/**
 * ProductGridCard Component
 * 
 * A product card for grid display with image, details, rating, and add to cart button.
 */

import * as Haptics from 'expo-haptics';
import { Image } from 'expo-image';
import { Plus } from 'lucide-react-native';
import React from 'react';
import { Pressable, Text, View } from 'react-native';

import { Shadows } from '@/constants/theme';
import type { Product } from '@/src/data/types';

export interface ProductGridCardProps {
    /** Product data */
    product: Product;
    /** Animation delay index (unused, kept for API compatibility) */
    index: number;
    /** Callback when card is pressed */
    onPress: () => void;
    /** Callback when add to cart is pressed */
    onAddToCart: () => void;
    /** Card width in pixels */
    cardWidth: number;
    /** Whether device is tablet size */
    isTablet: boolean;
}

/**
 * Product card for grid layouts
 */
export function ProductGridCard({
    product,
    index,
    onPress,
    onAddToCart,
    cardWidth,
    isTablet,
}: ProductGridCardProps) {
    const imageHeight = isTablet ? 180 : 150;
    const imageUrl = product.images?.[0] ?? product.image;

    return (
        <View style={{ width: cardWidth }}>
            <Pressable
                style={Shadows.md}
                onPress={onPress}
                className="rounded-3xl overflow-hidden bg-white"
            >
                {/* Product Image */}
                <View
                    style={{ height: imageHeight }}
                    className="bg-neutral-100 relative"
                >
                    <Image
                        source={{ uri: imageUrl }}
                        style={{ width: '100%', height: '100%' }}
                        contentFit="cover"
                    />

                </View>

                {/* Product Info */}
                <View className="p-3">
                    {/* Name */}
                    <Text
                        className="text-sm font-semibold mb-1 text-neutral-900"
                        numberOfLines={1}
                    >
                        {product.name}
                    </Text>

                    {/* Price & Add Button */}
                    <View className="flex-row items-center justify-between">
                        <View>
                            <Text className="text-lg font-bold text-primary">
                                ₹{product.price}
                            </Text>
                        </View>
                        <Pressable
                            style={Shadows.glowSm}
                            onPress={(e) => {
                                e.stopPropagation();
                                Haptics.impactAsync(
                                    Haptics.ImpactFeedbackStyle.Medium
                                );
                                onAddToCart();
                            }}
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

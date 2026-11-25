/**
 * CategoryPill Component
 * 
 * A selectable category pill/chip for filtering products.
 */

import * as Haptics from 'expo-haptics';
import { Image } from 'expo-image';
import React from 'react';
import { Pressable, Text, View } from 'react-native';

export interface CategoryPillProps {
    /** Unique identifier for the category */
    id: string;
    /** Display name */
    name: string;
    /** Optional thumbnail image URL */
    image?: string;
    /** Whether this category is currently selected */
    isSelected: boolean;
    /** Callback when pill is pressed */
    onPress: () => void;
    /** Animation delay index (unused, kept for API compatibility) */
    index: number;
}

/**
 * Category filter pill with optional image
 */
export function CategoryPill({
    id,
    name,
    image,
    isSelected,
    onPress,
    index,
}: CategoryPillProps) {
    const handlePress = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onPress();
    };

    return (
        <Pressable
            onPress={handlePress}
            className={`mr-2 px-4 py-2.5 rounded-2xl flex-row items-center ${isSelected
                ? 'bg-primary'
                : 'bg-white border border-neutral-200'
                }`}
        >
            {image && (
                <View className="w-6 h-6 rounded-lg overflow-hidden mr-2 bg-neutral-100">
                    <Image
                        source={{ uri: image }}
                        style={{ width: '100%', height: '100%' }}
                        contentFit="cover"
                    />
                </View>
            )}
            <Text
                className={`font-semibold text-sm ${isSelected ? 'text-white' : 'text-neutral-700'
                    }`}
            >
                {name}
            </Text>
        </Pressable>
    );
}

/**
 * CategoryChip Component
 * 
 * Reusable category filter chip.
 */

import { Pressable, Text, View } from 'react-native';

import { Colors, Shadows } from '@/constants/theme';

interface CategoryChipProps {
    id: string;
    name: string;
    isSelected: boolean;
    onPress: () => void;
    index?: number;
    isDark: boolean;
    colors: typeof Colors.light;
}

export function CategoryChip({
    name,
    isSelected,
    onPress,
    index = 0,
    isDark,
    colors,
}: CategoryChipProps) {
    return (
        <View>
            <Pressable
                style={isSelected ? Shadows.glowSm : undefined}
                onPress={onPress}
                className={`px-5 py-2.5 rounded-full mr-2 ${isSelected
                    ? 'bg-primary'
                    : isDark
                        ? 'bg-neutral-900'
                        : 'bg-neutral-100'
                    }`}
            >
                <Text className={`font-medium text-sm ${isSelected ? 'text-white' : isDark ? 'text-neutral-300' : 'text-neutral-600'}`}>
                    {name}
                </Text>
            </Pressable>
        </View>
    );
}

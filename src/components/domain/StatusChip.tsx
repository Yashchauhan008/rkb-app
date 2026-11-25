/**
 * StatusChip Component
 * 
 * A selectable status filter chip for order filtering.
 */

import React from 'react';
import { Pressable, Text, View } from 'react-native';

export interface StatusChipProps {
    /** Filter id */
    id: string;
    /** Display label */
    label: string;
    /** Whether this status is currently selected */
    isSelected: boolean;
    /** Callback when chip is pressed */
    onPress: () => void;
    /** Animation delay index (unused, kept for API compatibility) */
    index: number;
}

/**
 * Status filter chip for order filtering
 */
export function StatusChip({
    id,
    label,
    isSelected,
    onPress,
    index,
}: StatusChipProps) {
    return (
        <View>
            <Pressable
                onPress={onPress}
                className={`px-5 py-2.5 rounded-full mr-2 ${isSelected
                    ? 'bg-neutral-900'
                    : 'bg-white border border-neutral-200'
                    }`}
            >
                <Text
                    className={`font-semibold text-xs ${isSelected ? 'text-white' : 'text-neutral-600'
                        }`}
                >
                    {label}
                </Text>
            </Pressable>
        </View>
    );
}

/**
 * QuantityButton Component
 * 
 * A compact button for increasing/decreasing quantity values.
 */

import * as Haptics from 'expo-haptics';
import { Minus, Plus } from 'lucide-react-native';
import React from 'react';
import { Pressable } from 'react-native';

export interface QuantityButtonProps {
    /** Button type - increase or decrease */
    type: 'increase' | 'decrease';
    /** Callback when button is pressed */
    onPress: () => void;
    /** Whether button is disabled */
    disabled?: boolean;
    /** Size variant */
    size?: 'sm' | 'md';
}

/**
 * Quantity adjustment button with haptic feedback
 */
export function QuantityButton({
    type,
    onPress,
    disabled = false,
    size = 'sm',
}: QuantityButtonProps) {
    const handlePress = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onPress();
    };

    const iconSize = size === 'sm' ? 12 : 16;
    const buttonSize = size === 'sm' ? 'w-6 h-6' : 'w-8 h-8';

    return (
        <Pressable
            style={{ opacity: disabled ? 0.3 : 1 }}
            disabled={disabled}
            onPress={handlePress}
            className={`${buttonSize} rounded-full items-center justify-center ${type === 'increase' ? 'bg-neutral-900' : 'bg-neutral-100'
                }`}
        >
            {type === 'increase' ? (
                <Plus size={iconSize} color="#FFFFFF" strokeWidth={2.5} />
            ) : (
                <Minus size={iconSize} color="#525252" strokeWidth={2.5} />
            )}
        </Pressable>
    );
}

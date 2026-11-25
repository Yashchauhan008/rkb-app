/**
 * Premium Card Component
 * 
 * A consistent card wrapper with:
 * - Subtle border and shadow
 * - Multiple variants
 */

import * as Haptics from 'expo-haptics';
import React, { useCallback } from 'react';
import { Pressable, View, ViewProps } from 'react-native';

import { Colors, Shadows } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

// ============================================
// TYPES
// ============================================

type CardVariant = 'elevated' | 'outlined' | 'filled';

interface CardProps extends ViewProps {
    variant?: CardVariant;
    pressable?: boolean;
    onPress?: () => void;
    padding?: 'none' | 'sm' | 'md' | 'lg';
    radius?: 'md' | 'lg' | 'xl' | '2xl' | '3xl';
}

// ============================================
// STYLES
// ============================================

const getPaddingClass = (padding: CardProps['padding']) => {
    switch (padding) {
        case 'none': return '';
        case 'sm': return 'p-3';
        case 'md': return 'p-4';
        case 'lg': return 'p-5';
        default: return 'p-4';
    }
};

const getRadiusClass = (radius: CardProps['radius']) => {
    switch (radius) {
        case 'md': return 'rounded-lg';
        case 'lg': return 'rounded-xl';
        case 'xl': return 'rounded-2xl';
        case '2xl': return 'rounded-3xl';
        case '3xl': return 'rounded-[32px]';
        default: return 'rounded-2xl';
    }
};

// ============================================
// COMPONENT
// ============================================

export function Card({
    variant = 'elevated',
    pressable = false,
    onPress,
    padding = 'md',
    radius = 'xl',
    children,
    className = '',
    style,
    ...viewProps
}: CardProps) {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';
    const colors = Colors[isDark ? 'dark' : 'light'];

    const handlePress = useCallback(() => {
        if (pressable && onPress) {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            onPress();
        }
    }, [pressable, onPress]);

    // Get variant-specific styles
    const getVariantStyles = () => {
        switch (variant) {
            case 'elevated':
                return {
                    backgroundColor: colors.surface,
                    borderWidth: 1,
                    borderColor: colors.borderSubtle,
                    ...Shadows.md,
                };
            case 'outlined':
                return {
                    backgroundColor: 'transparent',
                    borderWidth: 1,
                    borderColor: colors.border,
                };
            case 'filled':
                return {
                    backgroundColor: colors.backgroundSecondary,
                    borderWidth: 0,
                };
            default:
                return {
                    backgroundColor: colors.surface,
                    borderWidth: 1,
                    borderColor: colors.borderSubtle,
                    ...Shadows.md,
                };
        }
    };

    const baseClassName = `${getPaddingClass(padding)} ${getRadiusClass(radius)} ${className}`;

    if (pressable) {
        return (
            <Pressable
                style={[getVariantStyles(), style]}
                onPress={handlePress}
                className={baseClassName}
                {...viewProps}
            >
                {children}
            </Pressable>
        );
    }

    return (
        <View
            style={[getVariantStyles(), style]}
            className={baseClassName}
            {...viewProps}
        >
            {children}
        </View>
    );
}

export default Card;

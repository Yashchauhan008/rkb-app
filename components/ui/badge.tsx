/**
 * Premium Badge/Chip Component
 * 
 * A versatile badge component for:
 * - Status indicators
 * - Category tags
 * - Labels with icons
 */

import React from 'react';
import { Pressable, Text, View } from 'react-native';

import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

// ============================================
// TYPES
// ============================================

type BadgeVariant = 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
type BadgeSize = 'sm' | 'md' | 'lg';

interface BadgeProps {
    children: React.ReactNode;
    variant?: BadgeVariant;
    size?: BadgeSize;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    onPress?: () => void;
    outline?: boolean;
    className?: string;
}

// ============================================
// STYLES
// ============================================

const getVariantStyles = (variant: BadgeVariant, isDark: boolean, outline: boolean) => {
    const colors = Colors[isDark ? 'dark' : 'light'];

    const variantMap: Record<BadgeVariant, { bg: string; text: string; border: string }> = {
        primary: {
            bg: outline ? 'bg-transparent' : 'bg-primary/15',
            text: 'text-primary',
            border: outline ? 'border border-primary' : '',
        },
        secondary: {
            bg: outline ? 'bg-transparent' : (isDark ? 'bg-neutral-800' : 'bg-neutral-100'),
            text: isDark ? 'text-neutral-300' : 'text-neutral-700',
            border: outline ? (isDark ? 'border border-neutral-700' : 'border border-neutral-300') : '',
        },
        success: {
            bg: outline ? 'bg-transparent' : 'bg-success/15',
            text: isDark ? 'text-success-400' : 'text-success-600',
            border: outline ? 'border border-success' : '',
        },
        warning: {
            bg: outline ? 'bg-transparent' : 'bg-warning/15',
            text: isDark ? 'text-warning-400' : 'text-warning-600',
            border: outline ? 'border border-warning' : '',
        },
        error: {
            bg: outline ? 'bg-transparent' : 'bg-error/15',
            text: isDark ? 'text-error-400' : 'text-error-600',
            border: outline ? 'border border-error' : '',
        },
        info: {
            bg: outline ? 'bg-transparent' : 'bg-info/15',
            text: isDark ? 'text-info-400' : 'text-info-600',
            border: outline ? 'border border-info' : '',
        },
    };

    return variantMap[variant];
};

const getSizeStyles = (size: BadgeSize) => {
    switch (size) {
        case 'sm':
            return {
                padding: 'px-2 py-0.5',
                text: 'text-xs',
                radius: 'rounded-md',
                iconSpacing: 'mr-1',
            };
        case 'md':
            return {
                padding: 'px-3 py-1',
                text: 'text-sm',
                radius: 'rounded-lg',
                iconSpacing: 'mr-1.5',
            };
        case 'lg':
            return {
                padding: 'px-4 py-1.5',
                text: 'text-base',
                radius: 'rounded-xl',
                iconSpacing: 'mr-2',
            };
        default:
            return {
                padding: 'px-3 py-1',
                text: 'text-sm',
                radius: 'rounded-lg',
                iconSpacing: 'mr-1.5',
            };
    }
};

// ============================================
// COMPONENT
// ============================================

export function Badge({
    children,
    variant = 'primary',
    size = 'md',
    leftIcon,
    rightIcon,
    onPress,
    outline = false,
    className = '',
}: BadgeProps) {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';

    const variantStyles = getVariantStyles(variant, isDark, outline);
    const sizeStyles = getSizeStyles(size);

    const content = (
        <>
            {leftIcon && (
                <View className={sizeStyles.iconSpacing}>
                    {leftIcon}
                </View>
            )}
            <Text
                className={`font-semibold ${sizeStyles.text} ${variantStyles.text}`}
            >
                {children}
            </Text>
            {rightIcon && (
                <View className={`ml-1.5`}>
                    {rightIcon}
                </View>
            )}
        </>
    );

    const baseClassName = `
        flex-row items-center
        ${sizeStyles.padding}
        ${sizeStyles.radius}
        ${variantStyles.bg}
        ${variantStyles.border}
        ${className}
    `;

    if (onPress) {
        return (
            <Pressable
                onPress={onPress}
                className={baseClassName}
            >
                {content}
            </Pressable>
        );
    }

    return (
        <View className={baseClassName}>
            {content}
        </View>
    );
}

export default Badge;

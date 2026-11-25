/**
 * Premium Button Component
 * 
 * A polished button with:
 * - Multiple variants: primary, secondary, ghost, danger
 * - Multiple sizes: sm, md, lg
 * - States: default, pressed, loading, disabled
 */

import * as Haptics from 'expo-haptics';
import React, { useCallback } from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';

import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

// ============================================
// TYPES
// ============================================

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
    children: React.ReactNode;
    variant?: ButtonVariant;
    size?: ButtonSize;
    disabled?: boolean;
    loading?: boolean;
    fullWidth?: boolean;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    onPress?: () => void;
    className?: string;
}

// ============================================
// STYLES
// ============================================

const getVariantStyles = (variant: ButtonVariant, isDark: boolean, disabled: boolean) => {
    const colors = Colors[isDark ? 'dark' : 'light'];

    if (disabled) {
        return {
            bg: isDark ? 'bg-neutral-800' : 'bg-neutral-200',
            text: isDark ? 'text-neutral-500' : 'text-neutral-400',
            border: '',
        };
    }

    switch (variant) {
        case 'primary':
            return {
                bg: 'bg-primary',
                text: 'text-white',
                border: '',
            };
        case 'secondary':
            return {
                bg: isDark ? 'bg-neutral-800' : 'bg-neutral-100',
                text: isDark ? 'text-white' : 'text-neutral-900',
                border: isDark ? 'border border-neutral-700' : 'border border-neutral-200',
            };
        case 'ghost':
            return {
                bg: 'bg-transparent',
                text: 'text-primary',
                border: '',
            };
        case 'danger':
            return {
                bg: 'bg-error',
                text: 'text-white',
                border: '',
            };
        default:
            return {
                bg: 'bg-primary',
                text: 'text-white',
                border: '',
            };
    }
};

const getSizeStyles = (size: ButtonSize) => {
    switch (size) {
        case 'sm':
            return {
                padding: 'px-4 py-2.5',
                text: 'text-sm',
                iconSize: 16,
                radius: 'rounded-xl',
            };
        case 'md':
            return {
                padding: 'px-5 py-3.5',
                text: 'text-base',
                iconSize: 18,
                radius: 'rounded-2xl',
            };
        case 'lg':
            return {
                padding: 'px-6 py-4',
                text: 'text-lg',
                iconSize: 20,
                radius: 'rounded-2xl',
            };
        default:
            return {
                padding: 'px-5 py-3.5',
                text: 'text-base',
                iconSize: 18,
                radius: 'rounded-2xl',
            };
    }
};

// ============================================
// COMPONENT
// ============================================

export function Button({
    children,
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    fullWidth = false,
    leftIcon,
    rightIcon,
    onPress,
    className = '',
}: ButtonProps) {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';

    const handlePress = useCallback(() => {
        if (!disabled && !loading && onPress) {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            onPress();
        }
    }, [disabled, loading, onPress]);

    const variantStyles = getVariantStyles(variant, isDark, disabled || loading);
    const sizeStyles = getSizeStyles(size);

    const isDisabled = disabled || loading;

    return (
        <Pressable
            onPress={handlePress}
            disabled={isDisabled}
            className={`
                flex-row items-center justify-center
                ${sizeStyles.padding}
                ${sizeStyles.radius}
                ${variantStyles.bg}
                ${variantStyles.border}
                ${fullWidth ? 'w-full' : ''}
                ${isDisabled ? 'opacity-70' : ''}
                ${className}
            `}
        >
            {loading ? (
                <ActivityIndicator
                    size="small"
                    color={variant === 'primary' || variant === 'danger' ? '#FFFFFF' : Colors[isDark ? 'dark' : 'light'].primary}
                />
            ) : (
                <>
                    {leftIcon && (
                        <View className="mr-2">
                            {leftIcon}
                        </View>
                    )}
                    <Text
                        className={`
                            font-semibold
                            ${sizeStyles.text}
                            ${variantStyles.text}
                        `}
                    >
                        {children}
                    </Text>
                    {rightIcon && (
                        <View className="ml-2">
                            {rightIcon}
                        </View>
                    )}
                </>
            )}
        </Pressable>
    );
}

export default Button;

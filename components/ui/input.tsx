/**
 * Premium Input Component
 * 
 * A polished text input with:
 * - Floating label
 * - Focus glow effect
 * - Error state
 * - Success state with checkmark
 * - Helper text support
 */

import React, { useCallback, useState } from 'react';
import {
    NativeSyntheticEvent,
    Text,
    TextInput,
    TextInputFocusEventData,
    TextInputProps,
    View
} from 'react-native';

import { Colors, Shadows } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

// ============================================
// TYPES
// ============================================

type InputState = 'default' | 'focused' | 'error' | 'success';

interface InputProps extends Omit<TextInputProps, 'onFocus' | 'onBlur'> {
    label?: string;
    helperText?: string;
    errorText?: string;
    state?: InputState;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    showSuccessIcon?: boolean;
    containerClassName?: string;
    onFocus?: (e: NativeSyntheticEvent<TextInputFocusEventData>) => void;
    onBlur?: (e: NativeSyntheticEvent<TextInputFocusEventData>) => void;
}

// ============================================
// COMPONENT
// ============================================

export function Input({
    label,
    helperText,
    errorText,
    state = 'default',
    leftIcon,
    rightIcon,
    showSuccessIcon = true,
    containerClassName = '',
    value,
    onFocus,
    onBlur,
    ...textInputProps
}: InputProps) {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';
    const colors = Colors[isDark ? 'dark' : 'light'];

    const [isFocused, setIsFocused] = useState(false);

    // Determine current state
    const currentState: InputState = state !== 'default' ? state : (isFocused ? 'focused' : 'default');

    // Handle focus changes
    const handleFocus = useCallback((e: NativeSyntheticEvent<TextInputFocusEventData>) => {
        setIsFocused(true);
        onFocus?.(e);
    }, [onFocus]);

    const handleBlur = useCallback((e: NativeSyntheticEvent<TextInputFocusEventData>) => {
        setIsFocused(false);
        onBlur?.(e);
    }, [onBlur]);

    const getBorderColor = () => {
        switch (currentState) {
            case 'focused':
                return colors.borderFocus;
            case 'error':
                return colors.error;
            case 'success':
                return colors.success;
            default:
                return colors.border;
        }
    };

    const getBackgroundColor = () => {
        if (currentState === 'error') return colors.errorSubtle;
        if (isDark) return colors.surface;
        return colors.backgroundSecondary;
    };

    // Helper/Error text display
    const displayText = currentState === 'error' && errorText ? errorText : helperText;
    const textColor = currentState === 'error' ? colors.error : colors.textSecondary;

    return (
        <View className={containerClassName}>
            {/* Label */}
            {label && (
                <Text
                    className={`text-sm font-medium mb-2 ml-1 ${currentState === 'error'
                        ? 'text-error'
                        : isDark ? 'text-neutral-300' : 'text-neutral-700'
                        }`}
                >
                    {label}
                </Text>
            )}

            {/* Input Container */}
            <View
                style={[
                    {
                        borderWidth: currentState === 'focused' ? 2 : 1,
                        borderColor: getBorderColor(),
                        backgroundColor: getBackgroundColor(),
                    },
                    currentState === 'focused' && Shadows.sm,
                ]}
                className="flex-row items-center rounded-2xl overflow-hidden"
            >
                {/* Left Icon */}
                {leftIcon && (
                    <View className="pl-4">
                        {leftIcon}
                    </View>
                )}

                {/* Text Input */}
                <TextInput
                    value={value}
                    onFocus={handleFocus as any}
                    onBlur={handleBlur as any}
                    placeholderTextColor={colors.textTertiary}
                    className={`flex-1 px-4 py-4 text-base ${isDark ? 'text-white' : 'text-neutral-900'
                        }`}
                    {...textInputProps}
                />

                {/* Right Icon / Success / Error Indicator */}
                {currentState === 'success' && showSuccessIcon ? (
                    <View className="pr-4">
                        <View className="w-6 h-6 bg-success rounded-full items-center justify-center">
                            <Text className="text-white text-xs font-bold">✓</Text>
                        </View>
                    </View>
                ) : currentState === 'error' ? (
                    <View className="pr-4">
                        <View className="w-6 h-6 bg-error rounded-full items-center justify-center">
                            <Text className="text-white text-xs font-bold">!</Text>
                        </View>
                    </View>
                ) : rightIcon ? (
                    <View className="pr-4">
                        {rightIcon}
                    </View>
                ) : null}
            </View>

            {/* Helper/Error Text */}
            {displayText && (
                <Text
                    style={{ color: textColor }}
                    className="text-sm mt-1.5 ml-1"
                >
                    {displayText}
                </Text>
            )}
        </View>
    );
}

export default Input;

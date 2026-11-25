/**
 * EmptyState Component
 * 
 * Reusable empty state component with:
 * - Customizable icon
 * - Title and subtitle
 * - Optional action button
 */

import { LucideIcon } from 'lucide-react-native';
import React from 'react';
import { Text, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

type ButtonVariantType = 'primary' | 'secondary' | 'danger' | 'ghost';

interface EmptyStateProps {
    Icon: LucideIcon;
    title: string;
    subtitle?: string;
    actionLabel?: string;
    onAction?: () => void;
    actionVariant?: ButtonVariantType;
}

export function EmptyState({
    Icon,
    title,
    subtitle,
    actionLabel,
    onAction,
    actionVariant = 'primary',
}: EmptyStateProps) {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';
    const colors = Colors[isDark ? 'dark' : 'light'];

    return (
        <View className="flex-1 items-center justify-center py-20">
            <View className={`w-20 h-20 rounded-full items-center justify-center mb-4 ${isDark ? 'bg-neutral-900' : 'bg-neutral-100'}`}>
                <Icon size={32} color={colors.textTertiary} strokeWidth={1.5} />
            </View>
            <Text className={`text-xl font-semibold mb-2 text-center ${isDark ? 'text-white' : 'text-neutral-900'}`}>
                {title}
            </Text>
            {subtitle && (
                <Text className={`text-center mb-6 px-8 ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>
                    {subtitle}
                </Text>
            )}
            {actionLabel && onAction && (
                <Button variant={actionVariant} size="lg" onPress={onAction}>
                    {actionLabel}
                </Button>
            )}
        </View>
    );
}

export default EmptyState;

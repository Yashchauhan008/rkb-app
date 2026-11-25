
import { LucideIcon } from 'lucide-react-native';
import React from 'react';
import { Text, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

interface EmptyStateProps {
    icon: LucideIcon;
    title: string;
    description: string;
    actionLabel?: string;
    onAction?: () => void;
    className?: string;
}

export function EmptyState({
    icon: Icon,
    title,
    description,
    actionLabel,
    onAction,
    className = '',
}: EmptyStateProps) {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';
    const colors = Colors[isDark ? 'dark' : 'light'];

    return (
        <View className={`flex-1 items-center justify-center py-20 ${className}`}>
            <View
                className={`w-20 h-20 rounded-full items-center justify-center mb-6 ${isDark ? 'bg-neutral-900' : 'bg-neutral-100'}`}
            >
                <Icon size={32} color={colors.textTertiary} strokeWidth={1.5} />
            </View>

            <Text className={`text-xl font-bold mb-3 text-center ${isDark ? 'text-white' : 'text-neutral-900'}`}>
                {title}
            </Text>

            <Text className={`text-center mb-8 px-8 leading-6 ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>
                {description}
            </Text>

            {actionLabel && onAction && (
                <Button variant="primary" size="lg" onPress={onAction}>
                    {actionLabel}
                </Button>
            )}
        </View>
    );
}

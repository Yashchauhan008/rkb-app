/**
 * SectionCard Component
 * 
 * A pressable card with icon, title, and content area.
 * Used for sections in checkout and detail screens.
 */

import { ChevronRight } from 'lucide-react-native';
import React from 'react';
import { Pressable, Text, View } from 'react-native';

import { Colors, Shadows } from '@/constants/theme';

export interface SectionCardProps {
    /** Icon component to display */
    Icon: React.ElementType;
    /** Section title */
    title: string;
    /** Card content */
    children: React.ReactNode;
    /** Optional press handler */
    onPress?: () => void;
    /** Animation delay index (unused, kept for API compatibility) */
    index: number;
    /** Whether theme is dark */
    isDark: boolean;
    /** Theme colors object */
    colors: typeof Colors.light;
}

/**
 * Section card with icon and optional navigation
 */
export function SectionCard({
    Icon,
    title,
    children,
    onPress,
    index,
    isDark,
    colors,
}: SectionCardProps) {
    return (
        <View>
            <Pressable
                style={Shadows.xs}
                onPress={onPress}
                className={`rounded-2xl p-4 mb-3 ${isDark ? 'bg-neutral-900' : 'bg-white'
                    }`}
            >
                <View className="flex-row items-center justify-between mb-3">
                    <View className="flex-row items-center">
                        <View
                            className={`w-8 h-8 rounded-lg items-center justify-center mr-3 ${isDark ? 'bg-neutral-800' : 'bg-neutral-100'
                                }`}
                        >
                            <Icon
                                size={16}
                                color={colors.primary}
                                strokeWidth={1.5}
                            />
                        </View>
                        <Text
                            className={`font-semibold ${isDark ? 'text-white' : 'text-neutral-900'
                                }`}
                        >
                            {title}
                        </Text>
                    </View>
                    {onPress && (
                        <ChevronRight
                            size={18}
                            color={colors.textTertiary}
                            strokeWidth={1.5}
                        />
                    )}
                </View>
                {children}
            </Pressable>
        </View>
    );
}

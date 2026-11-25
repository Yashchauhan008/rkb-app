/**
 * SuccessOverlay Component
 * 
 * Full-screen success overlay with checkmark.
 * Used for order confirmation and other success states.
 */

import { Check } from 'lucide-react-native';
import React from 'react';
import { Text, View } from 'react-native';

import { Button } from '@/components/ui/button';

export interface SuccessOverlayProps {
    /** Main title text */
    title: string;
    /** Description text */
    description: string;
    /** Button label */
    buttonLabel: string;
    /** Callback when button is pressed */
    onDone: () => void;
}

/**
 * Full-screen success overlay
 */
export function SuccessOverlay({
    title,
    description,
    buttonLabel,
    onDone,
}: SuccessOverlayProps) {
    return (
        <View className="absolute inset-0 bg-black/80 items-center justify-center z-50">
            <View className="items-center">
                <View className="w-24 h-24 bg-green-500 rounded-full items-center justify-center mb-6">
                    <Check size={48} color="#FFFFFF" strokeWidth={2} />
                </View>
                <Text className="text-white text-2xl font-bold mb-2">
                    {title}
                </Text>
                <Text className="text-neutral-400 text-center mb-8 px-8">
                    {description}
                </Text>
                <Button variant="primary" size="lg" onPress={onDone}>
                    {buttonLabel}
                </Button>
            </View>
        </View>
    );
}

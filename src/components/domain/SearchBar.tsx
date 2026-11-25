/**
 * SearchBar Component
 * 
 * Reusable search bar.
 */

import { Search, SlidersHorizontal, X } from 'lucide-react-native';
import { Pressable, TextInput, View } from 'react-native';

import { Colors, Shadows } from '@/constants/theme';

interface SearchBarProps {
    value: string;
    onChangeText: (text: string) => void;
    placeholder?: string;
    isFocused: boolean;
    onFocus: () => void;
    onBlur: () => void;
    onFilterPress?: () => void;
    index?: number;
    isDark: boolean;
    colors: typeof Colors.light;
}

export function SearchBar({
    value,
    onChangeText,
    placeholder = 'Search...',
    isFocused,
    onFocus,
    onBlur,
    onFilterPress,
    index = 0,
    isDark,
    colors,
}: SearchBarProps) {
    return (
        <View>
            <View
                style={[
                    {
                        borderWidth: isFocused ? 1.5 : 0,
                        borderColor: isFocused ? colors.primary : 'transparent',
                    },
                    isFocused && Shadows.glowSm,
                ]}
                className={`rounded-2xl px-4 py-3.5 flex-row items-center ${isDark ? 'bg-neutral-900' : 'bg-white'}`}
            >
                <Search size={18} color={colors.textTertiary} strokeWidth={1.5} />
                <TextInput
                    value={value}
                    onChangeText={onChangeText}
                    placeholder={placeholder}
                    placeholderTextColor={colors.textTertiary}
                    onFocus={onFocus}
                    onBlur={onBlur}
                    className={`flex-1 ml-3 text-base ${isDark ? 'text-white' : 'text-neutral-900'}`}
                />
                {value.length > 0 && (
                    <Pressable onPress={() => onChangeText('')}>
                        <X size={16} color={colors.textTertiary} strokeWidth={1.5} />
                    </Pressable>
                )}
                {onFilterPress && (
                    <>
                        <View className={`w-px h-5 mx-3 ${isDark ? 'bg-neutral-700' : 'bg-neutral-200'}`} />
                        <Pressable onPress={onFilterPress}>
                            <SlidersHorizontal size={18} color={colors.icon} strokeWidth={1.5} />
                        </Pressable>
                    </>
                )}
            </View>
        </View>
    );
}

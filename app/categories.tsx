import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { ChevronRight, Package, Search, X } from 'lucide-react-native';
import { useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Colors, Shadows } from '@/constants/theme';
import { useCategories } from '@/src/hooks/useCatalog';

const colors = Colors.light;

export default function CategoriesScreen() {
    const [searchQuery, setSearchQuery] = useState('');
    const { data: categories = [], isLoading, isError, refetch } = useCategories();

    const filtered = useMemo(() => {
        const q = searchQuery.trim().toLowerCase();
        return q ? categories.filter((c) => c.name.toLowerCase().includes(q)) : categories;
    }, [categories, searchQuery]);

    return (
        <SafeAreaView className="flex-1 bg-neutral-50" edges={['bottom']}>
            <View className="px-5 pt-4 pb-3">
                <View
                    style={Shadows.sm}
                    className="rounded-2xl px-4 h-[52px] flex-row items-center bg-white"
                >
                    <Search size={20} color="#9CA3AF" strokeWidth={1.5} />
                    <TextInput
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        placeholder="Find a category..."
                        placeholderTextColor="#9CA3AF"
                        className="flex-1 ml-3 text-base text-neutral-900"
                    />
                    {searchQuery.length > 0 && (
                        <Pressable onPress={() => setSearchQuery('')}>
                            <X size={16} color="#6B7280" />
                        </Pressable>
                    )}
                </View>
            </View>

            <ScrollView className="flex-1 px-5" showsVerticalScrollIndicator={false}>
                {isLoading && <ActivityIndicator color={colors.primary} style={{ marginTop: 32 }} />}

                {isError && (
                    <Pressable onPress={() => refetch()} className="items-center py-10">
                        <Text className="text-neutral-500">Could not load categories. Tap to retry.</Text>
                    </Pressable>
                )}

                {filtered.map((category) => (
                    <Pressable
                        key={category.id}
                        onPress={() => {
                            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                            router.push({
                                pathname: '/(drawer)/(tabs)/products',
                                params: { category: category.id },
                            } as any);
                        }}
                        style={Shadows.sm}
                        className="flex-row items-center bg-white rounded-2xl p-4 mb-3"
                    >
                        <View className="w-10 h-10 rounded-xl items-center justify-center mr-3 bg-neutral-100">
                            <Package size={20} color={colors.primary} strokeWidth={2} />
                        </View>
                        <Text className="flex-1 text-base font-semibold text-neutral-900">{category.name}</Text>
                        <ChevronRight size={18} color="#9CA3AF" />
                    </Pressable>
                ))}

                {!isLoading && !isError && filtered.length === 0 && (
                    <Text className="text-center text-neutral-400 py-10">No categories found</Text>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

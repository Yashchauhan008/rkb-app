import { DrawerActions, useNavigation } from '@react-navigation/native';
import { router, useLocalSearchParams } from 'expo-router';
import {
    Grid3X3,
    Menu,
    Search,
    ShoppingCart,
    Sparkles,
    X,
} from 'lucide-react-native';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, RefreshControl, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Colors, Shadows } from '@/constants/theme';
import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/context/LanguageContext';
import { CategoryPill, ProductGridCard } from '@/src/components/domain';
import type { Product } from '@/src/data/types';
import { useResponsiveLayout } from '@/src/hooks';
import { useCategories, useStoreProducts } from '@/src/hooks/useCatalog';

const colors = Colors.light;

export default function ProductsScreen() {
    const { t } = useLanguage();
    const { addItem, itemCount } = useCart();
    const navigation = useNavigation();
    const layout = useResponsiveLayout();

    const params = useLocalSearchParams<{ category?: string }>();
    const [selectedCategory, setSelectedCategory] = useState('all');
    useEffect(() => {
        if (params.category) setSelectedCategory(String(params.category));
    }, [params.category]);
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [isSearchFocused, setIsSearchFocused] = useState(false);

    // Debounce server-side search
    useEffect(() => {
        const handle = setTimeout(() => setDebouncedSearch(searchQuery.trim()), 350);
        return () => clearTimeout(handle);
    }, [searchQuery]);

    const { data: categories = [] } = useCategories();
    const {
        products: filteredProducts,
        isLoading,
        isError,
        error,
        refetch,
        isRefetching,
        hasNextPage,
        fetchNextPage,
        isFetchingNextPage,
    } = useStoreProducts({
        search: debouncedSearch,
        categoryId: selectedCategory === 'all' ? null : selectedCategory,
    });

    const onRefresh = useCallback(() => {
        refetch();
    }, [refetch]);

    const handleAddToCart = (product: Product) => {
        addItem({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.images?.[0] ?? product.image,
            color: '#F59E0B',
        });
    };

    // Create rows for grid layout
    const productRows = useMemo(() => {
        const rows: Product[][] = [];
        for (let i = 0; i < filteredProducts.length; i += layout.numColumns) {
            rows.push(filteredProducts.slice(i, i + layout.numColumns));
        }
        return rows;
    }, [filteredProducts, layout.numColumns]);

    return (
        <SafeAreaView className="flex-1 bg-neutral-50">
            <ScrollView
                className="flex-1"
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={isRefetching}
                        onRefresh={onRefresh}
                        tintColor={colors.primary}
                        colors={[colors.primary]}
                    />
                }
            >
                {/* Header */}
                <View
                    style={{ paddingHorizontal: layout.horizontalPadding }}
                    className="pt-4 pb-3"
                >
                    <View className="flex-row items-center justify-between">
                        <View className="flex-row items-center gap-3">
                            <Pressable
                                onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
                                className="w-11 h-11 rounded-xl items-center justify-center bg-white"
                                style={Shadows.sm}
                            >
                                <Menu size={22} color="#171717" strokeWidth={1.5} />
                            </Pressable>
                            <View>
                                <View className="flex-row items-center">
                                    <Sparkles size={14} color={colors.primary} />
                                    <Text className="text-sm font-medium ml-1 text-primary">
                                        Premium
                                    </Text>
                                </View>
                                <Text className="text-2xl font-bold tracking-tight text-neutral-900">
                                    Discover
                                </Text>
                            </View>
                        </View>

                        {/* Cart Button */}
                        <Pressable
                            onPress={() => router.push('/(drawer)/(tabs)/carts')}
                            style={Shadows.sm}
                            className="relative w-11 h-11 rounded-xl items-center justify-center bg-white"
                        >
                            <ShoppingCart size={20} color="#171717" strokeWidth={1.5} />
                            {itemCount > 0 && (
                                <View className="absolute -top-1.5 -right-1.5 min-w-[20px] h-5 bg-primary rounded-full items-center justify-center px-1">
                                    <Text className="text-white text-[10px] font-bold">
                                        {itemCount > 99 ? '99+' : itemCount}
                                    </Text>
                                </View>
                            )}
                        </Pressable>
                    </View>
                </View>

                {/* Search Bar - Filter icon removed */}
                <View
                    style={{ paddingHorizontal: layout.horizontalPadding }}
                    className="pb-4"
                >
                    <View
                        style={[
                            Shadows.sm,
                            {
                                borderTopWidth: isSearchFocused ? 2 : 0,
                                borderBottomWidth: isSearchFocused ? 2 : 0,
                                borderLeftWidth: isSearchFocused ? 2 : 0,
                                borderRightWidth: isSearchFocused ? 2 : 0,
                                borderColor: isSearchFocused ? colors.primary : 'transparent',
                            },
                        ]}
                        className="rounded-2xl px-4 h-[52px] flex-row items-center bg-white"
                    >
                        <Search size={20} color={isSearchFocused ? colors.primary : '#9CA3AF'} strokeWidth={1.5} />
                        <TextInput
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                            placeholder="Search products..."
                            placeholderTextColor="#9CA3AF"
                            onFocus={() => setIsSearchFocused(true)}
                            onBlur={() => setIsSearchFocused(false)}
                            className="flex-1 ml-3 text-base text-neutral-900"
                        />
                        {searchQuery.length > 0 && (
                            <Pressable
                                onPress={() => setSearchQuery('')}
                                className="w-7 h-7 rounded-full bg-neutral-100 items-center justify-center"
                            >
                                <X size={14} color="#6B7280" strokeWidth={2} />
                            </Pressable>
                        )}
                    </View>
                </View>

                {/* Category Pills */}
                <View className="mb-4">
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{ paddingHorizontal: layout.horizontalPadding }}
                    >
                        <CategoryPill
                            id="all"
                            name="All"
                            isSelected={selectedCategory === 'all'}
                            onPress={() => setSelectedCategory('all')}
                            index={0}
                        />
                        {categories.map((category, index) => (
                            <CategoryPill
                                key={category.id}
                                id={category.id}
                                name={category.name}
                                isSelected={selectedCategory === category.id}
                                onPress={() => setSelectedCategory(category.id)}
                                index={index + 1}
                            />
                        ))}
                        {/* See All Option */}
                        <View>
                            <Pressable
                                onPress={() => router.push('/categories' as any)}
                                className="mr-2 px-4 py-2.5 rounded-2xl flex-row items-center bg-neutral-100 border border-neutral-200"
                            >
                                <View className="w-6 h-6 rounded-lg bg-neutral-200 items-center justify-center mr-2">
                                    <Grid3X3 size={14} color="#525252" />
                                </View>
                                <Text className="font-semibold text-sm text-neutral-600">See All</Text>
                            </Pressable>
                        </View>
                    </ScrollView>
                </View>

                {/* Results Header and Sub-Category Selector */}
                <View
                    style={{ paddingHorizontal: layout.horizontalPadding }}
                    className="flex-row items-center justify-between mb-4 h-10"
                >
                    <Text className="text-neutral-500 font-medium">
                        {filteredProducts.length} products
                    </Text>

                    <View />
                </View>

                {/* Products Grid */}
                <View style={{ paddingHorizontal: layout.horizontalPadding }} className="pb-8">
                    {productRows.map((row, rowIndex) => (
                        <View
                            key={rowIndex}
                            className="flex-row"
                            style={{ marginBottom: layout.cardGap }}
                        >
                            {row.map((product, colIndex) => (
                                <View
                                    key={product.id}
                                    style={{ marginRight: colIndex < row.length - 1 ? layout.cardGap : 0 }}
                                >
                                    <ProductGridCard
                                        product={product}
                                        index={rowIndex * layout.numColumns + colIndex}
                                        onPress={() => router.push(`/product/${product.id}`)}
                                        onAddToCart={() => handleAddToCart(product)}
                                        cardWidth={layout.cardWidth}
                                        isTablet={layout.isTablet}
                                    />
                                </View>
                            ))}
                        </View>
                    ))}

                    {isLoading && <ActivityIndicator color={colors.primary} style={{ marginVertical: 24 }} />}

                    {isError && (
                        <View className="items-center py-8">
                            <Text className="text-neutral-500 text-center mb-3">
                                {(error as any)?.message || 'Could not load products'}
                            </Text>
                            <Pressable onPress={() => refetch()} className="px-5 py-2.5 rounded-xl bg-primary">
                                <Text className="text-white font-semibold">Retry</Text>
                            </Pressable>
                        </View>
                    )}

                    {!isLoading && !isError && filteredProducts.length === 0 && (
                        <Text className="text-center text-neutral-400 py-10">No products found</Text>
                    )}

                    {hasNextPage && (
                        <Pressable
                            onPress={() => fetchNextPage()}
                            disabled={isFetchingNextPage}
                            className="self-center mt-2 px-6 py-3 rounded-xl bg-white border border-neutral-200"
                        >
                            {isFetchingNextPage ? (
                                <ActivityIndicator color={colors.primary} />
                            ) : (
                                <Text className="font-semibold text-neutral-700">Load more</Text>
                            )}
                        </Pressable>
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

import { router } from 'expo-router';
import { Search, ShoppingBag } from 'lucide-react-native';
import { useCallback, useState } from 'react';
import { ActivityIndicator, Pressable, RefreshControl, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { EmptyState } from '@/components/ui/empty-state';
import { Colors } from '@/constants/theme';
import { useLanguage } from '@/context/LanguageContext';
import { OrderCard, StatusChip } from '@/src/components/domain';
import { useOrdersList, type OrderSummaryRow } from '@/src/hooks/useOrders';

const colors = Colors.light;

type StatusFilter = string;

const statusFilters: { id: StatusFilter; label: string }[] = [
    { id: 'all', label: 'All' },
    { id: 'pending', label: 'Pending' },
    { id: 'confirmed', label: 'Confirmed' },
    { id: 'processing', label: 'Processing' },
    { id: 'completed', label: 'Completed' },
    { id: 'cancelled', label: 'Cancelled' },
];

function EmptyOrders({ onBrowse }: { onBrowse: () => void }) {
    return (
        <EmptyState
            icon={ShoppingBag}
            title="No orders yet"
            description="Your order history will appear here. Start your premium collection today."
            actionLabel="Start Shopping"
            onAction={onBrowse}
        />
    );
}

export default function OrdersScreen() {
    const { t } = useLanguage();
    const [selectedFilter, setSelectedFilter] = useState<StatusFilter>('all');

    // Status filter is only supported for real orders; bills ignore it.
    const { orders, source, isLoading, isError, error, refetch, isRefetching, hasNextPage, fetchNextPage, isFetchingNextPage } =
        useOrdersList({ status: selectedFilter === 'all' ? undefined : selectedFilter });

    const handleRefresh = useCallback(() => {
        refetch();
    }, [refetch]);

    const handleOrderPress = (order: OrderSummaryRow) => {
        router.push({ pathname: '/order/[id]', params: { id: order.id, source: order.source } } as any);
    };

    return (
        <SafeAreaView className="flex-1 bg-neutral-50" edges={['top']}>
            <View className="flex-1">
                <ScrollView
                    className="flex-1"
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl
                            refreshing={isRefetching}
                            onRefresh={handleRefresh}
                            tintColor={colors.primary}
                        />
                    }
                    contentContainerStyle={{ paddingBottom: 100 }}
                >
                    {/* Header */}
                    <View className="px-5 pt-2 pb-6 bg-white rounded-b-[32px] shadow-sm mb-4 z-10">
                        <View className="flex-row justify-between items-center mb-6">
                            <View>
                                <Text className="text-3xl font-bold text-neutral-900 tracking-tight">Orders</Text>
                                <Text className="text-neutral-500 font-medium">{orders.length} {source === 'bill' ? 'bills' : 'orders'}</Text>
                            </View>
                            <Pressable className="w-10 h-10 rounded-full bg-neutral-50 items-center justify-center border border-neutral-100">
                                <Search size={20} color="#171717" strokeWidth={2} />
                            </Pressable>
                        </View>

                        {/* Status Filters */}
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            className="overflow-visible"
                        >
                            {statusFilters.map((filter, index) => (
                                <StatusChip
                                    key={filter.id}
                                    id={filter.id}
                                    label={filter.label}
                                    isSelected={selectedFilter === filter.id}
                                    onPress={() => setSelectedFilter(filter.id)}
                                    index={index}
                                />
                            ))}
                        </ScrollView>
                    </View>

                    {/* Orders List */}
                    {isLoading ? (
                        <ActivityIndicator color={colors.primary} style={{ marginTop: 32 }} />
                    ) : isError ? (
                        <Pressable onPress={() => refetch()} className="items-center py-10 px-5">
                            <Text className="text-neutral-500 text-center">
                                {(error as any)?.message || 'Could not load orders'} — tap to retry
                            </Text>
                        </Pressable>
                    ) : orders.length === 0 ? (
                        <EmptyOrders onBrowse={() => router.push('/(tabs)/products' as any)} />
                    ) : (
                        <View className="px-5">
                            {orders.map((order, index) => (
                                <OrderCard
                                    key={order.id}
                                    order={order}
                                    index={index}
                                    onPress={() => handleOrderPress(order)}
                                />
                            ))}
                            {hasNextPage && (
                                <Pressable
                                    onPress={() => fetchNextPage()}
                                    disabled={isFetchingNextPage}
                                    className="self-center px-6 py-3 rounded-xl bg-white border border-neutral-200"
                                >
                                    <Text className="font-semibold text-neutral-700">
                                        {isFetchingNextPage ? 'Loading...' : 'Load more'}
                                    </Text>
                                </Pressable>
                            )}
                        </View>
                    )}
                </ScrollView>
            </View>
        </SafeAreaView>
    );
}

import { Ionicons } from '@expo/vector-icons';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import { Menu } from 'lucide-react-native';
import React from 'react';
import { ActivityIndicator, FlatList, Pressable, RefreshControl, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Colors, Shadows } from '@/constants/theme';
import { useLedger, type LedgerEntryRow } from '@/src/hooks/useOrders';

const colors = Colors.light;

export default function LedgerScreen() {
    const navigation = useNavigation();
    const { entries, isLoading, isError, error, refetch, isRefetching, hasNextPage, fetchNextPage, isFetchingNextPage } = useLedger();

    // Entries arrive newest-first; credit increases the store's balance, debit decreases it.
    const entriesWithBalance = entries;

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: '2-digit',
        });
    };

    const getCategoryIcon = (category: string) => {
        switch (category) {
            case 'sale': return 'cart-outline';
            case 'purchase': return 'bag-handle-outline';
            case 'sale_return':
            case 'purchase_return': return 'return-down-back-outline';
            case 'party_payment': return 'cash-outline';
            case 'expense': return 'document-text-outline';
            default: return 'wallet-outline';
        }
    };

    const renderLedgerEntry = ({ item }: { item: LedgerEntryRow }) => {
        const isCredit = item.type === 'credit';

        return (
            <View
                style={Shadows.sm}
                className="rounded-xl mb-2.5 bg-white border border-neutral-100 overflow-hidden"
            >
                <Pressable className="p-3 flex-row items-center gap-3">
                    {/* Icon */}
                    <View className={`w-10 h-10 rounded-full items-center justify-center ${isCredit ? 'bg-green-50' : 'bg-red-50'}`}>
                        <Ionicons
                            name={getCategoryIcon(item.category) as any}
                            size={18}
                            color={isCredit ? colors.success : colors.error}
                        />
                    </View>

                    {/* Content */}
                    <View className="flex-1">
                        <View className="flex-row justify-between items-center mb-0.5">
                            <Text className="text-sm font-bold text-neutral-900 flex-1 mr-2" numberOfLines={1}>
                                {item.description}
                            </Text>
                            <Text className={`text-base font-bold ${isCredit ? 'text-green-600' : 'text-red-600'}`}>
                                {isCredit ? "+" : "-"}₹{item.amount.toFixed(2)}
                            </Text>
                        </View>

                        <View className="flex-row justify-between items-center">
                            <View className="flex-row items-center">
                                <Text className="text-xs text-neutral-500 font-medium">{formatDate(item.date)}</Text>
                                <Text className="text-xs text-neutral-300 mx-1.5">•</Text>
                                <Text className="text-xs text-neutral-500 font-medium">{item.category.replace(/_/g, ' ')}</Text>
                            </View>
                            {!!item.referenceNumber && (
                                <View className="flex-row items-center bg-neutral-50 px-1.5 py-0.5 rounded">
                                    <Text className="text-xs font-semibold text-neutral-600">{item.referenceNumber}</Text>
                                </View>
                            )}
                        </View>
                    </View>
                </Pressable>
            </View>
        );
    };

    return (
        <SafeAreaView className="flex-1 bg-neutral-50" edges={['top']}>
            {/* Header */}
            <View className="px-5 pt-2 pb-6 flex-row items-center justify-between">
                <View className="flex-row items-center gap-3">
                    <Pressable
                        onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
                        className="w-10 h-10 rounded-full bg-white border border-neutral-200 items-center justify-center -ml-1"
                    >
                        <Menu size={20} color="#171717" />
                    </Pressable>
                    <View>
                        <Text className="text-2xl font-bold text-neutral-900 tracking-tight">Ledger</Text>
                    </View>
                </View>
            </View>

            {/* Content List */}
            <View className="flex-1 px-5">
                <View className="flex-row justify-between items-end mb-4 px-1">
                    <Text className="text-lg font-bold text-neutral-900">Recent Transactions</Text>
                    <Text className="text-xs font-medium text-neutral-500 mb-1">{entriesWithBalance.length} entries</Text>
                </View>

                {isLoading && <ActivityIndicator color={colors.primary} style={{ marginTop: 24 }} />}
                {isError && (
                    <Pressable onPress={() => refetch()} className="py-6 items-center">
                        <Text className="text-neutral-500 text-center">{(error as any)?.message || 'Could not load ledger'} — tap to retry</Text>
                    </Pressable>
                )}
                <FlatList
                    refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={() => refetch()} />}
                    onEndReached={() => hasNextPage && !isFetchingNextPage && fetchNextPage()}
                    onEndReachedThreshold={0.4}
                    data={entriesWithBalance}
                    renderItem={renderLedgerEntry}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={{ paddingBottom: 20 }}
                    showsVerticalScrollIndicator={false}
                />
            </View>
        </SafeAreaView>
    );
}

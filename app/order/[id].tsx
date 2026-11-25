import { useLocalSearchParams, useRouter } from 'expo-router';
import {
    ArrowLeft,
    CheckCircle,
    Clock,
    XCircle
} from 'lucide-react-native';
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Colors, Shadows } from '@/constants/theme';
import { useLanguage } from '@/context/LanguageContext';
import { formatINR, formatOrderDate, getStatusConfig } from '@/src/data/orders';
import { useOrderDetail, type OrderSource } from '@/src/hooks/useOrders';
import { num } from '@/src/utils/files';

const colors = Colors.light;

export default function OrderDetailScreen() {
    const { id, source } = useLocalSearchParams<{ id: string; source?: string }>();
    const router = useRouter();
    const { t } = useLanguage();

    const { data: order, isLoading, isError } = useOrderDetail(id, source === 'bill' ? 'bill' : ('order' as OrderSource));

    const status = (order as any)?.cancelled ? 'cancelled' : order?.status ?? ((order as any)?.verified ? 'completed' : 'pending');
    const statusConfig = getStatusConfig(status);
    const StatusIcon = status === 'completed' ? CheckCircle : status === 'cancelled' ? XCircle : Clock;
    const items = order?.products ?? [];

    return (
        <SafeAreaView className="flex-1 bg-neutral-50" edges={['top', 'left', 'right']}>
            {/* Header */}
            <View className="px-5 py-4 flex-row items-center bg-white border-b border-neutral-100 z-10" style={Shadows.sm}>
                <TouchableOpacity
                    onPress={() => router.back()}
                    className="w-10 h-10 rounded-full bg-neutral-50 items-center justify-center mr-4"
                >
                    <ArrowLeft size={20} color="#171717" strokeWidth={1.5} />
                </TouchableOpacity>
                <View className="flex-1">
                    <Text className="text-lg font-bold text-neutral-900">Order Details</Text>
                </View>
            </View>

            {isLoading ? (
                <ActivityIndicator color={colors.primary} style={{ marginTop: 40 }} />
            ) : isError || !order ? (
                <Text className="text-center text-neutral-500 mt-10">Could not load this order.</Text>
            ) : (
                <ScrollView
                    className="flex-1 px-4 py-4"
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 40 }}
                >
                    {/* Order Info */}
                    <View className="bg-white p-4 rounded-xl mb-4 border border-neutral-100 shadow-sm">
                        <View className="flex-row justify-between items-start">
                            <View className="flex-1 mr-3">
                                <Text className="text-xl font-bold text-neutral-900 mb-1">#{order.serial_number}</Text>
                                <Text className="text-sm text-neutral-500">
                                    {formatOrderDate(order.date ?? order.created_at)}
                                </Text>
                                {!!order.party?.name && (
                                    <Text className="text-sm text-neutral-700 mt-1">{order.party.name}</Text>
                                )}
                            </View>
                            <View className="flex-row items-center px-3 py-1.5 rounded-full" style={{ backgroundColor: statusConfig.bgColor }}>
                                <StatusIcon size={16} color={statusConfig.color} />
                                <Text className="text-xs font-semibold capitalize ml-1.5" style={{ color: statusConfig.color }}>
                                    {statusConfig.label}
                                </Text>
                            </View>
                        </View>
                        {!!order.remark && <Text className="text-sm text-neutral-500 mt-3">{order.remark}</Text>}
                    </View>

                    {/* Items */}
                    <View className="bg-white p-4 rounded-xl mb-4 border border-neutral-100 shadow-sm">
                        <Text className="text-base font-bold text-neutral-900 mb-4">Items</Text>
                        {items.map((item, index) => (
                            <View key={`${item.id}-${index}`}>
                                {index > 0 && <View className="h-px bg-neutral-100 my-3" />}
                                <View className="flex-row justify-between">
                                    <View className="flex-1 mr-3">
                                        <Text className="text-sm font-semibold text-neutral-900" numberOfLines={2}>{item.name}</Text>
                                        {!!item.code && <Text className="text-xs text-neutral-500 mt-0.5">{item.code}</Text>}
                                        <Text className="text-xs text-neutral-500 mt-1">
                                            Qty: {num(item.quantity)} × {formatINR(num(item.price))}
                                        </Text>
                                    </View>
                                    <Text className="text-sm font-bold text-primary">
                                        {formatINR(item.total != null ? num(item.total) : num(item.price) * num(item.quantity))}
                                    </Text>
                                </View>
                            </View>
                        ))}
                        {items.length === 0 && <Text className="text-neutral-400 text-sm">No items</Text>}
                    </View>

                    {/* Summary */}
                    <View className="bg-white p-4 rounded-xl mb-4 border border-neutral-100 shadow-sm">
                        <Text className="text-base font-bold text-neutral-900 mb-4">Summary</Text>
                        <View className="flex-row justify-between mb-3">
                            <Text className="text-base text-neutral-600">Subtotal</Text>
                            <Text className="text-base font-semibold text-neutral-900">{formatINR(num(order.sub_total))}</Text>
                        </View>
                        {num(order.discount) > 0 && (
                            <View className="flex-row justify-between mb-3">
                                <Text className="text-base text-neutral-600">Discount</Text>
                                <Text className="text-base font-semibold text-neutral-900">{num(order.discount)}%</Text>
                            </View>
                        )}
                        <View className="h-px bg-neutral-100 mb-3" />
                        <View className="flex-row justify-between items-center">
                            <Text className="text-xl font-bold text-neutral-900">Total</Text>
                            <Text className="text-xl font-bold text-primary">{formatINR(num(order.total))}</Text>
                        </View>
                    </View>
                </ScrollView>
            )}
        </SafeAreaView>
    );
}

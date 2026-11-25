/**
 * OrderCard Component
 *
 * Summary card for an order / sale bill returned by the RKB API.
 */

import { ArrowRight, Receipt } from 'lucide-react-native';
import React from 'react';
import { Pressable, Text, View } from 'react-native';

import { formatINR, formatOrderDate, getStatusConfig } from '@/src/data/orders';
import type { OrderSummaryRow } from '@/src/hooks/useOrders';

export interface OrderCardProps {
    order: OrderSummaryRow;
    /** Animation delay index (unused, kept for API compatibility) */
    index: number;
    onPress: () => void;
}

export function OrderCard({ order, onPress }: OrderCardProps) {
    const statusConfig = getStatusConfig(order.status);

    return (
        <View className="mb-4">
            <Pressable onPress={onPress} className="rounded-3xl p-5 bg-white border border-neutral-100">
                <View className="flex-row justify-between items-start mb-4">
                    <View className="flex-row items-center">
                        <View className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: statusConfig.color }} />
                        <Text className="text-xs font-bold uppercase tracking-wider text-neutral-500 mr-2">
                            {statusConfig.label}
                        </Text>
                    </View>
                    <Text className="text-neutral-400 text-xs font-medium">{formatOrderDate(order.date)}</Text>
                </View>

                <View className="flex-row">
                    <View className="w-14 h-14 bg-neutral-100 rounded-xl items-center justify-center mr-4">
                        <Receipt size={24} color="#525252" />
                    </View>

                    <View className="flex-1 justify-between">
                        <View>
                            <Text className="text-base font-bold text-neutral-900 mb-1" numberOfLines={1}>
                                {order.partyName || 'Order'}
                            </Text>
                            <Text className="text-neutral-500 text-xs font-medium">
                                {order.source === 'order' ? 'Order' : 'Bill'} #{order.number}
                            </Text>
                        </View>

                        <View className="flex-row justify-between items-end mt-2">
                            <View>
                                <Text className="text-xs text-neutral-400 font-medium mb-0.5">Total</Text>
                                <Text className="text-lg font-bold text-neutral-900">{formatINR(order.total)}</Text>
                            </View>
                            <View className="w-8 h-8 rounded-full bg-neutral-50 items-center justify-center border border-neutral-100">
                                <ArrowRight size={16} color="#171717" />
                            </View>
                        </View>
                    </View>
                </View>
            </Pressable>
        </View>
    );
}

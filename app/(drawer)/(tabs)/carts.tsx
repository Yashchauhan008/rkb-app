import * as Haptics from 'expo-haptics';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import {
    ArrowRight,
    ChevronUp,
    Minus,
    Plus,
    ShoppingBag,
    Trash2,
    X
} from 'lucide-react-native';
import { useState } from 'react';
import {
    Pressable,
    ScrollView,
    Text,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { Colors } from '@/constants/theme';
import { useCart } from '@/context/CartContext';
import type { CartItem } from '@/src/data/types';
import { useResponsiveLayout } from '@/src/hooks';

const colors = Colors.light;

interface QuantityButtonProps {
    type: 'increase' | 'decrease';
    onPress: () => void;
    disabled?: boolean;
}

function QuantityButton({ type, onPress, disabled }: QuantityButtonProps) {
    return (
        <Pressable
            style={{ opacity: disabled ? 0.3 : 1 }}
            disabled={disabled}
            onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                onPress();
            }}
            className={`w-6 h-6 rounded-full items-center justify-center ${type === 'increase' ? 'bg-neutral-900' : 'bg-neutral-100'}`}
        >
            {type === 'increase' ? (
                <Plus size={12} color="#FFFFFF" strokeWidth={2.5} />
            ) : (
                <Minus size={12} color="#525252" strokeWidth={2.5} />
            )}
        </Pressable>
    );
}

interface CartItemCardProps {
    item: CartItem;
    index: number;
    onUpdateQuantity: (id: string, delta: number) => void;
    onRemove: (id: string) => void;
}

function CartItemCard({ item, index, onUpdateQuantity, onRemove }: CartItemCardProps) {
    return (
        <View className="mb-3 bg-white rounded-2xl p-3 flex-row items-center border border-neutral-100">
            {/* Compact Image */}
            <View className="w-16 h-20 rounded-xl bg-neutral-100 mr-3 overflow-hidden">
                <Image
                    source={{ uri: item.image }}
                    style={{ width: '100%', height: '100%' }}
                    contentFit="cover"
                />
            </View>

            {/* Compact Content */}
            <View className="flex-1 h-20 justify-between py-0.5">
                <View className="flex-row justify-between items-start">
                    <View className="flex-1 mr-2">
                        <Text className="text-sm font-semibold text-neutral-900" numberOfLines={1}>
                            {item.name}
                        </Text>
                        <Text className="text-xs text-neutral-500 font-medium mt-0.5">
                            {item.color} • Size M
                        </Text>
                    </View>
                    <Pressable
                        onPress={() => {
                            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                            onRemove(item.id);
                        }}
                        className="w-7 h-7 -mt-1 -mr-1 items-center justify-center rounded-full active:bg-neutral-100"
                    >
                        <Trash2 size={14} color="#EF4444" strokeWidth={1.5} />
                    </Pressable>
                </View>

                <View className="flex-row items-center justify-between">
                    <Text className="text-base font-bold text-primary">
                        ${(item.price * item.quantity).toFixed(2)}
                    </Text>

                    <View className="flex-row items-center bg-neutral-50 rounded-full px-1 py-0.5 border border-neutral-100">
                        <QuantityButton
                            type="decrease"
                            onPress={() => onUpdateQuantity(item.id, -1)}
                            disabled={item.quantity <= 1}
                        />
                        <Text className="w-6 text-center text-xs font-bold text-neutral-900">
                            {item.quantity}
                        </Text>
                        <QuantityButton
                            type="increase"
                            onPress={() => onUpdateQuantity(item.id, 1)}
                        />
                    </View>
                </View>
            </View>
        </View>
    );
}

export default function CartsScreen() {
    const { isTablet } = useResponsiveLayout();
    const { items, updateQuantity, removeItem, clearCart, subtotal } = useCart();

    // Toggle for order details on mobile
    const [showOrderDetails, setShowOrderDetails] = useState(false);

    // Free shipping threshold logic
    const FREE_SHIPPING_THRESHOLD = 150;
    const progress = Math.min(subtotal / FREE_SHIPPING_THRESHOLD, 1);
    const remainingForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
    const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : 15;
    const total = subtotal + shipping;

    const handleUpdateQuantity = (id: string, delta: number) => {
        const item = items.find(i => i.id === id);
        if (item) {
            updateQuantity(id, item.quantity + delta);
        }
    };

    if (items.length === 0) {
        return (
            <SafeAreaView className="flex-1 bg-white">
                <EmptyState
                    icon={ShoppingBag}
                    title="Your bag is empty"
                    description="Start adding distinct items"
                    actionLabel="Shop Now"
                    onAction={() => router.push('/(drawer)/(tabs)/products' as any)}
                />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-white" edges={['top', 'left', 'right']}>
            <View className="flex-1 flex-row">
                {/* Main Content */}
                <View className="flex-1 bg-neutral-50/50">
                    {/* Compact Header */}
                    <View className="bg-white px-5 py-3 border-b border-neutral-100 flex-row items-center justify-between z-10">
                        <View>
                            <Text className="text-xl font-bold text-neutral-900">Shopping Bag <Text className="text-neutral-400 font-medium text-base">({items.length})</Text></Text>
                        </View>
                        <Pressable
                            onPress={clearCart}
                            className="bg-neutral-100 px-3 py-1.5 rounded-full"
                        >
                            <Text className="text-[10px] font-bold text-neutral-600 uppercase tracking-wide">Clear</Text>
                        </Pressable>
                    </View>

                    <ScrollView
                        className="flex-1"
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ padding: 16, paddingBottom: isTablet ? 100 : 180 }}
                    >
                        {items.map((item, index) => (
                            <CartItemCard
                                key={item.id}
                                item={item}
                                index={index}
                                onUpdateQuantity={handleUpdateQuantity}
                                onRemove={removeItem}
                            />
                        ))}
                    </ScrollView>
                </View>

                {/* Sidebar (Tablet) or Bottom Sheet (Phone) */}
                {isTablet ? (
                    <View className="w-[360px] border-l border-neutral-100 h-full p-6 bg-white shadow-sm">
                        <Text className="text-lg font-bold text-neutral-900 mb-6">Summary</Text>
                        <OrderSummary
                            subtotal={subtotal}
                            shipping={shipping}
                            total={total}
                            buttonLabel="Checkout Now"
                        />
                    </View>
                ) : (
                    // Floating Mobile Footer
                    <View className="absolute bottom-0 left-0 right-0">
                        {/* Expanded Details Overlay */}
                        {showOrderDetails && (
                            <Pressable
                                className="absolute bottom-0 left-0 right-0 h-[1000px] bg-black/20"
                                onPress={() => setShowOrderDetails(false)}
                            >
                                <View className="absolute bottom-24 left-4 right-4 bg-white rounded-3xl p-5 shadow-2xl">
                                    <View className="flex-row justify-between items-center mb-4">
                                        <Text className="font-bold text-lg">Order Details</Text>
                                        <Pressable onPress={() => setShowOrderDetails(false)} className="p-1 bg-neutral-100 rounded-full">
                                            <X size={16} color="#000" />
                                        </Pressable>
                                    </View>
                                    <View className="space-y-3">
                                        <View className="flex-row justify-between"><Text className="text-neutral-500">Subtotal</Text><Text className="font-semibold">${subtotal.toFixed(2)}</Text></View>
                                        <View className="flex-row justify-between"><Text className="text-neutral-500">Shipping</Text><Text className={shipping === 0 ? "text-green-600 font-semibold" : "font-semibold"}>{shipping === 0 ? 'Free' : `$${shipping}`}</Text></View>
                                        <View className="h-px bg-neutral-100 my-2" />
                                        <View className="flex-row justify-between"><Text className="font-bold">Total</Text><Text className="font-bold text-primary">${total.toFixed(2)}</Text></View>
                                    </View>
                                </View>
                            </Pressable>
                        )}

                        {/* Sticky Action Bar */}
                        <SafeAreaView edges={['bottom']} className="bg-white border-t border-neutral-100 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
                            <View className="px-5 py-3 flex-row items-center gap-4">
                                <Pressable
                                    onPress={() => {
                                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                        setShowOrderDetails(!showOrderDetails);
                                    }}
                                    className="flex-1"
                                >
                                    <View className="flex-row items-center mb-0.5">
                                        <Text className="text-xs text-neutral-500 font-medium mr-1.5">Total</Text>
                                        <ChevronUp size={12} color="#9CA3AF" />
                                    </View>
                                    <Text className="text-2xl font-bold text-neutral-900 tracking-tight">${total.toFixed(2)}</Text>
                                </Pressable>

                                <Button
                                    variant="primary"
                                    size="lg"
                                    className="flex-[1.5] rounded-2xl shadow-lg shadow-amber-200/50"
                                    onPress={() => router.push('/checkout')}
                                    rightIcon={<ArrowRight size={18} color="#FFF" strokeWidth={2.5} />}
                                >
                                    Checkout
                                </Button>
                            </View>
                        </SafeAreaView>
                    </View>
                )}
            </View>
        </SafeAreaView>
    );
}

function OrderSummary({ subtotal, shipping, total, buttonLabel }: any) {
    return (
        <View>
            <View className="space-y-3 mb-6 bg-neutral-50 p-4 rounded-2xl">
                <View className="flex-row justify-between">
                    <Text className="text-neutral-500 text-sm">Subtotal</Text>
                    <Text className="text-neutral-900 font-semibold">${subtotal.toFixed(2)}</Text>
                </View>
                <View className="flex-row justify-between">
                    <Text className="text-neutral-500 text-sm">Shipping</Text>
                    <Text className={`font-semibold ${shipping === 0 ? 'text-green-600' : 'text-neutral-900'}`}>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</Text>
                </View>
                <View className="h-px bg-neutral-200/50 my-1" />
                <View className="flex-row justify-between items-center">
                    <Text className="text-base font-bold text-neutral-900">Total</Text>
                    <Text className="text-xl font-bold text-primary">${total.toFixed(2)}</Text>
                </View>
            </View>
            <Button
                variant="primary"
                size="lg"
                fullWidth
                onPress={() => router.push('/checkout')}
                rightIcon={<ArrowRight size={20} color="#FFFFFF" strokeWidth={2.5} />}
            >
                {buttonLabel}
            </Button>
        </View>
    );
}

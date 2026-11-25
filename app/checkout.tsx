import * as Haptics from 'expo-haptics';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import {
    ArrowLeft,
    Check,
    ChevronRight,
    CreditCard,
    MapPin,
    Package,
    Shield,
    Truck,
} from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/button';
import { Colors, Shadows } from '@/constants/theme';
import { useCart } from '@/context/CartContext';
import { useColorScheme } from '@/hooks/use-color-scheme';

// Mock data
const savedAddress = {
    name: 'Ravi Sorathiya',
    street: '123 Main Street, Apt 4B',
    city: 'Mumbai, Maharashtra 400001',
    phone: '+91 98765 43210',
};

const paymentMethod = {
    type: 'card',
    last4: '4242',
    brand: 'Visa',
};

interface OrderItemProps {
    item: { id: string; name: string; price: number; quantity: number; image: string };
    index: number;
    isDark: boolean;
}

function OrderItem({ item, index, isDark }: OrderItemProps) {
    return (
        <View className="flex-row items-center py-3">
            <View className="w-16 h-16 rounded-xl overflow-hidden bg-neutral-100 dark:bg-neutral-800 mr-3">
                <Image
                    source={{ uri: item.image }}
                    style={{ width: '100%', height: '100%' }}
                    contentFit="cover"
                />
            </View>
            <View className="flex-1">
                <Text className={`font-medium ${isDark ? 'text-white' : 'text-neutral-900'}`} numberOfLines={1}>
                    {item.name}
                </Text>
                <Text className={`text-sm ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`}>
                    Qty: {item.quantity}
                </Text>
            </View>
            <Text className={`font-semibold ${isDark ? 'text-white' : 'text-neutral-900'}`}>
                ${(item.price * item.quantity).toFixed(2)}
            </Text>
        </View>
    );
}

interface SectionCardProps {
    Icon: React.ElementType;
    title: string;
    children: React.ReactNode;
    onPress?: () => void;
    index: number;
    isDark: boolean;
    colors: typeof Colors.light;
}

function SectionCard({ Icon, title, children, onPress, index, isDark, colors }: SectionCardProps) {
    return (
        <View>
            <Pressable
                style={Shadows.xs}
                onPress={onPress}
                className={`rounded-2xl p-4 mb-3 ${isDark ? 'bg-neutral-900' : 'bg-white'}`}
            >
                <View className="flex-row items-center justify-between mb-3">
                    <View className="flex-row items-center">
                        <View className={`w-8 h-8 rounded-lg items-center justify-center mr-3 ${isDark ? 'bg-neutral-800' : 'bg-neutral-100'}`}>
                            <Icon size={16} color={colors.primary} strokeWidth={1.5} />
                        </View>
                        <Text className={`font-semibold ${isDark ? 'text-white' : 'text-neutral-900'}`}>
                            {title}
                        </Text>
                    </View>
                    {onPress && (
                        <ChevronRight size={18} color={colors.textTertiary} strokeWidth={1.5} />
                    )}
                </View>
                {children}
            </Pressable>
        </View>
    );
}

function SuccessOverlay({ onDone }: { onDone: () => void }) {
    return (
        <View className="absolute inset-0 bg-black/80 items-center justify-center z-50">
            <View className="items-center">
                <View className="w-24 h-24 bg-green-500 rounded-full items-center justify-center mb-6">
                    <Check size={48} color="#FFFFFF" strokeWidth={2} />
                </View>
                <Text className="text-white text-2xl font-bold mb-2">
                    Order Placed!
                </Text>
                <Text className="text-neutral-400 text-center mb-8 px-8">
                    Your order has been placed successfully. You will receive a confirmation shortly.
                </Text>
                <Button variant="primary" size="lg" onPress={onDone}>
                    Continue Shopping
                </Button>
            </View>
        </View>
    );
}

export default function CheckoutScreen() {
    const colorScheme = useColorScheme();
    const isDark = (colorScheme === 'dark');
    const colors = Colors[isDark ? 'dark' : 'light'];
    const { items, subtotal, clearCart } = useCart();

    const [isProcessing, setIsProcessing] = useState(false);
    const [orderPlaced, setOrderPlaced] = useState(false);

    const shipping = subtotal > 100 ? 0 : 9.99;
    const tax = subtotal * 0.08; // 8% tax
    const total = subtotal + shipping + tax;

    const handlePlaceOrder = async () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        setIsProcessing(true);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));

        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        setIsProcessing(false);
        setOrderPlaced(true);
    };

    const handleOrderDone = () => {
        clearCart();
        router.replace('/(tabs)/products' as any);
    };

    if (items.length === 0 && !orderPlaced) {
        router.back();
        return null;
    }

    return (
        <SafeAreaView className={`flex-1 ${isDark ? 'bg-black' : 'bg-neutral-50'}`}>
            {/* Header */}
            <View className="px-5 pt-2 pb-4 flex-row items-center">
                <Pressable
                    onPress={() => router.back()}
                    style={Shadows.xs}
                    className={`w-11 h-11 rounded-xl items-center justify-center mr-4 ${isDark ? 'bg-neutral-900' : 'bg-white'}`}
                >
                    <ArrowLeft size={20} color={colors.icon} strokeWidth={1.5} />
                </Pressable>
                <View>
                    <Text className={`text-xl font-bold ${isDark ? 'text-white' : 'text-neutral-900'}`}>
                        Checkout
                    </Text>
                    <Text className={`text-sm ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`}>
                        {items.length} items
                    </Text>
                </View>
            </View>

            <ScrollView className="flex-1 px-5" showsVerticalScrollIndicator={false}>
                {/* Delivery Address */}
                <SectionCard
                    Icon={MapPin}
                    title="Delivery Address"
                    onPress={() => { }}
                    index={0}
                    isDark={isDark}
                    colors={colors}
                >
                    <View className={`p-3 rounded-xl ${isDark ? 'bg-neutral-800' : 'bg-neutral-50'}`}>
                        <Text className={`font-medium ${isDark ? 'text-white' : 'text-neutral-900'}`}>
                            {savedAddress.name}
                        </Text>
                        <Text className={`text-sm mt-1 ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>
                            {savedAddress.street}
                        </Text>
                        <Text className={`text-sm ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>
                            {savedAddress.city}
                        </Text>
                        <Text className={`text-sm ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>
                            {savedAddress.phone}
                        </Text>
                    </View>
                </SectionCard>

                {/* Payment Method */}
                <SectionCard
                    Icon={CreditCard}
                    title="Payment Method"
                    onPress={() => { }}
                    index={1}
                    isDark={isDark}
                    colors={colors}
                >
                    <View className={`p-3 rounded-xl flex-row items-center ${isDark ? 'bg-neutral-800' : 'bg-neutral-50'}`}>
                        <View className={`w-12 h-8 rounded items-center justify-center mr-3 ${isDark ? 'bg-neutral-700' : 'bg-white'}`}>
                            <Text className="font-bold text-blue-500">VISA</Text>
                        </View>
                        <View className="flex-1">
                            <Text className={`font-medium ${isDark ? 'text-white' : 'text-neutral-900'}`}>
                                •••• •••• •••• {paymentMethod.last4}
                            </Text>
                            <Text className={`text-sm ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>
                                Expires 12/26
                            </Text>
                        </View>
                        <Check size={18} color={colors.success} strokeWidth={2} />
                    </View>
                </SectionCard>

                {/* Delivery Option */}
                <SectionCard
                    Icon={Truck}
                    title="Delivery Option"
                    index={2}
                    isDark={isDark}
                    colors={colors}
                >
                    <View className={`p-3 rounded-xl flex-row items-center justify-between ${isDark ? 'bg-neutral-800' : 'bg-neutral-50'}`}>
                        <View>
                            <Text className={`font-medium ${isDark ? 'text-white' : 'text-neutral-900'}`}>
                                Standard Delivery
                            </Text>
                            <Text className={`text-sm ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>
                                3-5 business days
                            </Text>
                        </View>
                        <Text className={`font-semibold ${shipping === 0 ? 'text-success' : isDark ? 'text-white' : 'text-neutral-900'}`}>
                            {shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}
                        </Text>
                    </View>
                </SectionCard>

                {/* Order Items */}
                <SectionCard
                    Icon={Package}
                    title="Order Items"
                    index={3}
                    isDark={isDark}
                    colors={colors}
                >
                    <View className={`-mx-1`}>
                        {items.map((item, index) => (
                            <OrderItem
                                key={item.id}
                                item={item}
                                index={index}
                                isDark={isDark}
                            />
                        ))}
                    </View>
                </SectionCard>

                {/* Order Summary */}
                <View
                    style={Shadows.sm}
                    className={`rounded-2xl p-4 mb-6 ${isDark ? 'bg-neutral-900' : 'bg-white'}`}
                >
                    <Text className={`font-semibold mb-4 ${isDark ? 'text-white' : 'text-neutral-900'}`}>
                        Order Summary
                    </Text>

                    <View className="flex-row justify-between mb-2">
                        <Text className={isDark ? 'text-neutral-400' : 'text-neutral-500'}>Subtotal</Text>
                        <Text className={`font-medium ${isDark ? 'text-white' : 'text-neutral-900'}`}>
                            ${subtotal.toFixed(2)}
                        </Text>
                    </View>

                    <View className="flex-row justify-between mb-2">
                        <Text className={isDark ? 'text-neutral-400' : 'text-neutral-500'}>Shipping</Text>
                        <Text className={`font-medium ${shipping === 0 ? 'text-success' : isDark ? 'text-white' : 'text-neutral-900'}`}>
                            {shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}
                        </Text>
                    </View>

                    <View className="flex-row justify-between mb-3">
                        <Text className={isDark ? 'text-neutral-400' : 'text-neutral-500'}>Tax (8%)</Text>
                        <Text className={`font-medium ${isDark ? 'text-white' : 'text-neutral-900'}`}>
                            ${tax.toFixed(2)}
                        </Text>
                    </View>

                    <View className={`h-px my-2 ${isDark ? 'bg-neutral-800' : 'bg-neutral-100'}`} />

                    <View className="flex-row justify-between">
                        <Text className={`text-lg font-bold ${isDark ? 'text-white' : 'text-neutral-900'}`}>Total</Text>
                        <Text className="text-lg font-bold text-primary">${total.toFixed(2)}</Text>
                    </View>
                </View>
            </ScrollView>

            {/* Place Order Button */}
            <View
                style={Shadows.xl}
                className={`px-5 py-4 pb-8 ${isDark ? 'bg-black' : 'bg-neutral-50'}`}
            >
                <Button
                    variant="primary"
                    size="lg"
                    fullWidth
                    loading={isProcessing}
                    onPress={handlePlaceOrder}
                    rightIcon={!isProcessing ? <Check size={18} color="#FFFFFF" strokeWidth={2} /> : undefined}
                >
                    {isProcessing ? 'Processing...' : `Place Order • $${total.toFixed(2)}`}
                </Button>

                <View className="flex-row items-center justify-center mt-4">
                    <Shield size={14} color={colors.textTertiary} strokeWidth={1.5} />
                    <Text className={`text-xs ml-2 ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`}>
                        Secure checkout with SSL encryption
                    </Text>
                </View>
            </View>

            {/* Success Overlay */}
            {orderPlaced && <SuccessOverlay onDone={handleOrderDone} />}
        </SafeAreaView>
    );
}

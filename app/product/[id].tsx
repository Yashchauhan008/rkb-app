import * as Haptics from 'expo-haptics';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import {
    ArrowLeft,
    Check,
    ChevronLeft,
    ChevronRight,
    Minus,
    Plus,
    Share2,
    ShoppingBag,
    ShoppingCart,
    Truck
} from 'lucide-react-native';
import { useRef, useState } from 'react';
import { ActivityIndicator } from 'react-native';
import { FlatList, Pressable, ScrollView, Text, useWindowDimensions, View, ViewToken } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/button';
import { useProductDetail } from '@/src/hooks/useCatalog';
import { Colors, Shadows } from '@/constants/theme';
import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/context/LanguageContext';

const colors = Colors.light;

// Responsive hook
function useResponsiveLayout() {
    const { width, height } = useWindowDimensions();
    const isTablet = width >= 768;
    const isLandscape = width > height;

    return { width, height, isTablet, isLandscape };
}

interface ImageCarouselProps {
    images: readonly string[];
    isTablet: boolean;
}

function ImageCarousel({ images, isTablet }: ImageCarouselProps) {
    const { width } = useWindowDimensions();
    const [activeIndex, setActiveIndex] = useState(0);
    const flatListRef = useRef<FlatList>(null);

    const imageWidth = isTablet ? width * 0.6 : width;
    const imageHeight = isTablet ? 500 : 380;

    const onViewableItemsChanged = useRef(({ viewableItems }: { viewableItems: ViewToken[] }) => {
        if (viewableItems.length > 0 && viewableItems[0].index !== null) {
            setActiveIndex(viewableItems[0].index);
        }
    }).current;

    const viewabilityConfig = useRef({
        itemVisiblePercentThreshold: 50,
    }).current;

    const scrollToIndex = (index: number) => {
        if (index >= 0 && index < images.length) {
            flatListRef.current?.scrollToIndex({ index, animated: true });
        }
    };

    return (
        <View>
            <FlatList
                ref={flatListRef}
                data={images}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onViewableItemsChanged={onViewableItemsChanged}
                viewabilityConfig={viewabilityConfig}
                keyExtractor={(_, index) => index.toString()}
                renderItem={({ item }) => (
                    <View style={{ width: imageWidth, height: imageHeight }} className="bg-neutral-100">
                        <Image
                            source={{ uri: item }}
                            style={{ width: '100%', height: '100%' }}
                            contentFit="cover"
                        />

                        {/* Gradient overlay at bottom */}
                        <LinearGradient
                            colors={['transparent', 'rgba(255,255,255,0.8)', '#FFFFFF']}
                            style={{
                                position: 'absolute',
                                bottom: 0,
                                left: 0,
                                right: 0,
                                height: 80,
                            }}
                        />
                    </View>
                )}
                snapToInterval={imageWidth}
                decelerationRate="fast"
            />

            {/* Navigation Arrows - Tablet only */}
            {isTablet && images.length > 1 && (
                <>
                    {activeIndex > 0 && (
                        <Pressable
                            onPress={() => scrollToIndex(activeIndex - 1)}
                            className="absolute left-4 top-1/2 -translate-y-6 w-12 h-12 rounded-2xl items-center justify-center bg-white/95"
                            style={Shadows.md}
                        >
                            <ChevronLeft size={24} color="#171717" strokeWidth={1.5} />
                        </Pressable>
                    )}
                    {activeIndex < images.length - 1 && (
                        <Pressable
                            onPress={() => scrollToIndex(activeIndex + 1)}
                            className="absolute right-4 top-1/2 -translate-y-6 w-12 h-12 rounded-2xl items-center justify-center bg-white/95"
                            style={Shadows.md}
                        >
                            <ChevronRight size={24} color="#171717" strokeWidth={1.5} />
                        </Pressable>
                    )}
                </>
            )}

            {/* Thumbnail Dots */}
            {images.length > 1 && (
                <View className="flex-row justify-center mt-4 gap-2">
                    {images.map((_, index) => (
                        <Pressable
                            key={index}
                            onPress={() => scrollToIndex(index)}
                        >
                            <View
                                className={`h-2 rounded-full ${index === activeIndex
                                    ? 'w-8 bg-primary'
                                    : 'w-2 bg-neutral-300'
                                    }`}
                            />
                        </Pressable>
                    ))}
                </View>
            )}
        </View>
    );
}

export default function ProductDetailScreen() {
    const { t } = useLanguage();
    const { addItem, getItemQuantity } = useCart();
    const insets = useSafeAreaInsets();
    const layout = useResponsiveLayout();

    const { id } = useLocalSearchParams<{ id: string }>();
    const { data: product, isLoading, isError } = useProductDetail(id);

    const [quantity, setQuantity] = useState(1);
    const [addedToCart, setAddedToCart] = useState(false);

    const cartInQuantity = product ? getItemQuantity(product.id) : 0;

    const handleAddToCart = () => {
        if (!product) return;
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

        for (let i = 0; i < quantity; i++) {
            addItem({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.images?.[0] ?? product.image,
                color: '#F59E0B',
            });
        }

        setAddedToCart(true);
        setTimeout(() => setAddedToCart(false), 2000);
    };

    const horizontalPadding = layout.isTablet ? 32 : 20;

    if (isLoading || isError || !product) {
        return (
            <View className="flex-1 items-center justify-center bg-white">
                {isLoading ? (
                    <ActivityIndicator />
                ) : (
                    <>
                        <Text className="text-neutral-500 mb-4">Product not available</Text>
                        <Pressable onPress={() => router.back()}><Text className="text-primary font-semibold">Go back</Text></Pressable>
                    </>
                )}
            </View>
        );
    }

    return (
        <View className="flex-1 bg-white">
            {/* Floating Header */}
            <View
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    zIndex: 50,
                    paddingTop: insets.top,
                    backgroundColor: 'rgba(255,255,255,0.98)',
                }}
            >
                <View
                    style={{ paddingHorizontal: horizontalPadding }}
                    className="flex-row items-center justify-between py-3"
                >
                    <Pressable
                        onPress={() => router.back()}
                        style={Shadows.sm}
                        className="w-11 h-11 rounded-xl items-center justify-center bg-white"
                    >
                        <ArrowLeft size={20} color="#171717" strokeWidth={1.5} />
                    </Pressable>

                    <View className="flex-row gap-2">
                        <Pressable
                            style={Shadows.sm}
                            className="w-11 h-11 rounded-xl items-center justify-center bg-white"
                        >
                            <Share2 size={20} color="#171717" strokeWidth={1.5} />
                        </Pressable>
                    </View>
                </View>
            </View>

            <ScrollView
                className="flex-1"
                showsVerticalScrollIndicator={false}
            >
                {/* Image Carousel */}
                <View style={{ paddingTop: insets.top + 56 }}>
                    <ImageCarousel images={product.images ?? []} isTablet={layout.isTablet} />
                </View>

                {/* Product Info */}
                <View style={{ paddingHorizontal: horizontalPadding }} className="pt-2">


                    {/* Product Name */}
                    <Text className="text-2xl font-bold text-neutral-900 mb-2">
                        {product.name}
                    </Text>

                    {/* Price */}
                    <View className="flex-row items-center mb-4">
                        <Text className="text-3xl font-bold text-primary">
                            ₹{product.price.toFixed(2)}
                        </Text>
                    </View>

                    {/* Description */}
                    <View className="mb-6">
                        <Text className="text-neutral-600 leading-6">
                            {product.description}
                        </Text>
                    </View>

                    {/* Delivery Info */}
                    <View className="flex-row items-center bg-green-50 p-4 rounded-2xl mb-6">
                        <View className="w-10 h-10 rounded-xl bg-green-500 items-center justify-center mr-3">
                            <Truck size={20} color="#FFFFFF" strokeWidth={1.5} />
                        </View>
                        <View className="flex-1">
                            <Text className="font-semibold text-green-700">Free Delivery</Text>
                            <Text className="text-green-600 text-sm">Estimated 3-5 business days</Text>
                        </View>
                    </View>



                    {/* Quantity */}
                    <View className="mb-8">
                        <Text className="text-base font-semibold text-neutral-900 mb-3">Quantity</Text>
                        <View className="flex-row items-center">
                            <View className="flex-row items-center bg-neutral-100 rounded-xl p-1">
                                <Pressable
                                    onPress={() => {
                                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                        setQuantity(Math.max(1, quantity - 1));
                                    }}
                                    className="w-10 h-10 rounded-lg items-center justify-center bg-white"
                                    style={Shadows.xs}
                                >
                                    <Minus size={18} color="#525252" strokeWidth={2} />
                                </Pressable>
                                <Text className="mx-6 text-xl font-bold text-neutral-900">
                                    {quantity}
                                </Text>
                                <Pressable
                                    onPress={() => {
                                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                        setQuantity(quantity + 1);
                                    }}
                                    className="w-10 h-10 bg-primary rounded-lg items-center justify-center"
                                    style={Shadows.glowSm}
                                >
                                    <Plus size={18} color="#FFFFFF" strokeWidth={2} />
                                </Pressable>
                            </View>

                            {cartInQuantity > 0 && (
                                <View className="ml-4 flex-row items-center bg-green-50 px-3 py-2 rounded-xl">
                                    <ShoppingBag size={14} color="#22C55E" strokeWidth={2} />
                                    <Text className="ml-1.5 text-green-600 font-semibold text-sm">
                                        {cartInQuantity} in cart
                                    </Text>
                                </View>
                            )}
                        </View>
                    </View>
                </View>

                {/* Spacing for bottom bar */}
                <View style={{ height: 120 }} />
            </ScrollView>

            {/* Bottom Action Bar */}
            <View
                style={[
                    Shadows.xl,
                    {
                        paddingBottom: insets.bottom + 8,
                        paddingHorizontal: horizontalPadding,
                    }
                ]}
                className="bg-white border-t border-neutral-100 pt-4"
            >
                <View className="flex-row items-center">
                    {/* Total Price */}
                    <View className="flex-1 mr-4">
                        <Text className="text-sm text-neutral-400 mb-0.5">Total Price</Text>
                        <Text className="text-2xl font-bold text-neutral-900">
                            ₹{(product.price * quantity).toFixed(2)}
                        </Text>
                    </View>

                    {/* Add to Cart Button */}
                    <View className="flex-1">
                        <Button
                            variant={addedToCart ? 'secondary' : 'primary'}
                            size="lg"
                            fullWidth
                            onPress={handleAddToCart}
                            leftIcon={addedToCart
                                ? <Check size={20} color={colors.primary} strokeWidth={2} />
                                : <ShoppingCart size={20} color="#FFFFFF" strokeWidth={1.5} />
                            }
                        >
                            {addedToCart ? 'Added!' : 'Add to Cart'}
                        </Button>
                    </View>
                </View>
            </View>
        </View>
    );
}

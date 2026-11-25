import { Colors } from '@/constants/theme';
import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/context/LanguageContext';
import { SCREEN_PERMISSIONS } from '@/src/lib/permissions';
import { useUser } from '@/src/context/UserContext';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { withLayoutContext } from 'expo-router';
import {
  BookOpen,
  Package,
  ShoppingBag,
  ShoppingCart
} from 'lucide-react-native';
import React from 'react';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { Navigator } = createMaterialTopTabNavigator();

// Create a custom Expo Router navigator
export const MaterialTopTabs = withLayoutContext(Navigator);

const colors = Colors.light;

export default function TabLayout() {
  const { t } = useLanguage();
  const { itemCount } = useCart();
  const { canAnyOf } = useUser();
  // UI gating only: the backend enforces permissions on every request.
  const hidden = (key: keyof typeof SCREEN_PERMISSIONS) =>
    canAnyOf(SCREEN_PERMISSIONS[key]) ? {} : { tabBarItemStyle: { display: 'none' as const } };

  return (
    <SafeAreaView edges={['bottom']} className="flex-1 bg-white">
      <MaterialTopTabs
        tabBarPosition="bottom"
        initialRouteName="products"
        screenOptions={{
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.textSecondary,
          tabBarStyle: {
            backgroundColor: '#FFFFFF',
            borderTopWidth: 0,
            elevation: 0,
            shadowOpacity: 0.05,
            shadowOffset: { width: 0, height: -2 },
            shadowRadius: 8,
            height: 64,
            paddingBottom: 8,
            paddingTop: 4,
          },
          tabBarIndicatorStyle: {
            backgroundColor: colors.primary,
            height: 3,
            borderRadius: 2,
            position: 'absolute',
            top: 0,
          },
          tabBarPressColor: 'transparent',
          tabBarShowIcon: true,
          tabBarShowLabel: true,
          tabBarLabelStyle: {
            fontSize: 10,
            fontWeight: '600',
            textTransform: 'capitalize',
            marginTop: -2,
          },
          swipeEnabled: true,
          animationEnabled: true,
        }}
      >
        <MaterialTopTabs.Screen
          name="products"
          options={{
            ...hidden('products'),
            title: t('tabProducts'),
            tabBarIcon: ({ color }: { color: string }) => (
              <ShoppingBag size={22} color={color} strokeWidth={1.8} />
            ),
          }}
        />

        <MaterialTopTabs.Screen
          name="carts"
          options={{
            ...hidden('cart'),
            title: t('tabCart'),
            tabBarIcon: ({ color }: { color: string }) => (
              <View>
                <ShoppingCart size={22} color={color} strokeWidth={1.8} />
                {itemCount > 0 && (
                  <View className="absolute -top-1.5 -right-2 bg-primary w-[18px] h-[18px] rounded-full items-center justify-center border-2 border-white">
                    <Text className="text-white text-[10px] font-bold">
                      {itemCount > 9 ? '9+' : itemCount}
                    </Text>
                  </View>
                )}
              </View>
            ),
          }}
        />
        <MaterialTopTabs.Screen
          name="orders"
          options={{
            ...hidden('orders'),
            title: t('tabOrders'),
            tabBarIcon: ({ color }: { color: string }) => (
              <Package size={22} color={color} strokeWidth={1.8} />
            ),
          }}
        />
        <MaterialTopTabs.Screen
          name="ledger"
          options={{
            ...hidden('ledger'),
            title: 'Ledger',
            tabBarIcon: ({ color }: { color: string }) => (
              <BookOpen size={22} color={color} strokeWidth={1.8} />
            ),
          }}
        />
      </MaterialTopTabs>
    </SafeAreaView>
  );
}

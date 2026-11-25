import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import * as ScreenCapture from 'expo-screen-capture';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';
import Toast from 'react-native-toast-message';
import '../global.css';

import { CartProvider } from '@/context/CartContext';
import { LanguageProvider } from '@/context/LanguageContext';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { queryClient } from '@/src/config/reactQuery';
import { StoreProvider } from '@/src/context/StoreContext';
import { UserProvider } from '@/src/context/UserContext';
import { KeyboardProvider } from 'react-native-keyboard-controller';

import { LogBox } from 'react-native';

// Suppress warnings from third-party libraries
LogBox.ignoreLogs([
  'SafeAreaView has been deprecated',
  '[Reanimated] Property "transform"',
]);

export default function RootLayout() {
  const colorScheme = useColorScheme();

  useEffect(() => {
    // Prevent screen capture (screenshots and recording)
    // On Android: Prevents screenshots and shows black screen during recording
    // On iOS: Shows black screen during recording (screenshots may still be possible but hidden content is the goal)
    ScreenCapture.preventScreenCaptureAsync();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <UserProvider>
        <StoreProvider>
        <KeyboardProvider>
          <LanguageProvider>
            <CartProvider>
              <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
                <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
                  <Stack.Screen name="login" />
                  <Stack.Screen name="otp" />
                  <Stack.Screen name="(drawer)" />
                  <Stack.Screen name="categories" options={{ headerTitle: 'Categories', headerShown: true }} />
                  <Stack.Screen name="product/[id]" options={{ presentation: 'card' }} />
                  <Stack.Screen name="order/[id]" options={{ presentation: 'card' }} />
                  <Stack.Screen name="checkout" options={{ presentation: 'card' }} />
                  <Stack.Screen name="contact-us" options={{ presentation: 'card' }} />
                  <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
                </Stack>
                <StatusBar style="auto" />
                <Toast />
              </ThemeProvider>
            </CartProvider>
          </LanguageProvider>
        </KeyboardProvider>
        </StoreProvider>
      </UserProvider>
    </QueryClientProvider>
  );
}

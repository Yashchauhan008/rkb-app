import { router } from 'expo-router';
import {
    ArrowRight,
    CheckCircle,
    Eye,
    EyeOff,
    Lock,
    Phone,
    Sparkles,
} from 'lucide-react-native';
import { useEffect, useState } from 'react';
import {
    Dimensions,
    Keyboard,
    Platform,
    Pressable,
    Text,
    TextInput,
    View,
} from 'react-native';
import {
    KeyboardAvoidingView,
} from 'react-native-keyboard-controller';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Colors, Shadows } from '@/constants/theme';
import { useLanguage } from '@/context/LanguageContext';
import { setPendingLogin } from '@/src/context/pendingLogin';
import { useUser } from '@/src/context/UserContext';
import { useLogin } from '@/src/hooks/useAuth';
import Toast from 'react-native-toast-message';

const { width, height } = Dimensions.get('window');
const colors = Colors.light;

export default function LoginScreen() {
    const { t } = useLanguage();

    const [phoneNumber, setPhoneNumber] = useState('');
    const [countryCode] = useState('+91');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const [isPasswordFocused, setIsPasswordFocused] = useState(false);
    const { login: saveSession } = useUser();
    const [isKeyboardVisible, setKeyboardVisible] = useState(false);

    // Keyboard visibility tracking (without animations)
    useEffect(() => {
        const showSubscription = Keyboard.addListener('keyboardWillShow', () => {
            setKeyboardVisible(true);
        });
        const hideSubscription = Keyboard.addListener('keyboardWillHide', () => {
            setKeyboardVisible(false);
        });

        // Android fallback
        const showAndroid = Keyboard.addListener('keyboardDidShow', () => {
            setKeyboardVisible(true);
        });
        const hideAndroid = Keyboard.addListener('keyboardDidHide', () => {
            setKeyboardVisible(false);
        });

        return () => {
            showSubscription.remove();
            hideSubscription.remove();
            showAndroid.remove();
            hideAndroid.remove();
        };
    }, []);

    const isValid = phoneNumber.length === 10 && password.length >= 5;

    const { mutate: login, isPending } = useLogin();

    const handleSendOTP = () => {
        if (!isValid || isPending) return;

        // The backend validates a bare 10-digit phone number (no country code).
        login(
            { phone_number: phoneNumber, password },
            {
                onSuccess: async (data) => {
                    // Staff / retailer / manufacturer accounts skip OTP: session is returned directly.
                    if (data.token_type === 'access' && data.user) {
                        await saveSession(data.user, data.token);
                        router.replace('/(drawer)/(tabs)/products' as any);
                        return;
                    }
                    setPendingLogin({ phone_number: phoneNumber, password, token: data.token });
                    router.push({
                        pathname: '/otp',
                        params: { phone: `${countryCode}${phoneNumber}` },
                    });
                },
                onError: (error: any) => {
                    const message =
                        error?.code === 'unauthorized' || error?.message
                            ? error.message
                            : 'Unable to reach the server. Check your connection.';
                    Toast.show({
                        type: 'error',
                        text1: error?.details?.process_code === 'user_already_logged_in'
                            ? 'Too many active sessions. Log out from another device and retry.'
                            : message,
                    });
                },
            },
        );
    };

    return (
        <SafeAreaView className="flex-1 bg-white">
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <Pressable
                    style={{ flex: 1 }}
                    onPress={Keyboard.dismiss}
                >
                    <View
                        style={{
                            flex: 1,
                            justifyContent: isKeyboardVisible ? 'flex-start' : 'center',
                            paddingHorizontal: 24,
                            paddingTop: isKeyboardVisible ? 20 : 0,
                        }}
                    >
                        {/* Logo & Header */}
                        <View style={{ alignItems: 'center' }}>
                            <View style={{
                                alignItems: 'center',
                                transform: [{ scale: isKeyboardVisible ? 0.7 : 1 }],
                                marginBottom: isKeyboardVisible ? 16 : 40,
                            }}>
                                {/* Premium Logo */}
                                <View
                                    style={[Shadows.glow, { backgroundColor: colors.primary }]}
                                    className="w-20 h-20 rounded-[24px] items-center justify-center mb-5"
                                >
                                    <Sparkles size={40} color="#FFFFFF" strokeWidth={1.5} />
                                </View>

                                <Text className="text-3xl font-bold text-neutral-900 text-center">
                                    {t('welcomeBack')}
                                </Text>

                                <Text className="mt-2 text-base text-center text-neutral-500 leading-6 px-4">
                                    Sign in with your phone number and password
                                </Text>
                            </View>
                        </View>

                        {/* Phone Input Section */}
                        <View className="mt-8">
                            <View>
                                <Text className="text-sm font-semibold mb-3 ml-1 text-neutral-700">
                                    Phone Number
                                </Text>

                                <View
                                    style={[
                                        Shadows.sm,
                                        {
                                            borderWidth: isFocused ? 2 : 1,
                                            borderColor: isFocused ? colors.primary : '#E5E7EB',
                                            backgroundColor: '#FFFFFF',
                                        },
                                    ]}
                                    className="flex-row items-center rounded-2xl h-[60px] overflow-hidden"
                                >
                                    {/* Country Code */}
                                    <View className="px-4 h-full justify-center border-r border-neutral-200 bg-neutral-50">
                                        <Text className="text-lg font-bold text-neutral-900">
                                            {countryCode}
                                        </Text>
                                    </View>

                                    {/* Phone Icon */}
                                    <View className="pl-4">
                                        <Phone
                                            size={20}
                                            color={isFocused ? colors.primary : '#9CA3AF'}
                                            strokeWidth={2}
                                        />
                                    </View>

                                    {/* Input */}
                                    <TextInput
                                        value={phoneNumber}
                                        onChangeText={(text) =>
                                            setPhoneNumber(text.replace(/[^0-9]/g, '').slice(0, 10))
                                        }
                                        placeholder="98765 43210"
                                        placeholderTextColor="#9CA3AF"
                                        keyboardType="number-pad"
                                        maxLength={10}
                                        className="flex-1 px-3 h-full text-lg font-medium text-neutral-900"
                                        onFocus={() => setIsFocused(true)}
                                        onBlur={() => setIsFocused(false)}
                                    />

                                    {/* Valid Checkmark */}
                                    {isValid && (
                                        <View className="pr-4">
                                            <View className="w-6 h-6 rounded-full bg-green-500 items-center justify-center">
                                                <CheckCircle size={16} color="#FFFFFF" strokeWidth={2.5} />
                                            </View>
                                        </View>
                                    )}
                                </View>
                            </View>
                        </View>

                        {/* Password Input */}
                        <View className="mt-5">
                            <Text className="text-sm font-semibold mb-3 ml-1 text-neutral-700">
                                Password
                            </Text>
                            <View
                                style={[
                                    Shadows.sm,
                                    {
                                        borderWidth: isPasswordFocused ? 2 : 1,
                                        borderColor: isPasswordFocused ? colors.primary : '#E5E7EB',
                                        backgroundColor: '#FFFFFF',
                                    },
                                ]}
                                className="flex-row items-center rounded-2xl h-[60px] overflow-hidden"
                            >
                                <View className="pl-4">
                                    <Lock
                                        size={20}
                                        color={isPasswordFocused ? colors.primary : '#9CA3AF'}
                                        strokeWidth={2}
                                    />
                                </View>
                                <TextInput
                                    value={password}
                                    onChangeText={setPassword}
                                    placeholder="Enter password"
                                    placeholderTextColor="#9CA3AF"
                                    secureTextEntry={!showPassword}
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    maxLength={30}
                                    returnKeyType="go"
                                    onSubmitEditing={handleSendOTP}
                                    className="flex-1 px-3 h-full text-lg font-medium text-neutral-900"
                                    onFocus={() => setIsPasswordFocused(true)}
                                    onBlur={() => setIsPasswordFocused(false)}
                                />
                                <Pressable onPress={() => setShowPassword((v) => !v)} className="pr-4">
                                    {showPassword ? (
                                        <EyeOff size={20} color="#9CA3AF" strokeWidth={2} />
                                    ) : (
                                        <Eye size={20} color="#9CA3AF" strokeWidth={2} />
                                    )}
                                </Pressable>
                            </View>
                        </View>

                        {/* Continue Button */}
                        <View className="mt-6">
                            <Pressable
                                onPress={handleSendOTP}
                                style={[
                                    Shadows.md,
                                    {
                                        backgroundColor: isValid ? colors.primary : '#E5E7EB',
                                    }
                                ]}
                                className="h-[56px] rounded-2xl flex-row items-center justify-center"
                            >
                                <Text className={`text-base font-semibold mr-2 ${isValid ? 'text-white' : 'text-neutral-400'}`}>
                                    {isPending ? 'Signing in...' : t('continue')}
                                </Text>
                                {isValid && <ArrowRight size={20} color="#FFFFFF" strokeWidth={2} />}
                            </Pressable>
                        </View>

                        {/* Terms */}
                        <View className="mt-8">
                            <Text className="text-center text-xs leading-5 text-neutral-400">
                                By clicking continue, you agree to our{'\n'}
                                <Text className="text-neutral-700 font-medium">
                                    Terms of Service
                                </Text>{' '}
                                and{' '}
                                <Text className="text-neutral-700 font-medium">
                                    Privacy Policy
                                </Text>
                            </Text>
                        </View>
                    </View>
                </Pressable>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

import * as Haptics from 'expo-haptics';
import { router, useLocalSearchParams } from 'expo-router';
import {
    ArrowLeft,
    CheckCircle,
    RotateCcw,
    Smartphone,
} from 'lucide-react-native';
import { useEffect, useRef, useState } from 'react';
import {
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
import Toast from 'react-native-toast-message';

import { Colors, Shadows } from '@/constants/theme';
import { useLanguage } from '@/context/LanguageContext';
import { clearPendingLogin, getPendingLogin, updatePendingToken } from '@/src/context/pendingLogin';
import { useUser } from '@/src/context/UserContext';
import { useOTPVerification, useResendOTP } from '@/src/hooks/useAuth';

const OTP_LENGTH = 6;
const colors = Colors.light;

export default function OTPScreen() {
    const { t } = useLanguage();
    const { login } = useUser();
    const { mutate: verifyOTP, isPending: isVerifyingOTP } = useOTPVerification();
    const { mutate: resendOTP } = useResendOTP();

    const { phone } = useLocalSearchParams<{ phone: string }>();
    const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(''));
    const [timer, setTimer] = useState(30);
    const [focusedIndex, setFocusedIndex] = useState<number | null>(0);
    const [isKeyboardVisible, setKeyboardVisible] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const inputRefs = useRef<(TextInput | null)[]>([]);

    // Keyboard visibility tracking
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

    useEffect(() => {
        const interval = setInterval(() => {
            setTimer((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const handleOtpChange = (value: string, index: number) => {
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        if (value && index < OTP_LENGTH - 1) {
            inputRefs.current[index + 1]?.focus();
            setFocusedIndex(index + 1);
        }
    };

    const handleKeyPress = (e: any, index: number) => {
        if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
            setFocusedIndex(index - 1);
        }
    };

    const triggerShake = () => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    };

    const triggerSuccess = () => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        setShowSuccess(true);
    };

    const handleVerify = () => {
        const otpString = otp.join('');
        if (otpString.length !== OTP_LENGTH || isVerifyingOTP) return;

        const pending = getPendingLogin();
        if (!pending) {
            Toast.show({ type: 'error', text1: 'Session expired. Please sign in again.' });
            router.replace('/login');
            return;
        }

        verifyOTP({ code: otpString, token: pending.token }, {
            onSuccess: async (data) => {
                triggerSuccess();
                await login(data.user, data.token);
                clearPendingLogin();
                setTimeout(() => {
                    router.replace('/(drawer)/(tabs)/products' as any);
                }, 500);
            },
            onError: (error: any) => {
                triggerShake();
                Toast.show({ type: 'error', text1: error?.message || 'Invalid code' });
                setOtp(Array(OTP_LENGTH).fill(''));
                inputRefs.current[0]?.focus();
                setFocusedIndex(0);
            }
        });
    };

    const handleResend = () => {
        const pending = getPendingLogin();
        if (!pending) {
            router.replace('/login');
            return;
        }
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        resendOTP({ phone_number: pending.phone_number, password: pending.password }, {
            onSuccess: (data) => {
                updatePendingToken(data.token); // each login issues a fresh verification token
                setTimer(30);
                setOtp(Array(OTP_LENGTH).fill(''));
                inputRefs.current[0]?.focus();
                setFocusedIndex(0);
            },
            onError: (error: any) => {
                Toast.show({ type: 'error', text1: error?.message || 'Could not resend code' });
            }
        });
    };

    const isComplete = otp.every(digit => digit !== '');

    return (
        <SafeAreaView className="flex-1 bg-white">
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <Pressable style={{ flex: 1 }} onPress={Keyboard.dismiss}>
                    {/* Back Button */}
                    <View className="px-5 pt-2">
                        <Pressable
                            onPress={() => router.back()}
                            style={Shadows.sm}
                            className="w-11 h-11 rounded-xl items-center justify-center bg-white border border-neutral-100"
                        >
                            <ArrowLeft size={20} color="#525252" strokeWidth={1.5} />
                        </Pressable>
                    </View>

                    <View
                        style={{
                            flex: 1,
                            justifyContent: isKeyboardVisible ? 'flex-start' : 'center',
                            paddingHorizontal: 24,
                            paddingTop: isKeyboardVisible ? 20 : 0,
                        }}
                    >
                        {/* Header */}
                        <View style={{
                            alignItems: 'center',
                            transform: [{ scale: isKeyboardVisible ? 0.85 : 1 }],
                            marginBottom: isKeyboardVisible ? 16 : 32,
                        }}>
                            <View
                                style={{ backgroundColor: `${colors.primary}12` }}
                                className="w-16 h-16 rounded-[20px] items-center justify-center mb-4"
                            >
                                <Smartphone size={32} color={colors.primary} strokeWidth={1.5} />
                            </View>

                            <Text className="text-2xl font-bold text-neutral-900">
                                {t('verifyOtp')}
                            </Text>
                            <Text className="mt-2 text-center leading-5 text-neutral-500">
                                {t('sentCodeTo')}{'\n'}
                                <Text className="font-bold text-neutral-900">
                                    {phone || '+91 XXXXXXXXXX'}
                                </Text>
                            </Text>
                        </View>

                        {/* OTP Input */}
                        <View className="mb-6">
                            <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 10 }}>
                                {otp.map((digit, index) => {
                                    const isFocused = focusedIndex === index;
                                    const isFilled = digit !== '';

                                    return (
                                        <View key={index}>
                                            <TextInput
                                                ref={(ref) => { inputRefs.current[index] = ref; }}
                                                value={digit}
                                                onChangeText={(value) => handleOtpChange(value.replace(/[^0-9]/g, '').slice(-1), index)}
                                                onKeyPress={(e) => handleKeyPress(e, index)}
                                                onFocus={() => setFocusedIndex(index)}
                                                onBlur={() => setFocusedIndex(null)}
                                                keyboardType="number-pad"
                                                maxLength={1}
                                                selectTextOnFocus
                                                style={[
                                                    {
                                                        width: 48,
                                                        height: 56,
                                                        borderWidth: isFocused ? 2 : 1.5,
                                                        borderColor: isFocused
                                                            ? colors.primary
                                                            : isFilled
                                                                ? colors.primary
                                                                : '#E5E7EB',
                                                        backgroundColor: isFilled
                                                            ? `${colors.primary}08`
                                                            : '#FAFAFA',
                                                        borderRadius: 14,
                                                        textAlign: 'center',
                                                        fontSize: 24,
                                                        fontWeight: '700',
                                                        color: '#171717',
                                                    },
                                                    isFocused && Shadows.sm,
                                                ]}
                                                autoFocus={index === 0}
                                            />
                                        </View>
                                    );
                                })}
                            </View>
                        </View>

                        {/* Timer & Resend */}
                        <View className="items-center mb-6">
                            {timer > 0 ? (
                                <View className="flex-row items-center bg-neutral-100 px-5 py-2.5 rounded-full">
                                    <Text className="text-sm text-neutral-500">
                                        {t('resendIn')}{' '}
                                        <Text className="font-bold text-primary">{timer}s</Text>
                                    </Text>
                                </View>
                            ) : (
                                <Pressable
                                    onPress={handleResend}
                                    className="flex-row items-center px-5 py-2.5"
                                >
                                    <RotateCcw size={16} color={colors.primary} strokeWidth={2} />
                                    <Text className="text-primary font-bold text-base ml-2">
                                        {t('resend')}
                                    </Text>
                                </Pressable>
                            )}
                        </View>

                        {/* Verify Button */}
                        <View>
                            <Pressable
                                onPress={handleVerify}
                                disabled={!isComplete || isVerifyingOTP}
                                style={[
                                    Shadows.md,
                                    {
                                        backgroundColor: isComplete ? colors.primary : '#E5E7EB',
                                        opacity: isVerifyingOTP ? 0.7 : 1,
                                    }
                                ]}
                                className="h-[56px] rounded-2xl flex-row items-center justify-center"
                            >
                                {isVerifyingOTP ? (
                                    <Text className="text-white text-base font-semibold">
                                        {t('verifying')}...
                                    </Text>
                                ) : (
                                    <>
                                        <Text className={`text-base font-semibold mr-2 ${isComplete ? 'text-white' : 'text-neutral-400'}`}>
                                            {t('verifyAndContinue')}
                                        </Text>
                                        {isComplete && <CheckCircle size={20} color="#FFFFFF" strokeWidth={2} />}
                                    </>
                                )}
                            </Pressable>
                        </View>

                        {/* Demo Hint */}
                        <View className="mt-6">
                            <View
                                style={{ backgroundColor: '#FEF3C7' }}
                                className="rounded-xl p-3.5 border border-dashed border-amber-300"
                            >
                                <Text className="text-center text-xs font-medium text-amber-700">
                                    Demo: Use code <Text className="font-bold">123456</Text>
                                </Text>
                            </View>
                        </View>
                    </View>

                    {/* Success Animation Overlay */}
                    {showSuccess && (
                        <View
                            style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                alignItems: 'center',
                                justifyContent: 'center',
                                zIndex: 50,
                            }}
                            pointerEvents="none"
                        >
                            <View
                                style={[Shadows.lg, { backgroundColor: '#22C55E' }]}
                                className="w-24 h-24 rounded-full items-center justify-center"
                            >
                                <CheckCircle size={48} color="#FFFFFF" strokeWidth={2} />
                            </View>
                        </View>
                    )}
                </Pressable>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

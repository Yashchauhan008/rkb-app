/**
 * Contact Us Screen
 * 
 * Display company contact information with:
 * - Phone number (tap to call)
 * - Email (tap to email)
 * - Address (tap to open maps)
 * - Social media links
 * - Business hours
 */

import * as Linking from 'expo-linking';
import { router } from 'expo-router';
import {
    ArrowLeft,
    Clock,
    Facebook,
    Instagram,
    Mail,
    MapPin,
    Phone,
    Twitter,
} from 'lucide-react-native';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Colors, Shadows } from '@/constants/theme';
import { useLanguage } from '@/context/LanguageContext';
import { useColorScheme } from '@/hooks/use-color-scheme';

// Company Information
const COMPANY_INFO = {
    name: 'RKApp Store',
    phone: '+91 98765 43210',
    email: 'support@rkapp.com',
    address: '123 Business Park, Tech Valley, Mumbai, Maharashtra 400001',
    website: 'https://rkapp.com',
    hours: [
        { day: 'Monday - Friday', time: '9:00 AM - 6:00 PM' },
        { day: 'Saturday', time: '10:00 AM - 4:00 PM' },
        { day: 'Sunday', time: 'Closed' },
    ],
    socials: {
        facebook: 'https://facebook.com/rkapp',
        instagram: 'https://instagram.com/rkapp',
        twitter: 'https://twitter.com/rkapp',
    },
};

interface ContactCardProps {
    Icon: React.ElementType;
    title: string;
    value: string;
    onPress: () => void;
    index: number;
    isDark: boolean;
    colors: typeof Colors.light;
}

function ContactCard({ Icon, title, value, onPress, index, isDark, colors }: ContactCardProps) {
    return (
        <View>
            <Pressable
                style={Shadows.sm}
                onPress={onPress}
                className={`rounded-2xl p-4 mb-3 flex-row items-center ${isDark ? 'bg-neutral-900' : 'bg-white'}`}
            >
                <View className={`w-12 h-12 rounded-xl items-center justify-center mr-4 ${isDark ? 'bg-neutral-800' : 'bg-primary/10'}`}>
                    <Icon size={22} color={colors.primary} strokeWidth={1.5} />
                </View>
                <View className="flex-1">
                    <Text className={`text-xs font-medium uppercase tracking-wider mb-1 ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`}>
                        {title}
                    </Text>
                    <Text className={`text-base font-semibold ${isDark ? 'text-white' : 'text-neutral-900'}`}>
                        {value}
                    </Text>
                </View>
            </Pressable>
        </View>
    );
}

interface SocialButtonProps {
    Icon: React.ElementType;
    url: string;
    index: number;
    isDark: boolean;
    colors: typeof Colors.light;
}

function SocialButton({ Icon, url, index, isDark, colors }: SocialButtonProps) {
    return (
        <View>
            <Pressable
                style={Shadows.sm}
                onPress={() => Linking.openURL(url)}
                className={`w-14 h-14 rounded-2xl items-center justify-center ${isDark ? 'bg-neutral-900' : 'bg-white'}`}
            >
                <Icon size={24} color={colors.primary} strokeWidth={1.5} />
            </Pressable>
        </View>
    );
}

export default function ContactUsScreen() {
    const { t } = useLanguage();
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';
    const colors = Colors[isDark ? 'dark' : 'light'];

    const handleCall = () => {
        Linking.openURL(`tel:${COMPANY_INFO.phone.replace(/\s/g, '')}`);
    };

    const handleEmail = () => {
        Linking.openURL(`mailto:${COMPANY_INFO.email}`);
    };

    const handleMap = () => {
        const address = encodeURIComponent(COMPANY_INFO.address);
        Linking.openURL(`https://maps.google.com/?q=${address}`);
    };

    return (
        <SafeAreaView className={`flex-1 ${isDark ? 'bg-black' : 'bg-neutral-50'}`}>
            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
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
                        <Text className={`text-sm font-medium ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>
                            Get in touch
                        </Text>
                        <Text className={`text-2xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-neutral-900'}`}>
                            Contact Us
                        </Text>
                    </View>
                </View>

                {/* Company Logo / Name */}
                <View className="items-center py-6">
                    <View
                        style={Shadows.glow}
                        className="w-20 h-20 bg-primary rounded-3xl items-center justify-center mb-4"
                    >
                        <Text className="text-3xl font-bold text-white">R</Text>
                    </View>
                    <Text className={`text-xl font-bold ${isDark ? 'text-white' : 'text-neutral-900'}`}>
                        {COMPANY_INFO.name}
                    </Text>
                </View>

                {/* Contact Cards */}
                <View className="px-5">
                    <ContactCard
                        Icon={Phone}
                        title="Phone"
                        value={COMPANY_INFO.phone}
                        onPress={handleCall}
                        index={0}
                        isDark={isDark}
                        colors={colors}
                    />
                    <ContactCard
                        Icon={Mail}
                        title="Email"
                        value={COMPANY_INFO.email}
                        onPress={handleEmail}
                        index={1}
                        isDark={isDark}
                        colors={colors}
                    />
                    <ContactCard
                        Icon={MapPin}
                        title="Address"
                        value={COMPANY_INFO.address}
                        onPress={handleMap}
                        index={2}
                        isDark={isDark}
                        colors={colors}
                    />
                </View>

                {/* Business Hours */}
                <View className="px-5 mt-4">
                    <View
                        style={Shadows.sm}
                        className={`rounded-2xl p-5 ${isDark ? 'bg-neutral-900' : 'bg-white'}`}
                    >
                        <View className="flex-row items-center mb-4">
                            <Clock size={20} color={colors.primary} strokeWidth={1.5} />
                            <Text className={`text-lg font-semibold ml-3 ${isDark ? 'text-white' : 'text-neutral-900'}`}>
                                Business Hours
                            </Text>
                        </View>
                        {COMPANY_INFO.hours.map((hour, index) => (
                            <View key={hour.day} className={`flex-row justify-between py-2 ${index < COMPANY_INFO.hours.length - 1 ? `border-b ${isDark ? 'border-neutral-800' : 'border-neutral-100'}` : ''}`}>
                                <Text className={isDark ? 'text-neutral-300' : 'text-neutral-600'}>
                                    {hour.day}
                                </Text>
                                <Text className={`font-medium ${hour.time === 'Closed' ? 'text-error' : isDark ? 'text-white' : 'text-neutral-900'}`}>
                                    {hour.time}
                                </Text>
                            </View>
                        ))}
                    </View>
                </View>

                {/* Social Media */}
                <View className="px-5 mt-6 mb-8">
                    <Text className={`text-sm font-semibold uppercase tracking-wider mb-4 text-center ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`}>
                        Follow Us
                    </Text>
                    <View className="flex-row justify-center gap-4">
                        <SocialButton
                            Icon={Facebook}
                            url={COMPANY_INFO.socials.facebook}
                            index={0}
                            isDark={isDark}
                            colors={colors}
                        />
                        <SocialButton
                            Icon={Instagram}
                            url={COMPANY_INFO.socials.instagram}
                            index={1}
                            isDark={isDark}
                            colors={colors}
                        />
                        <SocialButton
                            Icon={Twitter}
                            url={COMPANY_INFO.socials.twitter}
                            index={2}
                            isDark={isDark}
                            colors={colors}
                        />
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

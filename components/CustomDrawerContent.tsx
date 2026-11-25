import { DrawerContentScrollView } from '@react-navigation/drawer';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import {
    Bell,
    Check,
    ChevronRight,
    CreditCard,
    Edit3,
    Globe,
    HelpCircle,
    LogOut,
    MapPin,
    MessageCircle,
    Shield,
    Smartphone,
    User,
    X
} from 'lucide-react-native';
import React, { useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Switch, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Colors, Shadows } from '@/constants/theme';
import { Language, useLanguage } from '@/context/LanguageContext';
import { useUser } from '@/src/context/UserContext';

const colors = Colors.light;

const languages: { id: Language; name: string; native: string; flag: string }[] = [
    { id: 'en', name: 'English', native: 'English', flag: '🇬🇧' },
    { id: 'hi', name: 'Hindi', native: 'हिंदी', flag: '🇮🇳' },
    { id: 'gu', name: 'Gujarati', native: 'ગુજરાતી', flag: '🇮🇳' },
];

// Menu Item Component
interface MenuItemProps {
    icon: React.ElementType;
    label: string;
    subtitle?: string;
    onPress?: () => void;
    index: number;
    iconColor?: string;
    showChevron?: boolean;
    danger?: boolean;
    hasSwitch?: boolean;
    switchValue?: boolean;
    onSwitchChange?: (value: boolean) => void;
}

function MenuItem({
    icon: Icon,
    label,
    subtitle,
    onPress,
    index,
    iconColor,
    showChevron = true,
    danger = false,
    hasSwitch,
    switchValue,
    onSwitchChange
}: MenuItemProps) {
    const handleSwitchChange = (value: boolean) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onSwitchChange?.(value);
    };

    return (
        <View>
            <Pressable
                style={styles.menuItem}
                onPress={onPress}
                disabled={hasSwitch}
            >
                <View style={[
                    styles.menuIconContainer,
                    danger && { backgroundColor: '#FEE2E2' }
                ]}>
                    <Icon
                        size={18}
                        color={danger ? '#EF4444' : (iconColor || colors.primary)}
                        strokeWidth={1.8}
                    />
                </View>
                <View style={styles.menuTextContainer}>
                    <Text style={[
                        styles.menuLabel,
                        danger && { color: '#EF4444' }
                    ]}>
                        {label}
                    </Text>
                    {subtitle && (
                        <Text style={styles.menuSubtitle}>{subtitle}</Text>
                    )}
                </View>
                {hasSwitch ? (
                    <Switch
                        value={switchValue}
                        onValueChange={handleSwitchChange}
                        trackColor={{ false: '#E5E7EB', true: colors.primary }}
                        thumbColor="#FFFFFF"
                        ios_backgroundColor="#E5E7EB"
                    />
                ) : showChevron ? (
                    <ChevronRight size={18} color={colors.textTertiary} strokeWidth={1.5} />
                ) : null}
            </Pressable>
        </View>
    );
}

// Section Header
function SectionHeader({ title, index }: { title: string; index: number }) {
    return (
        <View>
            <Text style={styles.sectionTitle}>{title}</Text>
        </View>
    );
}

export default function CustomDrawerContent(props: any) {
    const router = useRouter();
    const { language, setLanguage, t } = useLanguage();
    const { top, bottom } = useSafeAreaInsets();

    // User state (from the authenticated RKB session)
    const { user: authUser, logout } = useUser();
    const displayName = authUser?.name || 'User';
    const displayRole = authUser?.is_root_user
        ? 'Admin'
        : (authUser?.category || '').replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()) || 'Member';
    const [user, setUser] = useState({
        name: displayName,
        email: authUser?.assigned_retailer_name || authUser?.assigned_unit_name || '',
        phone: '',
        role: displayRole,
        initials: displayName.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2) || 'U',
    });

    // Modal states
    const [showProfileModal, setShowProfileModal] = useState(false);
    const [showLanguageModal, setShowLanguageModal] = useState(false);

    // Settings states
    const [notifications, setNotifications] = useState(true);
    const [faceId, setFaceId] = useState(true);

    // Profile edit state
    const [editName, setEditName] = useState(user.name);
    const [editEmail, setEditEmail] = useState(user.email);
    const [editPhone, setEditPhone] = useState(user.phone);

    const currentLanguageObj = languages.find(l => l.id === language);

    const handleLogout = async () => {
        await logout();
        router.replace('/login');
    };

    const handleSaveProfile = () => {
        setUser({
            ...user,
            name: editName,
            email: editEmail,
            phone: editPhone,
            initials: editName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
        });
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        setShowProfileModal(false);
    };

    return (
        <View style={styles.container}>
            <DrawerContentScrollView
                {...props}
                contentContainerStyle={[styles.scrollContent, { paddingTop: 0 }]}
                scrollEnabled={true}
                showsVerticalScrollIndicator={false}
            >
                {/* Premium User Header */}
                <View style={[styles.header, { paddingTop: top + 20 }]}>
                    <View style={styles.userCard}>
                        {/* Avatar */}
                        <View style={styles.avatarContainer}>
                            <View style={styles.avatarInner}>
                                <Text style={styles.avatarText}>{user.initials}</Text>
                            </View>
                        </View>

                        {/* User Info */}
                        <View style={styles.userInfo}>
                            <Text style={styles.userName} numberOfLines={1}>
                                {user.name}
                            </Text>
                            <Text style={styles.userEmail} numberOfLines={1}>
                                {user.email}
                            </Text>
                            <View style={styles.roleContainer}>
                                <View style={styles.roleBadge}>
                                    <Text style={styles.roleText}>{user.role}</Text>
                                </View>
                            </View>
                        </View>

                        {/* Edit Profile Button */}
                        <Pressable
                            style={styles.editButton}
                            onPress={() => {
                                setEditName(user.name);
                                setEditEmail(user.email);
                                setEditPhone(user.phone);
                                setShowProfileModal(true);
                            }}
                        >
                            <Edit3 size={18} color={colors.primary} strokeWidth={1.5} />
                        </Pressable>
                    </View>
                </View>

                {/* Menu Sections */}
                <View style={styles.menuContainer}>
                    {/* Account Section */}
                    <SectionHeader title="Account" index={1} />
                    <MenuItem
                        icon={User}
                        label="Edit Profile"
                        subtitle="Update your information"
                        onPress={() => {
                            setEditName(user.name);
                            setEditEmail(user.email);
                            setEditPhone(user.phone);
                            setShowProfileModal(true);
                        }}
                        index={2}
                    />
                    <MenuItem
                        icon={MapPin}
                        label="Addresses"
                        subtitle="Manage delivery addresses"
                        onPress={() => { }}
                        index={3}
                    />
                    <MenuItem
                        icon={CreditCard}
                        label="Payment Methods"
                        subtitle="Cards, UPI, Wallets"
                        onPress={() => { }}
                        index={4}
                    />

                    {/* Preferences Section */}
                    <View style={styles.sectionDivider} />
                    <SectionHeader title="Preferences" index={5} />
                    <MenuItem
                        icon={Globe}
                        label="Language"
                        subtitle={`${currentLanguageObj?.native} (${currentLanguageObj?.name})`}
                        onPress={() => setShowLanguageModal(true)}
                        index={6}
                    />
                    <MenuItem
                        icon={Bell}
                        label="Push Notifications"
                        hasSwitch
                        switchValue={notifications}
                        onSwitchChange={setNotifications}
                        showChevron={false}
                        index={7}
                    />
                    <MenuItem
                        icon={Smartphone}
                        label="Face ID / Touch ID"
                        hasSwitch
                        switchValue={faceId}
                        onSwitchChange={setFaceId}
                        showChevron={false}
                        index={8}
                    />

                    {/* Support Section */}
                    <View style={styles.sectionDivider} />
                    <SectionHeader title="Support" index={9} />
                    <MenuItem
                        icon={HelpCircle}
                        label="Help Center"
                        subtitle="FAQ & articles"
                        onPress={() => { }}
                        index={10}
                    />
                    <MenuItem
                        icon={MessageCircle}
                        label="Contact Us"
                        subtitle="Chat, email, call"
                        onPress={() => router.push('/contact-us')}
                        index={11}
                    />
                    <MenuItem
                        icon={Shield}
                        label="Terms & Privacy"
                        onPress={() => { }}
                        index={12}
                    />
                </View>
            </DrawerContentScrollView>

            {/* Footer with Logout */}
            <View style={[styles.footer, { paddingBottom: bottom + 8 }]}>
                <View style={styles.footerDivider} />
                <MenuItem
                    icon={LogOut}
                    label="Sign Out"
                    onPress={handleLogout}
                    index={13}
                    danger
                    showChevron={false}
                />
                <Text style={styles.versionText}>Version 1.0.0</Text>
            </View>

            {/* Edit Profile Modal */}
            <Modal
                visible={showProfileModal}
                animationType="fade"
                transparent={true}
                onRequestClose={() => setShowProfileModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Edit Profile</Text>
                            <Pressable onPress={() => setShowProfileModal(false)}>
                                <X size={24} color={colors.textSecondary} />
                            </Pressable>
                        </View>

                        <ScrollView showsVerticalScrollIndicator={false}>
                            {/* Name Input */}
                            <View style={styles.inputGroup}>
                                <Text style={styles.inputLabel}>Full Name</Text>
                                <TextInput
                                    value={editName}
                                    onChangeText={setEditName}
                                    placeholder="Enter your name"
                                    placeholderTextColor="#A3A3A3"
                                    style={styles.textInput}
                                />
                            </View>

                            {/* Email Input */}
                            <View style={styles.inputGroup}>
                                <Text style={styles.inputLabel}>Email Address</Text>
                                <TextInput
                                    value={editEmail}
                                    onChangeText={setEditEmail}
                                    placeholder="Enter your email"
                                    placeholderTextColor="#A3A3A3"
                                    keyboardType="email-address"
                                    style={styles.textInput}
                                />
                            </View>

                            {/* Phone Input */}
                            <View style={styles.inputGroup}>
                                <Text style={styles.inputLabel}>Phone Number</Text>
                                <TextInput
                                    value={editPhone}
                                    onChangeText={setEditPhone}
                                    placeholder="Enter your phone"
                                    placeholderTextColor="#A3A3A3"
                                    keyboardType="phone-pad"
                                    style={styles.textInput}
                                />
                            </View>
                        </ScrollView>

                        {/* Action Buttons */}
                        <View style={styles.modalButtons}>
                            <Pressable
                                style={styles.cancelButton}
                                onPress={() => setShowProfileModal(false)}
                            >
                                <Text style={styles.cancelButtonText}>Cancel</Text>
                            </Pressable>
                            <Pressable
                                style={styles.saveButton}
                                onPress={handleSaveProfile}
                            >
                                <Text style={styles.saveButtonText}>Save Changes</Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Language Selection Modal */}
            <Modal
                visible={showLanguageModal}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setShowLanguageModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <Pressable
                        style={styles.modalBackdrop}
                        onPress={() => setShowLanguageModal(false)}
                    />
                    <View style={styles.languageModalContent}>
                        <View style={styles.modalHandle} />

                        <Text style={styles.languageModalTitle}>Select Language</Text>
                        <Text style={styles.languageModalSubtitle}>Choose your preferred language</Text>

                        {languages.map((lang) => (
                            <Pressable
                                key={lang.id}
                                onPress={() => {
                                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                    setLanguage(lang.id);
                                    setShowLanguageModal(false);
                                }}
                                style={[
                                    styles.languageOption,
                                    language === lang.id && styles.languageOptionSelected
                                ]}
                            >
                                <Text style={styles.languageFlag}>{lang.flag}</Text>
                                <View style={styles.languageTextContainer}>
                                    <Text style={styles.languageNative}>{lang.native}</Text>
                                    <Text style={styles.languageName}>{lang.name}</Text>
                                </View>
                                {language === lang.id && (
                                    <View style={styles.languageCheck}>
                                        <Check size={14} color="#FFFFFF" strokeWidth={2.5} />
                                    </View>
                                )}
                            </Pressable>
                        ))}
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    scrollContent: {
        flexGrow: 1,
    },
    header: {
        paddingHorizontal: 20,
        paddingBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#F5F5F5',
    },
    userCard: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    avatarContainer: {
        width: 52,
        height: 52,
        borderRadius: 26,
        padding: 2,
        backgroundColor: colors.primary,
        ...Shadows.md,
    },
    avatarInner: {
        flex: 1,
        borderRadius: 24,
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarText: {
        fontSize: 17,
        fontWeight: '700',
        color: colors.primary,
    },
    userInfo: {
        flex: 1,
    },
    userName: {
        fontSize: 16,
        fontWeight: '700',
        color: '#171717',
    },
    userEmail: {
        fontSize: 12,
        color: '#737373',
        marginTop: 1,
    },
    roleContainer: {
        flexDirection: 'row',
        marginTop: 4,
    },
    roleBadge: {
        paddingHorizontal: 8,
        paddingVertical: 2,
        backgroundColor: `${colors.primary}15`,
        borderRadius: 10,
    },
    roleText: {
        fontSize: 11,
        fontWeight: '600',
        color: colors.primary,
    },
    editButton: {
        width: 36,
        height: 36,
        borderRadius: 10,
        backgroundColor: `${colors.primary}10`,
        alignItems: 'center',
        justifyContent: 'center',
    },
    menuContainer: {
        flex: 1,
        paddingHorizontal: 12,
        paddingTop: 16,
    },
    sectionTitle: {
        fontSize: 11,
        fontWeight: '700',
        color: '#A3A3A3',
        textTransform: 'uppercase',
        letterSpacing: 1,
        paddingHorizontal: 12,
        marginBottom: 6,
        marginTop: 4,
    },
    sectionDivider: {
        height: 1,
        backgroundColor: '#F5F5F5',
        marginVertical: 12,
        marginHorizontal: 12,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 12,
        borderRadius: 12,
        marginVertical: 1,
    },
    menuIconContainer: {
        width: 34,
        height: 34,
        borderRadius: 9,
        backgroundColor: `${colors.primary}10`,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    menuTextContainer: {
        flex: 1,
    },
    menuLabel: {
        fontSize: 14,
        fontWeight: '500',
        color: '#262626',
    },
    menuSubtitle: {
        fontSize: 12,
        color: '#A3A3A3',
        marginTop: 1,
    },
    footer: {
        paddingHorizontal: 12,
        paddingTop: 8,
    },
    footerDivider: {
        height: 1,
        backgroundColor: '#F5F5F5',
        marginBottom: 8,
        marginHorizontal: 12,
    },
    versionText: {
        textAlign: 'center',
        fontSize: 11,
        color: '#D4D4D4',
        marginTop: 8,
    },
    // Modal Styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
    },
    modalBackdrop: {
        flex: 1,
    },
    modalContent: {
        marginHorizontal: 24,
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
        padding: 24,
        maxHeight: '80%',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#171717',
    },
    inputGroup: {
        marginBottom: 16,
    },
    inputLabel: {
        fontSize: 13,
        fontWeight: '600',
        color: '#737373',
        marginBottom: 6,
    },
    textInput: {
        backgroundColor: '#F9FAFB',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 12,
        padding: 14,
        fontSize: 15,
        color: '#171717',
    },
    modalButtons: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 8,
    },
    cancelButton: {
        flex: 1,
        backgroundColor: '#F5F5F5',
        borderRadius: 12,
        paddingVertical: 14,
        alignItems: 'center',
    },
    cancelButtonText: {
        fontSize: 15,
        fontWeight: '600',
        color: '#525252',
    },
    saveButton: {
        flex: 1,
        backgroundColor: colors.primary,
        borderRadius: 12,
        paddingVertical: 14,
        alignItems: 'center',
    },
    saveButtonText: {
        fontSize: 15,
        fontWeight: '600',
        color: '#FFFFFF',
    },
    // Language Modal
    languageModalContent: {
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        paddingHorizontal: 24,
        paddingBottom: 40,
    },
    modalHandle: {
        width: 40,
        height: 4,
        backgroundColor: '#E5E5E5',
        borderRadius: 2,
        alignSelf: 'center',
        marginTop: 12,
        marginBottom: 20,
    },
    languageModalTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#171717',
        marginBottom: 4,
    },
    languageModalSubtitle: {
        fontSize: 14,
        color: '#737373',
        marginBottom: 20,
    },
    languageOption: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 16,
        marginBottom: 8,
        backgroundColor: '#F9FAFB',
        borderWidth: 1,
        borderColor: '#F5F5F5',
    },
    languageOptionSelected: {
        backgroundColor: `${colors.primary}08`,
        borderColor: colors.primary,
    },
    languageFlag: {
        fontSize: 24,
        marginRight: 14,
    },
    languageTextContainer: {
        flex: 1,
    },
    languageNative: {
        fontSize: 15,
        fontWeight: '600',
        color: '#171717',
    },
    languageName: {
        fontSize: 13,
        color: '#737373',
        marginTop: 1,
    },
    languageCheck: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
    },
});

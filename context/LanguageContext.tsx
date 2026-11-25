import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';

export type Language = 'en' | 'hi' | 'gu';

type Translations = {
    [key in Language]: {
        [key: string]: string;
    };
};

const translations: Translations = {
    en: {
        // Login
        welcomeBack: 'Welcome Back',
        enterPhone: 'Enter your phone number to continue',
        phoneNumber: 'Phone Number',
        continue: 'Continue',
        terms: 'By continuing, you agree to our Terms of Service and Privacy Policy',

        // OTP
        verifyOtp: 'Verify OTP',
        sentCodeTo: 'We\'ve sent a code to',
        resend: 'Resend OTP',
        resendIn: 'Resend code in',
        verifyAndContinue: 'Verify & Continue',
        verifying: 'Verifying...',

        // Tabs
        tabProducts: 'Products',
        tabCategories: 'Categories',
        tabCart: 'Cart',
        tabOrders: 'Orders',
        tabSettings: 'Settings',

        // Products
        welcomeApp: 'Welcome to RKApp',
        discoverProducts: 'Discover Products',
        searchPlaceholder: 'Search products...',
        productsFound: 'products found',
        sortBy: 'Sort by',
        addToCart: 'Add to Cart',
        totalPrice: 'Total Price',
        selectSize: 'Select Size',
        selectColor: 'Select Color',
        quantity: 'Quantity',
        reviews: 'reviews',

        // Categories
        browseBy: 'Browse by',
        exploreCollection: 'Explore our collection of',
        viewAll: 'View All',

        // Cart
        shoppingCart: 'Shopping Cart',
        reviewYour: 'Review your',
        itemsInCart: 'items in your cart',
        clearAll: 'Clear All',
        orderSummary: 'Order Summary',
        items: 'items',
        subtotal: 'Subtotal',
        shipping: 'Shipping',
        discount: 'Discount',
        total: 'Total',
        checkout: 'Proceed to Checkout',
        promoCode: 'Promo Code',
        enterPromo: 'Enter promo code',
        apply: 'Apply',
        emptyCart: 'Your cart is empty',
        emptyCartSub: 'Looks like you haven\'t added anything to your cart yet',
        startShopping: 'Start Shopping',
        freeDelivery: 'You qualified for free shipping!',
        securePayment: 'Secure payment with SSL encryption',

        // Settings
        yourAccount: 'Your account',
        editProfile: 'Edit Profile',
        addresses: 'Addresses',
        paymentMethods: 'Payment Methods',
        pushNotifications: 'Push Notifications',
        emailUpdates: 'Email Updates',
        faceId: 'Face ID / Touch ID',
        language: 'Language',
        helpCenter: 'Help Center',
        contactUs: 'Contact Us',
        termsPrivacy: 'Terms & Privacy',
        about: 'About',
        signOut: 'Sign Out',
        account: 'Account',
        preferences: 'Preferences',
        support: 'Support',
        orders: 'Orders',
        wishlist: 'Wishlist',
        coupons: 'Coupons',
        selectLanguage: 'Select Language',
        chooseLanguage: 'Choose your preferred language',
    },
    hi: {
        // Login
        welcomeBack: 'वापसी पर स्वागत है',
        enterPhone: 'जारी रखने के लिए अपना फ़ोन नंबर दर्ज करें',
        phoneNumber: 'फ़ोन नंबर',
        continue: 'जारी रखें',
        terms: 'जारी रखकर, आप हमारी सेवा की शर्तों और गोपनीयता नीति से सहमत हैं',

        // OTP
        verifyOtp: 'ओटीपी सत्यापित करें',
        sentCodeTo: 'हमने कोड भेजा है',
        resend: 'ओटीपी पुनः भेजें',
        resendIn: 'कोड पुनः भेजें',
        verifyAndContinue: 'सत्यापित करें और जारी रखें',
        verifying: 'सत्यापित कर रहा है...',

        // Tabs
        tabProducts: 'उत्पाद',
        tabCategories: 'श्रेणियाँ',
        tabCart: 'कार्ट',
        tabOrders: 'ऑर्डर',
        tabSettings: 'सेटिंग्स',

        // Products
        welcomeApp: 'RKApp में आपका स्वागत है',
        discoverProducts: 'उत्पाद खोजें',
        searchPlaceholder: 'उत्पाद खोजें...',
        productsFound: 'उत्पाद मिले',
        sortBy: 'क्रमबद्ध करें',
        addToCart: 'कार्ट में डालें',
        totalPrice: 'कुल कीमत',
        selectSize: 'आकार चुनें',
        selectColor: 'रंग चुनें',
        quantity: 'मात्रा',
        reviews: 'समीक्षाएं',

        // Categories
        browseBy: 'ब्राउज़ करें',
        exploreCollection: 'हमारे संग्रह का अन्वेषण करें',
        viewAll: 'सभी देखें',

        // Cart
        shoppingCart: 'शॉपिंग कार्ट',
        reviewYour: 'समीक्षा करें',
        itemsInCart: 'वस्तुएँ आपकी कार्ट में',
        clearAll: 'सभी साफ़ करें',
        orderSummary: 'ऑर्डर सारांश',
        items: 'वस्तुएँ',
        subtotal: 'उप-योग',
        shipping: 'शिपिंग',
        discount: 'छूट',
        total: 'योग',
        checkout: 'चेकआउट के लिए आगे बढ़ें',
        promoCode: 'प्रोमो कोड',
        enterPromo: 'प्रोमो कोड दर्ज करें',
        apply: 'लागू करें',
        emptyCart: 'आपकी कार्ट खाली है',
        emptyCartSub: 'ऐसा लगता है कि आपने अभी तक अपनी कार्ट में कुछ भी नहीं जोड़ा है',
        startShopping: 'खरीदारी शुरू करें',
        freeDelivery: 'आप मुफ़्त शिपिंग के लिए योग्य हैं!',
        securePayment: 'SSL एन्क्रिप्शन के साथ सुरक्षित भुगतान',

        // Settings
        yourAccount: 'आपका खाता',
        editProfile: 'प्रोफ़ाइल संपादित करें',
        addresses: 'पते',
        paymentMethods: 'भुगतान विधियाँ',
        pushNotifications: 'पुश सूचनाएं',
        emailUpdates: 'ईमेल अपडेट',
        faceId: 'फेस आईडी / टच आईडी',
        language: 'भाषा',
        helpCenter: 'सहायता केंद्र',
        contactUs: 'संपर्क करें',
        termsPrivacy: 'शर्तें और गोपनीयता',
        about: 'के बारे में',
        signOut: 'साइन आउट',
        account: 'खाता',
        preferences: 'प्राथमिकताएं',
        support: 'सहायता',
        orders: 'ऑर्डर',
        wishlist: 'इच्छा सूची',
        coupons: 'कूपन',
        selectLanguage: 'भाषा चुनें',
        chooseLanguage: 'अपनी पसंदीदा भाषा चुनें',
    },
    gu: {
        // Login
        welcomeBack: 'સ્વાગત છે',
        enterPhone: 'ચાલુ રાખવા માટે તમારો ફોન નંબર દાખલ કરો',
        phoneNumber: 'ફોન નંબર',
        continue: 'ચાલુ રાખો',
        terms: 'ચાલુ રાખીને, તમે અમારી સેવાની શરતો અને ગોપનીયતા નીતિ સાથે સંમત થાઓ છો',

        // OTP
        verifyOtp: 'OTP ચકાસો',
        sentCodeTo: 'અમે કોડ મોકલ્યો છે',
        resend: 'OTP ફરી મોકલો',
        resendIn: 'કોડ ફરી મોકલો',
        verifyAndContinue: 'ચકાસો અને ચાલુ રાખો',
        verifying: 'ચકાસી રહ્યું છે...',

        // Tabs
        tabProducts: 'ઉત્પાદનો',
        tabCategories: 'શ્રેણીઓ',
        tabCart: 'કાર્ટ',
        tabOrders: 'ઓર્ડર',
        tabSettings: 'સેટિંગ્સ',

        // Products
        welcomeApp: 'RKApp માં સ્વાગત છે',
        discoverProducts: 'ઉત્પાદનો શોધો',
        searchPlaceholder: 'ઉત્પાદનો શોધો...',
        productsFound: 'ઉત્પાદનો મળ્યા',
        sortBy: 'ક્રમબદ્ધ કરો',
        addToCart: 'કાર્ટમાં ઉમેરો',
        totalPrice: 'કુલ કિંમત',
        selectSize: 'કદ પસંદ કરો',
        selectColor: 'રંગ પસંદ કરો',
        quantity: 'જથ્થો',
        reviews: 'સમીક્ષાઓ',

        // Categories
        browseBy: 'બ્રાઉઝ કરો',
        exploreCollection: 'અમારા સંગ્રહનું અન્વેષણ કરો',
        viewAll: 'બધા જુઓ',

        // Cart
        shoppingCart: 'શોપિંગ કાર્ટ',
        reviewYour: 'સમીક્ષા કરો',
        itemsInCart: 'વસ્તુઓ તમારા કાર્ટમાં',
        clearAll: 'બધું સાફ કરો',
        orderSummary: 'ઓર્ડર સારાંશ',
        items: 'વસ્તુઓ',
        subtotal: 'સબટોટલ',
        shipping: 'શિપિંગ',
        discount: 'ડિસ્કાઉન્ટ',
        total: 'કુલ',
        checkout: 'ચેકઆઉટ આગળ વધો',
        promoCode: 'પ્રોમો કોડ',
        enterPromo: 'પ્રોમો કોડ દાખલ કરો',
        apply: 'લાગુ કરો',
        emptyCart: 'તમારું કાર્ટ ખાલી છે',
        emptyCartSub: 'લાગે છે કે તમે હજી સુધી તમારા કાર્ટમાં કંઈપણ ઉમેર્યું નથી',
        startShopping: 'ખરીદી શરૂ કરો',
        freeDelivery: 'તમે મફત શિપિંગ માટે લાયક છો!',
        securePayment: 'SSL એન્ક્રિપ્શન સાથે સુરક્ષિત ચુકવણી',

        // Settings
        yourAccount: 'તમારું ખાતું',
        editProfile: 'પ્રોફાઇલ સંપાદિત કરો',
        addresses: 'સરનામાં',
        paymentMethods: 'ચુકવણી પદ્ધતિઓ',
        pushNotifications: 'પુશ સૂચનાઓ',
        emailUpdates: 'ઇમેઇલ અપડેટ્સ',
        faceId: 'ફેસ આઈડી / ટચ આઈડી',
        language: 'ભાષા',
        helpCenter: 'સહાય કેન્દ્ર',
        contactUs: 'અમારો સંપર્ક કરો',
        termsPrivacy: 'શરતો અને ગોપનીયતા',
        about: 'વિશે',
        signOut: 'સાઇન આઉટ',
        account: 'ખાતું',
        preferences: 'પસંદગીઓ',
        support: 'સહાય',
        orders: 'ઓર્ડર',
        wishlist: 'વિશલિસ્ટ',
        coupons: 'કૂપન્સ',
        selectLanguage: 'ભાષા પસંદ કરો',
        chooseLanguage: 'તમારી પસંદગીની ભાષા પસંદ કરો',
    }
};

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    const [language, setLanguageState] = useState<Language>('en');

    useEffect(() => {
        // Load saved language
        AsyncStorage.getItem('user-language').then((savedLang) => {
            if (savedLang && (savedLang === 'en' || savedLang === 'hi' || savedLang === 'gu')) {
                setLanguageState(savedLang as Language);
            }
        });
    }, []);

    const setLanguage = async (lang: Language) => {
        setLanguageState(lang);
        await AsyncStorage.setItem('user-language', lang);
    };

    const t = (key: string) => {
        return translations[language][key] || key;
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
}

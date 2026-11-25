/**
 * Icon Components
 * 
 * Centralized icon exports using Lucide React Native
 * for consistent, modern iconography throughout the app.
 */

import {
    ArrowLeft,
    ArrowRight,
    Backpack,
    Bell,
    Check,
    ChevronDown,
    ChevronRight,
    CreditCard,
    ExternalLink,
    Globe,
    Grid3X3,
    Headphones,
    Heart,
    HelpCircle,
    Home,
    Info,
    LogOut,
    MapPin,
    MessageCircle,
    Minus,
    Package,
    Plus,
    Search,
    Settings,
    Share2,
    Shield,
    Shirt,
    ShoppingBag,
    ShoppingCart,
    Smartphone,
    Star,
    Tag,
    Ticket,
    Trash2,
    User,
    Watch,
    X,
} from 'lucide-react-native';

// Re-export all icons for easy access
export const Icons = {
    // Navigation
    ArrowLeft,
    ArrowRight,
    ChevronDown,
    ChevronRight,

    // Actions
    Search,
    Plus,
    Minus,
    X,
    Check,
    Share: Share2,
    ExternalLink,
    Trash: Trash2,

    // E-commerce
    Cart: ShoppingCart,
    Bag: ShoppingBag,
    Heart,
    Star,
    Tag,
    Package,
    Ticket,
    CreditCard,

    // Categories
    Grid: Grid3X3,
    Home,
    Phone: Smartphone,
    Shirt,
    Watch,
    Headphones,
    Backpack,

    // User
    User,
    Settings,
    Bell,
    MapPin,
    Globe,
    Shield,
    LogOut,
    HelpCircle,
    MessageCircle,
    Info,
};

export type IconName = keyof typeof Icons;

// Standard icon props
export interface IconProps {
    size?: number;
    color?: string;
    strokeWidth?: number;
}

// Default icon configuration
export const defaultIconProps: IconProps = {
    size: 24,
    strokeWidth: 1.5,
};

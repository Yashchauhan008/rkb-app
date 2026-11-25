/**
 * Premium Design System
 * 
 * A sophisticated design system inspired by:
 * - Apple Human Interface Guidelines
 * - Linear App
 * - Arc Browser
 * - Stripe
 */

import { Platform } from 'react-native';

// ============================================
// PREMIUM COLOR PALETTE
// Soft, refined, never harsh
// ============================================

const neutral = {
  0: '#FFFFFF',
  50: '#FAFAFA',
  100: '#F5F5F5',
  200: '#E5E5E5',
  300: '#D4D4D4',
  400: '#A3A3A3',
  500: '#737373',
  600: '#525252',
  700: '#404040',
  800: '#262626',
  900: '#171717',
  950: '#0A0A0A',
};

// Brand - Warm Gold (refined, not harsh)
const primary = {
  50: '#FFFBEB',
  100: '#FEF3C7',
  200: '#FDE68A',
  300: '#FCD34D',
  400: '#FBBF24',
  500: '#F59E0B',
  600: '#D97706',
  700: '#B45309',
  800: '#92400E',
  900: '#78350F',
  DEFAULT: '#F59E0B',
};

// Semantic Colors - Muted and elegant
const success = {
  50: '#F0FDF4',
  100: '#DCFCE7',
  400: '#4ADE80',
  500: '#22C55E',
  600: '#16A34A',
  DEFAULT: '#22C55E',
};

const error = {
  50: '#FEF2F2',
  100: '#FEE2E2',
  400: '#F87171',
  500: '#EF4444',
  600: '#DC2626',
  DEFAULT: '#EF4444',
};

const warning = {
  50: '#FFFBEB',
  100: '#FEF3C7',
  400: '#FBBF24',
  500: '#F59E0B',
  600: '#D97706',
  DEFAULT: '#F59E0B',
};

const info = {
  50: '#EFF6FF',
  100: '#DBEAFE',
  400: '#60A5FA',
  500: '#3B82F6',
  600: '#2563EB',
  DEFAULT: '#3B82F6',
};

// ============================================
// THEME COLORS
// ============================================

export const Colors = {
  light: {
    // Base
    text: neutral[900],
    textSecondary: neutral[500],
    textTertiary: neutral[400],

    // Backgrounds
    background: neutral[0],
    backgroundSecondary: neutral[50],
    backgroundTertiary: neutral[100],

    // Surfaces
    surface: neutral[0],
    surfaceElevated: neutral[0],
    surfaceHover: neutral[50],

    // Borders
    border: neutral[200],
    borderSubtle: neutral[100],
    borderFocus: primary.DEFAULT,

    // Brand
    primary: primary.DEFAULT,
    primaryDark: primary[600],
    primaryLight: primary[400],
    primarySubtle: `${primary.DEFAULT}10`,

    // Semantic
    success: success.DEFAULT,
    successSubtle: success[50],
    error: error.DEFAULT,
    errorSubtle: error[50],
    warning: warning.DEFAULT,
    warningSubtle: warning[50],
    info: info.DEFAULT,
    infoSubtle: info[50],

    // Icons
    icon: neutral[600],
    iconSecondary: neutral[400],
    iconActive: primary.DEFAULT,

    // Tab bar
    tabIconDefault: neutral[400],
    tabIconSelected: primary.DEFAULT,
    tint: primary.DEFAULT,

    // Overlay
    overlay: 'rgba(0, 0, 0, 0.4)',
    overlayLight: 'rgba(0, 0, 0, 0.1)',
  },
  dark: {
    // Base
    text: neutral[50],
    textSecondary: neutral[400],
    textTertiary: neutral[500],

    // Backgrounds
    background: neutral[950],
    backgroundSecondary: neutral[900],
    backgroundTertiary: neutral[800],

    // Surfaces
    surface: neutral[900],
    surfaceElevated: neutral[800],
    surfaceHover: neutral[800],

    // Borders
    border: neutral[800],
    borderSubtle: neutral[900],
    borderFocus: primary.DEFAULT,

    // Brand
    primary: primary[400],
    primaryDark: primary[500],
    primaryLight: primary[300],
    primarySubtle: `${primary.DEFAULT}15`,

    // Semantic
    success: success[400],
    successSubtle: `${success.DEFAULT}15`,
    error: error[400],
    errorSubtle: `${error.DEFAULT}15`,
    warning: warning[400],
    warningSubtle: `${warning.DEFAULT}15`,
    info: info[400],
    infoSubtle: `${info.DEFAULT}15`,

    // Icons
    icon: neutral[300],
    iconSecondary: neutral[500],
    iconActive: primary[400],

    // Tab bar
    tabIconDefault: neutral[500],
    tabIconSelected: primary[400],
    tint: primary[400],

    // Overlay
    overlay: 'rgba(0, 0, 0, 0.7)',
    overlayLight: 'rgba(255, 255, 255, 0.05)',
  },
};

export const Palette = { neutral, primary, success, error, warning, info };

// ============================================
// TYPOGRAPHY
// Modern, clean, readable
// ============================================

export const Typography = {
  fontSize: {
    xs: 11,
    sm: 13,
    base: 15,
    md: 17,
    lg: 20,
    xl: 24,
    '2xl': 30,
    '3xl': 36,
    '4xl': 48,
  },
  lineHeight: {
    tight: 1.2,
    snug: 1.375,
    normal: 1.5,
    relaxed: 1.625,
  },
  fontWeight: {
    normal: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },
  letterSpacing: {
    tight: -0.5,
    normal: 0,
    wide: 0.5,
  },
};

// ============================================
// SPACING (4-pt grid)
// ============================================

export const Spacing = {
  0: 0,
  0.5: 2,
  1: 4,
  1.5: 6,
  2: 8,
  2.5: 10,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  7: 28,
  8: 32,
  10: 40,
  12: 48,
  16: 64,
  20: 80,
};

// ============================================
// BORDER RADIUS
// ============================================

export const BorderRadius = {
  none: 0,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
  full: 9999,
};

// ============================================
// SHADOWS (Subtle, layered)
// ============================================

export const Shadows = {
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  xs: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.07,
    shadowRadius: 6,
    elevation: 3,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  xl: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 8,
  },
  // Glow effects
  glow: {
    shadowColor: primary.DEFAULT,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 0,
  },
  glowSm: {
    shadowColor: primary.DEFAULT,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 0,
  },
};

// ============================================
// ANIMATION
// Fast, soft, intentional
// ============================================

export const Animation = {
  spring: {
    // Responsive - immediate feedback
    responsive: {
      damping: 25,
      stiffness: 400,
      mass: 0.5,
    },
    // Gentle - smooth transitions
    gentle: {
      damping: 20,
      stiffness: 180,
      mass: 1,
    },
    // Bouncy - playful feedback
    bouncy: {
      damping: 12,
      stiffness: 150,
      mass: 0.8,
    },
    // Snappy - quick, precise
    snappy: {
      damping: 22,
      stiffness: 350,
      mass: 0.6,
    },
  },
  duration: {
    instant: 100,
    fast: 150,
    normal: 250,
    slow: 400,
  },
  scale: {
    pressed: 0.97,
    pressedSubtle: 0.985,
    hover: 1.02,
  },
  easing: {
    // Standard easing for most transitions
    standard: [0.4, 0, 0.2, 1],
    // Emphasized for attention-grabbing
    emphasized: [0.4, 0, 0, 1],
    // Decelerated for enter transitions
    decelerate: [0, 0, 0.2, 1],
    // Accelerated for exit transitions
    accelerate: [0.4, 0, 1, 1],
  },
};

// ============================================
// Z-INDEX
// ============================================

export const ZIndex = {
  base: 0,
  raised: 1,
  dropdown: 10,
  sticky: 20,
  overlay: 30,
  modal: 40,
  toast: 50,
};

// ============================================
// ICON SIZES
// ============================================

export const IconSize = {
  xs: 14,
  sm: 16,
  md: 20,
  lg: 24,
  xl: 28,
  '2xl': 32,
};

// For component re-exports
export const Fonts = Platform.select({
  ios: { sans: 'SF Pro Text', mono: 'SF Mono' },
  default: { sans: 'System', mono: 'monospace' },
});

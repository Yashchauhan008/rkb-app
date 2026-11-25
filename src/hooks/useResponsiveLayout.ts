/**
 * useResponsiveLayout Hook
 * 
 * Provides responsive layout calculations for dynamic grid layouts.
 * Automatically adjusts columns, padding, and card sizes based on device dimensions.
 */

import { useWindowDimensions } from 'react-native';

export interface ResponsiveLayout {
    /** Screen width */
    width: number;
    /** Screen height */
    height: number;
    /** Whether device is tablet size (width >= 768) */
    isTablet: boolean;
    /** Whether device is in landscape orientation */
    isLandscape: boolean;
    /** Number of columns for grid layout */
    numColumns: number;
    /** Horizontal padding for content */
    horizontalPadding: number;
    /** Gap between cards in grid */
    cardGap: number;
    /** Calculated card width based on screen and columns */
    cardWidth: number;
}

/**
 * Hook for responsive layout calculations
 * @returns Responsive layout configuration object
 */
export function useResponsiveLayout(): ResponsiveLayout {
    const { width, height } = useWindowDimensions();
    const isTablet = width >= 768;
    const isLandscape = width > height;

    const numColumns = isTablet ? (isLandscape ? 4 : 3) : 2;
    const horizontalPadding = isTablet ? 32 : 20;
    const cardGap = isTablet ? 16 : 12;
    const cardWidth = (width - (horizontalPadding * 2) - (cardGap * (numColumns - 1))) / numColumns;

    return {
        width,
        height,
        isTablet,
        isLandscape,
        numColumns,
        horizontalPadding,
        cardGap,
        cardWidth,
    };
}

/**
 * useColorScheme Hook
 * 
 * Returns the current color scheme for the app.
 * Currently forces light mode only - app does not support dark mode.
 */

export type ColorScheme = 'light' | 'dark';

export const useColorScheme = (): ColorScheme => 'light';

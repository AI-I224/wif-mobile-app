/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = '#3b82f6';
const tintColorDark = '#3b82f6';

export const Colors = {
  light: {
    text: '#11181C',
    background: '#FFFFFF',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
    // Profile page colors
    profileBackground: '#FFFFFF',
    cardBackground: '#E5E7EB',
    borderColor: '#D1D5DB',
    secondaryText: '#6B7280',
    primaryText: '#11181C',
    statusBar: 'dark',
  },
  dark: {
    text: '#ECEDEE',
    background: '#000000',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
    // Profile page colors
    profileBackground: '#000000',
    cardBackground: '#1F2937',
    borderColor: '#374151',
    secondaryText: '#9CA3AF',
    primaryText: '#FFFFFF',
    statusBar: 'light',
  },
};

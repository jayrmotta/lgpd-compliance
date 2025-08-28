/**
 * Design Token TypeScript Definitions
 * 
 * This file defines the TypeScript types for all design tokens used in the LGPD Platform.
 * These tokens ensure consistency across the design system and provide type safety.
 */

export interface ColorTokens {
  // Base colors
  border: string;
  input: string;
  ring: string;
  background: string;
  foreground: string;
  
  // Primary colors
  primary: {
    DEFAULT: string;
    foreground: string;
  };
  
  // Secondary colors
  secondary: {
    DEFAULT: string;
    foreground: string;
  };
  
  // Destructive colors
  destructive: {
    DEFAULT: string;
    foreground: string;
  };
  
  // Muted colors
  muted: {
    DEFAULT: string;
    foreground: string;
  };
  
  // Accent colors
  accent: {
    DEFAULT: string;
    foreground: string;
  };
  
  // Popover colors
  popover: {
    DEFAULT: string;
    foreground: string;
  };
  
  // Card colors
  card: {
    DEFAULT: string;
    foreground: string;
  };
}

export interface BorderRadiusTokens {
  lg: string;
  md: string;
  sm: string;
}

export interface FontFamilyTokens {
  sans: string[];
  mono: string[];
}

export interface AnimationTokens {
  'accordion-down': string;
  'accordion-up': string;
  'fade-in': string;
  'fade-out': string;
  'slide-in-from-top': string;
  'slide-in-from-bottom': string;
  'slide-in-from-left': string;
  'slide-in-from-right': string;
}

export interface SpacingTokens {
  xs: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  '2xl': string;
  '3xl': string;
}

export interface BreakpointTokens {
  sm: string;
  md: string;
  lg: string;
  xl: string;
  '2xl': string;
}

export interface DesignTokens {
  colors: ColorTokens;
  borderRadius: BorderRadiusTokens;
  fontFamily: FontFamilyTokens;
  animation: AnimationTokens;
  spacing: SpacingTokens;
  breakpoints: BreakpointTokens;
}

// WCAG AA Compliance Color Contrast Ratios
export interface ContrastRatios {
  normal: {
    AA: 4.5;
    AAA: 7;
  };
  large: {
    AA: 3;
    AAA: 4.5;
  };
}

// Theme variants
export type ThemeVariant = 'light' | 'dark' | 'system';

// Component size variants
export type ComponentSize = 'sm' | 'md' | 'lg' | 'xl';

// Component variant types
export type ButtonVariant = 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
export type AlertVariant = 'default' | 'destructive';
export type BadgeVariant = 'default' | 'secondary' | 'destructive' | 'outline';

// Status types for UI feedback
export type StatusType = 'success' | 'error' | 'warning' | 'info' | 'loading';

// Animation duration types
export type AnimationDuration = 'fast' | 'normal' | 'slow';

// Z-index scale for layering
export interface ZIndexScale {
  hide: number;
  auto: string;
  base: number;
  docked: number;
  dropdown: number;
  sticky: number;
  banner: number;
  overlay: number;
  modal: number;
  popover: number;
  skipLink: number;
  toast: number;
  tooltip: number;
}

/**
 * Accessibility Utilities
 * 
 * This file contains utilities for ensuring accessibility compliance,
 * including color contrast testing for WCAG AA standards.
 */

import type { ContrastRatios } from '@/types/design-tokens';

/**
 * WCAG AA Compliance Color Contrast Ratios
 */
export const WCAG_CONTRAST_RATIOS: ContrastRatios = {
  normal: {
    AA: 4.5,
    AAA: 7,
  },
  large: {
    AA: 3,
    AAA: 4.5,
  },
};

/**
 * Converts hex color to RGB values
 */
function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) {
    throw new Error(`Invalid hex color: ${hex}`);
  }
  return {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16),
  };
}

/**
 * Converts HSL color to RGB values
 */
function hslToRgb(h: number, s: number, l: number): { r: number; g: number; b: number } {
  s /= 100;
  l /= 100;

  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs((h / 60) % 2 - 1));
  const m = l - c / 2;
  let r = 0, g = 0, b = 0;

  if (0 <= h && h < 60) {
    r = c; g = x; b = 0;
  } else if (60 <= h && h < 120) {
    r = x; g = c; b = 0;
  } else if (120 <= h && h < 180) {
    r = 0; g = c; b = x;
  } else if (180 <= h && h < 240) {
    r = 0; g = x; b = c;
  } else if (240 <= h && h < 300) {
    r = x; g = 0; b = c;
  } else if (300 <= h && h < 360) {
    r = c; g = 0; b = x;
  }

  return {
    r: Math.round((r + m) * 255),
    g: Math.round((g + m) * 255),
    b: Math.round((b + m) * 255),
  };
}

/**
 * Calculates relative luminance of a color
 */
function getRelativeLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map(c => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

/**
 * Calculates color contrast ratio between two colors
 */
export function calculateContrastRatio(color1: string, color2: string): number {
  let rgb1: { r: number; g: number; b: number };
  let rgb2: { r: number; g: number; b: number };

  // Parse color1
  if (color1.startsWith('#')) {
    rgb1 = hexToRgb(color1);
  } else if (color1.startsWith('hsl(')) {
    const match = color1.match(/hsl\(([^)]+)\)/);
    if (!match) throw new Error(`Invalid HSL color: ${color1}`);
    const [h, s, l] = match[1].split(',').map(s => parseFloat(s.trim()));
    rgb1 = hslToRgb(h, s, l);
  } else {
    throw new Error(`Unsupported color format: ${color1}`);
  }

  // Parse color2
  if (color2.startsWith('#')) {
    rgb2 = hexToRgb(color2);
  } else if (color2.startsWith('hsl(')) {
    const match = color2.match(/hsl\(([^)]+)\)/);
    if (!match) throw new Error(`Invalid HSL color: ${color2}`);
    const [h, s, l] = match[1].split(',').map(s => parseFloat(s.trim()));
    rgb2 = hslToRgb(h, s, l);
  } else {
    throw new Error(`Unsupported color format: ${color2}`);
  }

  const lum1 = getRelativeLuminance(rgb1.r, rgb1.g, rgb1.b);
  const lum2 = getRelativeLuminance(rgb2.r, rgb2.g, rgb2.b);

  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);

  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Tests if a color combination meets WCAG AA standards
 */
export function testWCAGCompliance(
  foreground: string,
  background: string,
  size: 'normal' | 'large' = 'normal',
  level: 'AA' | 'AAA' = 'AA'
): {
  passes: boolean;
  ratio: number;
  required: number;
  level: 'AA' | 'AAA';
  size: 'normal' | 'large';
} {
  const ratio = calculateContrastRatio(foreground, background);
  const required = WCAG_CONTRAST_RATIOS[size][level];

  return {
    passes: ratio >= required,
    ratio: Math.round(ratio * 100) / 100,
    required,
    level,
    size,
  };
}

/**
 * Generates accessible color combinations
 */
export function generateAccessibleColors(
  baseColor: string,
  size: 'normal' | 'large' = 'normal',
  level: 'AA' | 'AAA' = 'AA'
): {
  lightText: string;
  darkText: string;
  ratio: number;
} {
  const lightText = '#ffffff';
  const darkText = '#000000';

  const lightRatio = calculateContrastRatio(lightText, baseColor);
  const darkRatio = calculateContrastRatio(darkText, baseColor);

  const required = WCAG_CONTRAST_RATIOS[size][level];

  if (lightRatio >= required) {
    return {
      lightText,
      darkText: '#000000',
      ratio: Math.round(lightRatio * 100) / 100,
    };
  } else if (darkRatio >= required) {
    return {
      lightText: '#ffffff',
      darkText,
      ratio: Math.round(darkRatio * 100) / 100,
    };
  } else {
    // If neither passes, return the better option
    const betterRatio = Math.max(lightRatio, darkRatio);
    return {
      lightText: lightRatio > darkRatio ? lightText : '#ffffff',
      darkText: lightRatio > darkRatio ? '#000000' : darkText,
      ratio: Math.round(betterRatio * 100) / 100,
    };
  }
}

/**
 * Validates keyboard navigation support
 */
export function validateKeyboardNavigation(element: HTMLElement): {
  hasTabIndex: boolean;
  hasFocusVisible: boolean;
  hasAriaLabel: boolean;
  isValid: boolean;
} {
  const hasTabIndex = element.hasAttribute('tabindex');
  const hasFocusVisible = element.classList.contains('focus-visible') || 
                         element.style.outline !== '';
  const hasAriaLabel = element.hasAttribute('aria-label') || 
                      element.hasAttribute('aria-labelledby') ||
                      element.hasAttribute('title');

  return {
    hasTabIndex,
    hasFocusVisible,
    hasAriaLabel,
    isValid: hasTabIndex && hasFocusVisible,
  };
}

/**
 * Screen reader text utility
 */
export function srOnly(text: string): string {
  return `<span class="sr-only">${text}</span>`;
}

/**
 * Generates unique IDs for ARIA relationships
 */
export function generateAriaId(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
}

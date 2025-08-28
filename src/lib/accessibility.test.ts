import {
  calculateContrastRatio,
  testWCAGCompliance,
  generateAccessibleColors,
  validateKeyboardNavigation,
  generateAriaId,
  WCAG_CONTRAST_RATIOS,
} from './accessibility';

describe('Accessibility Utilities', () => {
  describe('WCAG_CONTRAST_RATIOS', () => {
    it('should have correct AA ratios', () => {
      expect(WCAG_CONTRAST_RATIOS.normal.AA).toBe(4.5);
      expect(WCAG_CONTRAST_RATIOS.large.AA).toBe(3);
    });

    it('should have correct AAA ratios', () => {
      expect(WCAG_CONTRAST_RATIOS.normal.AAA).toBe(7);
      expect(WCAG_CONTRAST_RATIOS.large.AAA).toBe(4.5);
    });
  });

  describe('calculateContrastRatio', () => {
    it('should calculate correct contrast ratio for black on white', () => {
      const ratio = calculateContrastRatio('#000000', '#ffffff');
      expect(ratio).toBeCloseTo(21, 0);
    });

    it('should calculate correct contrast ratio for white on black', () => {
      const ratio = calculateContrastRatio('#ffffff', '#000000');
      expect(ratio).toBeCloseTo(21, 0);
    });

    it('should calculate correct contrast ratio for gray on white', () => {
      const ratio = calculateContrastRatio('#666666', '#ffffff');
      expect(ratio).toBeCloseTo(5.74, 1);
    });

    it('should handle HSL colors', () => {
      const ratio = calculateContrastRatio('hsl(0, 0%, 0%)', 'hsl(0, 0%, 100%)');
      expect(ratio).toBeCloseTo(21, 0);
    });

    it('should throw error for invalid hex color', () => {
      expect(() => calculateContrastRatio('#invalid', '#ffffff')).toThrow('Invalid hex color');
    });

    it('should throw error for unsupported color format', () => {
      expect(() => calculateContrastRatio('rgb(0,0,0)', '#ffffff')).toThrow('Unsupported color format');
    });
  });

  describe('testWCAGCompliance', () => {
    it('should pass AA compliance for high contrast colors', () => {
      const result = testWCAGCompliance('#000000', '#ffffff', 'normal', 'AA');
      expect(result.passes).toBe(true);
      expect(result.ratio).toBeCloseTo(21, 0);
      expect(result.required).toBe(4.5);
      expect(result.level).toBe('AA');
      expect(result.size).toBe('normal');
    });

    it('should fail AA compliance for low contrast colors', () => {
      const result = testWCAGCompliance('#cccccc', '#dddddd', 'normal', 'AA');
      expect(result.passes).toBe(false);
      expect(result.ratio).toBeLessThan(4.5);
    });

    it('should pass AAA compliance for very high contrast colors', () => {
      const result = testWCAGCompliance('#000000', '#ffffff', 'normal', 'AAA');
      expect(result.passes).toBe(true);
      expect(result.ratio).toBeCloseTo(21, 0);
      expect(result.required).toBe(7);
    });

    it('should use large text requirements when specified', () => {
      const result = testWCAGCompliance('#666666', '#ffffff', 'large', 'AA');
      expect(result.required).toBe(3);
      expect(result.size).toBe('large');
    });
  });

  describe('generateAccessibleColors', () => {
    it('should return light text for dark backgrounds', () => {
      const result = generateAccessibleColors('#000000', 'normal', 'AA');
      expect(result.lightText).toBe('#ffffff');
      expect(result.darkText).toBe('#000000');
      expect(result.ratio).toBeGreaterThanOrEqual(4.5);
    });

    it('should return dark text for light backgrounds', () => {
      const result = generateAccessibleColors('#ffffff', 'normal', 'AA');
      expect(result.lightText).toBe('#ffffff');
      expect(result.darkText).toBe('#000000');
      expect(result.ratio).toBeGreaterThanOrEqual(4.5);
    });

    it('should handle medium contrast backgrounds', () => {
      const result = generateAccessibleColors('#666666', 'normal', 'AA');
      expect(result.ratio).toBeGreaterThan(1);
    });

    it('should use large text requirements when specified', () => {
      const result = generateAccessibleColors('#888888', 'large', 'AA');
      expect(result.ratio).toBeGreaterThanOrEqual(3);
    });
  });

  describe('validateKeyboardNavigation', () => {
    it('should validate keyboard navigation for accessible element', () => {
      const element = document.createElement('button');
      element.setAttribute('tabindex', '0');
      element.classList.add('focus-visible');
      element.setAttribute('aria-label', 'Test button');

      const result = validateKeyboardNavigation(element);
      expect(result.hasTabIndex).toBe(true);
      expect(result.hasFocusVisible).toBe(true);
      expect(result.hasAriaLabel).toBe(true);
      expect(result.isValid).toBe(true);
    });

    it('should detect missing tabindex', () => {
      const element = document.createElement('div');
      element.classList.add('focus-visible');

      const result = validateKeyboardNavigation(element);
      expect(result.hasTabIndex).toBe(false);
      expect(result.isValid).toBe(false);
    });

    it('should detect missing focus visible styles', () => {
      const element = document.createElement('button');
      element.setAttribute('tabindex', '0');

      const result = validateKeyboardNavigation(element);
      expect(result.hasFocusVisible).toBe(false);
      expect(result.isValid).toBe(false);
    });

    it('should detect aria-label alternatives', () => {
      const element = document.createElement('button');
      element.setAttribute('tabindex', '0');
      element.setAttribute('title', 'Test button');

      const result = validateKeyboardNavigation(element);
      expect(result.hasAriaLabel).toBe(true);
    });
  });

  describe('generateAriaId', () => {
    it('should generate unique IDs with prefix', () => {
      const id1 = generateAriaId('button');
      const id2 = generateAriaId('button');

      expect(id1).toMatch(/^button-[a-z0-9]{9}$/);
      expect(id2).toMatch(/^button-[a-z0-9]{9}$/);
      expect(id1).not.toBe(id2);
    });

    it('should generate different IDs for different prefixes', () => {
      const id1 = generateAriaId('button');
      const id2 = generateAriaId('input');

      expect(id1).toMatch(/^button-/);
      expect(id2).toMatch(/^input-/);
    });
  });
});

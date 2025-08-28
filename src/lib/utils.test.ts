import { getIconBorderColor } from './utils';

describe('getIconBorderColor', () => {
  it('should handle background color classes', () => {
    expect(getIconBorderColor('bg-blue-500')).toBe('hover:border-blue-500 border-blue-500/20');
    expect(getIconBorderColor('bg-red-500')).toBe('hover:border-red-500 border-red-500/20');
    expect(getIconBorderColor('bg-green-500')).toBe('hover:border-green-500 border-green-500/20');
  });

  it('should handle text color classes', () => {
    expect(getIconBorderColor('text-primary')).toBe('hover:border-primary border-primary/20');
    expect(getIconBorderColor('text-destructive')).toBe('hover:border-destructive border-destructive/20');
    expect(getIconBorderColor('text-accent')).toBe('hover:border-accent border-accent/20');
    expect(getIconBorderColor('text-chart-4')).toBe('hover:border-chart-4 border-chart-4/20');
  });

  it('should fallback to default border for unknown classes', () => {
    expect(getIconBorderColor('unknown-class')).toBe('hover:border-primary border-border');
    expect(getIconBorderColor('')).toBe('hover:border-primary border-border');
  });
});

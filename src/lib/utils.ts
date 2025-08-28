import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Extracts the border color from an icon color class and returns the appropriate border color class
 * @param iconColorClass - The Tailwind color class used for the icon (e.g., 'bg-blue-500', 'text-primary')
 * @returns The corresponding border color class
 */
export function getIconBorderColor(iconColorClass: string): string {
  // Handle background color classes (e.g., 'bg-blue-500')
  if (iconColorClass.startsWith('bg-')) {
    const colorName = iconColorClass.replace('bg-', '');
    return `hover:border-${colorName} border-${colorName}/20`;
  }
  
  // Handle text color classes (e.g., 'text-primary', 'text-destructive')
  if (iconColorClass.startsWith('text-')) {
    const colorName = iconColorClass.replace('text-', '');
    return `hover:border-${colorName} border-${colorName}/20`;
  }
  
  // Fallback to default border
  return 'hover:border-primary border-border';
}

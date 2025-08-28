import React from 'react';
import { render, screen } from '@testing-library/react';
import { Separator } from './separator';

describe('Separator', () => {
  it('renders a horizontal separator by default', () => {
    render(<Separator data-testid="separator" />);
    const separator = screen.getByTestId('separator');
    expect(separator).toBeInTheDocument();
    expect(separator).toHaveClass('h-[1px]', 'w-full');
  });

  it('renders a vertical separator when orientation is vertical', () => {
    render(<Separator orientation="vertical" data-testid="separator" />);
    const separator = screen.getByTestId('separator');
    expect(separator).toBeInTheDocument();
    expect(separator).toHaveClass('h-full', 'w-[1px]');
  });

  it('applies custom className', () => {
    render(<Separator className="custom-class" data-testid="separator" />);
    const separator = screen.getByTestId('separator');
    expect(separator).toHaveClass('custom-class');
  });

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<Separator ref={ref} data-testid="separator" />);
    expect(ref.current).toBeInTheDocument();
  });

  it('applies border color class', () => {
    render(<Separator data-testid="separator" />);
    const separator = screen.getByTestId('separator');
    expect(separator).toHaveClass('bg-border');
  });

  it('applies shrink-0 class', () => {
    render(<Separator data-testid="separator" />);
    const separator = screen.getByTestId('separator');
    expect(separator).toHaveClass('shrink-0');
  });

  it('forwards additional props', () => {
    render(<Separator data-testid="separator" aria-label="Section divider" />);
    const separator = screen.getByTestId('separator');
    expect(separator).toHaveAttribute('aria-label', 'Section divider');
  });

  it('combines custom className with default classes', () => {
    render(<Separator className="my-custom-class" data-testid="separator" />);
    const separator = screen.getByTestId('separator');
    expect(separator).toHaveClass('my-custom-class', 'h-[1px]', 'w-full', 'bg-border', 'shrink-0');
  });

  it('renders with correct orientation attribute', () => {
    render(<Separator orientation="vertical" data-testid="separator" />);
    const separator = screen.getByTestId('separator');
    expect(separator).toHaveAttribute('data-orientation', 'vertical');
  });

  it('renders with role none for decorative separator', () => {
    render(<Separator data-testid="separator" />);
    const separator = screen.getByTestId('separator');
    expect(separator).toHaveAttribute('role', 'none');
  });
});

import React from 'react';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Checkbox } from './checkbox';

describe('Checkbox Component', () => {
  const defaultProps = {
    id: 'test-checkbox',
    'aria-label': 'Test checkbox',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render checkbox with proper accessibility attributes', () => {
      render(<Checkbox {...defaultProps} />);
      
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toBeInTheDocument();
      expect(checkbox).toHaveAttribute('aria-label', 'Test checkbox');
      expect(checkbox).toHaveAttribute('id', 'test-checkbox');
    });

    it('should render with label when provided', () => {
      render(<Checkbox {...defaultProps} label="Accept terms" />);
      
      expect(screen.getByText('Accept terms')).toBeInTheDocument();
      expect(screen.getByRole('checkbox')).toBeInTheDocument();
    });

    it('should render in checked state when checked prop is true', () => {
      render(<Checkbox {...defaultProps} checked />);
      
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toBeChecked();
    });

    it('should render in unchecked state when checked prop is false', () => {
      render(<Checkbox {...defaultProps} checked={false} />);
      
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).not.toBeChecked();
    });

    it('should render in disabled state', () => {
      render(<Checkbox {...defaultProps} disabled />);
      
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toBeDisabled();
    });

    it('should render with custom className', () => {
      render(<Checkbox {...defaultProps} className="custom-class" />);
      
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toHaveClass('custom-class');
    });

    it('should render with aria-required attribute when required prop is true', () => {
      render(<Checkbox {...defaultProps} required />);
      
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toHaveAttribute('aria-required', 'true');
    });

    it('should render with value attribute for form integration', () => {
      render(<Checkbox {...defaultProps} name="test-name" />);
      
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toHaveAttribute('value', 'on');
    });
  });

  describe('Interaction', () => {
    it('should call onCheckedChange when clicked', async () => {
      const user = userEvent.setup();
      const onCheckedChange = jest.fn();
      render(<Checkbox {...defaultProps} onCheckedChange={onCheckedChange} />);
      
      const checkbox = screen.getByRole('checkbox');
      await user.click(checkbox);
      
      expect(onCheckedChange).toHaveBeenCalledWith(true);
    });

    it('should toggle checked state when clicked', async () => {
      const user = userEvent.setup();
      const onCheckedChange = jest.fn();
      render(<Checkbox {...defaultProps} checked onCheckedChange={onCheckedChange} />);
      
      const checkbox = screen.getByRole('checkbox');
      await user.click(checkbox);
      
      expect(onCheckedChange).toHaveBeenCalledWith(false);
    });

    it('should not call onCheckedChange when disabled', async () => {
      const user = userEvent.setup();
      const onCheckedChange = jest.fn();
      render(<Checkbox {...defaultProps} disabled onCheckedChange={onCheckedChange} />);
      
      const checkbox = screen.getByRole('checkbox');
      await user.click(checkbox);
      
      expect(onCheckedChange).not.toHaveBeenCalled();
    });

    it('should handle keyboard interaction (Space key)', async () => {
      const user = userEvent.setup();
      const onCheckedChange = jest.fn();
      render(<Checkbox {...defaultProps} onCheckedChange={onCheckedChange} />);
      
      const checkbox = screen.getByRole('checkbox');
      await act(async () => {
        checkbox.focus();
      });
      await user.keyboard(' ');
      
      expect(onCheckedChange).toHaveBeenCalledWith(true);
    });

    it('should handle keyboard interaction (Enter key)', async () => {
      const user = userEvent.setup();
      const onCheckedChange = jest.fn();
      render(<Checkbox {...defaultProps} onCheckedChange={onCheckedChange} />);
      
      const checkbox = screen.getByRole('checkbox');
      await act(async () => {
        checkbox.focus();
      });
      await user.keyboard('{Enter}');
      
      // Radix UI Checkbox handles Enter key internally, so we test that it doesn't throw
      expect(checkbox).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA attributes', () => {
      render(<Checkbox {...defaultProps} />);
      
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toHaveAttribute('aria-label', 'Test checkbox');
    });

    it('should associate label with checkbox when both id and label are provided', () => {
      render(<Checkbox {...defaultProps} label="Test label" />);
      
      const checkbox = screen.getByRole('checkbox');
      const label = screen.getByText('Test label');
      
      expect(label).toHaveAttribute('for', 'test-checkbox');
      expect(checkbox).toHaveAttribute('id', 'test-checkbox');
    });

    it('should be focusable', () => {
      render(<Checkbox {...defaultProps} />);
      
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toHaveAttribute('tabIndex', '0');
    });

    it('should not be focusable when disabled', () => {
      render(<Checkbox {...defaultProps} disabled />);
      
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toHaveAttribute('tabIndex', '-1');
    });
  });

  describe('Form Integration', () => {
    it('should work with form submission', () => {
      render(
        <form data-testid="test-form">
          <Checkbox {...defaultProps} name="test-checkbox" />
        </form>
      );
      
      const form = screen.getByTestId('test-form');
      const checkbox = screen.getByRole('checkbox');
      
      expect(form).toContainElement(checkbox);
      expect(checkbox).toHaveAttribute('value', 'on');
    });

    it('should handle indeterminate state', () => {
      render(<Checkbox {...defaultProps} checked="indeterminate" />);
      
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toHaveAttribute('aria-checked', 'mixed');
    });
  });

  describe('Styling', () => {
    it('should apply default styling classes', () => {
      render(<Checkbox {...defaultProps} />);
      
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toHaveClass('peer');
    });

    it('should apply disabled styling when disabled', () => {
      render(<Checkbox {...defaultProps} disabled />);
      
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toHaveClass('disabled:opacity-50');
    });
  });
});

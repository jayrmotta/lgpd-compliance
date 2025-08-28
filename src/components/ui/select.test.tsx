import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { EnhancedSelect } from './select';

describe('Select Component', () => {
  const mockOptions = [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3' },
  ];

  const defaultProps = {
    options: mockOptions,
    placeholder: 'Select an option',
    onValueChange: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render select trigger with placeholder', () => {
      render(<EnhancedSelect {...defaultProps} />);
      
      expect(screen.getByRole('combobox')).toBeInTheDocument();
      expect(screen.getByText('Select an option')).toBeInTheDocument();
    });

    it('should render with default value', () => {
      render(<EnhancedSelect {...defaultProps} defaultValue="option1" />);
      
      expect(screen.getByText('Option 1')).toBeInTheDocument();
    });

    it('should render with controlled value', () => {
      render(<EnhancedSelect {...defaultProps} value="option2" />);
      
      expect(screen.getByText('Option 2')).toBeInTheDocument();
    });

    it('should render in disabled state', () => {
      render(<EnhancedSelect {...defaultProps} disabled />);
      
      const trigger = screen.getByRole('combobox');
      expect(trigger).toBeDisabled();
    });
  });

  describe('Interaction', () => {
    it('should open dropdown when clicked', async () => {
      const user = userEvent.setup();
      render(<EnhancedSelect {...defaultProps} />);
      
      const trigger = screen.getByRole('combobox');
      await user.click(trigger);
      
      await waitFor(() => {
        expect(screen.getByText('Option 1')).toBeInTheDocument();
        expect(screen.getByText('Option 2')).toBeInTheDocument();
        expect(screen.getByText('Option 3')).toBeInTheDocument();
      });
    });

    it('should call onValueChange when option is selected', async () => {
      const user = userEvent.setup();
      const onValueChange = jest.fn();
      render(<EnhancedSelect {...defaultProps} onValueChange={onValueChange} />);
      
      const trigger = screen.getByRole('combobox');
      await user.click(trigger);
      
      await waitFor(() => {
        expect(screen.getByText('Option 2')).toBeInTheDocument();
      });
      
      await user.click(screen.getByText('Option 2'));
      
      expect(onValueChange).toHaveBeenCalledWith('option2');
    });

    it('should close dropdown when option is selected', async () => {
      const user = userEvent.setup();
      render(<EnhancedSelect {...defaultProps} />);
      
      const trigger = screen.getByRole('combobox');
      await user.click(trigger);
      
      await waitFor(() => {
        expect(screen.getByText('Option 1')).toBeInTheDocument();
      });
      
      await user.click(screen.getByText('Option 1'));
      
      await waitFor(() => {
        expect(screen.queryByText('Option 2')).not.toBeInTheDocument();
      });
    });

    it('should not open dropdown when disabled', async () => {
      const user = userEvent.setup();
      render(<EnhancedSelect {...defaultProps} disabled />);
      
      const trigger = screen.getByRole('combobox');
      await user.click(trigger);
      
      await waitFor(() => {
        expect(screen.queryByText('Option 1')).not.toBeInTheDocument();
      });
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA attributes', () => {
      render(<EnhancedSelect {...defaultProps} />);
      
      const trigger = screen.getByRole('combobox');
      expect(trigger).toHaveAttribute('aria-expanded', 'false');
      expect(trigger).toHaveAttribute('aria-haspopup', 'listbox');
    });

    it('should update aria-expanded when opened', async () => {
      const user = userEvent.setup();
      render(<EnhancedSelect {...defaultProps} />);
      
      const trigger = screen.getByRole('combobox');
      await user.click(trigger);
      
      await waitFor(() => {
        expect(trigger).toHaveAttribute('aria-expanded', 'true');
      });
    });

    it('should support keyboard navigation', async () => {
      const user = userEvent.setup();
      render(<EnhancedSelect {...defaultProps} />);
      
      const trigger = screen.getByRole('combobox');
      await act(async () => {
        trigger.focus();
      });
      
      await user.keyboard('{Enter}');
      
      await waitFor(() => {
        expect(screen.getByText('Option 1')).toBeInTheDocument();
      });
    });
  });

  describe('Custom styling', () => {
    it('should apply custom className to trigger', () => {
      render(<EnhancedSelect {...defaultProps} className="custom-select" />);
      
      const trigger = screen.getByRole('combobox');
      expect(trigger).toHaveClass('custom-select');
    });

    it('should render with different sizes', () => {
      const { rerender } = render(<EnhancedSelect {...defaultProps} size="sm" />);
      let trigger = screen.getByRole('combobox');
      expect(trigger).toHaveClass('h-8');
      
      rerender(<EnhancedSelect {...defaultProps} size="lg" />);
      trigger = screen.getByRole('combobox');
      expect(trigger).toHaveClass('h-12');
    });
  });

  describe('Error handling', () => {
    it('should handle empty options array', () => {
      render(<EnhancedSelect {...defaultProps} options={[]} />);
      
      const trigger = screen.getByRole('combobox');
      expect(trigger).toBeInTheDocument();
      expect(screen.getByText('Select an option')).toBeInTheDocument();
    });

    it('should handle invalid default value', () => {
      render(<EnhancedSelect {...defaultProps} defaultValue="invalid" />);
      
      expect(screen.getByText('Select an option')).toBeInTheDocument();
    });
  });
});

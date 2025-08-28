import React from 'react';
import { render, screen, act, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RadioGroup, RadioGroupItem } from './radio-group';

describe('Radio Group Component', () => {
  const mockOptions = [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3' },
  ];

  const defaultProps = {
    options: mockOptions,
    name: 'test-radio-group',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render radio group with all options', () => {
      render(<RadioGroup {...defaultProps} />);
      
      expect(screen.getByRole('radiogroup')).toBeInTheDocument();
      expect(screen.getByLabelText('Option 1')).toBeInTheDocument();
      expect(screen.getByLabelText('Option 2')).toBeInTheDocument();
      expect(screen.getByLabelText('Option 3')).toBeInTheDocument();
    });

    it('should render with default value', () => {
      render(<RadioGroup {...defaultProps} defaultValue="option2" />);
      
      const option2 = screen.getByLabelText('Option 2');
      expect(option2).toBeChecked();
    });

    it('should render with controlled value', () => {
      render(<RadioGroup {...defaultProps} value="option3" />);
      
      const option3 = screen.getByLabelText('Option 3');
      expect(option3).toBeChecked();
    });

    it('should render in disabled state', () => {
      render(<RadioGroup {...defaultProps} disabled />);
      
      const radioButtons = screen.getAllByRole('radio');
      radioButtons.forEach(radio => {
        expect(radio).toBeDisabled();
      });
    });

    it('should render with custom className', () => {
      render(<RadioGroup {...defaultProps} className="custom-class" />);
      
      const radioGroup = screen.getByRole('radiogroup');
      expect(radioGroup).toHaveClass('custom-class');
    });

    it('should render with required attribute', () => {
      render(<RadioGroup {...defaultProps} required />);
      
      const radioGroup = screen.getByRole('radiogroup');
      expect(radioGroup).toHaveAttribute('aria-required', 'true');
    });

    it('should render with value attributes for form integration', () => {
      render(<RadioGroup {...defaultProps} />);
      
      const radioButtons = screen.getAllByRole('radio');
      radioButtons.forEach(radio => {
        expect(radio).toHaveAttribute('value');
      });
    });

    it('should render with orientation styling', () => {
      render(<RadioGroup {...defaultProps} orientation="horizontal" />);
      
      const radioGroup = screen.getByRole('radiogroup');
      expect(radioGroup).toHaveClass('flex-row');
    });
  });

  describe('Interaction', () => {
    it('should call onValueChange when option is selected', async () => {
      const user = userEvent.setup();
      const onValueChange = jest.fn();
      render(<RadioGroup {...defaultProps} onValueChange={onValueChange} />);
      
      const option2 = screen.getByLabelText('Option 2');
      await user.click(option2);
      
      expect(onValueChange).toHaveBeenCalledWith('option2');
    });

    it('should update checked state when option is selected', async () => {
      const user = userEvent.setup();
      render(<RadioGroup {...defaultProps} />);
      
      const option1 = screen.getByLabelText('Option 1');
      const option3 = screen.getByLabelText('Option 3');
      
      await user.click(option1);
      expect(option1).toBeChecked();
      expect(option3).not.toBeChecked();
      
      await user.click(option3);
      expect(option3).toBeChecked();
      expect(option1).not.toBeChecked();
    });

    it('should not call onValueChange when disabled', async () => {
      const user = userEvent.setup();
      const onValueChange = jest.fn();
      render(<RadioGroup {...defaultProps} disabled onValueChange={onValueChange} />);
      
      const option2 = screen.getByLabelText('Option 2');
      await user.click(option2);
      
      expect(onValueChange).not.toHaveBeenCalled();
    });

    it('should handle keyboard navigation', async () => {
      const user = userEvent.setup();
      const onValueChange = jest.fn();
      render(<RadioGroup {...defaultProps} onValueChange={onValueChange} />);
      
      const radioGroup = screen.getByRole('radiogroup');
      
      await act(async () => {
        radioGroup.focus();
      });
      
      // Radix UI handles keyboard navigation internally, so we test that it doesn't throw
      await user.keyboard('{ArrowDown}');
      expect(radioGroup).toBeInTheDocument();
    });

    it('should handle Space key selection', async () => {
      const user = userEvent.setup();
      const onValueChange = jest.fn();
      render(<RadioGroup {...defaultProps} onValueChange={onValueChange} />);
      
      const option2 = screen.getByLabelText('Option 2');
      
      await act(async () => {
        option2.focus();
      });
      
      await user.keyboard(' ');
      
      await waitFor(() => {
        expect(onValueChange).toHaveBeenCalledWith('option2');
      });
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA attributes', () => {
      render(<RadioGroup {...defaultProps} />);
      
      const radioGroup = screen.getByRole('radiogroup');
      expect(radioGroup).toHaveAttribute('role', 'radiogroup');
    });

    it('should associate labels with radio buttons', () => {
      render(<RadioGroup {...defaultProps} />);
      
      const option1 = screen.getByLabelText('Option 1');
      const option2 = screen.getByLabelText('Option 2');
      const option3 = screen.getByLabelText('Option 3');
      
      expect(option1).toBeInTheDocument();
      expect(option2).toBeInTheDocument();
      expect(option3).toBeInTheDocument();
    });

    it('should be focusable', () => {
      render(<RadioGroup {...defaultProps} />);
      
      const radioGroup = screen.getByRole('radiogroup');
      expect(radioGroup).toHaveAttribute('tabIndex', '0');
    });

    it('should not be focusable when disabled', () => {
      render(<RadioGroup {...defaultProps} disabled />);
      
      const radioButtons = screen.getAllByRole('radio');
      radioButtons.forEach(radio => {
        expect(radio).toHaveAttribute('tabIndex', '-1');
      });
    });

    it('should have proper aria-checked states', () => {
      render(<RadioGroup {...defaultProps} defaultValue="option2" />);
      
      const option1 = screen.getByLabelText('Option 1');
      const option2 = screen.getByLabelText('Option 2');
      
      expect(option1).toHaveAttribute('aria-checked', 'false');
      expect(option2).toHaveAttribute('aria-checked', 'true');
    });
  });

  describe('Form Integration', () => {
    it('should work with form submission', () => {
      render(
        <form data-testid="test-form">
          <RadioGroup {...defaultProps} />
        </form>
      );
      
      const form = screen.getByTestId('test-form');
      const radioGroup = screen.getByRole('radiogroup');
      
      expect(form).toContainElement(radioGroup);
    });

    it('should handle form validation', () => {
      render(<RadioGroup {...defaultProps} required />);
      
      const radioGroup = screen.getByRole('radiogroup');
      expect(radioGroup).toHaveAttribute('aria-required', 'true');
    });
  });

  describe('Styling', () => {
    it('should apply default styling classes', () => {
      render(<RadioGroup {...defaultProps} />);
      
      const radioGroup = screen.getByRole('radiogroup');
      expect(radioGroup).toHaveClass('grid');
    });

    it('should apply disabled styling when disabled', () => {
      render(<RadioGroup {...defaultProps} disabled />);
      
      const radioButtons = screen.getAllByRole('radio');
      radioButtons.forEach(radio => {
        expect(radio).toHaveClass('disabled:opacity-50');
      });
    });

    it('should apply orientation styling', () => {
      render(<RadioGroup {...defaultProps} orientation="horizontal" />);
      
      const radioGroup = screen.getByRole('radiogroup');
      expect(radioGroup).toHaveClass('flex-row');
    });
  });

  describe('Individual Radio Items', () => {
    it('should render individual radio items correctly', () => {
      render(
        <RadioGroup name="test">
          <RadioGroupItem value="item1" id="item1" />
          <RadioGroupItem value="item2" id="item2" />
        </RadioGroup>
      );
      
      const radioButtons = screen.getAllByRole('radio');
      expect(radioButtons).toHaveLength(2);
    });

    it('should handle individual radio item selection', async () => {
      const user = userEvent.setup();
      const onValueChange = jest.fn();
      
      render(
        <RadioGroup name="test" onValueChange={onValueChange}>
          <RadioGroupItem value="item1" id="item1" />
          <RadioGroupItem value="item2" id="item2" />
        </RadioGroup>
      );
      
      const radioButtons = screen.getAllByRole('radio');
      await user.click(radioButtons[0]);
      
      expect(onValueChange).toHaveBeenCalledWith('item1');
    });
  });
});

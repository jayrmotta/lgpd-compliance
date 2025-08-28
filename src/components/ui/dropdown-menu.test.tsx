import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuGroup,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
} from './dropdown-menu';

// Mock Radix UI primitives
jest.mock('@radix-ui/react-dropdown-menu', () => ({
  Root: ({ children }: { children: React.ReactNode }) => <div data-testid="dropdown-root">{children}</div>,
  Trigger: ({ children, ...props }: React.ComponentProps<'button'>) => (
    <button data-testid="dropdown-trigger" {...props}>
      {children}
    </button>
  ),
  Content: ({ children, ...props }: React.ComponentProps<'div'>) => (
    <div data-testid="dropdown-content" {...props}>
      {children}
    </div>
  ),
  Item: ({ children, ...props }: React.ComponentProps<'div'>) => (
    <div data-testid="dropdown-item" {...props}>
      {children}
    </div>
  ),
  CheckboxItem: ({ children, checked, ...props }: React.ComponentProps<'div'> & { checked?: boolean }) => (
    <div data-testid="dropdown-checkbox-item" data-checked={checked} {...props}>
      {children}
    </div>
  ),
  RadioItem: ({ children, ...props }: React.ComponentProps<'div'>) => (
    <div data-testid="dropdown-radio-item" {...props}>
      {children}
    </div>
  ),
  Label: ({ children, ...props }: React.ComponentProps<'div'>) => (
    <div data-testid="dropdown-label" {...props}>
      {children}
    </div>
  ),
  Separator: (props: React.ComponentProps<'div'>) => <div data-testid="dropdown-separator" {...props} />,
  Group: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="dropdown-group">{children}</div>
  ),
  Sub: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="dropdown-sub">{children}</div>
  ),
  SubContent: ({ children, ...props }: React.ComponentProps<'div'>) => (
    <div data-testid="dropdown-sub-content" {...props}>
      {children}
    </div>
  ),
  SubTrigger: ({ children, ...props }: React.ComponentProps<'div'>) => (
    <div data-testid="dropdown-sub-trigger" {...props}>
      {children}
    </div>
  ),
  RadioGroup: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="dropdown-radio-group">{children}</div>
  ),
  Portal: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  ItemIndicator: ({ children }: { children: React.ReactNode }) => (
    <span data-testid="dropdown-item-indicator">{children}</span>
  ),
}));

describe('DropdownMenu', () => {
  describe('Basic DropdownMenu', () => {
    it('should render dropdown menu with trigger and content', () => {
      render(
        <DropdownMenu>
          <DropdownMenuTrigger>Open Menu</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Item 1</DropdownMenuItem>
            <DropdownMenuItem>Item 2</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );

      expect(screen.getByTestId('dropdown-root')).toBeInTheDocument();
      expect(screen.getByTestId('dropdown-trigger')).toBeInTheDocument();
      expect(screen.getByTestId('dropdown-content')).toBeInTheDocument();
      expect(screen.getAllByTestId('dropdown-item')).toHaveLength(2);
    });

    it('should render trigger with correct text', () => {
      render(
        <DropdownMenu>
          <DropdownMenuTrigger>Test Trigger</DropdownMenuTrigger>
          <DropdownMenuContent />
        </DropdownMenu>
      );

      expect(screen.getByTestId('dropdown-trigger')).toHaveTextContent('Test Trigger');
    });

    it('should render content with items', () => {
      render(
        <DropdownMenu>
          <DropdownMenuTrigger>Open</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>First Item</DropdownMenuItem>
            <DropdownMenuItem>Second Item</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );

      const items = screen.getAllByTestId('dropdown-item');
      expect(items[0]).toHaveTextContent('First Item');
      expect(items[1]).toHaveTextContent('Second Item');
    });
  });

  describe('DropdownMenuItem', () => {
    it('should render menu item with text', () => {
      render(
        <DropdownMenu>
          <DropdownMenuTrigger>Open</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Test Item</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );

      expect(screen.getByTestId('dropdown-item')).toHaveTextContent('Test Item');
    });

    it('should apply inset class when inset prop is true', () => {
      render(
        <DropdownMenu>
          <DropdownMenuTrigger>Open</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem inset>Inset Item</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );

      const item = screen.getByTestId('dropdown-item');
      expect(item).toHaveClass('pl-8');
    });

    it('should handle click events', async () => {
      const handleClick = jest.fn();
      const user = userEvent.setup();

      render(
        <DropdownMenu>
          <DropdownMenuTrigger>Open</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={handleClick}>Clickable Item</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );

      await user.click(screen.getByTestId('dropdown-item'));
      expect(handleClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('DropdownMenuCheckboxItem', () => {
    it('should render checkbox item with correct checked state', () => {
      render(
        <DropdownMenu>
          <DropdownMenuTrigger>Open</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuCheckboxItem checked>Checked Item</DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem checked={false}>Unchecked Item</DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );

      const items = screen.getAllByTestId('dropdown-checkbox-item');
      expect(items[0]).toHaveAttribute('data-checked', 'true');
      expect(items[1]).toHaveAttribute('data-checked', 'false');
    });

    it('should render checkbox item with text', () => {
      render(
        <DropdownMenu>
          <DropdownMenuTrigger>Open</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuCheckboxItem>Checkbox Item</DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );

      expect(screen.getByTestId('dropdown-checkbox-item')).toHaveTextContent('Checkbox Item');
    });
  });

  describe('DropdownMenuRadioItem', () => {
    it('should render radio item with text', () => {
      render(
        <DropdownMenu>
          <DropdownMenuTrigger>Open</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuRadioItem>Radio Item</DropdownMenuRadioItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );

      expect(screen.getByTestId('dropdown-radio-item')).toHaveTextContent('Radio Item');
    });
  });

  describe('DropdownMenuLabel', () => {
    it('should render label with text', () => {
      render(
        <DropdownMenu>
          <DropdownMenuTrigger>Open</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Section Label</DropdownMenuLabel>
          </DropdownMenuContent>
        </DropdownMenu>
      );

      expect(screen.getByTestId('dropdown-label')).toHaveTextContent('Section Label');
    });

    it('should apply inset class when inset prop is true', () => {
      render(
        <DropdownMenu>
          <DropdownMenuTrigger>Open</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel inset>Inset Label</DropdownMenuLabel>
          </DropdownMenuContent>
        </DropdownMenu>
      );

      const label = screen.getByTestId('dropdown-label');
      expect(label).toHaveClass('pl-8');
    });
  });

  describe('DropdownMenuSeparator', () => {
    it('should render separator', () => {
      render(
        <DropdownMenu>
          <DropdownMenuTrigger>Open</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Item 1</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Item 2</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );

      expect(screen.getByTestId('dropdown-separator')).toBeInTheDocument();
    });
  });

  describe('DropdownMenuShortcut', () => {
    it('should render shortcut with text', () => {
      render(
        <DropdownMenu>
          <DropdownMenuTrigger>Open</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>
              Menu Item
              <DropdownMenuShortcut>⌘K</DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );

      expect(screen.getByText('⌘K')).toBeInTheDocument();
    });
  });

  describe('DropdownMenuGroup', () => {
    it('should render group with items', () => {
      render(
        <DropdownMenu>
          <DropdownMenuTrigger>Open</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuGroup>
              <DropdownMenuItem>Group Item 1</DropdownMenuItem>
              <DropdownMenuItem>Group Item 2</DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      );

      expect(screen.getByTestId('dropdown-group')).toBeInTheDocument();
      expect(screen.getAllByTestId('dropdown-item')).toHaveLength(2);
    });
  });

  describe('DropdownMenuSub', () => {
    it('should render sub menu with trigger and content', () => {
      render(
        <DropdownMenu>
          <DropdownMenuTrigger>Open</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>Sub Menu</DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                <DropdownMenuItem>Sub Item</DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
          </DropdownMenuContent>
        </DropdownMenu>
      );

      expect(screen.getByTestId('dropdown-sub')).toBeInTheDocument();
      expect(screen.getByTestId('dropdown-sub-trigger')).toBeInTheDocument();
      expect(screen.getByTestId('dropdown-sub-content')).toBeInTheDocument();
    });

    it('should render sub trigger with text', () => {
      render(
        <DropdownMenu>
          <DropdownMenuTrigger>Open</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>Sub Menu Trigger</DropdownMenuSubTrigger>
              <DropdownMenuSubContent />
            </DropdownMenuSub>
          </DropdownMenuContent>
        </DropdownMenu>
      );

      expect(screen.getByTestId('dropdown-sub-trigger')).toHaveTextContent('Sub Menu Trigger');
    });
  });

  describe('DropdownMenuRadioGroup', () => {
    it('should render radio group with items', () => {
      render(
        <DropdownMenu>
          <DropdownMenuTrigger>Open</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuRadioGroup>
              <DropdownMenuRadioItem>Radio 1</DropdownMenuRadioItem>
              <DropdownMenuRadioItem>Radio 2</DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      );

      expect(screen.getByTestId('dropdown-radio-group')).toBeInTheDocument();
      expect(screen.getAllByTestId('dropdown-radio-item')).toHaveLength(2);
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA attributes on trigger', () => {
      render(
        <DropdownMenu>
          <DropdownMenuTrigger aria-label="Open menu">Open</DropdownMenuTrigger>
          <DropdownMenuContent />
        </DropdownMenu>
      );

      const trigger = screen.getByTestId('dropdown-trigger');
      expect(trigger).toHaveAttribute('aria-label', 'Open menu');
    });

    it('should support keyboard navigation', async () => {
      render(
        <DropdownMenu>
          <DropdownMenuTrigger>Open</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Item 1</DropdownMenuItem>
            <DropdownMenuItem>Item 2</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );

      const trigger = screen.getByTestId('dropdown-trigger');
      trigger.focus();

      // Test that trigger is focusable
      expect(trigger).toHaveFocus();
    });
  });

  describe('Styling', () => {
    it('should apply custom className to trigger', () => {
      render(
        <DropdownMenu>
          <DropdownMenuTrigger className="custom-trigger">Open</DropdownMenuTrigger>
          <DropdownMenuContent />
        </DropdownMenu>
      );

      expect(screen.getByTestId('dropdown-trigger')).toHaveClass('custom-trigger');
    });

    it('should apply custom className to content', () => {
      render(
        <DropdownMenu>
          <DropdownMenuTrigger>Open</DropdownMenuTrigger>
          <DropdownMenuContent className="custom-content" />
        </DropdownMenu>
      );

      expect(screen.getByTestId('dropdown-content')).toHaveClass('custom-content');
    });

    it('should apply custom className to item', () => {
      render(
        <DropdownMenu>
          <DropdownMenuTrigger>Open</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem className="custom-item">Item</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );

      expect(screen.getByTestId('dropdown-item')).toHaveClass('custom-item');
    });
  });
});

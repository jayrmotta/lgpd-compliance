import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './tabs';

describe('Tabs', () => {
  const user = userEvent.setup();

  describe('TabsList', () => {
    it('renders with children', () => {
      render(
        <Tabs defaultValue="tab1">
          <TabsList>
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
            <TabsTrigger value="tab2">Tab 2</TabsTrigger>
          </TabsList>
        </Tabs>
      );

      expect(screen.getByText('Tab 1')).toBeInTheDocument();
      expect(screen.getByText('Tab 2')).toBeInTheDocument();
    });

    it('applies correct CSS classes', () => {
      render(
        <Tabs defaultValue="tab1">
          <TabsList className="custom-class">
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          </TabsList>
        </Tabs>
      );

      const list = screen.getByRole('tablist');
      expect(list).toHaveClass('custom-class');
    });

    it('has correct ARIA attributes', () => {
      render(
        <Tabs defaultValue="tab1">
          <TabsList>
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          </TabsList>
        </Tabs>
      );

      const list = screen.getByRole('tablist');
      expect(list).toBeInTheDocument();
    });
  });

  describe('TabsTrigger', () => {
    it('renders with children', () => {
      render(
        <Tabs defaultValue="tab1">
          <TabsList>
            <TabsTrigger value="tab1">Test Tab</TabsTrigger>
          </TabsList>
        </Tabs>
      );

      expect(screen.getByText('Test Tab')).toBeInTheDocument();
    });

    it('applies custom className', () => {
      render(
        <Tabs defaultValue="tab1">
          <TabsList>
            <TabsTrigger value="tab1" className="custom-trigger-class">Tab 1</TabsTrigger>
          </TabsList>
        </Tabs>
      );

      const trigger = screen.getByRole('tab');
      expect(trigger).toHaveClass('custom-trigger-class');
    });

    it('has correct ARIA attributes when selected', () => {
      render(
        <Tabs defaultValue="tab1">
          <TabsList>
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
            <TabsTrigger value="tab2">Tab 2</TabsTrigger>
          </TabsList>
        </Tabs>
      );

      const selectedTab = screen.getByRole('tab', { selected: true });
      expect(selectedTab).toHaveAttribute('aria-selected', 'true');
      expect(selectedTab).toHaveTextContent('Tab 1');
    });

    it('has correct ARIA attributes when not selected', () => {
      render(
        <Tabs defaultValue="tab1">
          <TabsList>
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
            <TabsTrigger value="tab2">Tab 2</TabsTrigger>
          </TabsList>
        </Tabs>
      );

      const unselectedTab = screen.getByRole('tab', { selected: false });
      expect(unselectedTab).toHaveAttribute('aria-selected', 'false');
      expect(unselectedTab).toHaveTextContent('Tab 2');
    });

    it('is disabled when disabled prop is true', () => {
      render(
        <Tabs defaultValue="tab1">
          <TabsList>
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
            <TabsTrigger value="tab2" disabled>Tab 2</TabsTrigger>
          </TabsList>
        </Tabs>
      );

      const disabledTab = screen.getByRole('tab', { name: 'Tab 2' });
      expect(disabledTab).toBeDisabled();
    });
  });

  describe('TabsContent', () => {
    it('renders with children', () => {
      render(
        <Tabs defaultValue="tab1">
          <TabsList>
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">Content 1</TabsContent>
        </Tabs>
      );

      expect(screen.getByText('Content 1')).toBeInTheDocument();
    });

    it('applies custom className', () => {
      render(
        <Tabs defaultValue="tab1">
          <TabsList>
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1" className="custom-content-class">Content 1</TabsContent>
        </Tabs>
      );

      const content = screen.getByText('Content 1');
      expect(content).toHaveClass('custom-content-class');
    });

    it('is hidden when not selected', () => {
      render(
        <Tabs defaultValue="tab1">
          <TabsList>
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
            <TabsTrigger value="tab2">Tab 2</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">Content 1</TabsContent>
          <TabsContent value="tab2">Content 2</TabsContent>
        </Tabs>
      );

      // Only the active tabpanel is rendered in the DOM
      const activeContent = screen.getByRole('tabpanel');
      expect(activeContent).toHaveAttribute('data-state', 'active');
      expect(activeContent).toHaveTextContent('Content 1');
    });

    it('is visible when selected', () => {
      render(
        <Tabs defaultValue="tab1">
          <TabsList>
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
            <TabsTrigger value="tab2">Tab 2</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">Content 1</TabsContent>
          <TabsContent value="tab2">Content 2</TabsContent>
        </Tabs>
      );

      const visibleContent = screen.getByText('Content 1');
      expect(visibleContent).toHaveAttribute('data-state', 'active');
    });
  });

  describe('Integration Tests', () => {
    it('switches tabs on click', async () => {
      render(
        <Tabs defaultValue="tab1">
          <TabsList>
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
            <TabsTrigger value="tab2">Tab 2</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">Content 1</TabsContent>
          <TabsContent value="tab2">Content 2</TabsContent>
        </Tabs>
      );

      // Initially, Tab 1 should be selected
      expect(screen.getByText('Content 1')).toHaveAttribute('data-state', 'active');

      // Click on Tab 2
      const tab2 = screen.getByRole('tab', { name: 'Tab 2' });
      await user.click(tab2);

      // Now Tab 2 should be selected
      await waitFor(() => {
        expect(screen.getByText('Content 2')).toHaveAttribute('data-state', 'active');
      });
    });

    it('supports keyboard navigation', async () => {
      render(
        <Tabs defaultValue="tab1">
          <TabsList>
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
            <TabsTrigger value="tab2">Tab 2</TabsTrigger>
            <TabsTrigger value="tab3">Tab 3</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">Content 1</TabsContent>
          <TabsContent value="tab2">Content 2</TabsContent>
          <TabsContent value="tab3">Content 3</TabsContent>
        </Tabs>
      );

      const tab1 = screen.getByRole('tab', { name: 'Tab 1' });
      await act(async () => {
        tab1.focus();
      });

      // Navigate with arrow keys
      await user.keyboard('{ArrowRight}');
      expect(screen.getByRole('tab', { name: 'Tab 2' })).toHaveFocus();

      await user.keyboard('{ArrowRight}');
      expect(screen.getByRole('tab', { name: 'Tab 3' })).toHaveFocus();

      // Wrap around to first tab
      await user.keyboard('{ArrowRight}');
      expect(screen.getByRole('tab', { name: 'Tab 1' })).toHaveFocus();
    });

    it('activates tab on Enter key', async () => {
      render(
        <Tabs defaultValue="tab1">
          <TabsList>
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
            <TabsTrigger value="tab2">Tab 2</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">Content 1</TabsContent>
          <TabsContent value="tab2">Content 2</TabsContent>
        </Tabs>
      );

      const tab2 = screen.getByRole('tab', { name: 'Tab 2' });
      await act(async () => {
        tab2.focus();
      });
      await user.keyboard('{Enter}');

      await waitFor(() => {
        expect(screen.getByText('Content 2')).toHaveAttribute('data-state', 'active');
      });
    });

    it('activates tab on Space key', async () => {
      render(
        <Tabs defaultValue="tab1">
          <TabsList>
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
            <TabsTrigger value="tab2">Tab 2</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">Content 1</TabsContent>
          <TabsContent value="tab2">Content 2</TabsContent>
        </Tabs>
      );

      const tab2 = screen.getByRole('tab', { name: 'Tab 2' });
      await act(async () => {
        tab2.focus();
      });
      await user.keyboard(' ');

      await waitFor(() => {
        expect(screen.getByText('Content 2')).toHaveAttribute('data-state', 'active');
      });
    });

    it('handles multiple tabs correctly', () => {
      render(
        <Tabs defaultValue="tab1">
          <TabsList>
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
            <TabsTrigger value="tab2">Tab 2</TabsTrigger>
            <TabsTrigger value="tab3">Tab 3</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">Content 1</TabsContent>
          <TabsContent value="tab2">Content 2</TabsContent>
          <TabsContent value="tab3">Content 3</TabsContent>
        </Tabs>
      );

      expect(screen.getByText('Tab 1')).toBeInTheDocument();
      expect(screen.getByText('Tab 2')).toBeInTheDocument();
      expect(screen.getByText('Tab 3')).toBeInTheDocument();
      expect(screen.getByText('Content 1')).toBeInTheDocument();
      // Only active tabpanel is rendered, but all tabs are accessible
      expect(screen.getAllByRole('tab')).toHaveLength(3);
      expect(screen.getAllByRole('tabpanel')).toHaveLength(1);
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA labels and roles', () => {
      render(
        <Tabs defaultValue="tab1">
          <TabsList>
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
            <TabsTrigger value="tab2">Tab 2</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">Content 1</TabsContent>
          <TabsContent value="tab2">Content 2</TabsContent>
        </Tabs>
      );

      const list = screen.getByRole('tablist');
      expect(list).toBeInTheDocument();

      const tabs = screen.getAllByRole('tab');
      expect(tabs).toHaveLength(2);

      const tabpanels = screen.getAllByRole('tabpanel');
      expect(tabpanels).toHaveLength(1); // Only active tabpanel is rendered
    });

    it('supports screen readers', () => {
      render(
        <Tabs defaultValue="tab1">
          <TabsList>
            <TabsTrigger value="tab1" aria-label="First tab">Tab 1</TabsTrigger>
            <TabsTrigger value="tab2">Tab 2</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">Content 1</TabsContent>
          <TabsContent value="tab2">Content 2</TabsContent>
        </Tabs>
      );

      const tab = screen.getByLabelText('First tab');
      expect(tab).toBeInTheDocument();
    });

    it('has proper tab associations', () => {
      render(
        <Tabs defaultValue="tab1">
          <TabsList>
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
            <TabsTrigger value="tab2">Tab 2</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">Content 1</TabsContent>
          <TabsContent value="tab2">Content 2</TabsContent>
        </Tabs>
      );

      const tab1 = screen.getByRole('tab', { name: 'Tab 1' });
      const panel1 = screen.getByRole('tabpanel');

      // Radix UI generates its own IDs, so we just verify the associations exist
      expect(tab1).toHaveAttribute('aria-controls');
      expect(panel1).toHaveAttribute('aria-labelledby');
    });
  });

  describe('Styling and Visual', () => {
    it('applies correct default styles', () => {
      render(
        <Tabs defaultValue="tab1">
          <TabsList>
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">Content 1</TabsContent>
        </Tabs>
      );

      const list = screen.getByRole('tablist');
      expect(list).toHaveClass('inline-flex', 'h-10', 'items-center', 'justify-center', 'rounded-md', 'bg-muted', 'p-1', 'text-muted-foreground');

      const trigger = screen.getByRole('tab');
      expect(trigger).toHaveClass('inline-flex', 'items-center', 'justify-center', 'whitespace-nowrap', 'rounded-sm', 'px-3', 'py-1.5', 'text-sm', 'font-medium', 'ring-offset-background', 'transition-all', 'focus-visible:outline-none', 'focus-visible:ring-2', 'focus-visible:ring-ring', 'focus-visible:ring-offset-2', 'disabled:pointer-events-none', 'disabled:opacity-50');

      const content = screen.getByText('Content 1');
      expect(content).toHaveClass('mt-2', 'ring-offset-background', 'focus-visible:outline-none', 'focus-visible:ring-2', 'focus-visible:ring-ring', 'focus-visible:ring-offset-2');
    });

    it('handles long tab names gracefully', () => {
      const longTabName = 'This is a very long tab name that should wrap properly';
      render(
        <Tabs defaultValue="tab1">
          <TabsList>
            <TabsTrigger value="tab1">{longTabName}</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">Content 1</TabsContent>
        </Tabs>
      );

      expect(screen.getByText(longTabName)).toBeInTheDocument();
    });
  });
});

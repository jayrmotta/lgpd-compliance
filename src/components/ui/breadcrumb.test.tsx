import React from 'react';
import { render, screen } from '@testing-library/react';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from './breadcrumb';

describe('Breadcrumb', () => {

  describe('BreadcrumbList', () => {
    it('renders with children', () => {
      render(
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>Item 1</BreadcrumbItem>
            <BreadcrumbItem>Item 2</BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      );

      expect(screen.getByText('Item 1')).toBeInTheDocument();
      expect(screen.getByText('Item 2')).toBeInTheDocument();
    });

    it('applies correct CSS classes', () => {
      render(
        <Breadcrumb>
          <BreadcrumbList className="custom-class">
            <BreadcrumbItem>Item</BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      );

      const list = screen.getByRole('list');
      expect(list).toHaveClass('custom-class');
    });

    it('has correct ARIA attributes', () => {
      render(
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>Item</BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      );

      const nav = screen.getByRole('navigation');
      expect(nav).toHaveAttribute('aria-label', 'breadcrumb');
    });
  });

  describe('BreadcrumbItem', () => {
    it('renders with children', () => {
      render(
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>Test Item</BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      );

      expect(screen.getByText('Test Item')).toBeInTheDocument();
    });

    it('applies custom className', () => {
      render(
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className="custom-item-class">Item</BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      );

      const item = screen.getByText('Item').closest('li');
      expect(item).toHaveClass('custom-item-class');
    });
  });

  describe('BreadcrumbLink', () => {
    it('renders as a link with href', () => {
      render(
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/test">Link</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      );

      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('href', '/test');
      expect(link).toHaveTextContent('Link');
    });

    it('applies custom className', () => {
      render(
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/test" className="custom-link-class">Link</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      );

      const link = screen.getByRole('link');
      expect(link).toHaveClass('custom-link-class');
    });

    it('renders with external link attributes', () => {
      render(
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="https://example.com" external>External Link</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      );

      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    });

    it('applies hover styles', () => {
      render(
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/test">Link</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      );

      const link = screen.getByRole('link');
      expect(link).toHaveClass('hover:text-foreground');
    });
  });

  describe('BreadcrumbPage', () => {
    it('renders with children', () => {
      render(
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage>Current Page</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      );

      expect(screen.getByText('Current Page')).toBeInTheDocument();
    });

    it('applies custom className', () => {
      render(
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage className="custom-page-class">Current Page</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      );

      const page = screen.getByText('Current Page');
      expect(page).toHaveClass('custom-page-class');
    });

    it('has correct ARIA attributes', () => {
      render(
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage>Current Page</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      );

      const page = screen.getByText('Current Page');
      expect(page).toHaveAttribute('aria-current', 'page');
    });
  });

  describe('BreadcrumbSeparator', () => {
    it('renders default separator', () => {
      render(
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>Item 1</BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>Item 2</BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      );

      const separator = screen.getByText('/');
      expect(separator).toBeInTheDocument();
    });

    it('renders custom separator', () => {
      render(
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>Item 1</BreadcrumbItem>
            <BreadcrumbSeparator>→</BreadcrumbSeparator>
            <BreadcrumbItem>Item 2</BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      );

      const separator = screen.getByText('→');
      expect(separator).toBeInTheDocument();
    });

    it('applies custom className', () => {
      render(
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>Item 1</BreadcrumbItem>
            <BreadcrumbSeparator className="custom-separator-class">→</BreadcrumbSeparator>
            <BreadcrumbItem>Item 2</BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      );

      const separator = screen.getByText('→');
      expect(separator).toHaveClass('custom-separator-class');
    });
  });

  describe('Integration Tests', () => {
    it('renders complete breadcrumb navigation', () => {
      render(
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/products">Products</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Current Product</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      );

      expect(screen.getByText('Home')).toBeInTheDocument();
      expect(screen.getByText('Products')).toBeInTheDocument();
      expect(screen.getByText('Current Product')).toBeInTheDocument();
      expect(screen.getAllByText('/')).toHaveLength(2);
    });

    it('handles multiple separators correctly', () => {
      render(
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/category">Category</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/category/subcategory">Subcategory</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Page</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      );

      expect(screen.getAllByText('/')).toHaveLength(3);
      expect(screen.getByText('Home')).toBeInTheDocument();
      expect(screen.getByText('Category')).toBeInTheDocument();
      expect(screen.getByText('Subcategory')).toBeInTheDocument();
      expect(screen.getByText('Page')).toBeInTheDocument();
    });

    it('handles empty breadcrumb gracefully', () => {
      render(
        <Breadcrumb>
          <BreadcrumbList>
          </BreadcrumbList>
        </Breadcrumb>
      );

      const list = screen.getByRole('list');
      expect(list).toBeInTheDocument();
      expect(list.children).toHaveLength(0);
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA labels and roles', () => {
      render(
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Current Page</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      );

      const nav = screen.getByRole('navigation');
      expect(nav).toHaveAttribute('aria-label', 'breadcrumb');

      const page = screen.getByText('Current Page');
      expect(page).toHaveAttribute('aria-current', 'page');
    });

    it('supports screen readers', () => {
      render(
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/" aria-label="Go to home page">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Current Page</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      );

      const link = screen.getByLabelText('Go to home page');
      expect(link).toBeInTheDocument();
    });

    it('has proper semantic structure', () => {
      render(
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Current Page</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      );

      const list = screen.getByRole('list');
      const items = list.querySelectorAll('li');
      expect(items).toHaveLength(3); // 2 items + 1 separator
    });
  });

  describe('Styling and Visual', () => {
    it('applies correct default styles', () => {
      render(
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Current Page</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      );

      const list = screen.getByRole('list');
      expect(list).toHaveClass('flex', 'flex-wrap', 'items-center', 'break-words', 'text-sm', 'text-muted-foreground');

      const link = screen.getAllByRole('link')[0];
      expect(link).toHaveClass('transition-colors', 'hover:text-foreground');

      const page = screen.getByText('Current Page');
      expect(page).toHaveClass('font-normal', 'text-foreground');
    });

    it('handles long text gracefully', () => {
      const longText = 'This is a very long breadcrumb item that should wrap properly';
      render(
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">{longText}</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      );

      expect(screen.getByText(longText)).toBeInTheDocument();
    });
  });
});

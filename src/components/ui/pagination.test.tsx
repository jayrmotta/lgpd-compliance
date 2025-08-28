import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from './pagination';

describe('Pagination Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Pagination Container', () => {
    it('should render pagination with proper accessibility attributes', () => {
      render(
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationLink href="#">1</PaginationLink>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      );
      
      const pagination = screen.getByRole('navigation');
      expect(pagination).toBeInTheDocument();
    });

    it('should render with custom className', () => {
      render(
        <Pagination className="custom-pagination">
          <PaginationContent>
            <PaginationItem>
              <PaginationLink href="#">1</PaginationLink>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      );
      
      const pagination = screen.getByRole('navigation');
      expect(pagination).toHaveClass('custom-pagination');
    });
  });

  describe('Pagination Content', () => {
    it('should render pagination content with proper structure', () => {
      render(
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationLink href="#">1</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">2</PaginationLink>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      );
      
      const list = screen.getByRole('list');
      expect(list).toBeInTheDocument();
      expect(screen.getByText('1')).toBeInTheDocument();
      expect(screen.getByText('2')).toBeInTheDocument();
    });

    it('should render content with custom className', () => {
      render(
        <Pagination>
          <PaginationContent className="custom-content">
            <PaginationItem>
              <PaginationLink href="#">1</PaginationLink>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      );
      
      const list = screen.getByRole('list');
      expect(list).toHaveClass('custom-content');
    });
  });

  describe('Pagination Item', () => {
    it('should render pagination item with proper structure', () => {
      render(
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationLink href="#">1</PaginationLink>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      );
      
      const item = screen.getByRole('listitem');
      expect(item).toBeInTheDocument();
      expect(screen.getByText('1')).toBeInTheDocument();
    });

    it('should render item with custom className', () => {
      render(
        <Pagination>
          <PaginationContent>
            <PaginationItem className="custom-item">
              <PaginationLink href="#">1</PaginationLink>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      );
      
      const item = screen.getByRole('listitem');
      expect(item).toHaveClass('custom-item');
    });
  });

  describe('Pagination Link', () => {
    it('should render pagination link with proper attributes', () => {
      render(
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationLink href="/page/1">1</PaginationLink>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      );
      
      const link = screen.getByRole('link');
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute('href', '/page/1');
      expect(link).toHaveTextContent('1');
    });

    it('should render link with custom className', () => {
      render(
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationLink href="#" className="custom-link">1</PaginationLink>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      );
      
      const link = screen.getByRole('link');
      expect(link).toHaveClass('custom-link');
    });

    it('should render active link with proper styling', () => {
      render(
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationLink href="#" isActive>1</PaginationLink>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      );
      
      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('aria-current', 'page');
    });

    it('should handle link click events', async () => {
      const user = userEvent.setup();
      const onClick = jest.fn();
      
      render(
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationLink href="#" onClick={onClick}>1</PaginationLink>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      );
      
      const link = screen.getByRole('link');
      await user.click(link);
      
      expect(onClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('Pagination Previous', () => {
    it('should render previous button with proper accessibility', () => {
      render(
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      );
      
      const previous = screen.getByRole('link', { name: /previous/i });
      expect(previous).toBeInTheDocument();
    });

    it('should render previous button with custom text', () => {
      render(
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" aria-label="Go to previous page" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      );
      
      const previous = screen.getByRole('link', { name: /go to previous page/i });
      expect(previous).toBeInTheDocument();
    });

    it('should render previous button with custom className', () => {
      render(
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" className="custom-previous" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      );
      
      const previous = screen.getByRole('link', { name: /previous/i });
      expect(previous).toHaveClass('custom-previous');
    });

    it('should handle previous button click events', async () => {
      const user = userEvent.setup();
      const onClick = jest.fn();
      
      render(
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" onClick={onClick} />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      );
      
      const previous = screen.getByRole('link', { name: /previous/i });
      await user.click(previous);
      
      expect(onClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('Pagination Next', () => {
    it('should render next button with proper accessibility', () => {
      render(
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationNext href="#" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      );
      
      const next = screen.getByRole('link', { name: /next/i });
      expect(next).toBeInTheDocument();
    });

    it('should render next button with custom text', () => {
      render(
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationNext href="#" aria-label="Go to next page" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      );
      
      const next = screen.getByRole('link', { name: /go to next page/i });
      expect(next).toBeInTheDocument();
    });

    it('should render next button with custom className', () => {
      render(
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationNext href="#" className="custom-next" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      );
      
      const next = screen.getByRole('link', { name: /next/i });
      expect(next).toHaveClass('custom-next');
    });

    it('should handle next button click events', async () => {
      const user = userEvent.setup();
      const onClick = jest.fn();
      
      render(
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationNext href="#" onClick={onClick} />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      );
      
      const next = screen.getByRole('link', { name: /next/i });
      await user.click(next);
      
      expect(onClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('Pagination Ellipsis', () => {
    it('should render ellipsis with proper accessibility', () => {
      render(
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      );
      
      const ellipsis = screen.getByText('More pages');
      expect(ellipsis).toBeInTheDocument();
    });

    it('should render ellipsis with custom className', () => {
      render(
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationEllipsis className="custom-ellipsis" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      );
      
      const ellipsis = screen.getByText('More pages').parentElement;
      expect(ellipsis).toHaveClass('custom-ellipsis');
    });
  });

  describe('Complex Pagination Structure', () => {
    it('should render complete pagination with multiple pages', () => {
      render(
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#" isActive>1</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">2</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">3</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">10</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="#" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      );
      
      expect(screen.getByRole('link', { name: /previous/i })).toBeInTheDocument();
      expect(screen.getByText('1')).toBeInTheDocument();
      expect(screen.getByText('2')).toBeInTheDocument();
      expect(screen.getByText('3')).toBeInTheDocument();
      expect(screen.getByText('More pages')).toBeInTheDocument();
      expect(screen.getByText('10')).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /next/i })).toBeInTheDocument();
    });

    it('should render pagination with disabled previous button', () => {
      render(
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" aria-disabled="true" />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#" isActive>1</PaginationLink>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      );
      
      const previous = screen.getByRole('link', { name: /previous/i });
      expect(previous).toHaveAttribute('aria-disabled', 'true');
    });

    it('should render pagination with disabled next button', () => {
      render(
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationLink href="#" isActive>1</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="#" aria-disabled="true" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      );
      
      const next = screen.getByRole('link', { name: /next/i });
      expect(next).toHaveAttribute('aria-disabled', 'true');
    });
  });

  describe('Accessibility', () => {
    it('should have proper navigation structure for screen readers', () => {
      render(
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#" isActive>1</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">2</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="#" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      );
      
      const navigation = screen.getByRole('navigation');
      const list = screen.getByRole('list');
      const listItems = screen.getAllByRole('listitem');
      const links = screen.getAllByRole('link');
      
      expect(navigation).toBeInTheDocument();
      expect(list).toBeInTheDocument();
      expect(listItems).toHaveLength(4);
      expect(links).toHaveLength(4);
    });

    it('should support keyboard navigation', async () => {
      const user = userEvent.setup();
      const onClick = jest.fn();
      
      render(
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationLink href="#" onClick={onClick}>1</PaginationLink>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      );
      
      await user.tab();
      await user.keyboard('{Enter}');
      
      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('should have proper aria labels for navigation buttons', () => {
      render(
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" aria-label="Previous page" />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#" isActive>1</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="#" aria-label="Next page" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      );
      
      const previous = screen.getByRole('link', { name: /previous page/i });
      const next = screen.getByRole('link', { name: /next page/i });
      
      expect(previous).toBeInTheDocument();
      expect(next).toBeInTheDocument();
    });
  });
});

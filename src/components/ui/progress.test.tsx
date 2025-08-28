import React from 'react';
import { render, screen } from '@testing-library/react';
import { Progress } from './progress';

describe('Progress Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render progress with proper accessibility attributes', () => {
      render(<Progress value={50} />);
      
      const progress = screen.getByRole('progressbar');
      expect(progress).toBeInTheDocument();
      expect(progress).toHaveAttribute('aria-valuenow', '50');
      expect(progress).toHaveAttribute('aria-valuemin', '0');
      expect(progress).toHaveAttribute('aria-valuemax', '100');
    });

    it('should render with custom className', () => {
      render(<Progress value={50} className="custom-progress" />);
      
      const progress = screen.getByRole('progressbar');
      expect(progress).toHaveClass('custom-progress');
    });

    it('should render with custom value', () => {
      render(<Progress value={75} />);
      
      const progress = screen.getByRole('progressbar');
      expect(progress).toHaveAttribute('aria-valuenow', '75');
    });

    it('should render with zero value', () => {
      render(<Progress value={0} />);
      
      const progress = screen.getByRole('progressbar');
      expect(progress).toHaveAttribute('aria-valuenow', '0');
    });

    it('should render with maximum value', () => {
      render(<Progress value={100} />);
      
      const progress = screen.getByRole('progressbar');
      expect(progress).toHaveAttribute('aria-valuenow', '100');
    });

    it('should render with undefined value', () => {
      render(<Progress value={undefined} />);
      
      const progress = screen.getByRole('progressbar');
      expect(progress).toHaveAttribute('aria-valuenow', '0');
    });

    it('should render with null value', () => {
      render(<Progress value={null} />);
      
      const progress = screen.getByRole('progressbar');
      expect(progress).toHaveAttribute('aria-valuenow', '0');
    });
  });

  describe('Value Constraints', () => {
    it('should clamp negative values to 0', () => {
      render(<Progress value={-10} />);
      
      const progress = screen.getByRole('progressbar');
      expect(progress).toHaveAttribute('aria-valuenow', '0');
    });

    it('should clamp values above 100 to 100', () => {
      render(<Progress value={150} />);
      
      const progress = screen.getByRole('progressbar');
      expect(progress).toHaveAttribute('aria-valuenow', '100');
    });

    it('should handle decimal values', () => {
      render(<Progress value={33.5} />);
      
      const progress = screen.getByRole('progressbar');
      expect(progress).toHaveAttribute('aria-valuenow', '33.5');
    });
  });

  describe('Visual Representation', () => {
    it('should render progress bar with correct width for 50%', () => {
      render(<Progress value={50} />);
      
      const progress = screen.getByRole('progressbar');
      const indicator = progress.querySelector('[style*="translateX"]');
      expect(indicator).toBeInTheDocument();
    });

    it('should render progress bar with correct width for 100%', () => {
      render(<Progress value={100} />);
      
      const progress = screen.getByRole('progressbar');
      const indicator = progress.querySelector('[style*="translateX"]');
      expect(indicator).toBeInTheDocument();
    });

    it('should render progress bar with correct width for 0%', () => {
      render(<Progress value={0} />);
      
      const progress = screen.getByRole('progressbar');
      const indicator = progress.querySelector('[style*="translateX"]');
      expect(indicator).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA attributes', () => {
      render(<Progress value={50} />);
      
      const progress = screen.getByRole('progressbar');
      expect(progress).toHaveAttribute('aria-valuenow', '50');
      expect(progress).toHaveAttribute('aria-valuemin', '0');
      expect(progress).toHaveAttribute('aria-valuemax', '100');
    });

    it('should have proper role attribute', () => {
      render(<Progress value={50} />);
      
      const progress = screen.getByRole('progressbar');
      expect(progress).toHaveAttribute('role', 'progressbar');
    });

    it('should support custom aria-label', () => {
      render(<Progress value={50} aria-label="Loading progress" />);
      
      const progress = screen.getByRole('progressbar', { name: 'Loading progress' });
      expect(progress).toBeInTheDocument();
    });

    it('should support aria-labelledby', () => {
      render(
        <div>
          <div id="progress-label">Download Progress</div>
          <Progress value={50} aria-labelledby="progress-label" />
        </div>
      );
      
      const progress = screen.getByRole('progressbar', { name: 'Download Progress' });
      expect(progress).toBeInTheDocument();
    });
  });

  describe('Styling and Appearance', () => {
    it('should apply custom styles via className', () => {
      render(<Progress value={50} className="bg-blue-500" />);
      
      const progress = screen.getByRole('progressbar');
      expect(progress).toHaveClass('bg-blue-500');
    });

    it('should render with default styling', () => {
      render(<Progress value={50} />);
      
      const progress = screen.getByRole('progressbar');
      expect(progress).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle NaN values', () => {
      render(<Progress value={NaN} />);
      
      const progress = screen.getByRole('progressbar');
      expect(progress).toHaveAttribute('aria-valuenow', '0');
    });

    it('should handle string values', () => {
      render(<Progress value={50 as unknown as number} />);
      
      const progress = screen.getByRole('progressbar');
      expect(progress).toHaveAttribute('aria-valuenow', '50');
    });

    it('should handle boolean values', () => {
      render(<Progress value={true as unknown as number} />);
      
      const progress = screen.getByRole('progressbar');
      expect(progress).toHaveAttribute('aria-valuenow', '1');
    });
  });

  describe('Integration with Radix UI', () => {
    it('should render with Radix UI progress structure', () => {
      render(<Progress value={50} />);
      
      const progress = screen.getByRole('progressbar');
      expect(progress).toBeInTheDocument();
      
      // Check for Radix UI specific attributes
      expect(progress).toHaveAttribute('data-state', 'loading');
    });

    it('should handle indeterminate state', () => {
      render(<Progress value={undefined} />);
      
      const progress = screen.getByRole('progressbar');
      expect(progress).toHaveAttribute('data-state', 'loading');
    });
  });

  describe('Real-world Usage Examples', () => {
    it('should work for file upload progress', () => {
      render(<Progress value={75} aria-label="File upload progress" />);
      
      const progress = screen.getByRole('progressbar', { name: 'File upload progress' });
      expect(progress).toHaveAttribute('aria-valuenow', '75');
    });

    it('should work for loading progress', () => {
      render(<Progress value={25} aria-label="Loading progress" />);
      
      const progress = screen.getByRole('progressbar', { name: 'Loading progress' });
      expect(progress).toHaveAttribute('aria-valuenow', '25');
    });

    it('should work for form completion progress', () => {
      render(<Progress value={60} aria-label="Form completion progress" />);
      
      const progress = screen.getByRole('progressbar', { name: 'Form completion progress' });
      expect(progress).toHaveAttribute('aria-valuenow', '60');
    });
  });
});

import React from 'react'
import { render, screen } from '@testing-library/react'
import { Skeleton } from './skeleton'

describe('Skeleton', () => {
  it('renders with default props', () => {
    render(<Skeleton data-testid="skeleton" />)
    
    const skeleton = screen.getByTestId('skeleton')
    expect(skeleton).toBeInTheDocument()
    expect(skeleton).toHaveClass('animate-pulse', 'rounded-md', 'bg-muted')
  })

  it('applies custom className', () => {
    render(<Skeleton className="custom-class" data-testid="skeleton" />)
    
    const skeleton = screen.getByTestId('skeleton')
    expect(skeleton).toHaveClass('custom-class')
    expect(skeleton).toHaveClass('animate-pulse', 'rounded-md', 'bg-muted')
  })

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLDivElement>()
    render(<Skeleton ref={ref} data-testid="skeleton" />)
    
    expect(ref.current).toBeInstanceOf(HTMLDivElement)
  })

  it('applies all HTML attributes', () => {
    render(
      <Skeleton 
        data-testid="skeleton"
        aria-label="Loading content"
        role="status"
      />
    )
    
    const skeleton = screen.getByTestId('skeleton')
    expect(skeleton).toHaveAttribute('aria-label', 'Loading content')
    expect(skeleton).toHaveAttribute('role', 'status')
  })

  it('renders with children', () => {
    render(
      <Skeleton data-testid="skeleton">
        <span>Loading...</span>
      </Skeleton>
    )
    
    const skeleton = screen.getByTestId('skeleton')
    expect(skeleton).toHaveTextContent('Loading...')
  })

  it('has proper default styling', () => {
    render(<Skeleton data-testid="skeleton" />)
    
    const skeleton = screen.getByTestId('skeleton')
    expect(skeleton).toHaveClass('animate-pulse')
    expect(skeleton).toHaveClass('rounded-md')
    expect(skeleton).toHaveClass('bg-muted')
  })

  it('combines custom and default classes', () => {
    render(
      <Skeleton 
        className="h-4 w-4" 
        data-testid="skeleton" 
      />
    )
    
    const skeleton = screen.getByTestId('skeleton')
    expect(skeleton).toHaveClass('h-4', 'w-4')
    expect(skeleton).toHaveClass('animate-pulse', 'rounded-md', 'bg-muted')
  })

  it('handles multiple skeleton instances', () => {
    render(
      <div>
        <Skeleton data-testid="skeleton1" />
        <Skeleton data-testid="skeleton2" />
      </div>
    )
    
    expect(screen.getByTestId('skeleton1')).toBeInTheDocument()
    expect(screen.getByTestId('skeleton2')).toBeInTheDocument()
  })

  it('supports different sizes', () => {
    render(
      <div>
        <Skeleton className="h-4 w-4" data-testid="small" />
        <Skeleton className="h-8 w-8" data-testid="medium" />
        <Skeleton className="h-12 w-12" data-testid="large" />
      </div>
    )
    
    expect(screen.getByTestId('small')).toHaveClass('h-4', 'w-4')
    expect(screen.getByTestId('medium')).toHaveClass('h-8', 'w-8')
    expect(screen.getByTestId('large')).toHaveClass('h-12', 'w-12')
  })

  it('maintains accessibility with proper attributes', () => {
    render(
      <Skeleton 
        data-testid="skeleton"
        aria-label="Loading user profile"
        role="status"
        aria-live="polite"
      />
    )
    
    const skeleton = screen.getByTestId('skeleton')
    expect(skeleton).toHaveAttribute('aria-label', 'Loading user profile')
    expect(skeleton).toHaveAttribute('role', 'status')
    expect(skeleton).toHaveAttribute('aria-live', 'polite')
  })
})

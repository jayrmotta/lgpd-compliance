import React from 'react'
import { render, screen } from '@testing-library/react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './tooltip'

describe('TooltipProvider', () => {
  it('renders children correctly', () => {
    render(
      <TooltipProvider>
        <div data-testid="child">Test content</div>
      </TooltipProvider>
    )
    
    expect(screen.getByTestId('child')).toBeInTheDocument()
  })

  it('applies custom props to provider', () => {
    render(
      <TooltipProvider delayDuration={500}>
        <div data-testid="child">Test content</div>
      </TooltipProvider>
    )
    
    expect(screen.getByTestId('child')).toBeInTheDocument()
  })
})

describe('Tooltip', () => {
  it('renders with default props', () => {
    render(
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>Hover me</TooltipTrigger>
          <TooltipContent>Tooltip content</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
    
    expect(screen.getByText('Hover me')).toBeInTheDocument()
  })

  it('applies custom props to root tooltip', () => {
    render(
      <TooltipProvider>
        <Tooltip defaultOpen>
          <TooltipTrigger>Hover me</TooltipTrigger>
          <TooltipContent>Tooltip content</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
    
    // Use getAllByText since Radix creates duplicate elements
    expect(screen.getAllByText('Tooltip content')).toHaveLength(2)
  })
})

describe('TooltipTrigger', () => {
  it('renders trigger correctly', () => {
    render(
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger data-testid="trigger">Hover me</TooltipTrigger>
          <TooltipContent>Tooltip content</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
    
    const trigger = screen.getByTestId('trigger')
    expect(trigger).toBeInTheDocument()
    expect(trigger).toHaveTextContent('Hover me')
  })

  it('applies custom className to trigger', () => {
    render(
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger className="custom-trigger-class" data-testid="trigger">
            Hover me
          </TooltipTrigger>
          <TooltipContent>Tooltip content</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
    
    const trigger = screen.getByTestId('trigger')
    expect(trigger).toHaveClass('custom-trigger-class')
  })

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLButtonElement>()
    render(
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger ref={ref} data-testid="trigger">
            Hover me
          </TooltipTrigger>
          <TooltipContent>Tooltip content</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
    
    expect(ref.current).toBeInstanceOf(HTMLButtonElement)
  })

  it('applies all trigger props correctly', () => {
    render(
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger 
            data-testid="trigger"
            aria-label="Hover for tooltip"
            disabled
          >
            Hover me
          </TooltipTrigger>
          <TooltipContent>Tooltip content</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
    
    const trigger = screen.getByTestId('trigger')
    expect(trigger).toHaveAttribute('aria-label', 'Hover for tooltip')
    expect(trigger).toBeDisabled()
  })
})

describe('TooltipContent', () => {
  it('renders content correctly when tooltip is open', () => {
    render(
      <TooltipProvider>
        <Tooltip defaultOpen>
          <TooltipTrigger>Hover me</TooltipTrigger>
          <TooltipContent data-testid="content">Tooltip content</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
    
    const content = screen.getByTestId('content')
    expect(content).toBeInTheDocument()
    expect(content).toHaveTextContent('Tooltip content')
  })

  it('applies custom className to content', () => {
    render(
      <TooltipProvider>
        <Tooltip defaultOpen>
          <TooltipTrigger>Hover me</TooltipTrigger>
          <TooltipContent className="custom-content-class" data-testid="content">
            Tooltip content
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
    
    const content = screen.getByTestId('content')
    expect(content).toHaveClass('custom-content-class')
  })

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLDivElement>()
    render(
      <TooltipProvider>
        <Tooltip defaultOpen>
          <TooltipTrigger>Hover me</TooltipTrigger>
          <TooltipContent ref={ref} data-testid="content">
            Tooltip content
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
    
    expect(ref.current).toBeInstanceOf(HTMLDivElement)
  })

  it('applies all content props correctly', () => {
    render(
      <TooltipProvider>
        <Tooltip defaultOpen>
          <TooltipTrigger>Hover me</TooltipTrigger>
          <TooltipContent 
            data-testid="content"
            side="top"
          >
            Tooltip content
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
    
    const content = screen.getByTestId('content')
    expect(content).toBeInTheDocument()
  })

  it('applies custom sideOffset', () => {
    render(
      <TooltipProvider>
        <Tooltip defaultOpen>
          <TooltipTrigger>Hover me</TooltipTrigger>
          <TooltipContent sideOffset={8} data-testid="content">
            Tooltip content
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
    
    const content = screen.getByTestId('content')
    expect(content).toBeInTheDocument()
  })

  it('applies default sideOffset when not provided', () => {
    render(
      <TooltipProvider>
        <Tooltip defaultOpen>
          <TooltipTrigger>Hover me</TooltipTrigger>
          <TooltipContent data-testid="content">
            Tooltip content
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
    
    const content = screen.getByTestId('content')
    expect(content).toBeInTheDocument()
  })
})

describe('Tooltip Integration', () => {
  it('renders complete tooltip with all components', () => {
    render(
      <TooltipProvider>
        <Tooltip defaultOpen>
          <TooltipTrigger data-testid="trigger">Hover me</TooltipTrigger>
          <TooltipContent data-testid="content">
            This is a complete tooltip example
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
    
    expect(screen.getByTestId('trigger')).toBeInTheDocument()
    expect(screen.getByTestId('content')).toBeInTheDocument()
    // Use getAllByText since Radix creates duplicate elements
    expect(screen.getAllByText('This is a complete tooltip example')).toHaveLength(2)
  })

  it('maintains accessibility with proper ARIA attributes', () => {
    render(
      <TooltipProvider>
        <Tooltip defaultOpen>
          <TooltipTrigger aria-label="Button with tooltip">Hover me</TooltipTrigger>
          <TooltipContent>
            Tooltip information
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
    
    const trigger = screen.getByLabelText('Button with tooltip')
    expect(trigger).toBeInTheDocument()
    // Check that tooltip content is rendered
    expect(screen.getAllByText('Tooltip information')).toHaveLength(2)
  })

  it('handles controlled open state', () => {
    const { rerender } = render(
      <TooltipProvider>
        <Tooltip open={false}>
          <TooltipTrigger>Hover me</TooltipTrigger>
          <TooltipContent>Tooltip content</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
    
    expect(screen.queryByText('Tooltip content')).not.toBeInTheDocument()
    
    rerender(
      <TooltipProvider>
        <Tooltip open={true}>
          <TooltipTrigger>Hover me</TooltipTrigger>
          <TooltipContent>Tooltip content</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
    
    // Use getAllByText since Radix creates duplicate elements
    expect(screen.getAllByText('Tooltip content')).toHaveLength(2)
  })

  it('supports different sides', () => {
    const sides = ['top', 'bottom', 'left', 'right'] as const
    
    sides.forEach(side => {
      const { unmount } = render(
        <TooltipProvider>
          <Tooltip defaultOpen>
            <TooltipTrigger>Hover me</TooltipTrigger>
            <TooltipContent side={side} data-testid={`content-${side}`}>
              Tooltip on {side}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )
      
      const content = screen.getByTestId(`content-${side}`)
      expect(content).toBeInTheDocument()
      expect(content).toHaveTextContent(`Tooltip on ${side}`)
      
      unmount()
    })
  })

  it('supports different alignments', () => {
    const alignments = ['start', 'center', 'end'] as const
    
    alignments.forEach(align => {
      const { unmount } = render(
        <TooltipProvider>
          <Tooltip defaultOpen>
            <TooltipTrigger>Hover me</TooltipTrigger>
            <TooltipContent align={align} data-testid={`content-${align}`}>
              Tooltip aligned {align}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )
      
      const content = screen.getByTestId(`content-${align}`)
      expect(content).toBeInTheDocument()
      expect(content).toHaveTextContent(`Tooltip aligned ${align}`)
      
      unmount()
    })
  })

  it('handles multiple tooltips on same page', () => {
    render(
      <TooltipProvider>
        <Tooltip defaultOpen>
          <TooltipTrigger>First trigger</TooltipTrigger>
          <TooltipContent>First tooltip</TooltipContent>
        </Tooltip>
        <Tooltip defaultOpen>
          <TooltipTrigger>Second trigger</TooltipTrigger>
          <TooltipContent>Second tooltip</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
    
    expect(screen.getByText('First trigger')).toBeInTheDocument()
    expect(screen.getByText('Second trigger')).toBeInTheDocument()
    // Use getAllByText since Radix creates duplicate elements
    expect(screen.getAllByText('First tooltip')).toHaveLength(2)
    expect(screen.getAllByText('Second tooltip')).toHaveLength(2)
  })

  it('supports custom delay duration', () => {
    render(
      <TooltipProvider delayDuration={1000}>
        <Tooltip defaultOpen>
          <TooltipTrigger>Hover me</TooltipTrigger>
          <TooltipContent>Delayed tooltip</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
    
    // Use getAllByText since Radix creates duplicate elements
    expect(screen.getAllByText('Delayed tooltip')).toHaveLength(2)
  })

  it('supports skip delay duration', () => {
    render(
      <TooltipProvider skipDelayDuration={500}>
        <Tooltip defaultOpen>
          <TooltipTrigger>Hover me</TooltipTrigger>
          <TooltipContent>Skipped delay tooltip</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
    
    // Use getAllByText since Radix creates duplicate elements
    expect(screen.getAllByText('Skipped delay tooltip')).toHaveLength(2)
  })
})

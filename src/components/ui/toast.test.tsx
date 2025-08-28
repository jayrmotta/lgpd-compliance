import React from 'react'
import { render, screen } from '@testing-library/react'
import {
  Toast,
  ToastAction,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from './toast'

describe('ToastProvider', () => {
  it('renders children correctly', () => {
    render(
      <ToastProvider>
        <div data-testid="child">Test content</div>
      </ToastProvider>
    )
    
    expect(screen.getByTestId('child')).toBeInTheDocument()
  })
})

describe('ToastViewport', () => {
  it('renders with default props', () => {
    render(
      <ToastProvider>
        <ToastViewport data-testid="viewport" />
      </ToastProvider>
    )
    
    const viewport = screen.getByTestId('viewport')
    expect(viewport).toBeInTheDocument()
  })

  it('applies custom className', () => {
    render(
      <ToastProvider>
        <ToastViewport className="custom-viewport-class" data-testid="viewport" />
      </ToastProvider>
    )
    
    const viewport = screen.getByTestId('viewport')
    expect(viewport).toHaveClass('custom-viewport-class')
  })

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLOListElement>()
    render(
      <ToastProvider>
        <ToastViewport ref={ref} data-testid="viewport" />
      </ToastProvider>
    )
    
    expect(ref.current).toBeInstanceOf(HTMLOListElement)
  })

  it('applies all viewport props correctly', () => {
    render(
      <ToastProvider>
        <ToastViewport 
          data-testid="viewport"
          aria-label="Toast notifications"
        />
      </ToastProvider>
    )
    
    const viewport = screen.getByTestId('viewport')
    expect(viewport).toHaveAttribute('aria-label', 'Toast notifications')
  })
})

describe('Toast', () => {
  it('renders with default variant', () => {
    render(
      <ToastProvider>
        <ToastViewport />
        <Toast data-testid="toast">
          <ToastTitle>Toast Title</ToastTitle>
          <ToastDescription>Toast description</ToastDescription>
        </Toast>
      </ToastProvider>
    )
    
    const toast = screen.getByTestId('toast')
    expect(toast).toBeInTheDocument()
    expect(toast).toHaveClass('border', 'bg-background', 'text-foreground')
  })

  it('renders with destructive variant', () => {
    render(
      <ToastProvider>
        <ToastViewport />
        <Toast variant="destructive" data-testid="toast">
          <ToastTitle>Error Toast</ToastTitle>
          <ToastDescription>Something went wrong</ToastDescription>
        </Toast>
      </ToastProvider>
    )
    
    const toast = screen.getByTestId('toast')
    expect(toast).toHaveClass('destructive', 'border-destructive', 'bg-destructive', 'text-destructive-foreground')
  })

  it('applies custom className', () => {
    render(
      <ToastProvider>
        <ToastViewport />
        <Toast className="custom-toast-class" data-testid="toast">
          <ToastTitle>Toast Title</ToastTitle>
        </Toast>
      </ToastProvider>
    )
    
    const toast = screen.getByTestId('toast')
    expect(toast).toHaveClass('custom-toast-class')
  })

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLLIElement>()
    render(
      <ToastProvider>
        <ToastViewport />
        <Toast ref={ref} data-testid="toast">
          <ToastTitle>Toast Title</ToastTitle>
        </Toast>
      </ToastProvider>
    )
    
    expect(ref.current).toBeInstanceOf(HTMLLIElement)
  })

  it('applies all toast props correctly', () => {
    render(
      <ToastProvider>
        <ToastViewport />
        <Toast 
          data-testid="toast"
          aria-label="Notification"
          duration={5000}
        >
          <ToastTitle>Toast Title</ToastTitle>
        </Toast>
      </ToastProvider>
    )
    
    const toast = screen.getByTestId('toast')
    expect(toast).toHaveAttribute('aria-label', 'Notification')
  })
})

describe('ToastTitle', () => {
  it('renders title text correctly', () => {
    render(
      <ToastProvider>
        <ToastViewport />
        <Toast>
          <ToastTitle>Test Title</ToastTitle>
        </Toast>
      </ToastProvider>
    )
    
    expect(screen.getByText('Test Title')).toBeInTheDocument()
  })

  it('applies custom className', () => {
    render(
      <ToastProvider>
        <ToastViewport />
        <Toast>
          <ToastTitle className="custom-title-class">Test Title</ToastTitle>
        </Toast>
      </ToastProvider>
    )
    
    const title = screen.getByText('Test Title')
    expect(title).toHaveClass('custom-title-class')
  })

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLDivElement>()
    render(
      <ToastProvider>
        <ToastViewport />
        <Toast>
          <ToastTitle ref={ref}>Test Title</ToastTitle>
        </Toast>
      </ToastProvider>
    )
    
    expect(ref.current).toBeInstanceOf(HTMLDivElement)
  })

  it('applies all title props correctly', () => {
    render(
      <ToastProvider>
        <ToastViewport />
        <Toast>
          <ToastTitle 
            data-testid="title"
            aria-label="Toast title"
          >
            Test Title
          </ToastTitle>
        </Toast>
      </ToastProvider>
    )
    
    const title = screen.getByTestId('title')
    expect(title).toHaveAttribute('aria-label', 'Toast title')
  })
})

describe('ToastDescription', () => {
  it('renders description text correctly', () => {
    render(
      <ToastProvider>
        <ToastViewport />
        <Toast>
          <ToastDescription>Test description</ToastDescription>
        </Toast>
      </ToastProvider>
    )
    
    expect(screen.getByText('Test description')).toBeInTheDocument()
  })

  it('applies custom className', () => {
    render(
      <ToastProvider>
        <ToastViewport />
        <Toast>
          <ToastDescription className="custom-description-class">
            Test description
          </ToastDescription>
        </Toast>
      </ToastProvider>
    )
    
    const description = screen.getByText('Test description')
    expect(description).toHaveClass('custom-description-class')
  })

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLDivElement>()
    render(
      <ToastProvider>
        <ToastViewport />
        <Toast>
          <ToastDescription ref={ref}>Test description</ToastDescription>
        </Toast>
      </ToastProvider>
    )
    
    expect(ref.current).toBeInstanceOf(HTMLDivElement)
  })

  it('applies all description props correctly', () => {
    render(
      <ToastProvider>
        <ToastViewport />
        <Toast>
          <ToastDescription 
            data-testid="description"
            aria-label="Toast description"
          >
            Test description
          </ToastDescription>
        </Toast>
      </ToastProvider>
    )
    
    const description = screen.getByTestId('description')
    expect(description).toHaveAttribute('aria-label', 'Toast description')
  })
})

describe('ToastClose', () => {
  it('renders close button correctly', () => {
    render(
      <ToastProvider>
        <ToastViewport />
        <Toast>
          <ToastClose data-testid="close-button" />
        </Toast>
      </ToastProvider>
    )
    
    const closeButton = screen.getByTestId('close-button')
    expect(closeButton).toBeInTheDocument()
  })

  it('applies custom className', () => {
    render(
      <ToastProvider>
        <ToastViewport />
        <Toast>
          <ToastClose className="custom-close-class" data-testid="close-button" />
        </Toast>
      </ToastProvider>
    )
    
    const closeButton = screen.getByTestId('close-button')
    expect(closeButton).toHaveClass('custom-close-class')
  })

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLButtonElement>()
    render(
      <ToastProvider>
        <ToastViewport />
        <Toast>
          <ToastClose ref={ref} data-testid="close-button" />
        </Toast>
      </ToastProvider>
    )
    
    expect(ref.current).toBeInstanceOf(HTMLButtonElement)
  })

  it('applies all close button props correctly', () => {
    render(
      <ToastProvider>
        <ToastViewport />
        <Toast>
          <ToastClose 
            data-testid="close-button"
            aria-label="Close notification"
          />
        </Toast>
      </ToastProvider>
    )
    
    const closeButton = screen.getByTestId('close-button')
    expect(closeButton).toHaveAttribute('aria-label', 'Close notification')
  })

  it('has correct toast-close attribute', () => {
    render(
      <ToastProvider>
        <ToastViewport />
        <Toast>
          <ToastClose data-testid="close-button" />
        </Toast>
      </ToastProvider>
    )
    
    const closeButton = screen.getByTestId('close-button')
    expect(closeButton).toHaveAttribute('toast-close', '')
  })
})

describe('ToastAction', () => {
  it('renders action button correctly', () => {
    render(
      <ToastProvider>
        <ToastViewport />
        <Toast>
          <ToastAction altText="Perform action" data-testid="action-button">
            Action
          </ToastAction>
        </Toast>
      </ToastProvider>
    )
    
    const actionButton = screen.getByTestId('action-button')
    expect(actionButton).toBeInTheDocument()
    expect(actionButton).toHaveTextContent('Action')
  })

  it('applies custom className', () => {
    render(
      <ToastProvider>
        <ToastViewport />
        <Toast>
          <ToastAction altText="Perform action" className="custom-action-class" data-testid="action-button">
            Action
          </ToastAction>
        </Toast>
      </ToastProvider>
    )
    
    const actionButton = screen.getByTestId('action-button')
    expect(actionButton).toHaveClass('custom-action-class')
  })

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLButtonElement>()
    render(
      <ToastProvider>
        <ToastViewport />
        <Toast>
          <ToastAction altText="Perform action" ref={ref} data-testid="action-button">
            Action
          </ToastAction>
        </Toast>
      </ToastProvider>
    )
    
    expect(ref.current).toBeInstanceOf(HTMLButtonElement)
  })

  it('applies all action button props correctly', () => {
    render(
      <ToastProvider>
        <ToastViewport />
        <Toast>
          <ToastAction 
            altText="Perform action"
            data-testid="action-button"
            aria-label="Perform action"
            disabled
          >
            Action
          </ToastAction>
        </Toast>
      </ToastProvider>
    )
    
    const actionButton = screen.getByTestId('action-button')
    expect(actionButton).toHaveAttribute('aria-label', 'Perform action')
    expect(actionButton).toBeDisabled()
  })
})

describe('Toast Integration', () => {
  it('renders complete toast with all components', () => {
    render(
      <ToastProvider>
        <ToastViewport />
        <Toast data-testid="toast">
          <ToastTitle>Success!</ToastTitle>
          <ToastDescription>Your action was completed successfully.</ToastDescription>
          <ToastAction altText="Undo action">Undo</ToastAction>
          <ToastClose />
        </Toast>
      </ToastProvider>
    )
    
    expect(screen.getByTestId('toast')).toBeInTheDocument()
    expect(screen.getByText('Success!')).toBeInTheDocument()
    expect(screen.getByText('Your action was completed successfully.')).toBeInTheDocument()
    expect(screen.getByText('Undo')).toBeInTheDocument()
  })

  it('handles multiple toasts', () => {
    render(
      <ToastProvider>
        <ToastViewport />
        <Toast data-testid="toast1">
          <ToastTitle>First Toast</ToastTitle>
        </Toast>
        <Toast data-testid="toast2">
          <ToastTitle>Second Toast</ToastTitle>
        </Toast>
      </ToastProvider>
    )
    
    expect(screen.getByTestId('toast1')).toBeInTheDocument()
    expect(screen.getByTestId('toast2')).toBeInTheDocument()
    expect(screen.getByText('First Toast')).toBeInTheDocument()
    expect(screen.getByText('Second Toast')).toBeInTheDocument()
  })

  it('maintains accessibility with proper ARIA attributes', () => {
    render(
      <ToastProvider>
        <ToastViewport />
        <Toast aria-label="Success notification">
          <ToastTitle>Success!</ToastTitle>
          <ToastDescription>Operation completed</ToastDescription>
        </Toast>
      </ToastProvider>
    )
    
    const toast = screen.getByLabelText('Success notification')
    expect(toast).toBeInTheDocument()
  })

  it('handles destructive variant with proper styling', () => {
    render(
      <ToastProvider>
        <ToastViewport />
        <Toast variant="destructive" data-testid="destructive-toast">
          <ToastTitle>Error</ToastTitle>
          <ToastDescription>Something went wrong</ToastDescription>
        </Toast>
      </ToastProvider>
    )
    
    const toast = screen.getByTestId('destructive-toast')
    expect(toast).toHaveClass('destructive')
  })

  it('supports custom duration', () => {
    render(
      <ToastProvider>
        <ToastViewport />
        <Toast duration={10000} data-testid="toast">
          <ToastTitle>Custom Duration</ToastTitle>
        </Toast>
      </ToastProvider>
    )
    
    const toast = screen.getByTestId('toast')
    expect(toast).toBeInTheDocument()
  })
})

import React from 'react'
import { render, screen } from '@testing-library/react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
  DialogOverlay,
  DialogPortal,
} from './dialog'

describe('Dialog', () => {
  it('renders with default props', () => {
    render(
      <Dialog>
        <DialogTrigger>Open Dialog</DialogTrigger>
        <DialogContent>
          <DialogDescription>Dialog description</DialogDescription>
          <DialogHeader>
            <DialogTitle>Dialog Title</DialogTitle>
            <DialogDescription>Dialog description</DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    )
    
    expect(screen.getByText('Open Dialog')).toBeInTheDocument()
  })

  it('applies custom props to root dialog', () => {
    render(
      <Dialog defaultOpen>
        <DialogTrigger>Open Dialog</DialogTrigger>
        <DialogContent>
          <DialogDescription>Dialog description</DialogDescription>
          <DialogTitle>Dialog Title</DialogTitle>
          <DialogDescription>Dialog description</DialogDescription>
        </DialogContent>
      </Dialog>
    )
    
    expect(screen.getByText('Dialog Title')).toBeInTheDocument()
  })
})

describe('DialogTrigger', () => {
  it('renders trigger button correctly', () => {
    render(
      <Dialog>
        <DialogTrigger data-testid="trigger">Open Dialog</DialogTrigger>
        <DialogContent>
          <DialogDescription>Dialog description</DialogDescription>
          <DialogTitle>Dialog Title</DialogTitle>
          <DialogDescription>Dialog description</DialogDescription>
        </DialogContent>
      </Dialog>
    )
    
    const trigger = screen.getByTestId('trigger')
    expect(trigger).toBeInTheDocument()
    expect(trigger).toHaveTextContent('Open Dialog')
  })

  it('applies custom className to trigger', () => {
    render(
      <Dialog>
        <DialogTrigger className="custom-trigger-class" data-testid="trigger">
          Open Dialog
        </DialogTrigger>
        <DialogContent>
          <DialogDescription>Dialog description</DialogDescription>
          <DialogTitle>Dialog Title</DialogTitle>
          <DialogDescription>Dialog description</DialogDescription>
        </DialogContent>
      </Dialog>
    )
    
    const trigger = screen.getByTestId('trigger')
    expect(trigger).toHaveClass('custom-trigger-class')
  })

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLButtonElement>()
    render(
      <Dialog>
        <DialogTrigger ref={ref} data-testid="trigger">
          Open Dialog
        </DialogTrigger>
        <DialogContent>
          <DialogDescription>Dialog description</DialogDescription>
          <DialogTitle>Dialog Title</DialogTitle>
          <DialogDescription>Dialog description</DialogDescription>
        </DialogContent>
      </Dialog>
    )
    
    expect(ref.current).toBeInstanceOf(HTMLButtonElement)
  })

  it('applies all trigger props correctly', () => {
    render(
      <Dialog>
        <DialogTrigger 
          data-testid="trigger"
          aria-label="Open dialog"
          disabled
        >
          Open Dialog
        </DialogTrigger>
        <DialogContent>
          <DialogDescription>Dialog description</DialogDescription>
          <DialogTitle>Dialog Title</DialogTitle>
          <DialogDescription>Dialog description</DialogDescription>
        </DialogContent>
      </Dialog>
    )
    
    const trigger = screen.getByTestId('trigger')
    expect(trigger).toHaveAttribute('aria-label', 'Open dialog')
    expect(trigger).toBeDisabled()
  })
})

describe('DialogContent', () => {
  it('renders content correctly', () => {
    render(
      <Dialog defaultOpen>
        <DialogContent data-testid="content">
          <DialogTitle>Dialog Title</DialogTitle>
          <DialogDescription>Dialog description</DialogDescription>
        </DialogContent>
      </Dialog>
    )
    
    const content = screen.getByTestId('content')
    expect(content).toBeInTheDocument()
  })

  it('applies custom className to content', () => {
    render(
      <Dialog defaultOpen>
        <DialogContent className="custom-content-class" data-testid="content">
          <DialogTitle>Dialog Title</DialogTitle>
          <DialogDescription>Dialog description</DialogDescription>
        </DialogContent>
      </Dialog>
    )
    
    const content = screen.getByTestId('content')
    expect(content).toHaveClass('custom-content-class')
  })

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLDivElement>()
    render(
      <Dialog defaultOpen>
        <DialogContent ref={ref} data-testid="content">
          <DialogTitle>Dialog Title</DialogTitle>
          <DialogDescription>Dialog description</DialogDescription>
        </DialogContent>
      </Dialog>
    )
    
    expect(ref.current).toBeInstanceOf(HTMLDivElement)
  })

  it('applies all content props correctly', () => {
    render(
      <Dialog defaultOpen>
        <DialogContent 
          data-testid="content"
          aria-label="Dialog content"
        >
          <DialogTitle>Dialog Title</DialogTitle>
          <DialogDescription>Dialog description</DialogDescription>
        </DialogContent>
      </Dialog>
    )
    
    const content = screen.getByTestId('content')
    expect(content).toHaveAttribute('aria-label', 'Dialog content')
  })

  it('renders close button by default', () => {
    render(
      <Dialog defaultOpen>
        <DialogContent data-testid="content">
          <DialogTitle>Dialog Title</DialogTitle>
          <DialogDescription>Dialog description</DialogDescription>
        </DialogContent>
      </Dialog>
    )
    
    const closeButton = screen.getByRole('button', { name: /close/i })
    expect(closeButton).toBeInTheDocument()
  })
})

describe('DialogOverlay', () => {
  it('renders overlay correctly', () => {
    render(
      <Dialog defaultOpen>
        <DialogOverlay data-testid="overlay" />
        <DialogContent>
          <DialogDescription>Dialog description</DialogDescription>
          <DialogTitle>Dialog Title</DialogTitle>
          <DialogDescription>Dialog description</DialogDescription>
        </DialogContent>
      </Dialog>
    )
    
    const overlay = screen.getByTestId('overlay')
    expect(overlay).toBeInTheDocument()
  })

  it('applies custom className to overlay', () => {
    render(
      <Dialog defaultOpen>
        <DialogOverlay className="custom-overlay-class" data-testid="overlay" />
        <DialogContent>
          <DialogDescription>Dialog description</DialogDescription>
          <DialogTitle>Dialog Title</DialogTitle>
          <DialogDescription>Dialog description</DialogDescription>
        </DialogContent>
      </Dialog>
    )
    
    const overlay = screen.getByTestId('overlay')
    expect(overlay).toHaveClass('custom-overlay-class')
  })

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLDivElement>()
    render(
      <Dialog defaultOpen>
        <DialogOverlay ref={ref} data-testid="overlay" />
        <DialogContent>
          <DialogDescription>Dialog description</DialogDescription>
          <DialogTitle>Dialog Title</DialogTitle>
        </DialogContent>
      </Dialog>
    )
    
    expect(ref.current).toBeInstanceOf(HTMLDivElement)
  })

  it('applies all overlay props correctly', () => {
    render(
      <Dialog defaultOpen>
        <DialogOverlay 
          data-testid="overlay"
          aria-label="Dialog overlay"
        />
        <DialogContent>
          <DialogDescription>Dialog description</DialogDescription>
          <DialogTitle>Dialog Title</DialogTitle>
        </DialogContent>
      </Dialog>
    )
    
    const overlay = screen.getByTestId('overlay')
    expect(overlay).toHaveAttribute('aria-label', 'Dialog overlay')
  })
})

describe('DialogPortal', () => {
  it('renders portal correctly', () => {
    render(
      <Dialog defaultOpen>
        <DialogPortal>
          <DialogContent data-testid="content">
            <DialogTitle>Dialog Title</DialogTitle>
            <DialogDescription>Dialog description</DialogDescription>
          </DialogContent>
        </DialogPortal>
      </Dialog>
    )
    
    const content = screen.getByTestId('content')
    expect(content).toBeInTheDocument()
  })
})

describe('DialogHeader', () => {
  it('renders header correctly', () => {
    render(
      <Dialog defaultOpen>
        <DialogContent>
          <DialogDescription>Dialog description</DialogDescription>
          <DialogHeader data-testid="header">
            <DialogTitle>Dialog Title</DialogTitle>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    )
    
    const header = screen.getByTestId('header')
    expect(header).toBeInTheDocument()
  })

  it('applies custom className to header', () => {
    render(
      <Dialog defaultOpen>
        <DialogContent>
          <DialogDescription>Dialog description</DialogDescription>
          <DialogHeader className="custom-header-class" data-testid="header">
            <DialogTitle>Dialog Title</DialogTitle>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    )
    
    const header = screen.getByTestId('header')
    expect(header).toHaveClass('custom-header-class')
  })

  it('applies all header props correctly', () => {
    render(
      <Dialog defaultOpen>
        <DialogContent>
          <DialogDescription>Dialog description</DialogDescription>
          <DialogHeader 
            data-testid="header"
            aria-label="Dialog header"
          >
            <DialogTitle>Dialog Title</DialogTitle>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    )
    
    const header = screen.getByTestId('header')
    expect(header).toHaveAttribute('aria-label', 'Dialog header')
  })
})

describe('DialogFooter', () => {
  it('renders footer correctly', () => {
    render(
      <Dialog defaultOpen>
        <DialogContent>
          <DialogTitle>Dialog Title</DialogTitle>
          <DialogDescription>Dialog description</DialogDescription>
          <DialogFooter data-testid="footer">
            <button>Cancel</button>
            <button>Save</button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
    
    const footer = screen.getByTestId('footer')
    expect(footer).toBeInTheDocument()
  })

  it('applies custom className to footer', () => {
    render(
      <Dialog defaultOpen>
        <DialogContent>
          <DialogTitle>Dialog Title</DialogTitle>
          <DialogDescription>Dialog description</DialogDescription>
          <DialogFooter className="custom-footer-class" data-testid="footer">
            <button>Cancel</button>
            <button>Save</button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
    
    const footer = screen.getByTestId('footer')
    expect(footer).toHaveClass('custom-footer-class')
  })

  it('applies all footer props correctly', () => {
    render(
      <Dialog defaultOpen>
        <DialogContent>
          <DialogTitle>Dialog Title</DialogTitle>
          <DialogDescription>Dialog description</DialogDescription>
          <DialogFooter 
            data-testid="footer"
            aria-label="Dialog footer"
          >
            <button>Cancel</button>
            <button>Save</button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
    
    const footer = screen.getByTestId('footer')
    expect(footer).toHaveAttribute('aria-label', 'Dialog footer')
  })
})

describe('DialogTitle', () => {
  it('renders title text correctly', () => {
    render(
      <Dialog defaultOpen>
        <DialogContent>
          <DialogDescription>Dialog description</DialogDescription>
          <DialogTitle>Test Title</DialogTitle>
        </DialogContent>
      </Dialog>
    )
    
    expect(screen.getByText('Test Title')).toBeInTheDocument()
  })

  it('applies custom className to title', () => {
    render(
      <Dialog defaultOpen>
        <DialogContent>
          <DialogDescription>Dialog description</DialogDescription>
          <DialogTitle className="custom-title-class">Test Title</DialogTitle>
        </DialogContent>
      </Dialog>
    )
    
    const title = screen.getByText('Test Title')
    expect(title).toHaveClass('custom-title-class')
  })

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLHeadingElement>()
    render(
      <Dialog defaultOpen>
        <DialogContent>
          <DialogDescription>Dialog description</DialogDescription>
          <DialogTitle ref={ref}>Test Title</DialogTitle>
        </DialogContent>
      </Dialog>
    )
    
    expect(ref.current).toBeInstanceOf(HTMLHeadingElement)
  })

  it('applies all title props correctly', () => {
    render(
      <Dialog defaultOpen>
        <DialogContent>
          <DialogDescription>Dialog description</DialogDescription>
          <DialogTitle 
            data-testid="title"
            aria-label="Dialog title"
          >
            Test Title
          </DialogTitle>
        </DialogContent>
      </Dialog>
    )
    
    const title = screen.getByTestId('title')
    expect(title).toHaveAttribute('aria-label', 'Dialog title')
  })
})

describe('DialogDescription', () => {
  it('renders description text correctly', () => {
    render(
      <Dialog defaultOpen>
        <DialogContent>
          <DialogTitle>Dialog Title</DialogTitle>
          <DialogDescription>Dialog description</DialogDescription>
          <DialogDescription>Test description</DialogDescription>
        </DialogContent>
      </Dialog>
    )
    
    expect(screen.getByText('Test description')).toBeInTheDocument()
  })

  it('applies custom className to description', () => {
    render(
      <Dialog defaultOpen>
        <DialogContent>
          <DialogTitle>Dialog Title</DialogTitle>
          <DialogDescription>Dialog description</DialogDescription>
          <DialogDescription className="custom-description-class">
            Test description
          </DialogDescription>
        </DialogContent>
      </Dialog>
    )
    
    const description = screen.getByText('Test description')
    expect(description).toHaveClass('custom-description-class')
  })

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLParagraphElement>()
    render(
      <Dialog defaultOpen>
        <DialogContent>
          <DialogTitle>Dialog Title</DialogTitle>
          <DialogDescription>Dialog description</DialogDescription>
          <DialogDescription ref={ref}>Test description</DialogDescription>
        </DialogContent>
      </Dialog>
    )
    
    expect(ref.current).toBeInstanceOf(HTMLParagraphElement)
  })

  it('applies all description props correctly', () => {
    render(
      <Dialog defaultOpen>
        <DialogContent>
          <DialogTitle>Dialog Title</DialogTitle>
          <DialogDescription>Dialog description</DialogDescription>
          <DialogDescription 
            data-testid="description"
            aria-label="Dialog description"
          >
            Test description
          </DialogDescription>
        </DialogContent>
      </Dialog>
    )
    
    const description = screen.getByTestId('description')
    expect(description).toHaveAttribute('aria-label', 'Dialog description')
  })
})

describe('DialogClose', () => {
  it('renders close button correctly', () => {
    render(
      <Dialog defaultOpen>
        <DialogContent>
          <DialogDescription>Dialog description</DialogDescription>
          <DialogTitle>Dialog Title</DialogTitle>
          <DialogClose data-testid="close-button">Close</DialogClose>
        </DialogContent>
      </Dialog>
    )
    
    const closeButton = screen.getByTestId('close-button')
    expect(closeButton).toBeInTheDocument()
    expect(closeButton).toHaveTextContent('Close')
  })

  it('applies custom className to close button', () => {
    render(
      <Dialog defaultOpen>
        <DialogContent>
          <DialogDescription>Dialog description</DialogDescription>
          <DialogTitle>Dialog Title</DialogTitle>
          <DialogClose className="custom-close-class" data-testid="close-button">
            Close
          </DialogClose>
        </DialogContent>
      </Dialog>
    )
    
    const closeButton = screen.getByTestId('close-button')
    expect(closeButton).toHaveClass('custom-close-class')
  })

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLButtonElement>()
    render(
      <Dialog defaultOpen>
        <DialogContent>
          <DialogDescription>Dialog description</DialogDescription>
          <DialogTitle>Dialog Title</DialogTitle>
          <DialogClose ref={ref} data-testid="close-button">Close</DialogClose>
        </DialogContent>
      </Dialog>
    )
    
    expect(ref.current).toBeInstanceOf(HTMLButtonElement)
  })

  it('applies all close button props correctly', () => {
    render(
      <Dialog defaultOpen>
        <DialogContent>
          <DialogDescription>Dialog description</DialogDescription>
          <DialogTitle>Dialog Title</DialogTitle>
          <DialogClose 
            data-testid="close-button"
            aria-label="Close dialog"
            disabled
          >
            Close
          </DialogClose>
        </DialogContent>
      </Dialog>
    )
    
    const closeButton = screen.getByTestId('close-button')
    expect(closeButton).toHaveAttribute('aria-label', 'Close dialog')
    expect(closeButton).toBeDisabled()
  })
})

describe('Dialog Integration', () => {
  it('renders complete dialog with all components', () => {
    render(
      <Dialog defaultOpen>
        <DialogContent data-testid="content">
          <DialogHeader>
            <DialogTitle>Complete Dialog</DialogTitle>
            <DialogDescription>This is a complete dialog example.</DialogDescription>
          </DialogHeader>
          <div>Dialog content goes here</div>
          <DialogFooter>
            <button>Cancel</button>
            <button>Save</button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
    
    expect(screen.getByTestId('content')).toBeInTheDocument()
    expect(screen.getByText('Complete Dialog')).toBeInTheDocument()
    expect(screen.getByText('This is a complete dialog example.')).toBeInTheDocument()
    expect(screen.getByText('Dialog content goes here')).toBeInTheDocument()
    expect(screen.getByText('Cancel')).toBeInTheDocument()
    expect(screen.getByText('Save')).toBeInTheDocument()
  })

  it('maintains accessibility with proper ARIA attributes', () => {
    render(
      <Dialog defaultOpen>
        <DialogContent aria-label="Confirmation dialog">
          <DialogTitle>Confirm Action</DialogTitle>
          <DialogDescription>Are you sure you want to proceed?</DialogDescription>
        </DialogContent>
      </Dialog>
    )
    
    const dialog = screen.getByLabelText('Confirmation dialog')
    expect(dialog).toBeInTheDocument()
  })

  it('handles controlled open state', () => {
    const { rerender } = render(
      <Dialog open={false}>
        <DialogTrigger>Open Dialog</DialogTrigger>
        <DialogContent>
          <DialogDescription>Dialog description</DialogDescription>
          <DialogTitle>Dialog Title</DialogTitle>
        </DialogContent>
      </Dialog>
    )
    
    expect(screen.queryByText('Dialog Title')).not.toBeInTheDocument()
    
    rerender(
      <Dialog open={true}>
        <DialogTrigger>Open Dialog</DialogTrigger>
        <DialogContent>
          <DialogDescription>Dialog description</DialogDescription>
          <DialogTitle>Dialog Title</DialogTitle>
        </DialogContent>
      </Dialog>
    )
    
    expect(screen.getByText('Dialog Title')).toBeInTheDocument()
  })

  it('supports custom portal container', () => {
    const container = document.createElement('div')
    container.id = 'custom-portal'
    document.body.appendChild(container)
    
    render(
      <Dialog defaultOpen>
        <DialogPortal container={container}>
          <DialogContent>
          <DialogDescription>Dialog description</DialogDescription>
            <DialogTitle>Custom Portal Dialog</DialogTitle>
          </DialogContent>
        </DialogPortal>
      </Dialog>
    )
    
    expect(screen.getByText('Custom Portal Dialog')).toBeInTheDocument()
    
    document.body.removeChild(container)
  })
})

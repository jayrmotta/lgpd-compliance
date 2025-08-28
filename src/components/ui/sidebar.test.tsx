import React from 'react'
import { render, screen } from '@testing-library/react'
import { Sidebar, SidebarHeader, SidebarContent, SidebarFooter } from './sidebar'

describe('Sidebar', () => {
  it('renders with default props', () => {
    render(<Sidebar data-testid="sidebar">Content</Sidebar>)
    const sidebar = screen.getByTestId('sidebar')
    expect(sidebar).toBeInTheDocument()
    expect(sidebar.tagName).toBe('ASIDE')
    expect(sidebar).toHaveTextContent('Content')
  })

  it('applies default classes', () => {
    render(<Sidebar data-testid="sidebar" />)
    const sidebar = screen.getByTestId('sidebar')
    expect(sidebar).toHaveClass('flex', 'flex-col', 'bg-background', 'border-r', 'border-border', 'w-64')
  })

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLElement>()
    render(<Sidebar ref={ref as React.Ref<HTMLDivElement>} data-testid="sidebar" />)
    expect(ref.current).toBeInstanceOf(HTMLElement)
  })

  it('applies custom className', () => {
    render(<Sidebar className="custom-class" data-testid="sidebar" />)
    const sidebar = screen.getByTestId('sidebar')
    expect(sidebar).toHaveClass('custom-class')
  })

  it('applies compact variant styles', () => {
    render(<Sidebar variant="compact" data-testid="sidebar" />)
    const sidebar = screen.getByTestId('sidebar')
    expect(sidebar).toHaveClass('w-16')
    expect(sidebar).not.toHaveClass('w-64')
  })

  it('applies right position styles', () => {
    render(<Sidebar position="right" data-testid="sidebar" />)
    const sidebar = screen.getByTestId('sidebar')
    expect(sidebar).toHaveClass('border-l', 'border-r-0')
    expect(sidebar).not.toHaveClass('border-r')
  })

  it('combines variant and position styles correctly', () => {
    render(
      <Sidebar
        variant="compact"
        position="right"
        className="custom-class"
        data-testid="sidebar"
      />
    )
    const sidebar = screen.getByTestId('sidebar')
    expect(sidebar).toHaveClass(
      'w-16',
      'border-l',
      'border-r-0',
      'custom-class'
    )
  })

  it('has correct display name', () => {
    expect(Sidebar.displayName).toBe('Sidebar')
  })
})

describe('SidebarHeader', () => {
  it('renders with default props', () => {
    render(<SidebarHeader data-testid="header">Header</SidebarHeader>)
    const header = screen.getByTestId('header')
    expect(header).toBeInTheDocument()
    expect(header.tagName).toBe('DIV')
    expect(header).toHaveTextContent('Header')
  })

  it('applies default classes', () => {
    render(<SidebarHeader data-testid="header" />)
    const header = screen.getByTestId('header')
    expect(header).toHaveClass('flex', 'h-16', 'shrink-0', 'items-center', 'border-b', 'border-border', 'px-4')
  })

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLDivElement>()
    render(<SidebarHeader ref={ref} data-testid="header" />)
    expect(ref.current).toBeInstanceOf(HTMLDivElement)
  })

  it('applies custom className', () => {
    render(<SidebarHeader className="custom-class" data-testid="header" />)
    const header = screen.getByTestId('header')
    expect(header).toHaveClass('custom-class')
  })

  it('has correct display name', () => {
    expect(SidebarHeader.displayName).toBe('SidebarHeader')
  })
})

describe('SidebarContent', () => {
  it('renders with default props', () => {
    render(<SidebarContent data-testid="content">Content</SidebarContent>)
    const content = screen.getByTestId('content')
    expect(content).toBeInTheDocument()
    expect(content.tagName).toBe('DIV')
    expect(content).toHaveTextContent('Content')
  })

  it('applies default classes', () => {
    render(<SidebarContent data-testid="content" />)
    const content = screen.getByTestId('content')
    expect(content).toHaveClass('flex-1', 'overflow-auto')
  })

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLDivElement>()
    render(<SidebarContent ref={ref} data-testid="content" />)
    expect(ref.current).toBeInstanceOf(HTMLDivElement)
  })

  it('applies custom className', () => {
    render(<SidebarContent className="custom-class" data-testid="content" />)
    const content = screen.getByTestId('content')
    expect(content).toHaveClass('custom-class')
  })

  it('has correct display name', () => {
    expect(SidebarContent.displayName).toBe('SidebarContent')
  })
})

describe('SidebarFooter', () => {
  it('renders with default props', () => {
    render(<SidebarFooter data-testid="footer">Footer</SidebarFooter>)
    const footer = screen.getByTestId('footer')
    expect(footer).toBeInTheDocument()
    expect(footer.tagName).toBe('DIV')
    expect(footer).toHaveTextContent('Footer')
  })

  it('applies default classes', () => {
    render(<SidebarFooter data-testid="footer" />)
    const footer = screen.getByTestId('footer')
    expect(footer).toHaveClass('flex', 'h-16', 'shrink-0', 'items-center', 'border-t', 'border-border', 'px-4')
  })

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLDivElement>()
    render(<SidebarFooter ref={ref} data-testid="footer" />)
    expect(ref.current).toBeInstanceOf(HTMLDivElement)
  })

  it('applies custom className', () => {
    render(<SidebarFooter className="custom-class" data-testid="footer" />)
    const footer = screen.getByTestId('footer')
    expect(footer).toHaveClass('custom-class')
  })

  it('has correct display name', () => {
    expect(SidebarFooter.displayName).toBe('SidebarFooter')
  })
})

describe('Sidebar Composition', () => {
  it('renders all sub-components together', () => {
    render(
      <Sidebar data-testid="sidebar">
        <SidebarHeader data-testid="header">Header</SidebarHeader>
        <SidebarContent data-testid="content">Content</SidebarContent>
        <SidebarFooter data-testid="footer">Footer</SidebarFooter>
      </Sidebar>
    )
    
    expect(screen.getByTestId('sidebar')).toBeInTheDocument()
    expect(screen.getByTestId('header')).toBeInTheDocument()
    expect(screen.getByTestId('content')).toBeInTheDocument()
    expect(screen.getByTestId('footer')).toBeInTheDocument()
  })

  it('maintains proper structure with all components', () => {
    render(
      <Sidebar data-testid="sidebar">
        <SidebarHeader data-testid="header">Header</SidebarHeader>
        <SidebarContent data-testid="content">Content</SidebarContent>
        <SidebarFooter data-testid="footer">Footer</SidebarFooter>
      </Sidebar>
    )
    
    const sidebar = screen.getByTestId('sidebar')
    const header = screen.getByTestId('header')
    const content = screen.getByTestId('content')
    const footer = screen.getByTestId('footer')
    
    expect(sidebar).toContainElement(header)
    expect(sidebar).toContainElement(content)
    expect(sidebar).toContainElement(footer)
  })
})

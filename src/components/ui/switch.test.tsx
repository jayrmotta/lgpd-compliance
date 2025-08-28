import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { Switch } from './switch'

describe('Switch', () => {
  it('renders with default props', () => {
    render(<Switch data-testid="switch" />)
    const switchElement = screen.getByTestId('switch')
    expect(switchElement).toBeInTheDocument()
    expect(switchElement.tagName).toBe('BUTTON')
  })

  it('applies default classes', () => {
    render(<Switch data-testid="switch" />)
    const switchElement = screen.getByTestId('switch')
    expect(switchElement).toHaveClass(
      'peer',
      'inline-flex',
      'h-6',
      'w-11',
      'shrink-0',
      'cursor-pointer',
      'items-center',
      'rounded-full'
    )
  })

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLButtonElement>()
    render(<Switch ref={ref} data-testid="switch" />)
    expect(ref.current).toBeInstanceOf(HTMLButtonElement)
  })

  it('applies custom className', () => {
    render(<Switch className="custom-class" data-testid="switch" />)
    const switchElement = screen.getByTestId('switch')
    expect(switchElement).toHaveClass('custom-class')
  })

  it('handles checked state', () => {
    render(<Switch checked data-testid="switch" />)
    const switchElement = screen.getByTestId('switch')
    expect(switchElement).toHaveAttribute('data-state', 'checked')
  })

  it('handles unchecked state', () => {
    render(<Switch checked={false} data-testid="switch" />)
    const switchElement = screen.getByTestId('switch')
    expect(switchElement).toHaveAttribute('data-state', 'unchecked')
  })

  it('handles disabled state', () => {
    render(<Switch disabled data-testid="switch" />)
    const switchElement = screen.getByTestId('switch')
    expect(switchElement).toBeDisabled()
    expect(switchElement).toHaveClass('disabled:cursor-not-allowed', 'disabled:opacity-50')
  })

  it('handles onCheckedChange event', () => {
    const handleChange = jest.fn()
    render(<Switch onCheckedChange={handleChange} data-testid="switch" />)
    const switchElement = screen.getByTestId('switch')
    fireEvent.click(switchElement)
    expect(handleChange).toHaveBeenCalledTimes(1)
    expect(handleChange).toHaveBeenCalledWith(true)
  })

  it('handles onCheckedChange event when already checked', () => {
    const handleChange = jest.fn()
    render(<Switch checked onCheckedChange={handleChange} data-testid="switch" />)
    const switchElement = screen.getByTestId('switch')
    fireEvent.click(switchElement)
    expect(handleChange).toHaveBeenCalledTimes(1)
    expect(handleChange).toHaveBeenCalledWith(false)
  })

  it('handles onFocus event', () => {
    const handleFocus = jest.fn()
    render(<Switch onFocus={handleFocus} data-testid="switch" />)
    const switchElement = screen.getByTestId('switch')
    fireEvent.focus(switchElement)
    expect(handleFocus).toHaveBeenCalledTimes(1)
  })

  it('handles onBlur event', () => {
    const handleBlur = jest.fn()
    render(<Switch onBlur={handleBlur} data-testid="switch" />)
    const switchElement = screen.getByTestId('switch')
    fireEvent.blur(switchElement)
    expect(handleBlur).toHaveBeenCalledTimes(1)
  })

  it('handles onKeyDown event', () => {
    const handleKeyDown = jest.fn()
    render(<Switch onKeyDown={handleKeyDown} data-testid="switch" />)
    const switchElement = screen.getByTestId('switch')
    fireEvent.keyDown(switchElement, { key: 'Enter' })
    expect(handleKeyDown).toHaveBeenCalledTimes(1)
  })



  it('does not toggle when disabled', () => {
    const handleChange = jest.fn()
    render(<Switch disabled onCheckedChange={handleChange} data-testid="switch" />)
    const switchElement = screen.getByTestId('switch')
    fireEvent.click(switchElement)
    expect(handleChange).not.toHaveBeenCalled()
  })

  it('does not toggle when disabled and key pressed', () => {
    const handleChange = jest.fn()
    render(<Switch disabled onCheckedChange={handleChange} data-testid="switch" />)
    const switchElement = screen.getByTestId('switch')
    fireEvent.keyDown(switchElement, { key: 'Enter' })
    expect(handleChange).not.toHaveBeenCalled()
  })

  it('has correct ARIA attributes', () => {
    render(<Switch data-testid="switch" />)
    const switchElement = screen.getByTestId('switch')
    expect(switchElement).toHaveAttribute('role', 'switch')
    expect(switchElement).toHaveAttribute('aria-checked', 'false')
  })

  it('updates ARIA attributes when checked', () => {
    render(<Switch checked data-testid="switch" />)
    const switchElement = screen.getByTestId('switch')
    expect(switchElement).toHaveAttribute('aria-checked', 'true')
  })

  it('forwards all HTML button attributes', () => {
    render(
      <Switch
        aria-label="Toggle notifications"
        data-testid="switch"
      />
    )
    const switchElement = screen.getByTestId('switch')
    expect(switchElement).toHaveAttribute('aria-label', 'Toggle notifications')
  })

  it('has correct display name', () => {
    expect(Switch.displayName).toBe('Switch')
  })

  it('maintains focus styles', () => {
    render(<Switch data-testid="switch" />)
    const switchElement = screen.getByTestId('switch')
    expect(switchElement).toHaveClass('focus-visible:outline-none', 'focus-visible:ring-2')
  })

  it('renders thumb element', () => {
    render(<Switch data-testid="switch" />)
    const switchElement = screen.getByTestId('switch')
    const thumb = switchElement.querySelector('[role="switch"] > span')
    expect(thumb).toBeInTheDocument()
  })

  it('applies correct thumb classes', () => {
    render(<Switch data-testid="switch" />)
    const switchElement = screen.getByTestId('switch')
    const thumb = switchElement.querySelector('[role="switch"] > span')
    expect(thumb).toHaveClass(
      'pointer-events-none',
      'block',
      'h-5',
      'w-5',
      'rounded-full',
      'bg-background',
      'shadow-lg'
    )
  })
})

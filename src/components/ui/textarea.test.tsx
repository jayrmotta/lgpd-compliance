import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { Textarea } from './textarea'

describe('Textarea', () => {
  it('renders with default props', () => {
    render(<Textarea data-testid="textarea" />)
    const textarea = screen.getByTestId('textarea')
    expect(textarea).toBeInTheDocument()
    expect(textarea.tagName).toBe('TEXTAREA')
  })

  it('applies default classes', () => {
    render(<Textarea data-testid="textarea" />)
    const textarea = screen.getByTestId('textarea')
    expect(textarea).toHaveClass('flex', 'min-h-[80px]', 'w-full', 'rounded-md', 'border')
  })

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLTextAreaElement>()
    render(<Textarea ref={ref} data-testid="textarea" />)
    expect(ref.current).toBeInstanceOf(HTMLTextAreaElement)
  })

  it('applies custom className', () => {
    render(<Textarea className="custom-class" data-testid="textarea" />)
    const textarea = screen.getByTestId('textarea')
    expect(textarea).toHaveClass('custom-class')
  })

  it('applies error variant styles', () => {
    render(<Textarea variant="error" data-testid="textarea" />)
    const textarea = screen.getByTestId('textarea')
    expect(textarea).toHaveClass('border-destructive', 'focus-visible:ring-destructive')
  })

  it('applies success variant styles', () => {
    render(<Textarea variant="success" data-testid="textarea" />)
    const textarea = screen.getByTestId('textarea')
    expect(textarea).toHaveClass('border-green-500', 'focus-visible:ring-green-500')
  })

  it('applies small size styles', () => {
    render(<Textarea size="sm" data-testid="textarea" />)
    const textarea = screen.getByTestId('textarea')
    expect(textarea).toHaveClass('min-h-[60px]', 'px-2', 'py-1', 'text-xs')
  })

  it('applies large size styles', () => {
    render(<Textarea size="lg" data-testid="textarea" />)
    const textarea = screen.getByTestId('textarea')
    expect(textarea).toHaveClass('min-h-[100px]', 'px-4', 'py-3', 'text-base')
  })

  it('applies medium size styles by default', () => {
    render(<Textarea data-testid="textarea" />)
    const textarea = screen.getByTestId('textarea')
    expect(textarea).toHaveClass('min-h-[80px]', 'px-3', 'py-2', 'text-sm')
  })

  it('handles placeholder text', () => {
    render(<Textarea placeholder="Enter your message" data-testid="textarea" />)
    const textarea = screen.getByTestId('textarea')
    expect(textarea).toHaveAttribute('placeholder', 'Enter your message')
  })

  it('handles disabled state', () => {
    render(<Textarea disabled data-testid="textarea" />)
    const textarea = screen.getByTestId('textarea')
    expect(textarea).toBeDisabled()
    expect(textarea).toHaveClass('disabled:cursor-not-allowed', 'disabled:opacity-50')
  })

  it('handles value prop', () => {
    render(<Textarea value="Test value" onChange={() => {}} data-testid="textarea" />)
    const textarea = screen.getByTestId('textarea')
    expect(textarea).toHaveValue('Test value')
  })

  it('handles onChange event', () => {
    const handleChange = jest.fn()
    render(<Textarea onChange={handleChange} data-testid="textarea" />)
    const textarea = screen.getByTestId('textarea')
    fireEvent.change(textarea, { target: { value: 'New value' } })
    expect(handleChange).toHaveBeenCalledTimes(1)
  })

  it('handles onFocus event', () => {
    const handleFocus = jest.fn()
    render(<Textarea onFocus={handleFocus} data-testid="textarea" />)
    const textarea = screen.getByTestId('textarea')
    fireEvent.focus(textarea)
    expect(handleFocus).toHaveBeenCalledTimes(1)
  })

  it('handles onBlur event', () => {
    const handleBlur = jest.fn()
    render(<Textarea onBlur={handleBlur} data-testid="textarea" />)
    const textarea = screen.getByTestId('textarea')
    fireEvent.blur(textarea)
    expect(handleBlur).toHaveBeenCalledTimes(1)
  })

  it('forwards all HTML textarea attributes', () => {
    render(
      <Textarea
        name="description"
        rows={5}
        cols={50}
        maxLength={100}
        data-testid="textarea"
      />
    )
    const textarea = screen.getByTestId('textarea')
    expect(textarea).toHaveAttribute('name', 'description')
    expect(textarea).toHaveAttribute('rows', '5')
    expect(textarea).toHaveAttribute('cols', '50')
    expect(textarea).toHaveAttribute('maxLength', '100')
  })

  it('combines variant and size styles correctly', () => {
    render(
      <Textarea
        variant="error"
        size="lg"
        className="custom-class"
        data-testid="textarea"
      />
    )
    const textarea = screen.getByTestId('textarea')
    expect(textarea).toHaveClass(
      'border-destructive',
      'focus-visible:ring-destructive',
      'min-h-[100px]',
      'px-4',
      'py-3',
      'text-base',
      'custom-class'
    )
  })

  it('has correct display name', () => {
    expect(Textarea.displayName).toBe('Textarea')
  })

  it('maintains accessibility attributes', () => {
    render(
      <Textarea
        aria-label="Description"
        aria-describedby="description-help"
        data-testid="textarea"
      />
    )
    const textarea = screen.getByTestId('textarea')
    expect(textarea).toHaveAttribute('aria-label', 'Description')
    expect(textarea).toHaveAttribute('aria-describedby', 'description-help')
  })
})

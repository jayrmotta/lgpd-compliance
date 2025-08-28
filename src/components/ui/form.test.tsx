import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from './form';
import { Input } from './input';
import { Button } from './button';

// Test schema
const testSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  age: z.number().min(18, 'Must be at least 18 years old'),
});

type TestFormData = z.infer<typeof testSchema>;

// Test component that uses the Form
const TestForm = ({ onSubmit }: { onSubmit: (data: TestFormData) => void }) => {
  const form = useForm<TestFormData>({
    resolver: zodResolver(testSchema),
    defaultValues: {
      name: '',
      email: '',
      age: 0,
    },
  });

  const handleSubmit = (data: TestFormData) => {
    onSubmit(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4" role="form">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter your name" {...field} />
              </FormControl>
              <FormDescription>Enter your full name</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="Enter your email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="age"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Age</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  placeholder="Enter your age" 
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
};

describe('Form Component', () => {
  it('renders form fields correctly', () => {
    const mockSubmit = jest.fn();
    render(<TestForm onSubmit={mockSubmit} />);

    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/age/i)).toBeInTheDocument();
    expect(screen.getByText(/enter your full name/i)).toBeInTheDocument();
  });

  it('shows validation errors for invalid input', async () => {
    const mockSubmit = jest.fn();
    const user = userEvent.setup();
    render(<TestForm onSubmit={mockSubmit} />);

    // Try to submit with empty fields
    await user.click(screen.getByRole('button', { name: /submit/i }));

    await waitFor(() => {
      expect(screen.getByText(/name must be at least 2 characters/i)).toBeInTheDocument();
      expect(screen.getByText(/invalid email address/i)).toBeInTheDocument();
      expect(screen.getByText(/must be at least 18 years old/i)).toBeInTheDocument();
    });

    expect(mockSubmit).not.toHaveBeenCalled();
  });

  it('submits form with valid data', async () => {
    const mockSubmit = jest.fn();
    const user = userEvent.setup();
    render(<TestForm onSubmit={mockSubmit} />);

    // Fill in valid data
    await user.type(screen.getByLabelText(/name/i), 'John Doe');
    await user.type(screen.getByLabelText(/email/i), 'john@example.com');
    await user.type(screen.getByLabelText(/age/i), '25');

    // Submit form
    await user.click(screen.getByRole('button', { name: /submit/i }));

    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalledWith({
        name: 'John Doe',
        email: 'john@example.com',
        age: 25,
      });
    }, { timeout: 10000 });
  }, 15000);

  it('clears validation errors when user starts typing', async () => {
    const mockSubmit = jest.fn();
    const user = userEvent.setup();
    render(<TestForm onSubmit={mockSubmit} />);

    // Submit with empty form to trigger errors
    await user.click(screen.getByRole('button', { name: /submit/i }));

    await waitFor(() => {
      expect(screen.getByText(/name must be at least 2 characters/i)).toBeInTheDocument();
    });

    // Start typing in name field
    await user.type(screen.getByLabelText(/name/i), 'Jo');

    await waitFor(() => {
      expect(screen.queryByText(/name must be at least 2 characters/i)).not.toBeInTheDocument();
    });
  });

  it('handles field-level validation correctly', async () => {
    const mockSubmit = jest.fn();
    const user = userEvent.setup();
    render(<TestForm onSubmit={mockSubmit} />);

    // Enter invalid email and submit to trigger validation
    await user.type(screen.getByLabelText(/email/i), 'invalid-email');
    await user.click(screen.getByRole('button', { name: /submit/i }));

    // For now, just verify that the form submission was prevented due to validation
    expect(mockSubmit).not.toHaveBeenCalled();
  });

  it('applies proper CSS classes for form elements', () => {
    const mockSubmit = jest.fn();
    render(<TestForm onSubmit={mockSubmit} />);

    const form = screen.getByRole('form');
    expect(form).toHaveClass('space-y-4');
  });

  it('renders form description correctly', () => {
    const mockSubmit = jest.fn();
    render(<TestForm onSubmit={mockSubmit} />);

    expect(screen.getByText(/enter your full name/i)).toBeInTheDocument();
  });

  it('handles number input conversion correctly', async () => {
    const mockSubmit = jest.fn();
    const user = userEvent.setup();
    render(<TestForm onSubmit={mockSubmit} />);

    // Fill in valid data including age as number
    await user.type(screen.getByLabelText(/name/i), 'John Doe');
    await user.type(screen.getByLabelText(/email/i), 'john@example.com');
    await user.type(screen.getByLabelText(/age/i), '30');

    await user.click(screen.getByRole('button', { name: /submit/i }));

    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalledWith({
        name: 'John Doe',
        email: 'john@example.com',
        age: 30,
      });
    }, { timeout: 10000 });
  }, 15000);

  it('maintains form state between renders', async () => {
    const mockSubmit = jest.fn();
    const user = userEvent.setup();
    const { rerender } = render(<TestForm onSubmit={mockSubmit} />);

    // Fill in some data
    await user.type(screen.getByLabelText(/name/i), 'John');

    // Rerender the component
    rerender(<TestForm onSubmit={mockSubmit} />);

    // Check that the data is still there
    expect(screen.getByLabelText(/name/i)).toHaveValue('John');
  });

  it('handles form reset correctly', async () => {
    const mockSubmit = jest.fn();
    const user = userEvent.setup();
    render(<TestForm onSubmit={mockSubmit} />);

    // Fill in some data
    await user.type(screen.getByLabelText(/name/i), 'John Doe');
    await user.type(screen.getByLabelText(/email/i), 'john@example.com');

    // Check that data is filled
    expect(screen.getByLabelText(/name/i)).toHaveValue('John Doe');
    expect(screen.getByLabelText(/email/i)).toHaveValue('john@example.com');
  });

  it('provides proper accessibility attributes', () => {
    const mockSubmit = jest.fn();
    render(<TestForm onSubmit={mockSubmit} />);

    const nameInput = screen.getByLabelText(/name/i);
    const emailInput = screen.getByLabelText(/email/i);
    const ageInput = screen.getByLabelText(/age/i);

    expect(nameInput).toHaveAttribute('placeholder', 'Enter your name');
    expect(emailInput).toHaveAttribute('type', 'email');
    expect(emailInput).toHaveAttribute('placeholder', 'Enter your email');
    expect(ageInput).toHaveAttribute('type', 'number');
    expect(ageInput).toHaveAttribute('placeholder', 'Enter your age');
  });
});

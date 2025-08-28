import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Table, TableHeader, TableBody, TableFooter, TableHead, TableRow, TableCell, TableCaption } from './table';

describe('Table Component', () => {
  const mockData = [
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'User' },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Table Container', () => {
    it('should render table with proper accessibility attributes', () => {
      render(
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>Test</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      );
      
      const table = screen.getByRole('table');
      expect(table).toBeInTheDocument();
    });

    it('should render with custom className', () => {
      render(
        <Table className="custom-table">
          <TableBody>
            <TableRow>
              <TableCell>Test</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      );
      
      const table = screen.getByRole('table');
      expect(table).toHaveClass('custom-table');
    });
  });

  describe('Table Caption', () => {
    it('should render table caption when provided', () => {
      render(
        <Table>
          <TableCaption>User List</TableCaption>
          <TableBody>
            <TableRow>
              <TableCell>Test</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      );
      
      expect(screen.getByText('User List')).toBeInTheDocument();
    });

    it('should render caption with custom className', () => {
      render(
        <Table>
          <TableCaption className="custom-caption">User List</TableCaption>
          <TableBody>
            <TableRow>
              <TableCell>Test</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      );
      
      const caption = screen.getByText('User List');
      expect(caption).toHaveClass('custom-caption');
    });
  });

  describe('Table Header', () => {
    it('should render table header with proper structure', () => {
      render(
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>John</TableCell>
              <TableCell>john@example.com</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      );
      
      const headerRow = screen.getByRole('row', { name: /name email/i });
      expect(headerRow).toBeInTheDocument();
      expect(screen.getByText('Name')).toBeInTheDocument();
      expect(screen.getByText('Email')).toBeInTheDocument();
    });

    it('should render header cells with proper accessibility attributes', () => {
      render(
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead scope="col">Name</TableHead>
              <TableHead scope="col">Email</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>John</TableCell>
              <TableCell>john@example.com</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      );
      
      const headerCells = screen.getAllByRole('columnheader');
      expect(headerCells).toHaveLength(2);
      expect(headerCells[0]).toHaveAttribute('scope', 'col');
      expect(headerCells[1]).toHaveAttribute('scope', 'col');
    });

    it('should render header with custom className', () => {
      render(
        <Table>
          <TableHeader className="custom-header">
            <TableRow>
              <TableHead>Name</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>John</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      );
      
      const header = screen.getAllByRole('rowgroup')[0];
      expect(header).toHaveClass('custom-header');
    });
  });

  describe('Table Body', () => {
    it('should render table body with data rows', () => {
      render(
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockData.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      );
      
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
      expect(screen.getByText('Bob Johnson')).toBeInTheDocument();
    });

    it('should render body with custom className', () => {
      render(
        <Table>
          <TableBody className="custom-body">
            <TableRow>
              <TableCell>Test</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      );
      
      const body = screen.getByRole('rowgroup');
      expect(body).toHaveClass('custom-body');
    });
  });

  describe('Table Footer', () => {
    it('should render table footer when provided', () => {
      render(
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>Test</TableCell>
            </TableRow>
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell>Total: 1</TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      );
      
      expect(screen.getByText('Total: 1')).toBeInTheDocument();
    });

    it('should render footer with custom className', () => {
      render(
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>Test</TableCell>
            </TableRow>
          </TableBody>
          <TableFooter className="custom-footer">
            <TableRow>
              <TableCell>Total: 1</TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      );
      
      const footer = screen.getAllByRole('rowgroup')[1];
      expect(footer).toHaveClass('custom-footer');
    });
  });

  describe('Table Row', () => {
    it('should render table row with proper structure', () => {
      render(
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      );
      
      const row = screen.getByRole('row');
      expect(row).toBeInTheDocument();
      expect(screen.getByText('Name')).toBeInTheDocument();
      expect(screen.getByText('Email')).toBeInTheDocument();
    });

    it('should render row with custom className', () => {
      render(
        <Table>
          <TableBody>
            <TableRow className="custom-row">
              <TableCell>Test</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      );
      
      const row = screen.getByRole('row');
      expect(row).toHaveClass('custom-row');
    });

    it('should handle row click events', async () => {
      const user = userEvent.setup();
      const onRowClick = jest.fn();
      
      render(
        <Table>
          <TableBody>
            <TableRow onClick={onRowClick}>
              <TableCell>Test</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      );
      
      const row = screen.getByRole('row');
      await user.click(row);
      
      expect(onRowClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('Table Cell', () => {
    it('should render table cell with content', () => {
      render(
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>Test Content</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      );
      
      expect(screen.getByText('Test Content')).toBeInTheDocument();
    });

    it('should render cell with custom className', () => {
      render(
        <Table>
          <TableBody>
            <TableRow>
              <TableCell className="custom-cell">Test</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      );
      
      const cell = screen.getByText('Test');
      expect(cell).toHaveClass('custom-cell');
    });

    it('should render cell with proper scope attribute for header cells', () => {
      render(
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead scope="row">Name</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>John</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      );
      
      const headerCell = screen.getByRole('rowheader');
      expect(headerCell).toHaveAttribute('scope', 'row');
    });
  });

  describe('Table Head', () => {
    it('should render table head with proper accessibility', () => {
      render(
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>John</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      );
      
      const headCell = screen.getByRole('columnheader');
      expect(headCell).toBeInTheDocument();
      expect(headCell).toHaveTextContent('Name');
    });

    it('should render head with custom className', () => {
      render(
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="custom-head">Name</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>John</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      );
      
      const headCell = screen.getByRole('columnheader');
      expect(headCell).toHaveClass('custom-head');
    });
  });

  describe('Complex Table Structure', () => {
    it('should render complete table with header, body, and footer', () => {
      render(
        <Table>
          <TableCaption>User Management</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockData.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.id}</TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={4}>Total Users: {mockData.length}</TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      );
      
      expect(screen.getByText('User Management')).toBeInTheDocument();
      expect(screen.getByText('ID')).toBeInTheDocument();
      expect(screen.getByText('Name')).toBeInTheDocument();
      expect(screen.getByText('Email')).toBeInTheDocument();
      expect(screen.getByText('Role')).toBeInTheDocument();
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
      expect(screen.getByText('Bob Johnson')).toBeInTheDocument();
      expect(screen.getByText('Total Users: 3')).toBeInTheDocument();
    });

    it('should handle empty table body', () => {
      render(
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {/* Empty body */}
          </TableBody>
        </Table>
      );
      
      const table = screen.getByRole('table');
      expect(table).toBeInTheDocument();
      expect(screen.getByText('Name')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper table structure for screen readers', () => {
      render(
        <Table>
          <TableCaption>User List</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead scope="col">Name</TableHead>
              <TableHead scope="col">Email</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>John Doe</TableCell>
              <TableCell>john@example.com</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      );
      
      const table = screen.getByRole('table');
      const caption = screen.getByText('User List');
      const headerCells = screen.getAllByRole('columnheader');
      const dataCells = screen.getAllByRole('cell');
      
      expect(table).toBeInTheDocument();
      expect(caption).toBeInTheDocument();
      expect(headerCells).toHaveLength(2);
      expect(dataCells).toHaveLength(2);
    });

    it('should support keyboard navigation', async () => {
      const user = userEvent.setup();
      const onRowClick = jest.fn();
      
      render(
        <Table>
          <TableBody>
            <TableRow onClick={onRowClick} tabIndex={0}>
              <TableCell>Test</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      );
      
      const row = screen.getByRole('row');
      await user.click(row);
      
      expect(onRowClick).toHaveBeenCalledTimes(1);
    });
  });
});

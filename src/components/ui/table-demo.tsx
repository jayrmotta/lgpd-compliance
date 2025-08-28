import React from 'react';
import { Table, TableHeader, TableBody, TableFooter, TableHead, TableRow, TableCell, TableCaption } from './table';
import { Badge } from './badge';
import { Button } from './button';

const invoices = [
  {
    invoice: "INV001",
    paymentStatus: "Paid",
    totalAmount: "$250.00",
    paymentMethod: "Credit Card",
  },
  {
    invoice: "INV002",
    paymentStatus: "Pending",
    totalAmount: "$150.00",
    paymentMethod: "PayPal",
  },
  {
    invoice: "INV003",
    paymentStatus: "Unpaid",
    totalAmount: "$350.00",
    paymentMethod: "Bank Transfer",
  },
  {
    invoice: "INV004",
    paymentStatus: "Paid",
    totalAmount: "$450.00",
    paymentMethod: "Credit Card",
  },
  {
    invoice: "INV005",
    paymentStatus: "Paid",
    totalAmount: "$550.00",
    paymentMethod: "PayPal",
  },
  {
    invoice: "INV006",
    paymentStatus: "Pending",
    totalAmount: "$200.00",
    paymentMethod: "Bank Transfer",
  },
];

const users = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    role: "Admin",
    status: "Active",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@example.com",
    role: "User",
    status: "Active",
  },
  {
    id: 3,
    name: "Bob Johnson",
    email: "bob@example.com",
    role: "User",
    status: "Inactive",
  },
  {
    id: 4,
    name: "Alice Brown",
    email: "alice@example.com",
    role: "Moderator",
    status: "Active",
  },
];

const lgpdRequests = [
  {
    id: "REQ001",
    type: "Data Access",
    status: "Pending",
    submittedDate: "2024-01-15",
    priority: "High",
  },
  {
    id: "REQ002",
    type: "Data Deletion",
    status: "In Progress",
    submittedDate: "2024-01-14",
    priority: "Medium",
  },
  {
    id: "REQ003",
    type: "Data Correction",
    status: "Completed",
    submittedDate: "2024-01-13",
    priority: "Low",
  },
  {
    id: "REQ004",
    type: "Data Portability",
    status: "Pending",
    submittedDate: "2024-01-12",
    priority: "High",
  },
];

export function TableDemo() {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Paid':
      case 'Active':
      case 'Completed':
        return <Badge variant="default" className="bg-green-100 text-green-800">✓ {status}</Badge>;
      case 'Pending':
      case 'In Progress':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">⏳ {status}</Badge>;
      case 'Unpaid':
      case 'Inactive':
        return <Badge variant="destructive" className="bg-red-100 text-red-800">✗ {status}</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'High':
        return <Badge variant="destructive" className="bg-red-100 text-red-800">High</Badge>;
      case 'Medium':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Medium</Badge>;
      case 'Low':
        return <Badge variant="default" className="bg-green-100 text-green-800">Low</Badge>;
      default:
        return <Badge variant="outline">{priority}</Badge>;
    }
  };

  return (
    <div className="space-y-8 p-6">
      <div>
        <h2 className="text-2xl font-bold mb-4">Table Component Examples</h2>
        <p className="text-muted-foreground mb-6">
          Various examples of the Table component in different use cases.
        </p>
      </div>

      {/* Basic Table */}
      <div>
        <h3 className="text-lg font-semibold mb-3">Basic Table</h3>
        <Table>
          <TableCaption>A list of recent invoices.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Invoice</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Method</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoices.map((invoice) => (
              <TableRow key={invoice.invoice}>
                <TableCell className="font-medium">{invoice.invoice}</TableCell>
                <TableCell>{getStatusBadge(invoice.paymentStatus)}</TableCell>
                <TableCell>{invoice.paymentMethod}</TableCell>
                <TableCell className="text-right">{invoice.totalAmount}</TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={3}>Total</TableCell>
              <TableCell className="text-right">$1,950.00</TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>

      {/* User Management Table */}
      <div>
        <h3 className="text-lg font-semibold mb-3">User Management Table</h3>
        <Table>
          <TableCaption>System users and their roles.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">#{user.id}</TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Badge variant="outline">{user.role}</Badge>
                </TableCell>
                <TableCell>{getStatusBadge(user.status)}</TableCell>
                <TableCell className="text-right">
                  <Button variant="outline" size="sm" className="mr-2">
                    Edit
                  </Button>
                  <Button variant="outline" size="sm">
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* LGPD Requests Table */}
      <div>
        <h3 className="text-lg font-semibold mb-3">LGPD Compliance Requests</h3>
        <Table>
          <TableCaption>Data protection requests from users.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Request ID</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Submitted Date</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {lgpdRequests.map((request) => (
              <TableRow key={request.id}>
                <TableCell className="font-medium">{request.id}</TableCell>
                <TableCell>{request.type}</TableCell>
                <TableCell>{getStatusBadge(request.status)}</TableCell>
                <TableCell>{request.submittedDate}</TableCell>
                <TableCell>{getPriorityBadge(request.priority)}</TableCell>
                <TableCell className="text-right">
                  <Button variant="outline" size="sm" className="mr-2">
                    View
                  </Button>
                  <Button variant="outline" size="sm">
                    Process
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={6} className="text-center">
                Total Requests: {lgpdRequests.length}
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>

      {/* Empty State Table */}
      <div>
        <h3 className="text-lg font-semibold mb-3">Empty State Table</h3>
        <Table>
          <TableCaption>No data available.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {/* Empty body */}
          </TableBody>
        </Table>
      </div>

      {/* Interactive Table */}
      <div>
        <h3 className="text-lg font-semibold mb-3">Interactive Table (Clickable Rows)</h3>
        <Table>
          <TableCaption>Click on rows to view details.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.slice(0, 3).map((user) => (
              <TableRow 
                key={user.id}
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => alert(`Clicked on ${user.name}`)}
              >
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Badge variant="outline">{user.role}</Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

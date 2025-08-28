import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './tabs';

export function TabsDemo() {
  return (
    <div className="w-full max-w-4xl mx-auto p-6 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Tabs Component</h1>
        <p className="text-muted-foreground">
          A set of layered sections of content—known as tab panels—that are displayed one at a time.
        </p>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-xl font-semibold">Basic Tabs</h2>
          <p className="text-sm text-muted-foreground">
            Simple tabs with default styling.
          </p>
        </div>

        <Tabs defaultValue="account" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="password">Password</TabsTrigger>
          </TabsList>
          <TabsContent value="account" className="space-y-4">
            <div className="space-y-2">
              <h4 className="text-sm font-medium leading-none">Account Settings</h4>
              <p className="text-sm text-muted-foreground">
                Make changes to your account here. Click save when you&apos;re done.
              </p>
            </div>
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">Name</label>
              <input
                id="name"
                placeholder="Enter your name"
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">Email</label>
              <input
                id="email"
                type="email"
                placeholder="Enter your email"
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
          </TabsContent>
          <TabsContent value="password" className="space-y-4">
            <div className="space-y-2">
              <h4 className="text-sm font-medium leading-none">Password Settings</h4>
              <p className="text-sm text-muted-foreground">
                Change your password here. After saving, you&apos;ll be logged out.
              </p>
            </div>
            <div className="space-y-2">
              <label htmlFor="current" className="text-sm font-medium">Current Password</label>
              <input
                id="current"
                type="password"
                placeholder="Enter current password"
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="new" className="text-sm font-medium">New Password</label>
              <input
                id="new"
                type="password"
                placeholder="Enter new password"
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-xl font-semibold">Multiple Tabs</h2>
          <p className="text-sm text-muted-foreground">
            Tabs with multiple sections and different content types.
          </p>
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-4">
            <div className="space-y-2">
              <h4 className="text-sm font-medium leading-none">Overview</h4>
              <p className="text-sm text-muted-foreground">
                Get a quick overview of your dashboard and recent activity.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 border rounded-lg">
                <h5 className="font-semibold">Total Users</h5>
                <p className="text-2xl font-bold">1,234</p>
                <p className="text-sm text-green-600">+12% from last month</p>
              </div>
              <div className="p-4 border rounded-lg">
                <h5 className="font-semibold">Active Sessions</h5>
                <p className="text-2xl font-bold">567</p>
                <p className="text-sm text-blue-600">+5% from last month</p>
              </div>
              <div className="p-4 border rounded-lg">
                <h5 className="font-semibold">Revenue</h5>
                <p className="text-2xl font-bold">$12,345</p>
                <p className="text-sm text-green-600">+8% from last month</p>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="analytics" className="space-y-4">
            <div className="space-y-2">
              <h4 className="text-sm font-medium leading-none">Analytics</h4>
              <p className="text-sm text-muted-foreground">
                View detailed analytics and performance metrics.
              </p>
            </div>
            <div className="p-8 border rounded-lg bg-muted/50">
              <p className="text-center text-muted-foreground">Analytics chart would go here</p>
            </div>
          </TabsContent>
          <TabsContent value="reports" className="space-y-4">
            <div className="space-y-2">
              <h4 className="text-sm font-medium leading-none">Reports</h4>
              <p className="text-sm text-muted-foreground">
                Generate and download various reports.
              </p>
            </div>
            <div className="space-y-2">
              <button className="w-full px-4 py-2 text-left border rounded-lg hover:bg-muted">
                <div className="font-medium">Monthly Report</div>
                <div className="text-sm text-muted-foreground">Download PDF</div>
              </button>
              <button className="w-full px-4 py-2 text-left border rounded-lg hover:bg-muted">
                <div className="font-medium">User Activity Report</div>
                <div className="text-sm text-muted-foreground">Download CSV</div>
              </button>
              <button className="w-full px-4 py-2 text-left border rounded-lg hover:bg-muted">
                <div className="font-medium">Revenue Report</div>
                <div className="text-sm text-muted-foreground">Download Excel</div>
              </button>
            </div>
          </TabsContent>
          <TabsContent value="notifications" className="space-y-4">
            <div className="space-y-2">
              <h4 className="text-sm font-medium leading-none">Notifications</h4>
              <p className="text-sm text-muted-foreground">
                Manage your notification preferences.
              </p>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Email Notifications</div>
                  <div className="text-sm text-muted-foreground">Receive email updates</div>
                </div>
                <input type="checkbox" className="w-4 h-4" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Push Notifications</div>
                  <div className="text-sm text-muted-foreground">Receive push notifications</div>
                </div>
                <input type="checkbox" className="w-4 h-4" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">SMS Notifications</div>
                  <div className="text-sm text-muted-foreground">Receive SMS updates</div>
                </div>
                <input type="checkbox" className="w-4 h-4" />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-xl font-semibold">Disabled Tabs</h2>
          <p className="text-sm text-muted-foreground">
            Tabs with disabled states for unavailable features.
          </p>
        </div>

        <Tabs defaultValue="available" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="available">Available</TabsTrigger>
            <TabsTrigger value="disabled" disabled>Disabled</TabsTrigger>
            <TabsTrigger value="premium" disabled>Premium</TabsTrigger>
          </TabsList>
          <TabsContent value="available" className="space-y-4">
            <div className="space-y-2">
              <h4 className="text-sm font-medium leading-none">Available Features</h4>
              <p className="text-sm text-muted-foreground">
                These features are available in your current plan.
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <ul className="space-y-2 text-sm">
                <li>✓ Basic analytics</li>
                <li>✓ Standard reports</li>
                <li>✓ Email support</li>
              </ul>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-xl font-semibold">Features</h2>
          <p className="text-sm text-muted-foreground">
            This tabs component includes:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-4 border rounded-lg">
            <h3 className="font-semibold mb-2">Accessibility</h3>
            <p className="text-sm text-muted-foreground">
              Built with proper ARIA attributes and keyboard navigation for screen readers.
            </p>
          </div>
          <div className="p-4 border rounded-lg">
            <h3 className="font-semibold mb-2">Keyboard Navigation</h3>
            <p className="text-sm text-muted-foreground">
              Navigate between tabs using arrow keys, Enter, and Space.
            </p>
          </div>
          <div className="p-4 border rounded-lg">
            <h3 className="font-semibold mb-2">Customizable</h3>
            <p className="text-sm text-muted-foreground">
              Easy to customize styles, layouts, and behavior with CSS classes.
            </p>
          </div>
          <div className="p-4 border rounded-lg">
            <h3 className="font-semibold mb-2">TypeScript</h3>
            <p className="text-sm text-muted-foreground">
              Fully typed with TypeScript for better development experience.
            </p>
          </div>
          <div className="p-4 border rounded-lg">
            <h3 className="font-semibold mb-2">Responsive Design</h3>
            <p className="text-sm text-muted-foreground">
              Adapts to different screen sizes with proper grid layouts.
            </p>
          </div>
          <div className="p-4 border rounded-lg">
            <h3 className="font-semibold mb-2">Radix UI</h3>
            <p className="text-sm text-muted-foreground">
              Built on top of Radix UI primitives for robust functionality.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-xl font-semibold">Usage Examples</h2>
          <p className="text-sm text-muted-foreground">
            Different ways to use the tabs component.
          </p>
        </div>

        <div className="space-y-4">
          <div className="p-4 border rounded-lg">
            <h3 className="font-semibold mb-2">Settings Panel</h3>
            <Tabs defaultValue="general" className="w-full">
              <TabsList>
                <TabsTrigger value="general">General</TabsTrigger>
                <TabsTrigger value="privacy">Privacy</TabsTrigger>
                <TabsTrigger value="security">Security</TabsTrigger>
              </TabsList>
              <TabsContent value="general">General settings content</TabsContent>
              <TabsContent value="privacy">Privacy settings content</TabsContent>
              <TabsContent value="security">Security settings content</TabsContent>
            </Tabs>
          </div>

          <div className="p-4 border rounded-lg">
            <h3 className="font-semibold mb-2">Documentation</h3>
            <Tabs defaultValue="installation" className="w-full">
              <TabsList>
                <TabsTrigger value="installation">Installation</TabsTrigger>
                <TabsTrigger value="usage">Usage</TabsTrigger>
                <TabsTrigger value="api">API</TabsTrigger>
              </TabsList>
              <TabsContent value="installation">Installation guide content</TabsContent>
              <TabsContent value="usage">Usage examples content</TabsContent>
              <TabsContent value="api">API reference content</TabsContent>
            </Tabs>
          </div>

          <div className="p-4 border rounded-lg">
            <h3 className="font-semibold mb-2">Product Details</h3>
            <Tabs defaultValue="description" className="w-full">
              <TabsList>
                <TabsTrigger value="description">Description</TabsTrigger>
                <TabsTrigger value="specifications">Specifications</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
              </TabsList>
              <TabsContent value="description">Product description content</TabsContent>
              <TabsContent value="specifications">Product specifications content</TabsContent>
              <TabsContent value="reviews">Customer reviews content</TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}

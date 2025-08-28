import React from 'react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from './breadcrumb';

export function BreadcrumbDemo() {
  return (
    <div className="w-full max-w-4xl mx-auto p-6 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Breadcrumb Component</h1>
        <p className="text-muted-foreground">
          A navigation component that shows the current page&apos;s location within a site hierarchy.
        </p>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-xl font-semibold">Basic Breadcrumb</h2>
          <p className="text-sm text-muted-foreground">
            Simple breadcrumb with default separator.
          </p>
        </div>

        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/products">Products</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Current Product</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-xl font-semibold">Custom Separator</h2>
          <p className="text-sm text-muted-foreground">
            Breadcrumb with custom separator icon.
          </p>
        </div>

        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>→</BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbLink href="/category">Category</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>→</BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbPage>Current Page</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-xl font-semibold">Deep Navigation</h2>
          <p className="text-sm text-muted-foreground">
            Breadcrumb with multiple levels of navigation.
          </p>
        </div>

        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/admin">Admin</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/admin/users">Users</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/admin/users/123">User Details</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Edit Profile</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-xl font-semibold">External Links</h2>
          <p className="text-sm text-muted-foreground">
            Breadcrumb with external links that open in new tabs.
          </p>
        </div>

        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="https://docs.example.com" external>
                Documentation
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Current Page</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-xl font-semibold">Features</h2>
          <p className="text-sm text-muted-foreground">
            This breadcrumb component includes:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-4 border rounded-lg">
            <h3 className="font-semibold mb-2">Accessibility</h3>
            <p className="text-sm text-muted-foreground">
              Built with proper ARIA attributes and semantic HTML for screen readers.
            </p>
          </div>
          <div className="p-4 border rounded-lg">
            <h3 className="font-semibold mb-2">Responsive Design</h3>
            <p className="text-sm text-muted-foreground">
              Adapts to different screen sizes with proper text wrapping.
            </p>
          </div>
          <div className="p-4 border rounded-lg">
            <h3 className="font-semibold mb-2">Customizable</h3>
            <p className="text-sm text-muted-foreground">
              Easy to customize separators, styles, and link behavior.
            </p>
          </div>
          <div className="p-4 border rounded-lg">
            <h3 className="font-semibold mb-2">External Links</h3>
            <p className="text-sm text-muted-foreground">
              Automatic handling of external links with proper security attributes.
            </p>
          </div>
          <div className="p-4 border rounded-lg">
            <h3 className="font-semibold mb-2">TypeScript</h3>
            <p className="text-sm text-muted-foreground">
              Fully typed with TypeScript for better development experience.
            </p>
          </div>
          <div className="p-4 border rounded-lg">
            <h3 className="font-semibold mb-2">Next.js Integration</h3>
            <p className="text-sm text-muted-foreground">
              Seamless integration with Next.js Link component for internal navigation.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-xl font-semibold">Usage Examples</h2>
          <p className="text-sm text-muted-foreground">
            Different ways to use the breadcrumb component.
          </p>
        </div>

        <div className="space-y-4">
          <div className="p-4 border rounded-lg">
            <h3 className="font-semibold mb-2">Simple Navigation</h3>
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/">Home</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>About</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>

          <div className="p-4 border rounded-lg">
            <h3 className="font-semibold mb-2">E-commerce Navigation</h3>
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/">Home</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink href="/electronics">Electronics</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink href="/electronics/computers">Computers</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Laptops</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>

          <div className="p-4 border rounded-lg">
            <h3 className="font-semibold mb-2">Documentation Navigation</h3>
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/docs">Docs</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink href="/docs/getting-started">Getting Started</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Installation</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </div>
      </div>
    </div>
  );
}

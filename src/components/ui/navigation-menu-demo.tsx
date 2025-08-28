import React from 'react';
import Link from 'next/link';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from './navigation-menu';
import { cn } from '@/lib/utils';

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  )
})
ListItem.displayName = "ListItem"

export function NavigationMenuDemo() {
  return (
    <div className="w-full max-w-4xl mx-auto p-6 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Navigation Menu Component</h1>
        <p className="text-muted-foreground">
          A comprehensive navigation menu with dropdown support, keyboard navigation, and accessibility features.
        </p>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-xl font-semibold">Basic Navigation Menu</h2>
          <p className="text-sm text-muted-foreground">
            Simple navigation with links and dropdown menus.
          </p>
        </div>

        <NavigationMenu className="w-full justify-start">
          <NavigationMenuList>
                         <NavigationMenuItem>
               <NavigationMenuLink asChild>
                 <Link href="/" className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50">
                   Home
                 </Link>
               </NavigationMenuLink>
             </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Products</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-[.75fr_1fr] lg:w-[600px]">
                                     <li className="row-span-3">
                     <NavigationMenuLink asChild>
                       <Link
                         className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                         href="/"
                       >
                         <div className="mb-2 mt-4 text-lg font-medium">
                           shadcn/ui
                         </div>
                         <p className="text-sm leading-tight text-muted-foreground">
                           Beautifully designed components built with Radix UI and Tailwind CSS.
                         </p>
                       </Link>
                     </NavigationMenuLink>
                   </li>
                  <ListItem href="/docs" title="Introduction">
                    Re-usable components built using Radix UI and Tailwind CSS.
                  </ListItem>
                  <ListItem href="/docs/installation" title="Installation">
                    How to install dependencies and structure your app.
                  </ListItem>
                  <ListItem href="/docs/primitives/typography" title="Typography">
                    Styles for headings, paragraphs, lists...etc
                  </ListItem>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Company</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                  <ListItem href="/about" title="About Us">
                    Learn about our mission and values.
                  </ListItem>
                  <ListItem href="/team" title="Our Team">
                    Meet the people behind our company.
                  </ListItem>
                  <ListItem href="/careers" title="Careers">
                    Join our team and grow with us.
                  </ListItem>
                  <ListItem href="/contact" title="Contact">
                    Get in touch with our support team.
                  </ListItem>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
                         <NavigationMenuItem>
               <NavigationMenuLink asChild>
                 <Link href="/blog" className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50">
                   Blog
                 </Link>
               </NavigationMenuLink>
             </NavigationMenuItem>
          </NavigationMenuList>
          <NavigationMenuViewport />
        </NavigationMenu>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-xl font-semibold">Features</h2>
          <p className="text-sm text-muted-foreground">
            This navigation menu component includes:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-4 border rounded-lg">
            <h3 className="font-semibold mb-2">Keyboard Navigation</h3>
            <p className="text-sm text-muted-foreground">
              Full keyboard support with arrow keys, Enter, Escape, and Tab navigation.
            </p>
          </div>
          <div className="p-4 border rounded-lg">
            <h3 className="font-semibold mb-2">Accessibility</h3>
            <p className="text-sm text-muted-foreground">
              Built with ARIA attributes and screen reader support for WCAG compliance.
            </p>
          </div>
          <div className="p-4 border rounded-lg">
            <h3 className="font-semibold mb-2">Responsive Design</h3>
            <p className="text-sm text-muted-foreground">
              Adapts to different screen sizes with mobile-friendly interactions.
            </p>
          </div>
          <div className="p-4 border rounded-lg">
            <h3 className="font-semibold mb-2">Customizable</h3>
            <p className="text-sm text-muted-foreground">
              Easy to customize with Tailwind CSS classes and custom styling.
            </p>
          </div>
          <div className="p-4 border rounded-lg">
            <h3 className="font-semibold mb-2">Animation</h3>
            <p className="text-sm text-muted-foreground">
              Smooth animations and transitions for opening/closing menus.
            </p>
          </div>
          <div className="p-4 border rounded-lg">
            <h3 className="font-semibold mb-2">TypeScript</h3>
            <p className="text-sm text-muted-foreground">
              Fully typed with TypeScript for better development experience.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-xl font-semibold">Usage Examples</h2>
          <p className="text-sm text-muted-foreground">
            Different ways to use the navigation menu component.
          </p>
        </div>

        <div className="space-y-4">
                     <div className="p-4 border rounded-lg">
             <h3 className="font-semibold mb-2">Simple Link</h3>
             <NavigationMenu>
               <NavigationMenuList>
                 <NavigationMenuItem>
                   <NavigationMenuLink asChild>
                     <Link href="/simple" className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50">
                       Simple Link
                     </Link>
                   </NavigationMenuLink>
                 </NavigationMenuItem>
               </NavigationMenuList>
             </NavigationMenu>
           </div>

          <div className="p-4 border rounded-lg">
            <h3 className="font-semibold mb-2">Dropdown Menu</h3>
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger>Dropdown</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[200px] gap-3 p-4">
                      <ListItem href="/item1" title="Item 1">
                        First dropdown item
                      </ListItem>
                      <ListItem href="/item2" title="Item 2">
                        Second dropdown item
                      </ListItem>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
              <NavigationMenuViewport />
            </NavigationMenu>
          </div>

          <div className="p-4 border rounded-lg">
            <h3 className="font-semibold mb-2">External Link</h3>
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuLink href="https://example.com" external className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50">
                    External Link
                  </NavigationMenuLink>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>
        </div>
      </div>
    </div>
  );
}

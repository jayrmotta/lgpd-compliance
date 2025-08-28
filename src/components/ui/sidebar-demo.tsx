import React from 'react'
import { Sidebar, SidebarHeader, SidebarContent, SidebarFooter } from './sidebar'
import { Button } from './button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './card'

export function SidebarDemo() {
  return (
    <div className="space-y-8 p-6">
      <div>
        <h2 className="text-2xl font-bold mb-4">Sidebar Component</h2>
        <p className="text-muted-foreground mb-6">
          A flexible sidebar component for navigation and layout.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Default Sidebar */}
        <Card>
          <CardHeader>
            <CardTitle>Default Sidebar</CardTitle>
            <CardDescription>
              Standard sidebar with header, content, and footer
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-96 border rounded-lg overflow-hidden">
              <Sidebar>
                <SidebarHeader>
                  <h3 className="font-semibold">Application</h3>
                </SidebarHeader>
                <SidebarContent className="p-4">
                  <nav className="space-y-2">
                    <Button variant="ghost" className="w-full justify-start">
                      Dashboard
                    </Button>
                    <Button variant="ghost" className="w-full justify-start">
                      Users
                    </Button>
                    <Button variant="ghost" className="w-full justify-start">
                      Settings
                    </Button>
                  </nav>
                </SidebarContent>
                <SidebarFooter>
                  <Button variant="outline" className="w-full">
                    Logout
                  </Button>
                </SidebarFooter>
              </Sidebar>
            </div>
          </CardContent>
        </Card>

        {/* Compact Sidebar */}
        <Card>
          <CardHeader>
            <CardTitle>Compact Sidebar</CardTitle>
            <CardDescription>
              Narrow sidebar for space-constrained layouts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-96 border rounded-lg overflow-hidden">
              <Sidebar variant="compact">
                <SidebarHeader>
                  <div className="w-8 h-8 bg-primary rounded" />
                </SidebarHeader>
                <SidebarContent className="p-2">
                  <nav className="space-y-2">
                    <Button variant="ghost" size="sm" className="w-full h-10">
                      📊
                    </Button>
                    <Button variant="ghost" size="sm" className="w-full h-10">
                      👥
                    </Button>
                    <Button variant="ghost" size="sm" className="w-full h-10">
                      ⚙️
                    </Button>
                  </nav>
                </SidebarContent>
                <SidebarFooter>
                  <Button variant="outline" size="sm" className="w-full h-10">
                    🚪
                  </Button>
                </SidebarFooter>
              </Sidebar>
            </div>
          </CardContent>
        </Card>

        {/* Right Position Sidebar */}
        <Card>
          <CardHeader>
            <CardTitle>Right Position Sidebar</CardTitle>
            <CardDescription>
              Sidebar positioned on the right side
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-96 border rounded-lg overflow-hidden">
              <Sidebar position="right">
                <SidebarHeader>
                  <h3 className="font-semibold">Tools</h3>
                </SidebarHeader>
                <SidebarContent className="p-4">
                  <nav className="space-y-2">
                    <Button variant="ghost" className="w-full justify-start">
                      Search
                    </Button>
                    <Button variant="ghost" className="w-full justify-start">
                      Filters
                    </Button>
                    <Button variant="ghost" className="w-full justify-start">
                      Export
                    </Button>
                  </nav>
                </SidebarContent>
                <SidebarFooter>
                  <Button variant="outline" className="w-full">
                    Help
                  </Button>
                </SidebarFooter>
              </Sidebar>
            </div>
          </CardContent>
        </Card>

        {/* Custom Styled Sidebar */}
        <Card>
          <CardHeader>
            <CardTitle>Custom Styled Sidebar</CardTitle>
            <CardDescription>
              Sidebar with custom styling and colors
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-96 border rounded-lg overflow-hidden">
              <Sidebar className="bg-gradient-to-b from-blue-50 to-blue-100 border-blue-200">
                <SidebarHeader className="bg-blue-200 border-blue-300">
                  <h3 className="font-semibold text-blue-900">Custom Theme</h3>
                </SidebarHeader>
                <SidebarContent className="p-4">
                  <nav className="space-y-2">
                    <Button variant="ghost" className="w-full justify-start text-blue-700 hover:bg-blue-200">
                      Home
                    </Button>
                    <Button variant="ghost" className="w-full justify-start text-blue-700 hover:bg-blue-200">
                      Profile
                    </Button>
                    <Button variant="ghost" className="w-full justify-start text-blue-700 hover:bg-blue-200">
                      Messages
                    </Button>
                  </nav>
                </SidebarContent>
                <SidebarFooter className="bg-blue-200 border-blue-300">
                  <Button variant="outline" className="w-full border-blue-300 text-blue-700">
                    Settings
                  </Button>
                </SidebarFooter>
              </Sidebar>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Layout Example */}
      <Card>
        <CardHeader>
          <CardTitle>Layout Example</CardTitle>
          <CardDescription>
            How to use sidebar in a full layout
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-96 border rounded-lg overflow-hidden">
            <div className="flex h-full">
              <Sidebar>
                <SidebarHeader>
                  <h3 className="font-semibold">LGPD Platform</h3>
                </SidebarHeader>
                <SidebarContent className="p-4">
                  <nav className="space-y-2">
                    <Button variant="ghost" className="w-full justify-start">
                      Dashboard
                    </Button>
                    <Button variant="ghost" className="w-full justify-start">
                      LGPD Requests
                    </Button>
                    <Button variant="ghost" className="w-full justify-start">
                      My Requests
                    </Button>
                    <Button variant="ghost" className="w-full justify-start">
                      Company Setup
                    </Button>
                  </nav>
                </SidebarContent>
                <SidebarFooter>
                  <Button variant="outline" className="w-full">
                    Logout
                  </Button>
                </SidebarFooter>
              </Sidebar>
              <div className="flex-1 p-6 bg-gray-50">
                <h2 className="text-xl font-semibold mb-4">Main Content Area</h2>
                <p className="text-gray-600">
                  This is the main content area that would contain your application&apos;s primary content.
                  The sidebar provides navigation while this area displays the selected content.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

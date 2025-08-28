import React, { useState } from 'react'
import { Switch } from './switch'
import { Label } from './label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './card'

export function SwitchDemo() {
  const [notifications, setNotifications] = useState(false)
  const [marketing, setMarketing] = useState(true)
  const [darkMode, setDarkMode] = useState(false)
  const [autoSave, setAutoSave] = useState(true)

  return (
    <div className="space-y-8 p-6">
      <div>
        <h2 className="text-2xl font-bold mb-4">Switch Component</h2>
        <p className="text-muted-foreground mb-6">
          A toggle switch component for boolean states and settings.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Basic Switch */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Switch</CardTitle>
            <CardDescription>
              Simple toggle switch with default styling
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="basic"
                checked={notifications}
                onCheckedChange={setNotifications}
              />
              <Label htmlFor="basic">Enable notifications</Label>
            </div>
            <div className="text-sm text-muted-foreground">
              Current state: {notifications ? 'Enabled' : 'Disabled'}
            </div>
          </CardContent>
        </Card>

        {/* Controlled Switch */}
        <Card>
          <CardHeader>
            <CardTitle>Controlled Switch</CardTitle>
            <CardDescription>
              Switch with controlled state management
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="controlled"
                checked={marketing}
                onCheckedChange={setMarketing}
              />
              <Label htmlFor="controlled">Marketing emails</Label>
            </div>
            <div className="text-sm text-muted-foreground">
              Current state: {marketing ? 'Enabled' : 'Disabled'}
            </div>
          </CardContent>
        </Card>

        {/* Disabled Switch */}
        <Card>
          <CardHeader>
            <CardTitle>Disabled Switch</CardTitle>
            <CardDescription>
              Switch that cannot be interacted with
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch id="disabled" disabled />
              <Label htmlFor="disabled" className="text-muted-foreground">
                Disabled option
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="disabled-checked" disabled checked />
              <Label htmlFor="disabled-checked" className="text-muted-foreground">
                Disabled (checked)
              </Label>
            </div>
          </CardContent>
        </Card>

        {/* Multiple Switches */}
        <Card>
          <CardHeader>
            <CardTitle>Settings Panel</CardTitle>
            <CardDescription>
              Multiple switches for application settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="dark-mode">Dark mode</Label>
                <div className="text-sm text-muted-foreground">
                  Switch to dark theme
                </div>
              </div>
              <Switch
                id="dark-mode"
                checked={darkMode}
                onCheckedChange={setDarkMode}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="auto-save">Auto save</Label>
                <div className="text-sm text-muted-foreground">
                  Automatically save changes
                </div>
              </div>
              <Switch
                id="auto-save"
                checked={autoSave}
                onCheckedChange={setAutoSave}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Advanced Usage */}
      <Card>
        <CardHeader>
          <CardTitle>Advanced Usage</CardTitle>
          <CardDescription>
            Switch with custom styling and accessibility features
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center space-x-2">
            <Switch
              id="custom"
              className="data-[state=checked]:bg-green-600"
              aria-label="Custom styled switch"
            />
            <Label htmlFor="custom">Custom styled switch</Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch
              id="large"
              className="h-8 w-14 data-[state=checked]:bg-blue-600"
              aria-label="Large switch"
            />
            <Label htmlFor="large">Large switch</Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch
              id="small"
              className="h-4 w-8 data-[state=checked]:bg-purple-600"
              aria-label="Small switch"
            />
            <Label htmlFor="small">Small switch</Label>
          </div>
        </CardContent>
      </Card>

      {/* State Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Current Settings</CardTitle>
          <CardDescription>
            Summary of all switch states
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Notifications:</span>
              <span className={notifications ? 'text-green-600' : 'text-red-600'}>
                {notifications ? 'Enabled' : 'Disabled'}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Marketing emails:</span>
              <span className={marketing ? 'text-green-600' : 'text-red-600'}>
                {marketing ? 'Enabled' : 'Disabled'}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Dark mode:</span>
              <span className={darkMode ? 'text-green-600' : 'text-red-600'}>
                {darkMode ? 'Enabled' : 'Disabled'}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Auto save:</span>
              <span className={autoSave ? 'text-green-600' : 'text-red-600'}>
                {autoSave ? 'Enabled' : 'Disabled'}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

import React, { useState } from 'react'
import { Textarea } from './textarea'
import { Label } from './label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './card'

export function TextareaDemo() {
  const [value, setValue] = useState('')
  const [errorValue, setErrorValue] = useState('')
  const [successValue, setSuccessValue] = useState('')

  return (
    <div className="space-y-8 p-6">
      <div>
        <h2 className="text-2xl font-bold mb-4">Textarea Component</h2>
        <p className="text-muted-foreground mb-6">
          A versatile textarea component with multiple variants and sizes.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Default Textarea */}
        <Card>
          <CardHeader>
            <CardTitle>Default Textarea</CardTitle>
            <CardDescription>
              Standard textarea with default styling
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="default">Description</Label>
              <Textarea
                id="default"
                placeholder="Enter your description here..."
                value={value}
                onChange={(e) => setValue(e.target.value)}
              />
            </div>
            <div className="text-sm text-muted-foreground">
              Character count: {value.length}
            </div>
          </CardContent>
        </Card>

        {/* Error Variant */}
        <Card>
          <CardHeader>
            <CardTitle>Error State</CardTitle>
            <CardDescription>
              Textarea with error styling
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="error">Error Field</Label>
              <Textarea
                id="error"
                variant="error"
                placeholder="This field has an error..."
                value={errorValue}
                onChange={(e) => setErrorValue(e.target.value)}
              />
            </div>
            <div className="text-sm text-destructive">
              This field is required
            </div>
          </CardContent>
        </Card>

        {/* Success Variant */}
        <Card>
          <CardHeader>
            <CardTitle>Success State</CardTitle>
            <CardDescription>
              Textarea with success styling
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="success">Success Field</Label>
              <Textarea
                id="success"
                variant="success"
                placeholder="This field is valid..."
                value={successValue}
                onChange={(e) => setSuccessValue(e.target.value)}
              />
            </div>
            <div className="text-sm text-green-600">
              ✓ Field validation passed
            </div>
          </CardContent>
        </Card>

        {/* Disabled State */}
        <Card>
          <CardHeader>
            <CardTitle>Disabled State</CardTitle>
            <CardDescription>
              Textarea that cannot be edited
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="disabled">Disabled Field</Label>
              <Textarea
                id="disabled"
                disabled
                placeholder="This field is disabled..."
                value="This content cannot be modified"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Size Variants */}
      <Card>
        <CardHeader>
          <CardTitle>Size Variants</CardTitle>
          <CardDescription>
            Different sizes available for the textarea
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="small">Small Size</Label>
            <Textarea
              id="small"
              size="sm"
              placeholder="Small textarea..."
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="medium">Medium Size (Default)</Label>
            <Textarea
              id="medium"
              size="md"
              placeholder="Medium textarea..."
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="large">Large Size</Label>
            <Textarea
              id="large"
              size="lg"
              placeholder="Large textarea..."
            />
          </div>
        </CardContent>
      </Card>

      {/* Advanced Features */}
      <Card>
        <CardHeader>
          <CardTitle>Advanced Features</CardTitle>
          <CardDescription>
            Textarea with additional HTML attributes
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="advanced">Advanced Textarea</Label>
            <Textarea
              id="advanced"
              rows={6}
              cols={50}
              maxLength={500}
              placeholder="This textarea has custom rows, cols, and maxLength..."
              aria-describedby="advanced-help"
            />
            <div id="advanced-help" className="text-sm text-muted-foreground">
              Maximum 500 characters allowed
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="readonly">Read-only Textarea</Label>
            <Textarea
              id="readonly"
              readOnly
              value="This is read-only content that cannot be modified by the user."
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

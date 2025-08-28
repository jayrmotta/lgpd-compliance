import React, { useState, useEffect } from 'react';
import { Progress } from './progress';
import { Button } from './button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './card';

export function ProgressDemo() {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [formProgress, setFormProgress] = useState(0);
  const [loadingProgress, setLoadingProgress] = useState(0);

  // Simulate file upload
  useEffect(() => {
    if (uploadProgress < 100) {
      const timer = setTimeout(() => {
        setUploadProgress(prev => Math.min(prev + Math.random() * 10, 100));
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [uploadProgress]);

  // Simulate download
  useEffect(() => {
    if (downloadProgress < 100) {
      const timer = setTimeout(() => {
        setDownloadProgress(prev => Math.min(prev + Math.random() * 15, 100));
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [downloadProgress]);

  // Simulate form completion
  useEffect(() => {
    if (formProgress < 100) {
      const timer = setTimeout(() => {
        setFormProgress(prev => Math.min(prev + Math.random() * 20, 100));
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [formProgress]);

  // Simulate loading
  useEffect(() => {
    if (loadingProgress < 100) {
      const timer = setTimeout(() => {
        setLoadingProgress(prev => Math.min(prev + Math.random() * 5, 100));
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [loadingProgress]);

  const resetProgress = (setter: React.Dispatch<React.SetStateAction<number>>) => {
    setter(0);
  };

  return (
    <div className="space-y-8 p-6">
      <div>
        <h2 className="text-2xl font-bold mb-4">Progress Component Examples</h2>
        <p className="text-muted-foreground mb-6">
          Various examples of the Progress component in different use cases.
        </p>
      </div>

      {/* Basic Progress Examples */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Basic Progress</CardTitle>
            <CardDescription>Simple progress indicators with different values</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>25% Complete</span>
                <span>25%</span>
              </div>
              <Progress value={25} />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>50% Complete</span>
                <span>50%</span>
              </div>
              <Progress value={50} />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>75% Complete</span>
                <span>75%</span>
              </div>
              <Progress value={75} />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>100% Complete</span>
                <span>100%</span>
              </div>
              <Progress value={100} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Edge Cases</CardTitle>
            <CardDescription>Progress with boundary values and edge cases</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>0% Complete</span>
                <span>0%</span>
              </div>
              <Progress value={0} />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Indeterminate</span>
                <span>--</span>
              </div>
              <Progress value={undefined} />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Decimal Value (33.5%)</span>
                <span>33.5%</span>
              </div>
              <Progress value={33.5} />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Clamped Value (150% → 100%)</span>
                <span>100%</span>
              </div>
              <Progress value={150} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Real-world Examples */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>File Upload Progress</CardTitle>
            <CardDescription>Simulated file upload with real-time progress</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Uploading document.pdf</span>
                <span>{Math.round(uploadProgress)}%</span>
              </div>
              <Progress value={uploadProgress} aria-label="File upload progress" />
            </div>
            <Button 
              onClick={() => resetProgress(setUploadProgress)}
              disabled={uploadProgress < 100}
              className="w-full"
            >
              {uploadProgress < 100 ? 'Uploading...' : 'Upload Complete - Reset'}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Download Progress</CardTitle>
            <CardDescription>Simulated file download with progress tracking</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Downloading large-file.zip</span>
                <span>{Math.round(downloadProgress)}%</span>
              </div>
              <Progress value={downloadProgress} aria-label="Download progress" />
            </div>
            <Button 
              onClick={() => resetProgress(setDownloadProgress)}
              disabled={downloadProgress < 100}
              className="w-full"
            >
              {downloadProgress < 100 ? 'Downloading...' : 'Download Complete - Reset'}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Form and Loading Examples */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Form Completion Progress</CardTitle>
            <CardDescription>Multi-step form completion tracking</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Form Completion</span>
                <span>{Math.round(formProgress)}%</span>
              </div>
              <Progress value={formProgress} aria-label="Form completion progress" />
            </div>
            <div className="text-xs text-muted-foreground">
              {formProgress < 25 && "Step 1: Personal Information"}
              {formProgress >= 25 && formProgress < 50 && "Step 2: Contact Details"}
              {formProgress >= 50 && formProgress < 75 && "Step 3: Preferences"}
              {formProgress >= 75 && formProgress < 100 && "Step 4: Review & Submit"}
              {formProgress >= 100 && "Form submitted successfully!"}
            </div>
            <Button 
              onClick={() => resetProgress(setFormProgress)}
              disabled={formProgress < 100}
              className="w-full"
            >
              {formProgress < 100 ? 'Processing...' : 'Form Complete - Reset'}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Loading Progress</CardTitle>
            <CardDescription>General loading indicator with smooth animation</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Loading Application</span>
                <span>{Math.round(loadingProgress)}%</span>
              </div>
              <Progress value={loadingProgress} aria-label="Loading progress" />
            </div>
            <div className="text-xs text-muted-foreground">
              {loadingProgress < 20 && "Initializing..."}
              {loadingProgress >= 20 && loadingProgress < 40 && "Loading modules..."}
              {loadingProgress >= 40 && loadingProgress < 60 && "Connecting to server..."}
              {loadingProgress >= 60 && loadingProgress < 80 && "Fetching data..."}
              {loadingProgress >= 80 && loadingProgress < 100 && "Finalizing..."}
              {loadingProgress >= 100 && "Ready!"}
            </div>
            <Button 
              onClick={() => resetProgress(setLoadingProgress)}
              disabled={loadingProgress < 100}
              className="w-full"
            >
              {loadingProgress < 100 ? 'Loading...' : 'Loaded - Reset'}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Custom Styling Examples */}
      <Card>
        <CardHeader>
          <CardTitle>Custom Styled Progress</CardTitle>
          <CardDescription>Progress bars with custom styling and colors</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>Success Progress (Green)</span>
              <span>85%</span>
            </div>
            <Progress 
              value={85} 
              className="bg-green-100" 
              aria-label="Success progress"
            />
          </div>
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>Warning Progress (Yellow)</span>
              <span>60%</span>
            </div>
            <Progress 
              value={60} 
              className="bg-yellow-100" 
              aria-label="Warning progress"
            />
          </div>
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>Error Progress (Red)</span>
              <span>30%</span>
            </div>
            <Progress 
              value={30} 
              className="bg-red-100" 
              aria-label="Error progress"
            />
          </div>
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>Large Progress Bar</span>
              <span>45%</span>
            </div>
            <Progress 
              value={45} 
              className="h-6 bg-blue-100" 
              aria-label="Large progress"
            />
          </div>
        </CardContent>
      </Card>

      {/* Accessibility Examples */}
      <Card>
        <CardHeader>
          <CardTitle>Accessibility Examples</CardTitle>
          <CardDescription>Progress bars with proper ARIA labels and descriptions</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label htmlFor="progress-1" className="text-sm font-medium">
              Data Processing Progress
            </label>
            <div className="flex justify-between text-sm mb-2">
              <span>Processing records...</span>
              <span>67%</span>
            </div>
            <Progress 
              id="progress-1"
              value={67} 
              aria-label="Data processing progress"
              aria-describedby="progress-1-description"
            />
            <p id="progress-1-description" className="text-xs text-muted-foreground mt-1">
              Processing 1,234 records from the database
            </p>
          </div>
          <div>
            <label htmlFor="progress-2" className="text-sm font-medium">
              System Update Progress
            </label>
            <div className="flex justify-between text-sm mb-2">
              <span>Installing updates...</span>
              <span>92%</span>
            </div>
            <Progress 
              id="progress-2"
              value={92} 
              aria-label="System update progress"
              aria-describedby="progress-2-description"
            />
            <p id="progress-2-description" className="text-xs text-muted-foreground mt-1">
              Installing security updates and patches
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

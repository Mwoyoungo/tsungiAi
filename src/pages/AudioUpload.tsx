import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { uploadAudioFile } from '@/lib/supabase';
import { 
  Upload, 
  FolderOpen, 
  CheckCircle2, 
  XCircle, 
  Clock,
  FileAudio,
  AlertTriangle,
  RefreshCw
} from 'lucide-react';

interface UploadFile {
  file: File;
  path: string;
  status: 'pending' | 'uploading' | 'success' | 'error';
  progress: number;
  error?: string;
}

const AudioUpload = () => {
  const [uploadFiles, setUploadFiles] = useState<UploadFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [overallProgress, setOverallProgress] = useState(0);
  const [uploadStats, setUploadStats] = useState({
    total: 0,
    completed: 0,
    errors: 0
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle folder selection
  const handleFolderSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    
    // Filter only audio files
    const audioFiles = files.filter(file => 
      file.type.startsWith('audio/') || 
      file.name.toLowerCase().endsWith('.mp3') ||
      file.name.toLowerCase().endsWith('.wav') ||
      file.name.toLowerCase().endsWith('.m4a') ||
      file.name.toLowerCase().endsWith('.ogg')
    );

    // Create upload file objects
    const uploadFileObjects: UploadFile[] = audioFiles.map(file => ({
      file,
      path: file.webkitRelativePath || file.name,
      status: 'pending',
      progress: 0
    }));

    setUploadFiles(uploadFileObjects);
    setUploadStats({
      total: uploadFileObjects.length,
      completed: 0,
      errors: 0
    });
    setOverallProgress(0);
  };

  // Start upload process
  const startUpload = async () => {
    if (uploadFiles.length === 0) return;

    setIsUploading(true);
    let completed = 0;
    let errors = 0;

    // Process files in batches of 3 for better performance
    const batchSize = 3;
    const batches = [];
    
    for (let i = 0; i < uploadFiles.length; i += batchSize) {
      batches.push(uploadFiles.slice(i, i + batchSize));
    }

    for (const batch of batches) {
      await Promise.all(
        batch.map(async (uploadFile, index) => {
          const globalIndex = uploadFiles.findIndex(f => f.path === uploadFile.path);
          
          try {
            // Update status to uploading
            setUploadFiles(prev => prev.map((f, i) => 
              i === globalIndex ? { ...f, status: 'uploading' as const } : f
            ));

            // Upload to Supabase
            const { data, error } = await uploadAudioFile(uploadFile.file, uploadFile.path);

            if (error) {
              throw error;
            }

            // Update as successful
            setUploadFiles(prev => prev.map((f, i) => 
              i === globalIndex ? { 
                ...f, 
                status: 'success' as const, 
                progress: 100 
              } : f
            ));
            
            completed++;
          } catch (error) {
            // Update as error
            setUploadFiles(prev => prev.map((f, i) => 
              i === globalIndex ? { 
                ...f, 
                status: 'error' as const, 
                error: error instanceof Error ? error.message : 'Upload failed'
              } : f
            ));
            
            errors++;
          }

          // Update overall progress
          const totalProcessed = completed + errors;
          const progressPercent = (totalProcessed / uploadFiles.length) * 100;
          setOverallProgress(progressPercent);
          setUploadStats({
            total: uploadFiles.length,
            completed,
            errors
          });
        })
      );
    }

    setIsUploading(false);
  };

  // Clear all files
  const clearFiles = () => {
    setUploadFiles([]);
    setUploadStats({ total: 0, completed: 0, errors: 0 });
    setOverallProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Retry failed uploads
  const retryFailedUploads = () => {
    setUploadFiles(prev => prev.map(f => 
      f.status === 'error' ? { ...f, status: 'pending', error: undefined } : f
    ));
    setUploadStats(prev => ({ ...prev, errors: 0 }));
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'uploading':
        return <RefreshCw className="w-4 h-4 text-blue-500 animate-spin" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const groupFilesByDisk = (files: UploadFile[]) => {
    const groups: { [key: string]: UploadFile[] } = {};
    
    files.forEach(file => {
      const diskMatch = file.path.match(/Disk \d+[^\/]*/);
      const diskName = diskMatch ? diskMatch[0] : 'Other';
      
      if (!groups[diskName]) {
        groups[diskName] = [];
      }
      groups[diskName].push(file);
    });
    
    return groups;
  };

  const fileGroups = groupFilesByDisk(uploadFiles);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">
            Audio File Upload
          </h1>
          <p className="text-muted-foreground">
            Upload your CA1 Sound Revision files to Supabase storage
          </p>
        </div>
        <Badge variant="outline" className="p-2">
          <FileAudio className="w-4 h-4 mr-2" />
          Supabase Storage
        </Badge>
      </div>

      {/* Upload Controls */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FolderOpen className="w-5 h-5" />
            Select CA1 Audio Folder
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
            <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <div className="space-y-2">
              <p className="text-lg font-medium">Select Your CA1 Sound Revision Folder</p>
              <p className="text-sm text-muted-foreground">
                Choose the folder containing all your Disk 1-5 subdirectories
              </p>
            </div>
            
            <input
              ref={fileInputRef}
              type="file"
              /* @ts-ignore */
              webkitdirectory=""
              directory=""
              multiple
              onChange={handleFolderSelect}
              className="hidden"
              accept="audio/*,.mp3,.wav,.m4a,.ogg"
            />
            
            <Button 
              onClick={() => fileInputRef.current?.click()}
              className="mt-4"
              disabled={isUploading}
            >
              <FolderOpen className="w-4 h-4 mr-2" />
              Select Folder
            </Button>
          </div>

          {uploadFiles.length > 0 && (
            <div className="flex gap-2">
              <Button 
                onClick={startUpload} 
                disabled={isUploading || uploadStats.completed === uploadStats.total}
                className="flex-1"
              >
                {isUploading ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Uploading... ({uploadStats.completed}/{uploadStats.total})
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    Start Upload
                  </>
                )}
              </Button>
              
              {uploadStats.errors > 0 && (
                <Button onClick={retryFailedUploads} variant="outline">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Retry Failed
                </Button>
              )}
              
              <Button onClick={clearFiles} variant="outline" disabled={isUploading}>
                Clear All
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Overall Progress */}
      {uploadFiles.length > 0 && (
        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold">Upload Progress</h3>
                <div className="text-sm text-muted-foreground">
                  {uploadStats.completed}/{uploadStats.total} files completed
                </div>
              </div>
              
              <Progress value={overallProgress} className="h-3" />
              
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-blue-500">{uploadStats.total}</div>
                  <div className="text-sm text-muted-foreground">Total</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-500">{uploadStats.completed}</div>
                  <div className="text-sm text-muted-foreground">Completed</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-red-500">{uploadStats.errors}</div>
                  <div className="text-sm text-muted-foreground">Errors</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* File List by Disk */}
      {Object.entries(fileGroups).map(([diskName, files]) => (
        <Card key={diskName} className="shadow-card">
          <CardHeader>
            <CardTitle className="text-lg">{diskName}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {files.map((uploadFile, index) => (
                <div key={index} className="flex items-center gap-3 p-2 rounded-lg bg-card/50">
                  {getStatusIcon(uploadFile.status)}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {uploadFile.file.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {(uploadFile.file.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  </div>
                  {uploadFile.status === 'error' && uploadFile.error && (
                    <div className="text-xs text-red-500 max-w-xs truncate">
                      {uploadFile.error}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Success/Error Alerts */}
      {uploadStats.completed > 0 && uploadStats.completed === uploadStats.total && uploadStats.errors === 0 && (
        <Alert className="border-green-200 bg-green-50/50">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-700">
            All {uploadStats.total} audio files uploaded successfully! You can now access them in the Audio Learning section.
          </AlertDescription>
        </Alert>
      )}

      {uploadStats.errors > 0 && (
        <Alert className="border-orange-200 bg-orange-50/50">
          <AlertTriangle className="h-4 w-4 text-orange-600" />
          <AlertDescription className="text-orange-700">
            {uploadStats.errors} file(s) failed to upload. Click "Retry Failed" to try again.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default AudioUpload;
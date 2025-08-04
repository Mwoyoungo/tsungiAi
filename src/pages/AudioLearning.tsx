import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { listAudioFiles, getAudioUrl } from '@/lib/supabase';
import { 
  Play, 
  Pause, 
  SkipForward, 
  SkipBack, 
  Volume2, 
  Download,
  Clock,
  BookOpen,
  TrendingUp,
  Loader2,
  AlertCircle,
  VolumeX,
  Volume1,
  CheckCircle
} from 'lucide-react';

interface AudioFile {
  name: string;
  path: string;
  url: string;
  disk: string;
  title: string;
  trackNumber: string;
  duration?: string;
  progress: number;
  category: 'CA1';
}

const AudioLearning = () => {
  const [audioFiles, setAudioFiles] = useState<AudioFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(() => {
    const savedVolume = localStorage.getItem('tsungi-ai-volume');
    return savedVolume ? parseFloat(savedVolume) : 1;
  });
  const [trackProgress, setTrackProgress] = useState<{ [key: string]: number }>({});
  const audioRef = useRef<HTMLAudioElement>(null);

  // Load audio files from Supabase on component mount
  useEffect(() => {
    loadAudioFiles();
    loadTrackProgress();
  }, []);

  // Load track progress from localStorage
  const loadTrackProgress = () => {
    const savedProgress = localStorage.getItem('tsungi-ai-track-progress');
    if (savedProgress) {
      setTrackProgress(JSON.parse(savedProgress));
    }
  };

  // Save track progress to localStorage
  const saveTrackProgress = (filePath: string, progressPercent: number) => {
    const newProgress = { ...trackProgress, [filePath]: progressPercent };
    setTrackProgress(newProgress);
    localStorage.setItem('tsungi-ai-track-progress', JSON.stringify(newProgress));
    console.log(`Progress saved: ${filePath} - ${progressPercent}%`);
  };

  // Update audio element when current track changes
  useEffect(() => {
    if (audioRef.current && audioFiles[currentTrack]) {
      audioRef.current.src = audioFiles[currentTrack].url;
      audioRef.current.volume = volume; // Apply current volume setting
      audioRef.current.load();
    }
  }, [currentTrack, audioFiles, volume]);

  // Ensure volume is applied when audio is loaded
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // Keyboard shortcuts for audio control
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Only handle if not typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      switch (e.key) {
        case ' ': // Spacebar for play/pause
          e.preventDefault();
          handlePlayPause();
          break;
        case 'ArrowUp': // Volume up
          e.preventDefault();
          handleVolumeChange(Math.min(1, volume + 0.1));
          break;
        case 'ArrowDown': // Volume down
          e.preventDefault();
          handleVolumeChange(Math.max(0, volume - 0.1));
          break;
        case 'm': // Mute toggle
          e.preventDefault();
          handleVolumeChange(volume === 0 ? 1 : 0);
          break;
        case 'ArrowLeft': // Previous track
          e.preventDefault();
          handlePrevious();
          break;
        case 'ArrowRight': // Next track
          e.preventDefault();
          handleNext();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [volume, isPlaying, currentTrack, audioFiles.length]);

  // Load and organize audio files from Supabase with caching
  const loadAudioFiles = async () => {
    try {
      setLoading(true);
      console.log('Loading audio files...');
      
      // Check cache first
      const cacheKey = 'ca1-audio-files-cache';
      const cacheTimestamp = 'ca1-audio-files-timestamp';
      const cacheExpiry = 24 * 60 * 60 * 1000; // 24 hours
      
      const cachedFiles = localStorage.getItem(cacheKey);
      const cachedTimestamp = localStorage.getItem(cacheTimestamp);
      
      // Use cache if it exists and is not expired
      if (cachedFiles && cachedTimestamp) {
        const isExpired = Date.now() - parseInt(cachedTimestamp) > cacheExpiry;
        if (!isExpired) {
          console.log('Loading from cache...');
          const parsedFiles = JSON.parse(cachedFiles);
          setAudioFiles(parsedFiles);
          setLoading(false);
          return;
        }
      }
      
      console.log('Loading from Supabase...');
      const allFiles: AudioFile[] = [];

      // Define the disk directories based on the actual upload structure
      const diskDirectories = [
        'CA1 Sound Revision/Disk 1 (Part 1- Part 2)',
        'CA1 Sound Revision/Disk 2',
        'CA1 Sound Revision/Disk 3',
        'CA1 Sound Revision/Disk 4',
        'CA1 Sound Revision/Disk 5'
      ];

      // Load files from each disk directory with timeout
      const loadPromises = diskDirectories.map(async (diskDir) => {
        try {
          const { data: files, error: listError } = await Promise.race([
            listAudioFiles(diskDir),
            new Promise((_, reject) => 
              setTimeout(() => reject(new Error('Timeout')), 10000)
            )
          ]) as any;
          
          if (listError) {
            console.error(`Error loading files from ${diskDir}:`, listError);
            return [];
          }

          if (files) {
            return files.filter((file: any) => file.name.endsWith('.mp3')).map((file: any) => {
              const filePath = `${diskDir}/${file.name}`;
              const url = getAudioUrl(filePath);
              
              // Parse track info from filename
              const trackMatch = file.name.match(/^(\d+)\s+(.+)\.mp3$/);
              const trackNumber = trackMatch ? trackMatch[1] : '';
              const title = trackMatch ? trackMatch[2] : file.name.replace('.mp3', '');
              
              // Get just the disk name for display (remove "CA1 Sound Revision/")
              const displayDisk = diskDir.replace('CA1 Sound Revision/', '');
              
              return {
                name: file.name,
                path: filePath,
                url: url,
                disk: displayDisk,
                title: title,
                trackNumber: trackNumber,
                category: 'CA1',
                progress: 0 // Will be calculated from trackProgress state
              };
            });
          }
          return [];
        } catch (error) {
          console.error(`Timeout or error loading ${diskDir}:`, error);
          return [];
        }
      });
      
      // Wait for all directories to load (or timeout)
      const results = await Promise.all(loadPromises);
      results.forEach(files => allFiles.push(...files));

      // Sort files by disk and track number
      allFiles.sort((a, b) => {
        const diskOrder = ['Disk 1 (Part 1- Part 2)', 'Disk 2', 'Disk 3', 'Disk 4', 'Disk 5'];
        const diskA = diskOrder.indexOf(a.disk);
        const diskB = diskOrder.indexOf(b.disk);
        
        if (diskA !== diskB) {
          return diskA - diskB;
        }
        
        return parseInt(a.trackNumber) - parseInt(b.trackNumber);
      });

      setAudioFiles(allFiles);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load audio files');
    } finally {
      setLoading(false);
    }
  };

  // Audio player controls
  const handlePlayPause = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handlePrevious = () => {
    if (currentTrack > 0) {
      setCurrentTrack(currentTrack - 1);
      setIsPlaying(false);
    }
  };

  const handleNext = () => {
    if (currentTrack < audioFiles.length - 1) {
      setCurrentTrack(currentTrack + 1);
      setIsPlaying(false);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current && audioFiles.length > 0 && audioFiles[currentTrack]) {
      const current = audioRef.current.currentTime;
      const total = audioRef.current.duration;
      
      setCurrentTime(current);
      
      // Calculate and save progress percentage
      if (total > 0 && !isNaN(total)) {
        const progressPercent = Math.min(100, Math.round((current / total) * 100));
        const currentFile = audioFiles[currentTrack];
        
        if (currentFile && currentFile.path) {
          // Save progress every 2% increment or every 10 seconds, whichever comes first
          const lastSavedProgress = trackProgress[currentFile.path] || 0;
          if (progressPercent > lastSavedProgress + 1 || progressPercent === 100) {
            saveTrackProgress(currentFile.path, progressPercent);
          }
        }
      }
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || !duration) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    const newTime = percentage * duration;
    
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
    localStorage.setItem('tsungi-ai-volume', newVolume.toString());
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const currentAudioFile = audioFiles[currentTrack];
  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  // Calculate overall stats from trackProgress
  const completedTracks = Object.values(trackProgress).filter(progress => progress >= 100).length;
  const totalTracks = audioFiles.length;
  const overallProgress = totalTracks > 0 ? Math.round((Object.values(trackProgress).reduce((sum, progress) => sum + progress, 0) / totalTracks)) : 0;

  // Group files by disk for display
  const groupedFiles = audioFiles.reduce((groups, file) => {
    const diskName = file.disk;
    if (!groups[diskName]) {
      groups[diskName] = [];
    }
    groups[diskName].push(file);
    return groups;
  }, {} as { [key: string]: AudioFile[] });

  // Loading state
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">
              Audio Learning Hub
            </h1>
            <p className="text-muted-foreground">Loading your CA1 audio library...</p>
          </div>
        </div>
        <Card className="shadow-card">
          <CardContent className="p-8 text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-muted-foreground">Loading audio files from Supabase...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">
              Audio Learning Hub
            </h1>
            <p className="text-muted-foreground">Failed to load audio library</p>
          </div>
        </div>
        <Alert className="border-red-200 bg-red-50/50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-700">
            {error}
          </AlertDescription>
        </Alert>
        <Button onClick={loadAudioFiles} className="w-full">
          <TrendingUp className="w-4 h-4 mr-2" />
          Retry Loading
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Hidden audio element */}
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleNext}
        preload="metadata"
      />

      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl md:text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
          Audio Learning Hub
        </h1>
        <p className="text-muted-foreground text-sm md:text-lg">
          Master actuarial concepts through comprehensive audio lessons
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 md:grid-cols-3 gap-2 md:gap-6">
        <Card className="shadow-card">
          <CardContent className="p-3 md:p-6">
            <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4">
              <div className="w-8 h-8 md:w-12 md:h-12 bg-gradient-primary rounded-lg md:rounded-xl shadow-neumorph-inset flex items-center justify-center">
                <BookOpen className="w-4 h-4 md:w-6 md:h-6 text-primary-foreground" />
              </div>
              <div className="text-center md:text-left">
                <p className="text-lg md:text-2xl font-bold">{audioFiles.length}</p>
                <p className="text-xs md:text-sm text-muted-foreground">Lessons</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-card">
          <CardContent className="p-3 md:p-6">
            <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4">
              <div className="w-8 h-8 md:w-12 md:h-12 bg-gradient-secondary rounded-lg md:rounded-xl shadow-neumorph-inset flex items-center justify-center">
                <Clock className="w-4 h-4 md:w-6 md:h-6 text-secondary-foreground" />
              </div>
              <div className="text-center md:text-left">
                <p className="text-lg md:text-2xl font-bold">{completedTracks}</p>
                <p className="text-xs md:text-sm text-muted-foreground">Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-card">
          <CardContent className="p-3 md:p-6">
            <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4">
              <div className="w-8 h-8 md:w-12 md:h-12 bg-gradient-accent rounded-lg md:rounded-xl shadow-neumorph-inset flex items-center justify-center">
                <TrendingUp className="w-4 h-4 md:w-6 md:h-6 text-accent-foreground" />
              </div>
              <div className="text-center md:text-left">
                <p className="text-lg md:text-2xl font-bold">{overallProgress}%</p>
                <p className="text-xs md:text-sm text-muted-foreground">Progress</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Audio Player */}
      {currentAudioFile && (
        <Card className="shadow-card">
          <CardHeader className="pb-3 md:pb-6">
            <CardTitle className="text-lg md:text-xl">Now Playing</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 md:space-y-4">
            <div className="flex items-center gap-3 md:gap-4">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-primary rounded-lg md:rounded-xl shadow-neumorph-inset flex items-center justify-center">
                <Volume2 className="w-6 h-6 md:w-8 md:h-8 text-primary-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm md:text-base truncate">{currentAudioFile.title}</h3>
                <p className="text-xs md:text-sm text-muted-foreground truncate">
                  Track {currentAudioFile.trackNumber} • {currentAudioFile.disk}
                </p>
              </div>
              <Badge variant="secondary" className="text-xs">{currentAudioFile.category}</Badge>
            </div>
            
            {/* Progress Bar */}
            <div className="space-y-2">
              <div 
                className="h-2 bg-muted rounded-full cursor-pointer"
                onClick={handleSeek}
              >
                <div 
                  className="h-full bg-primary rounded-full transition-all duration-300"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>
            
            {/* Controls */}
            <div className="flex items-center justify-center gap-3 md:gap-4">
              <Button 
                variant="outline" 
                size="sm" 
                className="rounded-full w-10 h-10 md:w-auto md:h-auto"
                onClick={handlePrevious}
                disabled={currentTrack === 0}
              >
                <SkipBack className="w-4 h-4" />
              </Button>
              <Button 
                variant="default" 
                size="lg" 
                onClick={handlePlayPause}
                className="rounded-full w-12 h-12 md:w-14 md:h-14"
              >
                {isPlaying ? <Pause className="w-5 h-5 md:w-6 md:h-6" /> : <Play className="w-5 h-5 md:w-6 md:h-6" />}
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="rounded-full w-10 h-10 md:w-auto md:h-auto"
                onClick={handleNext}
                disabled={currentTrack === audioFiles.length - 1}
              >
                <SkipForward className="w-4 h-4" />
              </Button>
            </div>

            {/* Volume Control */}
            <div className="flex items-center gap-2 justify-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleVolumeChange(volume === 0 ? 1 : 0)}
                className="w-8 h-8 md:w-auto md:h-auto"
              >
                {volume === 0 ? <VolumeX className="w-4 h-4" /> : 
                 volume < 0.5 ? <Volume1 className="w-4 h-4" /> : 
                 <Volume2 className="w-4 h-4" />}
              </Button>
              <div className="flex-1 max-w-24 md:max-w-32">
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={volume}
                  onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                  className="w-full h-1 bg-muted rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Track List by Disk - Accordion */}
      <Accordion type="multiple" className="space-y-4">
        {Object.entries(groupedFiles).map(([diskName, files]) => (
          <AccordionItem key={diskName} value={diskName} className="border-0">
            <Card className="shadow-card">
              <AccordionTrigger className="hover:no-underline p-0">
                <CardHeader className="pb-3 md:pb-6 w-full">
                  <CardTitle className="text-base md:text-lg text-left flex items-center justify-between">
                    {diskName}
                    <Badge variant="secondary" className="ml-auto mr-4">
                      {files.length} tracks
                    </Badge>
                  </CardTitle>
                </CardHeader>
              </AccordionTrigger>
              <AccordionContent>
                <CardContent className="space-y-2 md:space-y-3 pt-0">
                  {files.map((file, index) => {
                    const globalIndex = audioFiles.findIndex(f => f.path === file.path);
                    const isCurrentTrack = globalIndex === currentTrack;
                    const fileProgress = trackProgress[file.path] || 0;
                    
                    return (
                      <div 
                        key={file.path}
                        className={`flex items-center gap-2 md:gap-4 p-2 md:p-3 rounded-lg md:rounded-xl border transition-all duration-200 hover:bg-card/50 cursor-pointer ${
                          isCurrentTrack ? 'bg-primary/5 border-primary/20' : 'bg-card/20'
                        }`}
                        onClick={() => {
                          setCurrentTrack(globalIndex);
                          setIsPlaying(false);
                        }}
                      >
                        <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-secondary rounded-md md:rounded-lg shadow-neumorph-inset flex items-center justify-center relative">
                          {fileProgress >= 100 ? (
                            <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-green-500" />
                          ) : (
                            <span className="text-xs font-bold text-primary">{file.trackNumber}</span>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm md:text-base truncate">{file.title}</h4>
                          <p className="text-xs text-muted-foreground">Track {file.trackNumber}</p>
                        </div>
                        <div className="hidden md:block w-16">
                          <Progress value={fileProgress} className="h-1" />
                          <p className="text-xs text-muted-foreground mt-1 text-center">{fileProgress}%</p>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="w-8 h-8 md:w-auto md:h-auto"
                          onClick={(e) => {
                            e.stopPropagation();
                            window.open(file.url, '_blank');
                          }}
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    );
                  })}
                </CardContent>
              </AccordionContent>
            </Card>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

export default AudioLearning;
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  Phone, 
  MessageSquare, 
  PenTool,
  Clock,
  Play,
  Pause,
  SkipForward
} from 'lucide-react';

interface StudyBuddy {
  id: string;
  name: string;
  progress: number;
  nextSession: string;
  timezone: string;
  examType: string;
  preferredTimes: string[];
  isOnline: boolean;
  matchScore: number;
}

interface LiveStudySessionProps {
  buddy: StudyBuddy;
  onEndSession: () => void;
}

interface SessionPhase {
  name: string;
  duration: number; // in minutes
  description: string;
  icon: React.ReactNode;
}

const LiveStudySession: React.FC<LiveStudySessionProps> = ({
  buddy,
  onEndSession
}) => {
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [currentPhase, setCurrentPhase] = useState(0);
  const [phaseTime, setPhaseTime] = useState(0);
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [totalSessionTime, setTotalSessionTime] = useState(0);

  const sessionPhases: SessionPhase[] = [
    {
      name: 'Warm-Up',
      duration: 3,
      description: 'Set goals and agree on focus topics',
      icon: <Play className="w-4 h-4" />
    },
    {
      name: 'Oral Q&A',
      duration: 15,
      description: 'Quiz each other using AI-suggested questions',
      icon: <MessageSquare className="w-4 h-4" />
    },
    {
      name: 'Flashcard Swap',
      duration: 10,
      description: 'Live flashcard flips - alternate explaining answers',
      icon: <PenTool className="w-4 h-4" />
    },
    {
      name: 'Timed Drill',
      duration: 15,
      description: 'Past paper or 5-question mini-test',
      icon: <Clock className="w-4 h-4" />
    },
    {
      name: 'Recap & Feedback',
      duration: 2,
      description: 'Rate session and review improvement areas',
      icon: <SkipForward className="w-4 h-4" />
    }
  ];

  const totalDuration = sessionPhases.reduce((acc, phase) => acc + phase.duration, 0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isSessionActive) {
      interval = setInterval(() => {
        setPhaseTime(prev => {
          const newTime = prev + 1;
          const currentPhaseDuration = sessionPhases[currentPhase].duration * 60;
          
          if (newTime >= currentPhaseDuration) {
            if (currentPhase < sessionPhases.length - 1) {
              setCurrentPhase(prev => prev + 1);
              return 0;
            } else {
              setIsSessionActive(false);
              return currentPhaseDuration;
            }
          }
          
          return newTime;
        });
        
        setTotalSessionTime(prev => prev + 1);
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isSessionActive, currentPhase, sessionPhases]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getPhaseProgress = () => {
    const currentPhaseDuration = sessionPhases[currentPhase].duration * 60;
    return (phaseTime / currentPhaseDuration) * 100;
  };

  const getOverallProgress = () => {
    const completedPhases = sessionPhases.slice(0, currentPhase);
    const completedTime = completedPhases.reduce((acc, phase) => acc + phase.duration * 60, 0);
    return ((completedTime + phaseTime) / (totalDuration * 60)) * 100;
  };

  const handleStartSession = () => {
    setIsSessionActive(true);
    setCurrentPhase(0);
    setPhaseTime(0);
    setTotalSessionTime(0);
  };

  const handleEndSessionConfirm = () => {
    setIsSessionActive(false);
    onEndSession();
  };

  const skipToNextPhase = () => {
    if (currentPhase < sessionPhases.length - 1) {
      setCurrentPhase(prev => prev + 1);
      setPhaseTime(0);
    }
  };

  return (
    <div className="space-y-6">
      {/* Session Header */}
      <Card className="rounded-3xl shadow-neumorph bg-gradient-secondary border-0">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Video className="w-5 h-5 text-focus" />
                Study Session with {buddy.name}
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                {buddy.examType} • {formatTime(totalSessionTime)} elapsed
              </p>
            </div>
            <Badge variant="outline" className="bg-progress/10 text-progress border-progress/20 rounded-xl">
              {buddy.isOnline ? 'Online' : 'Offline'}
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Video Area */}
          <div className="grid grid-cols-2 gap-4">
            {/* Local Video */}
            <div className="aspect-video bg-gradient-accent rounded-2xl flex items-center justify-center shadow-neumorph-inset">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center text-xl font-semibold mx-auto mb-2">
                  You
                </div>
                <p className="text-sm text-muted-foreground">
                  {videoEnabled ? 'Camera On' : 'Camera Off'}
                </p>
              </div>
            </div>
            
            {/* Remote Video */}
            <div className="aspect-video bg-gradient-accent rounded-2xl flex items-center justify-center shadow-neumorph-inset">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-focus text-white flex items-center justify-center text-xl font-semibold mx-auto mb-2">
                  {buddy.name.split(' ').map(n => n[0]).join('')}
                </div>
                <p className="text-sm text-muted-foreground">{buddy.name}</p>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-4">
            <Button
              variant={videoEnabled ? "default" : "secondary"}
              size="lg"
              onClick={() => setVideoEnabled(!videoEnabled)}
              className="rounded-full w-12 h-12 p-0 shadow-neumorph hover:shadow-neumorph-pressed transition-all duration-200"
            >
              {videoEnabled ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
            </Button>
            
            <Button
              variant={audioEnabled ? "default" : "secondary"}
              size="lg"
              onClick={() => setAudioEnabled(!audioEnabled)}
              className="rounded-full w-12 h-12 p-0 shadow-neumorph hover:shadow-neumorph-pressed transition-all duration-200"
            >
              {audioEnabled ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
            </Button>
            
            <Button
              variant="destructive"
              size="lg"
              onClick={handleEndSessionConfirm}
              className="rounded-full w-12 h-12 p-0 shadow-neumorph hover:shadow-neumorph-pressed transition-all duration-200"
            >
              <Phone className="w-5 h-5" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Session Progress */}
      <Card className="rounded-3xl shadow-neumorph bg-gradient-secondary border-0">
        <CardHeader>
          <CardTitle>Session Progress</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Overall Progress */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Overall Progress</span>
              <span>{Math.round(getOverallProgress())}%</span>
            </div>
            <Progress value={getOverallProgress()} className="h-2" />
          </div>

          {/* Current Phase */}
          {!isSessionActive ? (
            <div className="text-center space-y-4">
              <h3 className="text-lg font-semibold">Ready to Start?</h3>
              <p className="text-muted-foreground">
                This {totalDuration}-minute session includes {sessionPhases.length} focused phases
              </p>
              <Button
                onClick={handleStartSession}
                className="rounded-2xl shadow-neumorph hover:shadow-neumorph-pressed transition-all duration-200"
                size="lg"
              >
                <Play className="w-4 h-4 mr-2" />
                Start Study Session
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {sessionPhases[currentPhase].icon}
                  <div>
                    <h3 className="font-semibold">{sessionPhases[currentPhase].name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {sessionPhases[currentPhase].description}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-mono">
                    {formatTime(sessionPhases[currentPhase].duration * 60 - phaseTime)}
                  </div>
                  <p className="text-xs text-muted-foreground">remaining</p>
                </div>
              </div>
              
              <Progress value={getPhaseProgress()} className="h-2" />
              
              <div className="flex gap-2">
                <Button
                  onClick={() => setIsSessionActive(!isSessionActive)}
                  variant="outline"
                  className="rounded-2xl shadow-neumorph hover:shadow-neumorph-pressed transition-all duration-200"
                >
                  {isSessionActive ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
                  {isSessionActive ? 'Pause' : 'Resume'}
                </Button>
                
                {currentPhase < sessionPhases.length - 1 && (
                  <Button
                    onClick={skipToNextPhase}
                    variant="outline"
                    className="rounded-2xl shadow-neumorph hover:shadow-neumorph-pressed transition-all duration-200"
                  >
                    <SkipForward className="w-4 h-4 mr-2" />
                    Next Phase
                  </Button>
                )}
              </div>
            </div>
          )}

          {/* Phase Timeline */}
          <Separator />
          <div className="space-y-3">
            <h4 className="font-medium">Session Timeline</h4>
            <div className="space-y-2">
              {sessionPhases.map((phase, index) => (
                <div 
                  key={index}
                  className={`flex items-center gap-3 p-3 rounded-2xl transition-all duration-200 ${
                    index === currentPhase 
                      ? 'bg-focus/10 border border-focus/20' 
                      : index < currentPhase 
                        ? 'bg-progress/10 border border-progress/20' 
                        : 'bg-muted/10 border border-muted/20'
                  }`}
                >
                  {phase.icon}
                  <div className="flex-1">
                    <div className="font-medium">{phase.name}</div>
                    <div className="text-sm text-muted-foreground">{phase.duration} minutes</div>
                  </div>
                  {index < currentPhase && (
                    <Badge variant="outline" className="bg-progress/10 text-progress border-progress/20 rounded-lg">
                      Complete
                    </Badge>
                  )}
                  {index === currentPhase && isSessionActive && (
                    <Badge variant="outline" className="bg-focus/10 text-focus border-focus/20 rounded-lg">
                      Active
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LiveStudySession;
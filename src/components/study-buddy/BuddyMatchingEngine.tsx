import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Users, Clock, MapPin, Target, Star, Video } from 'lucide-react';

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

interface BuddyMatchingEngineProps {
  suggestedBuddies: StudyBuddy[];
  onStartSession: (buddy: StudyBuddy) => void;
}

const BuddyMatchingEngine: React.FC<BuddyMatchingEngineProps> = ({
  suggestedBuddies,
  onStartSession
}) => {
  const [autoMatch, setAutoMatch] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const handleAutoMatch = () => {
    setIsSearching(true);
    // Simulate searching
    setTimeout(() => {
      setIsSearching(false);
      if (suggestedBuddies.length > 0) {
        onStartSession(suggestedBuddies[0]);
      }
    }, 2000);
  };

  const formatTime = (timeString: string) => {
    return new Date(timeString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div className="space-y-6">
      {/* Auto-Match Section */}
      <Card className="rounded-3xl shadow-neumorph bg-gradient-secondary border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-focus" />
            Quick Match
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="auto-match" className="text-sm font-medium">
                Auto-Match Me
              </Label>
              <p className="text-xs text-muted-foreground">
                Find the best buddy automatically based on your preferences
              </p>
            </div>
            <Switch
              id="auto-match"
              checked={autoMatch}
              onCheckedChange={setAutoMatch}
            />
          </div>
          
          <Button 
            onClick={handleAutoMatch}
            disabled={isSearching}
            className="w-full rounded-2xl shadow-neumorph hover:shadow-neumorph-pressed transition-all duration-200"
            variant="default"
          >
            {isSearching ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-background border-t-primary mr-2" />
                Finding Your Perfect Match...
              </>
            ) : (
              <>
                <Users className="w-4 h-4 mr-2" />
                Find Study Buddy Now
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Suggested Matches */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Suggested Matches</h3>
        
        {suggestedBuddies.map((buddy) => (
          <Card key={buddy.id} className="rounded-3xl shadow-neumorph bg-gradient-secondary border-0 hover:shadow-neumorph-float transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center text-white font-semibold">
                    {buddy.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h4 className="font-semibold flex items-center gap-2">
                      {buddy.name}
                      {buddy.isOnline && (
                        <div className="w-2 h-2 bg-progress rounded-full" />
                      )}
                    </h4>
                    <p className="text-sm text-muted-foreground">{buddy.examType}</p>
                  </div>
                </div>
                
                <Badge variant="outline" className="bg-focus/10 text-focus border-focus/20 rounded-xl">
                  <Star className="w-3 h-3 mr-1" />
                  {buddy.matchScore}% Match
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Target className="w-4 h-4 text-muted-foreground" />
                    <span>{buddy.progress}% Complete</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span>Next: {formatTime(buddy.nextSession)}</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span>{buddy.timezone}</span>
                  </div>
                  <div className="flex gap-1">
                    {buddy.preferredTimes.map((time) => (
                      <Badge key={time} variant="secondary" className="text-xs rounded-lg">
                        {time}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={() => onStartSession(buddy)}
                  className="flex-1 rounded-2xl shadow-neumorph hover:shadow-neumorph-pressed transition-all duration-200"
                  variant="default"
                >
                  <Video className="w-4 h-4 mr-2" />
                  Start Session
                </Button>
                <Button
                  variant="outline"
                  className="rounded-2xl shadow-neumorph hover:shadow-neumorph-pressed transition-all duration-200"
                >
                  Message
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {suggestedBuddies.length === 0 && (
        <Card className="rounded-3xl shadow-neumorph bg-gradient-secondary border-0">
          <CardContent className="p-8 text-center">
            <Users className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-semibold mb-2">No Matches Found</h3>
            <p className="text-muted-foreground mb-4">
              We couldn't find any study buddies matching your preferences right now.
            </p>
            <Button
              onClick={handleAutoMatch}
              className="rounded-2xl shadow-neumorph hover:shadow-neumorph-pressed transition-all duration-200"
            >
              <Target className="w-4 h-4 mr-2" />
              Expand Search Criteria
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default BuddyMatchingEngine;
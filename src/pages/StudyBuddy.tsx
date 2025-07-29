import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, Video, BookOpen, Trophy, Clock, MapPin } from 'lucide-react';
import BuddyMatchingEngine from '@/components/study-buddy/BuddyMatchingEngine';
import LiveStudySession from '@/components/study-buddy/LiveStudySession';
import SharedStudyDecks from '@/components/study-buddy/SharedStudyDecks';
import BuddyChallenge from '@/components/study-buddy/BuddyChallenge';

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

const StudyBuddy: React.FC = () => {
  const [activeTab, setActiveTab] = useState('matches');
  const [currentBuddy, setCurrentBuddy] = useState<StudyBuddy | null>(null);
  const [isInSession, setIsInSession] = useState(false);

  // Mock data for demonstration
  const suggestedBuddies: StudyBuddy[] = [
    {
      id: '1',
      name: 'Alex Chen',
      progress: 67,
      nextSession: '2025-01-28 19:00',
      timezone: 'GMT+0',
      examType: 'CT1 – Financial Mathematics',
      preferredTimes: ['Evening', 'Morning'],
      isOnline: true,
      matchScore: 95
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      progress: 71,
      nextSession: '2025-01-28 20:00',
      timezone: 'GMT+0',
      examType: 'CT1 – Financial Mathematics',
      preferredTimes: ['Evening', 'Afternoon'],
      isOnline: false,
      matchScore: 88
    }
  ];

  const pendingChallenges = [
    {
      id: '1',
      from: 'Alex Chen',
      type: 'Flashcard Quiz',
      topic: 'Annuities',
      timeLimit: '10 mins',
      expiresIn: '2 hours'
    }
  ];

  const handleStartSession = (buddy: StudyBuddy) => {
    setCurrentBuddy(buddy);
    setIsInSession(true);
    setActiveTab('session');
  };

  const handleEndSession = () => {
    setIsInSession(false);
    setCurrentBuddy(null);
    setActiveTab('matches');
  };

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">
          Study Buddy Hub
        </h1>
        <p className="text-muted-foreground">
          Connect, collaborate, and succeed together
        </p>
      </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 rounded-2xl shadow-neumorph bg-gradient-secondary">
            <TabsTrigger value="matches" className="rounded-xl">
              <Users className="w-4 h-4 mr-2" />
              Find Buddy
            </TabsTrigger>
            <TabsTrigger value="session" className="rounded-xl" disabled={!isInSession}>
              <Video className="w-4 h-4 mr-2" />
              Live Session
            </TabsTrigger>
            <TabsTrigger value="decks" className="rounded-xl">
              <BookOpen className="w-4 h-4 mr-2" />
              Shared Decks
            </TabsTrigger>
            <TabsTrigger value="challenges" className="rounded-xl">
              <Trophy className="w-4 h-4 mr-2" />
              Challenges
            </TabsTrigger>
          </TabsList>

          <TabsContent value="matches" className="space-y-6">
            <BuddyMatchingEngine 
              suggestedBuddies={suggestedBuddies}
              onStartSession={handleStartSession}
            />
          </TabsContent>

          <TabsContent value="session" className="space-y-6">
            {isInSession && currentBuddy ? (
              <LiveStudySession 
                buddy={currentBuddy}
                onEndSession={handleEndSession}
              />
            ) : (
              <Card className="rounded-3xl shadow-neumorph bg-gradient-secondary border-0">
                <CardContent className="p-8 text-center">
                  <Video className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-xl font-semibold mb-2">No Active Session</h3>
                  <p className="text-muted-foreground">
                    Start a session with a study buddy to begin collaborative learning
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="decks" className="space-y-6">
            <SharedStudyDecks />
          </TabsContent>

          <TabsContent value="challenges" className="space-y-6">
            <BuddyChallenge pendingChallenges={pendingChallenges} />
          </TabsContent>
        </Tabs>
    </div>
  );
};

export default StudyBuddy;
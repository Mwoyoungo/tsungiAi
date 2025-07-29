import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  Clock, 
  Target, 
  TrendingUp, 
  Users, 
  BookOpen, 
  Zap,
  Play,
  CheckCircle2,
  Timer,
  Brain
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { OnboardingData } from './Onboarding';

interface DashboardProps {
  userData: OnboardingData;
  onStartStudy: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ userData, onStartStudy }) => {
  // Mock data for demonstration
  const studyProgress = {
    hoursCompleted: 45,
    totalHours: 300,
    currentStreak: 7,
    weeklyTarget: 25,
    weeklyCompleted: 18
  };

  const todaysSession = {
    timeSlot: '6:00 PM - 7:30 PM',
    activities: [
      { type: 'buddy', name: 'Study with Sarah', duration: 20, icon: Users },
      { type: 'audio', name: 'Interest Rate Fundamentals', duration: 15, icon: BookOpen },
      { type: 'practice', name: 'Flashcard Review', duration: 20, icon: Brain },
      { type: 'test', name: 'Quick Quiz', duration: 15, icon: Zap },
      { type: 'recap', name: 'Session Recap', duration: 10, icon: CheckCircle2 }
    ]
  };

  const examDate = new Date(userData.examDate);
  const today = new Date();
  const daysLeft = Math.ceil((examDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  const progressPercentage = (studyProgress.hoursCompleted / studyProgress.totalHours) * 100;
  const weeklyProgressPercentage = (studyProgress.weeklyCompleted / studyProgress.weeklyTarget) * 100;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">
            Your journey to {userData.examType} success
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Badge variant="outline" className="p-2">
            <Calendar className="w-4 h-4 mr-2" />
            {daysLeft} days left
          </Badge>
          <Button variant="primary" onClick={onStartStudy}>
            <Play className="w-4 h-4 mr-2" />
            Start Today's Session
          </Button>
        </div>
      </div>

        {/* Progress Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="shadow-card">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Target className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Progress</p>
                  <p className="text-xl font-bold">{studyProgress.hoursCompleted}h / {studyProgress.totalHours}h</p>
                </div>
              </div>
              <Progress value={progressPercentage} className="mt-3" />
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-accent/10 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Current Streak</p>
                  <p className="text-xl font-bold">{studyProgress.currentStreak} days</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-focus/10 rounded-lg">
                  <Clock className="w-5 h-5 text-focus" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">This Week</p>
                  <p className="text-xl font-bold">{studyProgress.weeklyCompleted}h / {studyProgress.weeklyTarget}h</p>
                </div>
              </div>
              <Progress value={weeklyProgressPercentage} className="mt-3" />
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-warning/10 rounded-lg">
                  <Calendar className="w-5 h-5 text-warning" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Exam Date</p>
                  <p className="text-sm font-medium">{examDate.toLocaleDateString()}</p>
                  <p className="text-lg font-bold text-warning">{daysLeft} days</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Today's Session */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="shadow-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl">Today's Study Plan</CardTitle>
                  <Badge variant="outline">
                    <Timer className="w-4 h-4 mr-2" />
                    {todaysSession.timeSlot}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {todaysSession.activities.map((activity, index) => {
                  const Icon = activity.icon;
                  return (
                    <div key={index} className="flex items-center gap-4 p-3 rounded-lg border bg-card/50 hover:bg-card transition-colors">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Icon className="w-4 h-4 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{activity.name}</p>
                        <p className="text-sm text-muted-foreground">{activity.duration} minutes</p>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {activity.type === 'buddy' && 'Collaborative'}
                        {activity.type === 'audio' && 'Passive'}
                        {activity.type === 'practice' && 'Active'}
                        {activity.type === 'test' && 'Assessment'}
                        {activity.type === 'recap' && 'Review'}
                      </Badge>
                    </div>
                  );
                })}
                
                <Button variant="primary" className="w-full mt-4" onClick={onStartStudy}>
                  <Play className="w-4 h-4 mr-2" />
                  Begin Study Session
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions & Weekly Overview */}
          <div className="space-y-4">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link to="/study-buddy">
                  <Button variant="outline" className="w-full justify-start">
                    <Users className="w-4 h-4 mr-2" />
                    Find Study Buddy
                  </Button>
                </Link>
                <Button variant="outline" className="w-full justify-start">
                  <BookOpen className="w-4 h-4 mr-2" />
                  Audio Library
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Brain className="w-4 h-4 mr-2" />
                  Practice Exam
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Zap className="w-4 h-4 mr-2" />
                  Acronym Lab
                </Button>
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-lg">This Week</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
                    <div key={day} className="flex items-center justify-between">
                      <span className="text-sm font-medium">{day}</span>
                      <div className="flex items-center gap-2">
                        {index < 3 ? (
                          <CheckCircle2 className="w-4 h-4 text-accent" />
                        ) : index === 3 ? (
                          <div className="w-4 h-4 bg-primary rounded-full animate-pulse-glow" />
                        ) : (
                          <div className="w-4 h-4 bg-muted rounded-full" />
                        )}
                        <span className="text-xs text-muted-foreground">
                          {index < 3 ? '✓' : index === 3 ? 'Today' : userData.weekdayDuration}min
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Study Tips */}
        <Card className="shadow-card bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Brain className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-2">Today's Study Tip</h3>
                <p className="text-muted-foreground">
                  Use the Feynman Technique: Try explaining today's concepts in simple terms to your study buddy. 
                  If you can't explain it simply, you don't understand it well enough.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
    </div>
  );
};

export default Dashboard;
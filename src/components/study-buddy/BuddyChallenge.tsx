import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { 
  Trophy, 
  Clock, 
  Target, 
  Send, 
  Play, 
  Award,
  Zap,
  Users,
  Plus,
  CheckCircle,
  XCircle
} from 'lucide-react';

interface Challenge {
  id: string;
  from: string;
  type: string;
  topic: string;
  timeLimit: string;
  expiresIn: string;
  questions?: Question[];
  status?: 'pending' | 'active' | 'completed';
  score?: number;
  maxScore?: number;
}

interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface BuddyChallengeProps {
  pendingChallenges: Challenge[];
}

const BuddyChallenge: React.FC<BuddyChallengeProps> = ({ pendingChallenges: initialChallenges }) => {
  const [challenges, setChallenges] = useState<Challenge[]>(initialChallenges);
  const [activeChallenge, setActiveChallenge] = useState<Challenge | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showCreateChallenge, setShowCreateChallenge] = useState(false);
  
  const [newChallenge, setNewChallenge] = useState({
    recipient: '',
    type: 'Quick Quiz',
    topic: '',
    timeLimit: '10',
    questions: [] as Question[]
  });

  // Mock leaderboard data
  const leaderboard = [
    { name: 'You', score: 85, challenges: 12, streak: 5 },
    { name: 'Alex Chen', score: 92, challenges: 15, streak: 7 },
    { name: 'Sarah Johnson', score: 78, challenges: 8, streak: 3 }
  ];

  // Mock challenge with questions
  const mockChallengeQuestions: Question[] = [
    {
      id: '1',
      question: 'What is the present value of an annuity formula?',
      options: [
        'PV = PMT × (1 + r)^n',
        'PV = PMT × [(1 - (1 + r)^(-n)) / r]',
        'PV = PMT × [(1 + r)^n - 1] / r',
        'PV = PMT / r'
      ],
      correctAnswer: 1,
      explanation: 'The present value of an ordinary annuity uses the formula PV = PMT × [(1 - (1 + r)^(-n)) / r]'
    },
    {
      id: '2',
      question: 'In compound interest, what does "n" represent?',
      options: [
        'Interest rate',
        'Principal amount',
        'Number of compounding periods',
        'Final amount'
      ],
      correctAnswer: 2,
      explanation: 'In compound interest formulas, "n" represents the number of compounding periods.'
    }
  ];

  const handleAcceptChallenge = (challenge: Challenge) => {
    const challengeWithQuestions = {
      ...challenge,
      questions: mockChallengeQuestions,
      status: 'active' as const,
      maxScore: mockChallengeQuestions.length
    };
    
    setActiveChallenge(challengeWithQuestions);
    setCurrentQuestion(0);
    setSelectedAnswers([]);
    setTimeRemaining(parseInt(challenge.timeLimit) * 60); // Convert to seconds
    setIsCompleted(false);
    
    // Start timer
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleCompleteChallenge();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleSelectAnswer = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = answerIndex;
    setSelectedAnswers(newAnswers);
  };

  const handleNextQuestion = () => {
    if (activeChallenge && currentQuestion < activeChallenge.questions!.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      handleCompleteChallenge();
    }
  };

  const handleCompleteChallenge = () => {
    if (!activeChallenge) return;
    
    // Calculate score
    let correctAnswers = 0;
    selectedAnswers.forEach((answer, index) => {
      if (activeChallenge.questions![index] && answer === activeChallenge.questions![index].correctAnswer) {
        correctAnswers++;
      }
    });
    
    const finalScore = correctAnswers;
    setActiveChallenge(prev => prev ? { ...prev, score: finalScore, status: 'completed' } : null);
    setIsCompleted(true);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getScoreColor = (score: number, maxScore: number) => {
    const percentage = (score / maxScore) * 100;
    if (percentage >= 80) return 'text-progress';
    if (percentage >= 60) return 'text-warning';
    return 'text-destructive';
  };

  if (activeChallenge && !isCompleted) {
    const currentQ = activeChallenge.questions![currentQuestion];
    const progress = ((currentQuestion + 1) / activeChallenge.questions!.length) * 100;

    return (
      <div className="space-y-6">
        {/* Challenge Header */}
        <Card className="rounded-3xl shadow-neumorph bg-gradient-secondary border-0">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-warning" />
                  Challenge from {activeChallenge.from}
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  {activeChallenge.topic} • {activeChallenge.type}
                </p>
              </div>
              
              <div className="text-right">
                <div className="text-2xl font-mono text-warning">
                  {formatTime(timeRemaining)}
                </div>
                <p className="text-xs text-muted-foreground">Time remaining</p>
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Question {currentQuestion + 1} of {activeChallenge.questions!.length}</span>
                <span>{Math.round(progress)}% Complete</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {/* Question Card */}
        <Card className="rounded-3xl shadow-neumorph bg-gradient-secondary border-0">
          <CardContent className="p-8">
            <div className="space-y-6">
              <h3 className="text-xl font-semibold leading-relaxed">
                {currentQ.question}
              </h3>
              
              <div className="space-y-3">
                {currentQ.options.map((option, index) => (
                  <Button
                    key={index}
                    variant={selectedAnswers[currentQuestion] === index ? "default" : "outline"}
                    className="w-full text-left justify-start p-4 h-auto rounded-2xl shadow-neumorph hover:shadow-neumorph-pressed transition-all duration-200"
                    onClick={() => handleSelectAnswer(index)}
                  >
                    <span className="w-6 h-6 rounded-full bg-muted text-muted-foreground flex items-center justify-center text-sm mr-3 flex-shrink-0">
                      {String.fromCharCode(65 + index)}
                    </span>
                    <span className="text-wrap">{option}</span>
                  </Button>
                ))}
              </div>
              
              <div className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
                  disabled={currentQuestion === 0}
                  className="rounded-2xl shadow-neumorph hover:shadow-neumorph-pressed transition-all duration-200"
                >
                  Previous
                </Button>
                
                <Button
                  onClick={handleNextQuestion}
                  disabled={selectedAnswers[currentQuestion] === undefined}
                  className="rounded-2xl shadow-neumorph hover:shadow-neumorph-pressed transition-all duration-200"
                >
                  {currentQuestion === activeChallenge.questions!.length - 1 ? 'Complete' : 'Next'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isCompleted && activeChallenge) {
    return (
      <div className="space-y-6">
        {/* Results Card */}
        <Card className="rounded-3xl shadow-neumorph bg-gradient-secondary border-0">
          <CardContent className="p-8 text-center">
            <Trophy className="w-16 h-16 mx-auto mb-4 text-warning" />
            <h2 className="text-2xl font-bold mb-2">Challenge Complete!</h2>
            <p className="text-muted-foreground mb-6">
              You scored {activeChallenge.score} out of {activeChallenge.maxScore} questions correctly
            </p>
            
            <div className="text-6xl font-bold mb-4">
              <span className={getScoreColor(activeChallenge.score!, activeChallenge.maxScore!)}>
                {Math.round((activeChallenge.score! / activeChallenge.maxScore!) * 100)}%
              </span>
            </div>
            
            <div className="flex justify-center gap-4 mb-6">
              <Badge variant="outline" className="bg-progress/10 text-progress border-progress/20">
                <CheckCircle className="w-3 h-3 mr-1" />
                {activeChallenge.score} Correct
              </Badge>
              <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20">
                <XCircle className="w-3 h-3 mr-1" />
                {activeChallenge.maxScore! - activeChallenge.score!} Incorrect
              </Badge>
            </div>
            
            <div className="flex gap-3">
              <Button
                onClick={() => {
                  setActiveChallenge(null);
                  setIsCompleted(false);
                }}
                className="flex-1 rounded-2xl shadow-neumorph hover:shadow-neumorph-pressed transition-all duration-200"
              >
                Back to Challenges
              </Button>
              <Button
                variant="outline"
                className="rounded-2xl shadow-neumorph hover:shadow-neumorph-pressed transition-all duration-200"
              >
                Review Answers
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Buddy Challenges</h2>
          <p className="text-muted-foreground">
            Compete with your study buddies and track your progress
          </p>
        </div>
        <Button
          onClick={() => setShowCreateChallenge(true)}
          className="rounded-2xl shadow-neumorph hover:shadow-neumorph-pressed transition-all duration-200"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Challenge
        </Button>
      </div>

      {/* Leaderboard */}
      <Card className="rounded-3xl shadow-neumorph bg-gradient-secondary border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="w-5 h-5 text-warning" />
            Leaderboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {leaderboard.map((user, index) => (
              <div key={user.name} className="flex items-center justify-between p-3 rounded-2xl bg-muted/10">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    index === 0 ? 'bg-warning text-white' : 
                    index === 1 ? 'bg-muted text-muted-foreground' : 
                    'bg-accent text-white'
                  }`}>
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium">{user.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {user.challenges} challenges • {user.streak} streak
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg">{user.score}%</p>
                  <p className="text-xs text-muted-foreground">avg score</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Pending Challenges */}
      {challenges.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Pending Challenges</h3>
          {challenges.map((challenge) => (
            <Card key={challenge.id} className="rounded-3xl shadow-neumorph bg-gradient-secondary border-0">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Trophy className="w-4 h-4 text-warning" />
                      <h4 className="font-semibold">Challenge from {challenge.from}</h4>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      {challenge.type} • {challenge.topic}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{challenge.timeLimit}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Target className="w-4 h-4" />
                        <span>Expires in {challenge.expiresIn}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleAcceptChallenge(challenge)}
                      className="rounded-2xl shadow-neumorph hover:shadow-neumorph-pressed transition-all duration-200"
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Accept
                    </Button>
                    <Button
                      variant="outline"
                      className="rounded-2xl shadow-neumorph hover:shadow-neumorph-pressed transition-all duration-200"
                    >
                      Decline
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {challenges.length === 0 && (
        <Card className="rounded-3xl shadow-neumorph bg-gradient-secondary border-0">
          <CardContent className="p-8 text-center">
            <Trophy className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-semibold mb-2">No Pending Challenges</h3>
            <p className="text-muted-foreground mb-4">
              Create a challenge for your study buddies or wait for them to challenge you!
            </p>
            <Button
              onClick={() => setShowCreateChallenge(true)}
              className="rounded-2xl shadow-neumorph hover:shadow-neumorph-pressed transition-all duration-200"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create First Challenge
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default BuddyChallenge;
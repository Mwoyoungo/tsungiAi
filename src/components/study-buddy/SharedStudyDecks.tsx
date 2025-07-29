import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  BookOpen, 
  Plus, 
  Share, 
  Lock, 
  Users, 
  RotateCcw,
  Eye,
  Edit,
  Trash2,
  Star
} from 'lucide-react';

interface Flashcard {
  id: string;
  question: string;
  answer: string;
  topic: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  isShared: boolean;
  createdBy: string;
  streak: number;
}

interface StudyDeck {
  id: string;
  name: string;
  description: string;
  cards: Flashcard[];
  isShared: boolean;
  collaborators: string[];
  createdBy: string;
  lastModified: string;
}

const SharedStudyDecks: React.FC = () => {
  const [selectedDeck, setSelectedDeck] = useState<StudyDeck | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showCreateCard, setShowCreateCard] = useState(false);

  // Mock data
  const [decks, setDecks] = useState<StudyDeck[]>([
    {
      id: '1',
      name: 'Annuities Fundamentals',
      description: 'Core concepts and formulas for annuities',
      isShared: true,
      collaborators: ['Alex Chen', 'Sarah Johnson'],
      createdBy: 'You',
      lastModified: '2025-01-28',
      cards: [
        {
          id: '1',
          question: 'What is the present value formula for an ordinary annuity?',
          answer: 'PV = PMT × [(1 - (1 + r)^(-n)) / r] where PMT is payment, r is interest rate, n is number of periods',
          topic: 'Present Value',
          difficulty: 'Medium',
          isShared: true,
          createdBy: 'You',
          streak: 3
        },
        {
          id: '2',
          question: 'What is the difference between ordinary annuity and annuity due?',
          answer: 'Ordinary annuity: payments at end of period. Annuity due: payments at beginning of period.',
          topic: 'Types',
          difficulty: 'Easy',
          isShared: true,
          createdBy: 'Alex Chen',
          streak: 1
        }
      ]
    },
    {
      id: '2',
      name: 'Interest Rate Models',
      description: 'Private deck for complex interest rate theory',
      isShared: false,
      collaborators: [],
      createdBy: 'You',
      lastModified: '2025-01-27',
      cards: []
    }
  ]);

  const [newCard, setNewCard] = useState({
    question: '',
    answer: '',
    topic: '',
    difficulty: 'Medium' as const,
    isShared: true
  });

  const handleCreateCard = () => {
    if (!selectedDeck || !newCard.question || !newCard.answer) return;

    const card: Flashcard = {
      id: Date.now().toString(),
      ...newCard,
      createdBy: 'You',
      streak: 0
    };

    setDecks(prev => prev.map(deck => 
      deck.id === selectedDeck.id 
        ? { ...deck, cards: [...deck.cards, card] }
        : deck
    ));

    setNewCard({
      question: '',
      answer: '',
      topic: '',
      difficulty: 'Medium',
      isShared: true
    });
    setShowCreateCard(false);
  };

  const handleFlipCard = () => {
    setIsFlipped(!isFlipped);
  };

  const handleNextCard = () => {
    if (selectedDeck && selectedDeck.cards.length > 0) {
      setCurrentCardIndex((prev) => (prev + 1) % selectedDeck.cards.length);
      setIsFlipped(false);
    }
  };

  const handlePrevCard = () => {
    if (selectedDeck && selectedDeck.cards.length > 0) {
      setCurrentCardIndex((prev) => (prev - 1 + selectedDeck.cards.length) % selectedDeck.cards.length);
      setIsFlipped(false);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-progress/10 text-progress border-progress/20';
      case 'Medium': return 'bg-warning/10 text-warning border-warning/20';
      case 'Hard': return 'bg-destructive/10 text-destructive border-destructive/20';
      default: return 'bg-muted/10 text-muted-foreground border-muted/20';
    }
  };

  if (selectedDeck) {
    const currentCard = selectedDeck.cards[currentCardIndex];

    return (
      <div className="space-y-6">
        {/* Deck Header */}
        <Card className="rounded-3xl shadow-neumorph bg-gradient-secondary border-0">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-focus" />
                  {selectedDeck.name}
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  {selectedDeck.description}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="outline" className={selectedDeck.isShared ? 'bg-focus/10 text-focus border-focus/20' : 'bg-muted/10 text-muted-foreground border-muted/20'} >
                    {selectedDeck.isShared ? <Share className="w-3 h-3 mr-1" /> : <Lock className="w-3 h-3 mr-1" />}
                    {selectedDeck.isShared ? 'Shared' : 'Private'}
                  </Badge>
                  <Badge variant="outline" className="bg-accent/10 text-accent border-accent/20">
                    {selectedDeck.cards.length} cards
                  </Badge>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => setShowCreateCard(true)}
                  variant="outline"
                  className="rounded-2xl shadow-neumorph hover:shadow-neumorph-pressed transition-all duration-200"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Card
                </Button>
                <Button
                  onClick={() => setSelectedDeck(null)}
                  variant="outline"
                  className="rounded-2xl shadow-neumorph hover:shadow-neumorph-pressed transition-all duration-200"
                >
                  Back to Decks
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Create Card Modal */}
        {showCreateCard && (
          <Card className="rounded-3xl shadow-neumorph bg-gradient-secondary border-0">
            <CardHeader>
              <CardTitle>Create New Flashcard</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="question">Question</Label>
                <Textarea
                  id="question"
                  placeholder="Enter your question..."
                  value={newCard.question}
                  onChange={(e) => setNewCard(prev => ({ ...prev, question: e.target.value }))}
                  className="rounded-2xl shadow-neumorph-inset"
                />
              </div>
              
              <div>
                <Label htmlFor="answer">Answer</Label>
                <Textarea
                  id="answer"
                  placeholder="Enter the answer..."
                  value={newCard.answer}
                  onChange={(e) => setNewCard(prev => ({ ...prev, answer: e.target.value }))}
                  className="rounded-2xl shadow-neumorph-inset"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="topic">Topic</Label>
                  <Input
                    id="topic"
                    placeholder="e.g., Present Value"
                    value={newCard.topic}
                    onChange={(e) => setNewCard(prev => ({ ...prev, topic: e.target.value }))}
                    className="rounded-2xl shadow-neumorph-inset"
                  />
                </div>
                
                <div>
                  <Label htmlFor="difficulty">Difficulty</Label>
                  <Select value={newCard.difficulty} onValueChange={(value: any) => setNewCard(prev => ({ ...prev, difficulty: value }))}>
                    <SelectTrigger className="rounded-2xl shadow-neumorph-inset">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Easy">Easy</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="Hard">Hard</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={handleCreateCard}
                  className="flex-1 rounded-2xl shadow-neumorph hover:shadow-neumorph-pressed transition-all duration-200"
                >
                  Create Card
                </Button>
                <Button
                  onClick={() => setShowCreateCard(false)}
                  variant="outline"
                  className="rounded-2xl shadow-neumorph hover:shadow-neumorph-pressed transition-all duration-200"
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Flashcard Viewer */}
        {selectedDeck.cards.length > 0 ? (
          <div className="space-y-4">
            {/* Card Counter */}
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Card {currentCardIndex + 1} of {selectedDeck.cards.length}
              </p>
            </div>

            {/* Flashcard */}
            <div className="relative">
              <Card 
                className="rounded-3xl shadow-neumorph-float bg-gradient-secondary border-0 cursor-pointer min-h-[300px] transition-all duration-500 transform-gpu"
                onClick={handleFlipCard}
                style={{
                  transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                  transformStyle: 'preserve-3d'
                }}
              >
                <CardContent className="p-8 flex flex-col justify-center items-center text-center min-h-[300px]">
                  <div 
                    className="w-full"
                    style={{
                      transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                      backfaceVisibility: 'hidden'
                    }}
                  >
                    {!isFlipped ? (
                      <div className="space-y-4">
                        <Badge variant="outline" className={getDifficultyColor(currentCard.difficulty)}>
                          {currentCard.difficulty}
                        </Badge>
                        <h3 className="text-lg font-semibold">Question</h3>
                        <p className="text-foreground leading-relaxed">
                          {currentCard.question}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Click to reveal answer
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="flex items-center justify-center gap-2">
                          <Badge variant="outline" className="bg-focus/10 text-focus border-focus/20">
                            {currentCard.topic}
                          </Badge>
                          {currentCard.streak > 0 && (
                            <Badge variant="outline" className="bg-progress/10 text-progress border-progress/20">
                              <Star className="w-3 h-3 mr-1" />
                              {currentCard.streak} streak
                            </Badge>
                          )}
                        </div>
                        <h3 className="text-lg font-semibold">Answer</h3>
                        <p className="text-foreground leading-relaxed">
                          {currentCard.answer}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Created by {currentCard.createdBy}
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Navigation */}
            <div className="flex justify-center gap-4">
              <Button
                onClick={handlePrevCard}
                variant="outline"
                className="rounded-2xl shadow-neumorph hover:shadow-neumorph-pressed transition-all duration-200"
              >
                Previous
              </Button>
              <Button
                onClick={handleFlipCard}
                className="rounded-2xl shadow-neumorph hover:shadow-neumorph-pressed transition-all duration-200"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Flip Card
              </Button>
              <Button
                onClick={handleNextCard}
                variant="outline"
                className="rounded-2xl shadow-neumorph hover:shadow-neumorph-pressed transition-all duration-200"
              >
                Next
              </Button>
            </div>
          </div>
        ) : (
          <Card className="rounded-3xl shadow-neumorph bg-gradient-secondary border-0">
            <CardContent className="p-8 text-center">
              <BookOpen className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">No Cards Yet</h3>
              <p className="text-muted-foreground mb-4">
                Start building your deck by adding your first flashcard.
              </p>
              <Button
                onClick={() => setShowCreateCard(true)}
                className="rounded-2xl shadow-neumorph hover:shadow-neumorph-pressed transition-all duration-200"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add First Card
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Study Decks</h2>
          <p className="text-muted-foreground">
            Collaborate on flashcards with your study buddies
          </p>
        </div>
        <Button
          onClick={() => setIsCreating(true)}
          className="rounded-2xl shadow-neumorph hover:shadow-neumorph-pressed transition-all duration-200"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Deck
        </Button>
      </div>

      {/* Deck Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {decks.map((deck) => (
          <Card 
            key={deck.id} 
            className="rounded-3xl shadow-neumorph bg-gradient-secondary border-0 hover:shadow-neumorph-float transition-all duration-300 cursor-pointer"
            onClick={() => setSelectedDeck(deck)}
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-focus" />
                    {deck.name}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    {deck.description}
                  </p>
                </div>
                {deck.isShared ? (
                  <Share className="w-4 h-4 text-focus" />
                ) : (
                  <Lock className="w-4 h-4 text-muted-foreground" />
                )}
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{deck.cards.length} cards</span>
                <span className="text-muted-foreground">Modified {deck.lastModified}</span>
              </div>
              
              {deck.collaborators.length > 0 && (
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  <div className="flex gap-1">
                    {deck.collaborators.map((collaborator, index) => (
                      <Badge key={index} variant="outline" className="text-xs rounded-lg">
                        {collaborator}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 rounded-2xl shadow-neumorph hover:shadow-neumorph-pressed transition-all duration-200"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedDeck(deck);
                  }}
                >
                  <Eye className="w-3 h-3 mr-1" />
                  View
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-2xl shadow-neumorph hover:shadow-neumorph-pressed transition-all duration-200"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Edit className="w-3 h-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {decks.length === 0 && (
        <Card className="rounded-3xl shadow-neumorph bg-gradient-secondary border-0">
          <CardContent className="p-8 text-center">
            <BookOpen className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-semibold mb-2">No Study Decks</h3>
            <p className="text-muted-foreground mb-4">
              Create your first deck to start building collaborative flashcards.
            </p>
            <Button
              onClick={() => setIsCreating(true)}
              className="rounded-2xl shadow-neumorph hover:shadow-neumorph-pressed transition-all duration-200"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create First Deck
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SharedStudyDecks;
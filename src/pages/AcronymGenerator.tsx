import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { 
  Lightbulb, 
  Plus, 
  Search, 
  BookmarkPlus,
  Brain,
  Sparkles,
  Copy,
  Trash2
} from 'lucide-react';

const AcronymGenerator = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [newTerm, setNewTerm] = useState('');
  const [newAcronym, setNewAcronym] = useState('');
  const [newDefinition, setNewDefinition] = useState('');

  const savedAcronyms = [
    {
      id: 1,
      term: 'NPV',
      acronym: 'Net Present Value',
      definition: 'The difference between present value of cash inflows and outflows',
      category: 'Financial Mathematics',
      memoryAid: 'Net Profit Victory - remember it as your victory in calculating profit'
    },
    {
      id: 2,
      term: 'IRR',
      acronym: 'Internal Rate of Return',
      definition: 'The discount rate that makes NPV equal to zero',
      category: 'Investment Analysis',
      memoryAid: 'I Really Return - the rate that really returns your investment'
    },
    {
      id: 3,
      term: 'PV',
      acronym: 'Present Value',
      definition: 'Current worth of future cash flows',
      category: 'Time Value',
      memoryAid: 'Present Victory - victory is in the present, not future'
    },
    {
      id: 4,
      term: 'FV',
      acronym: 'Future Value',
      definition: 'Value of current investment at a future date',
      category: 'Time Value',
      memoryAid: 'Future Victory - your victory awaits in the future'
    }
  ];

  const generateMemoryAid = () => {
    // Simulated AI generation - in real app this would call an AI service
    const aids = [
      `${newTerm} - Think of it as "${newTerm.split('').map(c => getWordForLetter(c)).join(' ')}"`,
      `Remember ${newTerm} by: "${newTerm.split('').map(c => getRandomWord(c)).join(' ')}"`,
      `${newTerm} memory trick: "${newTerm.split('').map(c => getActuarialWord(c)).join(' ')}"`,
    ];
    return aids[Math.floor(Math.random() * aids.length)];
  };

  const getWordForLetter = (letter: string) => {
    const words = {
      'A': 'Always', 'B': 'Better', 'C': 'Calculate', 'D': 'Determine', 'E': 'Evaluate',
      'F': 'Find', 'G': 'Generate', 'H': 'Help', 'I': 'Identify', 'J': 'Judge',
      'K': 'Know', 'L': 'Learn', 'M': 'Measure', 'N': 'Navigate', 'O': 'Organize',
      'P': 'Plan', 'Q': 'Question', 'R': 'Remember', 'S': 'Study', 'T': 'Think',
      'U': 'Understand', 'V': 'Value', 'W': 'Work', 'X': 'eXamine', 'Y': 'Yield', 'Z': 'Zero'
    };
    return words[letter.toUpperCase()] || letter;
  };

  const getRandomWord = (letter: string) => {
    const words = {
      'A': 'Apple', 'B': 'Book', 'C': 'Cat', 'D': 'Dog', 'E': 'Eagle',
      'F': 'Fire', 'G': 'Green', 'H': 'House', 'I': 'Ice', 'J': 'Jump',
      'K': 'King', 'L': 'Light', 'M': 'Moon', 'N': 'Night', 'O': 'Ocean',
      'P': 'Peace', 'Q': 'Queen', 'R': 'River', 'S': 'Sun', 'T': 'Tree',
      'U': 'Unity', 'V': 'Victory', 'W': 'Water', 'X': 'X-ray', 'Y': 'Yellow', 'Z': 'Zebra'
    };
    return words[letter.toUpperCase()] || letter;
  };

  const getActuarialWord = (letter: string) => {
    const words = {
      'A': 'Actuarial', 'B': 'Bond', 'C': 'Cash', 'D': 'Discount', 'E': 'Equity',
      'F': 'Future', 'G': 'Growth', 'H': 'Hedge', 'I': 'Interest', 'J': 'Joint',
      'K': 'Knowledge', 'L': 'Liability', 'M': 'Market', 'N': 'Net', 'O': 'Option',
      'P': 'Present', 'Q': 'Quantify', 'R': 'Risk', 'S': 'Security', 'T': 'Time',
      'U': 'Utility', 'V': 'Value', 'W': 'Wealth', 'X': 'eXchange', 'Y': 'Yield', 'Z': 'Zone'
    };
    return words[letter.toUpperCase()] || letter;
  };

  const filteredAcronyms = savedAcronyms.filter(acronym =>
    acronym.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
    acronym.acronym.toLowerCase().includes(searchTerm.toLowerCase()) ||
    acronym.definition.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">
            Acronym Generator
          </h1>
          <p className="text-muted-foreground">
            Create memorable acronyms and memory aids for actuarial terms
          </p>
        </div>
        <Badge variant="outline" className="p-2">
          <Brain className="w-4 h-4 mr-2" />
          {savedAcronyms.length} Saved Terms
        </Badge>
      </div>

      {/* Search */}
      <Card className="shadow-card">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search acronyms, terms, or definitions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Create New Acronym */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Create New Acronym
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Term/Abbreviation</label>
              <Input
                placeholder="e.g., NPV, IRR, WACC"
                value={newTerm}
                onChange={(e) => setNewTerm(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Full Form</label>
              <Input
                placeholder="e.g., Net Present Value"
                value={newAcronym}
                onChange={(e) => setNewAcronym(e.target.value)}
              />
            </div>
          </div>
          
          <div>
            <label className="text-sm font-medium mb-2 block">Definition</label>
            <Textarea
              placeholder="Explain what this term means..."
              value={newDefinition}
              onChange={(e) => setNewDefinition(e.target.value)}
              rows={3}
            />
          </div>

          <div className="flex gap-2">
            <Button onClick={generateMemoryAid} variant="outline" className="gap-2">
              <Sparkles className="w-4 h-4" />
              Generate Memory Aid
            </Button>
            <Button className="gap-2">
              <BookmarkPlus className="w-4 h-4" />
              Save Acronym
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Saved Acronyms */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5" />
            Your Acronym Library
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {filteredAcronyms.map((item) => (
            <div key={item.id} className="p-4 rounded-xl border bg-card/50 hover:bg-card transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-primary rounded-lg shadow-neumorph-inset flex items-center justify-center">
                    <span className="font-bold text-primary-foreground text-sm">{item.term}</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{item.acronym}</h3>
                    <Badge variant="secondary" className="mt-1">{item.category}</Badge>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm">
                    <Copy className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              <p className="text-muted-foreground mb-3">{item.definition}</p>
              
              <div className="p-3 bg-accent/10 rounded-lg border-l-4 border-accent">
                <div className="flex items-center gap-2 mb-1">
                  <Brain className="w-4 h-4 text-accent" />
                  <span className="text-sm font-medium text-accent">Memory Aid</span>
                </div>
                <p className="text-sm">{item.memoryAid}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default AcronymGenerator;
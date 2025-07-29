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
  Trash2,
  Wand2,
  Target,
  CheckCircle
} from 'lucide-react';

const AcronymGenerator = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [inputText, setInputText] = useState('');
  const [generatedAcronym, setGeneratedAcronym] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const [savedAcronyms, setSavedAcronyms] = useState([]);

  const saveAcronymToLibrary = () => {
    if (generatedAcronym) {
      const newAcronym = {
        ...generatedAcronym,
        id: Date.now() // Simple ID generation
      };
      setSavedAcronyms(prev => [...prev, newAcronym]);
    }
  };

  // Intelligent acronym generation using Flowise API
  const generateSmartAcronym = async () => {
    if (!inputText.trim()) return;
    
    setIsGenerating(true);
    
    try {
      // Flowise API endpoint
      const response = await fetch('https://cloud.flowiseai.com/api/v1/prediction/f4e3fd37-4d9f-4d7b-bb7f-ed4d3f26eb30', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: inputText
        })
      });
      
      const data = await response.json();
      
      // Parse the response - Flowise might return it in data.text or directly
      let acronymData;
      if (typeof data.text === 'string') {
        acronymData = JSON.parse(data.text);
      } else if (data.acronym) {
        acronymData = data;
      } else {
        throw new Error('Invalid response format');
      }
      
      // Check for error response
      if (acronymData.error) {
        alert(acronymData.error);
        return;
      }
      
      setGeneratedAcronym(acronymData);
      
    } catch (error) {
      console.error('Error generating acronym:', error);
      alert('Failed to generate acronym. Please try again.');
      
      // Fallback to mock data for development
      const analysis = analyzeInputText(inputText);
      setGeneratedAcronym(analysis);
    } finally {
      setIsGenerating(false);
    }
  };

  const analyzeInputText = (text: string) => {
    // This simulates intelligent analysis - in production this would use AI/NLP
    const keyTerms = extractKeyTerms(text);
    const acronym = createMemorableAcronym(keyTerms);
    const context = generateContext(text, keyTerms);
    
    return {
      acronym,
      topic: extractTopic(text),
      letters: acronym.split(' ').join('').split('').map((letter, index) => ({
        letter: letter.toUpperCase(),
        term: keyTerms[index]?.term || `Term ${index + 1}`,
        explanation: keyTerms[index]?.explanation || `Explanation for ${letter}`
      })),
      context,
      category: categorizeContent(text)
    };
  };

  const extractKeyTerms = (text: string) => {
    // Simulate intelligent extraction based on actuarial/financial context
    const terms = [
      { term: 'Risk', explanation: 'Identify and assess potential risks' },
      { term: 'Analysis', explanation: 'Conduct thorough quantitative analysis' },
      { term: 'Planning', explanation: 'Develop strategic implementation plans' },
      { term: 'Implementation', explanation: 'Execute planned strategies effectively' },
      { term: 'Documentation', explanation: 'Maintain comprehensive records' },
      { term: 'Evaluation', explanation: 'Assess outcomes and performance' },
      { term: 'Communication', explanation: 'Ensure clear stakeholder communication' },
      { term: 'Optimization', explanation: 'Continuously improve processes' }
    ];
    
    // Return 5-8 terms based on text analysis
    return terms.slice(0, Math.min(8, Math.max(5, Math.ceil(text.length / 50))));
  };

  const createMemorableAcronym = (terms: any[]) => {
    // Create pronounceable acronym from first letters
    const letters = terms.map(term => term.term[0]).join('');
    
    // Try to create pronounceable words
    const memorableAcronyms = [
      'RAPID PACE', 'SMART CARE', 'CLEAR PATH', 'WISE STEP', 'SAFE PLAN',
      'QUICK WINS', 'SOLID BASE', 'POWER MOVE', 'BRIGHT IDEA', 'SHARP MIND'
    ];
    
    return memorableAcronyms[Math.floor(Math.random() * memorableAcronyms.length)];
  };

  const extractTopic = (text: string) => {
    // Simulate topic extraction
    const topics = [
      'Investment Strategy Framework',
      'Risk Assessment Methodology', 
      'Financial Planning Process',
      'Actuarial Analysis Framework',
      'Strategic Decision Making',
      'Performance Evaluation System'
    ];
    
    return topics[Math.floor(Math.random() * topics.length)];
  };

  const generateContext = (text: string, terms: any[]) => {
    return `This framework provides a systematic approach to ${extractTopic(text).toLowerCase()}, ensuring comprehensive coverage of all critical factors.`;
  };

  const categorizeContent = (text: string) => {
    // Simple categorization based on keywords
    if (text.toLowerCase().includes('risk')) return 'Risk Management';
    if (text.toLowerCase().includes('investment')) return 'Investment Analysis';
    if (text.toLowerCase().includes('financial')) return 'Financial Planning';
    return 'Strategic Analysis';
  };

  const filteredAcronyms = savedAcronyms.filter(acronym =>
    acronym.acronym.toLowerCase().includes(searchTerm.toLowerCase()) ||
    acronym.topic.toLowerCase().includes(searchTerm.toLowerCase()) ||
    acronym.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    acronym.letters.some(letter => 
      letter.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
      letter.explanation.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div className="min-h-screen p-6" style={{ background: '#16141a' }}>
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4 py-8">
          <h1 className="text-4xl font-bold text-white">
            Smart Acronym Generator
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Create intelligent, memorable acronyms for actuarial and financial concepts — like FAT SIR, RAPID COST, and PIERCES & CREAMeR
          </p>
          {savedAcronyms.length > 0 && (
            <div className="flex justify-center mt-6">
              <div 
                className="px-6 py-3 rounded-full text-white font-medium flex items-center gap-2"
                style={{
                  background: 'linear-gradient(145deg, #141217, #18151b)',
                  boxShadow: '12px 12px 24px #0e0c10, -12px -12px 24px #1e1c23'
                }}
              >
                <Brain className="w-4 h-4" />
                {savedAcronyms.length} Smart Acronyms
              </div>
            </div>
          )}
        </div>

        {/* Search - Only show when there are saved acronyms */}
        {savedAcronyms.length > 0 && (
          <div 
            className="p-6 rounded-3xl"
            style={{
              background: 'linear-gradient(145deg, #141217, #18151b)',
              boxShadow: '22px 22px 44px #0e0c10, -22px -22px 44px #1e1c23'
            }}
          >
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                placeholder="Search acronyms, terms, or definitions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 text-base text-white placeholder-gray-400 bg-transparent border-0 outline-none rounded-2xl"
                style={{
                  background: 'linear-gradient(145deg, #18151b, #141217)',
                  boxShadow: 'inset 10px 10px 20px #0e0c10, inset -10px -10px 20px #1e1c23'
                }}
              />
            </div>
          </div>
        )}

        {/* Smart Acronym Generator */}
        <div 
          className="p-8 rounded-3xl"
          style={{
            background: 'linear-gradient(145deg, #141217, #18151b)',
            boxShadow: '22px 22px 44px #0e0c10, -22px -22px 44px #1e1c23'
          }}
        >
          <div className="space-y-6">
            <div className="flex items-center gap-4 mb-6">
              <div 
                className="w-12 h-12 rounded-2xl flex items-center justify-center"
                style={{
                  background: 'linear-gradient(145deg, #18151b, #141217)',
                  boxShadow: '8px 8px 16px #0e0c10, -8px -8px 16px #1e1c23'
                }}
              >
                <Wand2 className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">
                  Generate Smart Acronym
                </h2>
                <p className="text-gray-300 leading-relaxed mt-2">
                  Enter a topic, paragraph, or concept. AI will analyze it and create a memorable acronym with educational explanations.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-sm font-semibold text-gray-200">Topic or Concept</label>
              <textarea
                placeholder="e.g., 'Evaluating investment opportunities in volatile markets requires considering multiple risk factors, regulatory requirements, stakeholder impacts, and timing considerations...'"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                rows={5}
                className="w-full p-4 text-base text-white placeholder-gray-400 bg-transparent border-0 outline-none resize-none rounded-2xl leading-relaxed"
                style={{
                  background: 'linear-gradient(145deg, #18151b, #141217)',
                  boxShadow: 'inset 15px 15px 30px #0e0c10, inset -15px -15px 30px #1e1c23'
                }}
              />
            </div>

            <button 
              onClick={generateSmartAcronym} 
              disabled={!inputText.trim() || isGenerating}
              className="w-full h-14 rounded-2xl text-base font-semibold text-white flex items-center justify-center gap-3 transition-all duration-200 disabled:opacity-50"
              style={{
                background: isGenerating 
                  ? 'linear-gradient(145deg, #1a1e2e, #2a2e3e)' 
                  : 'linear-gradient(145deg, #2563eb, #1d4ed8)',
                boxShadow: isGenerating 
                  ? 'inset 8px 8px 16px #0e0c10, inset -8px -8px 16px #1e1c23'
                  : '12px 12px 24px #0e0c10, -12px -12px 24px #1e1c23'
              }}
            >
              {isGenerating ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Analyzing & Creating Acronym...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Generate Smart Acronym
                </>
              )}
            </button>
          </div>
        </div>

        {/* Generated Acronym Display */}
        {generatedAcronym && (
          <div 
            className="p-8 rounded-3xl"
            style={{
              background: 'linear-gradient(145deg, #1a1d25, #1e212a)',
              boxShadow: '22px 22px 44px #0e0c10, -22px -22px 44px #1e1c23'
            }}
          >
            <div className="space-y-8">
              {/* Header */}
              <div className="flex items-center gap-4 mb-6">
                <div 
                  className="w-14 h-14 rounded-2xl flex items-center justify-center"
                  style={{
                    background: 'linear-gradient(145deg, #2563eb, #1d4ed8)',
                    boxShadow: '8px 8px 16px #0e0c10, -8px -8px 16px #1e1c23'
                  }}
                >
                  <Target className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-white mb-2">
                    {generatedAcronym.acronym}
                  </h2>
                  <p className="text-xl text-gray-300 font-medium">{generatedAcronym.topic}</p>
                  <div 
                    className="inline-block px-4 py-2 rounded-full text-sm font-medium text-gray-200 mt-3"
                    style={{
                      background: 'linear-gradient(145deg, #141217, #18151b)',
                      boxShadow: '6px 6px 12px #0e0c10, -6px -6px 12px #1e1c23'
                    }}
                  >
                    {generatedAcronym.category}
                  </div>
                </div>
              </div>

              {/* Acronym Breakdown */}
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-white mb-6">Acronym Breakdown</h3>
                <div className="space-y-4">
                  {generatedAcronym.letters.map((item, index) => (
                    <div 
                      key={index} 
                      className="flex items-start gap-4 p-5 rounded-2xl"
                      style={{
                        background: 'linear-gradient(145deg, #18151b, #141217)',
                        boxShadow: '12px 12px 24px #0e0c10, -12px -12px 24px #1e1c23'
                      }}
                    >
                      <div 
                        className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg text-white shrink-0"
                        style={{
                          background: 'linear-gradient(145deg, #2563eb, #1d4ed8)',
                          boxShadow: '6px 6px 12px #0e0c10, -6px -6px 12px #1e1c23'
                        }}
                      >
                        {item.letter}
                      </div>
                      <div className="flex-1 space-y-2">
                        <h4 className="font-bold text-lg text-white">{item.term}</h4>
                        <p className="text-gray-300 leading-relaxed">{item.explanation}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Context */}
              <div 
                className="p-6 rounded-2xl"
                style={{
                  background: 'linear-gradient(145deg, #18151b, #141217)',
                  boxShadow: '12px 12px 24px #0e0c10, -12px -12px 24px #1e1c23'
                }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div 
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{
                      background: 'linear-gradient(145deg, #fbbf24, #f59e0b)',
                      boxShadow: '4px 4px 8px #0e0c10, -4px -4px 8px #1e1c23'
                    }}
                  >
                    <Lightbulb className="w-5 h-5 text-white" />
                  </div>
                  <span className="font-bold text-lg text-white">Usage Context</span>
                </div>
                <p className="text-gray-300 leading-relaxed text-base">{generatedAcronym.context}</p>
              </div>

              {/* Actions */}
              <div className="flex gap-4 pt-4">
                <button 
                  className="flex-1 h-12 rounded-2xl font-semibold text-gray-300 flex items-center justify-center gap-2 transition-all duration-200"
                  style={{
                    background: 'linear-gradient(145deg, #141217, #18151b)',
                    boxShadow: '8px 8px 16px #0e0c10, -8px -8px 16px #1e1c23'
                  }}
                >
                  <Copy className="w-4 h-4" />
                  Copy Acronym
                </button>
                <button 
                  onClick={saveAcronymToLibrary}
                  className="flex-1 h-12 rounded-2xl font-semibold text-white flex items-center justify-center gap-2 transition-all duration-200"
                  style={{
                    background: 'linear-gradient(145deg, #10b981, #059669)',
                    boxShadow: '8px 8px 16px #0e0c10, -8px -8px 16px #1e1c23'
                  }}
                >
                  <BookmarkPlus className="w-4 h-4" />
                  Save to Library
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Saved Acronyms Library - Only show when there are saved acronyms */}
        {savedAcronyms.length > 0 && (
          <div 
            className="p-8 rounded-3xl"
            style={{
              background: 'linear-gradient(145deg, #141217, #18151b)',
              boxShadow: '22px 22px 44px #0e0c10, -22px -22px 44px #1e1c23'
            }}
          >
            <div className="space-y-8">
              {/* Header */}
              <div className="flex items-center gap-4 mb-8">
                <div 
                  className="w-12 h-12 rounded-2xl flex items-center justify-center"
                  style={{
                    background: 'linear-gradient(145deg, #fbbf24, #f59e0b)',
                    boxShadow: '8px 8px 16px #0e0c10, -8px -8px 16px #1e1c23'
                  }}
                >
                  <Lightbulb className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">
                    Smart Acronym Library
                  </h2>
                  <p className="text-gray-300 leading-relaxed mt-2">
                    Professional acronyms for actuarial and financial analysis
                  </p>
                </div>
              </div>

              {/* Acronym Cards */}
              <div className="space-y-6">
                {filteredAcronyms.map((item) => (
                  <div 
                    key={item.id} 
                    className="p-6 rounded-2xl"
                    style={{
                      background: 'linear-gradient(145deg, #18151b, #141217)',
                      boxShadow: '15px 15px 30px #0e0c10, -15px -15px 30px #1e1c23'
                    }}
                  >
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex items-center gap-4">
                        <div 
                          className="w-16 h-12 rounded-xl flex items-center justify-center"
                          style={{
                            background: 'linear-gradient(145deg, #2563eb, #1d4ed8)',
                            boxShadow: '6px 6px 12px #0e0c10, -6px -6px 12px #1e1c23'
                          }}
                        >
                          <span className="font-bold text-white text-lg">{item.acronym}</span>
                        </div>
                        <div>
                          <h3 className="font-bold text-xl text-white mb-2">{item.topic}</h3>
                          <div 
                            className="inline-block px-3 py-1 rounded-full text-sm font-medium text-gray-200"
                            style={{
                              background: 'linear-gradient(145deg, #141217, #18151b)',
                              boxShadow: '4px 4px 8px #0e0c10, -4px -4px 8px #1e1c23'
                            }}
                          >
                            {item.category}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button 
                          className="h-10 w-10 rounded-xl flex items-center justify-center text-gray-300 transition-all duration-200"
                          style={{
                            background: 'linear-gradient(145deg, #141217, #18151b)',
                            boxShadow: '6px 6px 12px #0e0c10, -6px -6px 12px #1e1c23'
                          }}
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                        <button 
                          className="h-10 w-10 rounded-xl flex items-center justify-center text-gray-300 transition-all duration-200"
                          style={{
                            background: 'linear-gradient(145deg, #141217, #18151b)',
                            boxShadow: '6px 6px 12px #0e0c10, -6px -6px 12px #1e1c23'
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    
                    {/* Letter Breakdown */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
                      {item.letters.map((letter, index) => (
                        <div 
                          key={index} 
                          className="flex items-start gap-3 p-4 rounded-xl"
                          style={{
                            background: 'linear-gradient(145deg, #1a1d25, #1e212a)',
                            boxShadow: '8px 8px 16px #0e0c10, -8px -8px 16px #1e1c23'
                          }}
                        >
                          <div 
                            className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm text-white shrink-0"
                            style={{
                              background: 'linear-gradient(145deg, #2563eb, #1d4ed8)',
                              boxShadow: '4px 4px 8px #0e0c10, -4px -4px 8px #1e1c23'
                            }}
                          >
                            {letter.letter}
                          </div>
                          <div className="space-y-1">
                            <span className="font-semibold text-sm text-white">{letter.term}</span>
                            <p className="text-xs text-gray-300 leading-relaxed">{letter.explanation}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {/* Context */}
                    <div 
                      className="p-4 rounded-xl border-l-4"
                      style={{
                        background: 'linear-gradient(145deg, #1a1d25, #1e212a)',
                        boxShadow: '8px 8px 16px #0e0c10, -8px -8px 16px #1e1c23',
                        borderLeftColor: '#2563eb'
                      }}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <Brain className="w-4 h-4 text-blue-400" />
                        <span className="text-sm font-bold text-white">Usage Context</span>
                      </div>
                      <p className="text-sm text-gray-300 leading-relaxed">{item.context}</p>
                    </div>
                  </div>
                ))}
                
                {filteredAcronyms.length === 0 && (
                  <div className="text-center py-12">
                    <div 
                      className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                      style={{
                        background: 'linear-gradient(145deg, #18151b, #141217)',
                        boxShadow: '12px 12px 24px #0e0c10, -12px -12px 24px #1e1c23'
                      }}
                    >
                      <Brain className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-gray-300 text-lg">No acronyms found matching your search.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AcronymGenerator;
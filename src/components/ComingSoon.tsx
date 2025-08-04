import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Construction, 
  Sparkles, 
  Clock,
  ArrowLeft
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface ComingSoonProps {
  title: string;
  description: string;
  icon: React.ElementType;
  features?: string[];
  estimatedDate?: string;
}

export const ComingSoon: React.FC<ComingSoonProps> = ({ 
  title, 
  description, 
  icon: Icon, 
  features = [],
  estimatedDate = "Soon"
}) => {
  return (
    <div className="min-h-screen p-6" style={{ background: '#16141a' }}>
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4 py-8">
          <div 
            className="w-20 h-20 mx-auto rounded-3xl flex items-center justify-center mb-6"
            style={{
              background: 'linear-gradient(145deg, #141217, #18151b)',
              boxShadow: '22px 22px 44px #0e0c10, -22px -22px 44px #1e1c23'
            }}
          >
            <Icon className="w-10 h-10 text-blue-400" />
          </div>
          
          <h1 className="text-4xl font-bold text-white">
            {title}
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed">
            {description}
          </p>
          
          <div className="flex justify-center mt-6">
            <Badge 
              variant="secondary" 
              className="px-6 py-2 text-sm font-medium"
              style={{
                background: 'linear-gradient(145deg, #fbbf24, #f59e0b)',
                color: 'white'
              }}
            >
              <Clock className="w-4 h-4 mr-2" />
              Coming {estimatedDate}
            </Badge>
          </div>
        </div>

        {/* Under Construction Card */}
        <div 
          className="p-8 rounded-3xl text-center"
          style={{
            background: 'linear-gradient(145deg, #141217, #18151b)',
            boxShadow: '22px 22px 44px #0e0c10, -22px -22px 44px #1e1c23'
          }}
        >
          <div 
            className="w-16 h-16 mx-auto rounded-2xl flex items-center justify-center mb-6"
            style={{
              background: 'linear-gradient(145deg, #f97316, #ea580c)',
              boxShadow: '8px 8px 16px #0e0c10, -8px -8px 16px #1e1c23'
            }}
          >
            <Construction className="w-8 h-8 text-white" />
          </div>
          
          <h2 className="text-2xl font-bold text-white mb-4">
            Under Development
          </h2>
          <p className="text-gray-300 text-lg mb-8 leading-relaxed">
            We're working hard to bring you this amazing feature. It will be part of the TsungiAI ecosystem soon!
          </p>

          {/* Features Preview */}
          {features.length > 0 && (
            <div className="mb-8">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center justify-center gap-2">
                <Sparkles className="w-5 h-5 text-yellow-400" />
                What to Expect
              </h3>
              <div className="grid gap-3 max-w-md mx-auto">
                {features.map((feature, index) => (
                  <div 
                    key={index}
                    className="p-4 rounded-2xl text-left"
                    style={{
                      background: 'linear-gradient(145deg, #18151b, #141217)',
                      boxShadow: '8px 8px 16px #0e0c10, -8px -8px 16px #1e1c23'
                    }}
                  >
                    <p className="text-gray-200 text-sm">{feature}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Back Button */}
          <Link to="/">
            <Button 
              className="px-8 py-3 rounded-2xl text-white font-semibold flex items-center gap-2 mx-auto"
              style={{
                background: 'linear-gradient(145deg, #2563eb, #1d4ed8)',
                boxShadow: '12px 12px 24px #0e0c10, -12px -12px 24px #1e1c23'
              }}
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Audio Learning
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
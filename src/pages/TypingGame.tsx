import React from 'react';
import { ComingSoon } from '@/components/ComingSoon';
import { Keyboard } from 'lucide-react';

const TypingGame: React.FC = () => {
  return (
    <ComingSoon
      title="Typing Game"
      description="Master touch typing with actuarial terminology! Interactive typing lessons with hand visualization, progress tracking, and speed challenges."
      icon={Keyboard}
      features={[
        "Interactive virtual keyboard with finger positioning guides",
        "Actuarial and financial terminology for practice content", 
        "Real-time WPM and accuracy tracking",
        "Progressive lessons from basic keys to advanced concepts",
        "Hand visualization showing proper finger placement"
      ]}
      estimatedDate="Q1 2025"
    />
  );
};

export default TypingGame;
import React from 'react';
import { ComingSoon } from '@/components/ComingSoon';
import { Trophy } from 'lucide-react';

const Challenges: React.FC = () => {
  return (
    <ComingSoon
      title="Actuarial Challenges"
      description="Test your skills with gamified challenges, compete with peers, and earn achievements. Make learning fun and competitive!"
      icon={Trophy}
      features={[
        "Daily actuarial brain teasers and quick challenges",
        "Leaderboards and competitive rankings",
        "Achievement badges and milestone rewards",
        "Topic-specific challenge series (probability, statistics, etc.)",
        "Team challenges and collaborative problem solving"
      ]}
      estimatedDate="Q3 2025"
    />
  );
};

export default Challenges;
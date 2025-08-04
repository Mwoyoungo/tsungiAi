import React from 'react';
import { ComingSoon } from '@/components/ComingSoon';
import { BookOpen } from 'lucide-react';

const Practice: React.FC = () => {
  return (
    <ComingSoon
      title="Practice Tests"
      description="Master your actuarial exams with comprehensive mock tests, timed sessions, and detailed performance analytics. Practice makes perfect!"
      icon={BookOpen}
      features={[
        "Full-length mock exams for all actuarial subjects",
        "Timed practice sessions with real exam conditions",
        "Detailed performance analytics and weak area identification",
        "Adaptive question selection based on your progress",
        "Historical question bank with past exam papers"
      ]}
      estimatedDate="Q2 2025"
    />
  );
};

export default Practice;
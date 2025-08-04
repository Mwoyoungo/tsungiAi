import React from 'react';
import { ComingSoon } from '@/components/ComingSoon';
import { Users } from 'lucide-react';

const StudyBuddy: React.FC = () => {
  return (
    <ComingSoon
      title="Study Buddy Hub"
      description="Connect with fellow actuarial students for collaborative learning, shared study sessions, and peer support. Find your perfect study partner!"
      icon={Users}
      features={[
        "AI-powered buddy matching based on study goals and schedule",
        "Live video study sessions with screen sharing",
        "Collaborative flashcards and study materials",
        "Challenge friends with custom quizzes",
        "Group study rooms for exam preparation"
      ]}
      estimatedDate="Q2 2025"
    />
  );
};

export default StudyBuddy;
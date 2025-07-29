import React from 'react';
import Dashboard from '@/components/Dashboard';

const Index = () => {
  // Mock user data for dashboard
  const mockUserData = {
    examType: 'CT1 – Financial Mathematics',
    examDate: '2024-06-15',
    studyHours: 2,
    weekdayDuration: 45,
    weekendDuration: 90,
    preferredTimes: ['Evening'],
    studyBuddyInterest: true,
    audioLearning: true,
    acronymHelp: true
  };

  const handleStartStudy = () => {
    console.log('Starting study session...');
  };

  return <Dashboard userData={mockUserData} onStartStudy={handleStartStudy} />;
};

export default Index;

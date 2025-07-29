import React from 'react';
import { AppSidebar } from '@/components/AppSidebar';
import { MobileBottomNav } from '@/components/MobileBottomNav';

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="flex h-screen bg-background">
      {/* Desktop Sidebar - Hidden on mobile */}
      <AppSidebar className="hidden md:flex" />
      
      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="min-h-full bg-gradient-to-br from-background to-secondary/50 p-4 md:p-6 pb-20 md:pb-6">
          {children}
        </div>
      </main>
      
      {/* Mobile Bottom Navigation - Hidden on desktop */}
      <MobileBottomNav />
    </div>
  );
}
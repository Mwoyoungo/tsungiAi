import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { ThemeToggle } from '@/components/theme-toggle';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  LayoutDashboard,
  Users,
  Volume2,
  Lightbulb,
  BookOpen,
  Trophy,
  Upload,
  ChevronRight,
  LogOut
} from 'lucide-react';

interface SidebarProps {
  className?: string;
}

const sidebarItems = [
  {
    title: 'Audio Learning',
    href: '/',
    icon: Volume2,
    description: 'Listen & Learn'
  },
  {
    title: 'Acronym Generator',
    href: '/acronyms',
    icon: Lightbulb,
    description: 'Memory Aids'
  },
  {
    title: 'Study Buddy',
    href: '/study-buddy',
    icon: Users,
    description: 'Collaborative Learning'
  },
  {
    title: 'Upload Files',
    href: '/upload',
    icon: Upload,
    description: 'Upload Audio Files'
  },
  {
    title: 'Practice Tests',
    href: '/practice',
    icon: BookOpen,
    description: 'Mock Exams'
  },
  {
    title: 'Challenges',
    href: '/challenges',
    icon: Trophy,
    description: 'Test Your Skills'
  },
];

const UserProfileSection = () => {
  const { user, profile, signOut } = useAuth();

  if (!user || !profile) return null;

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const initials = profile.full_name
    ? profile.full_name.split(' ').map(n => n[0]).join('').toUpperCase()
    : 'U';

  return (
    <div className="p-4 border-t border-sidebar-border">
      <div className="flex items-center gap-3 mb-3">
        <Avatar className="h-10 w-10">
          <AvatarImage src={profile.avatar_url} alt={profile.full_name} />
          <AvatarFallback className="bg-gradient-primary text-primary-foreground">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-sidebar-foreground truncate">
            {profile.full_name}
          </p>
          <p className="text-xs text-muted-foreground truncate">
            {profile.email}
          </p>
        </div>
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={handleSignOut}
        className="w-full justify-start gap-2 text-sidebar-foreground hover:text-sidebar-accent-foreground hover:bg-sidebar-accent"
      >
        <LogOut className="h-4 w-4" />
        Sign Out
      </Button>
    </div>
  );
};

interface AppSidebarProps {
  className?: string;
}

export function AppSidebar({ className }: AppSidebarProps = {}) {
  const location = useLocation();

  return (
    <div className={cn(
      "flex h-full w-64 flex-col bg-sidebar border-r border-sidebar-border shadow-neumorph",
      className
    )}>
      {/* Header */}
      <div className="flex h-16 items-center justify-between px-6 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-primary rounded-lg shadow-neumorph-inset flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">T</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="font-bold text-sidebar-foreground">Tsungi</span>
            <span className="font-bold text-blue-400">AI</span>
            <span className="text-lg">😊</span>
          </div>
        </div>
        <ThemeToggle />
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2 p-4">
        {sidebarItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.href;
          
          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "group flex items-center gap-3 rounded-xl px-3 py-3 text-sm transition-all duration-200",
                "hover:bg-sidebar-accent hover:shadow-neumorph-inset",
                isActive
                  ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-neumorph-pressed"
                  : "text-sidebar-foreground hover:text-sidebar-accent-foreground"
              )}
            >
              <Icon className={cn(
                "h-5 w-5 transition-colors",
                isActive ? "text-sidebar-primary-foreground" : "text-sidebar-foreground"
              )} />
              <div className="flex-1">
                <div className="font-medium">{item.title}</div>
                <div className={cn(
                  "text-xs opacity-70",
                  isActive ? "text-sidebar-primary-foreground" : "text-muted-foreground"
                )}>
                  {item.description}
                </div>
              </div>
              {isActive && (
                <ChevronRight className="h-4 w-4 text-sidebar-primary-foreground" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* User Profile Section */}
      <UserProfileSection />

    </div>
  );
}
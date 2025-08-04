import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  Volume2,
  Lightbulb,
  Users,
  Upload,
  Keyboard
} from 'lucide-react';

const mobileNavItems = [
  {
    title: 'Audio',
    href: '/',
    icon: Volume2,
  },
  {
    title: 'Acronyms',
    href: '/acronyms',
    icon: Lightbulb,
  },
  {
    title: 'Study',
    href: '/study-buddy',
    icon: Users,
  },
  {
    title: 'Upload',
    href: '/upload',
    icon: Upload,
  },
  {
    title: 'Typing',
    href: '/typing-game',
    icon: Keyboard,
  },
];

export function MobileBottomNav() {
  const location = useLocation();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-t border-border md:hidden">
      <div className="flex items-center justify-around py-2 px-4 max-w-md mx-auto">
        {mobileNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.href;
          
          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex flex-col items-center gap-1 p-2 rounded-lg transition-all duration-200 min-w-0",
                isActive
                  ? "text-primary bg-primary/10"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className={cn(
                "h-5 w-5 transition-colors",
                isActive ? "text-primary" : "text-muted-foreground"
              )} />
              <span className={cn(
                "text-xs font-medium truncate",
                isActive ? "text-primary" : "text-muted-foreground"
              )}>
                {item.title}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

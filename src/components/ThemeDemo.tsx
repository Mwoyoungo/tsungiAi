import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ThemeToggle } from '@/components/theme-toggle';
import { Palette, Moon, Sun } from 'lucide-react';

export function ThemeDemo() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/50 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">
              Dark Theme Demo
            </h1>
            <p className="text-muted-foreground">
              Lilac-coordinated neumorphism design in light and dark modes
            </p>
          </div>
          <ThemeToggle />
        </div>

        {/* Color Palette Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="w-5 h-5 text-primary" />
                Primary Lilac
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="h-16 bg-primary rounded-lg shadow-neumorph"></div>
              <Progress value={75} className="h-3" />
              <Button variant="default" className="w-full">
                Primary Button
              </Button>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sun className="w-5 h-5 text-accent" />
                Secondary & Accent
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="h-8 bg-secondary rounded-lg shadow-neumorph-inset"></div>
              <div className="h-8 bg-accent rounded-lg shadow-neumorph-inset"></div>
              <Badge variant="secondary">Secondary Badge</Badge>
              <Button variant="outline" className="w-full">
                Accent Button
              </Button>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Moon className="w-5 h-5 text-focus" />
                Focus & Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="h-8 bg-focus rounded-lg shadow-neumorph-inset"></div>
              <div className="h-8 bg-progress rounded-lg shadow-neumorph-inset"></div>
              <div className="h-8 bg-warning rounded-lg shadow-neumorph-inset"></div>
              <Badge variant="outline" className="bg-focus text-focus-foreground">
                Focus State
              </Badge>
            </CardContent>
          </Card>
        </div>

        {/* Neumorphic Elements Demo */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Neumorphic Elements</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-6 rounded-2xl shadow-neumorph bg-gradient-secondary">
                <h3 className="font-semibold mb-2">Outset Shadow</h3>
                <p className="text-sm text-muted-foreground">Raised element effect</p>
              </div>
              <div className="p-6 rounded-2xl shadow-neumorph-inset bg-background">
                <h3 className="font-semibold mb-2">Inset Shadow</h3>
                <p className="text-sm text-muted-foreground">Pressed element effect</p>
              </div>
              <div className="p-6 rounded-2xl shadow-neumorph-float bg-gradient-accent">
                <h3 className="font-semibold mb-2 text-white">Float Shadow</h3>
                <p className="text-sm text-accent-foreground">Floating element effect</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Interactive Elements */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Interactive Components</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-4">
              <Button variant="default">Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge>Default</Badge>
              <Badge variant="secondary">Secondary</Badge>
              <Badge variant="outline">Outline</Badge>
              <Badge variant="destructive">Error</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
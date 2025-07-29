import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Target, Users } from 'lucide-react';

interface OnboardingProps {
  onComplete: (data: OnboardingData) => void;
}

export interface OnboardingData {
  examType: string;
  examDate: string;
  availabilityDays: string[];
  preferredTimes: string[];
  weekdayDuration: number;
  weekendDuration: number;
  location: string;
}

const OnboardingFlow: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<OnboardingData>({
    examType: '',
    examDate: '',
    availabilityDays: [],
    preferredTimes: [],
    weekdayDuration: 45,
    weekendDuration: 180,
    location: ''
  });

  const examTypes = [
    'CT1 – Financial Mathematics',
    'CT2 – Finance and Financial Reporting',
    'CT3 – Probability and Mathematical Statistics',
    'CT4 – Models',
    'CT5 – Contingencies',
    'CT6 – Statistical Methods',
    'CT7 – Business Economics',
    'CT8 – Financial Economics'
  ];

  const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const timeSlots = ['Morning', 'Afternoon', 'Evening'];

  const toggleDay = (day: string) => {
    setFormData(prev => ({
      ...prev,
      availabilityDays: prev.availabilityDays.includes(day)
        ? prev.availabilityDays.filter(d => d !== day)
        : [...prev.availabilityDays, day]
    }));
  };

  const toggleTime = (time: string) => {
    setFormData(prev => ({
      ...prev,
      preferredTimes: prev.preferredTimes.includes(time)
        ? prev.preferredTimes.filter(t => t !== time)
        : [...prev.preferredTimes, time]
    }));
  };

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  const calculateStudyPlan = () => {
    const examDate = new Date(formData.examDate);
    const today = new Date();
    const daysUntilExam = Math.ceil((examDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    const weekdaysAvailable = formData.availabilityDays.filter(day => 
      !['Saturday', 'Sunday'].includes(day)
    ).length;
    const weekendsAvailable = formData.availabilityDays.filter(day => 
      ['Saturday', 'Sunday'].includes(day)
    ).length;

    const weeksUntilExam = Math.floor(daysUntilExam / 7);
    const weekdayHours = (weekdaysAvailable * formData.weekdayDuration * weeksUntilExam) / 60;
    const weekendHours = (weekendsAvailable * formData.weekendDuration * weeksUntilExam) / 60;
    const totalHours = weekdayHours + weekendHours;

    return {
      daysUntilExam,
      weeksUntilExam,
      totalHours: Math.round(totalHours),
      hoursPerWeek: Math.round((weekdayHours + weekendHours) / weeksUntilExam),
      weekdayHours: Math.round(weekdayHours),
      weekendHours: Math.round(weekendHours)
    };
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6 animate-slide-up">
            <div className="text-center">
              <Target className="w-16 h-16 mx-auto mb-4 text-primary" />
              <h2 className="text-2xl font-bold mb-2">Choose Your Exam</h2>
              <p className="text-muted-foreground">Select the actuarial exam you're preparing for</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="examType">Exam Type</Label>
                <Select value={formData.examType} onValueChange={(value) => 
                  setFormData(prev => ({ ...prev, examType: value }))
                }>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your exam" />
                  </SelectTrigger>
                  <SelectContent>
                    {examTypes.map(exam => (
                      <SelectItem key={exam} value={exam}>{exam}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="examDate">Exam Date</Label>
                <Input
                  type="date"
                  value={formData.examDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, examDate: e.target.value }))}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>

              <div>
                <Label htmlFor="location">Location/Country</Label>
                <Input
                  placeholder="e.g., United Kingdom, South Africa"
                  value={formData.location}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                />
              </div>
            </div>

            <Button 
              onClick={nextStep} 
              disabled={!formData.examType || !formData.examDate || !formData.location}
              className="w-full"
              variant="primary"
            >
              Continue
            </Button>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6 animate-slide-up">
            <div className="text-center">
              <Calendar className="w-16 h-16 mx-auto mb-4 text-primary" />
              <h2 className="text-2xl font-bold mb-2">Your Availability</h2>
              <p className="text-muted-foreground">When are you free to study?</p>
            </div>

            <div className="space-y-4">
              <div>
                <Label>Days Available</Label>
                <div className="grid grid-cols-4 gap-2 mt-2">
                  {weekDays.map(day => (
                    <Button
                      key={day}
                      variant={formData.availabilityDays.includes(day) ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleDay(day)}
                      className="text-xs rounded-2xl shadow-neumorph hover:shadow-neumorph-pressed transition-all duration-200"
                    >
                      {day.slice(0, 3)}
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <Label>Preferred Study Times (Select at least 2)</Label>
                <div className="grid grid-cols-3 gap-3 mt-2">
                  {timeSlots.map(time => (
                    <Button
                      key={time}
                      variant={formData.preferredTimes.includes(time) ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleTime(time)}
                      className="rounded-2xl shadow-neumorph hover:shadow-neumorph-pressed transition-all duration-200"
                    >
                      {time}
                    </Button>
                  ))}
                </div>
                {formData.preferredTimes.length < 2 && formData.preferredTimes.length > 0 && (
                  <p className="text-sm text-warning mt-2">Please select at least 2 time slots for effective study sessions</p>
                )}
              </div>
            </div>

            <div className="flex gap-3">
              <Button onClick={prevStep} variant="outline" className="flex-1">
                Back
              </Button>
              <Button 
                onClick={nextStep} 
                disabled={formData.availabilityDays.length === 0 || formData.preferredTimes.length < 2}
                className="flex-1"
                variant="primary"
              >
                Continue
              </Button>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6 animate-slide-up">
            <div className="text-center">
              <Clock className="w-16 h-16 mx-auto mb-4 text-primary" />
              <h2 className="text-2xl font-bold mb-2">Study Duration</h2>
              <p className="text-muted-foreground">How long can you study per session?</p>
            </div>

            <div className="space-y-4">
              <div>
                <Label>Weekday Sessions (minutes)</Label>
                <Input
                  type="number"
                  min="45"
                  max="300"
                  value={formData.weekdayDuration}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    weekdayDuration: parseInt(e.target.value) || 45 
                  }))}
                />
                <p className="text-sm text-muted-foreground mt-1">Minimum 45 minutes recommended</p>
              </div>

              <div>
                <Label>Weekend Sessions (minutes)</Label>
                <Input
                  type="number"
                  min="60"
                  max="480"
                  value={formData.weekendDuration}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    weekendDuration: parseInt(e.target.value) || 180 
                  }))}
                />
                <p className="text-sm text-muted-foreground mt-1">2-3 hours recommended</p>
              </div>
            </div>

            <div className="flex gap-3">
              <Button onClick={prevStep} variant="outline" className="flex-1">
                Back
              </Button>
              <Button onClick={nextStep} className="flex-1" variant="primary">
                Generate Plan
              </Button>
            </div>
          </div>
        );

      case 4:
        const plan = calculateStudyPlan();
        return (
          <div className="space-y-6 animate-slide-up">
            <div className="text-center">
              <Users className="w-16 h-16 mx-auto mb-4 text-accent" />
              <h2 className="text-2xl font-bold mb-2">Your Study Plan</h2>
              <p className="text-muted-foreground">Here's your personalized 300-hour journey</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-primary">{plan.daysUntilExam}</div>
                  <div className="text-sm text-muted-foreground">Days Until Exam</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-accent">{plan.totalHours}</div>
                  <div className="text-sm text-muted-foreground">Total Study Hours</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-focus">{plan.hoursPerWeek}</div>
                  <div className="text-sm text-muted-foreground">Hours Per Week</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-warning">{Math.round((plan.totalHours / 300) * 100)}%</div>
                  <div className="text-sm text-muted-foreground">Target Coverage</div>
                </CardContent>
              </Card>
            </div>

            {plan.totalHours < 300 && (
              <div className="p-4 bg-warning/10 border border-warning/20 rounded-lg">
                <p className="text-sm text-warning font-medium">
                  ⚠️ Your current schedule covers {plan.totalHours} hours. Consider adding more study days or longer sessions to reach the 300-hour target.
                </p>
              </div>
            )}

            <div className="space-y-3">
              <Badge variant="outline" className="w-full justify-between p-3">
                <span>Weekday Sessions</span>
                <span className="font-bold">{formData.weekdayDuration} min × {formData.availabilityDays.filter(d => !['Saturday', 'Sunday'].includes(d)).length} days</span>
              </Badge>
              <Badge variant="outline" className="w-full justify-between p-3">
                <span>Weekend Sessions</span>
                <span className="font-bold">{Math.round(formData.weekendDuration / 60 * 10) / 10}h × {formData.availabilityDays.filter(d => ['Saturday', 'Sunday'].includes(d)).length} days</span>
              </Badge>
            </div>

            <div className="flex gap-3">
              <Button onClick={prevStep} variant="outline" className="flex-1">
                Adjust Plan
              </Button>
              <Button 
                onClick={() => onComplete(formData)} 
                className="flex-1"
                variant="success"
              >
                Start My Journey!
              </Button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-neumorph-float rounded-3xl border-0 bg-gradient-secondary">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Actuarial Edge
          </CardTitle>
          <div className="flex justify-center mt-4">
            {[1, 2, 3, 4].map(i => (
              <div 
                key={i} 
                className={`w-3 h-3 rounded-full mx-1 transition-all duration-300 ${
                  step >= i ? 'bg-primary animate-pulse-glow' : 'bg-muted'
                }`} 
              />
            ))}
          </div>
        </CardHeader>
        <CardContent className="p-6">
          {renderStep()}
        </CardContent>
      </Card>
    </div>
  );
};

export default OnboardingFlow;
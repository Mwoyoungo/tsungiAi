import React, { useState, useEffect } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { AppLayout } from "@/components/AppLayout";
import { SplashScreen } from "@/components/SplashScreen";
import Index from "./pages/Index";
import StudyBuddy from "./pages/StudyBuddy";
import AudioLearning from "./pages/AudioLearning";
import AcronymGenerator from "./pages/AcronymGenerator";
import AudioUpload from "./pages/AudioUpload";
import Practice from "./pages/Practice";
import TypingGame from "./pages/TypingGame";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import { ThemeDemo } from "@/components/ThemeDemo";

const queryClient = new QueryClient();

const App = () => {
  const [showSplash, setShowSplash] = useState(true);

  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="tsungi-ai-theme">
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            
            {showSplash ? (
              <SplashScreen onComplete={handleSplashComplete} />
            ) : (
              <BrowserRouter>
                <Routes>
                  {/* Public routes */}
                  <Route path="/auth" element={<Auth />} />
                  
                  {/* Protected routes */}
                  <Route path="/" element={
                    <ProtectedRoute>
                      <AppLayout>
                        <AudioLearning />
                      </AppLayout>
                    </ProtectedRoute>
                  } />
                  <Route path="/audio" element={
                    <ProtectedRoute>
                      <AppLayout>
                        <AudioLearning />
                      </AppLayout>
                    </ProtectedRoute>
                  } />
                  <Route path="/acronyms" element={
                    <ProtectedRoute>
                      <AppLayout>
                        <AcronymGenerator />
                      </AppLayout>
                    </ProtectedRoute>
                  } />
                  <Route path="/study-buddy" element={
                    <ProtectedRoute>
                      <AppLayout>
                        <StudyBuddy />
                      </AppLayout>
                    </ProtectedRoute>
                  } />
                  <Route path="/upload" element={
                    <ProtectedRoute>
                      <AppLayout>
                        <AudioUpload />
                      </AppLayout>
                    </ProtectedRoute>
                  } />
                  <Route path="/practice" element={
                    <ProtectedRoute>
                      <AppLayout>
                        <Practice />
                      </AppLayout>
                    </ProtectedRoute>
                  } />
                  <Route path="/typing-game" element={
                    <ProtectedRoute>
                      <AppLayout>
                        <TypingGame />
                      </AppLayout>
                    </ProtectedRoute>
                  } />
                  
                  {/* Catch-all route */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            )}
          </TooltipProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;

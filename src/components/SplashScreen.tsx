import React, { useEffect, useState } from 'react';

interface SplashScreenProps {
  onComplete: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    // Start animations after component mounts
    const timer1 = setTimeout(() => setShowContent(true), 100);
    
    // Complete splash screen after animations
    const timer2 = setTimeout(() => {
      onComplete();
    }, 3000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [onComplete]);

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ 
        background: 'linear-gradient(145deg, #16141a, #1a1823)',
        backgroundImage: `
          radial-gradient(circle at 20% 20%, rgba(59, 130, 246, 0.15) 0%, transparent 50%),
          radial-gradient(circle at 80% 80%, rgba(139, 92, 246, 0.15) 0%, transparent 50%)
        `
      }}
    >
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-blue-400 rounded-full opacity-20 animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      {/* Main content */}
      <div className="text-center space-y-8 z-10">
        {/* Logo container */}
        <div 
          className={`relative transition-all duration-1000 ease-out ${
            showContent ? 'scale-100 opacity-100 translate-y-0' : 'scale-50 opacity-0 translate-y-10'
          }`}
        >
          <div 
            className="w-32 h-32 mx-auto rounded-3xl flex items-center justify-center mb-6 relative"
            style={{
              background: 'linear-gradient(145deg, #141217, #18151b)',
              boxShadow: '20px 20px 40px #0e0c10, -20px -20px 40px #1e1c23'
            }}
          >
            {/* Inner glow effect */}
            <div 
              className="absolute inset-2 rounded-2xl"
              style={{
                background: 'linear-gradient(145deg, #2563eb, #1d4ed8)',
                boxShadow: 'inset 10px 10px 20px rgba(0,0,0,0.3), inset -10px -10px 20px rgba(255,255,255,0.1)'
              }}
            >
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-4xl font-bold text-white animate-pulse">
                  T
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* App name with typing animation */}
        <div 
          className={`transition-all duration-1000 delay-300 ease-out ${
            showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <h1 className="text-5xl font-bold text-white mb-4">
            <span className="inline-block animate-bounce" style={{ animationDelay: '0s' }}>T</span>
            <span className="inline-block animate-bounce" style={{ animationDelay: '0.1s' }}>s</span>
            <span className="inline-block animate-bounce" style={{ animationDelay: '0.2s' }}>u</span>
            <span className="inline-block animate-bounce" style={{ animationDelay: '0.3s' }}>n</span>
            <span className="inline-block animate-bounce" style={{ animationDelay: '0.4s' }}>g</span>
            <span className="inline-block animate-bounce" style={{ animationDelay: '0.5s' }}>i</span>
            <span className="inline-block animate-bounce" style={{ animationDelay: '0.6s' }}>'</span>
            <span className="inline-block animate-bounce" style={{ animationDelay: '0.7s' }}>s</span>
            <span className="inline-block animate-bounce text-blue-400" style={{ animationDelay: '0.8s' }}>&nbsp;</span>
            <span className="inline-block animate-bounce text-blue-400" style={{ animationDelay: '0.9s' }}>A</span>
            <span className="inline-block animate-bounce text-blue-400" style={{ animationDelay: '1.0s' }}>I</span>
          </h1>
          
          {/* Smiling emoji with rotation animation */}
          <div className="text-6xl animate-spin-slow mb-6">
            😊
          </div>
          
          <p className="text-xl text-gray-300 font-medium">
            Smart Learning Assistant
          </p>
        </div>

        {/* Loading indicator */}
        <div 
          className={`transition-all duration-1000 delay-500 ease-out ${
            showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <div className="flex justify-center space-x-2 mt-8">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="w-3 h-3 rounded-full bg-blue-400 animate-pulse"
                style={{
                  animationDelay: `${i * 0.2}s`,
                  animationDuration: '1s'
                }}
              />
            ))}
          </div>
          <p className="text-gray-400 text-sm mt-4 animate-pulse">
            Initializing AI Assistant...
          </p>
        </div>
      </div>

      {/* Ripple effect */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="w-96 h-96 border border-blue-400/20 rounded-full animate-ping" style={{ animationDuration: '3s' }}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 border border-purple-400/20 rounded-full animate-ping" style={{ animationDuration: '2s', animationDelay: '0.5s' }}></div>
        </div>
      </div>
    </div>
  );
};

// Add custom animation for slow spin
const style = document.createElement('style');
style.textContent = `
  @keyframes spin-slow {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
  
  .animate-spin-slow {
    animation: spin-slow 3s linear infinite;
  }
`;
document.head.appendChild(style);
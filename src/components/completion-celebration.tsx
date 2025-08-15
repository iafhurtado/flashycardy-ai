"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface CompletionCelebrationProps {
  isOpen: boolean;
  onClose: () => void;
  deckName: string;
}

const motivationalQuotes = [
  "🎉 Amazing work! You've mastered this deck completely!",
  "🌟 Outstanding! Your dedication to learning is inspiring!",
  "🚀 Fantastic! You've conquered every card in this deck!",
  "💪 Incredible! Your persistence has paid off beautifully!",
  "🎯 Perfect! You've achieved 100% mastery of this deck!",
  "🏆 Brilliant! You're a true learning champion!",
  "✨ Exceptional! Your commitment to knowledge is remarkable!",
  "🔥 Phenomenal! You've crushed this deck with style!",
  "💎 Outstanding! Your learning journey is truly impressive!",
  "⭐ Spectacular! You've reached the pinnacle of this deck!"
];

export function CompletionCelebration({ isOpen, onClose, deckName }: CompletionCelebrationProps) {
  const [quote, setQuote] = useState("");
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Select a random quote
      const randomQuote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];
      setQuote(randomQuote);
      setShowConfetti(true);
      
      // Hide confetti after animation
      const timer = setTimeout(() => setShowConfetti(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950 dark:to-blue-950 border-0">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            🎊 Congratulations! 🎊
          </DialogTitle>
        </DialogHeader>
        
        <div className="text-center space-y-6 py-4">
          {/* Confetti Animation */}
          {showConfetti && (
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              {[...Array(30)].map((_, i) => (
                <div
                  key={i}
                  className="absolute animate-confetti-fall"
                  style={{
                    left: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 2}s`,
                    animationDuration: `${2 + Math.random() * 2}s`,
                  }}
                >
                  <span className="text-xl">
                    {['🎉', '✨', '🌟', '💫', '🎊', '🎈', '🎯', '🏆', '💎', '⭐'][Math.floor(Math.random() * 10)]}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Success Icon */}
          <div className="relative">
            <div className="w-24 h-24 mx-auto bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center animate-celebration-pulse">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>

          {/* Message */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              You've completed "{deckName}"!
            </h3>
            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
              {quote}
            </p>
          </div>

          {/* Progress Circle */}
          <div className="relative w-32 h-32 mx-auto">
            <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 32 32">
              <circle
                cx="16"
                cy="16"
                r="14"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
                className="text-gray-200 dark:text-gray-700"
              />
              <circle
                cx="16"
                cy="16"
                r="14"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
                strokeDasharray="88"
                strokeDashoffset="0"
                className="text-green-500 animate-[dash_1s_ease-in-out]"
                style={{
                  strokeDasharray: "88",
                  strokeDashoffset: "0",
                }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl font-bold text-gray-900 dark:text-white">100%</span>
            </div>
          </div>

          {/* Action Button */}
          <Button 
            onClick={onClose}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Your Deck
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

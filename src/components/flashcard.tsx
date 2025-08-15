"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

interface FlashcardProps {
  front: string;
  back: string;
  onFlip?: () => void;
  className?: string;
  size?: "small" | "medium" | "large";
  isFlipped?: boolean;
  onFlipChange?: (flipped: boolean) => void;
}

export function Flashcard({ 
  front, 
  back, 
  onFlip, 
  className = "", 
  size = "medium",
  isFlipped: externalIsFlipped,
  onFlipChange
}: FlashcardProps) {
  const [internalIsFlipped, setInternalIsFlipped] = useState(false);
  
  // Use external state if provided, otherwise use internal state
  const isFlipped = externalIsFlipped !== undefined ? externalIsFlipped : internalIsFlipped;
  const setIsFlipped = onFlipChange || setInternalIsFlipped;

  const sizeClasses = {
    small: "w-64 h-40",
    medium: "w-80 h-52",
    large: "w-96 h-64"
  };

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
    onFlip?.();
  };

  const handleKeyPress = (e: KeyboardEvent) => {
    if (e.code === "Space") {
      e.preventDefault();
      handleFlip();
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, []);

  return (
    <div className={`relative ${sizeClasses[size]} ${className}`}>
      <div
        className={`relative w-full h-full cursor-pointer transition-transform duration-700 transform-style-preserve-3d ${
          isFlipped ? "rotate-y-180" : ""
        }`}
        onClick={handleFlip}
      >
        {/* Front of card */}
        <div className="absolute inset-0 w-full h-full backface-hidden">
          <div className="w-full h-full bg-gradient-to-br from-white via-gray-50 to-gray-100 dark:from-gray-800 dark:via-gray-700 dark:to-gray-600 rounded-xl shadow-lg border border-gray-200 dark:border-gray-600 p-6 flex items-center justify-center text-center relative overflow-hidden">
            {/* Glossy overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent rounded-xl pointer-events-none" />
            
            {/* Content */}
            <div className="relative z-10">
              <p className="text-lg font-medium text-gray-900 dark:text-white leading-relaxed">
                {front}
              </p>
            </div>
            
            {/* Flip indicator */}
            <div className="absolute bottom-4 right-4 text-xs text-gray-500 dark:text-gray-400">
              Click to flip
            </div>
          </div>
        </div>

        {/* Back of card */}
        <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180">
          <div className="w-full h-full bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 dark:from-blue-900 dark:via-blue-800 dark:to-blue-700 rounded-xl shadow-lg border border-blue-200 dark:border-blue-600 p-6 flex items-center justify-center text-center relative overflow-hidden">
            {/* Glossy overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 via-transparent to-transparent rounded-xl pointer-events-none" />
            
            {/* Content */}
            <div className="relative z-10">
              <p className="text-lg font-medium text-blue-900 dark:text-blue-100 leading-relaxed">
                {back}
              </p>
            </div>
            
            {/* Flip indicator */}
            <div className="absolute bottom-4 right-4 text-xs text-blue-600 dark:text-blue-400">
              Click to flip back
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

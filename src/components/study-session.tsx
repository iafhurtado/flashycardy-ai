"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Flashcard } from "./flashcard";
import { CompletionCelebration } from "./completion-celebration";
import { updateCardProgress } from "@/app/actions/card";

interface Card {
  id: number;
  front: string;
  back: string;
}

interface StudySessionProps {
  cards: Card[];
  deckId: number;
  deckName: string;
  onClose: () => void;
  onProgressUpdate: () => void;
}

export function StudySession({ 
  cards, 
  deckId, 
  deckName,
  onClose, 
  onProgressUpdate 
}: StudySessionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [studiedCards, setStudiedCards] = useState<Set<number>>(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const [showCompletion, setShowCompletion] = useState(false);
  const [cardFlipStates, setCardFlipStates] = useState<Map<number, boolean>>(new Map());

  const currentCard = cards[currentIndex];
  const progress = (studiedCards.size / cards.length) * 100;

  const handleCardFlip = async (cardId: number) => {
    if (!studiedCards.has(cardId)) {
      setStudiedCards(prev => new Set([...prev, cardId]));
      
      // Update progress in database (silently, without refreshing the page)
      try {
        setIsLoading(true);
        await updateCardProgress(cardId);
        
        // Check if all cards have been studied
        const newStudiedCards = new Set([...studiedCards, cardId]);
        if (newStudiedCards.size === cards.length) {
          setShowCompletion(true);
        }
      } catch (error) {
        console.error("Failed to update card progress:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const goToPrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const goToNext = () => {
    if (currentIndex < cards.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleCardFlipChange = (cardId: number, isFlipped: boolean) => {
    setCardFlipStates(prev => new Map(prev).set(cardId, isFlipped));
  };

  const getCurrentCardFlipState = () => {
    return cardFlipStates.get(currentCard.id) || false;
  };

  const handleKeyPress = (e: KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      goToPrevious();
    } else if (e.key === "ArrowRight") {
      goToNext();
    } else if (e.key === "Escape") {
      handleExitStudy();
    } else if (e.code === "Space") {
      e.preventDefault();
      // Space key is handled by the Flashcard component
    }
  };

  const handleExitStudy = () => {
    // Only refresh progress when exiting study mode
    onProgressUpdate();
    onClose();
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [currentIndex]);

  if (!currentCard) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-6 text-white">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleExitStudy}
            className="text-white hover:bg-white/10"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            Exit Study
          </Button>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="text-sm">
            Card {currentIndex + 1} of {cards.length}
          </div>
          <div className="text-sm">
            {Math.round(progress)}% Complete
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="px-6 pb-4">
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="relative">
          {/* Navigation Arrows */}
          {currentIndex > 0 && (
            <Button
              variant="ghost"
              size="lg"
              onClick={goToPrevious}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-16 text-white hover:bg-white/10 z-10"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Button>
          )}
          
          {currentIndex < cards.length - 1 && (
            <Button
              variant="ghost"
              size="lg"
              onClick={goToNext}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-16 text-white hover:bg-white/10 z-10"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Button>
          )}

          {/* Flashcard */}
          <Flashcard
            front={currentCard.front}
            back={currentCard.back}
            onFlip={() => handleCardFlip(currentCard.id)}
            size="large"
            className="mx-auto"
            isFlipped={getCurrentCardFlipState()}
            onFlipChange={(isFlipped) => handleCardFlipChange(currentCard.id, isFlipped)}
          />
        </div>
      </div>

      {/* Footer Navigation */}
      <div className="flex items-center justify-center space-x-4 p-6">
        <Button
          variant="outline"
          onClick={goToPrevious}
          disabled={currentIndex === 0}
          className="text-white border-white/20 hover:bg-white/10 disabled:opacity-50"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Previous
        </Button>
        
        <div className="text-white text-sm">
          {currentIndex + 1} / {cards.length}
        </div>
        
        <Button
          variant="outline"
          onClick={goToNext}
          disabled={currentIndex === cards.length - 1}
          className="text-white border-white/20 hover:bg-white/10 disabled:opacity-50"
        >
          Next
          <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Button>
      </div>

      {/* Keyboard Shortcuts Help */}
      <div className="absolute bottom-4 left-4 text-white/60 text-xs">
        <div>← → Navigate • Space Flip • Esc Exit</div>
      </div>

      {/* Completion Celebration Dialog */}
      <CompletionCelebration
        isOpen={showCompletion}
        onClose={handleExitStudy}
        deckName={deckName}
      />
    </div>
  );
}

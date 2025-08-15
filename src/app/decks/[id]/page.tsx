"use client";

import { SignedIn, SignedOut } from "@clerk/nextjs";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EditDeckDialog } from "@/components/edit-deck-dialog";
import { Flashcard } from "@/components/flashcard";
import { StudySession } from "@/components/study-session";
import { useState, useEffect } from "react";
import { use } from "react";

interface DeckPageProps {
  params: Promise<{
    id: string;
  }>;
}

interface DeckData {
  id: number;
  name: string;
  description?: string;
  isPublic: boolean;
  cardCount: number;
  studiedCards: number;
  createdAt: string;
}

interface CardData {
  id: number;
  front: string;
  back: string;
  createdAt: string;
  isStudied: boolean;
}

export default function DeckPage({ params }: DeckPageProps) {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [deckData, setDeckData] = useState<DeckData | null>(null);
  const [cards, setCards] = useState<CardData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showStudySession, setShowStudySession] = useState(false);
  const [startCardIndex, setStartCardIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const resolvedParams = use(params);
  const deckId = parseInt(resolvedParams.id);

  useEffect(() => {
    if (!isLoaded) return;
    
    if (!user) {
      router.push("/");
      return;
    }

    if (isNaN(deckId)) {
      setError("Invalid deck ID");
      setIsLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const [deckResponse, cardsResponse] = await Promise.all([
          fetch(`/api/decks/${deckId}`),
          fetch(`/api/decks/${deckId}/cards`)
        ]);

        if (!deckResponse.ok || !cardsResponse.ok) {
          throw new Error("Failed to fetch deck data");
        }

        const [deck, cardsData] = await Promise.all([
          deckResponse.json(),
          cardsResponse.json()
        ]);

        setDeckData(deck);
        setCards(cardsData);
      } catch (err) {
        setError("Failed to load deck");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user, isLoaded, deckId, router]);

  const handleProgressUpdate = () => {
    // Refresh the page to update stats
    window.location.reload();
  };

  const handleStartStudyFromCard = (cardIndex: number) => {
    setStartCardIndex(cardIndex);
    setShowStudySession(true);
  };

  if (!isLoaded || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading deck...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-gray-600 dark:text-gray-400">{error}</p>
          <Button asChild className="mt-4">
            <Link href="/decks">Back to Decks</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (!deckData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Deck Not Found</h1>
          <Button asChild>
            <Link href="/decks">Back to Decks</Link>
          </Button>
        </div>
      </div>
    );
  }

  // Calculate study progress
  const progressPercentage = deckData.cardCount > 0 
    ? Math.round((deckData.studiedCards / deckData.cardCount) * 100)
    : 0;

  return (
    <div className="min-h-screen">
      <SignedOut>
        <div className="text-center space-y-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            Access Denied
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Please sign in to access this deck.
          </p>
        </div>
      </SignedOut>
      
      <SignedIn>
        <div className="space-y-8">
          {/* Header Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <Button variant="outline" asChild>
                <Link href="/decks">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Back to Decks
                </Link>
              </Button>
              <Badge variant={deckData.isPublic ? "default" : "secondary"}>
                {deckData.isPublic ? "Public" : "Private"}
              </Badge>
            </div>
            
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {deckData.name}
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-400 mt-2">
                  {deckData.description || 'No description provided'}
                </p>
              </div>
              <EditDeckDialog
                deckId={deckId}
                currentName={deckData.name}
                currentDescription={deckData.description || undefined}
                trigger={
                  <Button variant="outline" size="sm" className="ml-4">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Edit
                  </Button>
                }
              />
            </div>
          </div>

          {/* Deck Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Total Cards
                  </p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">
                    {deckData.cardCount}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Studied Cards
                  </p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">
                    {deckData.studiedCards}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Progress
                  </p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">
                    {progressPercentage}%
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Created
                  </p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {new Date(deckData.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Action Buttons */}
          <Card>
            <CardHeader>
              <CardTitle>Study Options</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button 
                  onClick={() => setShowStudySession(true)}
                  className="flex items-center justify-center p-4"
                  disabled={cards.length === 0}
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Start Studying
                </Button>
                
                <EditDeckDialog
                  deckId={deckId}
                  currentName={deckData.name}
                  currentDescription={deckData.description || undefined}
                  trigger={
                    <Button variant="secondary" className="flex items-center justify-center p-4">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Edit Deck
                    </Button>
                  }
                />
              </div>
            </CardContent>
          </Card>

          {/* Cards Preview */}
          <Card>
            <CardHeader>
              <CardTitle>Cards Preview</CardTitle>
              <CardDescription>
                {(() => {
                  const unstudiedCards = cards.filter(card => !card.isStudied);
                  const studiedCards = cards.filter(card => card.isStudied);
                  
                  if (unstudiedCards.length === 0) {
                    return `All ${cards.length} cards have been studied!`;
                  } else if (studiedCards.length === 0) {
                    return `Showing ${Math.min(cards.length, 6)} of ${cards.length} cards to study`;
                  } else {
                    return `Showing ${Math.min(unstudiedCards.length, 6)} unstudied cards (${studiedCards.length} already studied)`;
                  }
                })()}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {cards.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {(() => {
                    const unstudiedCards = cards.filter(card => !card.isStudied);
                    const studiedCards = cards.filter(card => card.isStudied);
                    
                    // Show unstudied cards first, then fill with studied cards if needed
                    const cardsToShow = [...unstudiedCards, ...studiedCards].slice(0, 6);
                    
                    return cardsToShow.map((card, index) => {
                      const originalIndex = cards.findIndex(c => c.id === card.id);
                      return (
                        <div 
                          key={card.id} 
                          className="flex justify-center cursor-pointer transform transition-transform hover:scale-105"
                          onClick={() => handleStartStudyFromCard(originalIndex)}
                        >
                          <div className={`relative ${!card.isStudied ? 'ring-2 ring-blue-500 ring-opacity-50' : ''}`}>
                            <div className={!card.isStudied ? 'opacity-100' : 'opacity-60'}>
                              <Flashcard
                                front={card.front}
                                back={card.back}
                                size="small"
                              />
                            </div>
                            {!card.isStudied && (
                              <div className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                                Study
                              </div>
                            )}
                            {card.isStudied && (
                              <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                                ✓
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    });
                  })()}
                </div>
              ) : (
                <div className="text-center py-8">
                  <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className="text-gray-500 dark:text-gray-400">
                    No cards in this deck yet. Add some cards to start studying!
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Study Session Modal */}
        {showStudySession && (
          <StudySession
            cards={cards}
            deckId={deckId}
            deckName={deckData.name}
            onClose={() => setShowStudySession(false)}
            onProgressUpdate={handleProgressUpdate}
            startCardIndex={startCardIndex}
          />
        )}
      </SignedIn>
    </div>
  );
}

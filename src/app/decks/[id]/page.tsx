import { SignedIn, SignedOut } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { getDeckById, getCardsByDeckId } from "@/db/queries";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface DeckPageProps {
  params: {
    id: string;
  };
}

export default async function DeckPage({ params }: DeckPageProps) {
  const user = await currentUser();
  
  if (!user) {
    redirect("/");
  }

  const deckId = parseInt(params.id);
  if (isNaN(deckId)) {
    notFound();
  }

  // Fetch deck with card count and user progress using helper function
  const deckWithStats = await getDeckById(deckId, user.id);

  if (!deckWithStats) {
    notFound();
  }

  // Fetch cards in this deck using helper function
  const cards = await getCardsByDeckId(deckId);

  // Calculate study progress
  const progressPercentage = deckWithStats.cardCount > 0 
    ? Math.round((deckWithStats.studiedCards / deckWithStats.cardCount) * 100)
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
              <Badge variant={deckWithStats.isPublic ? "default" : "secondary"}>
                {deckWithStats.isPublic ? "Public" : "Private"}
              </Badge>
            </div>
            
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {deckWithStats.name}
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400 mt-2">
                {deckWithStats.description || 'No description provided'}
              </p>
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
                    {deckWithStats.cardCount}
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
                    {deckWithStats.studiedCards}
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
                    {new Date(deckWithStats.createdAt).toLocaleDateString()}
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button asChild className="flex items-center justify-center p-4">
                  <Link href={`/decks/${deckId}/study`}>
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Start Studying
                  </Link>
                </Button>
                
                <Button variant="secondary" asChild className="flex items-center justify-center p-4">
                  <Link href={`/decks/${deckId}/edit`}>
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Edit Deck
                  </Link>
                </Button>
                
                <Button variant="outline" asChild className="flex items-center justify-center p-4">
                  <Link href={`/decks/${deckId}/cards`}>
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    View Cards
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Cards Preview */}
          <Card>
            <CardHeader>
              <CardTitle>Cards Preview</CardTitle>
              <CardDescription>
                Showing {Math.min(cards.length, 5)} of {cards.length} cards
              </CardDescription>
            </CardHeader>
            <CardContent>
              {cards.length > 0 ? (
                <div className="space-y-4">
                  {cards.slice(0, 5).map((card) => (
                    <div key={card.id} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white mb-2">Front:</h4>
                          <p className="text-gray-600 dark:text-gray-400">{card.front}</p>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white mb-2">Back:</h4>
                          <p className="text-gray-600 dark:text-gray-400">{card.back}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                  {cards.length > 5 && (
                    <div className="text-center pt-4">
                      <Button variant="outline" asChild>
                        <Link href={`/decks/${deckId}/cards`}>
                          View All {cards.length} Cards
                        </Link>
                      </Button>
                    </div>
                  )}
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
      </SignedIn>
    </div>
  );
}

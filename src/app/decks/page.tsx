import { SignedIn, SignedOut } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getAllDecksWithCardCounts } from "@/db/queries";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default async function DecksPage() {
  const user = await currentUser();
  
  if (!user) {
    redirect("/");
  }

  // Fetch all decks with card counts using helper function
  const decksWithCardCounts = await getAllDecksWithCardCounts(user.id);

  return (
    <div className="min-h-screen">
      <SignedOut>
        <div className="text-center space-y-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            Access Denied
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Please sign in to access your decks.
          </p>
        </div>
      </SignedOut>
      
      <SignedIn>
        <div className="space-y-8">
          {/* Header Section */}
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                My Decks
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                Manage and study your flashcard decks
              </p>
            </div>
            <Button asChild>
              <Link href="/decks/new">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Create New Deck
              </Link>
            </Button>
          </div>

          {/* Decks Grid */}
          {decksWithCardCounts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {decksWithCardCounts.map((deck) => (
                <Link key={deck.id} href={`/decks/${deck.id}`}>
                  <Card className="h-full hover:shadow-lg transition-shadow duration-200 cursor-pointer">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                            {deck.name}
                          </CardTitle>
                          <CardDescription className="text-gray-600 dark:text-gray-400 line-clamp-2">
                            {deck.description || 'No description provided'}
                          </CardDescription>
                        </div>
                        <Badge variant={deck.isPublic ? "default" : "secondary"}>
                          {deck.isPublic ? "Public" : "Private"}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                          <span>Cards:</span>
                          <span className="font-medium">{deck.cardCount}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                          <span>Created:</span>
                          <span className="font-medium">
                            {new Date(deck.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                          <span>Last Updated:</span>
                          <span className="font-medium">
                            {new Date(deck.updatedAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No decks yet
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Create your first deck to start learning with flashcards!
                </p>
                <Button asChild>
                  <Link href="/decks/new">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Create Your First Deck
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </SignedIn>
    </div>
  );
}

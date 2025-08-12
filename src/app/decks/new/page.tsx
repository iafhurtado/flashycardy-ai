import { SignedIn, SignedOut } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default async function CreateDeckPage() {
  const user = await currentUser();
  
  if (!user) {
    redirect("/");
  }

  return (
    <div className="min-h-screen">
      <SignedOut>
        <div className="text-center space-y-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            Access Denied
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Please sign in to create a deck.
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
            </div>
            
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Create New Deck
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400 mt-2">
                Start building your flashcard collection
              </p>
            </div>
          </div>

          {/* Create Deck Form */}
          <Card>
            <CardHeader>
              <CardTitle>Deck Information</CardTitle>
              <CardDescription>
                Fill in the details for your new flashcard deck
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Coming Soon!
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  The deck creation form will be implemented soon. For now, you can view your existing decks.
                </p>
                <Button asChild>
                  <Link href="/decks">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    View My Decks
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </SignedIn>
    </div>
  );
}

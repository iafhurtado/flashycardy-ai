import { SignedIn, SignedOut } from "@clerk/nextjs";

export default function Home() {
  return (
    <div className="min-h-screen">
      <SignedOut>
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
          <h1 className="text-4xl font-bold mb-4">Welcome to FlashyCardy</h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl">
            Create, study, and master flashcards with our intuitive platform. 
            Sign in to start building your knowledge base.
          </p>
          <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg border border-blue-200 dark:border-blue-800">
            <h2 className="text-lg font-semibold mb-2">Getting Started</h2>
            <ul className="text-left space-y-2 text-gray-700 dark:text-gray-300">
              <li>• Sign up for a free account</li>
              <li>• Create your first flashcard deck</li>
              <li>• Study with spaced repetition</li>
              <li>• Track your progress</li>
            </ul>
          </div>
        </div>
      </SignedOut>
      
      <SignedIn>
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h1 className="text-2xl font-bold mb-4">Your Dashboard</h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Welcome back! Here's what you can do:
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Create Deck</h3>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  Start a new flashcard deck for any subject
                </p>
              </div>
              
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
                <h3 className="font-semibold text-green-900 dark:text-green-100 mb-2">Study Now</h3>
                <p className="text-sm text-green-700 dark:text-green-300">
                  Continue studying your existing decks
                </p>
              </div>
              
              <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
                <h3 className="font-semibold text-purple-900 dark:text-purple-100 mb-2">Progress</h3>
                <p className="text-sm text-purple-700 dark:text-purple-300">
                  View your learning statistics
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
            <div className="text-gray-600 dark:text-gray-400">
              <p>No recent activity. Start by creating your first flashcard deck!</p>
            </div>
          </div>
        </div>
      </SignedIn>
    </div>
  );
}

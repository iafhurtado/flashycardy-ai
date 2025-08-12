import { SignedIn, SignedOut, SignInButton, SignUpButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <SignedOut>
        <div className="text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              FlashyCardy
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-md">
              Your personal flashcard platform
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <SignInButton mode="modal">
              <Button size="lg" className="px-8">
                Sign In
              </Button>
            </SignInButton>
            
            <SignUpButton mode="modal">
              <Button variant="outline" size="lg" className="px-8">
                Sign Up
              </Button>
            </SignUpButton>
          </div>
        </div>
      </SignedOut>
      
      <SignedIn>
        <div className="text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              FlashyCardy
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Welcome back! Ready to continue learning?
            </p>
          </div>
        </div>
      </SignedIn>
    </div>
  );
}

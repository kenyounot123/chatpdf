'use client'
import {
  SignedOut,
  SignInButton,
  SignedIn,
  UserButton,
  useAuth,
} from "@clerk/nextjs";
import { useEffect, useState } from "react";
import Link from "next/link";
import { FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
export default function Navbar() {
  const { isSignedIn, isLoaded } = useAuth(); // Check if Clerk is loaded (user auth state)
  const [showSkeleton, setShowSkeleton] = useState(true);

  useEffect(() => {
    if (isLoaded) {
      setShowSkeleton(false); // Hide skeleton once Clerk is loaded
    }
  }, [isLoaded]);

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <FileText className="h-8 w-8 text-primary" />
              <span className="ml-2 text-xl font-semibold text-gray-900">
                ChatPDF
              </span>
            </Link>
          </div>
          <div className="flex items-center">
            <>
              {showSkeleton ? (
                <div className="h-10 w-10 rounded-full bg-gray-200 animate-pulse"></div>
              ) : (
                <>
                  <SignedIn>
                    <UserButton
                      appearance={{
                        elements: {
                          avatarBox: 'h-10 w-10',
                        },
                      }}
                    />
                  </SignedIn>
                  <SignedOut>
                    <SignInButton
                      fallbackRedirectUrl="/"
                      signUpFallbackRedirectUrl="/"
                      mode="modal"
                    >
                      <Button>Sign In</Button>
                    </SignInButton>
                  </SignedOut>
                </>
              )}
            </>
          </div>
        </div>
      </div>
    </nav>
  );
}

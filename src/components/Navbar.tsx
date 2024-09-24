"use client";
import { useState, useEffect } from "react";
import {
  useAuth,
  SignedOut,
  SignInButton,
  SignedIn,
  UserButton,
} from "@clerk/nextjs";
import Link from "next/link";
import { FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
export default function Navbar() {
  const { isLoaded } = useAuth(); // Check if Clerk is loaded (user auth state)
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
            {showSkeleton ? (
              <div className="h-10 w-10 rounded-full bg-gray-200 animate-pulse"></div>
            ) : (
              <>
                <SignedOut>
                  <SignInButton
                    fallbackRedirectUrl="/"
                    signUpFallbackRedirectUrl="/"
                    mode="modal"
                  >
                    <Button>Sign In</Button>
                  </SignInButton>
                </SignedOut>
                <SignedIn>
                  <UserButton
                    appearance={{
                      elements: {
                        avatarBox: "h-10 w-10",
                      },
                    }}
                  />
                </SignedIn>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

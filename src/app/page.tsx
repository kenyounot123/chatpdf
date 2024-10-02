'use client'
import FileUploader from '@/components/FileUploader';
import Navbar from "@/components/Navbar";
import { Authenticated } from "convex/react"
import ChatHistory from '@/components/ChatHistory';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@clerk/nextjs';
import { useEffect, useState } from 'react';

export default function Homepage() {
  const { isLoaded } = useAuth(); // Check if Clerk is loaded (user auth state)
  const [showSkeleton, setShowSkeleton] = useState(true);

  useEffect(() => {
    if (isLoaded) {
      setShowSkeleton(false); // Hide skeleton once Clerk is loaded
    }
  }, [isLoaded]);
  return (
    <>
      <Navbar />
      <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4 text-center text-primary">
          Upload PDF
        </h1>
        <FileUploader />
      </div>
      {showSkeleton ? (
        <Skeleton className="flex flex-col space-y-3 max-w-md mx-auto mt-10 p-6 ">
          <Skeleton className="h-[50px] w-full rounded-sm" />
          <Skeleton className="mx-auto h-[50px] w-[350px] rounded-sm" />
          <Skeleton className="mx-auto h-[50px] w-[350px] rounded-sm" />
        </Skeleton>
      ):(
        <Authenticated>
          <ChatHistory/>
        </Authenticated>
      )}
    </>
  );
}
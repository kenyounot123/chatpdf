import FileUploader from '@/components/FileUploader';
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation';
import Navbar from "@/components/Navbar";
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';

export default function Homepage() {
  const currentUser = useQuery(api.users.current)
  if (currentUser?._id) {
    const getLatestChat = useQuery(api.chats.latestChat, { userId: currentUser?._id }) 
    redirect(`/chat?id=${getLatestChat}`)
  }

  return (
    <>
      <Navbar />
      <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4 text-center text-primary">
          Upload PDF
        </h1>
        {/* Render the client-side file uploader */}
        <FileUploader />
      </div>
    </>
  );
}

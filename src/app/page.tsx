'use client'
import FileUploader from '@/components/FileUploader';
import Navbar from "@/components/Navbar";
import {Authenticated} from "convex/react"
import ChatHistory from '@/components/ChatHistory';

export default function Homepage() {
  return (
    <>
      <Navbar />
      <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4 text-center text-primary">
          Upload PDF
        </h1>
        <FileUploader />
      </div>
      <Authenticated>
        <ChatHistory/>
      </Authenticated>
    </>
  );
}
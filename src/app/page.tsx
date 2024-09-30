'use client'
import FileUploader from '@/components/FileUploader';
import Navbar from "@/components/Navbar";
import { useRouter } from 'next/navigation';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChevronRight, MessageCircle } from 'lucide-react';
import { Id } from '../../convex/_generated/dataModel';
import {Authenticated} from "convex/react"

export default function Homepage() {
  const latestChats = useQuery(api.chats.getLatestChats)
  const router = useRouter()

  const handleChatClick = (chatId: Id<'chats'> | undefined) => {
    if (chatId) {
      console.log(`Redirecting to chat: ${chatId}`)
      router.push(`/chat?id=${chatId}`)
    } else {
      console.log('No chat ID is defined')
    }
    return
  }
  const formatDate = (timestamp:number | undefined) => {
    if (timestamp) {
      const date = new Date(timestamp);
      return date.toLocaleString(); 
    }
  };
  return (
    <>
      <Authenticated>
        <Navbar />
        <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
          <h1 className="text-2xl font-bold mb-4 text-center text-primary">
            Upload PDF
          </h1>
          <FileUploader />
        </div>
        <Card className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
          <CardHeader>
            <CardTitle className="text-2xl font-bold flex items-center gap-2">
              <MessageCircle className="w-6 h-6" />
              Chat History
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[200px] pr-4">
              {latestChats === undefined && ( // Handle loading state
                <p className="text-center text-gray-500">Loading chat history...</p>
              )} 
              {latestChats && latestChats?.length > 0 ? (
                <ul className="space-y-4">
                  {latestChats.map((chat) => (
                    <li 
                      key={chat?._id} 
                      className='border-b border-gray-200 pb-2 cursor-pointer transition-colors duration-200 hover:bg-gray-50 rounded-lg p-3 hover:bg-gray-100'
                      onClick={() => handleChatClick(chat?._id)}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-semibold text-lg text-primary">Title</h3>
                          <p className="text-sm text-gray-600 truncate">Latest Message</p>
                          <p className="text-xs text-gray-400 mt-1">{formatDate(chat?._creationTime)}</p>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-center text-gray-500">No chat history available</p>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </Authenticated>
    </>
  );
}

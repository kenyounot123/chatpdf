'use client'
import { ChevronRight, MessageCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { ScrollArea } from "./ui/scroll-area";
import { formatDate } from "@/lib/dateFormatter";
import { useQuery } from "convex/react";
import { useRouter } from "next/navigation";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";

export default function ChatHistory() {
  const latestChats = useQuery(api.chats.getAllChatsForUser)
  const router = useRouter()

  const handleChatClick = (chatId: Id<'chats'> | undefined) => {
    if (chatId) {
      router.push(`/chat?id=${chatId}`)
    } else {
      console.log('No chat ID is defined')
    }
    return
  }
  return (
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
  )
}
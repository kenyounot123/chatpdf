"use client";
import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Send, Menu, Plus, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageLoadingSpinner } from "@/components/message-loading-spinner";
import Markdown from "react-markdown";
import { Textarea } from "@/components/ui/textarea";
import { Suspense } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import ChatSidebar from "@/components/ChatSideBar";
import { UserButton } from "@clerk/nextjs";

function ChatComponent() {
  const [inputMessage, setInputMessage] = useState<string>("");
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [tabToggle, setTabToggle] = useState<"doc" | "chat">("chat");
  const messagesEndRef = useRef(null);
  const searchParams = useSearchParams();

  const chatId = searchParams.get("id") as Id<"chats">;
  const file = useQuery(api.files.serveFile, { chatId })

  // chat id is retrieved from search params
  const messages = useQuery(
    api.messages.list,
    chatId ? { chatId: chatId } : "skip"
  );
  const sendMessage = useMutation(api.messages.send);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    setTimeout(() => {
      (messagesEndRef.current as HTMLElement | null)?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }, 100);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (inputMessage.trim() === "") return;
    setInputMessage("");
    try {
      await sendMessage({
        chatId: chatId,
        content: inputMessage,
        sender: "user",
      });
    } catch (error) {
      console.log("Failed to send message: ", error);
    }
  };

  const handleEnterClick = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <ChatSidebar chatId={chatId} />
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-white">
        {/* Header */}
        <header className="bg-background border-b border-border p-5">
          <div className="flex items-center lg:max-w-[80%]">
            <h1 className="grow text-xl font-bold text-primary">
              Ask Me Anything
            </h1>
            <UserButton />
          </div>
        </header>
        {/* Switch tabs */}
        <div className="bg-gray-300 my-2 ml-2 flex p-2 w-min rounded rounded-md">
          <Button
            onClick={() => setTabToggle("doc")}
            className={`${tabToggle === "doc" ? "bg-[#D7907B] text-white hover:bg-[#D7907B]/80" : "bg-secondary text-black hover:bg-secondary/80"} rounded-r-none`}
          >
            Document
          </Button>
          <Button
            onClick={() => setTabToggle("chat")}
            className={`${tabToggle === "chat" ? "bg-[#D7907B] hover:bg-[#D7907B]/80 text-white" : "bg-secondary text-black hover:bg-secondary/80"} rounded-l-none hover:bg-[#D7907B]/80`}
          >
            Chat
          </Button>
        </div>
        {/* Document */}
        {tabToggle === "doc" && file && (
          <div className="flex-grow">
            <iframe className="w-full h-full" src={file.url}/>
          </div>
        )}
        {/* Messages */}
        {tabToggle === "chat" && (
          <>
            <ScrollArea className="flex-grow px-4 space-y-4 lg:w-[60%] lg:mx-auto">
              {/* {isLoading && <MessageLoadingSpinner />} */}
              {messages &&
                messages.map((message, idx) => (
                  <div
                    key={idx}
                    className={`flex ${
                      message.sender === "user" ? "justify-end" : "justify-start"
                    } mb-5`}
                  >
                    <div
                      className={`max-w-[80%] p-3 rounded-lg ${
                        message.sender === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary text-secondary-foreground"
                      }`}
                    >
                      <Markdown>{message.content}</Markdown>
                    </div>
                  </div>
                ))}
              <div ref={messagesEndRef} />
            </ScrollArea>

            {/* Input Area */}
            <div className="border-t border-border bg-background p-4">
              <form onSubmit={handleSendMessage} className="max-w-4xl mx-auto">
                <div className="flex space-x-2 items-center">
                  <Textarea
                    placeholder="Type your message..."
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyDown={(e) => handleEnterClick(e)}
                    className="flex-grow bg-background text-primary placeholder-muted-foreground resize-none"
                  />
                  <Button
                    type="submit"
                    size="icon"
                    className="bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    <Send className="h-4 w-4" />
                    <span className="sr-only">Send</span>
                  </Button>
                </div>
              </form>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
export default function Chat() {
  return (
    <Suspense fallback={<MessageLoadingSpinner />}>
      <ChatComponent />
    </Suspense>
  );
}

"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Send, Menu, Plus, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageLoadingSpinner } from "@/components/message-loading-spinner";
interface Message {
  id: number;
  text: string;
  sender: "user" | "bot";
}

export default function Chat() {
  const [content, setContent] = useState("");
  const [metadata, setMetadata] = useState({});
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: "Hello! How can I help you today?", sender: "bot" },
  ]);
  const [inputMessage, setInputMessage] = useState<string>("");
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const searchParams = useSearchParams();

  useEffect(() => {
    const getPdfResults = async () => {
      
      const file = searchParams.get("file"); // Get 'file' from query params
      
      if (file) {
        try {
          const response = await fetch(`/api/parse?file=${file}`);
          if (!response.ok) throw new Error("Failed to fetch PDF results");
          
          const data = await response.json();
          setContent(data.content);
          setMetadata(data.metadata);
        } catch (error) {
          console.error("Error fetching PDF results:", error);
        } finally {
          setIsLoading(false)
        }
      } else {
        console.error("No file parameter found in the URL");
      }
    };
    
    getPdfResults();
  }, []);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputMessage.trim() !== "") {
      const newMessage: Message = {
        id: messages.length + 1,
        text: inputMessage,
        sender: "user",
      };
      setMessages([...messages, newMessage]);
      setInputMessage("");

      // Simulate bot response
      setTimeout(() => {
        const botResponse: Message = {
          id: messages.length + 2,
          text: "Thanks for your message. I'm a demo AI assistant.",
          sender: "bot",
        };
        setMessages((prevMessages) => [...prevMessages, botResponse]);
      }, 1000);
    }
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div
        className={`bg-secondary text-secondary-foreground w-64 flex flex-col ${
          isSidebarOpen ? "" : "hidden"
        } md:flex`}
      >
        <div className="p-4 border-b border-secondary-foreground/10">
          <Button
            variant="outline"
            className="w-full justify-start text-secondary-foreground hover:bg-secondary-foreground/10 hover:text-secondary-foreground"
            onClick={() => setMessages([])}
          >
            <Plus className="mr-2 h-4 w-4" /> New Chat
          </Button>
        </div>
        <ScrollArea className="flex-grow">
          <div className="p-4 space-y-2">
            {/* You can add previous chat sessions here */}
            <Button
              variant="ghost"
              className="w-full justify-start text-secondary-foreground hover:bg-secondary-foreground/10 hover:text-secondary-foreground"
            >
              <MessageSquare className="mr-2 h-4 w-4" /> Previous Chat 1
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start text-secondary-foreground hover:bg-secondary-foreground/10 hover:text-secondary-foreground"
            >
              <MessageSquare className="mr-2 h-4 w-4" /> Previous Chat 2
            </Button>
          </div>
        </ScrollArea>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-white">
        {/* Header */}
        <header className="bg-background border-b border-border p-4 flex items-center">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden mr-2 text-foreground hover:bg-secondary hover:text-secondary-foreground"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            <Menu className="h-6 w-6" />
          </Button>
          <h1 className="text-xl font-bold text-primary">Ask Me Anything</h1>
        </header>

        {/* Messages */}
        <ScrollArea className="flex-grow p-4 space-y-4 lg:w-[60%] lg:mx-auto">
          {isLoading && (
            <MessageLoadingSpinner />
          )}
          {!isLoading && messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-lg ${
                  message.sender === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground"
                }`}
              >
                {message.text}
              </div>
            </div>
          ))}
        </ScrollArea>

        {/* Input Area */}
        <div className="border-t border-border bg-background p-4">
          <form onSubmit={handleSendMessage} className="max-w-4xl mx-auto">
            <div className="flex space-x-2">
              <Input
                type="text"
                placeholder="Type your message..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                className="flex-grow bg-background text-foreground placeholder-muted-foreground"
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
      </div>
    </div>
  );
}

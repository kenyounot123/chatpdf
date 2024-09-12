"use client";
import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Send, Menu, Plus, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageLoadingSpinner } from "@/components/message-loading-spinner";
import Markdown from 'react-markdown'
import { Textarea } from "@/components/ui/textarea";

interface Message {
  content: string;
  role: "user" | "bot";
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([
    { content: "Hello! How can I help you today?", role: "bot" },
  ]);
  const [inputMessage, setInputMessage] = useState<string>("");
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const messagesEndRef = useRef(null)
  const searchParams = useSearchParams();

  useEffect(() => {
    // Update to reading from aws s3 bucket
    // send a post request to server -> server creates signedURL from aws 
    // -> url is sent back to our client (here)
    // use the url to send a get request to retrieve the user uploaded document
    const getPdfResults = async () => {
    
    };
  
    getPdfResults();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages])

  const scrollToBottom = () => {
    setTimeout(() => {
      (messagesEndRef.current as HTMLElement | null)?.scrollIntoView({
        behavior: "smooth",
        block: 'nearest',
      });
    }, 100);
  };
  
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (inputMessage.trim() === "") return;
    setInputMessage("");
    const newMessages: Message[] = [
      ...messages,
      {
        role: "user",
        content: inputMessage,
      },
      {
        role: "bot",
        content: "",
      },
    ];
    const lastMessageIndex = newMessages.length - 1;
    // update state to update frontend display
    setMessages(newMessages);
    // We want to send the whole messages array to the backend to handle our RAG process
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        body: JSON.stringify([
          ...messages,
          {
            role: "user",
            content: inputMessage,
          },
        ]),
      });
      // clear input

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const botResponse = await response.json()
      console.log(botResponse)

      setMessages((prevMessages) => {
        const updatedMessages = [...prevMessages];
        updatedMessages[lastMessageIndex] = {
          ...updatedMessages[lastMessageIndex],
          content: updatedMessages[lastMessageIndex].content + `${botResponse}`,
        };
        return updatedMessages;
      });
      // const reader = response.body?.getReader();
      // const decoder = new TextDecoder();

      // while (true) {
      //   const { done, value } = await (
      //     reader as ReadableStreamDefaultReader<Uint8Array>
      //   ).read();
      //   if (done) break;

      //   const text = decoder.decode(value, { stream: true });

        // setMessages((prevMessages) => {
        //   const updatedMessages = [...prevMessages];
        //   updatedMessages[lastMessageIndex] = {
        //     ...updatedMessages[lastMessageIndex],
        //     content: updatedMessages[lastMessageIndex].content + text,
        //   };
        //   return updatedMessages;
        // });
      // }
    } catch (error) {
      setMessages((messages) => [
        ...messages,
        {
          role: "bot",
          content:
            "I'm sorry, but I encountered an error. Please try again later.",
        },
      ]);
    }
  };

  const handleEnterClick = (e:React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage(e)
    }
  }

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
          {isLoading && <MessageLoadingSpinner />}
          {!isLoading &&
            messages.map((message, idx) => (
              <div
                key={idx}
                className={`flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                } mb-5`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground"
                  }`}
                >
                  <Markdown>
                    {message.content}
                  </Markdown>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef}/>
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
      </div>
    </div>
  );
}

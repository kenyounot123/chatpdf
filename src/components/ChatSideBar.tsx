import { useState } from 'react'
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Plus, MessageSquare, X } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useMutation, useQuery, useConvex } from 'convex/react'
import { api } from '../../convex/_generated/api'
import { Id, Doc } from '../../convex/_generated/dataModel'
import { formatDate } from '@/lib/dateFormatter';
import { useRouter } from 'next/navigation'
import { useToast } from '@/hooks/use-toast'
import FileUploader from './FileUploader'

interface ChatSideBarProps {
  chatId: Id<"chats">,
  isSidebarOpen?: boolean,
}
export default function ChatSidebar({ chatId, isSidebarOpen = true }: ChatSideBarProps) {
  const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false)
  const [createModalOpen, setCreateModalOpen] = useState<boolean>(false)
  const [chatToDelete, setChatToDelete] = useState<Doc<"chats"> | null>(null)
  const { toast } = useToast()
  const convex = useConvex();
  const router = useRouter()

  const deleteChat = useMutation(api.chats.deleteChat)
  const allChats = useQuery(api.chats.getAllChatsForUser)

  const openDeleteModal = (chat: Doc<"chats">) => {
    setChatToDelete(chat)
    setDeleteModalOpen(true)
  }

  const handleChatClick = (chat: Doc<"chats">) => {
    router.push(`/chat?id=${chat._id}`)
  }

  const handleDelete = async () => {
    toast({
      variant: "destructive",
      title: "Chat successfully deleted",
      description: "Successfully deleted the chat and its associated messages and file",
    })
    if (chatToDelete) {
      await deleteChat({chatId})
      setDeleteModalOpen(false)
      setChatToDelete(null)
      const chats = await convex.query(api.chats.getAllChatsForUser)
      // refetches chats and checks to see if we deleted our only chat
      if (chats && chats[0] === null) {
        router.push('/');
      }
    }
  }

  const openCreateModal = () => {
    setCreateModalOpen(true)
  }

  return (
    <>
      <div
        className={`bg-secondary text-secondary-foreground w-64 flex flex-col ${
          isSidebarOpen ? "" : "hidden"
        } md:flex border-r border-secondary-foreground/10`}
      >
        <div className="p-4 border-b border-secondary-foreground/10">
          <Button
            variant="outline"
            onClick={openCreateModal}
            className="w-full justify-start text-secondary-foreground hover:bg-secondary-foreground/10 hover:text-secondary-foreground transition-colors duration-200"
          >
            <Plus className="mr-2 h-4 w-4" /> New Chat
          </Button>
        </div>
        <ScrollArea className="flex-grow">
          <div className="p-4 space-y-2">
            {allChats && allChats.map((chat) => (
              <div key={chat?._id} className="flex items-center group">
                <Button
                  variant="ghost"
                  onClick={() => chat && handleChatClick(chat)}
                  className="w-full justify-start text-secondary-foreground hover:bg-secondary-foreground/10 hover:text-secondary-foreground transition-colors duration-200"
                >
                  <MessageSquare className="mr-2 h-4 w-4" /> {formatDate(chat?._creationTime)}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  onClick={() => chat && openDeleteModal(chat)}
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">Delete chat</span>
                </Button>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      <Dialog open={createModalOpen} onOpenChange={setCreateModalOpen}>
        <DialogContent className='bg-secondary border-none'>
          <DialogHeader>
            <DialogTitle className='text-primary'>Upload a new file to create chat</DialogTitle>
            <DialogDescription>
              <FileUploader setCreateModalOpen={setCreateModalOpen}/>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button className="text-primary" variant="outline" onClick={() => setCreateModalOpen(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <DialogContent className='bg-secondary border-none'>
          <DialogHeader>
            <DialogTitle className='text-primary'>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this chat? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button className="text-primary" variant="outline" onClick={() => setDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
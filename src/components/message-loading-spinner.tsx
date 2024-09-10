'use client'

import { Loader2 } from "lucide-react"

interface MessageLoadingSpinnerProps {
  text?: string
}

export function MessageLoadingSpinner({ text = "Loading message" }: MessageLoadingSpinnerProps = {}) {
  return (
    <div className="flex items-center space-x-2 text-muted-foreground animate-pulse">
      <div className="flex space-x-1">
        <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
        <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
        <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
      </div>
      <span className="text-sm font-medium">{text}</span>
      <Loader2 className="h-4 w-4 animate-spin" />
    </div>
  )
}
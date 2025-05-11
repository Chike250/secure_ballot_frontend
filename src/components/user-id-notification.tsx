// Create a new component for the unique user ID notification
"use client"

import { useState, useEffect } from "react"
import { Check, Copy, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface UserIdNotificationProps {
  userId: string
  onClose?: () => void
  className?: string
}

export function UserIdNotification({ userId, onClose, className }: UserIdNotificationProps) {
  const [visible, setVisible] = useState(true)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    // Auto-hide after 15 seconds
    const timer = setTimeout(() => {
      setVisible(false)
      if (onClose) onClose()
    }, 15000)

    return () => clearTimeout(timer)
  }, [onClose])

  const handleCopy = () => {
    navigator.clipboard.writeText(userId)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleClose = () => {
    setVisible(false)
    if (onClose) onClose()
  }

  if (!visible) return null

  return (
    <Card className={cn("fixed bottom-6 right-6 z-50 w-80 shadow-lg border-primary/20", className)}>
      <CardContent className="p-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-medium text-lg">Your Unique User ID</h3>
          <Button variant="ghost" size="icon" onClick={handleClose} className="h-8 w-8">
            <X className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-sm text-muted-foreground mb-3">
          Please save this ID for reference. You'll need it if you contact support.
        </p>
        <div className="flex items-center gap-2 mb-2">
          <div className="bg-muted p-2 rounded flex-1 font-mono text-center">{userId}</div>
          <Button variant="outline" size="icon" onClick={handleCopy} className="h-9 w-9">
            {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
          </Button>
        </div>
        <div className="text-xs text-muted-foreground text-center">
          This notification will disappear in a few seconds
        </div>
      </CardContent>
    </Card>
  )
}

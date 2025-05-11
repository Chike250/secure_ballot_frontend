"use client"

import { useState, useRef, useEffect } from "react"
import { Play, Pause } from "lucide-react"
import { Button } from "@/src/components/ui/button"

export function HeroVideo() {
  const [isPlaying, setIsPlaying] = useState(false)
  const videoRef = useRef<HTMLDivElement>(null)

  // Clean up event listeners on unmount
  useEffect(() => {
    return () => {
      // Any cleanup needed for video resources
    }
  }, [])

  const togglePlay = () => {
    // In a real implementation, this would control an actual video
    // For now, we're just toggling the state
    setIsPlaying(!isPlaying)
  }

  return (
    <div className="relative mx-auto aspect-video w-full max-w-3xl overflow-hidden rounded-xl">
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

      {/* Placeholder for video - in a real app, you'd use an actual video */}
      <div
        ref={videoRef}
        id="hero-video"
        className="h-full w-full bg-gradient-to-br from-primary/30 to-secondary/30"
        role="img"
        aria-label="NaijaVote Demo Video"
      >
        <div className="flex h-full items-center justify-center">
          <div className="text-center text-white">
            <h3 className="text-xl font-bold">NaijaVote Demo</h3>
            <p className="text-sm opacity-80">Secure, Transparent, Reliable</p>
          </div>
        </div>
      </div>

      <Button
        onClick={togglePlay}
        className="absolute bottom-4 right-4 h-10 w-10 rounded-full p-0"
        aria-label={isPlaying ? "Pause video" : "Play video"}
      >
        {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
      </Button>
    </div>
  )
}

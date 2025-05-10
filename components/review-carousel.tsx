"use client"

import type React from "react"

import { useState, useEffect, useRef, useCallback, memo } from "react"
import { ChevronLeft, ChevronRight, Quote, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface Review {
  id: number
  quote: string
  author: string
  role: string
  image?: string
  rating: number
}

const reviews: Review[] = [
  {
    id: 1,
    quote:
      "Secure Ballot's encryption protocols are state-of-the-art. Their implementation of ECC & AES-256 encryption ensures votes remain confidential and tamper-proof.",
    author: "Dr. Isa Ibrahim Pantami",
    role: "Cybersecurity Expert, Former Minister of Communications",
    rating: 5,
  },
  {
    id: 2,
    quote:
      "I've thoroughly tested Secure Ballot's security measures, and I'm impressed. The multi-factor authentication and end-to-end encryption make it virtually impenetrable.",
    author: "Osita Chidoka",
    role: "Chief Security Officer, CyberSafe Foundation",
    rating: 5,
  },
  {
    id: 3,
    quote:
      "As someone who values transparency in our electoral process, I'm confident that Secure Ballot represents a significant step forward for Nigerian democracy.",
    author: "Chimamanda Ngozi Adichie",
    role: "Award-winning Author & Public Figure",
    rating: 4,
  },
  {
    id: 4,
    quote:
      "The user experience is exceptional. Secure Ballot makes voting accessible to all Nigerians while maintaining the highest security standards.",
    author: "Bankole Wellington (Banky W)",
    role: "Musician & Political Activist",
    rating: 5,
  },
  {
    id: 5,
    quote:
      "INEC's partnership with Secure Ballot demonstrates our commitment to leveraging technology for free, fair, and secure elections in Nigeria.",
    author: "Prof. Mahmood Yakubu",
    role: "INEC Chairman",
    rating: 4,
  },
  {
    id: 6,
    quote:
      "The real-time monitoring capabilities of Secure Ballot bring unprecedented transparency to our electoral process. This is the future of voting in Nigeria.",
    author: "Aisha Yesufu",
    role: "Activist & Public Speaker",
    rating: 5,
  },
]

export function ReviewCarousel() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const [isTouching, setIsTouching] = useState(false)
  const [touchStart, setTouchStart] = useState(0)
  const [touchEnd, setTouchEnd] = useState(0)
  const carouselRef = useRef<HTMLDivElement>(null)

  // Calculate visible cards based on screen size
  const getVisibleCount = () => {
    if (typeof window !== "undefined") {
      if (window.innerWidth < 640) return 1
      if (window.innerWidth < 1024) return 2
      return 3
    }
    return 3
  }

  const [visibleCount, setVisibleCount] = useState(3)

  useEffect(() => {
    const handleResize = () => {
      setVisibleCount(getVisibleCount())
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const totalSlides = reviews.length
  const maxIndex = totalSlides - visibleCount

  const nextSlide = useCallback(() => {
    setActiveIndex((prev) => (prev >= maxIndex ? 0 : prev + 1))
  }, [maxIndex])

  const prevSlide = useCallback(() => {
    setActiveIndex((prev) => (prev <= 0 ? maxIndex : prev - 1))
  }, [maxIndex])

  // Auto-transition effect
  useEffect(() => {
    if (!isAutoPlaying || isTouching) return

    const interval = setInterval(() => {
      nextSlide()
    }, 5000)

    return () => clearInterval(interval)
  }, [activeIndex, isAutoPlaying, isTouching, nextSlide, maxIndex])

  const goToSlide = (index: number) => {
    setActiveIndex(index)
  }

  // Touch handlers for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsTouching(true)
    setTouchStart(e.targetTouches[0].clientX)
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const handleTouchEnd = () => {
    setIsTouching(false)

    const touchDiff = touchStart - touchEnd

    // If swipe distance is significant, change slide
    if (touchDiff > 50) {
      nextSlide()
    } else if (touchDiff < -50) {
      prevSlide()
    }
  }

  // Pause auto-transition on hover
  const handleMouseEnter = () => {
    setIsAutoPlaying(false)
  }

  const handleMouseLeave = () => {
    setIsAutoPlaying(true)
  }

  // Generate star rating component
  const StarRating = memo(({ rating }: { rating: number }) => {
    return (
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={cn("h-4 w-4 mr-0.5", i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300")}
          />
        ))}
      </div>
    )
  })

  StarRating.displayName = "StarRating"

  return (
    <div className="relative w-full py-8" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      {/* Main carousel container */}
      <div
        ref={carouselRef}
        className="overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className="flex transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${activeIndex * (100 / visibleCount)}%)` }}
        >
          {reviews.map((review) => (
            <div
              key={review.id}
              className={`w-full shrink-0 px-3 transition-all duration-300 ease-in-out`}
              style={{ width: `${100 / visibleCount}%` }}
            >
              <div className="h-full glassmorphism rounded-xl p-6 transition-all duration-300 hover:shadow-xl hover:scale-[1.02] hover:-translate-y-1 group">
                <Quote className="h-8 w-8 text-primary/40 mb-4 transition-transform duration-300 group-hover:scale-110" />
                <div className="mb-4">
                  <StarRating rating={review.rating} />
                </div>
                <blockquote className="mb-6 text-base line-clamp-4 h-24 overflow-hidden">"{review.quote}"</blockquote>
                <div className="flex items-center gap-3 mt-auto">
                  <div className="h-12 w-12 rounded-full overflow-hidden bg-muted flex-shrink-0 transition-transform duration-300 group-hover:scale-110">
                    {review.image ? (
                      <img
                        src={review.image || "/placeholder.svg"}
                        alt={review.author}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center bg-primary/10 text-primary font-bold">
                        {review.author
                          .split(" ")
                          .map((name) => name[0])
                          .join("")}
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="font-semibold">{review.author}</div>
                    <div className="text-xs text-muted-foreground">{review.role}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation arrows */}
      <Button
        variant="outline"
        size="icon"
        className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-background/80 backdrop-blur-sm z-10 shadow-md hover:bg-background"
        onClick={prevSlide}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      <Button
        variant="outline"
        size="icon"
        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-background/80 backdrop-blur-sm z-10 shadow-md hover:bg-background"
        onClick={nextSlide}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>

      {/* Navigation dots */}
      <div className="flex justify-center mt-6 gap-2">
        {Array.from({ length: maxIndex + 1 }).map((_, index) => (
          <button
            key={index}
            className={cn(
              "h-2 w-2 rounded-full transition-all duration-300",
              activeIndex === index ? "bg-primary w-6" : "bg-muted hover:bg-primary/50",
            )}
            onClick={() => goToSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}

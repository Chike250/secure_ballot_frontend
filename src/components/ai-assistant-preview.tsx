"use client"

import { useState, useEffect, useRef } from "react"
import { Bot, Send, X } from "lucide-react"
import { Button } from "@/src/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Input } from "@/src/components/ui/input"
import { Badge } from "@/src/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/src/components/ui/tooltip"
import { useLanguage } from "@/lib/i18n/LanguageContext"

export function AiAssistantPreview() {
  const { t, language } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)
  const [message, setMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef(null)
  const [conversation, setConversation] = useState([])
  const [isClient, setIsClient] = useState(false)

  // Set isClient to true when component mounts
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Initialize conversation with greeting in the current language
  useEffect(() => {
    if (!isClient) return

    setConversation([
      {
        role: "assistant",
        content: t("ai.greeting"),
      },
    ])
  }, [language, t, isClient])

  // Knowledge base for the AI assistant - now using translations
  const getKnowledgeBase = () => ({
    voting: {
      process: t("ai.knowledge.voting.process"),
      requirements: t("ai.knowledge.voting.requirements"),
      eligibility: t("ai.knowledge.voting.eligibility"),
      where: t("ai.knowledge.voting.where"),
      when: t("ai.knowledge.voting.when"),
      change: t("ai.knowledge.voting.change"),
      verify: t("ai.knowledge.voting.verify"),
    },
    security: {
      overview: t("ai.knowledge.security.overview"),
      encryption: t("ai.knowledge.security.encryption"),
      authentication: t("ai.knowledge.security.authentication"),
      privacy: t("ai.knowledge.security.privacy"),
      audit: t("ai.knowledge.security.audit"),
      protection: t("ai.knowledge.security.protection"),
    },
    technical: {
      platform: t("ai.knowledge.technical.platform"),
      accessibility: t("ai.knowledge.technical.accessibility"),
      backup: t("ai.knowledge.technical.backup"),
      testing: t("ai.knowledge.technical.testing"),
    },
    results: {
      counting: t("ai.knowledge.results.counting"),
      verification: t("ai.knowledge.results.verification"),
      announcement: t("ai.knowledge.results.announcement"),
      disputes: t("ai.knowledge.results.disputes"),
    },
    candidates: {
      information: t("ai.knowledge.candidates.information"),
      comparison: t("ai.knowledge.candidates.comparison"),
      parties: t("ai.knowledge.candidates.parties"),
    },
    support: {
      contact: t("ai.knowledge.support.contact"),
      issues: t("ai.knowledge.support.issues"),
      feedback: t("ai.knowledge.support.feedback"),
    },
  })

  // Function to find the best response from the knowledge base
  const findResponse = (query) => {
    if (!isClient) return ""

    const knowledgeBase = getKnowledgeBase()
    query = query.toLowerCase()

    // Check for specific keywords and return appropriate responses
    if (
      query.includes(t("ai.keywords.how").toLowerCase()) &&
      (query.includes(t("ai.keywords.vote").toLowerCase()) ||
        query.includes(t("ai.keywords.voting").toLowerCase()) ||
        query.includes(t("ai.keywords.cast").toLowerCase()))
    ) {
      return knowledgeBase.voting.process
    } else if (
      query.includes(t("ai.keywords.requirements").toLowerCase()) ||
      (query.includes(t("ai.keywords.need").toLowerCase()) && query.includes(t("ai.keywords.vote").toLowerCase()))
    ) {
      return knowledgeBase.voting.requirements
    } else if (
      query.includes(t("ai.keywords.eligible").toLowerCase()) ||
      query.includes(t("ai.keywords.eligibility").toLowerCase())
    ) {
      return knowledgeBase.voting.eligibility
    } else if (
      query.includes(t("ai.keywords.where").toLowerCase()) &&
      query.includes(t("ai.keywords.vote").toLowerCase())
    ) {
      return knowledgeBase.voting.where
    } else if (
      query.includes(t("ai.keywords.when").toLowerCase()) ||
      query.includes(t("ai.keywords.time").toLowerCase()) ||
      query.includes(t("ai.keywords.period").toLowerCase())
    ) {
      return knowledgeBase.voting.when
    } else if (
      query.includes(t("ai.keywords.change").toLowerCase()) &&
      query.includes(t("ai.keywords.vote").toLowerCase())
    ) {
      return knowledgeBase.voting.change
    } else if (
      query.includes(t("ai.keywords.verify").toLowerCase()) ||
      query.includes(t("ai.keywords.confirmation").toLowerCase())
    ) {
      return knowledgeBase.voting.verify
    } else if (
      query.includes(t("ai.keywords.security").toLowerCase()) ||
      query.includes(t("ai.keywords.secure").toLowerCase()) ||
      query.includes(t("ai.keywords.safe").toLowerCase())
    ) {
      return knowledgeBase.security.overview
    } else if (
      query.includes(t("ai.keywords.encryption").toLowerCase()) ||
      query.includes(t("ai.keywords.encrypted").toLowerCase())
    ) {
      return knowledgeBase.security.encryption
    } else if (
      query.includes(t("ai.keywords.authentication").toLowerCase()) ||
      query.includes(t("ai.keywords.verifyIdentity").toLowerCase())
    ) {
      return knowledgeBase.security.authentication
    } else if (
      query.includes(t("ai.keywords.privacy").toLowerCase()) ||
      query.includes(t("ai.keywords.anonymous").toLowerCase()) ||
      query.includes(t("ai.keywords.secret").toLowerCase())
    ) {
      return knowledgeBase.security.privacy
    } else if (
      query.includes(t("ai.keywords.audit").toLowerCase()) ||
      query.includes(t("ai.keywords.log").toLowerCase()) ||
      query.includes(t("ai.keywords.track").toLowerCase())
    ) {
      return knowledgeBase.security.audit
    } else if (
      query.includes(t("ai.keywords.protect").toLowerCase()) ||
      query.includes(t("ai.keywords.attack").toLowerCase()) ||
      query.includes(t("ai.keywords.hack").toLowerCase())
    ) {
      return knowledgeBase.security.protection
    } else if (
      query.includes(t("ai.keywords.platform").toLowerCase()) ||
      query.includes(t("ai.keywords.system").toLowerCase()) ||
      query.includes(t("ai.keywords.infrastructure").toLowerCase())
    ) {
      return knowledgeBase.technical.platform
    } else if (
      query.includes(t("ai.keywords.accessibility").toLowerCase()) ||
      query.includes(t("ai.keywords.accessible").toLowerCase()) ||
      query.includes(t("ai.keywords.disability").toLowerCase())
    ) {
      return knowledgeBase.technical.accessibility
    } else if (
      query.includes(t("ai.keywords.backup").toLowerCase()) ||
      query.includes(t("ai.keywords.disaster").toLowerCase()) ||
      query.includes(t("ai.keywords.recovery").toLowerCase())
    ) {
      return knowledgeBase.technical.backup
    } else if (
      query.includes(t("ai.keywords.test").toLowerCase()) ||
      query.includes(t("ai.keywords.audit").toLowerCase()) ||
      query.includes(t("ai.keywords.securityTest").toLowerCase())
    ) {
      return knowledgeBase.technical.testing
    } else if (
      query.includes(t("ai.keywords.count").toLowerCase()) ||
      query.includes(t("ai.keywords.counting").toLowerCase())
    ) {
      return knowledgeBase.results.counting
    } else if (
      query.includes(t("ai.keywords.verify").toLowerCase()) &&
      query.includes(t("ai.keywords.results").toLowerCase())
    ) {
      return knowledgeBase.results.verification
    } else if (
      query.includes(t("ai.keywords.announce").toLowerCase()) ||
      query.includes(t("ai.keywords.officialResults").toLowerCase())
    ) {
      return knowledgeBase.results.announcement
    } else if (
      query.includes(t("ai.keywords.dispute").toLowerCase()) ||
      query.includes(t("ai.keywords.challenge").toLowerCase()) ||
      query.includes(t("ai.keywords.contest").toLowerCase())
    ) {
      return knowledgeBase.results.disputes
    } else if (
      query.includes(t("ai.keywords.candidate").toLowerCase()) ||
      query.includes(t("ai.keywords.candidates").toLowerCase()) ||
      query.includes(t("ai.keywords.who").toLowerCase())
    ) {
      return knowledgeBase.candidates.information
    } else if (
      query.includes(t("ai.keywords.compare").toLowerCase()) ||
      query.includes(t("ai.keywords.comparison").toLowerCase())
    ) {
      return knowledgeBase.candidates.comparison
    } else if (
      query.includes(t("ai.keywords.party").toLowerCase()) ||
      query.includes(t("ai.keywords.parties").toLowerCase())
    ) {
      return knowledgeBase.candidates.parties
    } else if (
      query.includes(t("ai.keywords.contact").toLowerCase()) ||
      query.includes(t("ai.keywords.support").toLowerCase()) ||
      query.includes(t("ai.keywords.help").toLowerCase())
    ) {
      return knowledgeBase.support.contact
    } else if (
      query.includes(t("ai.keywords.issue").toLowerCase()) ||
      query.includes(t("ai.keywords.problem").toLowerCase()) ||
      query.includes(t("ai.keywords.trouble").toLowerCase())
    ) {
      return knowledgeBase.support.issues
    } else if (
      query.includes(t("ai.keywords.feedback").toLowerCase()) ||
      query.includes(t("ai.keywords.suggestion").toLowerCase())
    ) {
      return knowledgeBase.support.feedback
    }

    // If no specific match, provide a general response
    return t("ai.fallbackResponse")
  }

  // Simulate typing effect for AI responses
  const simulateTyping = (response, callback) => {
    setIsTyping(true)
    setTimeout(
      () => {
        setIsTyping(false)
        callback(response)
      },
      1000 + Math.random() * 1000,
    ) // Random delay between 1-2 seconds to simulate thinking
  }

  const handleSendMessage = () => {
    if (!message.trim() || !isClient) return

    // Add user message
    const updatedConversation = [...conversation, { role: "user", content: message }]
    setConversation(updatedConversation)
    setMessage("")

    // Find response from knowledge base
    const response = findResponse(message)

    // Simulate AI typing and then add response
    simulateTyping(response, (aiResponse) => {
      setConversation([...updatedConversation, { role: "assistant", content: aiResponse }])
    })
  }

  // Scroll to bottom of messages when conversation updates
  useEffect(() => {
    if (!isClient) return
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [conversation, isClient])

  // Suggested questions for quick access - now using translations
  const suggestedQuestions = isClient
    ? [
        t("ai.suggestedQuestions.howToVote"),
        t("ai.suggestedQuestions.isVoteSecure"),
        t("ai.suggestedQuestions.whoCandidates"),
        t("ai.suggestedQuestions.whenVoting"),
        t("ai.suggestedQuestions.changeVote"),
        t("ai.suggestedQuestions.countVotes"),
      ]
    : []

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full shadow-lg bg-primary hover:bg-primary/90 transition-all duration-300"
      >
        <Bot className="h-6 w-6" />
      </Button>
    )
  }

  return (
    <TooltipProvider>
      <Card className="fixed bottom-6 right-6 z-50 w-80 md:w-96 shadow-xl border border-primary/20 bg-background/80 backdrop-blur-lg">
        <CardHeader className="flex flex-row items-center justify-between pb-2 border-b">
          <div className="flex items-center gap-2">
            <div className="relative">
              <Bot className="h-5 w-5 text-primary" />
              <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-green-500"></span>
            </div>
            <CardTitle className="text-lg">{t("ai.title")}</CardTitle>
            <Badge variant="outline" className="ml-2 bg-green-500/10 text-green-500 border-green-500/20">
              <span className="mr-1 h-2 w-2 rounded-full bg-green-500 inline-block"></span>
              {t("ai.status.online")}
            </Badge>
          </div>
          <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="h-80 overflow-y-auto p-4 space-y-4">
          {conversation.map((msg, index) => (
            <div
              key={index}
              className={`max-w-[85%] rounded-lg p-3 ${
                msg.role === "user" ? "ml-auto bg-primary text-primary-foreground" : "bg-muted border border-border/50"
              }`}
            >
              {msg.content}
            </div>
          ))}
          {isTyping && (
            <div className="max-w-[85%] rounded-lg p-3 bg-muted border border-border/50">
              <div className="flex space-x-1">
                <div
                  className="h-2 w-2 rounded-full bg-primary/60 animate-bounce"
                  style={{ animationDelay: "0ms" }}
                ></div>
                <div
                  className="h-2 w-2 rounded-full bg-primary/60 animate-bounce"
                  style={{ animationDelay: "150ms" }}
                ></div>
                <div
                  className="h-2 w-2 rounded-full bg-primary/60 animate-bounce"
                  style={{ animationDelay: "300ms" }}
                ></div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </CardContent>
        <div className="px-4 py-2 border-t border-border/50">
          <div className="flex flex-wrap gap-1 mb-2">
            {suggestedQuestions.map((question, index) => (
              <Tooltip key={index}>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs h-7 bg-muted/50 hover:bg-primary/10"
                    onClick={() => {
                      setMessage(question)
                      setTimeout(() => handleSendMessage(), 100)
                    }}
                  >
                    {question.length > 15 ? `${question.substring(0, 15)}...` : question}
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">
                  <p>{question}</p>
                </TooltipContent>
              </Tooltip>
            ))}
          </div>
        </div>
        <CardFooter className="p-3">
          <div className="flex w-full items-center gap-2">
            <Input
              placeholder={t("ai.inputPlaceholder")}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              className="flex-1 border-primary/20 focus-visible:ring-primary/30"
            />
            <Button
              size="icon"
              onClick={handleSendMessage}
              className="bg-primary hover:bg-primary/90 transition-colors"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </CardFooter>
      </Card>
    </TooltipProvider>
  )
}

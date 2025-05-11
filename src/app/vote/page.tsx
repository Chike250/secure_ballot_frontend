"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useSearchParams, useRouter } from "next/navigation"
import { Check, ArrowLeft, BadgeCheck, AlertCircle, Info, Eye, Shield, BarChart3, ChevronRight } from "lucide-react"
import { Button } from "@/src/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/src/components/ui/card"
import { Badge } from "@/src/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog"
import { Progress } from "@/src/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/src/components/ui/alert"
import { RadioGroup, RadioGroupItem } from "@/src/components/ui/radio-group"
import { Label } from "@/src/components/ui/label"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/src/components/ui/tooltip"
import { Navbar } from "@/src/components/navbar"

// Election types
const ELECTION_TYPES = {
  presidential: "Presidential Election",
  gubernatorial: "Gubernatorial Election",
  "house-of-reps": "House of Representatives Election",
  senatorial: "Senatorial Election",
}

// Candidate data by election type
const candidatesByElection = {
  presidential: [
    {
      id: 1,
      name: "Bola Ahmed Tinubu",
      party: "APC",
      votes: 8500000,
      percentage: 35,
      image: "/placeholder.svg?height=100&width=100",
      color: "#64748b",
      bio: "Former Governor of Lagos State and National Leader of the APC",
      manifesto: "Economic growth, security, and infrastructure development",
    },
    {
      id: 2,
      name: "Atiku Abubakar",
      party: "PDP",
      votes: 6900000,
      percentage: 28,
      image: "/placeholder.svg?height=100&width=100",
      color: "#ef4444",
      bio: "Former Vice President of Nigeria and business tycoon",
      manifesto: "Job creation, education reform, and national unity",
    },
    {
      id: 3,
      name: "Peter Obi",
      party: "LP",
      votes: 6100000,
      percentage: 25,
      image: "/placeholder.svg?height=100&width=100",
      color: "#22c55e",
      bio: "Former Governor of Anambra State and businessman",
      manifesto: "Economic restructuring, anti-corruption, and youth empowerment",
    },
    {
      id: 4,
      name: "Rabiu Kwankwaso",
      party: "NNPP",
      votes: 1500000,
      percentage: 7,
      image: "/placeholder.svg?height=100&width=100",
      color: "#3b82f6",
      bio: "Former Governor of Kano State and Senator",
      manifesto: "Educational development, healthcare reform, and northern development",
    },
    {
      id: 5,
      name: "Others",
      party: "Various",
      votes: 1000000,
      percentage: 5,
      image: "/placeholder.svg?height=100&width=100",
      color: "#a855f7",
      bio: "Various candidates from smaller political parties",
      manifesto: "Various policy positions",
    },
  ],
  gubernatorial: [
    {
      id: 1,
      name: "Babajide Sanwo-Olu",
      party: "APC",
      votes: 950000,
      percentage: 42,
      image: "/placeholder.svg?height=100&width=100",
      color: "#64748b",
      bio: "Current Governor of Lagos State",
      manifesto: "Urban development, transportation, and economic growth",
    },
    {
      id: 2,
      name: "Olajide Adediran (Jandor)",
      party: "PDP",
      votes: 580000,
      percentage: 26,
      image: "/placeholder.svg?height=100&width=100",
      color: "#ef4444",
      bio: "Businessman and PDP Lagos leader",
      manifesto: "Infrastructure development and economic diversification",
    },
    {
      id: 3,
      name: "Gbadebo Rhodes-Vivour",
      party: "LP",
      votes: 520000,
      percentage: 23,
      image: "/placeholder.svg?height=100&width=100",
      color: "#22c55e",
      bio: "Architect and social activist",
      manifesto: "Social justice, environmental sustainability, and youth inclusion",
    },
    {
      id: 4,
      name: "Others",
      party: "Various",
      votes: 200000,
      percentage: 9,
      image: "/placeholder.svg?height=100&width=100",
      color: "#a855f7",
      bio: "Various candidates from smaller political parties",
      manifesto: "Various policy positions",
    },
  ],
  "house-of-reps": [
    {
      id: 1,
      name: "Akin Alabi",
      party: "APC",
      votes: 45000,
      percentage: 38,
      image: "/placeholder.svg?height=100&width=100",
      color: "#64748b",
      bio: "Businessman and sports betting pioneer",
      manifesto: "Youth empowerment, digital economy, and constituency projects",
    },
    {
      id: 2,
      name: "Tolulope Akande-Sadipe",
      party: "PDP",
      votes: 38000,
      percentage: 32,
      image: "/placeholder.svg?height=100&width=100",
      color: "#ef4444",
      bio: "Business executive and development expert",
      manifesto: "Rural development, women empowerment, and education",
    },
    {
      id: 3,
      name: "Shina Peller",
      party: "LP",
      votes: 25000,
      percentage: 21,
      image: "/placeholder.svg?height=100&width=100",
      color: "#22c55e",
      bio: "Entrepreneur and entertainment mogul",
      manifesto: "Creative economy, youth development, and innovation",
    },
    {
      id: 4,
      name: "Others",
      party: "Various",
      votes: 10000,
      percentage: 9,
      image: "/placeholder.svg?height=100&width=100",
      color: "#a855f7",
      bio: "Various candidates from smaller political parties",
      manifesto: "Various policy positions",
    },
  ],
  senatorial: [
    {
      id: 1,
      name: "Oluremi Tinubu",
      party: "APC",
      votes: 280000,
      percentage: 40,
      image: "/placeholder.svg?height=100&width=100",
      color: "#64748b",
      bio: "Former First Lady of Lagos State and incumbent Senator",
      manifesto: "Women empowerment, social welfare, and education",
    },
    {
      id: 2,
      name: "Dino Melaye",
      party: "PDP",
      votes: 210000,
      percentage: 30,
      image: "/placeholder.svg?height=100&width=100",
      color: "#ef4444",
      bio: "Former Senator and political activist",
      manifesto: "Accountability, legislative reforms, and constituency development",
    },
    {
      id: 3,
      name: "Shehu Sani",
      party: "LP",
      votes: 175000,
      percentage: 25,
      image: "/placeholder.svg?height=100&width=100",
      color: "#22c55e",
      bio: "Human rights activist and former Senator",
      manifesto: "Human rights, social justice, and northern development",
    },
    {
      id: 4,
      name: "Others",
      party: "Various",
      votes: 35000,
      percentage: 5,
      image: "/placeholder.svg?height=100&width=100",
      color: "#a855f7",
      bio: "Various candidates from smaller political parties",
      manifesto: "Various policy positions",
    },
  ],
}

// Voting record structure
type VotingRecord = Record<string, number>

export default function VotePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const electionType = searchParams.get("type") || "presidential"
  const [selectedCandidate, setSelectedCandidate] = useState<number | null>(null)
  const [votedElections, setVotedElections] = useState<VotingRecord>({})
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [showSuccessDialog, setShowSuccessDialog] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<"card" | "list">("card")
  const [candidates, setCandidates] = useState(candidatesByElection[electionType as keyof typeof candidatesByElection])
  const [showPartyInfo, setShowPartyInfo] = useState(false)
  const [activeTab, setActiveTab] = useState("vote")

  // Load voting records from localStorage
  useEffect(() => {
    const savedVotes = localStorage.getItem("votedElections")
    if (savedVotes) {
      setVotedElections(JSON.parse(savedVotes))
    }
  }, [])

  // Update candidates when election type changes
  useEffect(() => {
    setCandidates(candidatesByElection[electionType as keyof typeof candidatesByElection])
  }, [electionType])

  // Handle candidate selection
  const handleCandidateSelect = (candidateId: number) => {
    if (votedElections[electionType]) {
      setError("You have already voted in this election. You cannot vote twice.")
      return
    }
    setSelectedCandidate(candidateId)
    setError(null)
  }

  // Open confirmation dialog
  const handleConfirmVote = () => {
    if (!selectedCandidate) {
      setError("Please select a candidate before confirming your vote.")
      return
    }
    setShowConfirmDialog(true)
  }

  // Submit vote
  const submitVote = async () => {
    if (!selectedCandidate) return

    setIsSubmitting(true)
    setError(null)

    try {
      // Simulate API call with a delay
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Update vote counts in local state
      const updatedCandidates = candidates.map((candidate) => {
        if (candidate.id === selectedCandidate) {
          const newVotes = candidate.votes + 1
          const totalVotes = candidates.reduce((sum, c) => sum + c.votes, 0) + 1
          return {
            ...candidate,
            votes: newVotes,
            percentage: Math.round((newVotes / totalVotes) * 100),
          }
        }
        return candidate
      })

      // Update state
      setCandidates(updatedCandidates)

      // Save vote to localStorage
      const updatedVotes = { ...votedElections, [electionType]: selectedCandidate }
      setVotedElections(updatedVotes)
      localStorage.setItem("votedElections", JSON.stringify(updatedVotes))

      // Close confirmation dialog and show success dialog
      setShowConfirmDialog(false)
      setShowSuccessDialog(true)
    } catch (err) {
      setError("An error occurred while submitting your vote. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Navigate to a different election type
  const changeElectionType = (type: string) => {
    router.push(`/vote?type=${type}`)
  }

  // Check if already voted
  const hasVoted = Boolean(votedElections[electionType])

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto py-6 px-4">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <Button variant="ghost" size="sm" className="mb-2" asChild>
              <Link href="/dashboard">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
              </Link>
            </Button>
            <h1 className="text-3xl font-bold tracking-tight">
              {ELECTION_TYPES[electionType as keyof typeof ELECTION_TYPES]}
            </h1>
            <p className="text-muted-foreground">Cast your vote securely and confidentially</p>
          </div>
          {hasVoted && (
            <Badge variant="secondary" className="flex items-center gap-1 px-3 py-1.5">
              <BadgeCheck className="h-4 w-4 text-green-500" />
              <span>Vote Already Cast</span>
            </Badge>
          )}
        </div>

        {/* Security Information Banner */}
        <Alert className="mb-6">
          <Shield className="h-4 w-4" />
          <AlertTitle>Secure Voting Environment</AlertTitle>
          <AlertDescription>
            Your vote is encrypted and anonymous. No one can link your identity to your voting choice.
          </AlertDescription>
        </Alert>

        {/* Error Message */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList>
            <TabsTrigger value="vote">Vote</TabsTrigger>
            <TabsTrigger value="results">Live Results</TabsTrigger>
          </TabsList>

          <TabsContent value="vote" className="mt-4">
            {/* Vote Tabs Content */}
            <div className="mb-4 flex flex-wrap gap-3">
              {Object.entries(ELECTION_TYPES).map(([type, title]) => (
                <Button
                  key={type}
                  variant={electionType === type ? "default" : "outline"}
                  size="sm"
                  onClick={() => changeElectionType(type)}
                  className="flex items-center gap-2"
                >
                  <span>{title.split(" ")[0]}</span>
                  {votedElections[type] && <BadgeCheck className="h-4 w-4 text-green-500" />}
                </Button>
              ))}
            </div>

            <div className="mb-4 flex justify-between items-center">
              <h2 className="text-xl font-semibold">Select Your Candidate</h2>
              <div className="flex gap-2">
                <Button
                  variant={viewMode === "card" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("card")}
                >
                  Card View
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                >
                  List View
                </Button>
              </div>
            </div>

            {viewMode === "card" ? (
              // Card View
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {candidates.map((candidate) => (
                  <Card
                    key={candidate.id}
                    className={`overflow-hidden transition-all duration-300 hover:shadow-lg ${
                      selectedCandidate === candidate.id ? "ring-2 ring-primary" : ""
                    } ${hasVoted ? "opacity-80" : "cursor-pointer"}`}
                    onClick={() => !hasVoted && handleCandidateSelect(candidate.id)}
                  >
                    <div className="relative h-32 bg-muted">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="relative h-20 w-20 overflow-hidden rounded-full border-2 border-background">
                          <Image
                            src={candidate.image || "/placeholder.svg"}
                            alt={candidate.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      </div>
                      <div
                        className="absolute right-0 bottom-0 h-full w-1"
                        style={{ backgroundColor: candidate.color }}
                      ></div>
                    </div>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-lg">{candidate.name}</CardTitle>
                        <Badge
                          variant="outline"
                          style={{
                            backgroundColor: `${candidate.color}20`,
                            color: candidate.color,
                            borderColor: `${candidate.color}40`,
                          }}
                        >
                          {candidate.party}
                        </Badge>
                      </div>
                      <CardDescription className="line-clamp-2">{candidate.bio}</CardDescription>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div className="mb-2">
                        <div className="text-sm font-medium mb-1">Key Policies:</div>
                        <p className="text-sm text-muted-foreground line-clamp-2">{candidate.manifesto}</p>
                      </div>
                      <div className="mt-2">
                        <div className="flex justify-between items-center text-sm mb-1">
                          <span>Current Support:</span>
                          <span className="font-medium">{candidate.percentage}%</span>
                        </div>
                        <Progress value={candidate.percentage} className="h-2" />
                      </div>
                    </CardContent>
                    <CardFooter>
                      <div className="w-full flex justify-between items-center">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  setShowPartyInfo(true)
                                }}
                              >
                                <Info className="h-4 w-4" />
                                <span className="sr-only">More Info</span>
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>View candidate details</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        {hasVoted ? (
                          votedElections[electionType] === candidate.id ? (
                            <Badge className="bg-green-500">
                              <Check className="mr-1 h-3 w-3" /> Your Vote
                            </Badge>
                          ) : (
                            <Badge variant="outline">Not Selected</Badge>
                          )
                        ) : (
                          <div className="flex items-center">
                            <RadioGroup value={selectedCandidate?.toString() || ""} className="flex">
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem
                                  value={candidate.id.toString()}
                                  id={`candidate-${candidate.id}`}
                                  onClick={(e) => e.stopPropagation()}
                                  checked={selectedCandidate === candidate.id}
                                  onChange={() => handleCandidateSelect(candidate.id)}
                                />
                                <Label htmlFor={`candidate-${candidate.id}`}>Select</Label>
                              </div>
                            </RadioGroup>
                          </div>
                        )}
                      </div>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              // List View
              <div className="rounded-lg border overflow-hidden mb-6">
                <div className="bg-muted p-3 grid grid-cols-12 gap-2 font-medium">
                  <div className="col-span-1"></div>
                  <div className="col-span-3">Candidate</div>
                  <div className="col-span-2">Party</div>
                  <div className="col-span-3">Key Policies</div>
                  <div className="col-span-2">Support</div>
                  <div className="col-span-1"></div>
                </div>
                {candidates.map((candidate) => (
                  <div
                    key={candidate.id}
                    className={`p-3 grid grid-cols-12 gap-2 border-t hover:bg-muted/30 ${
                      selectedCandidate === candidate.id ? "bg-primary/5" : ""
                    } ${hasVoted ? "opacity-90" : "cursor-pointer"}`}
                    onClick={() => !hasVoted && handleCandidateSelect(candidate.id)}
                  >
                    <div className="col-span-1 flex items-center justify-center">
                      <div className="relative h-10 w-10 rounded-full overflow-hidden">
                        <Image
                          src={candidate.image || "/placeholder.svg"}
                          alt={candidate.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </div>
                    <div className="col-span-3 flex flex-col justify-center">
                      <span className="font-medium">{candidate.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {candidate.bio.split(" ").slice(0, 3).join(" ")}...
                      </span>
                    </div>
                    <div className="col-span-2 flex items-center">
                      <Badge
                        variant="outline"
                        className="font-medium"
                        style={{
                          backgroundColor: `${candidate.color}20`,
                          color: candidate.color,
                          borderColor: `${candidate.color}40`,
                        }}
                      >
                        {candidate.party}
                      </Badge>
                    </div>
                    <div className="col-span-3 flex items-center text-sm">
                      <span className="line-clamp-2">{candidate.manifesto}</span>
                    </div>
                    <div className="col-span-2 flex items-center">
                      <div className="w-full">
                        <div className="flex justify-between text-xs mb-1">
                          <span>{candidate.votes.toLocaleString()}</span>
                          <span>{candidate.percentage}%</span>
                        </div>
                        <Progress value={candidate.percentage} className="h-1.5" />
                      </div>
                    </div>
                    <div className="col-span-1 flex items-center justify-center">
                      {hasVoted ? (
                        votedElections[electionType] === candidate.id ? (
                          <Badge className="bg-green-500">
                            <Check className="h-3 w-3" />
                          </Badge>
                        ) : null
                      ) : (
                        <RadioGroup value={selectedCandidate?.toString() || ""} className="flex">
                          <RadioGroupItem
                            value={candidate.id.toString()}
                            id={`list-candidate-${candidate.id}`}
                            onClick={(e) => e.stopPropagation()}
                            checked={selectedCandidate === candidate.id}
                            onChange={() => handleCandidateSelect(candidate.id)}
                          />
                        </RadioGroup>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {!hasVoted && (
              <div className="flex justify-end">
                <Button size="lg" disabled={!selectedCandidate || hasVoted || isSubmitting} onClick={handleConfirmVote}>
                  Confirm Vote Selection
                </Button>
              </div>
            )}

            {hasVoted && (
              <Alert className="bg-green-500/10 border-green-500/30 text-green-600">
                <BadgeCheck className="h-4 w-4" />
                <AlertTitle>Thank you for voting!</AlertTitle>
                <AlertDescription>
                  Your vote has been securely recorded. You can vote in other election categories if you haven't
                  already.
                </AlertDescription>
              </Alert>
            )}
          </TabsContent>

          <TabsContent value="results" className="mt-4">
            {/* Results Tab Content */}
            <Card>
              <CardHeader>
                <CardTitle>Live Results</CardTitle>
                <CardDescription>
                  Current vote counts for {ELECTION_TYPES[electionType as keyof typeof ELECTION_TYPES]}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {candidates.map((candidate) => (
                    <div key={candidate.id} className="space-y-1">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <div className="relative h-8 w-8 rounded-full overflow-hidden">
                            <Image
                              src={candidate.image || "/placeholder.svg"}
                              alt={candidate.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <span className="font-medium">{candidate.name}</span>
                            <span className="ml-2 text-sm text-muted-foreground">({candidate.party})</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="font-medium">{candidate.votes.toLocaleString()} votes</span>
                          <span className="ml-2 text-sm text-muted-foreground">({candidate.percentage}%)</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Progress value={candidate.percentage} className="h-2.5" indicatorColor={candidate.color} />
                        {votedElections[electionType] === candidate.id && (
                          <Badge className="bg-green-500 text-xs">
                            <Check className="mr-1 h-3 w-3" /> Your Vote
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" asChild>
                  <Link href="/results">
                    View Detailed Results
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Voting Instructions */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>How to Vote</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="list-decimal list-inside space-y-2">
              <li>Select an election type from the buttons above</li>
              <li>Choose your preferred candidate by clicking on their card or selecting the radio button</li>
              <li>Click on the "Confirm Vote Selection" button to proceed</li>
              <li>Review your selection in the confirmation dialog</li>
              <li>Confirm your vote to cast it securely</li>
            </ol>
          </CardContent>
        </Card>

        {/* Other Elections */}
        <h2 className="text-xl font-bold mt-8 mb-4">Other Elections</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.entries(ELECTION_TYPES)
            .filter(([type]) => type !== electionType)
            .map(([type, title]) => (
              <Card key={type} className="hover:shadow-md transition-all duration-300">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{title}</CardTitle>
                </CardHeader>
                <CardContent className="pb-2">
                  <p className="text-sm text-muted-foreground">
                    {votedElections[type]
                      ? "You have already cast your vote in this election."
                      : "You haven't voted in this election yet."}
                  </p>
                </CardContent>
                <CardFooter>
                  <Button variant={votedElections[type] ? "outline" : "default"} size="sm" asChild>
                    <Link href={`/vote?type=${type}`}>
                      {votedElections[type] ? (
                        <>
                          <Eye className="mr-2 h-4 w-4" />
                          View Results
                        </>
                      ) : (
                        <>
                          Vote Now
                          <ChevronRight className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
        </div>
      </main>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Your Vote</DialogTitle>
            <DialogDescription>
              Please review your selection carefully. Once submitted, your vote cannot be changed.
            </DialogDescription>
          </DialogHeader>
          {selectedCandidate && (
            <div className="flex flex-col items-center justify-center p-4">
              <div className="relative h-24 w-24 overflow-hidden rounded-full border-2 border-primary mb-4">
                <Image
                  src={candidates.find((c) => c.id === selectedCandidate)?.image || "/placeholder.svg"}
                  alt="Selected candidate"
                  fill
                  className="object-cover"
                />
              </div>
              <h3 className="text-xl font-bold mb-1">{candidates.find((c) => c.id === selectedCandidate)?.name}</h3>
              <div className="flex items-center gap-2 mb-4">
                <Badge
                  variant="outline"
                  style={{
                    backgroundColor: `${candidates.find((c) => c.id === selectedCandidate)?.color}20`,
                    color: candidates.find((c) => c.id === selectedCandidate)?.color,
                    borderColor: `${candidates.find((c) => c.id === selectedCandidate)?.color}40`,
                  }}
                >
                  {candidates.find((c) => c.id === selectedCandidate)?.party}
                </Badge>
              </div>
              <p className="text-center text-muted-foreground mb-4">
                You are about to cast your vote for this candidate in the{" "}
                {ELECTION_TYPES[electionType as keyof typeof ELECTION_TYPES]}.
              </p>
              <Alert variant="warning" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Important</AlertTitle>
                <AlertDescription>Your vote is final and cannot be changed after submission.</AlertDescription>
              </Alert>
            </div>
          )}
          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>
              Go Back
            </Button>
            <Button onClick={submitVote} disabled={isSubmitting} className="relative">
              {isSubmitting ? "Processing..." : "Confirm and Cast Vote"}
              {isSubmitting && (
                <div className="absolute inset-0 flex items-center justify-center bg-primary/80 rounded-md">
                  <svg
                    className="animate-spin h-5 w-5 text-primary-foreground"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                </div>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Success Dialog */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-green-600 flex items-center justify-center gap-2">
              <BadgeCheck className="h-6 w-6" />
              Vote Successfully Cast
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center py-6">
            <div className="relative h-24 w-24 overflow-hidden rounded-full border-2 border-green-500 mb-4">
              <Image
                src={candidates.find((c) => c.id === selectedCandidate)?.image || "/placeholder.svg"}
                alt="Selected candidate"
                fill
                className="object-cover"
              />
            </div>
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-4">
              <BadgeCheck className="h-10 w-10 text-green-600" />
            </div>
            <h3 className="text-xl font-bold mb-2">Thank You for Voting!</h3>
            <p className="text-center text-muted-foreground mb-4">
              Your vote has been securely recorded and will be counted in the final tally.
            </p>
            <div className="text-center space-y-1 mb-4">
              <p className="font-medium">You voted for:</p>
              <p className="text-lg font-bold">{candidates.find((c) => c.id === selectedCandidate)?.name}</p>
              <Badge
                className="mt-1"
                style={{
                  backgroundColor: `${candidates.find((c) => c.id === selectedCandidate)?.color}20`,
                  color: candidates.find((c) => c.id === selectedCandidate)?.color,
                  borderColor: `${candidates.find((c) => c.id === selectedCandidate)?.color}40`,
                }}
              >
                {candidates.find((c) => c.id === selectedCandidate)?.party}
              </Badge>
            </div>
          </div>
          <DialogFooter className="flex flex-col gap-2">
            <Button onClick={() => setShowSuccessDialog(false)}>Close</Button>
            <Button variant="outline" asChild>
              <Link href="/results">
                View Live Results
                <BarChart3 className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

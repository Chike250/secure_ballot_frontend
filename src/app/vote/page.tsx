"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useSearchParams, useRouter } from "next/navigation"
import { Check, ArrowLeft, BadgeCheck, AlertCircle, Info, Eye, Shield, BarChart3, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Navbar } from "@/components/navbar"
import { useAuthStore, useUIStore } from "@/store/useStore"
import { useVote } from "@/hooks/useVote"
import { useElectionData } from "@/hooks/useElectionData"

// Election types
const ELECTION_TYPES = {
  presidential: "Presidential Election",
  gubernatorial: "Gubernatorial Election",
  "house-of-reps": "House of Representatives Election",
  senatorial: "Senatorial Election",
}

export default function VotePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { isAuthenticated, user } = useAuthStore()
  const { isLoading, error, setError } = useUIStore()

  const initialElectionType = searchParams.get("type") || "presidential"
  const [electionType, setElectionType] = useState(initialElectionType)

  const {
    votingStatus,
    eligibility,
    votedElections,
    loadElectionData: loadVotePrereqs,
    castVote,
  } = useVote()

  const {
    currentElectionTypeKey,
    elections: electionList,
    currentElectionDetails: electionDetails,
    candidates,
    electionResults,
    fetchElectionDetailsAndCandidates,
    fetchResults,
    ELECTION_TYPES_MAP
  } = useElectionData(initialElectionType)

  const [selectedCandidate, setSelectedCandidate] = useState<number | string | null>(null)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [showSuccessDialog, setShowSuccessDialog] = useState(false)
  const [viewMode, setViewMode] = useState<"card" | "list">("card")
  const [showPartyInfo, setShowPartyInfo] = useState(false)
  const [activeTab, setActiveTab] = useState("vote")

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login?from=/vote")
    }
  }, [isAuthenticated, router])

  useEffect(() => {
    if (isAuthenticated && electionType) {
      loadVotePrereqs(electionType)
      fetchElectionDetailsAndCandidates(electionType)
      setSelectedCandidate(null)
      if (activeTab === 'results') {
        fetchResults(electionType)
      }
    }
  }, [electionType, isAuthenticated, loadVotePrereqs, fetchElectionDetailsAndCandidates, fetchResults, activeTab])

  useEffect(() => {
    if (activeTab === 'results' && electionType) {
      fetchResults(electionType)
    }
  }, [activeTab, electionType, fetchResults])

  const handleCandidateSelect = (candidateId: number | string) => {
    if (votingStatus?.hasVoted) {
      setError("You have already voted in this election.")
      return
    }
    if (!eligibility?.isEligible) {
      setError(eligibility?.reason || "You are not eligible to vote in this election.")
      return
    }

    setSelectedCandidate(candidateId)
    setShowConfirmDialog(true)
    setError(null)
  }

  const handleConfirmVote = async () => {
    if (!selectedCandidate) {
      setError("No candidate selected.")
      return
    }
    setShowConfirmDialog(false)
    
    const success = await castVote(electionType, selectedCandidate)

    if (success) {
      setShowSuccessDialog(true)
    }
  }

  const changeElectionType = (type: string) => {
    setElectionType(type)
    router.push(`/vote?type=${type}`, { scroll: false })
  }

  const handleTabChange = (value: string) => {
    setActiveTab(value)
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading or redirecting...</p>
      </div>
    );
  }

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
              {electionDetails?.electionName || ELECTION_TYPES[electionType as keyof typeof ELECTION_TYPES] || "Election"}
            </h1>
            <p className="text-muted-foreground">Cast your vote securely and confidentially</p>
          </div>
          {votingStatus?.hasVoted && (
            <Badge variant="secondary" className="flex items-center gap-1 px-3 py-1.5">
              <BadgeCheck className="h-4 w-4 text-green-500" />
              <span>Vote Already Cast</span>
            </Badge>
          )}
        </div>

        <Alert className="mb-6">
          <Shield className="h-4 w-4" />
          <AlertTitle>Secure Voting Environment</AlertTitle>
          <AlertDescription>
            Your vote is encrypted and anonymous. No one can link your identity to your voting choice.
          </AlertDescription>
        </Alert>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Tabs value={activeTab} onValueChange={handleTabChange} className="mb-6">
          <TabsList>
            <TabsTrigger value="vote">Vote</TabsTrigger>
            <TabsTrigger value="results">Live Results</TabsTrigger>
          </TabsList>

          <TabsContent value="vote" className="mt-4">
            <div className="mb-4 flex flex-wrap gap-3">
              {Object.entries(ELECTION_TYPES).map(([type, title]) => (
                <Button
                  key={type}
                  variant={electionType === type ? "default" : "outline"}
                  size="sm"
                  onClick={() => changeElectionType(type)}
                  className="flex items-center gap-2"
                  disabled={isLoading && electionType === type}
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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {isLoading ? (
                    Array.from({ length: 3 }).map((_, index) => (
                      <Card key={index} className="animate-pulse">
                        <div className="h-32 bg-muted rounded-t-lg"></div>
                        <CardHeader className="pb-2">
                          <div className="h-5 w-3/4 bg-muted rounded mb-2"></div>
                          <div className="h-4 w-1/2 bg-muted rounded"></div>
                        </CardHeader>
                        <CardContent className="pb-2 space-y-2">
                          <div className="h-4 w-full bg-muted rounded"></div>
                          <div className="h-4 w-full bg-muted rounded"></div>
                        </CardContent>
                        <CardFooter>
                          <div className="h-8 w-full bg-muted rounded"></div>
                        </CardFooter>
                      </Card>
                    ))
                  ) : candidates.map((candidate) => (
                  <Card
                    key={candidate.id}
                    className={`overflow-hidden transition-all duration-300 hover:shadow-lg ${
                      selectedCandidate === candidate.id ? "ring-2 ring-primary" : ""
                    } ${
                      votingStatus?.hasVoted ? "opacity-80" : "cursor-pointer"
                    }`}
                    onClick={() => !votingStatus?.hasVoted && handleCandidateSelect(candidate.id)}
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
                        {votingStatus?.hasVoted ? (
                          votingStatus?.candidateId === candidate.id ? (
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
                                  disabled={!eligibility?.isEligible}
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
              <div className="rounded-lg border overflow-hidden mb-6">
                <div className="bg-muted p-3 grid grid-cols-12 gap-2 font-medium">
                  <div className="col-span-1"></div>
                  <div className="col-span-3">Candidate</div>
                  <div className="col-span-2">Party</div>
                  <div className="col-span-3">Key Policies</div>
                  <div className="col-span-2">Support</div>
                  <div className="col-span-1"></div>
                </div>
                {isLoading ? (
                   Array.from({ length: 3 }).map((_, index) => (
                      <div key={index} className="p-3 grid grid-cols-12 gap-2 border-t animate-pulse">
                        <div className="col-span-1 flex items-center justify-center"><div className="h-10 w-10 bg-muted rounded-full"></div></div>
                        <div className="col-span-3 flex flex-col justify-center space-y-1"><div className="h-4 w-3/4 bg-muted rounded"></div><div className="h-3 w-1/2 bg-muted rounded"></div></div>
                        <div className="col-span-2 flex items-center"><div className="h-6 w-16 bg-muted rounded"></div></div>
                        <div className="col-span-3 flex items-center"><div className="h-4 w-full bg-muted rounded"></div></div>
                        <div className="col-span-2 flex items-center"><div className="h-4 w-full bg-muted rounded"></div></div>
                        <div className="col-span-1 flex items-center justify-center"><div className="h-5 w-5 bg-muted rounded-full"></div></div>
                      </div>
                   ))
                  ) : candidates.map((candidate) => (
                  <div
                    key={candidate.id}
                    className={`p-3 grid grid-cols-12 gap-2 border-t hover:bg-muted/30 ${
                      selectedCandidate === candidate.id ? "bg-primary/5" : ""
                    } ${
                      votingStatus?.hasVoted ? "opacity-90" : "cursor-pointer"
                    }`}
                    onClick={() => !votingStatus?.hasVoted && handleCandidateSelect(candidate.id)}
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
                        {candidate.bio?.split(" ").slice(0, 3).join(" ") || "No bio available"}...
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
                          <span>{(candidate.votes || 0).toLocaleString()}</span>
                          <span>{candidate.percentage || 0}%</span>
                        </div>
                        <Progress value={candidate.percentage || 0} className="h-1.5" />
                      </div>
                    </div>
                    <div className="col-span-1 flex items-center justify-center">
                      {votingStatus?.hasVoted ? (
                        votingStatus?.candidateId === candidate.id ? (
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
                            disabled={!eligibility?.isEligible}
                          />
                        </RadioGroup>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {!votingStatus?.hasVoted && (
              <div className="flex justify-end">
                <Button size="lg" disabled={!selectedCandidate || !eligibility?.isEligible || isLoading} onClick={handleConfirmVote}>
                  Confirm Vote Selection
                </Button>
              </div>
            )}

            {votingStatus?.hasVoted && (
              <Alert className="bg-green-500/10 border-green-500/30 text-green-600">
                <BadgeCheck className="h-4 w-4" />
                <AlertTitle>Thank you for voting!</AlertTitle>
                <AlertDescription>
                  Your vote has been securely recorded and will be counted in the final tally.
                </AlertDescription>
              </Alert>
            )}
          </TabsContent>

          <TabsContent value="results" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Live Results</CardTitle>
                <CardDescription>
                  Current vote counts for {electionDetails?.electionName || ELECTION_TYPES[electionType as keyof typeof ELECTION_TYPES] || "Election"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading && !electionResults ? (
                    <div className="space-y-4">
                        {Array.from({ length: 3 }).map((_, index) => (
                            <div key={index} className="space-y-1 animate-pulse">
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-2">
                                        <div className="h-8 w-8 rounded-full bg-muted"></div>
                                        <div className="h-5 w-40 bg-muted rounded"></div>
                                    </div>
                                    <div className="h-5 w-24 bg-muted rounded"></div>
                                </div>
                                <div className="h-2.5 w-full bg-muted rounded"></div>
                            </div>
                        ))}
                    </div>
                 ) : electionResults && electionResults.candidates.length > 0 ? (
                  <div className="space-y-4">
                    {electionResults.candidates.map((resultCandidate) => (
                      <div key={resultCandidate.id} className="space-y-1">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <div className="relative h-8 w-8 rounded-full overflow-hidden">
                              <Image
                                src={resultCandidate.image || "/placeholder.svg"}
                                alt={resultCandidate.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div>
                              <span className="font-medium">{resultCandidate.name}</span>
                              <span className="ml-2 text-sm text-muted-foreground">({resultCandidate.party})</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="font-medium">{resultCandidate.votes.toLocaleString()} votes</span>
                            <span className="ml-2 text-sm text-muted-foreground">({resultCandidate.percentage}%)</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Progress value={resultCandidate.percentage} className="h-2.5" indicatorColor={resultCandidate.color} />
                          {votingStatus?.hasVoted && votingStatus?.candidateId === resultCandidate.id && (
                            <Badge className="bg-green-500 text-xs">
                              <Check className="mr-1 h-3 w-3" /> Your Vote
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                 ) : (
                    <p className="text-muted-foreground">No results data available for this election yet.</p>
                 )}
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

      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Your Vote</DialogTitle>
            <DialogDescription>
              Please review your selection carefully. Once submitted, your vote cannot be changed.
            </DialogDescription>
          </DialogHeader>
          {selectedCandidate && candidates.length > 0 && (
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
                {electionDetails?.electionName || ELECTION_TYPES[electionType as keyof typeof ELECTION_TYPES] || "Election"}.
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
            <Button onClick={handleConfirmVote} disabled={isLoading} className="relative">
              {isLoading ? "Processing..." : "Confirm and Cast Vote"}
              {isLoading && (
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

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Check,
  ArrowLeft,
  BadgeCheck,
  AlertCircle,
  Info,
  Eye,
  Shield,
  BarChart3,
  ChevronRight,
  MapPin,
  User,
  Vote as VoteIcon,
  Clock,
  RefreshCw,
  TrendingUp,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Navbar } from "@/components/navbar";
import { useAuthStore, useUIStore } from "@/store/useStore";
import { useVote } from "@/hooks/useVote";
import { useElectionData } from "@/hooks/useElectionData";
import { useVoterProfile } from "@/hooks/useVoterProfile";
import { Switch } from "@/components/ui/switch";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { ThemeToggle } from "@/components/theme-toggle";

// Election types mapping
const ELECTION_TYPES_MAP: Record<string, string> = {
  presidential: "Presidential Election",
  gubernatorial: "Gubernatorial Election",
  houseOfReps: "House of Representatives Election",
  senatorial: "Senatorial Election",
  local: "Local Election",
};

export default function VotePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated, user } = useAuthStore();
  const { isLoading, error, setError } = useUIStore();

  const initialElectionType = searchParams.get("type") || "presidential";
  const [electionType, setElectionType] = useState(initialElectionType);

  // Helper function to generate initials from candidate name
  const getInitials = (name: string | undefined | null) => {
    if (!name || typeof name !== "string") {
      return "??"; // Fallback for missing names
    }
    return name
      .trim()
      .split(" ")
      .filter((word) => word.length > 0) // Filter out empty strings
      .map((word) => word.charAt(0).toUpperCase())
      .slice(0, 2) // Take only first 2 initials
      .join("");
  };

  // Use the voting hook
  const {
    electionDetails,
    candidates,
    votingStatus,
    eligibility,
    votedElections,
    loadElectionData,
    castVote,
  } = useVote();

  // Use election data hook for getting elections list
  const {
    elections: electionList,
    results: electionResults,
    fetchElections,
    fetchResults,
  } = useElectionData();

  // Use voter profile hook
  const { getProfile, getPollingUnit, verifyVote } = useVoterProfile();

  const [selectedCandidate, setSelectedCandidate] = useState<
    number | string | null
  >(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [viewMode, setViewMode] = useState<"card" | "list">("card");
  const [showPartyInfo, setShowPartyInfo] = useState(false);
  const [activeTab, setActiveTab] = useState("vote");
  const [receiptCode, setReceiptCode] = useState<string>("");
  const [currentElection, setCurrentElection] = useState<any>(null);
  const [voterProfile, setVoterProfile] = useState<any>(null);
  const [pollingUnit, setPollingUnit] = useState<any>(null);
  const [votedCandidate, setVotedCandidate] = useState<any>(null);

  // Helper function to safely find candidate
  const findCandidate = (candidateId: number | string | null) => {
    if (!candidateId || !candidates) return null;
    return candidates.find((c) => c.id === candidateId);
  };

  // Get available election types based on actual elections from API
  const getAvailableElectionTypes = () => {
    if (!electionList || electionList.length === 0) {
      return {};
    }

    const availableTypes: Record<string, string> = {};

    electionList.forEach((election) => {
      const eType = (election as any).electionType || election.type;
      if (!eType) return;

      const normalizedType = eType.toLowerCase();
      // Map API election types to our type keys
      if (
        normalizedType.includes("president") ||
        normalizedType.includes("presidential")
      ) {
        availableTypes.presidential = ELECTION_TYPES_MAP.presidential;
      } else if (
        normalizedType.includes("governor") ||
        normalizedType.includes("gubernatorial")
      ) {
        availableTypes.gubernatorial = ELECTION_TYPES_MAP.gubernatorial;
      } else if (
        normalizedType.includes("house") ||
        normalizedType.includes("representative") ||
        normalizedType.includes("houseofreps")
      ) {
        availableTypes.houseOfReps = ELECTION_TYPES_MAP.houseOfReps;
      } else if (
        normalizedType.includes("senate") ||
        normalizedType.includes("senator") ||
        normalizedType.includes("senatorial")
      ) {
        availableTypes.senatorial = ELECTION_TYPES_MAP.senatorial;
      } else if (
        normalizedType.includes("local") ||
        normalizedType.includes("localgovernment")
      ) {
        availableTypes.local = ELECTION_TYPES_MAP.local;
      }
    });

    return availableTypes;
  };

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login?from=/vote");
    }
  }, [isAuthenticated, router]);

  // Load voter profile and polling unit data
  useEffect(() => {
    const loadVoterData = async () => {
      if (isAuthenticated) {
        try {
          const profileData = await getProfile();
          setVoterProfile(profileData);

          const pollingData = await getPollingUnit();
          setPollingUnit(pollingData);
        } catch (err) {
          console.error("Failed to load voter data:", err);
        }
      }
    };

    loadVoterData();
  }, [isAuthenticated, getProfile, getPollingUnit]);

  // Load elections list on mount
  useEffect(() => {
    if (isAuthenticated) {
      fetchElections();
    }
  }, [isAuthenticated, fetchElections]);

  // Load election data when election type changes
  useEffect(() => {
    if (isAuthenticated && electionType && electionList.length > 0) {
      electionList.forEach((election: any, index) => {});

      // Find election by type
      const election = electionList.find((e: any) => {
        const apiElectionType = e.electionType?.toLowerCase(); // API uses electionType
        const apiElectionName = e.electionName?.toLowerCase(); // API uses electionName
        const searchType = electionType.toLowerCase();

        return (
          apiElectionType === searchType ||
          apiElectionType?.includes(searchType) ||
          apiElectionName?.includes(searchType) ||
          e.description?.toLowerCase().includes(searchType)
        );
      });

      if (election) {
        setCurrentElection(election);
        loadElectionData(election.id);
        setSelectedCandidate(null);

        // Load results if viewing results tab
        if (activeTab === "results") {
          fetchResults(election.id);
        }
      } else {
      }
    }
  }, [
    electionType,
    isAuthenticated,
    loadElectionData,
    activeTab,
    electionList,
    fetchResults,
  ]);

  // Load results when switching to results tab
  useEffect(() => {
    if (activeTab === "results" && currentElection) {
      fetchResults(currentElection.id);
    }
  }, [activeTab, currentElection, fetchResults]);

  const handleCandidateSelect = (candidateId: number | string) => {
    if (votingStatus?.hasVoted) {
      setError("You have already voted in this election.");
      return;
    }
    if (!eligibility?.isEligible) {
      setError(
        eligibility?.reason || "You are not eligible to vote in this election."
      );
      return;
    }

    setSelectedCandidate(candidateId);
    setShowConfirmDialog(true);
    setError(null);
  };

  const handleFinalVoteSubmit = async () => {
    if (!selectedCandidate || !currentElection) {
      setError("No candidate or election selected.");
      return;
    }

    setShowConfirmDialog(false);

    try {
      // Store the voted candidate info before clearing selection
      const candidateInfo = findCandidate(selectedCandidate);

      const result = await castVote(currentElection.id, selectedCandidate);

      if (result.success) {
        // Store the voted candidate for the success dialog
        setVotedCandidate(candidateInfo);

        // Handle different receipt code response structures
        const receiptCode =
          result.receiptCode || (result as any).data?.receiptCode;
        if (receiptCode) {
          setReceiptCode(receiptCode);
        }

        setShowSuccessDialog(true);
        // Clear the selected candidate after successful vote
        setSelectedCandidate(null);
      }
    } catch (err) {
      console.error("Vote casting failed:", err);
      setError("Failed to cast vote. Please try again.");
    }
  };

  const changeElectionType = (type: string) => {
    setElectionType(type);
    router.push(`/vote?type=${type}`, { scroll: false });
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  const handleVerifyVote = async () => {
    if (!receiptCode) {
      setError("No receipt code available to verify.");
      return;
    }

    try {
      const verification = await verifyVote(receiptCode);
      alert(`Vote verified: ${verification.isValid ? "Valid" : "Invalid"}`);
    } catch (err) {
      console.error("Failed to verify vote:", err);
      setError("Failed to verify your vote. Please try again later.");
    }
  };

  if (!isAuthenticated || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading or redirecting...</p>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <Sidebar variant="inset">
          <SidebarHeader>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton size="lg" asChild>
                  <Link href="/dashboard">
                    <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                      <VoteIcon className="size-4" />
                    </div>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">
                        Voting Platform
                      </span>
                      <span className="truncate text-xs">Cast Your Vote</span>
                    </div>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/dashboard">
                    <BarChart3 className="size-4" />
                    <span>Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive>
                  <Link href="/vote">
                    <VoteIcon className="size-4" />
                    <span>Vote</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/results">
                    <TrendingUp className="size-4" />
                    <span>Results</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/dashboard/profile">
                    <User className="size-4" />
                    <span>Profile</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/dashboard/settings">
                    <Shield className="size-4" />
                    <span>Settings</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <div className="flex items-center gap-2 px-2 py-1">
                    <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-muted">
                      <User className="size-4" />
                    </div>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">
                        {voterProfile?.fullName || user?.fullName || "User"}
                      </span>
                      <span className="truncate text-xs">
                        {voterProfile?.email || user?.email}
                      </span>
                    </div>
                  </div>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>

        <div className="flex-1">
          <header className="sticky top-0 z-50 flex h-14 items-center justify-between border-b bg-background px-2 md:px-6">
            <div className="flex items-center gap-2 min-w-0">
              <SidebarTrigger />
              <h1 className="truncate text-sm font-semibold md:text-xl">
                Vote
              </h1>
            </div>

            <div className="flex items-center gap-2">
              <ThemeToggle />
            </div>
          </header>

          <main className="flex-1 p-4 md:p-6">
            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
              <div>
                <p className="text-sm md:text-base text-muted-foreground">
                  Cast your vote securely for the{" "}
                  {ELECTION_TYPES_MAP[electionType] || "Election"}
                </p>
              </div>

              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-2">
                <Badge
                  variant="outline"
                  className="bg-green-500/10 text-green-500 border-green-500/20 w-fit"
                >
                  <User className="mr-1 h-3 w-3" />
                  <span className="truncate">
                    {voterProfile?.fullName || user?.fullName}
                  </span>
                </Badge>
                {pollingUnit && (
                  <Badge variant="outline" className="w-fit">
                    <MapPin className="mr-1 h-3 w-3" />
                    <span className="truncate">
                      {pollingUnit.pollingUnitName}
                    </span>
                  </Badge>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex lg:flex-wrap gap-2 mb-6">
              {Object.entries(getAvailableElectionTypes()).length > 0 ? (
                Object.entries(getAvailableElectionTypes()).map(
                  ([type, title]) => (
                    <Button
                      key={type}
                      variant={electionType === type ? "default" : "outline"}
                      onClick={() => changeElectionType(type)}
                      className="relative text-sm"
                      size="sm"
                    >
                      <span className="truncate">{title}</span>
                      {votedElections[type] && (
                        <Badge className="absolute -top-2 -right-2 bg-green-500 text-xs h-5 w-5 p-0 flex items-center justify-center">
                          <Check className="h-3 w-3" />
                        </Badge>
                      )}
                    </Button>
                  )
                )
              ) : (
                <div className="col-span-full text-center py-4">
                  <p className="text-muted-foreground">
                    {isLoading
                      ? "Loading elections..."
                      : "No elections available at this time."}
                  </p>
                </div>
              )}
            </div>

            <Tabs
              value={activeTab}
              onValueChange={handleTabChange}
              className="space-y-6"
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="vote">Cast Vote</TabsTrigger>
                <TabsTrigger value="results">Live Results</TabsTrigger>
              </TabsList>

              <TabsContent value="vote" className="mt-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center mb-4">
                  <div>
                    <h2 className="text-lg sm:text-xl font-semibold">
                      {electionDetails?.electionName ||
                        ELECTION_TYPES_MAP[electionType] ||
                        "Election"}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Select your preferred candidate
                    </p>
                  </div>
                  <div className="flex items-center gap-2 w-fit">
                    <Switch
                      checked={viewMode === "card"}
                      onCheckedChange={(checked) =>
                        setViewMode(checked ? "card" : "list")
                      }
                    />
                    <span className="text-sm whitespace-nowrap">Card View</span>
                  </div>
                </div>

                {!eligibility?.isEligible && eligibility?.reason && (
                  <Alert variant="warning" className="mb-6">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Voting Restriction</AlertTitle>
                    <AlertDescription>{eligibility.reason}</AlertDescription>
                  </Alert>
                )}

                {viewMode === "card" ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                    {isLoading && !candidates?.length
                      ? Array.from({ length: 6 }).map((_, index) => (
                          <Card key={index} className="animate-pulse">
                            <CardHeader>
                              <div className="flex items-center space-x-4">
                                <div className="h-16 w-16 bg-muted rounded-full"></div>
                                <div className="space-y-2">
                                  <div className="h-5 w-32 bg-muted rounded"></div>
                                  <div className="h-4 w-20 bg-muted rounded"></div>
                                </div>
                              </div>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-2">
                                <div className="h-4 w-full bg-muted rounded"></div>
                                <div className="h-4 w-3/4 bg-muted rounded"></div>
                              </div>
                            </CardContent>
                          </Card>
                        ))
                      : candidates?.map((candidate) => (
                          <Card
                            key={candidate.id}
                            className={`cursor-pointer transition-all duration-300 hover:shadow-lg border-2 ${
                              selectedCandidate === candidate.id
                                ? "border-primary shadow-lg"
                                : "border-border hover:border-primary/50"
                            } ${votingStatus?.hasVoted ? "opacity-90" : ""}`}
                            onClick={() =>
                              !votingStatus?.hasVoted &&
                              handleCandidateSelect(candidate.id)
                            }
                          >
                            <CardHeader>
                              <div className="flex items-center space-x-4">
                                <div className="relative h-16 w-16 rounded-full overflow-hidden border-2 border-primary/20 flex items-center justify-center">
                                  {candidate.image ? (
                                    <Image
                                      src={candidate.image}
                                      alt={candidate.name}
                                      fill
                                      className="object-cover"
                                    />
                                  ) : (
                                    <div
                                      className="w-full h-full flex items-center justify-center text-white font-semibold text-lg"
                                      style={{
                                        backgroundColor:
                                          candidate.color || "#6B7280",
                                      }}
                                    >
                                      {getInitials(candidate.name)}
                                    </div>
                                  )}
                                </div>
                                <div className="flex-1">
                                  <CardTitle className="text-lg">
                                    {candidate.name || "Unknown Candidate"}
                                  </CardTitle>
                                  <CardDescription className="flex items-center gap-2">
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
                                  </CardDescription>
                                </div>
                              </div>
                            </CardHeader>
                            <CardContent>
                              <p className="text-sm text-muted-foreground line-clamp-3 mb-3">
                                {candidate.manifesto ||
                                  candidate.bio ||
                                  "No manifesto available"}
                              </p>
                              {electionResults?.candidates && (
                                <div className="space-y-1">
                                  <div className="flex justify-between text-xs">
                                    <span>
                                      {(candidate.votes || 0).toLocaleString()}{" "}
                                      votes
                                    </span>
                                    <span>{candidate.percentage || 0}%</span>
                                  </div>
                                  <Progress
                                    value={candidate.percentage || 0}
                                    className="h-1.5"
                                  />
                                </div>
                              )}
                            </CardContent>
                            <CardFooter>
                              <div className="flex w-full justify-between items-center">
                                {votingStatus?.hasVoted ? (
                                  votingStatus?.candidateId === candidate.id ? (
                                    <Badge className="bg-green-500">
                                      <Check className="mr-1 h-3 w-3" />
                                      Your Vote
                                    </Badge>
                                  ) : (
                                    <div></div>
                                  )
                                ) : (
                                  <div
                                    className="flex items-center"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <RadioGroup
                                      value={
                                        selectedCandidate?.toString() || ""
                                      }
                                      onValueChange={(value) => {
                                        handleCandidateSelect(value);
                                      }}
                                      className="flex"
                                    >
                                      <div className="flex items-center space-x-2">
                                        <RadioGroupItem
                                          value={candidate.id.toString()}
                                          id={`candidate-${candidate.id}`}
                                          disabled={!eligibility?.isEligible}
                                        />
                                        <Label
                                          htmlFor={`candidate-${candidate.id}`}
                                          className="cursor-pointer"
                                        >
                                          Select
                                        </Label>
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
                    {isLoading
                      ? Array.from({ length: 3 }).map((_, index) => (
                          <div
                            key={index}
                            className="p-3 grid grid-cols-12 gap-2 border-t animate-pulse"
                          >
                            <div className="col-span-1 flex items-center justify-center">
                              <div className="h-10 w-10 bg-muted rounded-full"></div>
                            </div>
                            <div className="col-span-3 flex flex-col justify-center space-y-1">
                              <div className="h-4 w-3/4 bg-muted rounded"></div>
                              <div className="h-3 w-1/2 bg-muted rounded"></div>
                            </div>
                            <div className="col-span-2 flex items-center">
                              <div className="h-6 w-16 bg-muted rounded"></div>
                            </div>
                            <div className="col-span-3 flex items-center">
                              <div className="h-4 w-full bg-muted rounded"></div>
                            </div>
                            <div className="col-span-2 flex items-center">
                              <div className="h-4 w-full bg-muted rounded"></div>
                            </div>
                            <div className="col-span-1 flex items-center justify-center">
                              <div className="h-5 w-5 bg-muted rounded-full"></div>
                            </div>
                          </div>
                        ))
                      : (candidates || []).map((candidate) => (
                          <div
                            key={candidate.id}
                            className={`p-3 grid grid-cols-12 gap-2 border-t hover:bg-muted/30 ${
                              selectedCandidate === candidate.id
                                ? "bg-primary/5"
                                : ""
                            } ${
                              votingStatus?.hasVoted
                                ? "opacity-90"
                                : "cursor-pointer"
                            }`}
                            onClick={() =>
                              !votingStatus?.hasVoted &&
                              handleCandidateSelect(candidate.id)
                            }
                          >
                            <div className="col-span-1 flex items-center justify-center">
                              <div className="relative h-10 w-10 rounded-full overflow-hidden flex items-center justify-center">
                                {candidate.image ? (
                                  <Image
                                    src={candidate.image}
                                    alt={candidate.name}
                                    fill
                                    className="object-cover"
                                  />
                                ) : (
                                  <div
                                    className="w-full h-full flex items-center justify-center text-white font-semibold text-sm"
                                    style={{
                                      backgroundColor:
                                        candidate.color || "#6B7280",
                                    }}
                                  >
                                    {getInitials(candidate.name)}
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="col-span-3 flex flex-col justify-center">
                              <span className="font-medium">
                                {candidate.name || "Unknown Candidate"}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {candidate.bio
                                  ?.split(" ")
                                  .slice(0, 3)
                                  .join(" ") || "No bio available"}
                                ...
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
                              <span className="line-clamp-2">
                                {candidate.manifesto}
                              </span>
                            </div>
                            <div className="col-span-2 flex items-center">
                              <div className="w-full">
                                <div className="flex justify-between text-xs mb-1">
                                  <span>
                                    {(candidate.votes || 0).toLocaleString()}
                                  </span>
                                  <span>{candidate.percentage || 0}%</span>
                                </div>
                                <Progress
                                  value={candidate.percentage || 0}
                                  className="h-1.5"
                                />
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
                                <div onClick={(e) => e.stopPropagation()}>
                                  <RadioGroup
                                    value={selectedCandidate?.toString() || ""}
                                    onValueChange={(value) => {
                                      handleCandidateSelect(value);
                                    }}
                                    className="flex"
                                  >
                                    <RadioGroupItem
                                      value={candidate.id.toString()}
                                      id={`list-candidate-${candidate.id}`}
                                      disabled={!eligibility?.isEligible}
                                    />
                                  </RadioGroup>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                  </div>
                )}

                {!votingStatus?.hasVoted && (
                  <div className="flex justify-end">
                    <Button
                      size="lg"
                      disabled={
                        !selectedCandidate ||
                        !eligibility?.isEligible ||
                        isLoading
                      }
                      onClick={() => setShowConfirmDialog(true)}
                    >
                      Confirm Vote Selection
                    </Button>
                  </div>
                )}

                {votingStatus?.hasVoted && (
                  <Alert className="bg-green-500/10 border-green-500/30 text-green-600">
                    <BadgeCheck className="h-4 w-4" />
                    <AlertTitle>Thank you for voting!</AlertTitle>
                    <AlertDescription>
                      Your vote has been securely recorded and will be counted
                      in the final tally.
                    </AlertDescription>
                  </Alert>
                )}
              </TabsContent>

              <TabsContent value="results" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Live Results</CardTitle>
                    <CardDescription>
                      Current vote counts for{" "}
                      {electionDetails?.electionName ||
                        ELECTION_TYPES_MAP[electionType] ||
                        "Election"}
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
                    ) : electionResults &&
                      electionResults.candidates?.length > 0 ? (
                      <div className="space-y-4">
                        {electionResults.candidates.map((resultCandidate) => (
                          <div key={resultCandidate.id} className="space-y-1">
                            <div className="flex justify-between items-center">
                              <div className="flex items-center gap-2">
                                <div className="relative h-8 w-8 rounded-full overflow-hidden">
                                  <Image
                                    src={
                                      resultCandidate.image ||
                                      "/placeholder.svg"
                                    }
                                    alt={resultCandidate.name}
                                    fill
                                    className="object-cover"
                                  />
                                </div>
                                <div>
                                  <span className="font-medium">
                                    {resultCandidate.name}
                                  </span>
                                  <span className="ml-2 text-sm text-muted-foreground">
                                    ({resultCandidate.party})
                                  </span>
                                </div>
                              </div>
                              <div className="text-right">
                                <span className="font-medium">
                                  {(
                                    resultCandidate.votes || 0
                                  ).toLocaleString()}{" "}
                                  votes
                                </span>
                                <span className="ml-2 text-sm text-muted-foreground">
                                  ({resultCandidate.percentage}%)
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Progress
                                value={resultCandidate.percentage}
                                className="h-2.5"
                                indicatorColor={resultCandidate.color}
                              />
                              {votingStatus?.hasVoted &&
                                votingStatus?.candidateId ===
                                  resultCandidate.id && (
                                  <Badge className="bg-green-500 text-xs">
                                    <Check className="mr-1 h-3 w-3" /> Your Vote
                                  </Badge>
                                )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground">
                        No results data available for this election yet.
                      </p>
                    )}
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/results?type=${electionType}`}>
                        View Detailed Results
                        <BarChart3 className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
            </Tabs>

            {/* How to Vote Section */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>How to Vote</CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="list-decimal list-inside space-y-2">
                  <li>Select an election type from the buttons above</li>
                  <li>
                    Choose your preferred candidate by clicking on their card or
                    selecting the radio button
                  </li>
                  <li>
                    Click on the "Confirm Vote Selection" button to proceed
                  </li>
                  <li>Review your selection in the confirmation dialog</li>
                  <li>Confirm your vote to cast it securely</li>
                </ol>
              </CardContent>
            </Card>

            {/* Other Elections Section */}
            {Object.entries(getAvailableElectionTypes()).filter(
              ([type]) => type !== electionType
            ).length > 0 && (
              <>
                <h2 className="text-xl font-bold mt-8 mb-4">Other Elections</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {Object.entries(getAvailableElectionTypes())
                    .filter(([type]) => type !== electionType)
                    .map(([type, title]) => (
                      <Card
                        key={type}
                        className="hover:shadow-md transition-all duration-300"
                      >
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
                          <Button
                            variant={
                              votedElections[type] ? "outline" : "default"
                            }
                            size="sm"
                            asChild
                          >
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
              </>
            )}
          </main>
        </div>

        {/* Confirmation Dialog */}
        <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Confirm Your Vote</DialogTitle>
              <DialogDescription>
                Please review your selection carefully. Once submitted, your
                vote cannot be changed.
              </DialogDescription>
            </DialogHeader>
            {selectedCandidate && (candidates || []).length > 0 && (
              <div className="flex flex-col items-center justify-center p-4">
                <div className="relative h-24 w-24 overflow-hidden rounded-full border-2 border-primary mb-4 flex items-center justify-center">
                  {findCandidate(selectedCandidate)?.image ? (
                    <Image
                      src={findCandidate(selectedCandidate)?.image!}
                      alt="Selected candidate"
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div
                      className="w-full h-full flex items-center justify-center text-white font-semibold text-xl"
                      style={{
                        backgroundColor:
                          findCandidate(selectedCandidate)?.color || "#6B7280",
                      }}
                    >
                      {getInitials(findCandidate(selectedCandidate)?.name)}
                    </div>
                  )}
                </div>
                <h3 className="text-xl font-bold mb-1">
                  {findCandidate(selectedCandidate)?.name}
                </h3>
                <div className="flex items-center gap-2 mb-4">
                  <Badge
                    variant="outline"
                    style={{
                      backgroundColor: `${
                        findCandidate(selectedCandidate)?.color
                      }20`,
                      color: findCandidate(selectedCandidate)?.color,
                      borderColor: `${
                        findCandidate(selectedCandidate)?.color
                      }40`,
                    }}
                  >
                    {findCandidate(selectedCandidate)?.party}
                  </Badge>
                </div>
                <p className="text-center text-muted-foreground mb-4">
                  You are about to cast your vote for this candidate in the{" "}
                  {electionDetails?.electionName ||
                    ELECTION_TYPES_MAP[electionType] ||
                    "Election"}
                  .
                </p>
                <Alert variant="warning" className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Important</AlertTitle>
                  <AlertDescription>
                    Your vote is final and cannot be changed after submission.
                  </AlertDescription>
                </Alert>
              </div>
            )}
            <DialogFooter className="flex flex-col sm:flex-row gap-2">
              <Button
                variant="outline"
                onClick={() => setShowConfirmDialog(false)}
              >
                Go Back
              </Button>
              <Button
                onClick={handleFinalVoteSubmit}
                disabled={isLoading}
                className="relative"
              >
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
              <div className="relative h-24 w-24 overflow-hidden rounded-full border-2 border-green-500 mb-4 flex items-center justify-center">
                {votedCandidate?.image ? (
                  <Image
                    src={votedCandidate.image}
                    alt="Selected candidate"
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div
                    className="w-full h-full flex items-center justify-center text-white font-semibold text-xl"
                    style={{
                      backgroundColor: votedCandidate?.color || "#6B7280",
                    }}
                  >
                    {getInitials(votedCandidate?.name)}
                  </div>
                )}
              </div>
              <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-4">
                <BadgeCheck className="h-10 w-10 text-green-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Thank You for Voting!</h3>
              <p className="text-center text-muted-foreground mb-4">
                Your vote has been securely recorded and will be counted in the
                final tally.
              </p>
              <div className="text-center space-y-1 mb-4">
                <p className="font-medium">You voted for:</p>
                <p className="text-lg font-bold">{votedCandidate?.name}</p>
                <Badge
                  className="mt-1"
                  style={{
                    backgroundColor: `${votedCandidate?.color}20`,
                    color: votedCandidate?.color,
                    borderColor: `${votedCandidate?.color}40`,
                  }}
                >
                  {votedCandidate?.party}
                </Badge>
              </div>
              {receiptCode && (
                <div className="mt-4 p-3 bg-muted rounded-md w-full">
                  <p className="text-xs text-muted-foreground mb-1">
                    Your vote receipt code:
                  </p>
                  <p className="font-mono text-sm break-all">{receiptCode}</p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={handleVerifyVote}
                  >
                    Verify Vote
                  </Button>
                </div>
              )}
            </div>
            <DialogFooter className="flex flex-col gap-2">
              <Button onClick={() => setShowSuccessDialog(false)}>Close</Button>
              <Button variant="outline" asChild>
                <Link href={`/results?type=${electionType}`}>
                  View Live Results
                  <BarChart3 className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </SidebarProvider>
  );
}

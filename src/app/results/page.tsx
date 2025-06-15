"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import {
  BarChart3,
  ChevronDown,
  Home,
  LogOut,
  Map,
  Settings,
  User,
  Users,
  Info,
  Download,
  Share2,
  RefreshCw,
  AlertCircle,
  Vote,
  Check,
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ElectionCharts } from "@/components/election-charts";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useAuthStore, useUIStore } from "@/store/useStore";
import { useElectionData } from "@/hooks/useElectionData";
import { useResults } from "@/hooks/useResults";
import { resultsAPI } from "@/services/api";

// Election types
const ELECTION_TYPES = {
  presidential: "Presidential Election",
  gubernatorial: "Gubernatorial Election",
  "house-of-reps": "House of Representatives Election",
  senatorial: "Senatorial Election",
};

// Candidate data by election type
const candidatesByElection = {
  presidential: [
    {
      id: 1,
      name: "Bola Ahmed Tinubu",
      party: "APC",
      votes: 8500000,
      percentage: 35,
      image: "/placeholder.svg?height=80&width=80",
      color: "#64748b",
    },
    {
      id: 2,
      name: "Atiku Abubakar",
      party: "PDP",
      votes: 6900000,
      percentage: 28,
      image: "/placeholder.svg?height=80&width=80",
      color: "#ef4444",
    },
    {
      id: 3,
      name: "Peter Obi",
      party: "LP",
      votes: 6100000,
      percentage: 25,
      image: "/placeholder.svg?height=80&width=80",
      color: "#22c55e",
    },
    {
      id: 4,
      name: "Rabiu Kwankwaso",
      party: "NNPP",
      votes: 1500000,
      percentage: 7,
      image: "/placeholder.svg?height=80&width=80",
      color: "#3b82f6",
    },
    {
      id: 5,
      name: "Others",
      party: "Various",
      votes: 1000000,
      percentage: 5,
      image: "/placeholder.svg?height=80&width=80",
      color: "#a855f7",
    },
  ],
  gubernatorial: [
    {
      id: 1,
      name: "Babajide Sanwo-Olu",
      party: "APC",
      votes: 950000,
      percentage: 42,
      image: "/placeholder.svg?height=80&width=80",
      color: "#64748b",
    },
    {
      id: 2,
      name: "Olajide Adediran (Jandor)",
      party: "PDP",
      votes: 580000,
      percentage: 26,
      image: "/placeholder.svg?height=80&width=80",
      color: "#ef4444",
    },
    {
      id: 3,
      name: "Gbadebo Rhodes-Vivour",
      party: "LP",
      votes: 520000,
      percentage: 23,
      image: "/placeholder.svg?height=80&width=80",
      color: "#22c55e",
    },
    {
      id: 4,
      name: "Others",
      party: "Various",
      votes: 200000,
      percentage: 9,
      image: "/placeholder.svg?height=80&width=80",
      color: "#a855f7",
    },
  ],
  "house-of-reps": [
    {
      id: 1,
      name: "Akin Alabi",
      party: "APC",
      votes: 45000,
      percentage: 38,
      image: "/placeholder.svg?height=80&width=80",
      color: "#64748b",
    },
    {
      id: 2,
      name: "Tolulope Akande-Sadipe",
      party: "PDP",
      votes: 38000,
      percentage: 32,
      image: "/placeholder.svg?height=80&width=80",
      color: "#ef4444",
    },
    {
      id: 3,
      name: "Shina Peller",
      party: "LP",
      votes: 25000,
      percentage: 21,
      image: "/placeholder.svg?height=80&width=80",
      color: "#22c55e",
    },
    {
      id: 4,
      name: "Others",
      party: "Various",
      votes: 10000,
      percentage: 9,
      image: "/placeholder.svg?height=80&width=80",
      color: "#a855f7",
    },
  ],
  senatorial: [
    {
      id: 1,
      name: "Oluremi Tinubu",
      party: "APC",
      votes: 280000,
      percentage: 40,
      image: "/placeholder.svg?height=80&width=80",
      color: "#64748b",
    },
    {
      id: 2,
      name: "Dino Melaye",
      party: "PDP",
      votes: 210000,
      percentage: 30,
      image: "/placeholder.svg?height=80&width=80",
      color: "#ef4444",
    },
    {
      id: 3,
      name: "Shehu Sani",
      party: "LP",
      votes: 175000,
      percentage: 25,
      image: "/placeholder.svg?height=80&width=80",
      color: "#22c55e",
    },
    {
      id: 4,
      name: "Others",
      party: "Various",
      votes: 35000,
      percentage: 5,
      image: "/placeholder.svg?height=80&width=80",
      color: "#a855f7",
    },
  ],
};

// Regional data
const regionalData = [
  {
    region: "North Central",
    apc: 2100000,
    pdp: 1800000,
    lp: 1200000,
    nnpp: 400000,
    others: 200000,
  },
  {
    region: "North East",
    apc: 2400000,
    pdp: 1500000,
    lp: 800000,
    nnpp: 300000,
    others: 150000,
  },
  {
    region: "North West",
    apc: 3200000,
    pdp: 1900000,
    lp: 1000000,
    nnpp: 600000,
    others: 250000,
  },
  {
    region: "South East",
    apc: 500000,
    pdp: 800000,
    lp: 2500000,
    nnpp: 100000,
    others: 150000,
  },
  {
    region: "South South",
    apc: 900000,
    pdp: 1800000,
    lp: 1600000,
    nnpp: 100000,
    others: 150000,
  },
  {
    region: "South West",
    apc: 2400000,
    pdp: 1100000,
    lp: 1500000,
    nnpp: 200000,
    others: 100000,
  },
];

// State data
const stateData = [
  {
    state: "Lagos",
    apc: 450000,
    pdp: 220000,
    lp: 380000,
    nnpp: 50000,
    others: 30000,
  },
  {
    state: "Kano",
    apc: 380000,
    pdp: 320000,
    lp: 150000,
    nnpp: 280000,
    others: 40000,
  },
  {
    state: "Rivers",
    apc: 180000,
    pdp: 350000,
    lp: 320000,
    nnpp: 20000,
    others: 30000,
  },
  {
    state: "FCT",
    apc: 120000,
    pdp: 150000,
    lp: 220000,
    nnpp: 30000,
    others: 20000,
  },
  {
    state: "Kaduna",
    apc: 350000,
    pdp: 280000,
    lp: 180000,
    nnpp: 70000,
    others: 30000,
  },
];

// Time-based voting data
const timeData = [
  {
    time: "Day 1",
    apc: 1200000,
    pdp: 900000,
    lp: 800000,
    nnpp: 200000,
    others: 100000,
    milestone: "Voting Begins",
  },
  {
    time: "Day 2",
    apc: 2100000,
    pdp: 1700000,
    lp: 1500000,
    nnpp: 400000,
    others: 200000,
  },
  {
    time: "Day 3",
    apc: 2800000,
    pdp: 2300000,
    lp: 2100000,
    nnpp: 600000,
    others: 300000,
  },
  {
    time: "Day 4",
    apc: 3400000,
    pdp: 2800000,
    lp: 2600000,
    nnpp: 700000,
    others: 400000,
  },
  {
    time: "Day 5",
    apc: 4000000,
    pdp: 3300000,
    lp: 3000000,
    nnpp: 800000,
    others: 500000,
    milestone: "25% Turnout Reached",
  },
  {
    time: "Day 6",
    apc: 4500000,
    pdp: 3700000,
    lp: 3400000,
    nnpp: 900000,
    others: 600000,
  },
  {
    time: "Day 7",
    apc: 5000000,
    pdp: 4100000,
    lp: 3700000,
    nnpp: 1000000,
    others: 650000,
    milestone: "Week 1 Complete",
  },
  {
    time: "Day 8",
    apc: 5400000,
    pdp: 4400000,
    lp: 4000000,
    nnpp: 1100000,
    others: 700000,
  },
  {
    time: "Day 9",
    apc: 5800000,
    pdp: 4700000,
    lp: 4300000,
    nnpp: 1150000,
    others: 750000,
  },
  {
    time: "Day 10",
    apc: 6200000,
    pdp: 5000000,
    lp: 4600000,
    nnpp: 1200000,
    others: 800000,
  },
  {
    time: "Day 11",
    apc: 6600000,
    pdp: 5300000,
    lp: 4800000,
    nnpp: 1250000,
    others: 850000,
  },
  {
    time: "Day 12",
    apc: 7000000,
    pdp: 5600000,
    lp: 5000000,
    nnpp: 1300000,
    others: 900000,
  },
  {
    time: "Day 13",
    apc: 7300000,
    pdp: 5900000,
    lp: 5200000,
    nnpp: 1350000,
    others: 920000,
  },
  {
    time: "Day 14",
    apc: 7600000,
    pdp: 6100000,
    lp: 5400000,
    nnpp: 1400000,
    others: 940000,
    milestone: "Week 2 Complete",
  },
  {
    time: "Day 15",
    apc: 7900000,
    pdp: 6300000,
    lp: 5600000,
    nnpp: 1420000,
    others: 950000,
  },
  {
    time: "Day 16",
    apc: 8100000,
    pdp: 6500000,
    lp: 5800000,
    nnpp: 1440000,
    others: 960000,
  },
  {
    time: "Day 17",
    apc: 8200000,
    pdp: 6600000,
    lp: 5900000,
    nnpp: 1460000,
    others: 970000,
  },
  {
    time: "Day 18",
    apc: 8300000,
    pdp: 6700000,
    lp: 6000000,
    nnpp: 1480000,
    others: 980000,
  },
  {
    time: "Day 19",
    apc: 8400000,
    pdp: 6800000,
    lp: 6050000,
    nnpp: 1490000,
    others: 990000,
  },
  {
    time: "Day 20",
    apc: 8450000,
    pdp: 6850000,
    lp: 6080000,
    nnpp: 1495000,
    others: 995000,
  },
  {
    time: "Day 21",
    apc: 8500000,
    pdp: 6900000,
    lp: 6100000,
    nnpp: 1500000,
    others: 1000000,
    milestone: "Voting Ends",
  },
];

// Hourly data for a single day
const hourlyData = [
  { hour: "6 AM", votes: 50000 },
  { hour: "7 AM", votes: 120000 },
  { hour: "8 AM", votes: 210000 },
  { hour: "9 AM", votes: 320000 },
  { hour: "10 AM", votes: 450000, milestone: "Morning Peak" },
  { hour: "11 AM", votes: 520000 },
  { hour: "12 PM", votes: 580000 },
  { hour: "1 PM", votes: 620000 },
  { hour: "2 PM", votes: 680000 },
  { hour: "3 PM", votes: 750000 },
  { hour: "4 PM", votes: 850000, milestone: "Afternoon Peak" },
  { hour: "5 PM", votes: 920000 },
  { hour: "6 PM", votes: 980000 },
  { hour: "7 PM", votes: 1020000 },
  { hour: "8 PM", votes: 1050000, milestone: "Polls Close" },
];

const AiAssistantPreview = () => {
  return (
    <div className="fixed bottom-4 right-4 rounded-xl bg-primary/90 text-primary-foreground p-3 shadow-lg backdrop-blur-sm border border-primary/20 z-50 flex items-center">
      <span className="animate-pulse mr-2 h-3 w-3 rounded-full bg-primary-foreground"></span>
      <span className="text-sm font-medium">AI Results Analysis Available</span>
    </div>
  );
};

export default function ResultsDashboardPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated, user } = useAuthStore();
  const { isLoading, error, setError } = useUIStore();

  const initialElectionType = searchParams.get("type") || "presidential";
  const [electionType, setElectionType] = useState(initialElectionType);
  const [selectedCandidateId, setSelectedCandidateId] = useState<number | null>(
    null
  );
  const [viewMode, setViewMode] = useState<"map" | "chart">("chart");
  const [showRealTime, setShowRealTime] = useState(true);
  const [dataLevel, setDataLevel] = useState<"national" | "regional" | "state">(
    "national"
  );
  const [selectedRegion, setSelectedRegion] = useState("all");
  const [selectedTimeRange, setSelectedTimeRange] = useState("all");
  const [showLegend, setShowLegend] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState(0); // 0 means no auto-refresh

  // Use the hooks for data
  const {
    currentElection,
    elections,
    candidates: hookCandidates,
    results: electionResults,
    fetchElections,
    fetchElectionDetails,
    fetchCandidates,
    fetchResults,
    setCurrentElection,
    isLoading: electionLoading,
  } = useElectionData();

  // Additional results hook for more detailed data
  const {
    getStatistics,
    getLiveResults,
    getRegionalResults,
    getHistoricalData,
  } = useResults();

  // State for live results data
  const [liveResultsData, setLiveResultsData] = useState<any>(null);
  const [detailedResultsData, setDetailedResultsData] = useState<any>(null);
  const [includePollingUnitBreakdown, setIncludePollingUnitBreakdown] =
    useState(false);
  const [resultsLoading, setResultsLoading] = useState(false);

  // Fallback to static data if hook data is not available
  const candidates =
    hookCandidates && hookCandidates.length > 0
      ? hookCandidates
      : candidatesByElection[
          electionType as keyof typeof candidatesByElection
        ] || [];

  // Setup data states for statistics views with fallback data
  const [regionalDataState, setRegionalData] = useState<any[]>(regionalData);
  const [stateDataState, setStateData] = useState<any[]>(stateData);
  const [timeDataState, setTimeData] = useState<any[]>(timeData);

  // Function to fetch live results using election ID
  const fetchLiveResultsData = useCallback(
    async (electionId: string) => {
      try {
        setResultsLoading(true);
        setError(null);

        // Fetch detailed results using the new API
        const detailedResponse = await resultsAPI.getDetailedResults(
          electionId,
          includePollingUnitBreakdown
        );

        if (detailedResponse.success) {
          setDetailedResultsData(detailedResponse.data);

          // Also fetch live results for real-time updates
          const liveResponse = await resultsAPI.getLiveResults(electionId);
          if (liveResponse.success) {
            setLiveResultsData(liveResponse.data);
          }
        }
      } catch (error: any) {
        const errorMessage =
          error.response?.data?.message || "Failed to fetch live results";
        setError(errorMessage);
        console.error("Failed to fetch live results:", error);
      } finally {
        setResultsLoading(false);
      }
    },
    [includePollingUnitBreakdown, setError]
  );

  // Function to find election by type
  const findElectionByType = useCallback(
    (type: string) => {
      if (!elections || elections.length === 0) return null;

      return elections.find((election) => {
        const electionTypeNormalized = election.type?.toLowerCase() || "";
        const searchType = type.toLowerCase();

        return (
          electionTypeNormalized.includes(searchType) ||
          electionTypeNormalized === searchType ||
          (searchType === "presidential" &&
            electionTypeNormalized.includes("president")) ||
          (searchType === "gubernatorial" &&
            (electionTypeNormalized.includes("governor") ||
              electionTypeNormalized.includes("gubernatorial"))) ||
          (searchType === "house-of-reps" &&
            (electionTypeNormalized.includes("house") ||
              electionTypeNormalized.includes("representative"))) ||
          (searchType === "senatorial" &&
            (electionTypeNormalized.includes("senate") ||
              electionTypeNormalized.includes("senator")))
        );
      });
    },
    [elections]
  );

  useEffect(() => {
    const initializeElectionData = async () => {
      try {
        // First, ensure we have elections loaded
        if (!elections || elections.length === 0) {
          await fetchElections();
        }
      } catch (error) {
        console.error("Failed to fetch elections:", error);
      }
    };

    initializeElectionData();
  }, [elections, fetchElections]);

  useEffect(() => {
    if (electionType && elections && elections.length > 0) {
      // Find the election by type
      const election = findElectionByType(electionType);

      if (election) {
        // Set as current election if different
        if (!currentElection || currentElection.id !== election.id) {
          setCurrentElection(election);
        }

        // Fetch detailed data for this election
        fetchElectionDetails(election.id);
        fetchCandidates(election.id);
        fetchResults(election.id);

        // Fetch live results using the new API
        fetchLiveResultsData(election.id);
      } else {
        setError(
          `No ${
            ELECTION_TYPES[electionType as keyof typeof ELECTION_TYPES] ||
            electionType
          } election found`
        );
      }
    }
  }, [
    electionType,
    elections,
    currentElection,
    findElectionByType,
    setCurrentElection,
    fetchElectionDetails,
    fetchCandidates,
    fetchResults,
    fetchLiveResultsData,
    setError,
  ]);

  useEffect(() => {
    // Set up refresh interval if enabled
    if (refreshInterval > 0 && currentElection?.id) {
      const intervalId = setInterval(() => {
        handleRefresh();
      }, refreshInterval * 1000);

      return () => clearInterval(intervalId);
    }
  }, [refreshInterval, currentElection?.id]);

  // Load regional data when needed
  useEffect(() => {
    const loadRegionalData = async () => {
      if (
        (dataLevel === "regional" || dataLevel === "state") &&
        currentElection?.id
      ) {
        try {
          const data = await getRegionalResults(currentElection.id);
          if (dataLevel === "regional") {
            setRegionalData(data.regions || regionalData);
          } else {
            setStateData(data.states || stateData);
          }
        } catch (err: any) {
          setError(err.message || "Failed to load regional data");
        }
      }
    };

    loadRegionalData();
  }, [dataLevel, currentElection?.id, getRegionalResults, setError]);

  // Load historical time data when needed
  useEffect(() => {
    const loadTimeData = async () => {
      if (selectedTimeRange !== "all" && currentElection?.id) {
        try {
          const data = await getHistoricalData(
            currentElection.id,
            selectedTimeRange
          );
          setTimeData(data.timePoints || timeData);
        } catch (err: any) {
          setError(err.message || "Failed to load historical data");
        }
      }
    };

    loadTimeData();
  }, [selectedTimeRange, currentElection?.id, getHistoricalData, setError]);

  const handleCandidateSelect = (candidateId: number | string) => {
    const id =
      typeof candidateId === "string" ? parseInt(candidateId, 10) : candidateId;
    setSelectedCandidateId(id === selectedCandidateId ? null : id);
  };

  const changeElectionType = (type: string) => {
    setElectionType(type);
    router.push(`/results?type=${type}`, { scroll: false });
  };

  const handleRefresh = () => {
    if (currentElection?.id) {
      // Refresh using election ID
      fetchResults(currentElection.id);
      fetchLiveResultsData(currentElection.id);

      if (dataLevel === "regional") {
        getRegionalResults(currentElection.id).then((data) =>
          setRegionalData(data.regions || regionalData)
        );
      } else if (dataLevel === "state") {
        getRegionalResults(currentElection.id).then((data) =>
          setStateData(data.states || stateData)
        );
      }
      if (selectedTimeRange !== "all") {
        getHistoricalData(currentElection.id, selectedTimeRange).then((data) =>
          setTimeData(data.timePoints || timeData)
        );
      }
    }
  };

  const handleDownloadResults = () => {
    // Implementation would create and trigger download of results data
    alert("This would download the results in CSV format.");
  };

  const handleShareResults = () => {
    // Implementation would create a shareable link
    alert("This would create a shareable link to these results.");
  };

  const getTotalVotes = () => {
    // First check detailed results data (API response format)
    if (detailedResultsData?.totalVotesCast) {
      return detailedResultsData.totalVotesCast;
    }
    // Then check live results data (API response format)
    if (liveResultsData?.totalVotesCast) {
      return liveResultsData.totalVotesCast;
    }
    // Then check election results from hook
    if (electionResults && electionResults.totalVotes) {
      return electionResults.totalVotes;
    }
    // Fallback: calculate from API results array
    if (
      detailedResultsData?.results &&
      Array.isArray(detailedResultsData.results)
    ) {
      return detailedResultsData.results.reduce(
        (total: number, candidate: any) => total + (candidate.totalVotes || 0),
        0
      );
    }
    if (liveResultsData?.results && Array.isArray(liveResultsData.results)) {
      return liveResultsData.results.reduce(
        (total: number, candidate: any) => total + (candidate.totalVotes || 0),
        0
      );
    }
    // Fallback: calculate from candidates data
    if (candidates && candidates.length > 0) {
      return candidates.reduce(
        (total, candidate) => total + (candidate.votes || 0),
        0
      );
    }
    return 0;
  };

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <Sidebar>
          <SidebarHeader className="flex items-center justify-between p-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="relative h-10 w-10 overflow-hidden">
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/a2ab155c-d9f2-4496-8348-6166795a6b83-ufZ6Y3SuWgCxad1rVS0orIIbndoZBK.webp"
                  alt="Secure Ballot Logo"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <span className="text-xl font-bold">Secure Ballot</span>
            </Link>
          </SidebarHeader>

          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Main Navigation</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link href="/dashboard">
                        <Home />
                        <span>Dashboard</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link href="/vote" className="flex items-center justify-between w-full">
                        <div className="flex items-center">
                          <Vote className="mr-2 h-4 w-4" />
                          <span>Vote</span>
                        </div>
                        <Badge
                          variant="outline"
                          className="ml-2 bg-blue-500/10 text-blue-500 border-blue-500/20"
                        >
                          Available
                        </Badge>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive>
                      <Link href="/results" className="flex items-center justify-between w-full">
                        <div className="flex items-center">
                          <BarChart3 className="mr-2 h-4 w-4" />
                          <span>Results</span>
                        </div>
                        <Badge
                          variant="outline"
                          className="ml-2 bg-green-500/10 text-green-500 border-green-500/20"
                        >
                          Live
                        </Badge>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link href="/dashboard/profile">
                        <User />
                        <span>Profile</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link href="/dashboard/settings">
                        <Settings />
                        <span>Settings</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupLabel>Quick Access</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link href="/map">
                        <Map />
                        <span>Electoral Map</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupLabel>Elections</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {Object.entries(ELECTION_TYPES).map(([type, title]) => (
                    <SidebarMenuItem key={type}>
                      <SidebarMenuButton
                        asChild
                        isActive={electionType === type}
                        onClick={() => changeElectionType(type)}
                      >
                        <button className="flex items-center justify-between w-full">
                          <div className="flex items-center">
                            <Users className="mr-2 h-4 w-4" />
                            <span>{title.split(" ")[0]}</span>
                          </div>
                        </button>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter className="p-4">
            <SidebarMenu>
              <SidebarMenuItem>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <SidebarMenuButton>
                      <User />
                      <span>{user?.fullName || user?.email || "User"}</span>
                      <ChevronDown className="ml-auto h-4 w-4" />
                    </SidebarMenuButton>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard/profile">
                        <User className="mr-2 h-4 w-4" />
                        <span>View Profile</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard/settings">
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Account Settings</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/help">
                        <Info className="mr-2 h-4 w-4" />
                        <span>Help & Support</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/">
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Logout</span>
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>

        <div className="flex-1">
          <header className="sticky top-0 z-30 flex flex-col gap-3 md:flex-row md:h-16 md:items-center md:justify-between border-b bg-background px-4 md:px-6 py-3 md:py-0">
            <div className="flex items-center gap-2 min-w-0">
              <SidebarTrigger />
              <h1 className="text-base md:text-lg font-semibold truncate">
                {ELECTION_TYPES[electionType as keyof typeof ELECTION_TYPES] ||
                  "Election"}{" "}
                Results
              </h1>
              <Badge
                variant="outline"
                className="bg-green-500/10 text-green-500 border-green-500/20 text-xs"
              >
                Live
              </Badge>
              {currentElection?.id && (
                <Badge variant="outline" className="text-xs hidden sm:inline-flex">
                  ID: {currentElection.id}
                </Badge>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2 md:gap-4">
              <div className="flex items-center gap-2">
                <Label htmlFor="realtime-toggle" className="text-sm">
                  Real-time
                </Label>
                <Switch
                  id="realtime-toggle"
                  checked={showRealTime}
                  onCheckedChange={setShowRealTime}
                />
              </div>
              <div className="flex items-center gap-2">
                <Label htmlFor="polling-breakdown-toggle" className="text-sm">
                  Polling Units
                </Label>
                <Switch
                  id="polling-breakdown-toggle"
                  checked={includePollingUnitBreakdown}
                  onCheckedChange={(checked) => {
                    setIncludePollingUnitBreakdown(checked);
                    // Refetch data with new breakdown setting
                    if (currentElection?.id) {
                      fetchLiveResultsData(currentElection.id);
                    }
                  }}
                />
              </div>
              <Button
                variant="outline"
                size="icon"
                className={`rounded-full ${
                  refreshInterval > 0 || resultsLoading ? "animate-spin" : ""
                }`}
                onClick={handleRefresh}
                disabled={refreshInterval > 0 || resultsLoading}
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
              <ThemeToggle />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="hidden md:flex"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Export
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <span>Export as PDF</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <span>Export as CSV</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <span>Export as Image</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>

          <main className="flex-1 p-4 md:p-6">
            {/* Error State */}
            {error && (
              <Alert className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Loading State */}
            {(resultsLoading || electionLoading) && (
              <Alert className="mb-6">
                <RefreshCw className="h-4 w-4 animate-spin" />
                <AlertTitle>Loading Results</AlertTitle>
                <AlertDescription>
                  Fetching live election results
                  {includePollingUnitBreakdown
                    ? " with polling unit breakdown"
                    : ""}
                  ...
                </AlertDescription>
              </Alert>
            )}

            {/* Loading State */}
            {(isLoading || electionLoading) && (
              <div className="flex items-center justify-center py-8">
                <div className="text-center">
                  <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-2" />
                  <p className="text-muted-foreground">
                    Loading election results...
                  </p>
                </div>
              </div>
            )}

            {/* Results Summary */}
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mb-6">
              <Card className="transition-all duration-300 hover:shadow-md">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Votes Cast
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-xl md:text-2xl font-bold">
                    {getTotalVotes().toLocaleString()}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    +2.5% from last hour
                  </p>
                </CardContent>
              </Card>

              <Card className="transition-all duration-300 hover:shadow-md">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    Voter Turnout
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-xl md:text-2xl font-bold">62.5%</div>
                  <p className="text-xs text-muted-foreground">
                    Of registered voters
                  </p>
                </CardContent>
              </Card>

              <Card className="transition-all duration-300 hover:shadow-md">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    States Reporting
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-xl md:text-2xl font-bold">36/37</div>
                  <p className="text-xs text-muted-foreground">Including FCT</p>
                </CardContent>
              </Card>

              <Card className="transition-all duration-300 hover:shadow-md">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    Leading Candidate
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-xl md:text-2xl font-bold">
                    {(() => {
                      // Check API results first
                      if (
                        detailedResultsData?.results &&
                        Array.isArray(detailedResultsData.results) &&
                        detailedResultsData.results.length > 0
                      ) {
                        const leader = detailedResultsData.results[0];
                        return leader.candidateName?.split(" ")[0] || "N/A";
                      }
                      if (
                        liveResultsData?.results &&
                        Array.isArray(liveResultsData.results) &&
                        liveResultsData.results.length > 0
                      ) {
                        const leader = liveResultsData.results[0];
                        return leader.candidateName?.split(" ")[0] || "N/A";
                      }
                      // Fallback to hook candidates
                      if (candidates && candidates.length > 0) {
                        return candidates[0].name?.split(" ")[0] || "N/A";
                      }
                      return "N/A";
                    })()}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {(() => {
                      // Check API results first
                      if (
                        detailedResultsData?.results &&
                        Array.isArray(detailedResultsData.results) &&
                        detailedResultsData.results.length > 0
                      ) {
                        const leader = detailedResultsData.results[0];
                        return `${
                          leader.percentage?.toFixed(1) || 0
                        }% of votes`;
                      }
                      if (
                        liveResultsData?.results &&
                        Array.isArray(liveResultsData.results) &&
                        liveResultsData.results.length > 0
                      ) {
                        const leader = liveResultsData.results[0];
                        return `${
                          leader.percentage?.toFixed(1) || 0
                        }% of votes`;
                      }
                      // Fallback to hook candidates
                      if (candidates && candidates.length > 0) {
                        return `${candidates[0].percentage || 0}% of votes`;
                      }
                      return "No data available";
                    })()}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Detailed Results Information */}
            {detailedResultsData && (
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    Live Results Data
                    <Badge
                      variant="outline"
                      className="bg-green-500/10 text-green-500 border-green-500/20"
                    >
                      Election ID: {currentElection?.id}
                    </Badge>
                  </CardTitle>
                  <CardDescription>
                    Real-time results from the live API
                    {includePollingUnitBreakdown
                      ? " with polling unit breakdown"
                      : ""}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                    <div>
                      <div className="text-sm font-medium text-muted-foreground">
                        Total Votes Cast
                      </div>
                      <div className="text-xl md:text-2xl font-bold">
                        {detailedResultsData.totalVotesCast?.toLocaleString() ||
                          "N/A"}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-muted-foreground">
                        Election Status
                      </div>
                      <div className="text-xl md:text-2xl font-bold capitalize">
                        {detailedResultsData.status || "N/A"}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-muted-foreground">
                        Candidates
                      </div>
                      <div className="text-xl md:text-2xl font-bold">
                        {detailedResultsData.results?.length || "N/A"}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-muted-foreground">
                        Election Type
                      </div>
                      <div className="text-sm">
                        {detailedResultsData.electionType || "N/A"}
                      </div>
                    </div>
                  </div>

                  {/* Candidate Results from API */}
                  {detailedResultsData.results &&
                    Array.isArray(detailedResultsData.results) && (
                      <div className="mt-6">
                        <h4 className="text-lg font-semibold mb-4">
                          Live Candidate Results
                        </h4>
                        <div className="space-y-3">
                          {detailedResultsData.results.map(
                            (candidate: any, index: number) => (
                              <div
                                key={candidate.candidateId}
                                className="flex items-center justify-between p-3 rounded-lg border bg-card"
                              >
                                <div className="flex items-center gap-3">
                                  <div className="text-lg font-bold text-muted-foreground">
                                    #{index + 1}
                                  </div>
                                  <div>
                                    <div className="font-semibold">
                                      {candidate.candidateName}
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                      {candidate.partyAffiliation}
                                    </div>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <div className="text-lg font-bold">
                                    {candidate.totalVotes?.toLocaleString()}
                                  </div>
                                  <div className="text-sm text-muted-foreground">
                                    {candidate.percentage?.toFixed(2)}%
                                  </div>
                                </div>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    )}

                  {includePollingUnitBreakdown &&
                    detailedResultsData.pollingUnitBreakdown && (
                      <div className="mt-4">
                        <h4 className="text-sm font-medium mb-2">
                          Polling Unit Breakdown
                        </h4>
                        <div className="text-sm text-muted-foreground">
                          {detailedResultsData.pollingUnitBreakdown.length}{" "}
                          polling units reported
                        </div>
                      </div>
                    )}
                </CardContent>
              </Card>
            )}

            {/* Candidate Selection */}
            <div className="mb-6 flex flex-wrap gap-2">
              <div className="text-sm font-medium mr-2 flex items-center">
                Highlight Candidate:
              </div>
              {(() => {
                // Use API results if available
                let candidateList = [];
                if (
                  detailedResultsData?.results &&
                  Array.isArray(detailedResultsData.results)
                ) {
                  candidateList = detailedResultsData.results.map((c: any) => ({
                    id: c.candidateId,
                    party: c.partyAffiliation,
                    color: `hsl(${Math.random() * 360}, 70%, 50%)`,
                  }));
                } else if (
                  liveResultsData?.results &&
                  Array.isArray(liveResultsData.results)
                ) {
                  candidateList = liveResultsData.results.map((c: any) => ({
                    id: c.candidateId,
                    party: c.partyAffiliation,
                    color: `hsl(${Math.random() * 360}, 70%, 50%)`,
                  }));
                } else if (candidates && candidates.length > 0) {
                  candidateList = candidates;
                }

                return candidateList.length > 0 ? (
                  candidateList.map((candidate: any) => (
                    <button
                      key={candidate.id}
                      onClick={() => handleCandidateSelect(candidate.id)}
                      className={`flex items-center gap-2 rounded-full px-3 py-1 text-sm transition-all ${
                        selectedCandidateId === candidate.id
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted hover:bg-muted/80"
                      }`}
                    >
                      <div
                        className="h-3 w-3 rounded-full"
                        style={{ backgroundColor: candidate.color }}
                      ></div>
                      <span>{candidate.party}</span>
                    </button>
                  ))
                ) : (
                  <div className="text-sm text-muted-foreground">
                    No candidates available
                  </div>
                );
              })()}
              {selectedCandidateId && (
                <button
                  onClick={() => setSelectedCandidateId(null)}
                  className="rounded-full px-3 py-1 text-sm bg-muted hover:bg-muted/80"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Charts */}
            <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3 mb-6">
              {/* Pie Chart */}
              <Card className="xl:col-span-1">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <div>
                    <CardTitle>Vote Share</CardTitle>
                    <CardDescription>
                      Percentage distribution by candidate
                    </CardDescription>
                  </div>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <Info className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">
                          This pie chart shows the percentage of votes received
                          by each candidate. Hover over slices to see detailed
                          information.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </CardHeader>
                <CardContent className="pt-4">
                  <ElectionCharts
                    type="pie"
                    data={(() => {
                      // Use API results if available
                      if (
                        detailedResultsData?.results &&
                        Array.isArray(detailedResultsData.results)
                      ) {
                        return detailedResultsData.results.map((c: any) => ({
                          id: c.candidateId,
                          name: c.candidateName,
                          party: c.partyAffiliation,
                          value: c.percentage,
                          votes: c.totalVotes,
                          color: `hsl(${Math.random() * 360}, 70%, 50%)`, // Generate random colors for now
                        }));
                      }
                      if (
                        liveResultsData?.results &&
                        Array.isArray(liveResultsData.results)
                      ) {
                        return liveResultsData.results.map((c: any) => ({
                          id: c.candidateId,
                          name: c.candidateName,
                          party: c.partyAffiliation,
                          value: c.percentage,
                          votes: c.totalVotes,
                          color: `hsl(${Math.random() * 360}, 70%, 50%)`, // Generate random colors for now
                        }));
                      }
                      // Fallback to hook candidates
                      if (candidates && candidates.length > 0) {
                        return candidates.map((c) => ({
                          id: c.id,
                          name: c.name,
                          party: c.party,
                          value: c.percentage,
                          votes: c.votes,
                          color: c.color,
                        }));
                      }
                      return [];
                    })()}
                    selectedCandidate={selectedCandidateId}
                    onSelectCandidate={handleCandidateSelect}
                    isLoading={resultsLoading || electionLoading}
                  />
                </CardContent>
              </Card>

              {/* Bar Chart */}
              <Card className="xl:col-span-1">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <div>
                    <CardTitle>Regional Distribution</CardTitle>
                    <CardDescription>
                      Vote counts across regions
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Select
                      value={dataLevel}
                      onValueChange={(value: string) =>
                        setDataLevel(value as "national" | "regional" | "state")
                      }
                    >
                      <SelectTrigger className="w-[130px]">
                        <SelectValue placeholder="View" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="national">
                          Geopolitical Zones
                        </SelectItem>
                        <SelectItem value="state">Top States</SelectItem>
                      </SelectContent>
                    </Select>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <Info className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">
                            This bar chart shows vote distribution across{" "}
                            {dataLevel === "national"
                              ? "geopolitical zones"
                              : "states"}
                            . Toggle between views using the dropdown.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  <ElectionCharts
                    type="bar"
                    data={
                      dataLevel === "national"
                        ? regionalDataState
                        : stateDataState
                    }
                    selectedCandidate={selectedCandidateId}
                    onSelectCandidate={handleCandidateSelect}
                    isLoading={isLoading}
                  />
                </CardContent>
              </Card>

              {/* Line Chart */}
              <Card className="xl:col-span-1">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <div>
                    <CardTitle>Voting Trends</CardTitle>
                    <CardDescription>
                      Vote progression over time
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Select
                      value={selectedTimeRange}
                      onValueChange={setSelectedTimeRange}
                    >
                      <SelectTrigger className="w-[130px]">
                        <SelectValue placeholder="View" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Time</SelectItem>
                        <SelectItem value="daily">Daily Trend</SelectItem>
                        <SelectItem value="hourly">Hourly Breakdown</SelectItem>
                      </SelectContent>
                    </Select>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <Info className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">
                            This line chart shows voting trends over time.
                            Toggle between daily and hourly views.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  <ElectionCharts
                    type="line"
                    data={
                      selectedTimeRange === "all"
                        ? timeDataState
                        : timeDataState.slice(0, 21)
                    }
                    selectedCandidate={selectedCandidateId}
                    onSelectCandidate={handleCandidateSelect}
                    isLoading={isLoading}
                  />
                  {selectedTimeRange === "daily" && (
                    <div className="mt-4">
                      <Label className="text-xs mb-2 block">Time Range</Label>
                      <Slider
                        value={[0, 100]}
                        onValueChange={([start, end]) => {
                          setSelectedTimeRange("custom");
                          setSelectedTimeRange(end.toString());
                        }}
                        max={100}
                        step={5}
                        className="my-4"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Day 1</span>
                        <span>Day 21</span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Candidate Results Table */}
            <Card>
              <CardHeader>
                <CardTitle>Detailed Results</CardTitle>
                <CardDescription>
                  Complete breakdown of votes by candidate
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[600px]">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">Candidate</th>
                        <th className="text-left p-2">Party</th>
                        <th className="text-right p-2">Votes</th>
                        <th className="text-right p-2">Percentage</th>
                        <th className="text-right p-2">Winning States</th>
                      </tr>
                    </thead>
                    <tbody>
                      {candidates && candidates.length > 0 ? (
                        candidates.map((candidate) => (
                          <tr
                            key={candidate.id}
                            className={`border-b hover:bg-muted/30 transition-colors cursor-pointer ${
                              selectedCandidateId === candidate.id
                                ? "bg-primary/5"
                                : ""
                            }`}
                            onClick={() => handleCandidateSelect(candidate.id)}
                          >
                            <td className="p-2 flex items-center gap-2">
                              <div className="relative h-8 w-8 overflow-hidden">
                                <img
                                  src={candidate.image || "/placeholder.svg"}
                                  alt={candidate.name || "Candidate"}
                                  className="h-full w-full object-cover"
                                />
                              </div>
                              <span>{candidate.name || "Unknown"}</span>
                            </td>
                            <td className="p-2">
                              <Badge
                                variant="outline"
                                className="font-medium"
                                style={{
                                  backgroundColor: `${
                                    candidate.color || "#gray"
                                  }20`,
                                  color: candidate.color || "#gray",
                                  borderColor: `${
                                    candidate.color || "#gray"
                                  }40`,
                                }}
                              >
                                {candidate.party || "N/A"}
                              </Badge>
                            </td>
                            <td className="p-2 text-right font-medium">
                              {(candidate.votes || 0).toLocaleString()}
                            </td>
                            <td className="p-2 text-right">
                              {candidate.percentage || 0}%
                            </td>
                            <td className="p-2 text-right">
                              {candidate.id === 1
                                ? "12"
                                : candidate.id === 2
                                ? "10"
                                : candidate.id === 3
                                ? "9"
                                : candidate.id === 4
                                ? "2"
                                : "0"}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan={5}
                            className="p-4 text-center text-muted-foreground"
                          >
                            No candidate data available
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <div className="text-sm text-muted-foreground">
                  Last updated: {new Date().toLocaleString()}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleShareResults}
                  >
                    <Share2 className="mr-2 h-4 w-4" />
                    Share Results
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDownloadResults}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </main>
        </div>
      </div>

      {/* AI Assistant */}
      <AiAssistantPreview />
    </SidebarProvider>
  );
}

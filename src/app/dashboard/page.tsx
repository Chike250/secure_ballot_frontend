"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import {
  BarChart3,
  Bell,
  ChevronDown,
  Clock,
  Filter,
  Home,
  LogOut,
  Map,
  MessageSquare,
  Settings,
  User,
  Users,
  Check,
  ArrowUp,
  CreditCard,
  UserCheck,
  CheckCircle,
  XCircle,
  Percent,
  AlertCircle,
  TrendingUp,
  MapPin,
  ShieldCheck,
  Globe,
  Search,
  Shield,
  RefreshCw,
  Info,
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
import { BarChart, PieChart } from "@/components/ui/chart";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { useAuthStore, useUIStore } from "@/store/useStore";
import { useElectionData } from "@/hooks/useElectionData";
import { useElections } from "@/hooks/useElections";
import { useResults } from "@/hooks/useResults";
import { useDashboard } from "@/hooks/useDashboard";
import ElectoralMap from "@/components/ui/electoral-map";
import { voterAPI } from "@/services/api"; // Use direct API for new consolidated endpoint

export default function DashboardPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated, user, isInitialized } = useAuthStore();
  const { isLoading, error, setError } = useUIStore();

  const initialElectionType = searchParams.get("type") || "presidential";
  const [electionType, setElectionType] = useState(initialElectionType);
  const [activeTab, setActiveTab] = useState("overview");
  const [showNotifications, setShowNotifications] = useState(false);
  const [showFilterDialog, setShowFilterDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Consolidated dashboard data state
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [isDashboardLoading, setIsDashboardLoading] = useState(false);
  const [dashboardError, setDashboardError] = useState<string | null>(null);

  // Filter criteria state
  const [filterCriteria, setFilterCriteria] = useState({
    regions: [],
    minVotes: 0,
    maxVotes: 10000000,
    parties: [],
    turnout: [0, 100],
  });

  // Use the API hooks (keeping for election management)
  const {
    currentElection,
    elections,
    candidates,
    results: electionResults,
    fetchElections,
    fetchElectionDetails,
    fetchCandidates,
    fetchResults,
    fetchStatistics,
    getRealTimeResults,
    setCurrentElection,
    isLoading: electionLoading,
    hasVoted,
    checkVotingStatus,
  } = useElectionData();

  // NEW: Function to fetch consolidated dashboard data
  const fetchDashboardData = async (electionId: string) => {
    try {
      setIsDashboardLoading(true);
      setDashboardError(null);

      const response = await voterAPI.getDashboard(electionId, {
        userId: user?.id,
        includeRealTime: true,
        includeRegionalBreakdown: true,
      });

      if (response.success) {
        setDashboardData(response.data);
        return response.data;
      } else {
        throw new Error(response.message || "Failed to fetch dashboard data");
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch dashboard data";
      setDashboardError(errorMessage);
      console.error("Dashboard fetch error:", error);

      // Fallback to individual API calls on error
      console.log("Falling back to individual API calls...");
      try {
        await fetchElectionDetails(electionId);
        await fetchCandidates(electionId);
        await checkVotingStatus(electionId);

        // Note: Statistics will be available through the election data hooks
        await fetchStatistics(electionId);
        await getRealTimeResults(electionId);
      } catch (fallbackError) {
        console.error("Fallback API calls failed:", fallbackError);
        setError("Failed to load dashboard data");
      }
    } finally {
      setIsDashboardLoading(false);
    }
  };

  // Election types mapping
  const ELECTION_TYPES_MAP: Record<string, string> = {
    presidential: "Presidential Election",
    gubernatorial: "Gubernatorial Election",
    "house-of-reps": "House of Representatives Election",
    senatorial: "Senatorial Election",
  };

  const currentElectionTypeKey = electionType;

  const [selectedCandidateId, setSelectedCandidateId] = useState<string | null>(
    null
  );
  const [showVoteDialog, setShowVoteDialog] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "info",
      message: "New election added: Local Government Elections",
      time: "2h ago",
      read: false,
    },
    {
      id: 2,
      type: "success",
      message: "Your vote was successfully recorded",
      time: "1d ago",
      read: true,
    },
    {
      id: 3,
      type: "info",
      message: "Election results for Presidential Election now available",
      time: "2d ago",
      read: true,
    },
  ]);

  // Consolidated effect for authentication, election selection, and data fetching
  useEffect(() => {
    // Handle authentication redirect
    if (!isInitialized) return;
    
    if (!isAuthenticated) {
      router.push("/login?from=/dashboard");
      return;
    }

    // Handle election selection and data fetching
    if (elections.length === 0) {
      console.log("Elections array is empty, waiting for auto-fetch...");
      return;
    }

    try {
      if (electionType) {
        // Find election by type
        const election = elections.find((e) => {
          const eType = (e as any).electionType || e.type;
          if (!eType) return false;

          const normalizedType = eType.toLowerCase();
          return (
            normalizedType.includes(electionType.toLowerCase()) ||
            normalizedType === electionType.toLowerCase() ||
            (electionType === "presidential" && normalizedType.includes("president")) ||
            (electionType === "gubernatorial" && normalizedType.includes("governor")) ||
            (electionType === "house-of-reps" && (normalizedType.includes("house") || normalizedType.includes("representative"))) ||
            (electionType === "senatorial" && (normalizedType.includes("senate") || normalizedType.includes("senator")))
          );
        });

        if (election && currentElection?.id !== election.id) {
          console.log("Found election for dashboard:", election.id);
          setCurrentElection(election);
        }
      }
    } catch (error) {
      console.error("Dashboard initialization error:", error);
      setError("Failed to initialize dashboard. Please refresh the page.");
    }
  }, [electionType, isAuthenticated, isInitialized, elections, currentElection?.id, router]);

  // Effect for fetching data when current election changes
  useEffect(() => {
    if (!currentElection || !isAuthenticated || !isInitialized) return;

    console.log("Fetching dashboard data for election:", currentElection.id);

    // Fetch dashboard data
    fetchDashboardData(currentElection.id)
      .then((dashboardData) => {
        console.log("Dashboard data fetched:", dashboardData);
      })
      .catch((error) => {
        console.error("Failed to fetch dashboard data:", error);
        // Fallback to individual API calls
        fetchElectionDetails(currentElection.id);
        fetchCandidates(currentElection.id);
        fetchStatistics(currentElection.id);
        getRealTimeResults(currentElection.id);
      });

    // Check voting status (user-specific)
    checkVotingStatus(currentElection.id);

    // Fetch results if on results tab
    if (activeTab === "results") {
      fetchResults(currentElection.id);
    }
  }, [currentElection?.id, isAuthenticated, isInitialized, activeTab]);

  const handleCandidateSelect = (candidate: any) => {
    setSelectedCandidateId(candidate.id);
    setShowVoteDialog(true);
  };

  const confirmVoteAction = async () => {
    setShowVoteDialog(false);
    router.push(`/vote?type=${electionType}`);
  };

  const changeElectionType = (typeKey: string) => {
    setElectionType(typeKey);
    router.push(`/dashboard?type=${typeKey}`, { scroll: false });
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    // Implementation would filter candidates based on the search term
  };

  const getUnreadNotificationCount = () => {
    return notifications.filter((n) => !n.read).length;
  };

  const getTotalVotes = () => {
    // Use consolidated dashboard data first
    if (dashboardData?.overview?.totalVotesCast) {
      return dashboardData.overview.totalVotesCast;
    }
    if (electionResults) {
      return electionResults.totalVotes;
    }
    return 0;
  };

  const getVoterTurnout = () => {
    // Use consolidated dashboard data first
    if (dashboardData?.overview?.voterTurnout) {
      return dashboardData.overview.voterTurnout;
    }
    if (electionResults && electionResults.turnout) {
      return electionResults.turnout;
    }
    return 0; // Default fallback
  };

  const getValidVotes = () => {
    // Use consolidated dashboard data first
    if (dashboardData?.overview?.validVotes) {
      return dashboardData.overview.validVotes;
    }
    if (electionResults) {
      // Calculate valid votes from candidates
      return candidates.reduce(
        (total, candidate) => total + (candidate.votes || 0),
        0
      );
    }
    return 0;
  };

  const getInvalidVotes = () => {
    // Use consolidated dashboard data first
    if (dashboardData?.overview?.invalidVotes) {
      return dashboardData.overview.invalidVotes;
    }
    const total = getTotalVotes();
    const valid = getValidVotes();
    return total - valid;
  };

  const getRegisteredVoters = () => {
    // Use consolidated dashboard data first
    if (dashboardData?.overview?.totalRegisteredVoters) {
      return dashboardData.overview.totalRegisteredVoters;
    }
    return 0;
  };

  const getPollingUnitsReported = () => {
    // Use consolidated dashboard data first
    if (dashboardData?.overview?.pollingUnitsReported) {
      return (
        parseInt(dashboardData.overview.pollingUnitsReported.split("/")[0]) || 0
      );
    }
    return 0;
  };

  const getTotalPollingUnits = () => {
    // Use consolidated dashboard data first
    if (dashboardData?.overview?.pollingUnitsReported) {
      return (
        parseInt(dashboardData.overview.pollingUnitsReported.split("/")[1]) || 0
      );
    }
    return 0;
  };

  const getReportingPercentage = () => {
    // Use consolidated dashboard data first
    if (dashboardData?.overview?.reportingPercentage) {
      return dashboardData.overview.reportingPercentage;
    }
    return 0;
  };

  const getRegionalBreakdown = () => {
    // Use consolidated dashboard data first
    if (
      dashboardData?.regional?.breakdown &&
      Array.isArray(dashboardData.regional.breakdown)
    ) {
      return dashboardData.regional.breakdown;
    }
    return [];
  };

  const getCandidateResults = () => {
    // Use consolidated dashboard data first
    if (dashboardData?.candidates && Array.isArray(dashboardData.candidates)) {
      return dashboardData.candidates.map((candidate: any) => ({
        ...candidate,
        name: candidate.fullName || candidate.candidateName,
        party: candidate.partyName,
        partyCode: candidate.partyCode,
        image: candidate.photoUrl,
        votes: candidate.votes || 0,
        percentage: candidate.percentage || 0,
      }));
    }
    // Ensure we always return an array, even if candidates is undefined
    return Array.isArray(candidates) ? candidates : [];
  };

  // Helper functions for consolidated dashboard data
  const getRecentActivity = () => {
    if (
      dashboardData?.realTime?.recentActivity &&
      Array.isArray(dashboardData.realTime.recentActivity)
    ) {
      return dashboardData.realTime.recentActivity;
    }
    return [];
  };

  const getLiveUpdates = () => {
    if (
      dashboardData?.realTime?.liveUpdates &&
      Array.isArray(dashboardData.realTime.liveUpdates)
    ) {
      return dashboardData.realTime.liveUpdates;
    }
    return [];
  };

  const getTurnoutByRegion = () => {
    if (
      dashboardData?.regional?.turnoutByRegion &&
      Array.isArray(dashboardData.regional.turnoutByRegion)
    ) {
      return dashboardData.regional.turnoutByRegion;
    }
    return [];
  };

  const applyFilters = () => {
    // Implementation would filter candidates based on the filter criteria
    setShowFilterDialog(false);
  };

  const resetFilters = () => {
    setFilterCriteria({
      regions: [],
      minVotes: 0,
      maxVotes: 10000000,
      parties: [],
      turnout: [0, 100],
    });
  };

  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((notification) => ({
        ...notification,
        read: true,
      }))
    );
  };

  const handleFilterChange = (type: string, value: any) => {
    setFilterCriteria((prev) => ({
      ...prev,
      [type]: value,
    }));
  };

  // Helper function to ensure we always get an array
  const ensureArray = (data: any): any[] => {
    return Array.isArray(data) ? data : [];
  };

  // Show loading state while authentication is being initialized
  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="text-sm text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // If not authenticated after initialization, show a fallback and redirect
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="text-center">
            <h2 className="text-lg font-semibold">Authentication Required</h2>
            <p className="text-sm text-muted-foreground">
              Redirecting to login...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="flex w-full">
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
              <SidebarGroupLabel>Navigation</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      isActive={activeTab === "overview"}
                      onClick={() => setActiveTab("overview")}
                    >
                      <button>
                        <Home />
                        <span>Overview</span>
                      </button>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      isActive={activeTab === "candidates"}
                      onClick={() => setActiveTab("candidates")}
                    >
                      <button>
                        <Users />
                        <span>Candidates</span>
                      </button>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      isActive={activeTab === "statistics"}
                      onClick={() => setActiveTab("statistics")}
                    >
                      <button>
                        <BarChart3 />
                        <span>Statistics</span>
                      </button>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      isActive={activeTab === "map"}
                      onClick={() => setActiveTab("map")}
                    >
                      <button>
                        <Map />
                        <span>Electoral Map</span>
                      </button>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupLabel>Elections</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {Object.entries(ELECTION_TYPES_MAP).map(
                    ([typeKey, title]) => (
                      <SidebarMenuItem key={typeKey}>
                        <SidebarMenuButton
                          asChild
                          isActive={currentElectionTypeKey === typeKey}
                          onClick={() => changeElectionType(typeKey)}
                        >
                          <button className="flex items-center justify-between w-full">
                            <div className="flex items-center">
                              <Users className="mr-2 h-4 w-4" />
                              <span>{(title as string).split(" ")[0]}</span>
                            </div>
                            {hasVoted[typeKey] && (
                              <Badge
                                variant="outline"
                                className="ml-2 bg-green-500/10 text-green-500 border-green-500/20"
                              >
                                <Check className="mr-1 h-3 w-3" /> Voted
                              </Badge>
                            )}
                          </button>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    )
                  )}
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
                      <span>{user?.fullName || "User Name"}</span>
                      <ChevronDown className="ml-auto h-4 w-4" />
                    </SidebarMenuButton>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard/profile">
                        <User className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard/settings">
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Settings</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => useAuthStore.getState().logout()}
                      className="cursor-pointer"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Logout</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>

        <div className="flex-1">
          <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background px-4 md:px-6">
            <div className="flex items-center gap-2">
              <SidebarTrigger />
              <h1 className="text-lg font-semibold md:text-xl">
                {ELECTION_TYPES_MAP[currentElectionTypeKey]} Dashboard
              </h1>
            </div>

            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="icon"
                onClick={() => {
                  const election = elections.find((e) =>
                    e.type?.toLowerCase().includes(electionType)
                  );
                  if (election) {
                    fetchDashboardData(election.id);
                  }
                }}
                disabled={isDashboardLoading}
                className="rounded-full"
              >
                <RefreshCw
                  className={`h-4 w-4 ${
                    isDashboardLoading ? "animate-spin" : ""
                  }`}
                />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full relative"
                  >
                    <Bell className="h-4 w-4" />
                    {notifications.filter((n) => !n.read).length > 0 && (
                      <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-red-500"></span>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80">
                  <div className="flex items-center justify-between p-4 border-b">
                    <div className="font-semibold">Notifications</div>
                    <Badge variant="outline" className="ml-auto">
                      {notifications.filter((n) => !n.read).length} new
                    </Badge>
                  </div>
                  <ScrollArea className="h-[300px]">
                    <div className="p-2">
                      {notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`mb-2 p-3 rounded-lg ${
                            notification.read ? "bg-background" : "bg-muted/50"
                          } hover:bg-muted cursor-pointer`}
                          onClick={() => {
                            setNotifications((prev) =>
                              prev.map((n) =>
                                n.id === notification.id
                                  ? { ...n, read: true }
                                  : n
                              )
                            );
                          }}
                        >
                          <div className="flex items-start gap-3">
                            <div
                              className={`p-2 rounded-full ${
                                notification.read ? "bg-muted" : "bg-primary/10"
                              }`}
                            >
                              {notification.type === "alert" ? (
                                <AlertCircle className="h-5 w-5" />
                              ) : notification.type === "update" ? (
                                <RefreshCw className="h-5 w-5" />
                              ) : (
                                <Info className="h-5 w-5" />
                              )}
                            </div>
                            <div className="flex-1 space-y-1">
                              <div className="flex items-center justify-between">
                                <p className="text-sm font-medium">
                                  {notification.type === "alert"
                                    ? "Important Alert"
                                    : notification.type === "update"
                                    ? "System Update"
                                    : "Information"}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {notification.time}
                                </p>
                              </div>
                              <p className="text-xs text-muted-foreground">
                                {notification.message}
                              </p>
                            </div>
                            {!notification.read && (
                              <div className="h-2 w-2 rounded-full bg-primary"></div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                  <div className="p-4 border-t">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={markAllAsRead}
                    >
                      Mark all as read
                    </Button>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
              <ThemeToggle />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="hidden md:flex"
                  >
                    <Filter className="mr-2 h-4 w-4" />
                    Filter Results
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[300px]">
                  <div className="p-4 space-y-4">
                    <h4 className="font-medium">Filter Options</h4>

                    <div className="space-y-2">
                      <h5 className="text-sm font-medium">Time Period</h5>
                      <Select
                        value={filterCriteria.turnout[0].toString()}
                        onValueChange={(value) =>
                          handleFilterChange("turnout", [
                            Number(value),
                            filterCriteria.turnout[1],
                          ])
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select time period" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0">All Time</SelectItem>
                          <SelectItem value="1">Today</SelectItem>
                          <SelectItem value="7">This Week</SelectItem>
                          <SelectItem value="30">This Month</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <h5 className="text-sm font-medium">Region</h5>
                      <Select
                        value={filterCriteria.regions.join(",")}
                        onValueChange={(value) =>
                          handleFilterChange("regions", value.split(","))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select regions" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Lagos,Kano,Rivers,FCT,Kaduna">
                            Lagos, Kano, Rivers, FCT, Kaduna
                          </SelectItem>
                          <SelectItem value="Abuja">Abuja</SelectItem>
                          <SelectItem value="Anambra">Anambra</SelectItem>
                          <SelectItem value="Benue">Benue</SelectItem>
                          <SelectItem value="Cross River">
                            Cross River
                          </SelectItem>
                          <SelectItem value="Delta">Delta</SelectItem>
                          <SelectItem value="Edo">Edo</SelectItem>
                          <SelectItem value="Ekiti">Ekiti</SelectItem>
                          <SelectItem value="Enugu">Enugu</SelectItem>
                          <SelectItem value="Imo">Imo</SelectItem>
                          <SelectItem value="Kano">Kano</SelectItem>
                          <SelectItem value="Katsina">Katsina</SelectItem>
                          <SelectItem value="Kebbi">Kebbi</SelectItem>
                          <SelectItem value="Kogi">Kogi</SelectItem>
                          <SelectItem value="Kwara">Kwara</SelectItem>
                          <SelectItem value="Lagos">Lagos</SelectItem>
                          <SelectItem value="Nasarawa">Nasarawa</SelectItem>
                          <SelectItem value="Ogun">Ogun</SelectItem>
                          <SelectItem value="Ondo">Ondo</SelectItem>
                          <SelectItem value="Osun">Osun</SelectItem>
                          <SelectItem value="Plateau">Plateau</SelectItem>
                          <SelectItem value="Rivers">Rivers</SelectItem>
                          <SelectItem value="Sokoto">Sokoto</SelectItem>
                          <SelectItem value="Taraba">Taraba</SelectItem>
                          <SelectItem value="Yobe">Yobe</SelectItem>
                          <SelectItem value="Zamfara">Zamfara</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <h5 className="text-sm font-medium">Party</h5>
                      <Select
                        value={filterCriteria.parties.join(",")}
                        onValueChange={(value) =>
                          handleFilterChange("parties", value.split(","))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select parties" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="APC">APC</SelectItem>
                          <SelectItem value="PDP">PDP</SelectItem>
                          <SelectItem value="LP">LP</SelectItem>
                          <SelectItem value="NNPP">NNPP</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <h5 className="text-sm font-medium">Voter Turnout</h5>
                      <div className="px-2">
                        <Slider
                          value={filterCriteria.turnout}
                          min={0}
                          max={100}
                          step={1}
                          onValueChange={(value) =>
                            handleFilterChange("turnout", value)
                          }
                        />
                        <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                          <span>{filterCriteria.turnout[0]}%</span>
                          <span>{filterCriteria.turnout[1]}%</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={resetFilters}
                      >
                        Reset
                      </Button>
                      <Button size="sm" onClick={applyFilters}>
                        Apply Filters
                      </Button>
                    </div>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>

          <main className="flex-1 p-4 md:p-6">
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="space-y-6"
            >
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="candidates">Candidates</TabsTrigger>
                <TabsTrigger value="statistics">Statistics</TabsTrigger>
                <TabsTrigger value="map">Map</TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-6">
                {/* Election Progress */}
                <div className="grid gap-6 md:grid-cols-4">
                  <Card className="transition-all duration-300 hover:shadow-md">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">
                        Total Votes Cast
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {getTotalVotes().toLocaleString()}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {getRegisteredVoters() > 0
                          ? `${(
                              (getTotalVotes() / getRegisteredVoters()) *
                              100
                            ).toFixed(1)}% of registered voters`
                          : "Real-time updates"}
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
                      <div className="text-2xl font-bold">
                        {getVoterTurnout().toFixed(1)}%
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {getRegisteredVoters().toLocaleString()} registered
                        voters
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="transition-all duration-300 hover:shadow-md">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">
                        Polling Units Reported
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {getPollingUnitsReported().toLocaleString()}/
                        {getTotalPollingUnits().toLocaleString()}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {getReportingPercentage().toFixed(1)}% reporting
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="transition-all duration-300 hover:shadow-md">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">
                        Valid Votes
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {getValidVotes().toLocaleString()}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {getTotalVotes() > 0
                          ? `${(
                              (getValidVotes() / getTotalVotes()) *
                              100
                            ).toFixed(1)}% valid`
                          : "No votes yet"}
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {/* Charts */}
                <div className="grid gap-6 md:grid-cols-2">
                  <Card className="transition-all duration-300 hover:shadow-md">
                    <CardHeader>
                      <CardTitle>Vote Distribution</CardTitle>
                      <CardDescription>
                        Votes by political party
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="h-80">
                      <BarChart
                        data={ensureArray(getCandidateResults())
                          .slice(0, 4)
                          .map((c: any) => ({
                            name: c.partyCode || c.party,
                            votes: c.votes || 0,
                          }))}
                        index="name"
                        categories={["votes"]}
                        colors={["emerald"]}
                        valueFormatter={(value) =>
                          `${(value / 1000000).toFixed(1)}M votes`
                        }
                        yAxisWidth={60}
                      />
                    </CardContent>
                  </Card>

                  <Card className="transition-all duration-300 hover:shadow-md">
                    <CardHeader>
                      <CardTitle>Percentage Breakdown</CardTitle>
                      <CardDescription>
                        Vote share by political party
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="h-80">
                      <PieChart
                        data={ensureArray(getCandidateResults())
                          .slice(0, 5)
                          .map((c: any) => ({
                            name: c.partyCode || c.party,
                            value: c.percentage || 0,
                          }))}
                        index="name"
                        categories={["value"]}
                        colors={["emerald", "red", "blue", "yellow", "purple"]}
                        valueFormatter={(value) => `${value}%`}
                      />
                    </CardContent>
                  </Card>
                </div>

                {/* Live Updates */}
                <Card className="transition-all duration-300 hover:shadow-md">
                  <CardHeader className="flex flex-row items-center">
                    <div className="flex-1">
                      <CardTitle>Live Updates</CardTitle>
                      <CardDescription>
                        Real-time election news and announcements
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-green-500 pulse-animation"></div>
                      <span className="text-xs font-medium">Live</span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Show recent activity from API if available */}
                      {ensureArray(getRecentActivity()).length > 0 ? (
                        ensureArray(getRecentActivity())
                          .slice(0, 10)
                          .map((activity) => (
                            <div
                              key={activity.id}
                              className="flex gap-4 border-b pb-4 last:border-b-0"
                            >
                              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                                {activity.source === "web" && (
                                  <Globe className="h-5 w-5 text-primary" />
                                )}
                                {activity.source === "mobile" && (
                                  <User className="h-5 w-5 text-primary" />
                                )}
                                {activity.source === "ussd" && (
                                  <MessageSquare className="h-5 w-5 text-primary" />
                                )}
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <h4 className="font-semibold">
                                    Vote Cast - {activity.pollingUnit}
                                  </h4>
                                  <span className="text-xs text-muted-foreground">
                                    {new Date(
                                      activity.timestamp
                                    ).toLocaleString()}
                                  </span>
                                </div>
                                <p className="text-sm">
                                  Vote for {activity.candidate} (
                                  {activity.party}) from {activity.state},{" "}
                                  {activity.lga} via {activity.source}
                                </p>
                              </div>
                            </div>
                          ))
                      ) : ensureArray(getLiveUpdates()).length > 0 ? (
                        ensureArray(getLiveUpdates()).map((update) => (
                          <div
                            key={update.id}
                            className="flex gap-4 border-b pb-4 last:border-b-0"
                          >
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                              {update.type === "announcement" && (
                                <Clock className="h-5 w-5 text-primary" />
                              )}
                              {update.type === "results" && (
                                <BarChart3 className="h-5 w-5 text-primary" />
                              )}
                              {update.type === "security" && (
                                <AlertCircle className="h-5 w-5 text-primary" />
                              )}
                              {update.type === "update" && (
                                <RefreshCw className="h-5 w-5 text-primary" />
                              )}
                              {update.type === "alert" && (
                                <AlertCircle className="h-5 w-5 text-primary" />
                              )}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="font-semibold">
                                  {update.title}
                                </h4>
                                <span className="text-xs text-muted-foreground">
                                  {new Date(update.timestamp).toLocaleString()}
                                </span>
                              </div>
                              <p className="text-sm">{update.message}</p>
                            </div>
                          </div>
                        ))
                      ) : (
                        // Fallback to static updates if no live updates available
                        <>
                          <div className="flex gap-4 border-b pb-4">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                              <Clock className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="font-semibold">
                                  INEC Announcement
                                </h4>
                                <span className="text-xs text-muted-foreground">
                                  2 minutes ago
                                </span>
                              </div>
                              <p className="text-sm">
                                Polls will remain open for the full 3-week
                                period to accommodate all voters.
                              </p>
                            </div>
                          </div>

                          <div className="flex gap-4 border-b pb-4">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                              <BarChart3 className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="font-semibold">
                                  Results Update
                                </h4>
                                <span className="text-xs text-muted-foreground">
                                  15 minutes ago
                                </span>
                              </div>
                              <p className="text-sm">
                                Lagos State has reported 85% of polling units.
                                Current turnout at 68%.
                              </p>
                            </div>
                          </div>

                          <div className="flex gap-4 border-b pb-4">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                              <AlertCircle className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="font-semibold">
                                  Security Alert
                                </h4>
                                <span className="text-xs text-muted-foreground">
                                  30 minutes ago
                                </span>
                              </div>
                              <p className="text-sm">
                                Secure Ballot has detected and blocked several
                                unauthorized access attempts. All votes remain
                                secure and uncompromised.
                              </p>
                            </div>
                          </div>

                          <div className="flex gap-4 border-b pb-4">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                              <MessageSquare className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="font-semibold">
                                  Candidate Statement
                                </h4>
                                <span className="text-xs text-muted-foreground">
                                  45 minutes ago
                                </span>
                              </div>
                              <p className="text-sm">
                                Bola Ahmed Tinubu urges supporters to remain
                                calm as results continue to come in.
                              </p>
                            </div>
                          </div>

                          <div className="flex gap-4 border-b pb-4">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                              <TrendingUp className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="font-semibold">
                                  Turnout Milestone
                                </h4>
                                <span className="text-xs text-muted-foreground">
                                  1 hour ago
                                </span>
                              </div>
                              <p className="text-sm">
                                National voter turnout has reached 50% - the
                                highest in Nigeria's electoral history at this
                                stage.
                              </p>
                            </div>
                          </div>

                          <div className="flex gap-4 border-b pb-4">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                              <MapPin className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="font-semibold">
                                  Regional Update
                                </h4>
                                <span className="text-xs text-muted-foreground">
                                  1.5 hours ago
                                </span>
                              </div>
                              <p className="text-sm">
                                South East region reports record-breaking 72%
                                turnout with LP leading in 4 out of 5 states.
                              </p>
                            </div>
                          </div>

                          <div className="flex gap-4 border-b pb-4">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                              <ShieldCheck className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="font-semibold">System Update</h4>
                                <span className="text-xs text-muted-foreground">
                                  2 hours ago
                                </span>
                              </div>
                              <p className="text-sm">
                                Secure Ballot has successfully processed over 20
                                million votes with zero system downtime.
                              </p>
                            </div>
                          </div>

                          <div className="flex gap-4 border-b pb-4">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                              <MessageSquare className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="font-semibold">
                                  Candidate Statement
                                </h4>
                                <span className="text-xs text-muted-foreground">
                                  2.5 hours ago
                                </span>
                              </div>
                              <p className="text-sm">
                                Peter Obi thanks supporters and emphasizes the
                                importance of peaceful democratic process.
                              </p>
                            </div>
                          </div>

                          <div className="flex gap-4 border-b pb-4">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                              <Users className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="font-semibold">
                                  Demographic Insight
                                </h4>
                                <span className="text-xs text-muted-foreground">
                                  3 hours ago
                                </span>
                              </div>
                              <p className="text-sm">
                                Youth voter participation (18-35) has increased
                                by 27% compared to the 2023 elections.
                              </p>
                            </div>
                          </div>

                          <div className="flex gap-4">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                              <Globe className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="font-semibold">
                                  International Observers
                                </h4>
                                <span className="text-xs text-muted-foreground">
                                  3.5 hours ago
                                </span>
                              </div>
                              <p className="text-sm">
                                EU Election Observation Mission praises
                                Nigeria's digital voting system for transparency
                                and security.
                              </p>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Candidates Tab */}
              <TabsContent value="candidates" className="space-y-6">
                <Card>
                  <CardHeader>
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                      <div>
                        <CardTitle>
                          {ELECTION_TYPES_MAP[currentElectionTypeKey]}{" "}
                          Candidates
                        </CardTitle>
                        <CardDescription>
                          {hasVoted[currentElectionTypeKey]
                            ? "You have already voted in this election"
                            : "Select a candidate to cast your vote"}
                        </CardDescription>
                      </div>
                      {hasVoted[currentElectionTypeKey] && (
                        <Badge className="mt-2 md:mt-0 bg-green-500/10 text-green-500 border-green-500/20 px-3 py-1">
                          <Check className="mr-1 h-4 w-4" /> Vote Cast
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-4">
                      <div className="relative">
                        <Input
                          type="search"
                          placeholder="Search candidates by name or party..."
                          className="pl-10"
                          value={searchTerm}
                          onChange={(e) => handleSearch(e.target.value)}
                        />
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                          <Search className="h-4 w-4" />
                        </div>
                      </div>
                    </div>
                    {isLoading || isDashboardLoading ? (
                      <div className="space-y-4">
                        {[1, 2, 3, 4].map((i) => (
                          <div
                            key={i}
                            className="flex items-center rounded-lg border p-4 animate-pulse"
                          >
                            <div className="mr-4 h-16 w-16 rounded-full bg-muted"></div>
                            <div className="flex-1">
                              <div className="h-5 w-32 bg-muted rounded mb-2"></div>
                              <div className="h-4 w-20 bg-muted rounded"></div>
                            </div>
                            <div className="text-right">
                              <div className="h-5 w-20 bg-muted rounded mb-2"></div>
                              <div className="h-4 w-24 bg-muted rounded"></div>
                            </div>
                            <div className="ml-4 h-full w-2 rounded-full bg-muted"></div>
                          </div>
                        ))}
                      </div>
                    ) : ensureArray(candidates).length === 0 ? (
                      <div className="text-center py-8">
                        <div className="mx-auto w-12 h-12 rounded-full bg-muted/50 flex items-center justify-center mb-3">
                          <Search className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <h3 className="text-lg font-medium">
                          No candidates found
                        </h3>
                        <p className="text-muted-foreground mt-1">
                          Try a different search term
                        </p>
                        <Button
                          variant="outline"
                          className="mt-4"
                          onClick={() => {
                            setSearchTerm("");
                            // Reset search results
                          }}
                        >
                          Clear search
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {ensureArray(getCandidateResults()).map(
                          (candidate: any) => (
                            <div
                              key={candidate.id}
                              className={`flex items-center rounded-lg border p-4 transition-all duration-300 ${
                                hasVoted[currentElectionTypeKey] ===
                                candidate.id
                                  ? "border-green-500 bg-green-500/5"
                                  : hasVoted[currentElectionTypeKey]
                                  ? "opacity-80 hover:bg-muted/30"
                                  : "cursor-pointer hover:bg-muted/50 hover:scale-[1.01] hover:shadow-md"
                              }`}
                              onClick={() =>
                                !hasVoted[currentElectionTypeKey] &&
                                handleCandidateSelect(candidate)
                              }
                            >
                              <div className="mr-4 h-16 w-16 overflow-hidden rounded-full">
                                <img
                                  src={candidate.image || "/placeholder.svg"}
                                  alt={candidate.name}
                                  className="h-full w-full object-cover"
                                />
                              </div>
                              <div className="flex-1">
                                <h3 className="font-semibold flex items-center">
                                  {candidate.name}
                                  {hasVoted[currentElectionTypeKey] ===
                                    candidate.id && (
                                    <Check className="ml-2 h-4 w-4 text-green-500" />
                                  )}
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                  {candidate.party}
                                </p>
                              </div>
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <div className="text-right">
                                      <div className="font-bold">
                                        {(
                                          (candidate.votes || 0) / 1000000
                                        ).toFixed(1)}
                                        M
                                      </div>
                                      <div className="text-sm text-muted-foreground">
                                        {candidate.percentage || 0}% of votes
                                      </div>
                                    </div>
                                  </TooltipTrigger>
                                  <TooltipContent
                                    side="left"
                                    className="max-w-xs"
                                  >
                                    <div className="space-y-2">
                                      <p className="font-semibold">
                                        {candidate.name} ({candidate.party})
                                      </p>
                                      <p className="text-sm">{candidate.bio}</p>
                                      <p className="text-sm">
                                        <span className="font-medium">
                                          Manifesto:
                                        </span>{" "}
                                        {candidate.manifesto ||
                                          "No manifesto available"}
                                      </p>
                                    </div>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                              <div
                                className="ml-4 h-full w-2 rounded-full"
                                style={{ backgroundColor: candidate.color }}
                              ></div>
                            </div>
                          )
                        )}
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <p className="text-sm text-muted-foreground">
                      {hasVoted[currentElectionTypeKey]
                        ? "Thank you for voting in this election"
                        : "Click on a candidate to cast your vote"}
                    </p>
                    {!hasVoted[currentElectionTypeKey] && (
                      <Button asChild className="ml-auto">
                        <Link href={`/vote?type=${currentElectionTypeKey}`}>
                          Vote Now
                        </Link>
                      </Button>
                    )}
                  </CardFooter>
                </Card>

                {/* Candidate Comparison */}
                <Card>
                  <CardHeader>
                    <CardTitle>Candidate Comparison</CardTitle>
                    <CardDescription>
                      Compare candidates side by side
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full min-w-[600px]">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left p-2">Candidate</th>
                            <th className="text-left p-2">Party</th>
                            <th className="text-left p-2">Key Policies</th>
                            <th className="text-left p-2">Current Votes</th>
                            <th className="text-left p-2">Percentage</th>
                          </tr>
                        </thead>
                        <tbody>
                          {ensureArray(getCandidateResults()).map(
                            (candidate: any) => (
                              <tr
                                key={candidate.id}
                                className="border-b hover:bg-muted/30"
                              >
                                <td className="p-2 flex items-center gap-2">
                                  <div className="h-8 w-8 rounded-full overflow-hidden">
                                    <img
                                      src={
                                        candidate.image || "/placeholder.svg"
                                      }
                                      alt={candidate.name}
                                      className="h-full w-full object-cover"
                                    />
                                  </div>
                                  <span>{candidate.name}</span>
                                </td>
                                <td className="p-2">{candidate.party}</td>
                                <td className="p-2">
                                  {candidate.manifesto ||
                                    "No manifesto available"}
                                </td>
                                <td className="p-2">
                                  {(candidate.votes || 0).toLocaleString()}
                                </td>
                                <td className="p-2">
                                  <div className="flex items-center gap-2">
                                    <Progress
                                      value={candidate.percentage || 0}
                                      className="h-2 w-20"
                                    />
                                    <span>{candidate.percentage || 0}%</span>
                                  </div>
                                </td>
                              </tr>
                            )
                          )}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Statistics Tab */}
              <TabsContent value="statistics" className="space-y-6">
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                  <Card className="flex-1">
                    <CardHeader>
                      <CardTitle>Election Statistics</CardTitle>
                      <CardDescription>
                        Detailed breakdown of voting patterns
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Tabs defaultValue="overview">
                        <TabsList className="grid w-full grid-cols-4">
                          <TabsTrigger value="overview">Overview</TabsTrigger>
                          <TabsTrigger value="state">By State</TabsTrigger>
                          <TabsTrigger value="demographic">By Age</TabsTrigger>
                          <TabsTrigger value="gender">By Gender</TabsTrigger>
                        </TabsList>

                        <TabsContent value="overview" className="pt-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                            <Card className="bg-black/10 dark:bg-white/5 backdrop-blur-sm border-border/50 hover:shadow-md transition-all duration-300">
                              <CardHeader className="pb-2">
                                <div className="flex items-center gap-2">
                                  <div className="p-2 rounded-full bg-primary/10">
                                    <Users className="h-4 w-4 text-primary" />
                                  </div>
                                  <CardTitle className="text-sm font-medium">
                                    Registered Voters
                                  </CardTitle>
                                </div>
                              </CardHeader>
                              <CardContent>
                                <div className="text-2xl font-bold">
                                  {getRegisteredVoters().toLocaleString()}
                                </div>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                  <span>Total eligible voters</span>
                                </div>
                              </CardContent>
                            </Card>

                            <Card className="bg-black/10 dark:bg-white/5 backdrop-blur-sm border-border/50 hover:shadow-md transition-all duration-300">
                              <CardHeader className="pb-2">
                                <div className="flex items-center gap-2">
                                  <div className="p-2 rounded-full bg-primary/10">
                                    <CreditCard className="h-4 w-4 text-primary" />
                                  </div>
                                  <CardTitle className="text-sm font-medium">
                                    Total Votes Cast
                                  </CardTitle>
                                </div>
                              </CardHeader>
                              <CardContent>
                                <div className="text-2xl font-bold">
                                  {getTotalVotes().toLocaleString()}
                                </div>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                  <span>
                                    {getVoterTurnout().toFixed(1)}% turnout rate
                                  </span>
                                </div>
                              </CardContent>
                            </Card>

                            <Card className="bg-black/10 dark:bg-white/5 backdrop-blur-sm border-border/50 hover:shadow-md transition-all duration-300">
                              <CardHeader className="pb-2">
                                <div className="flex items-center gap-2">
                                  <div className="p-2 rounded-full bg-primary/10">
                                    <UserCheck className="h-4 w-4 text-primary" />
                                  </div>
                                  <CardTitle className="text-sm font-medium">
                                    Polling Units
                                  </CardTitle>
                                </div>
                              </CardHeader>
                              <CardContent>
                                <div className="text-2xl font-bold">
                                  {getPollingUnitsReported().toLocaleString()}/
                                  {getTotalPollingUnits().toLocaleString()}
                                </div>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                  <span>
                                    {getReportingPercentage().toFixed(1)}%
                                    reporting
                                  </span>
                                </div>
                              </CardContent>
                            </Card>

                            <Card className="bg-black/10 dark:bg-white/5 backdrop-blur-sm border-border/50 hover:shadow-md transition-all duration-300">
                              <CardHeader className="pb-2">
                                <div className="flex items-center gap-2">
                                  <div className="p-2 rounded-full bg-primary/10">
                                    <CheckCircle className="h-4 w-4 text-primary" />
                                  </div>
                                  <CardTitle className="text-sm font-medium">
                                    Valid Votes
                                  </CardTitle>
                                </div>
                              </CardHeader>
                              <CardContent>
                                <div className="text-2xl font-bold">
                                  {getValidVotes().toLocaleString()}
                                </div>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                  <span>
                                    {getTotalVotes() > 0
                                      ? (
                                          (getValidVotes() / getTotalVotes()) *
                                          100
                                        ).toFixed(1)
                                      : 0}
                                    % of total votes cast
                                  </span>
                                </div>
                              </CardContent>
                            </Card>

                            <Card className="bg-black/10 dark:bg-white/5 backdrop-blur-sm border-border/50 hover:shadow-md transition-all duration-300">
                              <CardHeader className="pb-2">
                                <div className="flex items-center gap-2">
                                  <div className="p-2 rounded-full bg-primary/10">
                                    <XCircle className="h-4 w-4 text-primary" />
                                  </div>
                                  <CardTitle className="text-sm font-medium">
                                    Invalid Votes
                                  </CardTitle>
                                </div>
                              </CardHeader>
                              <CardContent>
                                <div className="text-2xl font-bold">
                                  {getInvalidVotes().toLocaleString()}
                                </div>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                  <span>
                                    {getTotalVotes() > 0
                                      ? (
                                          (getInvalidVotes() /
                                            getTotalVotes()) *
                                          100
                                        ).toFixed(1)
                                      : 0}
                                    % of total votes cast
                                  </span>
                                </div>
                              </CardContent>
                            </Card>

                            <Card className="bg-black/10 dark:bg-white/5 backdrop-blur-sm border-border/50 hover:shadow-md transition-all duration-300">
                              <CardHeader className="pb-2">
                                <div className="flex items-center gap-2">
                                  <div className="p-2 rounded-full bg-primary/10">
                                    <Percent className="h-4 w-4 text-primary" />
                                  </div>
                                  <CardTitle className="text-sm font-medium">
                                    Voter Turnout
                                  </CardTitle>
                                </div>
                              </CardHeader>
                              <CardContent>
                                <div className="text-2xl font-bold">62.5%</div>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                  <ArrowUp className="h-3 w-3 text-green-500" />
                                  <span>7.3% from 2019 election</span>
                                </div>
                              </CardContent>
                            </Card>
                          </div>

                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <h3 className="text-sm font-medium">
                                Voter Turnout by Geopolitical Zone
                              </h3>
                              <Select defaultValue="all">
                                <SelectTrigger className="w-[180px] h-8 text-xs">
                                  <SelectValue placeholder="Select Zone" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="all">All Zones</SelectItem>
                                  <SelectItem value="nc">
                                    North Central
                                  </SelectItem>
                                  <SelectItem value="ne">North East</SelectItem>
                                  <SelectItem value="nw">North West</SelectItem>
                                  <SelectItem value="se">South East</SelectItem>
                                  <SelectItem value="ss">
                                    South South
                                  </SelectItem>
                                  <SelectItem value="sw">South West</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            <div className="space-y-4">
                              {ensureArray(getTurnoutByRegion()).length > 0 ? (
                                ensureArray(getTurnoutByRegion()).map(
                                  (region: any) => (
                                    <div
                                      key={region.regionName}
                                      className="space-y-2"
                                    >
                                      <div className="flex items-center justify-between">
                                        <span className="text-sm">
                                          {region.regionName}
                                        </span>
                                        <span className="text-sm font-medium">
                                          {region.turnoutPercentage.toFixed(1)}%
                                        </span>
                                      </div>
                                      <Progress
                                        value={region.turnoutPercentage}
                                        className="h-2"
                                      />
                                      <div className="text-xs text-muted-foreground">
                                        {region.statesReported}/
                                        {region.totalStatesInZone} states
                                        reported
                                      </div>
                                    </div>
                                  )
                                )
                              ) : (
                                // Fallback to static data if API data not available
                                <>
                                  <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                      <span className="text-sm">
                                        North Central
                                      </span>
                                      <span className="text-sm font-medium">
                                        67%
                                      </span>
                                    </div>
                                    <Progress value={67} className="h-2" />
                                  </div>

                                  <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                      <span className="text-sm">
                                        North East
                                      </span>
                                      <span className="text-sm font-medium">
                                        58%
                                      </span>
                                    </div>
                                    <Progress value={58} className="h-2" />
                                  </div>

                                  <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                      <span className="text-sm">
                                        North West
                                      </span>
                                      <span className="text-sm font-medium">
                                        72%
                                      </span>
                                    </div>
                                    <Progress value={72} className="h-2" />
                                  </div>

                                  <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                      <span className="text-sm">
                                        South East
                                      </span>
                                      <span className="text-sm font-medium">
                                        54%
                                      </span>
                                    </div>
                                    <Progress value={54} className="h-2" />
                                  </div>

                                  <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                      <span className="text-sm">
                                        South South
                                      </span>
                                      <span className="text-sm font-medium">
                                        61%
                                      </span>
                                    </div>
                                    <Progress value={61} className="h-2" />
                                  </div>

                                  <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                      <span className="text-sm">
                                        South West
                                      </span>
                                      <span className="text-sm font-medium">
                                        65%
                                      </span>
                                    </div>
                                    <Progress value={65} className="h-2" />
                                  </div>
                                </>
                              )}
                            </div>
                          </div>
                        </TabsContent>

                        <TabsContent value="state" className="h-80 pt-4">
                          <BarChart
                            data={ensureArray(getTurnoutByRegion())
                              .slice(0, 10)
                              .map((region: any) => ({
                                name: region.regionName || region.state,
                                turnout: region.turnoutPercentage || 0,
                              }))}
                            index="name"
                            categories={["turnout"]}
                            colors={["blue"]}
                            valueFormatter={(value) => `${value}%`}
                            yAxisWidth={60}
                          />
                        </TabsContent>

                        <TabsContent value="demographic" className="h-80 pt-4">
                          <BarChart
                            data={[
                              { age: "18-25", percentage: 22 },
                              { age: "26-35", percentage: 35 },
                              { age: "36-45", percentage: 25 },
                              { age: "46-60", percentage: 12 },
                              { age: "60+", percentage: 6 },
                            ]}
                            index="age"
                            categories={["percentage"]}
                            colors={["purple"]}
                            valueFormatter={(value) => `${value}%`}
                            yAxisWidth={60}
                          />
                        </TabsContent>

                        <TabsContent value="gender" className="h-80 pt-4">
                          <PieChart
                            data={[
                              { gender: "Male", percentage: 52 },
                              { gender: "Female", percentage: 48 },
                            ]}
                            index="gender"
                            categories={["percentage"]}
                            colors={["blue", "pink"]}
                            valueFormatter={(value) => `${value}%`}
                          />
                        </TabsContent>
                      </Tabs>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Detailed Statistics</CardTitle>
                    <CardDescription>
                      Comprehensive election data
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-6 md:grid-cols-3">
                      <div className="space-y-2">
                        <h3 className="font-medium">Total Votes Cast</h3>
                        <div className="text-2xl font-bold">
                          {getTotalVotes().toLocaleString()}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          All votes recorded
                        </p>
                      </div>

                      <div className="space-y-2">
                        <h3 className="font-medium">Valid Votes</h3>
                        <div className="text-2xl font-bold">
                          {getValidVotes().toLocaleString()}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {getTotalVotes() > 0
                            ? (
                                (getValidVotes() / getTotalVotes()) *
                                100
                              ).toFixed(1)
                            : 0}
                          % of total
                        </p>
                      </div>

                      <div className="space-y-2">
                        <h3 className="font-medium">Invalid Votes</h3>
                        <div className="text-2xl font-bold">
                          {getInvalidVotes().toLocaleString()}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {getTotalVotes() > 0
                            ? (
                                (getInvalidVotes() / getTotalVotes()) *
                                100
                              ).toFixed(1)
                            : 0}
                          % of total
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Map Tab */}
              <TabsContent value="map" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Electoral Map</CardTitle>
                    <CardDescription>
                      Interactive map showing election results across Nigerian
                      states
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ElectoralMap height="500px" showLegend={true} />
                  </CardContent>
                </Card>

                <div className="grid gap-6 md:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Regional Breakdown</CardTitle>
                      <CardDescription>
                        Vote distribution by geopolitical zone
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {ensureArray(getRegionalBreakdown()).length > 0 ? (
                          ensureArray(getRegionalBreakdown()).map(
                            (region: any) => (
                              <div
                                key={region.region_name}
                                className="space-y-2"
                              >
                                <div className="flex items-center justify-between">
                                  <span>{region.region_name}</span>
                                  <span className="font-medium">
                                    {region.percentage.toFixed(1)}%
                                  </span>
                                </div>
                                <Progress
                                  value={region.percentage}
                                  className="h-2"
                                />
                                <div className="text-xs text-muted-foreground">
                                  {region.vote_count.toLocaleString()} votes •{" "}
                                  {region.states_reported}/
                                  {region.total_states_in_zone} states reported
                                </div>
                              </div>
                            )
                          )
                        ) : (
                          // Fallback to static data if API data not available
                          <>
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <span>North Central</span>
                                <span className="font-medium">32%</span>
                              </div>
                              <Progress value={32} className="h-2" />
                            </div>

                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <span>North East</span>
                                <span className="font-medium">28%</span>
                              </div>
                              <Progress value={28} className="h-2" />
                            </div>

                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <span>North West</span>
                                <span className="font-medium">45%</span>
                              </div>
                              <Progress value={45} className="h-2" />
                            </div>

                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <span>South East</span>
                                <span className="font-medium">38%</span>
                              </div>
                              <Progress value={38} className="h-2" />
                            </div>

                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <span>South South</span>
                                <span className="font-medium">41%</span>
                              </div>
                              <Progress value={41} className="h-2" />
                            </div>

                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <span>South West</span>
                                <span className="font-medium">52%</span>
                              </div>
                              <Progress value={52} className="h-2" />
                            </div>
                          </>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Leading Party by State</CardTitle>
                      <CardDescription>
                        Current leading party in each state
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ScrollArea className="h-[300px] pr-4">
                        <div className="space-y-4">
                          {[
                            { state: "Abia", party: "LP", percentage: 48 },
                            { state: "Adamawa", party: "PDP", percentage: 52 },
                            {
                              state: "Akwa Ibom",
                              party: "PDP",
                              percentage: 55,
                            },
                            { state: "Anambra", party: "LP", percentage: 63 },
                            { state: "Bauchi", party: "APC", percentage: 47 },
                            { state: "Bayelsa", party: "PDP", percentage: 51 },
                            { state: "Benue", party: "LP", percentage: 42 },
                            { state: "Borno", party: "APC", percentage: 58 },
                            {
                              state: "Cross River",
                              party: "APC",
                              percentage: 45,
                            },
                            { state: "Delta", party: "PDP", percentage: 49 },
                            { state: "Ebonyi", party: "APC", percentage: 46 },
                            { state: "Edo", party: "LP", percentage: 44 },
                            { state: "Ekiti", party: "APC", percentage: 53 },
                            { state: "Enugu", party: "LP", percentage: 61 },
                            { state: "FCT", party: "LP", percentage: 59 },
                            { state: "Gombe", party: "APC", percentage: 54 },
                            { state: "Imo", party: "APC", percentage: 47 },
                            { state: "Jigawa", party: "APC", percentage: 56 },
                            { state: "Kaduna", party: "APC", percentage: 51 },
                            { state: "Kano", party: "NNPP", percentage: 48 },
                            { state: "Katsina", party: "APC", percentage: 53 },
                            { state: "Kebbi", party: "APC", percentage: 57 },
                            { state: "Kogi", party: "APC", percentage: 49 },
                            { state: "Kwara", party: "APC", percentage: 52 },
                            { state: "Lagos", party: "APC", percentage: 47 },
                            { state: "Nasarawa", party: "APC", percentage: 45 },
                            { state: "Niger", party: "APC", percentage: 54 },
                            { state: "Ogun", party: "APC", percentage: 48 },
                            { state: "Ondo", party: "APC", percentage: 46 },
                            { state: "Osun", party: "APC", percentage: 45 },
                            { state: "Oyo", party: "PDP", percentage: 44 },
                            { state: "Plateau", party: "LP", percentage: 43 },
                            { state: "Rivers", party: "PDP", percentage: 46 },
                            { state: "Sokoto", party: "APC", percentage: 51 },
                            { state: "Taraba", party: "PDP", percentage: 48 },
                            { state: "Yobe", party: "APC", percentage: 59 },
                            { state: "Zamfara", party: "APC", percentage: 55 },
                          ].map((item) => (
                            <div key={item.state} className="space-y-2">
                              <div className="flex items-center justify-between">
                                <span>{item.state}</span>
                                <Badge
                                  variant="outline"
                                  className={`
                                  ${
                                    item.party === "APC"
                                      ? "bg-blue-500/10 text-blue-500 border-blue-500/20"
                                      : ""
                                  }
                                  ${
                                    item.party === "PDP"
                                      ? "bg-red-500/10 text-red-500 border-red-500/20"
                                      : ""
                                  }
                                  ${
                                    item.party === "LP"
                                      ? "bg-green-500/10 text-green-500 border-green-500/20"
                                      : ""
                                  }
                                  ${
                                    item.party === "NNPP"
                                      ? "bg-purple-500/10 text-purple-500 border-purple-500/20"
                                      : ""
                                  }
                                `}
                                >
                                  {item.party} ({item.percentage}%)
                                </Badge>
                              </div>
                              <Progress
                                value={item.percentage}
                                className={`h-1.5 ${
                                  item.party === "APC"
                                    ? "bg-blue-100 dark:bg-blue-950"
                                    : item.party === "PDP"
                                    ? "bg-red-100 dark:bg-red-950"
                                    : item.party === "LP"
                                    ? "bg-green-100 dark:bg-green-950"
                                    : "bg-purple-100 dark:bg-purple-950"
                                }`}
                              />
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Vote Confirmation Dialog */}
              <Dialog open={showVoteDialog} onOpenChange={setShowVoteDialog}>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Confirm Your Vote</DialogTitle>
                    <DialogDescription>
                      You are about to cast your vote in the{" "}
                      {ELECTION_TYPES_MAP[currentElectionTypeKey]}. This action
                      cannot be undone.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="flex items-center space-x-4 py-4">
                    {selectedCandidateId && (
                      <>
                        <div className="h-16 w-16 overflow-hidden rounded-full">
                          <img
                            src={
                              candidates.find(
                                (c) => c.id === selectedCandidateId
                              )?.image || "/placeholder.svg"
                            }
                            alt="Selected candidate"
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div>
                          <h4 className="font-medium">
                            {
                              candidates.find(
                                (c) => c.id === selectedCandidateId
                              )?.name
                            }
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {
                              candidates.find(
                                (c) => c.id === selectedCandidateId
                              )?.party
                            }
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                  <DialogFooter>
                    <Button type="submit" onClick={confirmVoteAction}>
                      Confirm
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </Tabs>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

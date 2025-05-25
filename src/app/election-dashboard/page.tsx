"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  BarChart3,
  ChevronDown,
  Download,
  Home,
  Info,
  LogOut,
  MapIcon,
  RefreshCw,
  Settings,
  Share2,
  User,
  Users,
  Clock,
  AlertCircle,
  MessageSquare,
  TrendingUp,
  MapPin,
  ShieldCheck,
  Globe,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ThemeToggle } from "@/components/theme-toggle"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
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
} from "@/components/ui/sidebar"
import { ElectionCharts } from "@/components/election-charts"
import { ElectoralMap } from "@/components/electoral-map"
import { useElectionData } from "@/hooks/useElectionData"
import { useResults } from "@/hooks/useResults"
import { useUIStore } from "@/store/useStore"

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
}

// Regional data
const regionalData = [
  { region: "North Central", apc: 2100000, pdp: 1800000, lp: 1200000, nnpp: 400000, others: 200000 },
  { region: "North East", apc: 2400000, pdp: 1500000, lp: 800000, nnpp: 300000, others: 150000 },
  { region: "North West", apc: 3200000, pdp: 1900000, lp: 1000000, nnpp: 600000, others: 250000 },
  { region: "South East", apc: 500000, pdp: 800000, lp: 2500000, nnpp: 100000, others: 150000 },
  { region: "South South", apc: 900000, pdp: 1800000, lp: 1600000, nnpp: 100000, others: 150000 },
  { region: "South West", apc: 2400000, pdp: 1100000, lp: 1500000, nnpp: 200000, others: 100000 },
]

// State data
const stateData = [
  { state: "Lagos", apc: 450000, pdp: 220000, lp: 380000, nnpp: 50000, others: 30000 },
  { state: "Kano", apc: 380000, pdp: 320000, lp: 150000, nnpp: 280000, others: 40000 },
  { state: "Rivers", apc: 180000, pdp: 350000, lp: 320000, nnpp: 20000, others: 30000 },
  { state: "FCT", apc: 120000, pdp: 150000, lp: 220000, nnpp: 30000, others: 20000 },
  { state: "Kaduna", apc: 350000, pdp: 280000, lp: 180000, nnpp: 70000, others: 30000 },
]

// Time-based voting data
const timeData = [
  { time: "Day 1", apc: 1200000, pdp: 900000, lp: 800000, nnpp: 200000, others: 100000, milestone: "Voting Begins" },
  { time: "Day 2", apc: 2100000, pdp: 1700000, lp: 1500000, nnpp: 400000, others: 200000 },
  { time: "Day 3", apc: 2800000, pdp: 2300000, lp: 2100000, nnpp: 600000, others: 300000 },
  { time: "Day 4", apc: 3400000, pdp: 2800000, lp: 2600000, nnpp: 700000, others: 400000 },
  {
    time: "Day 5",
    apc: 4000000,
    pdp: 3300000,
    lp: 3000000,
    nnpp: 800000,
    others: 500000,
    milestone: "25% Turnout Reached",
  },
  { time: "Day 6", apc: 4500000, pdp: 3700000, lp: 3400000, nnpp: 900000, others: 600000 },
  {
    time: "Day 7",
    apc: 5000000,
    pdp: 4100000,
    lp: 3700000,
    nnpp: 1000000,
    others: 650000,
    milestone: "Week 1 Complete",
  },
  { time: "Day 8", apc: 5400000, pdp: 4400000, lp: 4000000, nnpp: 1100000, others: 700000 },
  { time: "Day 9", apc: 5800000, pdp: 4700000, lp: 4300000, nnpp: 1150000, others: 750000 },
  { time: "Day 10", apc: 6200000, pdp: 5000000, lp: 4600000, nnpp: 1200000, others: 800000 },
  { time: "Day 11", apc: 6600000, pdp: 5300000, lp: 4800000, nnpp: 1250000, others: 850000 },
  { time: "Day 12", apc: 7000000, pdp: 5600000, lp: 5000000, nnpp: 1300000, others: 900000 },
  { time: "Day 13", apc: 7300000, pdp: 5900000, lp: 5200000, nnpp: 1350000, others: 920000 },
  {
    time: "Day 14",
    apc: 7600000,
    pdp: 6100000,
    lp: 5400000,
    nnpp: 1400000,
    others: 940000,
    milestone: "Week 2 Complete",
  },
  { time: "Day 15", apc: 7900000, pdp: 6300000, lp: 5600000, nnpp: 1420000, others: 950000 },
  { time: "Day 16", apc: 8100000, pdp: 6500000, lp: 5800000, nnpp: 1440000, others: 960000 },
  { time: "Day 17", apc: 8200000, pdp: 6600000, lp: 5900000, nnpp: 1460000, others: 970000 },
  { time: "Day 18", apc: 8300000, pdp: 6700000, lp: 6000000, nnpp: 1480000, others: 980000 },
  { time: "Day 19", apc: 8400000, pdp: 6800000, lp: 6050000, nnpp: 1490000, others: 990000 },
  { time: "Day 20", apc: 8450000, pdp: 6850000, lp: 6080000, nnpp: 1495000, others: 995000 },
  { time: "Day 21", apc: 8500000, pdp: 6900000, lp: 6100000, nnpp: 1500000, others: 1000000, milestone: "Voting Ends" },
]

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
]

// State electoral data for map
const stateElectoralData = [
  { state: "Abia", winner: "LP", percentage: 48, totalVotes: 520000 },
  { state: "Adamawa", winner: "PDP", percentage: 52, totalVotes: 480000 },
  { state: "Akwa Ibom", winner: "PDP", percentage: 55, totalVotes: 620000 },
  { state: "Anambra", winner: "LP", percentage: 63, totalVotes: 580000 },
  { state: "Bauchi", winner: "APC", percentage: 47, totalVotes: 510000 },
  { state: "Bayelsa", winner: "PDP", percentage: 51, totalVotes: 320000 },
  { state: "Benue", winner: "LP", percentage: 42, totalVotes: 480000 },
  { state: "Borno", winner: "APC", percentage: 58, totalVotes: 520000 },
  { state: "Cross River", winner: "APC", percentage: 45, totalVotes: 450000 },
  { state: "Delta", winner: "PDP", percentage: 49, totalVotes: 580000 },
  { state: "Ebonyi", winner: "APC", percentage: 46, totalVotes: 380000 },
  { state: "Edo", winner: "LP", percentage: 44, totalVotes: 520000 },
  { state: "Ekiti", winner: "APC", percentage: 53, totalVotes: 360000 },
  { state: "Enugu", winner: "LP", percentage: 61, totalVotes: 480000 },
  { state: "FCT", winner: "LP", percentage: 59, totalVotes: 420000 },
  { state: "Gombe", winner: "APC", percentage: 54, totalVotes: 380000 },
  { state: "Imo", winner: "APC", percentage: 47, totalVotes: 450000 },
  { state: "Jigawa", winner: "APC", percentage: 56, totalVotes: 520000 },
  { state: "Kaduna", winner: "APC", percentage: 51, totalVotes: 680000 },
  { state: "Kano", winner: "NNPP", percentage: 48, totalVotes: 920000 },
  { state: "Katsina", winner: "APC", percentage: 53, totalVotes: 620000 },
  { state: "Kebbi", winner: "APC", percentage: 57, totalVotes: 380000 },
  { state: "Kogi", winner: "APC", percentage: 49, totalVotes: 420000 },
  { state: "Kwara", winner: "APC", percentage: 52, totalVotes: 380000 },
  { state: "Lagos", winner: "APC", percentage: 47, totalVotes: 1200000 },
  { state: "Nasarawa", winner: "APC", percentage: 45, totalVotes: 360000 },
  { state: "Niger", winner: "APC", percentage: 54, totalVotes: 520000 },
  { state: "Ogun", winner: "APC", percentage: 48, totalVotes: 580000 },
  { state: "Ondo", winner: "APC", percentage: 46, totalVotes: 480000 },
  { state: "Osun", winner: "APC", percentage: 45, totalVotes: 520000 },
  { state: "Oyo", winner: "PDP", percentage: 44, totalVotes: 680000 },
  { state: "Plateau", winner: "LP", percentage: 43, totalVotes: 420000 },
  { state: "Rivers", winner: "PDP", percentage: 46, totalVotes: 720000 },
  { state: "Sokoto", winner: "APC", percentage: 51, totalVotes: 380000 },
  { state: "Taraba", winner: "PDP", percentage: 48, totalVotes: 360000 },
  { state: "Yobe", winner: "APC", percentage: 59, totalVotes: 320000 },
  { state: "Zamfara", winner: "APC", percentage: 55, totalVotes: 340000 },
]

export default function ElectionDashboardPage() {
  const [selectedChart, setSelectedChart] = useState("bar")
  const [selectedCandidate, setSelectedCandidate] = useState<number | null>(null)
  const [selectedRegion, setSelectedRegion] = useState("all")
  const [refreshInterval, setRefreshInterval] = useState(0) // 0 means no auto-refresh
  const { isLoading, error, setError } = useUIStore()

  // Use the election data hook to get election information
  const {
    currentElectionTypeKey,
    candidates,
    electionResults,
    fetchElectionDetailsAndCandidates,
    fetchResults,
    ELECTION_TYPES_MAP
  } = useElectionData("presidential") // Default to presidential election

  // Use results hook for regional data
  const { getRegionalResults, getLiveStatistics } = useResults()
  
  const [electionTypeKey, setElectionTypeKey] = useState<string>("presidential")
  const [regionalData, setRegionalData] = useState<any[]>([])
  const [liveStats, setLiveStats] = useState<any>(null)
  const [timeData, setTimeData] = useState<any[]>([])

  // Fetch election data on initial load and when election type changes
  useEffect(() => {
    const loadElectionData = async () => {
      try {
        await fetchElectionDetailsAndCandidates(electionTypeKey)
        await fetchResults(electionTypeKey)
      } catch (err) {
        console.error("Failed to load election data:", err)
      }
    }
    
    loadElectionData()
  }, [electionTypeKey, fetchElectionDetailsAndCandidates, fetchResults])

  // Fetch regional data
  useEffect(() => {
    const loadRegionalData = async () => {
      try {
        const data = await getRegionalResults(electionTypeKey, selectedRegion !== "all" ? selectedRegion : undefined)
        setRegionalData(data.regions || [])
      } catch (err) {
        console.error("Failed to load regional data:", err)
      }
    }
    
    if (electionTypeKey) {
      loadRegionalData()
    }
  }, [electionTypeKey, selectedRegion, getRegionalResults])

  // Fetch live statistics
  useEffect(() => {
    const loadLiveStats = async () => {
      try {
        const data = await getLiveStatistics()
        setLiveStats(data)
        
        // Create some time-based data from the timestamp
        if (data.hourlyTurnout) {
          setTimeData(data.hourlyTurnout)
        }
      } catch (err) {
        console.error("Failed to load live statistics:", err)
      }
    }
    
    loadLiveStats()
    
    // Set up auto-refresh if enabled
    if (refreshInterval > 0) {
      const interval = setInterval(() => {
        loadLiveStats()
      }, refreshInterval * 1000)
      
      return () => clearInterval(interval)
    }
  }, [refreshInterval, getLiveStatistics])

  const handleCandidateSelect = (candidateId: number | string) => {
    const id = typeof candidateId === 'string' ? parseInt(candidateId, 10) : candidateId
    setSelectedCandidate(id === selectedCandidate ? null : id)
  }

  const handleRefresh = () => {
    fetchElectionDetailsAndCandidates(electionTypeKey)
    fetchResults(electionTypeKey)
    getRegionalResults(electionTypeKey, selectedRegion !== "all" ? selectedRegion : undefined)
      .then(data => setRegionalData(data.regions || []))
    getLiveStatistics()
      .then(data => {
        setLiveStats(data)
        if (data.hourlyTurnout) {
          setTimeData(data.hourlyTurnout)
        }
      })
  }

  const getTotalVotes = () => {
    if (electionResults) {
      return electionResults.totalVotes || candidates.reduce((sum, c) => sum + c.votes, 0)
    }
    return candidates.reduce((sum, c) => sum + c.votes, 0)
  }

  const handleElectionTypeChange = (type: string) => {
    setElectionTypeKey(type)
    setSelectedCandidate(null)
  }

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
              <SidebarGroupLabel>Navigation</SidebarGroupLabel>
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
                    <SidebarMenuButton asChild isActive>
                      <Link href="/election-dashboard">
                        <BarChart3 />
                        <span>Election Results</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link href="/map">
                        <MapIcon />
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
                      <SidebarMenuButton asChild isActive={electionTypeKey === type} onClick={() => handleElectionTypeChange(type)}>
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
                      <span>Oluwaseun Adeyemi</span>
                      <ChevronDown className="ml-auto h-4 w-4" />
                    </SidebarMenuButton>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuItem>
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
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
          <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background px-4 md:px-6">
            <div className="flex items-center gap-2">
              <SidebarTrigger />
              <h1 className="text-lg font-semibold md:text-xl">
                {ELECTION_TYPES[electionTypeKey as keyof typeof ELECTION_TYPES]} Results
              </h1>
              <Badge variant="outline" className="ml-2 bg-green-500/10 text-green-500 border-green-500/20">
                Live
              </Badge>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Label htmlFor="realtime-toggle" className="text-sm">
                  Real-time
                </Label>
                <Switch id="realtime-toggle" checked={refreshInterval > 0} onCheckedChange={(checked) => setRefreshInterval(checked ? 30 : 0)} />
              </div>
              <Button
                variant="outline"
                size="icon"
                className={`rounded-full ${isLoading ? "animate-spin" : ""}`}
                onClick={handleRefresh}
                disabled={isLoading}
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
              <ThemeToggle />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="hidden md:flex">
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
            <Tabs value="overview" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="charts">Charts</TabsTrigger>
                <TabsTrigger value="map">Electoral Map</TabsTrigger>
                <TabsTrigger value="details">Detailed Results</TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-6">
                {/* Results Summary */}
                <div className="grid gap-6 md:grid-cols-4 mb-6">
                  <Card className="transition-all duration-300 hover:shadow-md">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Total Votes Cast</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{getTotalVotes().toLocaleString()}</div>
                      <p className="text-xs text-muted-foreground">+2.5% from last hour</p>
                    </CardContent>
                  </Card>

                  <Card className="transition-all duration-300 hover:shadow-md">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Voter Turnout</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">62.5%</div>
                      <p className="text-xs text-muted-foreground">Of registered voters</p>
                    </CardContent>
                  </Card>

                  <Card className="transition-all duration-300 hover:shadow-md">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">States Reporting</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">36/37</div>
                      <p className="text-xs text-muted-foreground">Including FCT</p>
                    </CardContent>
                  </Card>

                  <Card className="transition-all duration-300 hover:shadow-md">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Leading Candidate</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{candidates.length > 0 ? candidates[0].name.split(" ")[0] : "N/A"}</div>
                      <p className="text-xs text-muted-foreground">{candidates.length > 0 ? `${candidates[0].percentage}% of votes` : "No data"}</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Candidate Selection */}
                <div className="mb-6 flex flex-wrap gap-2">
                  <div className="text-sm font-medium mr-2 flex items-center">Highlight Candidate:</div>
                  {candidates.map((candidate) => (
                    <button
                      key={candidate.id}
                      onClick={() => handleCandidateSelect(candidate.id)}
                      className={`flex items-center gap-2 rounded-full px-3 py-1 text-sm transition-all ${
                        selectedCandidate === candidate.id
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted hover:bg-muted/80"
                      }`}
                    >
                      <div className="h-3 w-3 rounded-full" style={{ backgroundColor: candidate.color }}></div>
                      <span>{candidate.party}</span>
                    </button>
                  ))}
                  {selectedCandidate && (
                    <button
                      onClick={() => setSelectedCandidate(null)}
                      className="rounded-full px-3 py-1 text-sm bg-muted hover:bg-muted/80"
                    >
                      Clear
                    </button>
                  )}
                </div>

                {/* Overview Charts */}
                <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3 mb-6">
                  {/* Pie Chart */}
                  <Card className="xl:col-span-1">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <div>
                        <CardTitle>Vote Share</CardTitle>
                        <CardDescription>Percentage distribution by candidate</CardDescription>
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
                              This pie chart shows the percentage of votes received by each candidate. Hover over slices
                              to see detailed information.
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <ElectionCharts
                        type="pie"
                        data={candidates.map((c) => ({
                          id: c.id,
                          name: c.name,
                          party: c.party,
                          value: c.percentage,
                          votes: c.votes,
                          color: c.color,
                        }))}
                        selectedCandidate={selectedCandidate}
                        onSelectCandidate={handleCandidateSelect}
                        isLoading={isLoading}
                      />
                    </CardContent>
                  </Card>

                  {/* Bar Chart */}
                  <Card className="xl:col-span-1">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <div>
                        <CardTitle>Regional Distribution</CardTitle>
                        <CardDescription>Vote counts across regions</CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                          <SelectTrigger className="w-[130px]">
                            <SelectValue placeholder="View" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Regions</SelectItem>
                            <SelectItem value="national">Geopolitical Zones</SelectItem>
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
                                {selectedRegion === "national" ? "geopolitical zones" : selectedRegion === "state" ? "top states" : "selected region"}.
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <ElectionCharts
                        type="bar"
                        data={regionalData}
                        selectedCandidate={selectedCandidate}
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
                        <CardDescription>Turnout over time</CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                          <SelectTrigger className="w-[130px]">
                            <SelectValue placeholder="View" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Regions</SelectItem>
                            <SelectItem value="national">National</SelectItem>
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
                                This line chart shows voting trends over time. Toggle between all regions, national, or top states.
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <ElectionCharts
                        type="line"
                        data={timeData}
                        selectedCandidate={selectedCandidate}
                        onSelectCandidate={handleCandidateSelect}
                        isLoading={isLoading}
                      />
                    </CardContent>
                  </Card>
                </div>

                {/* Electoral Map Preview */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>Electoral Map</CardTitle>
                      <CardDescription>Geographic distribution of election results</CardDescription>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => setSelectedRegion("all")}>
                      View Full Map
                    </Button>
                  </CardHeader>
                  <CardContent className="h-[400px]">
                    <ElectoralMap
                      data={regionalData}
                      view={selectedRegion}
                      selectedCandidate={selectedCandidate}
                      isLoading={isLoading}
                    />
                  </CardContent>
                </Card>
                {/* Live Updates */}
                <Card className="transition-all duration-300 hover:shadow-md">
                  <CardHeader className="flex flex-row items-center">
                    <div className="flex-1">
                      <CardTitle>Live Updates</CardTitle>
                      <CardDescription>Real-time election news and announcements</CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-green-500 pulse-animation"></div>
                      <span className="text-xs font-medium">Live</span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[400px] pr-2">
                      <div className="space-y-4">
                        <div className="flex gap-4 border-b pb-4">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                            <Clock className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-semibold">INEC Announcement</h4>
                              <span className="text-xs text-muted-foreground">2 minutes ago</span>
                            </div>
                            <p className="text-sm">
                              Polls will remain open for the full 3-week period to accommodate all voters.
                            </p>
                          </div>
                        </div>

                        <div className="flex gap-4 border-b pb-4">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                            <BarChart3 className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-semibold">Results Update</h4>
                              <span className="text-xs text-muted-foreground">15 minutes ago</span>
                            </div>
                            <p className="text-sm">
                              Lagos State has reported 85% of polling units. Current turnout at 68%.
                            </p>
                          </div>
                        </div>

                        <div className="flex gap-4 border-b pb-4">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                            <AlertCircle className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-semibold">Security Alert</h4>
                              <span className="text-xs text-muted-foreground">30 minutes ago</span>
                            </div>
                            <p className="text-sm">
                              Secure Ballot has detected and blocked several unauthorized access attempts. All votes
                              remain secure and uncompromised.
                            </p>
                          </div>
                        </div>

                        <div className="flex gap-4 border-b pb-4">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                            <MessageSquare className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-semibold">Candidate Statement</h4>
                              <span className="text-xs text-muted-foreground">45 minutes ago</span>
                            </div>
                            <p className="text-sm">
                              Bola Ahmed Tinubu urges supporters to remain calm as results continue to come in.
                            </p>
                          </div>
                        </div>

                        <div className="flex gap-4 border-b pb-4">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                            <TrendingUp className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-semibold">Turnout Milestone</h4>
                              <span className="text-xs text-muted-foreground">1 hour ago</span>
                            </div>
                            <p className="text-sm">
                              National voter turnout has reached 50% - the highest in Nigeria's electoral history at
                              this stage.
                            </p>
                          </div>
                        </div>

                        <div className="flex gap-4 border-b pb-4">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                            <MapPin className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-semibold">Regional Update</h4>
                              <span className="text-xs text-muted-foreground">1.5 hours ago</span>
                            </div>
                            <p className="text-sm">
                              South East region reports record-breaking 72% turnout with LP leading in 4 out of 5
                              states.
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
                              <span className="text-xs text-muted-foreground">2 hours ago</span>
                            </div>
                            <p className="text-sm">
                              Secure Ballot has successfully processed over 20 million votes with zero system downtime.
                            </p>
                          </div>
                        </div>

                        <div className="flex gap-4 border-b pb-4">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                            <MessageSquare className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-semibold">Candidate Statement</h4>
                              <span className="text-xs text-muted-foreground">2.5 hours ago</span>
                            </div>
                            <p className="text-sm">
                              Peter Obi thanks supporters and emphasizes the importance of peaceful democratic process.
                            </p>
                          </div>
                        </div>

                        <div className="flex gap-4 border-b pb-4">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                            <Users className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-semibold">Demographic Insight</h4>
                              <span className="text-xs text-muted-foreground">3 hours ago</span>
                            </div>
                            <p className="text-sm">
                              Youth voter participation (18-35) has increased by 27% compared to the 2023 elections.
                            </p>
                          </div>
                        </div>

                        <div className="flex gap-4">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                            <Globe className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-semibold">International Observers</h4>
                              <span className="text-xs text-muted-foreground">3.5 hours ago</span>
                            </div>
                            <p className="text-sm">
                              EU Election Observation Mission praises Nigeria's digital voting system for transparency
                              and security.
                            </p>
                          </div>
                        </div>
                      </div>
                    </ScrollArea>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" size="sm" className="w-full">
                      View All Updates
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>

              {/* Charts Tab */}
              <TabsContent value="charts" className="space-y-6">
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                  <Card className="flex-1">
                    <CardHeader>
                      <CardTitle>Detailed Charts</CardTitle>
                      <CardDescription>Interactive visualizations of election data</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Tabs defaultValue="pie">
                        <TabsList className="grid w-full grid-cols-3">
                          <TabsTrigger value="pie">Pie Chart</TabsTrigger>
                          <TabsTrigger value="bar">Bar Chart</TabsTrigger>
                          <TabsTrigger value="line">Line Chart</TabsTrigger>
                        </TabsList>

                        <TabsContent value="pie" className="pt-4">
                          <div className="mb-4">
                            <h3 className="text-sm font-medium mb-2">Vote Share Distribution</h3>
                            <p className="text-sm text-muted-foreground mb-4">
                              This pie chart shows the percentage of votes received by each candidate in the{" "}
                              {ELECTION_TYPES[electionTypeKey as keyof typeof ELECTION_TYPES]}.
                            </p>
                            <div className="h-[500px]">
                              <ElectionCharts
                                type="pie"
                                data={candidates.map((c) => ({
                                  id: c.id,
                                  name: c.name,
                                  party: c.party,
                                  value: c.percentage,
                                  votes: c.votes,
                                  color: c.color,
                                }))}
                                selectedCandidate={selectedCandidate}
                                onSelectCandidate={handleCandidateSelect}
                                isLoading={isLoading}
                                showLegend={true}
                              />
                            </div>
                          </div>
                        </TabsContent>

                        <TabsContent value="bar" className="pt-4">
                          <div className="mb-4">
                            <div className="flex items-center justify-between mb-2">
                              <h3 className="text-sm font-medium">Regional Vote Distribution</h3>
                              <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                                <SelectTrigger className="w-[180px]">
                                  <SelectValue placeholder="Select view" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="all">All Regions</SelectItem>
                                  <SelectItem value="national">Geopolitical Zones</SelectItem>
                                  <SelectItem value="state">Top States</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <p className="text-sm text-muted-foreground mb-4">
                              This bar chart shows vote distribution across{" "}
                              {selectedRegion === "national" ? "geopolitical zones" : selectedRegion === "state" ? "top states" : "selected region"}.
                            </p>
                            <div className="h-[500px]">
                              <ElectionCharts
                                type="bar"
                                data={regionalData}
                                selectedCandidate={selectedCandidate}
                                onSelectCandidate={handleCandidateSelect}
                                isLoading={isLoading}
                                showLegend={true}
                              />
                            </div>
                          </div>
                        </TabsContent>

                        <TabsContent value="line" className="pt-4">
                          <div className="mb-4">
                            <div className="flex items-center justify-between mb-2">
                              <h3 className="text-sm font-medium">Voting Trends Over Time</h3>
                              <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                                <SelectTrigger className="w-[180px]">
                                  <SelectValue placeholder="Select view" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="all">All Regions</SelectItem>
                                  <SelectItem value="national">National</SelectItem>
                                  <SelectItem value="state">Top States</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <p className="text-sm text-muted-foreground mb-4">
                              This line chart shows how votes accumulated over the{" "}
                              {selectedRegion === "national" ? "21-day voting period" : selectedRegion === "state" ? "election day" : "selected region"}.
                            </p>
                            <div className="h-[500px]">
                              <ElectionCharts
                                type="line"
                                data={timeData}
                                selectedCandidate={selectedCandidate}
                                onSelectCandidate={handleCandidateSelect}
                                isLoading={isLoading}
                                showLegend={true}
                              />
                            </div>
                          </div>
                        </TabsContent>
                      </Tabs>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Map Tab */}
              <TabsContent value="map" className="space-y-6">
                <Card>
                  <CardHeader>
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                      <div>
                        <CardTitle>Electoral Map</CardTitle>
                        <CardDescription>Geographic distribution of election results</CardDescription>
                      </div>
                      <div className="flex items-center gap-2 mt-2 md:mt-0">
                        <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                          <SelectTrigger className="w-[130px]">
                            <SelectValue placeholder="View" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Regions</SelectItem>
                            <SelectItem value="national">Geopolitical Zones</SelectItem>
                            <SelectItem value="state">Top States</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="h-[600px]">
                    <ElectoralMap
                      data={regionalData}
                      view={selectedRegion}
                      selectedCandidate={selectedCandidate}
                      isLoading={isLoading}
                      interactive={true}
                    />
                  </CardContent>
                  <CardFooter>
                    <div className="w-full">
                      <h3 className="text-sm font-medium mb-2">Legend</h3>
                      <div className="flex flex-wrap gap-3">
                        {candidates.map((candidate) => (
                          <div key={candidate.id} className="flex items-center gap-2">
                            <div className="h-4 w-4 rounded-sm" style={{ backgroundColor: candidate.color }}></div>
                            <span className="text-sm">{candidate.party}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardFooter>
                </Card>

                <div className="grid gap-6 md:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>States by Party</CardTitle>
                      <CardDescription>Number of states won by each party</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {[
                          {
                            party: "APC",
                            count: stateElectoralData.filter((s) => s.winner === "APC").length,
                            color: "#64748b",
                          },
                          {
                            party: "PDP",
                            count: stateElectoralData.filter((s) => s.winner === "PDP").length,
                            color: "#ef4444",
                          },
                          {
                            party: "LP",
                            count: stateElectoralData.filter((s) => s.winner === "LP").length,
                            color: "#22c55e",
                          },
                          {
                            party: "NNPP",
                            count: stateElectoralData.filter((s) => s.winner === "NNPP").length,
                            color: "#3b82f6",
                          },
                        ].map((item) => (
                          <div key={item.party} className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span>{item.party}</span>
                              <Badge
                                variant="outline"
                                className="font-medium"
                                style={{
                                  backgroundColor: `${item.color}20`,
                                  color: item.color,
                                  borderColor: `${item.color}40`,
                                }}
                              >
                                {item.count} states
                              </Badge>
                            </div>
                            <Progress
                              value={(item.count / 37) * 100}
                              className="h-2"
                              style={
                                {
                                  backgroundColor: `${item.color}20`,
                                  "--tw-progress-fill": item.color,
                                } as React.CSSProperties
                              }
                            />
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Regional Strength</CardTitle>
                      <CardDescription>Party performance by geopolitical zone</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ScrollArea className="h-[300px] pr-4">
                        <div className="space-y-6">
                          {[
                            { region: "North Central", party: "APC", states: 4, totalStates: 7 },
                            { region: "North East", party: "APC", states: 5, totalStates: 6 },
                            { region: "North West", party: "APC", states: 6, totalStates: 7 },
                            { region: "South East", party: "LP", states: 4, totalStates: 5 },
                            { region: "South South", party: "PDP", states: 4, totalStates: 6 },
                            { region: "South West", party: "APC", states: 5, totalStates: 6 },
                          ].map((item) => (
                            <div key={item.region} className="space-y-2">
                              <h4 className="font-medium">{item.region}</h4>
                              <div className="flex items-center justify-between text-sm">
                                <span>Dominant Party:</span>
                                <Badge
                                  variant="outline"
                                  className={`
                                    ${item.party === "APC" ? "bg-blue-500/10 text-blue-500 border-blue-500/20" : ""}
                                    ${item.party === "PDP" ? "bg-red-500/10 text-red-500 border-red-500/20" : ""}
                                    ${item.party === "LP" ? "bg-green-500/10 text-green-500 border-green-500/20" : ""}
                                    ${item.party === "NNPP" ? "bg-purple-500/10 text-purple-500 border-purple-500/20" : ""}
                                  `}
                                >
                                  {item.party}
                                </Badge>
                              </div>
                              <div className="flex items-center justify-between text-sm">
                                <span>States Won:</span>
                                <span>
                                  {item.states}/{item.totalStates}
                                </span>
                              </div>
                              <Progress
                                value={(item.states / item.totalStates) * 100}
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

              {/* Detailed Results Tab */}
              <TabsContent value="details" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Detailed Results</CardTitle>
                    <CardDescription>Complete breakdown of votes by candidate</CardDescription>
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
                          {candidates.map((candidate) => (
                            <tr
                              key={candidate.id}
                              className={`border-b hover:bg-muted/30 transition-colors cursor-pointer ${
                                selectedCandidate === candidate.id ? "bg-primary/5" : ""
                              }`}
                              onClick={() => handleCandidateSelect(candidate.id)}
                            >
                              <td className="p-2 flex items-center gap-2">
                                <div className="h-8 w-8 rounded-full overflow-hidden">
                                  <img
                                    src={candidate.image || "/placeholder.svg"}
                                    alt={candidate.name}
                                    className="h-full w-full object-cover"
                                  />
                                </div>
                                <span>{candidate.name}</span>
                              </td>
                              <td className="p-2">
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
                              </td>
                              <td className="p-2 text-right font-medium">{candidate.votes.toLocaleString()}</td>
                              <td className="p-2 text-right">{candidate.percentage}%</td>
                              <td className="p-2 text-right">
                                {stateElectoralData.filter((s) => s.winner === candidate.party).length}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <div className="text-sm text-muted-foreground">Last updated: {new Date().toLocaleString()}</div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Share2 className="mr-2 h-4 w-4" />
                        Share Results
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="mr-2 h-4 w-4" />
                        Download
                      </Button>
                    </div>
                  </CardFooter>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>State-by-State Results</CardTitle>
                    <CardDescription>Detailed breakdown by state</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[400px]">
                      <div className="space-y-6">
                        {stateElectoralData.map((state) => (
                          <div key={state.state} className="border-b pb-4">
                            <div className="flex items-center justify-between mb-2">
                              <h3 className="font-medium">{state.state}</h3>
                              <Badge
                                variant="outline"
                                className={`
                                  ${state.winner === "APC" ? "bg-blue-500/10 text-blue-500 border-blue-500/20" : ""}
                                  ${state.winner === "PDP" ? "bg-red-500/10 text-red-500 border-red-500/20" : ""}
                                  ${state.winner === "LP" ? "bg-green-500/10 text-green-500 border-green-500/20" : ""}
                                  ${state.winner === "NNPP" ? "bg-purple-500/10 text-purple-500 border-purple-500/20" : ""}
                                `}
                              >
                                {state.winner} ({state.percentage}%)
                              </Badge>
                            </div>
                            <div className="text-sm text-muted-foreground mb-2">
                              Total Votes: {state.totalVotes.toLocaleString()}
                            </div>
                            <Progress
                              value={state.percentage}
                              className={`h-2 mb-2 ${
                                state.winner === "APC"
                                  ? "bg-blue-100 dark:bg-blue-950"
                                  : state.winner === "PDP"
                                    ? "bg-red-100 dark:bg-red-950"
                                    : state.winner === "LP"
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
              </TabsContent>
            </Tabs>
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}

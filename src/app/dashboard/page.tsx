"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useSearchParams, useRouter } from "next/navigation"
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
} from "lucide-react"
import { Button } from "@/src/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/src/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/src/components/ui/dropdown-menu"
import { ThemeToggle } from "@/src/components/theme-toggle"
import { AiAssistantPreview } from "@/src/components/ai-assistant-preview"
import { BarChart, PieChart } from "@/src/components/ui/chart"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog"
import { Badge } from "@/src/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/src/components/ui/tooltip"
import { ScrollArea } from "@/src/components/ui/scroll-area"
import { Progress } from "@/src/components/ui/progress"
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
} from "@/src/components/ui/sidebar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select"
import { Input } from "@/src/components/ui/input"
import { Slider } from "@/src/components/ui/slider"

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
      bio: "Former Governor of Lagos State and National Leader of the APC",
      manifesto: "Economic growth, security, and infrastructure development",
    },
    {
      id: 2,
      name: "Atiku Abubakar",
      party: "PDP",
      votes: 6900000,
      percentage: 28,
      image: "/placeholder.svg?height=80&width=80",
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
      image: "/placeholder.svg?height=80&width=80",
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
      image: "/placeholder.svg?height=80&width=80",
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
      image: "/placeholder.svg?height=80&width=80",
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
      image: "/placeholder.svg?height=80&width=80",
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
      image: "/placeholder.svg?height=80&width=80",
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
      image: "/placeholder.svg?height=80&width=80",
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
      image: "/placeholder.svg?height=80&width=80",
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
      image: "/placeholder.svg?height=80&width=80",
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
      image: "/placeholder.svg?height=80&width=80",
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
      image: "/placeholder.svg?height=80&width=80",
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
      image: "/placeholder.svg?height=80&width=80",
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
      image: "/placeholder.svg?height=80&width=80",
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
      image: "/placeholder.svg?height=80&width=80",
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
      image: "/placeholder.svg?height=80&width=80",
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
      image: "/placeholder.svg?height=80&width=80",
      color: "#a855f7",
      bio: "Various candidates from smaller political parties",
      manifesto: "Various policy positions",
    },
  ],
}

// Sample states data
const states = [
  { name: "Lagos", turnout: 65 },
  { name: "Kano", turnout: 58 },
  { name: "Rivers", turnout: 62 },
  { name: "FCT", turnout: 70 },
  { name: "Kaduna", turnout: 55 },
]

// Sample demographic data
const demographicData = [
  { age: "18-25", percentage: 22 },
  { age: "26-35", percentage: 35 },
  { age: "36-45", percentage: 25 },
  { age: "46-60", percentage: 12 },
  { age: "60+", percentage: 6 },
]

// Sample gender data
const genderData = [
  { gender: "Male", percentage: 52 },
  { gender: "Female", percentage: 48 },
]

// Safe localStorage access utility
const safeLocalStorage = {
  getItem: (key: string, defaultValue: any = null): any => {
    if (typeof window === "undefined") return defaultValue
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : defaultValue
    } catch (error) {
      console.error(`Error reading ${key} from localStorage:`, error)
      return defaultValue
    }
  },
  setItem: (key: string, value: any): boolean => {
    if (typeof window === "undefined") return false
    try {
      localStorage.setItem(key, JSON.stringify(value))
      return true
    } catch (error) {
      console.error(`Error saving ${key} to localStorage:`, error)
      return false
    }
  },
}

export default function DashboardPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const electionType = searchParams.get("election") || "presidential"
  const [activeTab, setActiveTab] = useState("overview")
  const [selectedCandidate, setSelectedCandidate] = useState<number | null>(null)
  const [timeRemaining, setTimeRemaining] = useState({ days: 0, hours: 0, minutes: 0 })
  const [votedElections, setVotedElections] = useState<Record<string, number>>({})
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)
  const [successDialogOpen, setSuccessDialogOpen] = useState(false)
  const [candidates, setCandidates] = useState(candidatesByElection[electionType as keyof typeof candidatesByElection])
  const [isLoading, setIsLoading] = useState(false)
  const [statisticsFilter, setStatisticsFilter] = useState("state")
  const [searchTerm, setSearchTerm] = useState("")
  const hasVoted = Object.keys(votedElections).length > 0

  // Add these new state variables after the existing state declarations
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "Election Update",
      description: "Presidential election results from Lagos State are now complete.",
      time: "2 minutes ago",
      icon: <BarChart3 className="h-4 w-4 text-blue-500" />,
      read: false,
    },
    {
      id: 2,
      title: "Security Alert",
      description: "Your account was accessed from a new device in Abuja.",
      time: "1 hour ago",
      icon: <Shield className="h-4 w-4 text-red-500" />,
      read: false,
    },
    {
      id: 3,
      title: "Vote Confirmation",
      description: "Your vote in the Gubernatorial election has been recorded.",
      time: "2 hours ago",
      icon: <CheckCircle className="h-4 w-4 text-green-500" />,
      read: false,
    },
    {
      id: 4,
      title: "System Notification",
      description: "Scheduled maintenance will occur on June 15th from 2-4 AM.",
      time: "Yesterday",
      icon: <Settings className="h-4 w-4 text-orange-500" />,
      read: true,
    },
    {
      id: 5,
      title: "New Candidate Statement",
      description: "Peter Obi has released a new statement on education policy.",
      time: "2 days ago",
      icon: <MessageSquare className="h-4 w-4 text-purple-500" />,
      read: true,
    },
  ])
  const [filterValues, setFilterValues] = useState({
    timePeriod: "all",
    region: "all",
    party: "all",
    turnout: [0, 100],
  })
  const [filteredCandidates, setFilteredCandidates] = useState(candidates)
  const [isFiltered, setIsFiltered] = useState(false)

  // Calculate time remaining in the 3-week voting period
  useEffect(() => {
    // For demo purposes, we'll assume we're in the middle of the voting period
    setTimeRemaining({
      days: 14,
      hours: 8,
      minutes: 45,
    })
  }, [])

  // Load candidates when election type changes
  useEffect(() => {
    setIsLoading(true)
    setSearchTerm("")

    // Simulate API call delay
    const timer = setTimeout(() => {
      setCandidates(candidatesByElection[electionType as keyof typeof candidatesByElection])
      setIsLoading(false)
    }, 500)

    return () => clearTimeout(timer)
  }, [electionType])

  // Load saved votes from localStorage
  useEffect(() => {
    const savedVotes = safeLocalStorage.getItem("votedElections", {})
    if (Object.keys(savedVotes).length > 0) {
      setVotedElections(savedVotes)
    }
  }, [])

  // Save votes to localStorage when they change
  useEffect(() => {
    if (Object.keys(votedElections).length > 0) {
      safeLocalStorage.setItem("votedElections", votedElections)
    }
  }, [votedElections])

  // Handle candidate selection
  const handleCandidateSelect = (candidateId: number) => {
    if (votedElections[electionType]) {
      return // Already voted in this election
    }

    setSelectedCandidate(candidateId)
    setConfirmDialogOpen(true)
  }

  // Handle search
  const handleSearch = (term: string) => {
    setSearchTerm(term)

    if (term.trim() === "") {
      setCandidates(candidatesByElection[electionType as keyof typeof candidatesByElection])
    } else {
      const filtered = candidatesByElection[electionType as keyof typeof candidatesByElection].filter(
        (candidate) =>
          candidate.name.toLowerCase().includes(term.toLowerCase()) ||
          candidate.party.toLowerCase().includes(term.toLowerCase()),
      )
      setCandidates(filtered)
    }
  }

  // Confirm vote
  const confirmVote = () => {
    setConfirmDialogOpen(false)
    setIsLoading(true)

    // Simulate API call delay
    setTimeout(() => {
      // Update vote count for the selected candidate
      const updatedCandidates = candidates.map((candidate) => {
        if (candidate.id === selectedCandidate) {
          return {
            ...candidate,
            votes: candidate.votes + 1,
            percentage: Math.round(((candidate.votes + 1) / (getTotalVotes() + 1)) * 100),
          }
        }
        return candidate
      })

      setCandidates(updatedCandidates)
      setVotedElections({ ...votedElections, [electionType]: selectedCandidate })

      // Update localStorage to reflect voting status for profile page
      const votingStatus = safeLocalStorage.getItem("votingStatus", {})
      votingStatus[electionType] = {
        candidateId: selectedCandidate,
        candidateName: candidates.find((c) => c.id === selectedCandidate)?.name,
        candidateParty: candidates.find((c) => c.id === selectedCandidate)?.party,
        timestamp: new Date().toISOString(),
      }
      safeLocalStorage.setItem("votingStatus", votingStatus)

      setIsLoading(false)
      setSuccessDialogOpen(true)
    }, 1500)
  }

  // Calculate total votes
  const getTotalVotes = () => {
    return (isFiltered ? filteredCandidates : candidates).reduce((sum, candidate) => sum + candidate.votes, 0)
  }

  // Generate chart data
  const barChartData = (isFiltered ? filteredCandidates : candidates).map((c) => ({ name: c.party, votes: c.votes }))
  const pieChartData = (isFiltered ? filteredCandidates : candidates).map((c) => ({
    name: c.party,
    value: c.percentage,
  }))
  const stateData = states.map((s) => ({ name: s.name, turnout: s.turnout }))

  // Handle election type change
  const changeElectionType = (type: string) => {
    router.push(`/dashboard?election=${type}`)
  }

  // Handle filter value changes
  const handleFilterChange = (type: string, value: any) => {
    setFilterValues((prev) => ({
      ...prev,
      [type]: value,
    }))
  }

  // Apply filters to the election results
  const applyFilters = () => {
    // This is a simplified filter implementation
    // In a real app, you would apply more complex filtering logic

    let filtered = [...candidatesByElection[electionType as keyof typeof candidatesByElection]]

    // Filter by party if not "all"
    if (filterValues.party !== "all") {
      filtered = filtered.filter((candidate) => candidate.party.toLowerCase() === filterValues.party.toLowerCase())
    }

    // Filter by percentage range
    filtered = filtered.filter(
      (candidate) => candidate.percentage >= filterValues.turnout[0] && candidate.percentage <= filterValues.turnout[1],
    )

    setFilteredCandidates(filtered)
    setIsFiltered(true)

    // Show a toast or notification that filters were applied
    alert("Filters applied successfully!")
  }

  // Reset filters
  const resetFilters = () => {
    setFilterValues({
      timePeriod: "all",
      region: "all",
      party: "all",
      turnout: [0, 100],
    })
    setFilteredCandidates(candidatesByElection[electionType as keyof typeof candidatesByElection])
    setIsFiltered(false)
  }

  // Mark all notifications as read
  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((notification) => ({
        ...notification,
        read: true,
      })),
    )
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
                    <SidebarMenuButton asChild isActive={activeTab === "map"} onClick={() => setActiveTab("map")}>
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
                          {votedElections[type] && (
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
                {ELECTION_TYPES[electionType as keyof typeof ELECTION_TYPES]} Dashboard
              </h1>
            </div>

            <div className="flex items-center gap-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" className="rounded-full relative">
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
                          className={`mb-2 p-3 rounded-lg ${notification.read ? "bg-background" : "bg-muted/50"} hover:bg-muted cursor-pointer`}
                          onClick={() => {
                            setNotifications((prev) =>
                              prev.map((n) => (n.id === notification.id ? { ...n, read: true } : n)),
                            )
                          }}
                        >
                          <div className="flex items-start gap-3">
                            <div className={`p-2 rounded-full ${notification.read ? "bg-muted" : "bg-primary/10"}`}>
                              {notification.icon}
                            </div>
                            <div className="flex-1 space-y-1">
                              <div className="flex items-center justify-between">
                                <p className="text-sm font-medium">{notification.title}</p>
                                <p className="text-xs text-muted-foreground">{notification.time}</p>
                              </div>
                              <p className="text-xs text-muted-foreground">{notification.description}</p>
                            </div>
                            {!notification.read && <div className="h-2 w-2 rounded-full bg-primary"></div>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                  <div className="p-4 border-t">
                    <Button variant="outline" size="sm" className="w-full" onClick={markAllAsRead}>
                      Mark all as read
                    </Button>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
              <ThemeToggle />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="hidden md:flex">
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
                        value={filterValues.timePeriod}
                        onValueChange={(value) => handleFilterChange("timePeriod", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select time period" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Time</SelectItem>
                          <SelectItem value="today">Today</SelectItem>
                          <SelectItem value="week">This Week</SelectItem>
                          <SelectItem value="month">This Month</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <h5 className="text-sm font-medium">Region</h5>
                      <Select
                        value={filterValues.region}
                        onValueChange={(value) => handleFilterChange("region", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select region" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Regions</SelectItem>
                          <SelectItem value="north">Northern Nigeria</SelectItem>
                          <SelectItem value="south">Southern Nigeria</SelectItem>
                          <SelectItem value="east">Eastern Nigeria</SelectItem>
                          <SelectItem value="west">Western Nigeria</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <h5 className="text-sm font-medium">Party</h5>
                      <Select value={filterValues.party} onValueChange={(value) => handleFilterChange("party", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select party" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Parties</SelectItem>
                          <SelectItem value="apc">APC</SelectItem>
                          <SelectItem value="pdp">PDP</SelectItem>
                          <SelectItem value="lp">LP</SelectItem>
                          <SelectItem value="nnpp">NNPP</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <h5 className="text-sm font-medium">Voter Turnout</h5>
                      <div className="px-2">
                        <Slider
                          value={filterValues.turnout}
                          min={0}
                          max={100}
                          step={1}
                          onValueChange={(value) => handleFilterChange("turnout", value)}
                        />
                        <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                          <span>{filterValues.turnout[0]}%</span>
                          <span>{filterValues.turnout[1]}%</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between pt-2">
                      <Button variant="outline" size="sm" onClick={resetFilters}>
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
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
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
                      <CardTitle className="text-sm font-medium">Time Remaining</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{timeRemaining.days} days</div>
                      <p className="text-xs text-muted-foreground">In 3-week voting period</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Charts */}
                <div className="grid gap-6 md:grid-cols-2">
                  <Card className="transition-all duration-300 hover:shadow-md">
                    <CardHeader>
                      <CardTitle>Vote Distribution</CardTitle>
                      <CardDescription>Votes by political party</CardDescription>
                    </CardHeader>
                    <CardContent className="h-80">
                      <BarChart
                        data={barChartData}
                        index="name"
                        categories={["votes"]}
                        colors={["emerald"]}
                        valueFormatter={(value) => `${(value / 1000000).toFixed(1)}M votes`}
                        yAxisWidth={60}
                      />
                    </CardContent>
                  </Card>

                  <Card className="transition-all duration-300 hover:shadow-md">
                    <CardHeader>
                      <CardTitle>Percentage Breakdown</CardTitle>
                      <CardDescription>Vote share by political party</CardDescription>
                    </CardHeader>
                    <CardContent className="h-80">
                      <PieChart
                        data={pieChartData}
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
                      <CardDescription>Real-time election news and announcements</CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-green-500 pulse-animation"></div>
                      <span className="text-xs font-medium">Live</span>
                    </div>
                  </CardHeader>
                  <CardContent>
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
                            National voter turnout has reached 50% - the highest in Nigeria's electoral history at this
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
                            <h4 className="font-semibold">Regional Update</h4>
                            <span className="text-xs text-muted-foreground">1.5 hours ago</span>
                          </div>
                          <p className="text-sm">
                            South East region reports record-breaking 72% turnout with LP leading in 4 out of 5 states.
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
                            EU Election Observation Mission praises Nigeria's digital voting system for transparency and
                            security.
                          </p>
                        </div>
                      </div>
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
                        <CardTitle>{ELECTION_TYPES[electionType as keyof typeof ELECTION_TYPES]} Candidates</CardTitle>
                        <CardDescription>
                          {votedElections[electionType]
                            ? "You have already voted in this election"
                            : "Select a candidate to cast your vote"}
                        </CardDescription>
                      </div>
                      {votedElections[electionType] && (
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
                    {isLoading ? (
                      <div className="space-y-4">
                        {[1, 2, 3, 4].map((i) => (
                          <div key={i} className="flex items-center rounded-lg border p-4 animate-pulse">
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
                    ) : candidates.length === 0 ? (
                      <div className="text-center py-8">
                        <div className="mx-auto w-12 h-12 rounded-full bg-muted/50 flex items-center justify-center mb-3">
                          <Search className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <h3 className="text-lg font-medium">No candidates found</h3>
                        <p className="text-muted-foreground mt-1">Try a different search term</p>
                        <Button
                          variant="outline"
                          className="mt-4"
                          onClick={() => {
                            setSearchTerm("")
                            setCandidates(candidatesByElection[electionType as keyof typeof candidatesByElection])
                          }}
                        >
                          Clear search
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {(isFiltered ? filteredCandidates : candidates).map((candidate) => (
                          <div
                            key={candidate.id}
                            className={`flex items-center rounded-lg border p-4 transition-all duration-300 ${
                              votedElections[electionType] === candidate.id
                                ? "border-green-500 bg-green-500/5"
                                : votedElections[electionType]
                                  ? "opacity-80 hover:bg-muted/30"
                                  : "cursor-pointer hover:bg-muted/50 hover:scale-[1.01] hover:shadow-md"
                            }`}
                            onClick={() => !votedElections[electionType] && handleCandidateSelect(candidate.id)}
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
                                {votedElections[electionType] === candidate.id && (
                                  <Check className="ml-2 h-4 w-4 text-green-500" />
                                )}
                              </h3>
                              <p className="text-sm text-muted-foreground">{candidate.party}</p>
                            </div>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <div className="text-right">
                                    <div className="font-bold">{(candidate.votes / 1000000).toFixed(1)}M</div>
                                    <div className="text-sm text-muted-foreground">
                                      {candidate.percentage}% of votes
                                    </div>
                                  </div>
                                </TooltipTrigger>
                                <TooltipContent side="left" className="max-w-xs">
                                  <div className="space-y-2">
                                    <p className="font-semibold">
                                      {candidate.name} ({candidate.party})
                                    </p>
                                    <p className="text-sm">{candidate.bio}</p>
                                    <p className="text-sm">
                                      <span className="font-medium">Manifesto:</span> {candidate.manifesto}
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
                        ))}
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <p className="text-sm text-muted-foreground">
                      {votedElections[electionType]
                        ? "Thank you for voting in this election"
                        : "Click on a candidate to cast your vote"}
                    </p>
                    {!hasVoted && (
                      <Button asChild className="ml-auto">
                        <Link href={`/vote?type=${electionType}`}>Vote Now</Link>
                      </Button>
                    )}
                  </CardFooter>
                </Card>

                {/* Candidate Comparison */}
                <Card>
                  <CardHeader>
                    <CardTitle>Candidate Comparison</CardTitle>
                    <CardDescription>Compare candidates side by side</CardDescription>
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
                          {(isFiltered ? filteredCandidates : candidates).map((candidate) => (
                            <tr key={candidate.id} className="border-b hover:bg-muted/30">
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
                              <td className="p-2">{candidate.party}</td>
                              <td className="p-2">{candidate.manifesto}</td>
                              <td className="p-2">{candidate.votes.toLocaleString()}</td>
                              <td className="p-2">
                                <div className="flex items-center gap-2">
                                  <Progress value={candidate.percentage} className="h-2 w-20" />
                                  <span>{candidate.percentage}%</span>
                                </div>
                              </td>
                            </tr>
                          ))}
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
                      <CardDescription>Detailed breakdown of voting patterns</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Tabs defaultValue="overview" onValueChange={setStatisticsFilter}>
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
                                  <CardTitle className="text-sm font-medium">Registered Voters</CardTitle>
                                </div>
                              </CardHeader>
                              <CardContent>
                                <div className="text-2xl font-bold">93,469,008</div>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                  <ArrowUp className="h-3 w-3 text-green-500" />
                                  <span>5.2% from 2019 election</span>
                                </div>
                              </CardContent>
                            </Card>

                            <Card className="bg-black/10 dark:bg-white/5 backdrop-blur-sm border-border/50 hover:shadow-md transition-all duration-300">
                              <CardHeader className="pb-2">
                                <div className="flex items-center gap-2">
                                  <div className="p-2 rounded-full bg-primary/10">
                                    <CreditCard className="h-4 w-4 text-primary" />
                                  </div>
                                  <CardTitle className="text-sm font-medium">PVCs Collected</CardTitle>
                                </div>
                              </CardHeader>
                              <CardContent>
                                <div className="text-2xl font-bold">87,209,007</div>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                  <span>93.3% collection rate</span>
                                </div>
                              </CardContent>
                            </Card>

                            <Card className="bg-black/10 dark:bg-white/5 backdrop-blur-sm border-border/50 hover:shadow-md transition-all duration-300">
                              <CardHeader className="pb-2">
                                <div className="flex items-center gap-2">
                                  <div className="p-2 rounded-full bg-primary/10">
                                    <UserCheck className="h-4 w-4 text-primary" />
                                  </div>
                                  <CardTitle className="text-sm font-medium">Accredited Voters</CardTitle>
                                </div>
                              </CardHeader>
                              <CardContent>
                                <div className="text-2xl font-bold">62,578,440</div>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                  <span>67.0% of registered voters</span>
                                </div>
                              </CardContent>
                            </Card>

                            <Card className="bg-black/10 dark:bg-white/5 backdrop-blur-sm border-border/50 hover:shadow-md transition-all duration-300">
                              <CardHeader className="pb-2">
                                <div className="flex items-center gap-2">
                                  <div className="p-2 rounded-full bg-primary/10">
                                    <CheckCircle className="h-4 w-4 text-primary" />
                                  </div>
                                  <CardTitle className="text-sm font-medium">Valid Votes</CardTitle>
                                </div>
                              </CardHeader>
                              <CardContent>
                                <div className="text-2xl font-bold">{getTotalVotes().toLocaleString()}</div>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                  <span>98.8% of total votes cast</span>
                                </div>
                              </CardContent>
                            </Card>

                            <Card className="bg-black/10 dark:bg-white/5 backdrop-blur-sm border-border/50 hover:shadow-md transition-all duration-300">
                              <CardHeader className="pb-2">
                                <div className="flex items-center gap-2">
                                  <div className="p-2 rounded-full bg-primary/10">
                                    <XCircle className="h-4 w-4 text-primary" />
                                  </div>
                                  <CardTitle className="text-sm font-medium">Rejected Votes</CardTitle>
                                </div>
                              </CardHeader>
                              <CardContent>
                                <div className="text-2xl font-bold">731,285</div>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                  <span>1.2% of total votes cast</span>
                                </div>
                              </CardContent>
                            </Card>

                            <Card className="bg-black/10 dark:bg-white/5 backdrop-blur-sm border-border/50 hover:shadow-md transition-all duration-300">
                              <CardHeader className="pb-2">
                                <div className="flex items-center gap-2">
                                  <div className="p-2 rounded-full bg-primary/10">
                                    <Percent className="h-4 w-4 text-primary" />
                                  </div>
                                  <CardTitle className="text-sm font-medium">Voter Turnout</CardTitle>
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
                              <h3 className="text-sm font-medium">Voter Turnout by Geopolitical Zone</h3>
                              <Select defaultValue="all">
                                <SelectTrigger className="w-[180px] h-8 text-xs">
                                  <SelectValue placeholder="Select Zone" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="all">All Zones</SelectItem>
                                  <SelectItem value="nc">North Central</SelectItem>
                                  <SelectItem value="ne">North East</SelectItem>
                                  <SelectItem value="nw">North West</SelectItem>
                                  <SelectItem value="se">South East</SelectItem>
                                  <SelectItem value="ss">South South</SelectItem>
                                  <SelectItem value="sw">South West</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            <div className="space-y-4">
                              <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                  <span className="text-sm">North Central</span>
                                  <span className="text-sm font-medium">67%</span>
                                </div>
                                <Progress value={67} className="h-2" />
                              </div>

                              <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                  <span className="text-sm">North East</span>
                                  <span className="text-sm font-medium">58%</span>
                                </div>
                                <Progress value={58} className="h-2" />
                              </div>

                              <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                  <span className="text-sm">North West</span>
                                  <span className="text-sm font-medium">72%</span>
                                </div>
                                <Progress value={72} className="h-2" />
                              </div>

                              <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                  <span className="text-sm">South East</span>
                                  <span className="text-sm font-medium">54%</span>
                                </div>
                                <Progress value={54} className="h-2" />
                              </div>

                              <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                  <span className="text-sm">South South</span>
                                  <span className="text-sm font-medium">61%</span>
                                </div>
                                <Progress value={61} className="h-2" />
                              </div>

                              <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                  <span className="text-sm">South West</span>
                                  <span className="text-sm font-medium">65%</span>
                                </div>
                                <Progress value={65} className="h-2" />
                              </div>
                            </div>
                          </div>
                        </TabsContent>

                        <TabsContent value="state" className="h-80 pt-4">
                          <BarChart
                            data={stateData}
                            index="name"
                            categories={["turnout"]}
                            colors={["blue"]}
                            valueFormatter={(value) => `${value}%`}
                            yAxisWidth={60}
                          />
                        </TabsContent>

                        <TabsContent value="demographic" className="h-80 pt-4">
                          <BarChart
                            data={demographicData}
                            index="age"
                            categories={["percentage"]}
                            colors={["purple"]}
                            valueFormatter={(value) => `${value}%`}
                            yAxisWidth={60}
                          />
                        </TabsContent>

                        <TabsContent value="gender" className="h-80 pt-4">
                          <PieChart
                            data={genderData}
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
                    <CardDescription>Comprehensive election data</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-6 md:grid-cols-3">
                      <div className="space-y-2">
                        <h3 className="font-medium">Registered Voters</h3>
                        <div className="text-2xl font-bold">93,469,008</div>
                        <p className="text-sm text-muted-foreground">Total eligible voters</p>
                      </div>

                      <div className="space-y-2">
                        <h3 className="font-medium">Votes Cast</h3>
                        <div className="text-2xl font-bold">{getTotalVotes().toLocaleString()}</div>
                        <p className="text-sm text-muted-foreground">62.5% turnout</p>
                      </div>

                      <div className="space-y-2">
                        <h3 className="font-medium">Invalid Votes</h3>
                        <div className="text-2xl font-bold">731,285</div>
                        <p className="text-sm text-muted-foreground">1.2% of total votes</p>
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
                    <CardDescription>Geographic distribution of votes across Nigeria</CardDescription>
                  </CardHeader>
                  <CardContent className="h-[500px] flex items-center justify-center">
                    <div className="text-center">
                      <div className="mx-auto mb-4 h-40 w-40 rounded-full bg-muted p-8">
                        <Map className="h-full w-full text-muted-foreground" />
                      </div>
                      <p className="text-muted-foreground">
                        Interactive map will be available when more results are in
                      </p>
                      <Button variant="outline" className="mt-4">
                        View Preliminary Map
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <div className="grid gap-6 md:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Regional Breakdown</CardTitle>
                      <CardDescription>Vote distribution by geopolitical zone</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
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
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Leading Party by State</CardTitle>
                      <CardDescription>Current leading party in each state</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ScrollArea className="h-[300px] pr-4">
                        <div className="space-y-4">
                          {[
                            { state: "Abia", party: "LP", percentage: 48 },
                            { state: "Adamawa", party: "PDP", percentage: 52 },
                            { state: "Akwa Ibom", party: "PDP", percentage: 55 },
                            { state: "Anambra", party: "LP", percentage: 63 },
                            { state: "Bauchi", party: "APC", percentage: 47 },
                            { state: "Bayelsa", party: "PDP", percentage: 51 },
                            { state: "Benue", party: "LP", percentage: 42 },
                            { state: "Borno", party: "APC", percentage: 58 },
                            { state: "Cross River", party: "APC", percentage: 45 },
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
                                  ${item.party === "APC" ? "bg-blue-500/10 text-blue-500 border-blue-500/20" : ""}
                                  ${item.party === "PDP" ? "bg-red-500/10 text-red-500 border-red-500/20" : ""}
                                  ${item.party === "LP" ? "bg-green-500/10 text-green-500 border-green-500/20" : ""}
                                  ${item.party === "NNPP" ? "bg-purple-500/10 text-purple-500 border-purple-500/20" : ""}
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
              <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Confirm Your Vote</DialogTitle>
                    <DialogDescription>
                      You are about to cast your vote in the{" "}
                      {ELECTION_TYPES[electionType as keyof typeof ELECTION_TYPES]}. This action cannot be undone.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="flex items-center space-x-4 py-4">
                    {selectedCandidate && (
                      <>
                        <div className="h-16 w-16 overflow-hidden rounded-full">
                          <img
                            src={candidates.find((c) => c.id === selectedCandidate)?.image || "/placeholder.svg"}
                            alt="Selected candidate"
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div>
                          <h4 className="font-medium">{candidates.find((c) => c.id === selectedCandidate)?.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {candidates.find((c) => c.id === selectedCandidate)?.party}
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                  <DialogFooter className="flex flex-col sm:flex-row sm:justify-between">
                    <Button variant="outline" onClick={() => setConfirmDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={confirmVote} disabled={isLoading} className="mt-2 sm:mt-0">
                      {isLoading ? "Processing..." : "Confirm Vote"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              {/* Success Dialog */}
              <Dialog open={successDialogOpen} onOpenChange={setSuccessDialogOpen}>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle className="flex items-center text-green-600">
                      <Check className="mr-2 h-5 w-5" /> Vote Successfully Cast
                    </DialogTitle>
                    <DialogDescription>
                      Your vote has been securely recorded. Thank you for participating in the{" "}
                      {ELECTION_TYPES[electionType as keyof typeof ELECTION_TYPES]}.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="flex flex-col items-center justify-center py-4 space-y-4">
                    <div className="h-20 w-20 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                      <Check className="h-10 w-10 text-green-600" />
                    </div>
                    <p className="text-center">
                      You can still vote in other elections. Your vote is anonymous and secure.
                    </p>
                  </div>
                  <DialogFooter>
                    <Button onClick={() => setSuccessDialogOpen(false)} className="w-full">
                      Continue
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              {/* AI Assistant */}
              <AiAssistantPreview />
            </Tabs>
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}

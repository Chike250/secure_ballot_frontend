// Create a new page for Live Stats that's accessible without login
"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Info, ArrowLeft, RefreshCw } from "lucide-react"
import { Button } from "@/src/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/src/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/src/components/ui/tooltip"
import { Badge } from "@/src/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/ui/tabs"
import { Navbar } from "@/src/components/navbar"
import { ElectionCharts } from "@/src/components/election-charts"
import { ElectoralMap } from "@/src/components/electoral-map"

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

// Add the missing hourlyData definition after the timeData definition
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

// State data for regional distribution chart
const stateData = [
  { state: "Lagos", apc: 550000, pdp: 400000, lp: 200000, nnpp: 20000, others: 10000 },
  { state: "Kano", apc: 480000, pdp: 350000, lp: 50000, nnpp: 60000, others: 10000 },
  { state: "Rivers", apc: 320000, pdp: 400000, lp: 150000, nnpp: 20000, others: 10000 },
  { state: "Kaduna", apc: 450000, pdp: 300000, lp: 100000, nnpp: 30000, others: 10000 },
  { state: "Oyo", apc: 380000, pdp: 420000, lp: 120000, nnpp: 15000, others: 5000 },
]

export default function LiveStatsPage() {
  const [electionType, setElectionType] = useState("presidential")
  const [selectedCandidate, setSelectedCandidate] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [regionView, setRegionView] = useState("national")
  const [timeView, setTimeView] = useState("daily")
  const [timeRange, setTimeRange] = useState([0, 100])
  const [candidates, setCandidates] = useState(candidatesByElection[electionType as keyof typeof candidatesByElection])
  const [refreshing, setRefreshing] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")
  const [mapView, setMapView] = useState("winner")
  const [lastUpdated, setLastUpdated] = useState(new Date())

  // Load candidates when election type changes
  useEffect(() => {
    setIsLoading(true)

    // Simulate API call delay
    const timer = setTimeout(() => {
      setCandidates(candidatesByElection[electionType as keyof typeof candidatesByElection])
      setIsLoading(false)
    }, 500)

    return () => clearTimeout(timer)
  }, [electionType])

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdated(new Date())
    }, 60000) // Update every minute

    return () => clearInterval(interval)
  }, [])

  // Handle candidate selection
  const handleCandidateSelect = (candidateId: number) => {
    setSelectedCandidate(selectedCandidate === candidateId ? null : candidateId)
  }

  // Handle refresh
  const handleRefresh = () => {
    setRefreshing(true)

    // Simulate refresh delay
    setTimeout(() => {
      setRefreshing(false)
      setLastUpdated(new Date())
    }, 1500)
  }

  // Calculate total votes
  const getTotalVotes = () => {
    return candidates.reduce((sum, candidate) => sum + candidate.votes, 0)
  }

  // Prepare data for charts
  const pieChartData = candidates.map((c) => ({
    id: c.id,
    name: c.name,
    party: c.party,
    value: c.percentage,
    votes: c.votes,
    color: c.color,
  }))

  const barChartData =
    regionView === "national"
      ? regionalData.map((r) => ({
          region: r.region,
          APC: r.apc,
          PDP: r.pdp,
          LP: r.lp,
          NNPP: r.nnpp,
          Others: r.others,
        }))
      : stateData.map((s) => ({
          region: s.state,
          APC: s.apc,
          PDP: s.pdp,
          LP: s.lp,
          NNPP: s.nnpp,
          Others: s.others,
        }))

  // Filter time data based on range
  const startIdx = Math.floor(timeData.length * (timeRange[0] / 100))
  const endIdx = Math.ceil(timeData.length * (timeRange[1] / 100))
  const filteredTimeData = timeData.slice(startIdx, endIdx)

  const lineChartData =
    timeView === "daily"
      ? filteredTimeData.map((t) => ({
          name: t.time,
          APC: t.apc,
          PDP: t.pdp,
          LP: t.lp,
          NNPP: t.nnpp,
          Others: t.others,
          milestone: t.milestone,
        }))
      : hourlyData.map((h) => ({
          name: h.hour,
          votes: h.votes,
          milestone: h.milestone,
        }))

  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <Button variant="ghost" size="sm" className="mb-2" asChild>
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </Button>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold">Live Election Results</h1>
              <p className="text-muted-foreground">Real-time updates from the 2027 Nigerian General Elections</p>
            </div>
            <div className="flex items-center gap-2 mt-4 md:mt-0">
              <Badge
                variant="outline"
                className="bg-green-500/10 text-green-500 border-green-500/20 flex items-center gap-1"
              >
                <div className="h-2 w-2 rounded-full bg-green-500 pulse-animation"></div>
                <span>Live</span>
              </Badge>
              <Button variant="outline" size="sm" onClick={handleRefresh} className={refreshing ? "animate-spin" : ""}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh
              </Button>
              <p className="text-xs text-muted-foreground">Last updated: {lastUpdated.toLocaleTimeString()}</p>
            </div>
          </div>
        </div>

        {/* Election Type Selector */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            {Object.entries(ELECTION_TYPES).map(([type, title]) => (
              <Button
                key={type}
                variant={electionType === type ? "default" : "outline"}
                size="sm"
                onClick={() => setElectionType(type)}
              >
                {title.split(" ")[0]}
              </Button>
            ))}
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="charts">Detailed Charts</TabsTrigger>
            <TabsTrigger value="map">Electoral Map</TabsTrigger>
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
                  <div className="text-2xl font-bold">{candidates[0].name.split(" ")[0]}</div>
                  <p className="text-xs text-muted-foreground">{candidates[0].percentage}% of votes</p>
                </CardContent>
              </Card>
            </div>

            {/* Charts Overview */}
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
                          This pie chart shows the percentage of votes received by each candidate.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </CardHeader>
                <CardContent className="pt-4">
                  <ElectionCharts
                    type="pie"
                    data={pieChartData}
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
                    <Select value={regionView} onValueChange={setRegionView}>
                      <SelectTrigger className="w-[130px]">
                        <SelectValue placeholder="View" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="national">Geopolitical Zones</SelectItem>
                        <SelectItem value="state">Top States</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  <ElectionCharts
                    type="bar"
                    data={barChartData}
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
                    <CardDescription>Vote progression over time</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Select value={timeView} onValueChange={setTimeView}>
                      <SelectTrigger className="w-[130px]">
                        <SelectValue placeholder="View" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Daily Trend</SelectItem>
                        <SelectItem value="hourly">Hourly Breakdown</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  <ElectionCharts
                    type="line"
                    data={lineChartData}
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
                <Button variant="outline" size="sm" onClick={() => setActiveTab("map")}>
                  View Full Map
                </Button>
              </CardHeader>
              <CardContent className="h-[400px]">
                <ElectoralMap
                  data={stateElectoralData}
                  view={mapView}
                  selectedCandidate={selectedCandidate}
                  isLoading={isLoading}
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Charts Tab */}
          <TabsContent value="charts" className="space-y-6">
            <Card>
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
                        {ELECTION_TYPES[electionType as keyof typeof ELECTION_TYPES]}.
                      </p>
                      <div className="h-[500px]">
                        <ElectionCharts
                          type="pie"
                          data={pieChartData}
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
                        <Select value={regionView} onValueChange={setRegionView}>
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select view" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="national">Geopolitical Zones</SelectItem>
                            <SelectItem value="state">Top States</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <p className="text-sm text-muted-foreground mb-4">
                        This bar chart shows vote distribution across{" "}
                        {regionView === "national" ? "geopolitical zones" : "states"}.
                      </p>
                      <div className="h-[500px]">
                        <ElectionCharts
                          type="bar"
                          data={barChartData}
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
                        <Select value={timeView} onValueChange={setTimeView}>
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select view" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="daily">Daily Trend</SelectItem>
                            <SelectItem value="hourly">Hourly Breakdown</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <p className="text-sm text-muted-foreground mb-4">
                        This line chart shows how votes accumulated over the{" "}
                        {timeView === "daily" ? "21-day voting period" : "election day"}.
                      </p>
                      <div className="h-[500px]">
                        <ElectionCharts
                          type="line"
                          data={lineChartData}
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
                    <Select value={mapView} onValueChange={setMapView}>
                      <SelectTrigger className="w-[130px]">
                        <SelectValue placeholder="View" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="winner">Winning Party</SelectItem>
                        <SelectItem value="turnout">Voter Turnout</SelectItem>
                        <SelectItem value="margin">Victory Margin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="h-[600px]">
                <ElectoralMap
                  data={stateElectoralData}
                  view={mapView}
                  selectedCandidate={selectedCandidate}
                  isLoading={isLoading}
                  interactive={true}
                />
              </CardContent>
              <CardFooter>
                <div className="w-full">
                  <h3 className="text-sm font-medium mb-2">Legend</h3>
                  <div className="flex flex-wrap gap-3">
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 rounded-sm" style={{ backgroundColor: "#64748b" }}></div>
                      <span className="text-sm">APC</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 rounded-sm" style={{ backgroundColor: "#ef4444" }}></div>
                      <span className="text-sm">PDP</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 rounded-sm" style={{ backgroundColor: "#22c55e" }}></div>
                      <span className="text-sm">LP</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 rounded-sm" style={{ backgroundColor: "#3b82f6" }}></div>
                      <span className="text-sm">NNPP</span>
                    </div>
                  </div>
                </div>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground mb-4">Want to participate in the election?</p>
          <Button asChild>
            <Link href="/login">Login to Vote</Link>
          </Button>
        </div>
      </main>
    </div>
  )
}

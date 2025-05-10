"use client"

import { Users, UserCheck, UserX, Search, Filter, Download, MoreHorizontal } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select"
import { ChartContainer } from "@/components/ui/chart"
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts"

// Mock data for charts
const ageData = [
  { name: "18-25", value: 25 },
  { name: "26-35", value: 35 },
  { name: "36-45", value: 20 },
  { name: "46-60", value: 15 },
  { name: "60+", value: 5 },
]

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]

const regionData = [
  { region: "North Central", voters: 4500000 },
  { region: "North East", voters: 3800000 },
  { region: "North West", voters: 5200000 },
  { region: "South East", voters: 3200000 },
  { region: "South South", voters: 3900000 },
  { region: "South West", voters: 4800000 },
]

// Mock voter data
const mockVoters = [
  { id: "1", name: "Adebayo Johnson", vin: "1234567890", status: "active", pollingUnit: "Lagos/Ikeja/001" },
  { id: "2", name: "Chioma Okafor", vin: "2345678901", status: "active", pollingUnit: "Enugu/Nsukka/015" },
  { id: "3", name: "Ibrahim Musa", vin: "3456789012", status: "inactive", pollingUnit: "Kano/Dala/022" },
  { id: "4", name: "Funke Adeyemi", vin: "4567890123", status: "active", pollingUnit: "Oyo/Ibadan/007" },
  { id: "5", name: "Emeka Okonkwo", vin: "5678901234", status: "active", pollingUnit: "Anambra/Onitsha/031" },
  { id: "6", name: "Fatima Abubakar", vin: "6789012345", status: "inactive", pollingUnit: "Kaduna/Zaria/014" },
  { id: "7", name: "Oluwaseun Adeleke", vin: "7890123456", status: "active", pollingUnit: "Osun/Ife/009" },
  { id: "8", name: "Ngozi Eze", vin: "8901234567", status: "active", pollingUnit: "Imo/Owerri/025" },
]

export function VoterOverview() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Registered</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">25,400,000</div>
            <div className="flex items-center mt-2">
              <Users className="h-4 w-4 mr-1 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Eligible population: 42,500,000</span>
            </div>
            <Progress value={60} className="h-2 mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Voters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">22,860,000</div>
            <div className="flex items-center mt-2">
              <UserCheck className="h-4 w-4 mr-1 text-green-500" />
              <span className="text-xs text-muted-foreground">90% of registered voters</span>
            </div>
            <Progress value={90} className="h-2 mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Inactive Voters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,540,000</div>
            <div className="flex items-center mt-2">
              <UserX className="h-4 w-4 mr-1 text-amber-500" />
              <span className="text-xs text-muted-foreground">10% of registered voters</span>
            </div>
            <Progress value={10} className="h-2 mt-2" />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>Voter Demographics</CardTitle>
              <CardDescription>Breakdown of registered voters by age and region</CardDescription>
            </div>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export Data
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="demographics">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="demographics">Demographics</TabsTrigger>
              <TabsTrigger value="regional">Regional Distribution</TabsTrigger>
            </TabsList>
            <TabsContent value="demographics" className="space-y-4">
              <div className="h-[300px] mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={ageData}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {ageData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `${value}%`} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
            <TabsContent value="regional" className="space-y-4">
              <div className="h-[300px] mt-4">
                <ChartContainer
                  config={{
                    voters: {
                      label: "Registered Voters",
                      color: "hsl(var(--chart-1))",
                    },
                  }}
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={regionData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="region" />
                      <YAxis />
                      <Tooltip formatter={(value) => `${(value as number).toLocaleString()}`} />
                      <Legend />
                      <Bar dataKey="voters" fill="var(--color-voters)" name="Voters" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>Voter Registry</CardTitle>
              <CardDescription>Manage and view registered voters</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-col gap-4 sm:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search voters by name or VIN..." className="pl-8" />
              </div>
              <div className="flex gap-2">
                <Select defaultValue="all">
                  <SelectTrigger className="w-[130px]">
                    <div className="flex items-center gap-2">
                      <Filter className="h-4 w-4" />
                      <span>Status</span>
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>

                <Select defaultValue="all">
                  <SelectTrigger className="w-[130px]">
                    <div className="flex items-center gap-2">
                      <Filter className="h-4 w-4" />
                      <span>Region</span>
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Regions</SelectItem>
                    <SelectItem value="north">Northern</SelectItem>
                    <SelectItem value="south">Southern</SelectItem>
                    <SelectItem value="east">Eastern</SelectItem>
                    <SelectItem value="west">Western</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>VIN</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Polling Unit</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockVoters.map((voter) => (
                    <TableRow key={voter.id}>
                      <TableCell className="font-medium">{voter.name}</TableCell>
                      <TableCell>{voter.vin}</TableCell>
                      <TableCell>
                        <Badge variant={voter.status === "active" ? "default" : "outline"} className="capitalize">
                          {voter.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{voter.pollingUnit}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

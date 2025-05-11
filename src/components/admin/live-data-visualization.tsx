"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/ui/tabs"
import { ChartContainer } from "@/src/components/ui/chart"
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
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
const voterTrafficData = [
  { time: "6AM", voters: 120 },
  { time: "8AM", voters: 350 },
  { time: "10AM", voters: 580 },
  { time: "12PM", voters: 420 },
  { time: "2PM", voters: 650 },
  { time: "4PM", voters: 780 },
  { time: "6PM", voters: 390 },
]

const turnoutData = [
  { name: "North Central", value: 65 },
  { name: "North East", value: 48 },
  { name: "North West", value: 72 },
  { name: "South East", value: 58 },
  { name: "South South", value: 62 },
  { name: "South West", value: 70 },
]

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82ca9d"]

const votingTrendsData = [
  { day: "Day 1", onsite: 2400, online: 1800 },
  { day: "Day 2", onsite: 1398, online: 2800 },
  { day: "Day 3", onsite: 9800, online: 7200 },
  { day: "Day 4", onsite: 3908, online: 5000 },
  { day: "Day 5", onsite: 4800, online: 4300 },
]

export function LiveDataVisualization() {
  return (
    <Card className="col-span-1 lg:col-span-2">
      <CardHeader>
        <CardTitle>Live Data Visualization</CardTitle>
        <CardDescription>Real-time voting statistics and trends</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="traffic">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="traffic">Voter Traffic</TabsTrigger>
            <TabsTrigger value="turnout">Turnout</TabsTrigger>
            <TabsTrigger value="trends">Voting Trends</TabsTrigger>
          </TabsList>
          <TabsContent value="traffic" className="space-y-4">
            <div className="h-[300px] mt-4">
              <ChartContainer
                config={{
                  voters: {
                    label: "Voter Traffic",
                    color: "hsl(var(--chart-1))",
                  },
                }}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={voterTrafficData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="voters" fill="var(--color-voters)" name="Voters" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </TabsContent>
          <TabsContent value="turnout" className="space-y-4">
            <div className="h-[300px] mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={turnoutData}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {turnoutData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value}%`} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
          <TabsContent value="trends" className="space-y-4">
            <div className="h-[300px] mt-4">
              <ChartContainer
                config={{
                  onsite: {
                    label: "On-site Voting",
                    color: "hsl(var(--chart-1))",
                  },
                  online: {
                    label: "Online Voting",
                    color: "hsl(var(--chart-2))",
                  },
                }}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={votingTrendsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="onsite" stroke="var(--color-onsite)" name="On-site" />
                    <Line type="monotone" dataKey="online" stroke="var(--color-online)" name="Online" />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

"use client"

import { useState } from "react"
import { Download, RefreshCw } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Button } from "@/src/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select"
import { ChartContainer } from "@/src/components/ui/chart"
import {
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts"

// Mock data for traffic monitoring
const realtimeData = [
  { time: "00:00", users: 245, requests: 1200, errors: 12 },
  { time: "01:00", users: 180, requests: 890, errors: 8 },
  { time: "02:00", users: 120, requests: 750, errors: 5 },
  { time: "03:00", users: 90, requests: 600, errors: 3 },
  { time: "04:00", users: 75, requests: 400, errors: 2 },
  { time: "05:00", users: 100, requests: 500, errors: 4 },
  { time: "06:00", users: 180, requests: 780, errors: 7 },
  { time: "07:00", users: 350, requests: 1500, errors: 15 },
  { time: "08:00", users: 620, requests: 2800, errors: 22 },
  { time: "09:00", users: 950, requests: 4200, errors: 31 },
  { time: "10:00", users: 1100, requests: 5100, errors: 28 },
  { time: "11:00", users: 1250, requests: 5800, errors: 35 },
]

const locationData = [
  { location: "Lagos", users: 3500, percentage: 28 },
  { location: "Abuja", users: 2100, percentage: 17 },
  { location: "Kano", users: 1800, percentage: 14 },
  { location: "Port Harcourt", users: 1500, percentage: 12 },
  { location: "Ibadan", users: 1200, percentage: 10 },
  { location: "Enugu", users: 950, percentage: 8 },
  { location: "Benin City", users: 750, percentage: 6 },
  { location: "Others", users: 650, percentage: 5 },
]

const deviceData = [
  { name: "Mobile", value: 68 },
  { name: "Desktop", value: 24 },
  { name: "Tablet", value: 8 },
]

export function TrafficMonitoring() {
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [timeRange, setTimeRange] = useState("12h")

  const handleRefresh = () => {
    setIsRefreshing(true)
    // Simulate API call
    setTimeout(() => {
      setIsRefreshing(false)
    }, 1500)
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>Traffic Monitoring</CardTitle>
            <CardDescription>Real-time system traffic and user activity</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Time Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1h">Last Hour</SelectItem>
                <SelectItem value="12h">Last 12 Hours</SelectItem>
                <SelectItem value="24h">Last 24 Hours</SelectItem>
                <SelectItem value="7d">Last 7 Days</SelectItem>
                <SelectItem value="30d">Last 30 Days</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon" onClick={handleRefresh} disabled={isRefreshing}>
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
            </Button>
            <Button variant="outline" size="icon">
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="realtime">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="realtime">Real-time Traffic</TabsTrigger>
            <TabsTrigger value="location">Geographic</TabsTrigger>
            <TabsTrigger value="devices">Devices</TabsTrigger>
          </TabsList>

          <TabsContent value="realtime" className="space-y-4">
            <div className="h-[350px] mt-4">
              <ChartContainer
                config={{
                  users: {
                    label: "Active Users",
                    color: "hsl(var(--chart-1))",
                  },
                  requests: {
                    label: "API Requests",
                    color: "hsl(var(--chart-2))",
                  },
                  errors: {
                    label: "Errors",
                    color: "hsl(var(--chart-3))",
                  },
                }}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={realtimeData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Legend />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="users"
                      stroke="var(--color-users)"
                      name="Active Users"
                      strokeWidth={2}
                    />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="requests"
                      stroke="var(--color-requests)"
                      name="API Requests"
                      strokeWidth={2}
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="errors"
                      stroke="var(--color-errors)"
                      name="Errors"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Peak Active Users</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">1,250</div>
                  <p className="text-xs text-muted-foreground">+12% from yesterday</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Total API Requests</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">24,520</div>
                  <p className="text-xs text-muted-foreground">+5% from yesterday</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Error Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">0.68%</div>
                  <p className="text-xs text-muted-foreground">-0.2% from yesterday</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="location" className="space-y-4">
            <div className="h-[350px] mt-4">
              <ChartContainer
                config={{
                  users: {
                    label: "Users",
                    color: "hsl(var(--chart-1))",
                  },
                }}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={locationData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="location" />
                    <YAxis />
                    <Tooltip formatter={(value) => `${value.toLocaleString()}`} />
                    <Legend />
                    <Bar dataKey="users" fill="var(--color-users)" name="Users" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
            <div className="rounded-md border">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="p-2 text-left font-medium">Location</th>
                    <th className="p-2 text-right font-medium">Users</th>
                    <th className="p-2 text-right font-medium">Percentage</th>
                  </tr>
                </thead>
                <tbody>
                  {locationData.map((item) => (
                    <tr key={item.location} className="border-b">
                      <td className="p-2">{item.location}</td>
                      <td className="p-2 text-right">{item.users.toLocaleString()}</td>
                      <td className="p-2 text-right">{item.percentage}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>

          <TabsContent value="devices" className="space-y-4">
            <div className="h-[350px] mt-4">
              <ChartContainer
                config={{
                  value: {
                    label: "Percentage",
                    color: "hsl(var(--chart-1))",
                  },
                }}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={deviceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => `${value}%`} />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="value"
                      fill="var(--color-value)"
                      stroke="var(--color-value)"
                      name="Percentage"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Mobile</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">68%</div>
                  <p className="text-xs text-muted-foreground">+3% from last month</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Desktop</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">24%</div>
                  <p className="text-xs text-muted-foreground">-2% from last month</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Tablet</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">8%</div>
                  <p className="text-xs text-muted-foreground">-1% from last month</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="border-t px-6 py-4">
        <div className="flex items-center justify-between w-full text-xs text-muted-foreground">
          <span>Data refreshes automatically every 5 minutes</span>
          <Button variant="link" size="sm" className="p-0 h-auto">
            View detailed analytics
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}

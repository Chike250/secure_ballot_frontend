"use client"

import { Activity, Zap, AlertTriangle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card"
import { ChartContainer } from "@/src/components/ui/chart"
import {
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts"

// Mock data for performance metrics
const performanceData = [
  { time: "00:00", responseTime: 120, errorRate: 0.2, serverLoad: 25 },
  { time: "04:00", responseTime: 132, errorRate: 0.3, serverLoad: 28 },
  { time: "08:00", responseTime: 245, errorRate: 0.7, serverLoad: 45 },
  { time: "12:00", responseTime: 378, errorRate: 1.2, serverLoad: 86 },
  { time: "16:00", responseTime: 290, errorRate: 0.8, serverLoad: 65 },
  { time: "20:00", responseTime: 185, errorRate: 0.4, serverLoad: 42 },
  { time: "Now", responseTime: 152, errorRate: 0.3, serverLoad: 38 },
]

export function PerformanceAnalytics() {
  return (
    <Card className="col-span-1 lg:col-span-2">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Activity className="mr-2 h-5 w-5" />
          Performance Analytics
        </CardTitle>
        <CardDescription>System performance metrics over the last 24 hours</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">API Response Time</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">152ms</div>
              <div className="flex items-center mt-2">
                <Zap className="h-4 w-4 mr-1 text-green-500" />
                <span className="text-xs text-green-500">12% faster than average</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Error Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0.3%</div>
              <div className="flex items-center mt-2">
                <AlertTriangle className="h-4 w-4 mr-1 text-amber-500" />
                <span className="text-xs text-amber-500">Within acceptable range</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Server Load</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">38%</div>
              <div className="flex items-center mt-2">
                <Zap className="h-4 w-4 mr-1 text-green-500" />
                <span className="text-xs text-green-500">Resources available</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <div className="h-[300px]">
            <ChartContainer
              config={{
                responseTime: {
                  label: "Response Time (ms)",
                  color: "hsl(var(--chart-1))",
                },
                errorRate: {
                  label: "Error Rate (%)",
                  color: "hsl(var(--chart-2))",
                },
              }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis yAxisId="left" orientation="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="responseTime"
                    stroke="var(--color-responseTime)"
                    name="Response Time (ms)"
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="errorRate"
                    stroke="var(--color-errorRate)"
                    name="Error Rate (%)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>

          <div className="h-[200px]">
            <ChartContainer
              config={{
                serverLoad: {
                  label: "Server Load (%)",
                  color: "hsl(var(--chart-3))",
                },
              }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="serverLoad"
                    stroke="var(--color-serverLoad)"
                    fill="var(--color-serverLoad)"
                    fillOpacity={0.3}
                    name="Server Load (%)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

"use client"

import { BarChart3, PieChart, Users, Map } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/ui/tabs"
import { BarChart, LineChart, PieChart as Chart } from "@/src/components/ui/chart"

export function StatsPreview() {
  // Sample data for charts
  const barChartData = [
    { name: "APC", votes: 8500000 },
    { name: "PDP", votes: 6900000 },
    { name: "LP", votes: 6100000 },
    { name: "NNPP", votes: 1500000 },
    { name: "Others", votes: 1000000 },
  ]

  const pieChartData = [
    { name: "APC", value: 35 },
    { name: "PDP", value: 28 },
    { name: "LP", value: 25 },
    { name: "NNPP", value: 7 },
    { name: "Others", value: 5 },
  ]

  const lineChartData = [
    { time: "6 AM", turnout: 10 },
    { time: "8 AM", turnout: 25 },
    { time: "10 AM", turnout: 45 },
    { time: "12 PM", turnout: 60 },
    { time: "2 PM", turnout: 75 },
    { time: "4 PM", turnout: 90 },
    { time: "6 PM", turnout: 100 },
  ]

  return (
    <Card className="glassmorphism">
      <CardHeader>
        <CardTitle>Live Election Statistics</CardTitle>
        <CardDescription>Real-time data from the 2025 Nigerian General Elections</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="bar">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="bar" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">Votes</span>
            </TabsTrigger>
            <TabsTrigger value="pie" className="flex items-center gap-2">
              <PieChart className="h-4 w-4" />
              <span className="hidden sm:inline">Percentage</span>
            </TabsTrigger>
            <TabsTrigger value="line" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Turnout</span>
            </TabsTrigger>
            <TabsTrigger value="map" className="flex items-center gap-2">
              <Map className="h-4 w-4" />
              <span className="hidden sm:inline">Map</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="bar" className="h-80 pt-4">
            <BarChart
              data={barChartData}
              index="name"
              categories={["votes"]}
              colors={["emerald"]}
              valueFormatter={(value) => `${(value / 1000000).toFixed(1)}M votes`}
              yAxisWidth={60}
            />
          </TabsContent>

          <TabsContent value="pie" className="h-80 pt-4">
            <Chart
              data={pieChartData}
              index="name"
              categories={["value"]}
              colors={["emerald", "blue", "red", "yellow", "purple"]}
              valueFormatter={(value) => `${value}%`}
            />
          </TabsContent>

          <TabsContent value="line" className="h-80 pt-4">
            <LineChart
              data={lineChartData}
              index="time"
              categories={["turnout"]}
              colors={["emerald"]}
              valueFormatter={(value) => `${value}%`}
              yAxisWidth={40}
            />
          </TabsContent>

          <TabsContent value="map" className="flex h-80 items-center justify-center pt-4">
            <div className="text-center">
              <div className="mx-auto mb-4 h-40 w-40 rounded-full bg-muted p-8">
                <Map className="h-full w-full text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground">Interactive map will be available on election day</p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

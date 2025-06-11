"use client"

import { useState, useEffect } from "react"
import { useAdminData } from "@/hooks/useAdminData"
import { useElectionData } from "@/hooks/useElectionData"
import { Activity, AlertTriangle, CheckCircle, Clock, RefreshCw, Users, Vote } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"

export function SystemOverview() {
  const { systemStatistics, fetchSystemStatistics } = useAdminData()
  const { elections } = useElectionData()
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [lastUpdated, setLastUpdated] = useState("2 minutes ago")
  const [systemStatus, setSystemStatus] = useState("operational")

  // Calculate real statistics
  const activeElections = elections?.filter(e => e.status === 'active')?.length || 0
  const totalVoters = systemStatistics?.totalVoters || 0
  const totalVotes = systemStatistics?.totalVotes || 0
  const voterTurnout = totalVoters > 0 ? Math.round((totalVotes / totalVoters) * 100) : 0

  const handleRefresh = async () => {
    setIsRefreshing(true)
    try {
      await fetchSystemStatistics()
      setLastUpdated("Just now")
    } catch (error) {
      console.error("Failed to refresh statistics:", error)
    } finally {
      setIsRefreshing(false)
    }
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Elections</CardTitle>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{activeElections}</div>
          <p className="text-xs text-muted-foreground">Currently running</p>
          <div className="mt-4 flex items-center gap-2">
            <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
              Presidential
            </Badge>
            <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20">
              2 State
            </Badge>
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="ghost" size="sm" className="w-full">
            View all elections
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Registered Voters</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {totalVoters > 0 
              ? totalVoters >= 1000000 
                ? `${(totalVoters / 1000000).toFixed(1)}M`
                : totalVoters >= 1000
                ? `${(totalVoters / 1000).toFixed(1)}K`
                : totalVoters.toLocaleString()
              : '0'
            }
          </div>
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground">Registered voters</p>
          </div>
          <div className="mt-2">
            <div className="flex items-center justify-between text-xs mb-1">
              <span>Total Registered</span>
              <span>{totalVoters.toLocaleString()}</span>
            </div>
            <Progress value={100} className="h-1" />
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="ghost" size="sm" className="w-full">
            Manage voters
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Votes Cast</CardTitle>
          <Vote className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {totalVotes > 0 
              ? totalVotes >= 1000000 
                ? `${(totalVotes / 1000000).toFixed(1)}M`
                : totalVotes >= 1000
                ? `${(totalVotes / 1000).toFixed(1)}K`
                : totalVotes.toLocaleString()
              : '0'
            }
          </div>
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground">{voterTurnout}% of registered voters</p>
          </div>
          <div className="mt-2">
            <div className="flex items-center justify-between text-xs mb-1">
              <span>Turnout</span>
              <span>{voterTurnout}%</span>
            </div>
            <Progress value={voterTurnout} className="h-1" />
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="ghost" size="sm" className="w-full">
            View voting statistics
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">System Status</CardTitle>
          {systemStatus === "operational" ? (
            <CheckCircle className="h-4 w-4 text-green-500" />
          ) : systemStatus === "degraded" ? (
            <AlertTriangle className="h-4 w-4 text-amber-500" />
          ) : (
            <AlertTriangle className="h-4 w-4 text-red-500" />
          )}
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <Badge
              variant={systemStatus === "operational" ? "default" : "outline"}
              className={
                systemStatus === "operational"
                  ? "bg-green-500 hover:bg-green-500/80"
                  : systemStatus === "degraded"
                    ? "bg-amber-500/10 text-amber-500 border-amber-500/20 hover:bg-amber-500/20"
                    : "bg-red-500/10 text-red-500 border-red-500/20 hover:bg-red-500/20"
              }
            >
              {systemStatus === "operational"
                ? "All Systems Operational"
                : systemStatus === "degraded"
                  ? "Performance Degraded"
                  : "System Issues Detected"}
            </Badge>
          </div>
          <div className="mt-3 flex items-center text-xs text-muted-foreground">
            <Clock className="mr-1 h-3 w-3" />
            <span>Last updated: {lastUpdated}</span>
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="ghost" size="sm" className="w-full" onClick={handleRefresh} disabled={isRefreshing}>
            {isRefreshing ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Refreshing...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh Status
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

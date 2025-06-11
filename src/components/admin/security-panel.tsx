"use client"

import { useState } from "react"
import { Shield, ShieldAlert, ShieldCheck, Lock, Key, Search, Filter, AlertTriangle, Eye, Activity } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

// Mock security events data
const securityEvents = [
  {
    id: "1",
    type: "authentication",
    event: "Failed Login Attempt",
    user: "unknown",
    timestamp: "2024-01-25 10:45:33",
    ipAddress: "45.227.89.12",
    severity: "high",
    details: "Multiple failed attempts detected"
  },
  {
    id: "2",
    type: "access",
    event: "Admin Panel Access",
    user: "admin@secureballot.ng",
    timestamp: "2024-01-25 08:15:22",
    ipAddress: "102.89.23.156",
    severity: "low",
    details: "Successful admin login"
  },
  {
    id: "3",
    type: "system",
    event: "Security Scan Completed",
    user: "system",
    timestamp: "2024-01-25 06:00:00",
    ipAddress: "localhost",
    severity: "info",
    details: "Automated security scan - no threats found"
  },
  {
    id: "4",
    type: "data",
    event: "Data Export Request",
    user: "admin@secureballot.ng",
    timestamp: "2024-01-25 11:22:05",
    ipAddress: "102.89.23.156",
    severity: "medium",
    details: "Voter data export requested"
  }
]

export function SecurityPanel() {
  const [searchTerm, setSearchTerm] = useState("")
  const [eventTypeFilter, setEventTypeFilter] = useState("all")
  const [severityFilter, setSeverityFilter] = useState("all")

  // Filter security events based on search and filters
  const filteredEvents = securityEvents.filter((event) => {
    const matchesSearch = 
      event.event.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.ipAddress.includes(searchTerm) ||
      event.details.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesType = eventTypeFilter === "all" || event.type === eventTypeFilter
    const matchesSeverity = severityFilter === "all" || event.severity === severityFilter
    
    return matchesSearch && matchesType && matchesSeverity
  })

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "high":
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      case "medium":
        return <Eye className="h-4 w-4 text-yellow-500" />
      case "low":
        return <Activity className="h-4 w-4 text-blue-500" />
      default:
        return <Shield className="h-4 w-4 text-gray-500" />
    }
  }

  const getSeverityVariant = (severity: string) => {
    switch (severity) {
      case "high":
        return "destructive"
      case "medium":
        return "outline"
      case "low":
        return "default"
      default:
        return "secondary"
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="mr-2 h-5 w-5" />
              Security Status
            </CardTitle>
            <CardDescription>Overall system security status and recommendations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <div className="text-sm font-medium">System Security Score</div>
                  <div className="text-sm font-medium">85%</div>
                </div>
                <Progress value={85} className="h-2" />
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-4 rounded-lg border p-4 bg-green-50 dark:bg-green-950/20">
                  <ShieldCheck className="mt-0.5 h-5 w-5 text-green-500" />
                  <div>
                    <p className="font-medium">Authentication Security</p>
                    <p className="text-sm text-muted-foreground">
                      Two-factor authentication is enabled for all admin accounts
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 rounded-lg border p-4 bg-green-50 dark:bg-green-950/20">
                  <Lock className="mt-0.5 h-5 w-5 text-green-500" />
                  <div>
                    <p className="font-medium">Data Encryption</p>
                    <p className="text-sm text-muted-foreground">
                      All voter data and ballot information is encrypted at rest and in transit
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 rounded-lg border p-4 bg-amber-50 dark:bg-amber-950/20">
                  <ShieldAlert className="mt-0.5 h-5 w-5 text-amber-500" />
                  <div>
                    <p className="font-medium">Security Updates</p>
                    <p className="text-sm text-muted-foreground">
                      System update available. Schedule maintenance to apply security patches.
                    </p>
                    <Button size="sm" variant="outline" className="mt-2">
                      Schedule Update
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Key className="mr-2 h-5 w-5" />
              Security Settings
            </CardTitle>
            <CardDescription>Configure system security settings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="two-factor">Two-Factor Authentication</Label>
                  <p className="text-sm text-muted-foreground">Require 2FA for all admin accounts</p>
                </div>
                <Switch id="two-factor" defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="ip-restriction">IP Restriction</Label>
                  <p className="text-sm text-muted-foreground">Limit admin access to specific IP addresses</p>
                </div>
                <Switch id="ip-restriction" defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="audit-logging">Enhanced Audit Logging</Label>
                  <p className="text-sm text-muted-foreground">Log all system activities in detail</p>
                </div>
                <Switch id="audit-logging" defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="auto-logout">Auto Logout</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically log out inactive sessions after 15 minutes
                  </p>
                </div>
                <Switch id="auto-logout" defaultChecked />
              </div>

              <Button className="w-full">Save Security Settings</Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Security Events Section */}
      <Card>
        <CardHeader>
          <CardTitle>Security Events</CardTitle>
          <CardDescription>Recent security events and system activities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-col gap-4 sm:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search security events..." 
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <Select value={eventTypeFilter} onValueChange={setEventTypeFilter}>
                  <SelectTrigger className="w-[130px]">
                    <div className="flex items-center gap-2">
                      <Filter className="h-4 w-4" />
                      <span>Type</span>
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="authentication">Authentication</SelectItem>
                    <SelectItem value="access">Access</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                    <SelectItem value="data">Data</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={severityFilter} onValueChange={setSeverityFilter}>
                  <SelectTrigger className="w-[130px]">
                    <div className="flex items-center gap-2">
                      <Filter className="h-4 w-4" />
                      <span>Severity</span>
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Severity</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="info">Info</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Event</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>IP Address</TableHead>
                    <TableHead>Severity</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEvents.length > 0 ? (
                    filteredEvents.map((event) => (
                      <TableRow key={event.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-start gap-2">
                            {getSeverityIcon(event.severity)}
                            <div>
                              <div>{event.event}</div>
                              <div className="text-xs text-muted-foreground mt-1">{event.details}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{event.user}</TableCell>
                        <TableCell>{event.timestamp}</TableCell>
                        <TableCell>{event.ipAddress}</TableCell>
                        <TableCell>
                          <Badge variant={getSeverityVariant(event.severity)} className="capitalize">
                            {event.severity}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                        No security events found matching your search criteria
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Results summary */}
            <div className="text-sm text-muted-foreground">
              Showing {filteredEvents.length} of {securityEvents.length} security events
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

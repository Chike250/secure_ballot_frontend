"use client"

import { useState } from "react"
import { Filter, Search } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select"

// Mock audit log data
const auditLogs = [
  {
    id: "1",
    action: "Login",
    user: "admin@secureballot.ng",
    timestamp: "2023-02-25 08:15:22",
    ipAddress: "102.89.23.156",
    status: "success",
  },
  {
    id: "2",
    action: "Start Election",
    user: "admin@secureballot.ng",
    timestamp: "2023-02-25 08:30:45",
    ipAddress: "102.89.23.156",
    status: "success",
    details: "Presidential Election 2023",
  },
  {
    id: "3",
    action: "Configuration Change",
    user: "supervisor@secureballot.ng",
    timestamp: "2023-02-25 09:12:18",
    ipAddress: "102.89.23.157",
    status: "success",
    details: "Updated polling unit settings",
  },
  {
    id: "4",
    action: "Failed Login Attempt",
    user: "unknown",
    timestamp: "2023-02-25 10:45:33",
    ipAddress: "45.227.89.12",
    status: "failed",
    details: "Multiple failed attempts",
  },
  {
    id: "5",
    action: "Voter Data Export",
    user: "admin@secureballot.ng",
    timestamp: "2023-02-25 11:22:05",
    ipAddress: "102.89.23.156",
    status: "success",
    details: "Exported voter registration data",
  },
]

export function AuditLogs() {
  const [searchTerm, setSearchTerm] = useState("")
  const [actionFilter, setActionFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")

  // Filter audit logs based on search and filters
  const filteredLogs = auditLogs.filter((log) => {
    const matchesSearch = 
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.ipAddress.includes(searchTerm) ||
      (log.details && log.details.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesAction = actionFilter === "all" || (() => {
      switch (actionFilter) {
        case "login":
          return log.action.toLowerCase().includes("login")
        case "election":
          return log.action.toLowerCase().includes("election")
        case "config":
          return log.action.toLowerCase().includes("configuration")
        case "export":
          return log.action.toLowerCase().includes("export")
        default:
          return true
      }
    })()
    
    const matchesStatus = statusFilter === "all" || log.status === statusFilter
    
    return matchesSearch && matchesAction && matchesStatus
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Audit Logs</CardTitle>
        <CardDescription>System activity and security events</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search logs by action, user, IP, or details..." 
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Select value={actionFilter} onValueChange={setActionFilter}>
                <SelectTrigger className="w-[130px]">
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    <span>Action</span>
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Actions</SelectItem>
                  <SelectItem value="login">Login</SelectItem>
                  <SelectItem value="election">Election</SelectItem>
                  <SelectItem value="config">Configuration</SelectItem>
                  <SelectItem value="export">Data Export</SelectItem>
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[130px]">
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    <span>Status</span>
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="success">Success</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                  <SelectItem value="warning">Warning</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Action</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>IP Address</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLogs.length > 0 ? (
                  filteredLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="font-medium">
                        <div>
                          <div>{log.action}</div>
                          {log.details && (
                            <div className="text-xs text-muted-foreground mt-1">{log.details}</div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{log.user}</TableCell>
                      <TableCell>{log.timestamp}</TableCell>
                      <TableCell>{log.ipAddress}</TableCell>
                      <TableCell>
                        <Badge variant={log.status === "success" ? "default" : "destructive"} className="capitalize">
                          {log.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      No logs found matching your search criteria
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          
          {/* Results summary */}
          <div className="text-sm text-muted-foreground">
            Showing {filteredLogs.length} of {auditLogs.length} log entries
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

"use client"
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
              <Input placeholder="Search logs..." className="pl-8" />
            </div>
            <div className="flex gap-2">
              <Select defaultValue="all">
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

              <Select defaultValue="all">
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
                {auditLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="font-medium">{log.action}</TableCell>
                    <TableCell>{log.user}</TableCell>
                    <TableCell>{log.timestamp}</TableCell>
                    <TableCell>{log.ipAddress}</TableCell>
                    <TableCell>
                      <Badge variant={log.status === "success" ? "default" : "destructive"} className="capitalize">
                        {log.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

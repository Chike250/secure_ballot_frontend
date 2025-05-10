"use client"

import { useState } from "react"
import { Users, UserPlus, MoreHorizontal, Clock, Shield } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface AdminUser {
  id: string
  name: string
  role: string
  email: string
  lastLogin: string
  status: "online" | "offline" | "away"
  avatarUrl?: string
}

const mockAdminUsers: AdminUser[] = [
  {
    id: "1",
    name: "Dr. Aisha Mohammed",
    role: "Chief Electoral Commissioner",
    email: "aisha.mohammed@inec.gov.ng",
    lastLogin: "Currently online",
    status: "online",
    avatarUrl: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "2",
    name: "Emmanuel Okonkwo",
    role: "System Administrator",
    email: "emmanuel.okonkwo@inec.gov.ng",
    lastLogin: "Last login: 25 minutes ago",
    status: "away",
    avatarUrl: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "3",
    name: "Fatima Ibrahim",
    role: "Security Officer",
    email: "fatima.ibrahim@inec.gov.ng",
    lastLogin: "Last login: 2 hours ago",
    status: "offline",
    avatarUrl: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "4",
    name: "Chukwudi Eze",
    role: "Regional Supervisor",
    email: "chukwudi.eze@inec.gov.ng",
    lastLogin: "Last login: 1 day ago",
    status: "offline",
    avatarUrl: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "5",
    name: "Ngozi Adeyemi",
    role: "Data Analyst",
    email: "ngozi.adeyemi@inec.gov.ng",
    lastLogin: "Currently online",
    status: "online",
    avatarUrl: "/placeholder.svg?height=40&width=40",
  },
]

export function UserManagement() {
  const [adminUsers] = useState<AdminUser[]>(mockAdminUsers)

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center">
            <Users className="mr-2 h-5 w-5" />
            Admin Users
          </CardTitle>
          <Button size="sm">
            <UserPlus className="h-4 w-4 mr-2" />
            Add User
          </Button>
        </div>
        <CardDescription>Manage administrator accounts and permissions</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {adminUsers.map((user) => (
            <div key={user.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50">
              <div className="flex items-center space-x-4">
                <Avatar>
                  <AvatarImage src={user.avatarUrl || "/placeholder.svg"} alt={user.name} />
                  <AvatarFallback>
                    {user.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{user.name}</p>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Shield className="h-3 w-3 mr-1" />
                    {user.role}
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="hidden md:block text-right">
                  <div className="flex items-center">
                    <div
                      className={`h-2 w-2 rounded-full mr-2 ${
                        user.status === "online"
                          ? "bg-green-500"
                          : user.status === "away"
                            ? "bg-yellow-500"
                            : "bg-gray-300"
                      }`}
                    />
                    <p className="text-sm font-medium">
                      {user.status === "online" ? "Online" : user.status === "away" ? "Away" : "Offline"}
                    </p>
                  </div>
                  <div className="flex items-center text-xs text-muted-foreground mt-1">
                    <Clock className="h-3 w-3 mr-1" />
                    {user.lastLogin}
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Open menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem>View Profile</DropdownMenuItem>
                    <DropdownMenuItem>Edit Permissions</DropdownMenuItem>
                    <DropdownMenuItem>View Activity Log</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-red-600">Suspend User</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

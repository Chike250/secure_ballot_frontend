"use client"

import { useState } from "react"
import { Calendar, Filter, Plus, Search } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/src/components/ui/table"
import { Badge } from "@/src/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/src/components/ui/dialog"
import { Label } from "@/src/components/ui/label"

// Mock election data
const elections = [
  {
    id: "1",
    name: "Presidential Election 2023",
    type: "presidential",
    status: "active",
    startDate: "2023-02-25",
    endDate: "2023-02-25",
    registeredVoters: 93469008,
    votesCast: 24965218,
  },
  {
    id: "2",
    name: "Gubernatorial Election - Lagos State",
    type: "state",
    status: "upcoming",
    startDate: "2023-03-11",
    endDate: "2023-03-11",
    registeredVoters: 7060195,
    votesCast: 0,
  },
  {
    id: "3",
    name: "Gubernatorial Election - Kano State",
    type: "state",
    status: "upcoming",
    startDate: "2023-03-11",
    endDate: "2023-03-11",
    registeredVoters: 5921370,
    votesCast: 0,
  },
  {
    id: "4",
    name: "Local Government Election - FCT",
    type: "local",
    status: "ended",
    startDate: "2022-02-12",
    endDate: "2022-02-12",
    registeredVoters: 1373492,
    votesCast: 893271,
  },
  {
    id: "5",
    name: "Senatorial By-Election - Plateau Central",
    type: "legislative",
    status: "ended",
    startDate: "2022-10-15",
    endDate: "2022-10-15",
    registeredVoters: 750432,
    votesCast: 432198,
  },
]

export function ElectionManagement() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>Election Management</CardTitle>
              <CardDescription>Create, monitor, and manage elections</CardDescription>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Election
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Election</DialogTitle>
                  <DialogDescription>Fill in the details to create a new election.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Election Name</Label>
                    <Input id="name" placeholder="Enter election name" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="type">Election Type</Label>
                    <Select>
                      <SelectTrigger id="type">
                        <SelectValue placeholder="Select election type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="presidential">Presidential</SelectItem>
                        <SelectItem value="state">Gubernatorial</SelectItem>
                        <SelectItem value="local">Local Government</SelectItem>
                        <SelectItem value="legislative">Legislative</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="startDate">Start Date</Label>
                      <Input id="startDate" type="date" />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="endDate">End Date</Label>
                      <Input id="endDate" type="date" />
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={() => setIsDialogOpen(false)}>Create</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-col gap-4 sm:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search elections..." className="pl-8" />
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
                    <SelectItem value="upcoming">Upcoming</SelectItem>
                    <SelectItem value="ended">Ended</SelectItem>
                  </SelectContent>
                </Select>

                <Select defaultValue="all">
                  <SelectTrigger className="w-[130px]">
                    <div className="flex items-center gap-2">
                      <Filter className="h-4 w-4" />
                      <span>Type</span>
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="presidential">Presidential</SelectItem>
                    <SelectItem value="state">Gubernatorial</SelectItem>
                    <SelectItem value="local">Local</SelectItem>
                    <SelectItem value="legislative">Legislative</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Registered Voters</TableHead>
                    <TableHead>Votes Cast</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {elections.map((election) => (
                    <TableRow key={election.id}>
                      <TableCell className="font-medium">{election.name}</TableCell>
                      <TableCell className="capitalize">{election.type}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            election.status === "active"
                              ? "default"
                              : election.status === "upcoming"
                                ? "outline"
                                : "secondary"
                          }
                          className="capitalize"
                        >
                          {election.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                          {election.startDate}
                        </div>
                      </TableCell>
                      <TableCell>{election.registeredVoters.toLocaleString()}</TableCell>
                      <TableCell>{election.votesCast.toLocaleString()}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          {election.status === "upcoming" && (
                            <Button size="sm" variant="default">
                              Start
                            </Button>
                          )}
                          {election.status === "active" && (
                            <Button size="sm" variant="destructive">
                              End
                            </Button>
                          )}
                          <Button size="sm" variant="outline">
                            View
                          </Button>
                        </div>
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

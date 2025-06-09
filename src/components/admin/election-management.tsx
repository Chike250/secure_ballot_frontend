"use client"

import { useState, useEffect } from "react"
import { Calendar, Filter, Plus, Search, Users, Eye, UserPlus } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { useAdminData } from "@/hooks/useAdminData"
import { useElectionData } from "@/hooks/useElectionData"
import { useUIStore } from "@/store/useStore"

// Interface for election data
interface Election {
  id: string;
  electionName: string;
  electionType: string;
  status: string;
  startDate: string;
  endDate: string;
  registeredVoters?: number;
  votesCast?: number;
  description?: string;
}

// Interface for candidate data
interface Candidate {
  id: string;
  fullName: string;
  partyCode: string;
  partyName: string;
  bio?: string;
  photoUrl?: string;
  position?: string;
  manifesto?: string;
}

export function ElectionManagement() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isCandidateDialogOpen, setIsCandidateDialogOpen] = useState(false)
  const [selectedElectionId, setSelectedElectionId] = useState<string>("")
  const [selectedElectionName, setSelectedElectionName] = useState<string>("")
  const [elections, setElections] = useState<Election[]>([])
  const [candidates, setCandidates] = useState<{ [electionId: string]: Candidate[] }>({})
  const [newElection, setNewElection] = useState({
    electionName: "",
    electionType: "",
    startDate: "",
    endDate: "",
    description: ""
  })
  const [newCandidate, setNewCandidate] = useState({
    fullName: "",
    partyCode: "",
    partyName: "",
    bio: "",
    photoUrl: "",
    position: "",
    manifesto: ""
  })
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  
  const { isAdmin, createElection, addCandidateToElection } = useAdminData()
  const { elections: electionsData, fetchElections: fetchElectionsData, isLoading: electionLoading } = useElectionData()
  const { isLoading, error } = useUIStore()

  useEffect(() => {
    fetchElections()
  }, [statusFilter, typeFilter])

  const fetchElections = async () => {
    try {
      await fetchElectionsData();
      // Update local elections state with fetched data
      if (electionsData) {
        let filteredData = electionsData;
        
        // Apply filters
        if (statusFilter !== "all") {
          filteredData = filteredData.filter(election => election.status === statusFilter);
        }
        if (typeFilter !== "all") {
          filteredData = filteredData.filter(election => election.type === typeFilter);
        }
        
        // Convert to expected format
        const convertedElections = filteredData.map(election => ({
          id: election.id,
          electionName: election.name,
          electionType: election.type,
          status: election.status,
          startDate: election.startDate,
          endDate: election.endDate,
          registeredVoters: 0, // This would need to come from API
          votesCast: 0, // This would need to come from API
          description: election.description || ""
        }));
        
        setElections(convertedElections);
      }
    } catch (error) {
      console.error("Error fetching elections:", error);
    }
  }

  const handleCreateElection = async () => {
    try {
      await createElection({
        electionName: newElection.electionName,
        electionType: newElection.electionType,
        startDate: newElection.startDate,
        endDate: newElection.endDate,
        description: newElection.description
      });
      
      setIsDialogOpen(false);
      fetchElections();
      // Reset form
      setNewElection({
        electionName: "",
        electionType: "",
        startDate: "",
        endDate: "",
        description: ""
      });
    } catch (error) {
      console.error("Error creating election:", error);
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setNewElection((prev) => ({ ...prev, [id]: value }));
  }

  const handleSelectChange = (field: string, value: string) => {
    setNewElection((prev) => ({ ...prev, [field]: value }));
  }

  const handleCandidateInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setNewCandidate((prev) => ({ ...prev, [id]: value }));
  }

  const handleAddCandidate = (electionId: string, electionName: string) => {
    setSelectedElectionId(electionId);
    setSelectedElectionName(electionName);
    setIsCandidateDialogOpen(true);
  }

  const handleCreateCandidate = async () => {
    try {
      await addCandidateToElection(selectedElectionId, {
        fullName: newCandidate.fullName,
        partyCode: newCandidate.partyCode,
        partyName: newCandidate.partyName,
        bio: newCandidate.bio || undefined,
        photoUrl: newCandidate.photoUrl || undefined,
        position: newCandidate.position || undefined,
        manifesto: newCandidate.manifesto || undefined,
      });
      
      setIsCandidateDialogOpen(false);
      // Reset form
      setNewCandidate({
        fullName: "",
        partyCode: "",
        partyName: "",
        bio: "",
        photoUrl: "",
        position: "",
        manifesto: ""
      });
      
      // Refresh candidate list for this election
      await fetchCandidatesForElection(selectedElectionId);
    } catch (error) {
      console.error("Error creating candidate:", error);
    }
  }

  const fetchCandidatesForElection = async (electionId: string) => {
    try {
      // This would use the electionsAPI.getCandidates method
      // For now, we'll use mock data since the method exists but needs to be integrated
      console.log(`Fetching candidates for election ${electionId}`);
      // TODO: Implement actual API call when getCandidates is available
    } catch (error) {
      console.error("Error fetching candidates:", error);
    }
  }

  const filteredElections = elections.filter(election => 
    election.electionName.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
                    <Label htmlFor="electionName">Election Name</Label>
                    <Input 
                      id="electionName" 
                      placeholder="Enter election name" 
                      value={newElection.electionName}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="electionType">Election Type</Label>
                    <Select 
                      value={newElection.electionType} 
                      onValueChange={(value) => handleSelectChange("electionType", value)}
                    >
                      <SelectTrigger id="electionType">
                        <SelectValue placeholder="Select election type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="presidential">Presidential</SelectItem>
                        <SelectItem value="gubernatorial">Gubernatorial</SelectItem>
                        <SelectItem value="local">Local Government</SelectItem>
                        <SelectItem value="legislative">Legislative</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="startDate">Start Date</Label>
                      <Input 
                        id="startDate" 
                        type="date" 
                        value={newElection.startDate}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="endDate">End Date</Label>
                      <Input 
                        id="endDate" 
                        type="date" 
                        value={newElection.endDate}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="description">Description (Optional)</Label>
                    <Input 
                      id="description" 
                      placeholder="Enter election description" 
                      value={newElection.description}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateElection} disabled={isLoading}>
                    {isLoading ? "Creating..." : "Create"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Add Candidate Dialog */}
            <Dialog open={isCandidateDialogOpen} onOpenChange={setIsCandidateDialogOpen}>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Add Candidate to {selectedElectionName}</DialogTitle>
                  <DialogDescription>Fill in the candidate details to add them to this election.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="fullName">Full Name *</Label>
                      <Input 
                        id="fullName" 
                        placeholder="Enter candidate full name" 
                        value={newCandidate.fullName}
                        onChange={handleCandidateInputChange}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="position">Position</Label>
                      <Input 
                        id="position" 
                        placeholder="e.g., President, Governor" 
                        value={newCandidate.position}
                        onChange={handleCandidateInputChange}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="partyCode">Party Code *</Label>
                      <Input 
                        id="partyCode" 
                        placeholder="e.g., APC, PDP" 
                        value={newCandidate.partyCode}
                        onChange={handleCandidateInputChange}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="partyName">Party Name *</Label>
                      <Input 
                        id="partyName" 
                        placeholder="e.g., All Progressives Congress" 
                        value={newCandidate.partyName}
                        onChange={handleCandidateInputChange}
                      />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="photoUrl">Photo URL</Label>
                    <Input 
                      id="photoUrl" 
                      placeholder="https://example.com/candidate-photo.jpg" 
                      value={newCandidate.photoUrl}
                      onChange={handleCandidateInputChange}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="bio">Biography</Label>
                    <Input 
                      id="bio" 
                      placeholder="Brief biography of the candidate" 
                      value={newCandidate.bio}
                      onChange={handleCandidateInputChange}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="manifesto">Manifesto</Label>
                    <Input 
                      id="manifesto" 
                      placeholder="Campaign manifesto or key promises" 
                      value={newCandidate.manifesto}
                      onChange={handleCandidateInputChange}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsCandidateDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleCreateCandidate} 
                    disabled={isLoading || !newCandidate.fullName || !newCandidate.partyCode || !newCandidate.partyName}
                  >
                    {isLoading ? "Adding..." : "Add Candidate"}
                  </Button>
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
                <Input 
                  placeholder="Search elections..." 
                  className="pl-8" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <Select 
                  value={statusFilter}
                  onValueChange={setStatusFilter}
                >
                  <SelectTrigger className="w-[130px]">
                    <div className="flex items-center gap-2">
                      <Filter className="h-4 w-4" />
                      <span>Status</span>
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>

                <Select 
                  value={typeFilter}
                  onValueChange={setTypeFilter}
                >
                  <SelectTrigger className="w-[130px]">
                    <div className="flex items-center gap-2">
                      <Filter className="h-4 w-4" />
                      <span>Type</span>
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="presidential">Presidential</SelectItem>
                    <SelectItem value="gubernatorial">Gubernatorial</SelectItem>
                    <SelectItem value="local">Local</SelectItem>
                    <SelectItem value="legislative">Legislative</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {error && (
              <div className="bg-destructive/15 text-destructive px-4 py-2 rounded-md">
                {error}
              </div>
            )}

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
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-4">
                        Loading elections...
                      </TableCell>
                    </TableRow>
                  ) : filteredElections.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-4">
                        No elections found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredElections.map((election) => (
                      <TableRow key={election.id}>
                        <TableCell className="font-medium">{election.electionName}</TableCell>
                        <TableCell className="capitalize">{election.electionType}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              election.status === "active"
                                ? "default"
                                : election.status === "published"
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
                        <TableCell>{election.registeredVoters?.toLocaleString() || "N/A"}</TableCell>
                        <TableCell>{election.votesCast?.toLocaleString() || "N/A"}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleAddCandidate(election.id, election.electionName)}
                            >
                              <UserPlus className="mr-1 h-3 w-3" />
                              Add Candidate
                            </Button>
                            {election.status === "published" && (
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
                              <Eye className="mr-1 h-3 w-3" />
                              View
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

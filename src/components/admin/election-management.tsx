"use client";

import { useState, useEffect } from "react";
import {
  Calendar,
  Filter,
  Plus,
  Search,
  Users,
  Eye,
  UserPlus,
  CheckCircle,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useAdminData } from "@/hooks/useAdminData";
import { useElectionData } from "@/hooks/useElectionData";
import { useUIStore } from "@/store/useStore";

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
  registeredVotersCount?: number; // New API field
  votesCastCount?: number; // New API field
  description?: string;
  candidates?: any[];
  candidateCount?: number;
  // Legacy fields for backward compatibility
  name?: string;
  type?: string;
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

// Nigerian Political Parties mapping
const NIGERIAN_PARTIES = {
  "All Progressives Congress": "APC",
  "Peoples Democratic Party": "PDP",
  "Labour Party": "LP",
  "New Nigeria Peoples Party": "NNPP",
  "All Progressives Grand Alliance": "APGA",
  "Social Democratic Party": "SDP",
  "Young Progressive Party": "YPP",
  "Zenith Labour Party": "ZLP",
  "Action Alliance": "AA",
  "African Action Congress": "AAC",
  "Action Democratic Party": "ADP",
  "Action Peoples Party": "APP",
  "Accord Party": "A",
  "Allied Peoples Movement": "APM",
  "Boot Party": "BP",
  "National Rescue Movement": "NRM",
  "Peoples Redemption Party": "PRP",
  "African Democratic Congress": "ADC",
  "Young Democrats": "YD",
  Independent: "IND",
} as const;

export function ElectionManagement() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isCandidateDialogOpen, setIsCandidateDialogOpen] = useState(false);
  const [isPublishDialogOpen, setIsPublishDialogOpen] = useState(false);
  const [selectedElectionId, setSelectedElectionId] = useState<string>("");
  const [selectedElectionName, setSelectedElectionName] = useState<string>("");
  const [publishLevel, setPublishLevel] = useState<"preliminary" | "final">(
    "preliminary"
  );
  const [elections, setElections] = useState<Election[]>([]);
  const [candidates, setCandidates] = useState<{
    [electionId: string]: Candidate[];
  }>({});
  const [newElection, setNewElection] = useState({
    electionName: "",
    electionType: "",
    startDate: "",
    endDate: "",
    description: "",
    candidates: [] as any[],
  });
  const [newCandidate, setNewCandidate] = useState({
    fullName: "",
    partyCode: "",
    partyName: "",
    bio: "",
    photoUrl: "",
    position: "",
    manifesto: "",
  });
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [tempCandidates, setTempCandidates] = useState<any[]>([]);
  const [availableElectionTypes, setAvailableElectionTypes] = useState<
    string[]
  >([
    "Presidential",
    "Gubernatorial",
    "Senatorial",
    "HouseOfReps",
    "StateAssembly",
    "LocalGovernment",
  ]);

  const {
    isAdmin,
    createElection,
    addCandidateToElection,
    addCandidatesToElection,
    publishElectionResults,
  } = useAdminData();
  const {
    elections: electionsData,
    fetchElections: fetchElectionsData,
    isLoading: electionLoading,
  } = useElectionData();
  const { isLoading, error } = useUIStore();

  useEffect(() => {
    fetchElections();
  }, [statusFilter, typeFilter]);

  const fetchElections = async () => {
    try {
      await fetchElectionsData();
      // Update local elections state with fetched data
      if (electionsData && electionsData.length > 0) {
        let filteredData = electionsData;

        // Apply filters - electionsData uses 'name' and 'type' properties (from store interface)
        if (statusFilter !== "all") {
          filteredData = filteredData.filter(
            (election) => election.status === statusFilter
          );
        }
        if (typeFilter !== "all") {
          filteredData = filteredData.filter(
            (election) => election.type.toLowerCase() === typeFilter
          );
        }

        // Convert from store format to component format
        const convertedElections = filteredData.map((election: any) => ({
          id: election.id,
          electionName: election.electionName || election.name, // API uses 'electionName'
          electionType: election.electionType || election.type, // API uses 'electionType'
          status: election.status,
          startDate: election.startDate,
          endDate: election.endDate,
          registeredVoters: election.registeredVotersCount || 0, // Use new API field
          votesCast: election.votesCastCount || 0, // Use new API field
          description: election.description || "",
          candidates: election.candidates || [],
          candidateCount:
            election.candidateCount || election.candidates?.length || 0,
        }));

        setElections(convertedElections);

        // Extract available election types from API response if available
        if (electionsData && (electionsData as any).availableElectionTypes) {
          setAvailableElectionTypes(
            (electionsData as any).availableElectionTypes
          );
        }
      }
    } catch (error) {
      console.error("Error fetching elections:", error);
    }
  };

  const handleCreateElection = async () => {
    // Validate minimum candidates requirement
    if (tempCandidates.length > 0 && tempCandidates.length < 2) {
      alert(
        "At least 2 candidates are required to create an election with candidates."
      );
      return;
    }

    try {
      const electionResult = await createElection({
        electionName: newElection.electionName,
        electionType: newElection.electionType,
        startDate: newElection.startDate,
        endDate: newElection.endDate,
        description: newElection.description,
      });

      // If election was created successfully and we have candidates to add
      if (electionResult && tempCandidates.length > 0) {
        // Add all candidates to the newly created election in a single request
        try {
          await addCandidatesToElection(electionResult.id, tempCandidates);
        } catch (candidateError) {
          console.error("Error adding candidates:", candidateError);
        }
      }

      setIsDialogOpen(false);
      fetchElections();
      // Reset form
      setNewElection({
        electionName: "",
        electionType: "",
        startDate: "",
        endDate: "",
        description: "",
        candidates: [],
      });
      setTempCandidates([]);
    } catch (error) {
      console.error("Error creating election:", error);
    }
  };

  const handleAddCandidateToNewElection = () => {
    if (
      newCandidate.fullName &&
      newCandidate.partyCode &&
      newCandidate.partyName
    ) {
      setTempCandidates((prev) => [
        ...prev,
        { ...newCandidate, id: Date.now().toString() },
      ]);
      // Reset candidate form
      setNewCandidate({
        fullName: "",
        partyCode: "",
        partyName: "",
        bio: "",
        photoUrl: "",
        position: "",
        manifesto: "",
      });
    }
  };

  const handleRemoveCandidateFromNew = (candidateId: string) => {
    setTempCandidates((prev) => prev.filter((c) => c.id !== candidateId));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setNewElection((prev) => ({ ...prev, [id]: value }));
  };

  const handleSelectChange = (field: string, value: string) => {
    setNewElection((prev) => ({ ...prev, [field]: value }));
  };

  const handleCandidateInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { id, value } = e.target;
    setNewCandidate((prev) => ({ ...prev, [id]: value }));
  };

  // Handle party selection - automatically set party code when party name is selected
  const handlePartySelection = (partyName: string) => {
    const partyCode =
      NIGERIAN_PARTIES[partyName as keyof typeof NIGERIAN_PARTIES] || "";
    setNewCandidate((prev) => ({
      ...prev,
      partyName,
      partyCode,
    }));
  };

  const handleAddCandidate = (electionId: string, electionName: string) => {
    setSelectedElectionId(electionId);
    setSelectedElectionName(electionName);
    setIsCandidateDialogOpen(true);
  };

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
        manifesto: "",
      });

      // Refresh candidate list for this election
      await fetchCandidatesForElection(selectedElectionId);
    } catch (error) {
      console.error("Error creating candidate:", error);
    }
  };

  const fetchCandidatesForElection = async (electionId: string) => {
    try {
      // This would use the electionsAPI.getCandidates method
      // For now, we'll use mock data since the method exists but needs to be integrated
      // TODO: Implement actual API call when getCandidates is available
    } catch (error) {
      console.error("Error fetching candidates:", error);
    }
  };

  const handlePublishElection = (electionId: string, electionName: string) => {
    setSelectedElectionId(electionId);
    setSelectedElectionName(electionName);
    setIsPublishDialogOpen(true);
  };

  const handleConfirmPublish = async () => {
    try {
      await publishElectionResults(selectedElectionId, publishLevel);
      setIsPublishDialogOpen(false);
      fetchElections(); // Refresh the elections list
      // Reset state
      setSelectedElectionId("");
      setSelectedElectionName("");
      setPublishLevel("preliminary");
    } catch (error) {
      console.error("Error publishing election results:", error);
    }
  };

  const filteredElections = elections.filter((election) =>
    election.electionName
      ?.toLowerCase()
      .includes(searchQuery?.toLowerCase() || "")
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>Election Management</CardTitle>
              <CardDescription>
                Create, monitor, and manage elections
              </CardDescription>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => setIsDialogOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Election
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Election</DialogTitle>
                  <DialogDescription>
                    Fill in the details to create a new election.
                  </DialogDescription>
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
                      onValueChange={(value) =>
                        handleSelectChange("electionType", value)
                      }
                    >
                      <SelectTrigger id="electionType">
                        <SelectValue placeholder="Select election type" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableElectionTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type === "HouseOfReps"
                              ? "House of Representatives"
                              : type === "StateAssembly"
                              ? "State Assembly"
                              : type === "LocalGovernment"
                              ? "Local Government"
                              : type}
                          </SelectItem>
                        ))}
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

                  {/* Candidates Section */}
                  <div className="border-t pt-4">
                    <h4 className="font-medium mb-3">
                      Add Candidates (Optional)
                    </h4>

                    {/* Candidate Form */}
                    <div className="space-y-3 mb-4">
                      <div className="grid grid-cols-2 gap-3">
                        <Input
                          placeholder="Candidate Full Name"
                          value={newCandidate.fullName}
                          onChange={(e) =>
                            setNewCandidate((prev) => ({
                              ...prev,
                              fullName: e.target.value,
                            }))
                          }
                        />
                        <Input
                          placeholder="Position (e.g., President)"
                          value={newCandidate.position}
                          onChange={(e) =>
                            setNewCandidate((prev) => ({
                              ...prev,
                              position: e.target.value,
                            }))
                          }
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <Input
                          placeholder="Party Code (Auto-filled)"
                          value={newCandidate.partyCode}
                          readOnly
                          className="bg-muted"
                        />
                        <Select
                          value={newCandidate.partyName}
                          onValueChange={handlePartySelection}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select Political Party" />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.keys(NIGERIAN_PARTIES).map((partyName) => (
                              <SelectItem key={partyName} value={partyName}>
                                {partyName} (
                                {
                                  NIGERIAN_PARTIES[
                                    partyName as keyof typeof NIGERIAN_PARTIES
                                  ]
                                }
                                )
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <Input
                        placeholder="Manifesto (Optional)"
                        value={newCandidate.manifesto}
                        onChange={(e) =>
                          setNewCandidate((prev) => ({
                            ...prev,
                            manifesto: e.target.value,
                          }))
                        }
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleAddCandidateToNewElection}
                        disabled={
                          !newCandidate.fullName ||
                          !newCandidate.partyCode ||
                          !newCandidate.partyName
                        }
                      >
                        <Plus className="mr-2 h-3 w-3" />
                        Add Candidate
                      </Button>
                    </div>

                    {/* Added Candidates List */}
                    {tempCandidates.length > 0 && (
                      <div className="space-y-2">
                        <h5 className="text-sm font-medium">
                          Added Candidates ({tempCandidates.length})
                        </h5>
                        {tempCandidates.length === 1 && (
                          <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-3 py-2 rounded text-sm">
                            ⚠️ Add at least one more candidate to create the
                            election
                          </div>
                        )}
                        <div className="max-h-32 overflow-y-auto space-y-1">
                          {tempCandidates.map((candidate) => (
                            <div
                              key={candidate.id}
                              className="flex items-center justify-between bg-muted p-2 rounded text-sm"
                            >
                              <div>
                                <span className="font-medium">
                                  {candidate.fullName}
                                </span>
                                <span className="text-muted-foreground">
                                  {" "}
                                  - {candidate.partyCode}
                                </span>
                              </div>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  handleRemoveCandidateFromNew(candidate.id)
                                }
                              >
                                ×
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleCreateElection}
                    disabled={
                      isLoading ||
                      !newElection.electionName ||
                      !newElection.electionType ||
                      !newElection.startDate ||
                      !newElection.endDate ||
                      tempCandidates.length === 1
                    }
                  >
                    {isLoading
                      ? "Creating..."
                      : tempCandidates.length === 1
                      ? "Need at least 2 candidates"
                      : "Create"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Add Candidate Dialog */}
            <Dialog
              open={isCandidateDialogOpen}
              onOpenChange={setIsCandidateDialogOpen}
            >
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>
                    Add Candidate to {selectedElectionName}
                  </DialogTitle>
                  <DialogDescription>
                    Fill in the candidate details to add them to this election.
                  </DialogDescription>
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
                        placeholder="Auto-filled from party selection"
                        value={newCandidate.partyCode}
                        readOnly
                        className="bg-muted"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="partyName">Party Name *</Label>
                      <Select
                        value={newCandidate.partyName}
                        onValueChange={handlePartySelection}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Political Party" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.keys(NIGERIAN_PARTIES).map((partyName) => (
                            <SelectItem key={partyName} value={partyName}>
                              {partyName} (
                              {
                                NIGERIAN_PARTIES[
                                  partyName as keyof typeof NIGERIAN_PARTIES
                                ]
                              }
                              )
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
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
                  <Button
                    variant="outline"
                    onClick={() => setIsCandidateDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleCreateCandidate}
                    disabled={
                      isLoading ||
                      !newCandidate.fullName ||
                      !newCandidate.partyCode ||
                      !newCandidate.partyName
                    }
                  >
                    {isLoading ? "Adding..." : "Add Candidate"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Publish Election Results Dialog */}
            <Dialog
              open={isPublishDialogOpen}
              onOpenChange={setIsPublishDialogOpen}
            >
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Verify & Publish Election Results</DialogTitle>
                  <DialogDescription>
                    Publish the results for "{selectedElectionName}". Choose the
                    publication level.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="publishLevel">Publication Level</Label>
                    <Select
                      value={publishLevel}
                      onValueChange={(value: "preliminary" | "final") =>
                        setPublishLevel(value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select publication level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="preliminary">
                          Preliminary Results
                        </SelectItem>
                        <SelectItem value="final">Final Results</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="bg-blue-50 border border-blue-200 text-blue-800 px-3 py-2 rounded text-sm">
                    <strong>Note:</strong> Publishing results will make them
                    visible to all users. Preliminary results can be updated,
                    while final results are permanent.
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setIsPublishDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleConfirmPublish} disabled={isLoading}>
                    {isLoading
                      ? "Publishing..."
                      : `Publish ${
                          publishLevel === "preliminary"
                            ? "Preliminary"
                            : "Final"
                        } Results`}
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
                <Select value={statusFilter} onValueChange={setStatusFilter}>
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

                <Select value={typeFilter} onValueChange={setTypeFilter}>
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
                    <SelectItem value="senatorial">Senatorial</SelectItem>
                    <SelectItem value="houseofreps">
                      House of Representatives
                    </SelectItem>
                    <SelectItem value="stateassembly">
                      State Assembly
                    </SelectItem>
                    <SelectItem value="localgovernment">
                      Local Government
                    </SelectItem>
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
                    <TableHead>Candidates</TableHead>
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
                        <TableCell className="font-medium">
                          {election.electionName}
                        </TableCell>
                        <TableCell className="capitalize">
                          {election.electionType}
                        </TableCell>
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
                        <TableCell>
                          <div className="flex items-center">
                            <Users className="mr-2 h-4 w-4 text-muted-foreground" />
                            {election.candidateCount ||
                              election.candidates?.length ||
                              0}
                          </div>
                        </TableCell>
                        <TableCell>
                          {election.registeredVoters?.toLocaleString() || "N/A"}
                        </TableCell>
                        <TableCell>
                          {election.votesCast?.toLocaleString() || "N/A"}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                handleAddCandidate(
                                  election.id,
                                  election.electionName
                                )
                              }
                            >
                              <UserPlus className="mr-1 h-3 w-3" />
                              Add Candidate
                            </Button>
                            {(election.status === "completed" ||
                              election.status === "active") && (
                              <Button
                                size="sm"
                                variant="default"
                                onClick={() =>
                                  handlePublishElection(
                                    election.id,
                                    election.electionName
                                  )
                                }
                              >
                                <CheckCircle className="mr-1 h-3 w-3" />
                                Verify & Publish
                              </Button>
                            )}
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
  );
}

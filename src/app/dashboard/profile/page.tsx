"use client";

import type React from "react";

import { useState, useEffect } from "react";
import Link from "next/link";
import Avatar from "react-avatar";
import {
  ArrowLeft,
  Camera,
  Check,
  Shield,
  Key,
  Save,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import { useAuthStore, useUIStore } from "@/store/useStore";
import { useUser } from "@/hooks/useUser";
import { useVoterProfile } from "@/hooks/useVoterProfile";
import { useElectionData } from "@/hooks/useElectionData";

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [detailedPollingUnit, setDetailedPollingUnit] = useState<any>(null);
  const [showDetailedPollingInfo, setShowDetailedPollingInfo] = useState(false);
  const [loadingPollingUnit, setLoadingPollingUnit] = useState(false);
  const {
    user: authUser,
    updateUser,
    isAuthenticated,
    token,
    isInitialized,
  } = useAuthStore();
  const { isLoading, error, setError } = useUIStore();
  const { profile, updateProfile, fetchProfile } = useUser();
  const { getPollingUnit } = useVoterProfile();
  const {
    elections,
    hasVoted,
    votingStatus,
    checkVotingStatus,
    fetchElections,
  } = useElectionData();

  // Debug logging
  useEffect(() => {}, []);

  useEffect(() => {}, [profile, isLoading]);

  useEffect(() => {}, [isAuthenticated, token, isInitialized]);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    nin: "",
    vin: "",
    dob: "",
    gender: "",
    state: "",
    lga: "",
    ward: "",
    pollingUnit: "",
    bio: "",
  });

  useEffect(() => {
    const loadAllData = async () => {
      // Wait for auth to be initialized before loading data
      if (!isInitialized) {
        return;
      }

      if (!isAuthenticated || !token) {
        setError("Authentication required. Please log in again.");
        return;
      }

      try {
        // Set a timeout to prevent infinite loading
        const timeout = setTimeout(() => {
          if (isLoading) {
            setError(
              "Loading is taking too long. Please try refreshing the page."
            );
          }
        }, 15000); // 15 second timeout

        // Fetch profile and elections data first
        await Promise.all([fetchProfile(), fetchElections()]);

        clearTimeout(timeout);
      } catch (error) {
        console.error("Failed to load initial data:", error);
        setError("Failed to load profile data. Please refresh the page.");
      }
    };

    loadAllData();
  }, [isInitialized, isAuthenticated, token]); // Run when auth state changes

  // Set form data when profile or authUser changes
  useEffect(() => {
    const initialData = {
      name: profile?.fullName || authUser?.fullName || "",
      email: profile?.email || authUser?.email || "",
      phone: profile?.phoneNumber || authUser?.phoneNumber || "",
      address: profile?.address || "",
      nin: profile?.nin || authUser?.nin || "",
      vin: profile?.vin || authUser?.vin || "",
      dob: profile?.dateOfBirth || authUser?.dateOfBirth || "",
      gender: profile?.gender || authUser?.gender || "",
      state: profile?.state || authUser?.state || "",
      lga: profile?.lga || authUser?.lga || "",
      ward: profile?.ward || authUser?.ward || "",
      pollingUnit:
        profile?.voterCard?.pollingUnitCode || authUser?.pollingUnitCode || "",
      bio: profile?.bio || "",
    };
    setFormData(initialData);
  }, [profile, authUser]);

  // Load voting statuses after elections are loaded
  useEffect(() => {
    if (elections.length > 0) {
      const loadVotingStatuses = async () => {
        try {
          // Load all voting statuses in parallel
          await Promise.all(
            elections.map((election) =>
              checkVotingStatus(election.id).catch((error) => {
                console.error(
                  `Failed to check voting status for election ${election.id}:`,
                  error
                );
                return null; // Continue with other elections even if one fails
              })
            )
          );
        } catch (error: any) {
          console.error("Failed to load voting statuses:", error);
          if (
            error.message?.includes("TOO_MANY_REQUESTS") ||
            error.code === "TOO_MANY_REQUESTS"
          ) {
            setError(
              "Rate limit reached. Please refresh the page to try again."
            );
          }
        }
      };

      // Add a small delay to avoid immediate rate limiting after fetching elections
      const timer = setTimeout(loadVotingStatuses, 500);
      return () => clearTimeout(timer);
    }
  }, [elections.length]); // Only run when elections are loaded

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const fetchDetailedPollingUnit = async () => {
    if (!profile?.voterCard?.pollingUnit?.id || detailedPollingUnit) return;

    setLoadingPollingUnit(true);
    try {
      const unitData = await getPollingUnit();
      setDetailedPollingUnit(unitData);
      setShowDetailedPollingInfo(true);
    } catch (err) {
      console.error("Failed to load detailed polling unit data:", err);
      setError("Failed to load detailed polling unit information");
    } finally {
      setLoadingPollingUnit(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const dataToUpdate = {
        phoneNumber: formData.phone,
      };

      const success = await updateProfile(dataToUpdate);

      if (success) {
        // Update auth store with new data
        if (authUser) {
          updateUser({
            phoneNumber: formData.phone,
          });
        }

        setIsEditing(false);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (err) {
      console.error("Profile update failed:", err);
    }
  };

  if (isLoading && !profile) {
    return (
      <div className="container mx-auto py-6 px-4 max-w-5xl">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Loading profile...</p>
            <Button
              variant="outline"
              size="sm"
              className="mt-4"
              onClick={() => window.location.reload()}
            >
              Refresh Page
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // If there's an error and no profile, show error state
  if (error && !profile && !isLoading) {
    return (
      <div className="container mx-auto py-6 px-4 max-w-5xl">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <AlertCircle className="h-8 w-8 text-destructive mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              Failed to Load Profile
            </h3>
            <p className="text-muted-foreground mb-4">{error}</p>
            <div className="space-x-2">
              <Button
                variant="outline"
                onClick={() => {
                  setError(null);
                  fetchProfile(true); // Force refresh
                }}
              >
                Try Again
              </Button>
              <Button variant="ghost" asChild>
                <Link href="/dashboard">Back to Dashboard</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 px-4 max-w-5xl">
      <div className="mb-6">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>
      </div>

      {error && (
        <Alert
          variant={error.includes("Rate limit") ? "default" : "destructive"}
          className="mb-4"
        >
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>
            {error.includes("Rate limit") ? "Rate Limit Notice" : "Error"}
          </AlertTitle>
          <AlertDescription>
            {error}
            {error.includes("Rate limit") && (
              <div className="mt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setError(null);
                    // Retry after a delay
                    setTimeout(() => {
                      if (elections.length > 0) {
                        elections.forEach((election, index) => {
                          setTimeout(() => {
                            checkVotingStatus(election.id);
                          }, index * 1000); // 1 second delay between each call
                        });
                      }
                    }, 2000);
                  }}
                >
                  Retry Loading Voting Status
                </Button>
              </div>
            )}
          </AlertDescription>
        </Alert>
      )}

      <div className="flex flex-col md:flex-row gap-6 mb-6">
        <div className="md:w-1/3">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center">
                <div className="relative mb-4">
                  <Avatar
                    name={formData.name}
                    size="128"
                    round={true}
                    color="#22c55e"
                    fgColor="#ffffff"
                    textSizeRatio={2}
                    className="border-4 border-primary/20"
                  />
                  <Button
                    size="icon"
                    variant="outline"
                    className="absolute bottom-0 right-0 rounded-full h-8 w-8 bg-background"
                  >
                    <Camera className="h-4 w-4" />
                  </Button>
                </div>
                <h2 className="text-xl font-bold">{formData.name}</h2>
                <p className="text-sm text-muted-foreground mb-4">
                  {formData.email}
                </p>
                <Badge
                  variant="outline"
                  className="bg-green-500/10 text-green-500 border-green-500/20 mb-4"
                >
                  <Check className="mr-1 h-3 w-3" />
                  {profile?.verification !== null || authUser?.isVerified
                    ? "Verified Voter"
                    : "Verification Pending"}
                </Badge>
                {/* <Button variant="outline" className="w-full" onClick={() => setIsEditing(!isEditing)}>
                  {isEditing ? "Cancel Editing" : "Edit Profile"}
                </Button> */}
              </div>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Voting Status</CardTitle>
              <CardDescription>
                Your voting history across all elections
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {isLoading ? (
                  <div className="text-center py-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto mb-2"></div>
                    <p className="text-sm text-muted-foreground">
                      Loading elections...
                    </p>
                  </div>
                ) : elections.length > 0 ? (
                  elections.map((election) => (
                    <div
                      key={election.id}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="flex-1">
                        <h3 className="text-sm font-medium mb-1">
                          {election.name}
                        </h3>
                        <p className="text-xs text-muted-foreground mb-2">
                          {election.type} •{" "}
                          {new Date(election.startDate).toLocaleDateString()} -{" "}
                          {new Date(election.endDate).toLocaleDateString()}
                        </p>
                        {hasVoted[election.id] ? (
                          <Badge className="bg-green-500">
                            <Check className="mr-1 h-3 w-3" />
                            Vote Cast
                            {votingStatus[election.id]?.candidateName && (
                              <span>
                                {" "}
                                for {votingStatus[election.id].candidateName}
                              </span>
                            )}
                            {votingStatus[election.id]?.candidateParty && (
                              <span>
                                {" "}
                                ({votingStatus[election.id].candidateParty})
                              </span>
                            )}
                          </Badge>
                        ) : votingStatus[election.id] === undefined &&
                          election.status === "active" ? (
                          <Badge
                            variant="outline"
                            className="text-blue-600 border-blue-600"
                          >
                            Loading Status...
                          </Badge>
                        ) : election.status === "active" ? (
                          <Badge
                            variant="outline"
                            className="text-yellow-600 border-yellow-600"
                          >
                            Not Voted - Active
                          </Badge>
                        ) : election.status === "completed" ? (
                          <Badge
                            variant="outline"
                            className="text-gray-600 border-gray-600"
                          >
                            Election Ended
                          </Badge>
                        ) : (
                          <Badge variant="outline">
                            {election.status === "scheduled"
                              ? "Upcoming"
                              : "Not Available"}
                          </Badge>
                        )}
                      </div>
                      {election.status === "active" &&
                        !hasVoted[election.id] && (
                          <Button size="sm" asChild>
                            <Link href={`/vote?election=${election.id}`}>
                              Vote Now
                            </Link>
                          </Button>
                        )}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-sm text-muted-foreground mb-2">
                      No elections available
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Check back later for upcoming elections
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm" asChild className="w-full">
                <Link href="/vote">Go to Voting Page</Link>
              </Button>
            </CardFooter>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Polling Unit Information</CardTitle>
            </CardHeader>
            <CardContent>
              {profile?.voterCard?.pollingUnit ? (
                <div className="space-y-4">
                  {/* Basic Information */}
                  <div className="space-y-2 text-sm">
                    <p>
                      <span className="font-medium">Name:</span>{" "}
                      {profile.voterCard.pollingUnit.name}
                    </p>
                    <p>
                      <span className="font-medium">Code:</span>{" "}
                      {profile.voterCard.pollingUnit.code}
                    </p>
                    {profile.voterCard.pollingUnit.address && (
                      <p>
                        <span className="font-medium">Address:</span>{" "}
                        {profile.voterCard.pollingUnit.address}
                      </p>
                    )}
                    <p>
                      <span className="font-medium">VIN:</span>{" "}
                      {profile.voterCard.vin}
                    </p>
                  </div>

                  {/* Detailed Information */}
                  {showDetailedPollingInfo && detailedPollingUnit && (
                    <>
                      <Separator />
                      <div className="space-y-2 text-sm">
                        <h4 className="font-medium text-base mb-3">
                          Detailed Information
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          <p>
                            <span className="font-medium">State:</span>{" "}
                            {detailedPollingUnit.state}
                          </p>
                          <p>
                            <span className="font-medium">LGA:</span>{" "}
                            {detailedPollingUnit.lga}
                          </p>
                          <p>
                            <span className="font-medium">Ward:</span>{" "}
                            {detailedPollingUnit.ward}
                          </p>
                          <p>
                            <span className="font-medium">
                              Registered Voters:
                            </span>{" "}
                            {detailedPollingUnit.registeredVoters?.toLocaleString()}
                          </p>
                        </div>

                        {detailedPollingUnit.assignedOfficer && (
                          <p>
                            <span className="font-medium">
                              Assigned Officer:
                            </span>{" "}
                            {detailedPollingUnit.assignedOfficer}
                          </p>
                        )}

                        {detailedPollingUnit.latitude &&
                          detailedPollingUnit.longitude && (
                            <p>
                              <span className="font-medium">Coordinates:</span>{" "}
                              {detailedPollingUnit.latitude},{" "}
                              {detailedPollingUnit.longitude}
                            </p>
                          )}

                        <div className="flex items-center space-x-2 mt-2">
                          <Badge
                            variant={
                              detailedPollingUnit.isActive
                                ? "default"
                                : "destructive"
                            }
                          >
                            {detailedPollingUnit.isActive
                              ? "Active"
                              : "Inactive"}
                          </Badge>
                        </div>
                      </div>
                    </>
                  )}

                  {/* Load More Button */}
                  {!showDetailedPollingInfo && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={fetchDetailedPollingUnit}
                      disabled={loadingPollingUnit}
                      className="w-full"
                    >
                      {loadingPollingUnit ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mr-2"></div>
                          Loading Details...
                        </>
                      ) : (
                        "View Detailed Information"
                      )}
                    </Button>
                  )}
                </div>
              ) : profile?.voterCard ? (
                <div className="space-y-2 text-sm">
                  <p>
                    <span className="font-medium">VIN:</span>{" "}
                    {profile.voterCard.vin}
                  </p>
                  <p>
                    <span className="font-medium">Polling Unit Code:</span>{" "}
                    {profile.voterCard.pollingUnitCode}
                  </p>
                  <Alert className="mt-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Polling Unit Details</AlertTitle>
                    <AlertDescription>
                      Detailed polling unit information is not available. Please
                      contact the electoral commission if you need assistance.
                    </AlertDescription>
                  </Alert>
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-sm text-muted-foreground">
                    No voter card information available
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="md:w-2/3">
          {saveSuccess && (
            <Alert className="mb-6 bg-green-500/10 border-green-500/20 text-green-600">
              <Check className="h-4 w-4" />
              <AlertTitle>Success</AlertTitle>
              <AlertDescription>
                Your profile has been updated successfully.
              </AlertDescription>
            </Alert>
          )}

          <Tabs defaultValue="personal">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="personal">Personal Info</TabsTrigger>
              <TabsTrigger value="voter">Voter Details</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
            </TabsList>

            <TabsContent value="personal" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>
                    Update your personal details and contact information.
                  </CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          placeholder="Enter your full name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          placeholder="Enter your email"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          placeholder="Enter your phone number"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="dob">Date of Birth</Label>
                        <Input
                          id="dob"
                          type="date"
                          value={formData.dob}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="address">Address</Label>
                      <Textarea
                        id="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        placeholder="Enter your address"
                        rows={3}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea
                        id="bio"
                        value={formData.bio}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        placeholder="Tell us about yourself"
                        rows={4}
                      />
                    </div>
                  </CardContent>
                  {isEditing && (
                    <CardFooter>
                      <Button type="submit" disabled={isLoading}>
                        {isLoading ? "Saving..." : "Save Changes"}
                        <Save className="ml-2 h-4 w-4" />
                      </Button>
                    </CardFooter>
                  )}
                </form>
              </Card>
            </TabsContent>

            <TabsContent value="voter" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Voter Information</CardTitle>
                  <CardDescription>
                    Your voter registration details and identification.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="nin">
                        National Identification Number (NIN)
                      </Label>
                      <Input
                        id="nin"
                        value={formData.nin}
                        disabled
                        placeholder="Your NIN"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="vin">
                        Voter Identification Number (VIN)
                      </Label>
                      <Input
                        id="vin"
                        value={formData.vin}
                        disabled
                        placeholder="Your VIN"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="state">State</Label>
                      <Input
                        id="state"
                        value={formData.state}
                        disabled
                        placeholder="Your state"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lga">Local Government Area</Label>
                      <Input
                        id="lga"
                        value={formData.lga}
                        disabled
                        placeholder="Your LGA"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="ward">Ward</Label>
                      <Input
                        id="ward"
                        value={formData.ward}
                        disabled
                        placeholder="Your ward"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="pollingUnit">Polling Unit</Label>
                    <Input
                      id="pollingUnit"
                      value={formData.pollingUnit}
                      disabled
                      placeholder="Your polling unit"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Account Status</Label>
                      <Badge
                        variant={profile?.isActive ? "default" : "destructive"}
                      >
                        {profile?.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                    {profile?.lastLogin && (
                      <div className="space-y-2">
                        <Label>Last Login</Label>
                        <p className="text-sm text-muted-foreground">
                          {new Date(profile.lastLogin).toLocaleString()}
                        </p>
                      </div>
                    )}
                  </div>

                  {profile?.createdAt && (
                    <div className="space-y-2">
                      <Label>Account Created</Label>
                      <p className="text-sm text-muted-foreground">
                        {new Date(profile.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  )}

                  <Alert>
                    <Shield className="h-4 w-4" />
                    <AlertTitle>Secure Information</AlertTitle>
                    <AlertDescription>
                      Your voter registration details are verified and cannot be
                      modified. If you need to update this information, please
                      contact the electoral commission.
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Security Settings</CardTitle>
                  <CardDescription>
                    Manage your account security and authentication preferences.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Two-Factor Authentication</Label>
                      <p className="text-sm text-muted-foreground">
                        Add an extra layer of security to your account
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge
                        variant={profile?.mfaEnabled ? "default" : "outline"}
                      >
                        {profile?.mfaEnabled ? "Enabled" : "Disabled"}
                      </Badge>
                      <Switch checked={profile?.mfaEnabled} disabled />
                    </div>
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive security alerts via email
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <Button variant="outline" className="w-full">
                      <Key className="mr-2 h-4 w-4" />
                      Change Password
                    </Button>

                    <Alert>
                      <Shield className="h-4 w-4" />
                      <AlertTitle>Account Security</AlertTitle>
                      <AlertDescription>
                        Your account is protected with enterprise-grade
                        security. All actions are logged for audit purposes.
                      </AlertDescription>
                    </Alert>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

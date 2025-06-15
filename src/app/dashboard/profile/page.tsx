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
  User,
  MapPin,
  RefreshCw,
  Vote as VoteIcon,
  BarChart3,
  TrendingUp,
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
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { ThemeToggle } from "@/components/theme-toggle";

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

  if (error && !profile) {
    return (
      <SidebarProvider>
        <div className="flex min-h-screen w-full">
          <Sidebar variant="inset">
            <SidebarHeader>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton size="lg" asChild>
                    <Link href="/dashboard">
                      <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                        <VoteIcon className="size-4" />
                      </div>
                      <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate font-semibold">
                          Voting Platform
                        </span>
                        <span className="truncate text-xs">Your Profile</span>
                      </div>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link href="/dashboard">
                      <BarChart3 className="size-4" />
                      <span>Dashboard</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link href="/vote">
                      <VoteIcon className="size-4" />
                      <span>Vote</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link href="/results">
                      <TrendingUp className="size-4" />
                      <span>Results</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive>
                    <Link href="/dashboard/profile">
                      <User className="size-4" />
                      <span>Profile</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link href="/dashboard/settings">
                      <Shield className="size-4" />
                      <span>Settings</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarContent>
            <SidebarFooter>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <div className="flex items-center gap-2 px-2 py-1">
                      <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-muted">
                        <User className="size-4" />
                      </div>
                      <div className="grid flex-1 text-left text-sm leading-tight">
                                              <span className="truncate font-semibold">
                        {formData.name || "User"}
                      </span>
                      <span className="truncate text-xs">
                        {formData.email}
                      </span>
                      </div>
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarFooter>
          </Sidebar>

          <div className="flex-1">
            <header className="sticky top-0 z-50 flex h-14 items-center justify-between border-b bg-background px-2 md:px-6">
              <div className="flex items-center gap-2 min-w-0">
                <SidebarTrigger />
                <h1 className="truncate text-sm font-semibold md:text-xl">
                  Profile
                </h1>
              </div>

              <div className="flex items-center gap-2">
                <ThemeToggle />
              </div>
            </header>

            <main className="flex-1 p-4 md:p-6">
              <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
                <AlertCircle className="h-16 w-16 text-muted-foreground mb-4" />
                <h2 className="text-xl font-semibold mb-2">Unable to Load Profile</h2>
                <p className="text-muted-foreground mb-6 max-w-md">
                  {error}
                </p>
                <div className="flex gap-4">
                  <Button
                    onClick={() => {
                      setError(null);
                      // Retry loading
                      fetchProfile(true);
                    }}
                  >
                    Try Again
                  </Button>
                </div>
              </div>
            </main>
          </div>
        </div>
      </SidebarProvider>
    );
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <Sidebar variant="inset">
          <SidebarHeader>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton size="lg" asChild>
                  <Link href="/dashboard">
                    <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                      <VoteIcon className="size-4" />
                    </div>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">
                        Voting Platform
                      </span>
                      <span className="truncate text-xs">Your Profile</span>
                    </div>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/dashboard">
                    <BarChart3 className="size-4" />
                    <span>Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/vote">
                    <VoteIcon className="size-4" />
                    <span>Vote</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/results">
                    <TrendingUp className="size-4" />
                    <span>Results</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive>
                  <Link href="/dashboard/profile">
                    <User className="size-4" />
                    <span>Profile</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/dashboard/settings">
                    <Shield className="size-4" />
                    <span>Settings</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <div className="flex items-center gap-2 px-2 py-1">
                    <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-muted">
                      <User className="size-4" />
                    </div>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">
                        {formData.name || "User"}
                      </span>
                      <span className="truncate text-xs">
                        {formData.email}
                      </span>
                    </div>
                  </div>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>

        <div className="flex-1">
          <header className="sticky top-0 z-50 flex h-14 items-center justify-between border-b bg-background px-2 md:px-6">
            <div className="flex items-center gap-2 min-w-0">
              <SidebarTrigger />
              <h1 className="truncate text-sm font-semibold md:text-xl">
                Profile
              </h1>
            </div>

            <div className="flex items-center gap-2">
              <ThemeToggle />
            </div>
          </header>

          <main className="flex-1 p-4 md:p-6">
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

            <div className="flex flex-col lg:flex-row gap-4 md:gap-6 mb-4 md:mb-6">
              <div className="lg:w-1/3">
                <Card>
                  <CardContent className="pt-4 md:pt-6">
                    <div className="flex flex-col items-center">
                      <div className="relative mb-3 md:mb-4">
                        <Avatar
                          name={formData.name}
                          size="96"
                          round={true}
                          color="#22c55e"
                          fgColor="#ffffff"
                          textSizeRatio={2}
                          className="border-4 border-primary/20 md:w-32 md:h-32"
                        />
                        <Button
                          size="icon"
                          variant="outline"
                          className="absolute bottom-0 right-0 rounded-full h-7 w-7 md:h-8 md:w-8 bg-background"
                        >
                          <Camera className="h-3 w-3 md:h-4 md:w-4" />
                        </Button>
                      </div>
                      <h2 className="text-lg md:text-xl font-bold text-center">{formData.name}</h2>
                      <p className="text-sm text-muted-foreground mb-3 md:mb-4 text-center">
                        {formData.email}
                      </p>
                      <Badge
                        variant="outline"
                        className="bg-green-500/10 text-green-500 border-green-500/20 mb-3 md:mb-4 text-xs"
                      >
                        <Check className="mr-1 h-3 w-3" />
                        {profile?.verification !== null || authUser?.isVerified
                          ? "Verified Voter"
                          : "Verification Pending"}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card className="mt-4 md:mt-6">
                  <CardHeader className="pb-3 md:pb-6">
                    <CardTitle className="text-lg md:text-xl">Voting Status</CardTitle>
                    <CardDescription className="text-sm">
                      Your voting history across all elections
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 md:space-y-4">
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
                            className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 border rounded-lg gap-3 sm:gap-0"
                          >
                            <div className="flex-1 min-w-0">
                              <h3 className="text-sm font-medium mb-1 truncate">
                                {election.name}
                              </h3>
                              <p className="text-xs text-muted-foreground mb-2">
                                {election.type} •{" "}
                                {new Date(election.startDate).toLocaleDateString()} -{" "}
                                {new Date(election.endDate).toLocaleDateString()}
                              </p>
                              <div className="flex flex-wrap gap-2">
                              {hasVoted[election.id] ? (
                                <Badge className="bg-green-500 text-xs">
                                  <Check className="mr-1 h-3 w-3" />
                                  Vote Cast
                                  {votingStatus[election.id]?.candidateName && (
                                    <span className="hidden sm:inline">
                                      {" "}
                                      for {votingStatus[election.id].candidateName}
                                    </span>
                                  )}
                                  {votingStatus[election.id]?.candidateParty && (
                                    <span className="hidden sm:inline">
                                      {" "}
                                      ({votingStatus[election.id].candidateParty})
                                    </span>
                                  )}
                                </Badge>
                              ) : votingStatus[election.id] === undefined &&
                                election.status === "active" ? (
                                <Badge
                                  variant="outline"
                                  className="text-blue-600 border-blue-600 text-xs"
                                >
                                  Loading Status...
                                </Badge>
                              ) : election.status === "active" ? (
                                <Badge
                                  variant="outline"
                                  className="text-yellow-600 border-yellow-600 text-xs"
                                >
                                  Not Voted - Active
                                </Badge>
                              ) : election.status === "completed" ? (
                                <Badge
                                  variant="outline"
                                  className="text-gray-600 border-gray-600 text-xs"
                                >
                                  Election Ended
                                </Badge>
                              ) : (
                                <Badge variant="outline" className="text-xs">
                                  {election.status === "scheduled"
                                    ? "Upcoming"
                                    : "Not Available"}
                                </Badge>
                              )}
                              </div>
                            </div>
                            {election.status === "active" &&
                              !hasVoted[election.id] && (
                                <Button size="sm" asChild className="w-full sm:w-auto">
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

                <Card className="mt-4 md:mt-6">
                  <CardHeader className="pb-3 md:pb-6">
                    <CardTitle className="text-lg md:text-xl">Polling Unit Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {profile?.voterCard?.pollingUnit ? (
                      <div className="space-y-3 md:space-y-4">
                        {/* Basic Information */}
                        <div className="space-y-2 text-sm">
                          <div className="grid grid-cols-1 gap-2">
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
                        </div>

                        {/* Detailed Information */}
                        {showDetailedPollingInfo && detailedPollingUnit && (
                          <>
                            <Separator />
                            <div className="space-y-2 text-sm">
                              <h4 className="font-medium text-base mb-3">
                                Detailed Information
                              </h4>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
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
                                  <p className="break-all">
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
                                  className="text-xs"
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
                        <div className="grid grid-cols-1 gap-2">
                          <p>
                            <span className="font-medium">VIN:</span>{" "}
                            {profile.voterCard.vin}
                          </p>
                          <p>
                            <span className="font-medium">Polling Unit Code:</span>{" "}
                            {profile.voterCard.pollingUnitCode}
                          </p>
                        </div>
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

              <div className="lg:w-2/3">
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
                  <TabsList className="grid w-full grid-cols-3 mb-4 md:mb-6">
                    <TabsTrigger value="personal" className="text-xs sm:text-sm">Personal Info</TabsTrigger>
                    <TabsTrigger value="voter" className="text-xs sm:text-sm">Voter Details</TabsTrigger>
                    <TabsTrigger value="security" className="text-xs sm:text-sm">Security</TabsTrigger>
                  </TabsList>

                  <TabsContent value="personal" className="mt-4 md:mt-6">
                    <Card>
                      <CardHeader className="pb-3 md:pb-6">
                        <CardTitle className="text-lg md:text-xl">Personal Information</CardTitle>
                        <CardDescription className="text-sm">
                          Update your personal details and contact information.
                        </CardDescription>
                      </CardHeader>
                      <form onSubmit={handleSubmit}>
                        <CardContent className="space-y-3 md:space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="name" className="text-sm">Full Name</Label>
                              <Input
                                id="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                disabled={!isEditing}
                                placeholder="Enter your full name"
                                className="text-sm"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="email" className="text-sm">Email Address</Label>
                              <Input
                                id="email"
                                type="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                disabled={!isEditing}
                                placeholder="Enter your email"
                                className="text-sm"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="phone" className="text-sm">Phone Number</Label>
                              <Input
                                id="phone"
                                value={formData.phone}
                                onChange={handleInputChange}
                                disabled={!isEditing}
                                placeholder="Enter your phone number"
                                className="text-sm"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="dob" className="text-sm">Date of Birth</Label>
                              <Input
                                id="dob"
                                type="date"
                                value={formData.dob}
                                onChange={handleInputChange}
                                disabled={!isEditing}
                                className="text-sm"
                              />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="address" className="text-sm">Address</Label>
                            <Textarea
                              id="address"
                              value={formData.address}
                              onChange={handleInputChange}
                              disabled={!isEditing}
                              placeholder="Enter your address"
                              rows={3}
                              className="text-sm resize-none"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="bio" className="text-sm">Bio</Label>
                            <Textarea
                              id="bio"
                              value={formData.bio}
                              onChange={handleInputChange}
                              disabled={!isEditing}
                              placeholder="Tell us about yourself"
                              rows={4}
                              className="text-sm resize-none"
                            />
                          </div>
                        </CardContent>
                        {isEditing && (
                          <CardFooter className="pt-3 md:pt-6">
                            <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
                              {isLoading ? "Saving..." : "Save Changes"}
                              <Save className="ml-2 h-4 w-4" />
                            </Button>
                          </CardFooter>
                        )}
                      </form>
                    </Card>
                  </TabsContent>

                  <TabsContent value="voter" className="mt-4 md:mt-6">
                    <Card>
                      <CardHeader className="pb-3 md:pb-6">
                        <CardTitle className="text-lg md:text-xl">Voter Information</CardTitle>
                        <CardDescription className="text-sm">
                          Your voter registration details and identification.
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3 md:space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="nin" className="text-sm">
                              National Identification Number (NIN)
                            </Label>
                            <Input
                              id="nin"
                              value={formData.nin}
                              disabled
                              placeholder="Your NIN"
                              className="text-sm"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="vin" className="text-sm">
                              Voter Identification Number (VIN)
                            </Label>
                            <Input
                              id="vin"
                              value={formData.vin}
                              disabled
                              placeholder="Your VIN"
                              className="text-sm"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="state" className="text-sm">State</Label>
                            <Input
                              id="state"
                              value={formData.state}
                              disabled
                              placeholder="Your state"
                              className="text-sm"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="lga" className="text-sm">Local Government Area</Label>
                            <Input
                              id="lga"
                              value={formData.lga}
                              disabled
                              placeholder="Your LGA"
                              className="text-sm"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="ward" className="text-sm">Ward</Label>
                            <Input
                              id="ward"
                              value={formData.ward}
                              disabled
                              placeholder="Your ward"
                              className="text-sm"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="pollingUnit" className="text-sm">Polling Unit</Label>
                          <Input
                            id="pollingUnit"
                            value={formData.pollingUnit}
                            disabled
                            placeholder="Your polling unit"
                            className="text-sm"
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                          <div className="space-y-2">
                            <Label className="text-sm">Account Status</Label>
                            <div>
                              <Badge
                                variant={profile?.isActive ? "default" : "destructive"}
                                className="text-xs"
                              >
                                {profile?.isActive ? "Active" : "Inactive"}
                              </Badge>
                            </div>
                          </div>
                          {profile?.lastLogin && (
                            <div className="space-y-2">
                              <Label className="text-sm">Last Login</Label>
                              <p className="text-sm text-muted-foreground">
                                {new Date(profile.lastLogin).toLocaleString()}
                              </p>
                            </div>
                          )}
                        </div>

                        {profile?.createdAt && (
                          <div className="space-y-2">
                            <Label className="text-sm">Account Created</Label>
                            <p className="text-sm text-muted-foreground">
                              {new Date(profile.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        )}

                        <Alert>
                          <Shield className="h-4 w-4" />
                          <AlertTitle className="text-sm">Secure Information</AlertTitle>
                          <AlertDescription className="text-sm">
                            Your voter registration details are verified and cannot be
                            modified. If you need to update this information, please
                            contact the electoral commission.
                          </AlertDescription>
                        </Alert>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="security" className="mt-4 md:mt-6">
                    <Card>
                      <CardHeader className="pb-3 md:pb-6">
                        <CardTitle className="text-lg md:text-xl">Security Settings</CardTitle>
                        <CardDescription className="text-sm">
                          Manage your account security and authentication preferences.
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4 md:space-y-6">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
                          <div className="space-y-0.5">
                            <Label className="text-sm">Two-Factor Authentication</Label>
                            <p className="text-sm text-muted-foreground">
                              Add an extra layer of security to your account
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge
                              variant={profile?.mfaEnabled ? "default" : "outline"}
                              className="text-xs"
                            >
                              {profile?.mfaEnabled ? "Enabled" : "Disabled"}
                            </Badge>
                            <Switch checked={profile?.mfaEnabled} disabled />
                          </div>
                        </div>

                        <Separator />

                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
                          <div className="space-y-0.5">
                            <Label className="text-sm">Email Notifications</Label>
                            <p className="text-sm text-muted-foreground">
                              Receive security alerts via email
                            </p>
                          </div>
                          <Switch defaultChecked />
                        </div>

                        <Separator />

                        <div className="space-y-3 md:space-y-4">
                          <Button variant="outline" className="w-full sm:w-auto">
                            <Key className="mr-2 h-4 w-4" />
                            Change Password
                          </Button>

                          <Alert>
                            <Shield className="h-4 w-4" />
                            <AlertTitle className="text-sm">Account Security</AlertTitle>
                            <AlertDescription className="text-sm">
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
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

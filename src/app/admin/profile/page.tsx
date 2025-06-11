"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import ReactAvatar from "react-avatar";
import {
  ArrowLeft,
  Camera,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Save,
  AlertCircle,
  Shield,
  Key,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AdminLayout } from "@/components/admin/admin-layout";
import { useAuthStore, useUIStore } from "@/store/useStore";
import { useAdminData } from "@/hooks/useAdminData";
import { useRouter } from "next/navigation";
import { adminAPI } from "@/services/api";

export default function AdminProfilePage() {
  const router = useRouter();
  const { user, isAuthenticated, updateUser } = useAuthStore();
  const { isLoading, error, setError } = useUIStore();
  const { isAdmin, updateAdminUser } = useAdminData();

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [profileData, setProfileData] = useState<any>(null);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    jobTitle: "",
    department: "",
    bio: "",
    location: "",
  });

  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    emailNotifications: true,
    loginNotifications: true,
  });

  // Optimized useEffect for authentication, redirect, and profile data loading
  useEffect(() => {
    // Handle authentication and redirect first
    if (!isAuthenticated) {
      router.push("/admin/login");
      return;
    }

    if (!isAdmin) {
      router.push("/dashboard");
      return;
    }

    // Prevent multiple simultaneous calls
    if (isLoadingProfile || isSaving) {
      return;
    }

    // Check if we already have profile data
    const hasProfileData = profileData && profileData.id;
    if (hasProfileData) {
      return;
    }

    // Load admin profile data if authenticated, admin, and no data exists
    const loadAdminProfile = async () => {
      setIsLoadingProfile(true);
      try {
        const response = await adminAPI.getAdminProfile();
        if (response.success && response.data) {
          setProfileData(response.data);

          // Update form data with API response
          setFormData({
            fullName: response.data.fullName || "",
            email: response.data.email || "",
            phoneNumber: response.data.phoneNumber || "",
            jobTitle: response.data.adminType || "Administrator",
            department: response.data.department || "Electoral Operations",
            bio: response.data.bio || "",
            location: response.data.location || "",
          });
        }
      } catch (err) {
        console.error("Failed to load admin profile:", err);
        setError("Failed to load profile data");

        // Fallback to user data from auth store
        if (user) {
          const adminUser = user as any;
          setFormData({
            fullName: user.fullName || "",
            email: user.email || "",
            phoneNumber: user.phoneNumber || "",
            jobTitle: adminUser.jobTitle || "Administrator",
            department: adminUser.department || "Electoral Operations",
            bio: adminUser.bio || "",
            location: adminUser.location || "",
          });
        }
      } finally {
        setIsLoadingProfile(false);
      }
    };

    loadAdminProfile();
  }, [isAuthenticated, isAdmin]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSecurityToggle = (setting: string, value: boolean) => {
    setSecuritySettings((prev) => ({ ...prev, [setting]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);

    const updateData = {
      fullName: formData.fullName,
      phoneNumber: formData.phoneNumber,
      jobTitle: formData.jobTitle,
      department: formData.department,
      bio: formData.bio,
      location: formData.location,
    };

    try {
      // Use new admin profile API to update
      const response = await adminAPI.updateAdminProfile(updateData);

      if (response.success) {
        // Update profile data state with response
        setProfileData(response.data);

        // Update local auth store
        updateUser({
          fullName: formData.fullName,
          phoneNumber: formData.phoneNumber,
          ...(formData.jobTitle && { jobTitle: formData.jobTitle }),
          ...(formData.department && { department: formData.department }),
          ...(formData.bio && { bio: formData.bio }),
          ...(formData.location && { location: formData.location }),
        } as any);

        setSaveSuccess(true);
        setIsEditing(false);
        setTimeout(() => setSaveSuccess(false), 3000);
      } else {
        throw new Error(response.message || "Failed to update profile");
      }
    } catch (err: any) {
      console.error("Failed to update admin profile:", err);
      setError(err.message || "Failed to update profile");

      // Fallback to legacy method if available
      if (user?.id && updateAdminUser) {
        try {
          await updateAdminUser(user.id, updateData);
          updateUser({
            fullName: formData.fullName,
            phoneNumber: formData.phoneNumber,
            ...(formData.jobTitle && { jobTitle: formData.jobTitle }),
            ...(formData.department && { department: formData.department }),
            ...(formData.bio && { bio: formData.bio }),
            ...(formData.location && { location: formData.location }),
          } as any);

          setSaveSuccess(true);
          setIsEditing(false);
          setTimeout(() => setSaveSuccess(false), 3000);
          setError(null); // Clear error if fallback succeeds
        } catch (fallbackError) {
          console.error("Fallback update also failed:", fallbackError);
        }
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    // Reset form data to original values
    if (user) {
      const adminUser = user as any;
      setFormData({
        fullName: user.fullName || "",
        email: user.email || "",
        phoneNumber: user.phoneNumber || "",
        jobTitle: adminUser.jobTitle || "Administrator",
        department: adminUser.department || "Electoral Operations",
        bio: adminUser.bio || "",
        location: adminUser.location || "",
      });
    }
    setIsEditing(false);
  };

  if (!isAuthenticated || !isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading admin profile...</p>
        </div>
      </div>
    );
  }

  if (isLoadingProfile) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Loading profile data...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-8 p-6 md:p-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/admin/dashboard">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
              </Link>
            </Button>
          </div>
          {/* {!isEditing ? (
            <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
          ) : (
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={isSaving}>
                {isSaving ? (
                  <>
                    <span className="animate-spin mr-2">⏳</span>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          )} */}
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {saveSuccess && (
          <Alert className="bg-green-500/10 border-green-500/20 text-green-600">
            <Shield className="h-4 w-4" />
            <AlertTitle>Success</AlertTitle>
            <AlertDescription>
              Your profile has been updated successfully.
            </AlertDescription>
          </Alert>
        )}

        {profileData && (
          <Alert className="bg-blue-500/10 border-blue-500/20 text-blue-600">
            <Shield className="h-4 w-4" />
            <AlertTitle>Profile Loaded</AlertTitle>
            <AlertDescription>
              Profile data loaded from server.
              {profileData.creator &&
                ` Created by ${profileData.creator.fullName}.`}
              {profileData.lastLogin &&
                ` Last login: ${new Date(
                  profileData.lastLogin
                ).toLocaleDateString()}.`}
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle>Profile</CardTitle>
              <CardDescription>Your personal information</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center text-center">
              <div className="relative mb-4">
                <ReactAvatar
                  name={formData.fullName}
                  size="128"
                  round={true}
                  color="#22c55e"
                  fgColor="#ffffff"
                  textSizeRatio={2}
                  className="border-4 border-primary/20"
                />
                {isEditing && (
                  <Button
                    size="icon"
                    variant="outline"
                    className="absolute bottom-0 right-0 rounded-full"
                  >
                    <Camera className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <h2 className="text-2xl font-bold">{formData.fullName}</h2>
              <p className="text-muted-foreground">{formData.jobTitle}</p>
              <div className="mt-2 flex gap-2">
                <Badge className="bg-green-600">Admin</Badge>
                <Badge variant="outline">Verified</Badge>
              </div>
              <Separator className="my-4" />
              <div className="w-full space-y-4 text-left">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{formData.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    {formData.phoneNumber || "Not provided"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    {formData.location || "Not provided"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    Admin since{" "}
                    {new Date(
                      profileData?.createdAt ||
                        (user as any)?.createdAt ||
                        Date.now()
                    ).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
              <CardDescription>Manage your account details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  {isEditing ? (
                    <Input
                      id="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      placeholder="Enter your full name"
                    />
                  ) : (
                    <p className="text-sm py-2">{formData.fullName}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <p className="text-sm py-2 text-muted-foreground">
                    {formData.email} (Cannot be changed)
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">Phone Number</Label>
                  {isEditing ? (
                    <Input
                      id="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      placeholder="Enter your phone number"
                    />
                  ) : (
                    <p className="text-sm py-2">
                      {formData.phoneNumber || "Not provided"}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  {isEditing ? (
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      placeholder="Enter your location"
                    />
                  ) : (
                    <p className="text-sm py-2">
                      {formData.location || "Not provided"}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="jobTitle">Job Title</Label>
                  {isEditing ? (
                    <Input
                      id="jobTitle"
                      value={formData.jobTitle}
                      onChange={handleInputChange}
                      placeholder="Enter your job title"
                    />
                  ) : (
                    <p className="text-sm py-2">{formData.jobTitle}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  {isEditing ? (
                    <Input
                      id="department"
                      value={formData.department}
                      onChange={handleInputChange}
                      placeholder="Enter your department"
                    />
                  ) : (
                    <p className="text-sm py-2">{formData.department}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                {isEditing ? (
                  <Textarea
                    id="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    placeholder="Tell us about yourself and your role"
                    rows={4}
                  />
                ) : (
                  <p className="text-sm py-2">
                    {formData.bio || "No bio provided"}
                  </p>
                )}
              </div>
            </CardContent>
            <CardFooter className="border-t px-6 py-4">
              <p className="text-xs text-muted-foreground">
                Last updated:{" "}
                {new Date(
                  profileData?.updatedAt ||
                    (user as any)?.updatedAt ||
                    Date.now()
                ).toLocaleDateString()}
              </p>
              {profileData?.lastLogin && (
                <p className="text-xs text-muted-foreground">
                  Last login: {new Date(profileData.lastLogin).toLocaleString()}
                </p>
              )}
            </CardFooter>
          </Card>

          <Card className="md:col-span-3">
            <CardHeader>
              <CardTitle>Security & Access</CardTitle>
              <CardDescription>
                Manage your security settings and access permissions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Two-Factor Authentication</Label>
                      <p className="text-sm text-muted-foreground">
                        Add extra security to your account
                      </p>
                    </div>
                    <Switch
                      checked={
                        profileData?.mfaEnabled ??
                        securitySettings.twoFactorAuth
                      }
                      onCheckedChange={(checked) =>
                        handleSecurityToggle("twoFactorAuth", checked)
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive security alerts via email
                      </p>
                    </div>
                    <Switch
                      checked={securitySettings.emailNotifications}
                      onCheckedChange={(checked) =>
                        handleSecurityToggle("emailNotifications", checked)
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Login Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Get notified of login attempts
                      </p>
                    </div>
                    <Switch
                      checked={securitySettings.loginNotifications}
                      onCheckedChange={(checked) =>
                        handleSecurityToggle("loginNotifications", checked)
                      }
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <h3 className="font-medium">Access Level</h3>
                    <Badge className="bg-red-600">
                      {profileData?.adminType || "Administrator"}
                    </Badge>
                    <p className="text-xs text-muted-foreground">
                      {profileData?.isActive
                        ? "Active account with full access"
                        : "Account inactive"}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-medium">Account Actions</h3>
                    <div className="space-y-2">
                      <Button variant="outline" size="sm" className="w-full">
                        <Key className="mr-2 h-4 w-4" />
                        Change Password
                      </Button>
                      <Button variant="outline" size="sm" className="w-full">
                        <Shield className="mr-2 h-4 w-4" />
                        View Session History
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <Alert>
                <Shield className="h-4 w-4" />
                <AlertTitle>Enhanced Security</AlertTitle>
                <AlertDescription>
                  Your admin account is protected with enterprise-grade security
                  measures including audit logging, session monitoring, and
                  fraud detection.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}

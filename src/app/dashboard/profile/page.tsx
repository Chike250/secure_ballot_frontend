"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Camera, Check, Shield, Key, Save, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { ELECTION_TYPES } from "@/lib/constants"
import { useAuthStore, useUIStore } from "@/store/useStore"
import { useUser } from "@/hooks/useUser"

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const { user: authUser } = useAuthStore()
  const { isLoading, error } = useUIStore()
  const { profile, updateProfile } = useUser()

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
  })

  useEffect(() => {
    const initialData = {
      name: profile?.fullName || authUser?.fullName || "",
      email: profile?.email || authUser?.email || "",
      phone: profile?.phoneNumber || authUser?.phoneNumber || "",
      address: profile?.address || "",
      nin: profile?.nin || authUser?.nin || "",
      vin: profile?.vin || authUser?.vin || "",
      dob: profile?.dob || "",
      gender: profile?.gender || "",
      state: profile?.state || "",
      lga: profile?.lga || "",
      ward: profile?.ward || "",
      pollingUnit: profile?.pollingUnit || "",
      bio: profile?.bio || "",
    }
    setFormData(initialData)
  }, [profile, authUser])

  const [votingStatus, setVotingStatus] = useState<Record<string, { candidateParty: string }>>({})

  useEffect(() => {
    const savedVotingStatus = localStorage.getItem("votingStatus")
    if (savedVotingStatus) {
      try {
        const parsedStatus = JSON.parse(savedVotingStatus)
        if (typeof parsedStatus === 'object' && parsedStatus !== null) {
          setVotingStatus(parsedStatus)
        }
      } catch (error) {
        console.error("Error parsing voting status from localStorage:", error)
      }
    }
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target
    setFormData(prev => ({ ...prev, [id]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const dataToUpdate = {
      phoneNumber: formData.phone,
    }
    const success = await updateProfile(dataToUpdate)
    if (success) {
      setIsEditing(false)
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3000)
    } else {
      console.error("Update failed, error should be in UI store")
    }
  }

  if (isLoading && !profile) {
    return <div>Loading profile...</div>
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
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="flex flex-col md:flex-row gap-6 mb-6">
        <div className="md:w-1/3">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center">
                <div className="relative mb-4">
                  <div className="h-32 w-32 rounded-full overflow-hidden border-4 border-primary/20">
                    <Image
                      src="/placeholder.svg?height=128&width=128"
                      alt="Profile"
                      width={128}
                      height={128}
                      className="object-cover"
                    />
                  </div>
                  <Button
                    size="icon"
                    variant="outline"
                    className="absolute bottom-0 right-0 rounded-full h-8 w-8 bg-background"
                  >
                    <Camera className="h-4 w-4" />
                  </Button>
                </div>
                <h2 className="text-xl font-bold">{formData.name}</h2>
                <p className="text-sm text-muted-foreground mb-4">{formData.email}</p>
                <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20 mb-4">
                  <Check className="mr-1 h-3 w-3" /> 
                  {profile?.isVerified ? "Verified Voter" : "Verification Pending"}
                </Badge>
                <Button variant="outline" className="w-full" onClick={() => setIsEditing(!isEditing)}>
                  {isEditing ? "Cancel Editing" : "Edit Profile"}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Voting Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(ELECTION_TYPES).map(([type, title]) => (
                  <div key={type}>
                    <h3 className="text-sm font-medium mb-1">{title}</h3>
                    {votingStatus[type] ? (
                      <Badge className="bg-green-500">
                        <Check className="mr-1 h-3 w-3" /> Vote Cast for {votingStatus[type].candidateParty}
                      </Badge>
                    ) : (
                      <Badge variant="outline">Not Voted</Badge>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm" asChild className="w-full">
                <Link href="/vote">Go to Voting Page</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div className="md:w-2/3">
          {saveSuccess && (
            <Alert className="mb-6 bg-green-500/10 border-green-500/20 text-green-600">
              <Check className="h-4 w-4" />
              <AlertTitle>Success</AlertTitle>
              <AlertDescription>Your profile has been updated successfully.</AlertDescription>
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
                  <CardDescription>Manage your personal details</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit}>
                    <div className="grid gap-6 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input id="name" value={formData.name} onChange={handleInputChange} disabled={!isEditing} />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input id="email" type="email" value={formData.email} onChange={handleInputChange} disabled={!isEditing} />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input id="phone" value={formData.phone} onChange={handleInputChange} disabled={!isEditing} />
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

                      <div className="space-y-2">
                        <Label htmlFor="gender">Gender</Label>
                        <Input
                          id="gender"
                          value={formData.gender}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                        />
                      </div>

                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="address">Address</Label>
                        <Textarea
                          id="address"
                          value={formData.address}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          rows={3}
                        />
                      </div>

                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="bio">Bio</Label>
                        <Textarea
                          id="bio"
                          value={formData.bio}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          rows={4}
                        />
                      </div>
                    </div>

                    {isEditing && (
                      <Button type="submit" className="mt-6" disabled={isLoading}>
                        {isLoading ? "Saving..." : <><Save className="mr-2 h-4 w-4" /> Save Changes</>}
                      </Button>
                    )}
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="voter" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Voter Registration Details</CardTitle>
                  <CardDescription>Your official voter information</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="grid gap-6 md:grid-cols-2">
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-1">National ID Number (NIN)</h3>
                        <p className="font-mono">{formData.nin}</p>
                      </div>

                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-1">Voter ID Number (VIN)</h3>
                        <p className="font-mono">{formData.vin}</p>
                      </div>

                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-1">State of Registration</h3>
                        <p>{formData.state}</p>
                      </div>

                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-1">Local Government Area</h3>
                        <p>{formData.lga}</p>
                      </div>

                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-1">Ward</h3>
                        <p>{formData.ward}</p>
                      </div>

                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-1">Polling Unit</h3>
                        <p>{formData.pollingUnit}</p>
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <h3 className="font-medium mb-2">Voter Card</h3>
                      <div className="border rounded-lg p-4 bg-muted/30">
                        <div className="flex flex-col md:flex-row gap-4 items-center">
                          <div className="h-24 w-24 rounded-md overflow-hidden bg-muted">
                            <Image
                              src="/placeholder.svg?height=96&width=96"
                              alt="Voter Card"
                              width={96}
                              height={96}
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium">{formData.name}</h4>
                            <p className="text-sm text-muted-foreground mb-2">VIN: {formData.vin}</p>
                            <p className="text-sm">
                              {formData.state} State, {formData.lga} LGA
                            </p>
                            <p className="text-sm">Polling Unit: {formData.pollingUnit}</p>
                          </div>
                          <Button variant="outline" size="sm">
                            Download
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Security Settings</CardTitle>
                  <CardDescription>Manage your account security</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Two-Factor Authentication</Label>
                        <p className="text-sm text-muted-foreground">
                          Secure your account with an additional verification step
                        </p>
                      </div>
                      <Switch checked={true} />
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Biometric Verification</Label>
                        <p className="text-sm text-muted-foreground">Use fingerprint or facial recognition to vote</p>
                      </div>
                      <Switch checked={false} />
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Login Notifications</Label>
                        <p className="text-sm text-muted-foreground">
                          Receive alerts when your account is accessed from a new device
                        </p>
                      </div>
                      <Switch checked={true} />
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <Label>Recent Activity</Label>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center text-sm">
                          <div className="flex items-center gap-2">
                            <Shield className="h-4 w-4 text-green-500" />
                            <span>Successful login</span>
                          </div>
                          <span className="text-muted-foreground">Today, 10:42 AM</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                          <div className="flex items-center gap-2">
                            <Key className="h-4 w-4 text-green-500" />
                            <span>Password changed</span>
                          </div>
                          <span className="text-muted-foreground">Mar 15, 2027</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                          <div className="flex items-center gap-2">
                            <Shield className="h-4 w-4 text-amber-500" />
                            <span>Login attempt from new device</span>
                          </div>
                          <span className="text-muted-foreground">Mar 10, 2027</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Camera, Check, Shield, Key, Save } from "lucide-react"
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

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)

  // Mock user data
  const [userData, setUserData] = useState({
    name: "Oluwaseun Adeyemi",
    email: "oluwaseun.adeyemi@example.com",
    phone: "+234 812 345 6789",
    address: "123 Adetokunbo Ademola St, Victoria Island, Lagos",
    nin: "12345678901",
    vin: "AB1234567890123456",
    dob: "1985-05-15",
    gender: "Male",
    state: "Lagos",
    lga: "Eti-Osa",
    ward: "Victoria Island",
    pollingUnit: "VI/012/04",
    bio: "Software engineer and civic-minded Nigerian passionate about democratic processes and technological innovation.",
  })

  // Remove the hardcoded voting status and replace with data from localStorage
  const [votingStatus, setVotingStatus] = useState({})

  // Add useEffect to load voting status from localStorage
  useEffect(() => {
    const savedVotingStatus = localStorage.getItem("votingStatus")
    if (savedVotingStatus) {
      setVotingStatus(JSON.parse(savedVotingStatus))
    }
  }, [])

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Simulate API call
    setTimeout(() => {
      setIsEditing(false)
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3000)
    }, 1000)
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
                <h2 className="text-xl font-bold">{userData.name}</h2>
                <p className="text-sm text-muted-foreground mb-4">{userData.email}</p>
                <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20 mb-4">
                  <Check className="mr-1 h-3 w-3" /> Verified Voter
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
                        <Input
                          id="name"
                          value={userData.name}
                          onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                          disabled={!isEditing}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                          id="email"
                          type="email"
                          value={userData.email}
                          onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                          disabled={!isEditing}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          value={userData.phone}
                          onChange={(e) => setUserData({ ...userData, phone: e.target.value })}
                          disabled={!isEditing}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="dob">Date of Birth</Label>
                        <Input
                          id="dob"
                          type="date"
                          value={userData.dob}
                          onChange={(e) => setUserData({ ...userData, dob: e.target.value })}
                          disabled={!isEditing}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="gender">Gender</Label>
                        <Input
                          id="gender"
                          value={userData.gender}
                          onChange={(e) => setUserData({ ...userData, gender: e.target.value })}
                          disabled={!isEditing}
                        />
                      </div>

                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="address">Address</Label>
                        <Textarea
                          id="address"
                          value={userData.address}
                          onChange={(e) => setUserData({ ...userData, address: e.target.value })}
                          disabled={!isEditing}
                          rows={3}
                        />
                      </div>

                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="bio">Bio</Label>
                        <Textarea
                          id="bio"
                          value={userData.bio}
                          onChange={(e) => setUserData({ ...userData, bio: e.target.value })}
                          disabled={!isEditing}
                          rows={4}
                        />
                      </div>
                    </div>

                    {isEditing && (
                      <Button type="submit" className="mt-6">
                        <Save className="mr-2 h-4 w-4" />
                        Save Changes
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
                        <p className="font-mono">{userData.nin}</p>
                      </div>

                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-1">Voter ID Number (VIN)</h3>
                        <p className="font-mono">{userData.vin}</p>
                      </div>

                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-1">State of Registration</h3>
                        <p>{userData.state}</p>
                      </div>

                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-1">Local Government Area</h3>
                        <p>{userData.lga}</p>
                      </div>

                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-1">Ward</h3>
                        <p>{userData.ward}</p>
                      </div>

                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-1">Polling Unit</h3>
                        <p>{userData.pollingUnit}</p>
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
                            <h4 className="font-medium">{userData.name}</h4>
                            <p className="text-sm text-muted-foreground mb-2">VIN: {userData.vin}</p>
                            <p className="text-sm">
                              {userData.state} State, {userData.lga} LGA
                            </p>
                            <p className="text-sm">Polling Unit: {userData.pollingUnit}</p>
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

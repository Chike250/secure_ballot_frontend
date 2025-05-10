"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Camera, Mail, Phone, MapPin, Calendar, Save } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { AdminHeader } from "@/components/admin/admin-header"

export default function AdminProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = () => {
    setIsSaving(true)
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false)
      setIsEditing(false)
    }, 1500)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <AdminHeader />
      <div className="flex-1 space-y-8 p-6 md:p-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/admin/dashboard">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
              </Link>
            </Button>
          </div>
          {!isEditing ? (
            <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
          ) : (
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setIsEditing(false)}>
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
          )}
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle>Profile</CardTitle>
              <CardDescription>Your personal information</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center text-center">
              <div className="relative mb-4">
                <Avatar className="h-32 w-32">
                  <AvatarImage src="/placeholder.svg?height=128&width=128" alt="John Adebayo" />
                  <AvatarFallback className="text-3xl">JA</AvatarFallback>
                </Avatar>
                {isEditing && (
                  <Button size="icon" variant="outline" className="absolute bottom-0 right-0 rounded-full">
                    <Camera className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <h2 className="text-2xl font-bold">John Adebayo</h2>
              <p className="text-muted-foreground">Chief Electoral Officer</p>
              <div className="mt-2 flex gap-2">
                <Badge>Admin</Badge>
                <Badge variant="outline">Verified</Badge>
              </div>
              <Separator className="my-4" />
              <div className="w-full space-y-4 text-left">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  {isEditing ? (
                    <Input defaultValue="john.adebayo@secureballot.gov.ng" />
                  ) : (
                    <span>john.adebayo@secureballot.gov.ng</span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  {isEditing ? <Input defaultValue="+234 801 234 5678" /> : <span>+234 801 234 5678</span>}
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  {isEditing ? <Input defaultValue="Abuja, Nigeria" /> : <span>Abuja, Nigeria</span>}
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>Joined January 2022</span>
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
              <div className="space-y-2">
                <label htmlFor="fullName" className="text-sm font-medium">
                  Full Name
                </label>
                {isEditing ? <Input id="fullName" defaultValue="John Adebayo" /> : <p>John Adebayo</p>}
              </div>
              <div className="space-y-2">
                <label htmlFor="title" className="text-sm font-medium">
                  Job Title
                </label>
                {isEditing ? (
                  <Input id="title" defaultValue="Chief Electoral Officer" />
                ) : (
                  <p>Chief Electoral Officer</p>
                )}
              </div>
              <div className="space-y-2">
                <label htmlFor="department" className="text-sm font-medium">
                  Department
                </label>
                {isEditing ? (
                  <Input id="department" defaultValue="Electoral Operations" />
                ) : (
                  <p>Electoral Operations</p>
                )}
              </div>
              <div className="space-y-2">
                <label htmlFor="bio" className="text-sm font-medium">
                  Bio
                </label>
                {isEditing ? (
                  <Textarea
                    id="bio"
                    defaultValue="Over 15 years of experience in electoral management and civic education. Passionate about transparent democratic processes and voter empowerment."
                    rows={4}
                  />
                ) : (
                  <p>
                    Over 15 years of experience in electoral management and civic education. Passionate about
                    transparent democratic processes and voter empowerment.
                  </p>
                )}
              </div>
            </CardContent>
            <CardFooter className="border-t px-6 py-4">
              <p className="text-xs text-muted-foreground">Last updated: May 3, 2023</p>
            </CardFooter>
          </Card>

          <Card className="md:col-span-3">
            <CardHeader>
              <CardTitle>Security & Access</CardTitle>
              <CardDescription>Manage your security settings and access permissions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <h3 className="font-medium">Two-Factor Authentication</h3>
                  <p className="text-sm text-muted-foreground">Enabled via SMS</p>
                  {isEditing && (
                    <Button variant="outline" size="sm">
                      Configure
                    </Button>
                  )}
                </div>
                <div className="space-y-2">
                  <h3 className="font-medium">Password</h3>
                  <p className="text-sm text-muted-foreground">Last changed 30 days ago</p>
                  {isEditing && (
                    <Button variant="outline" size="sm">
                      Change Password
                    </Button>
                  )}
                </div>
                <div className="space-y-2">
                  <h3 className="font-medium">Access Level</h3>
                  <p className="text-sm text-muted-foreground">Super Administrator</p>
                  {isEditing && (
                    <Button variant="outline" size="sm" disabled>
                      Manage Permissions
                    </Button>
                  )}
                </div>
                <div className="space-y-2">
                  <h3 className="font-medium">API Access</h3>
                  <p className="text-sm text-muted-foreground">Full access to all endpoints</p>
                  {isEditing && (
                    <Button variant="outline" size="sm">
                      Manage API Keys
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

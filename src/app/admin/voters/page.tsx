"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, Search, Download, Upload, MoreHorizontal, User, MapPin, CheckCircle, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { AdminHeader } from "@/components/admin/admin-header"
import { useAdminData } from "@/hooks/useAdminData"
import { useAuthStore } from "@/store/useStore"
import { useRouter } from "next/navigation"

export default function AdminVotersPage() {
  const router = useRouter()
  const { user, isAuthenticated } = useAuthStore()
  const { isAdmin, systemStatistics, fetchSystemStatistics } = useAdminData()
  const [searchTerm, setSearchTerm] = useState("")

  // Redirect if not authenticated or not admin
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/admin/login")
      return
    }
    
    if (!isAdmin) {
      router.push("/dashboard")
      return
    }
  }, [isAuthenticated, isAdmin, router])

  // Load statistics on mount
  useEffect(() => {
    if (isAuthenticated && isAdmin) {
      fetchSystemStatistics()
    }
  }, [isAuthenticated, isAdmin, fetchSystemStatistics])

  if (!isAuthenticated || !isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading voters...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <AdminHeader />
      <div className="flex-1 space-y-8 p-6 md:p-8">
        <div className="flex items-center justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/admin/dashboard">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Dashboard
                </Link>
              </Button>
              <h1 className="text-3xl font-bold tracking-tight">Voter Management</h1>
            </div>
            <p className="text-muted-foreground">
              Manage voter registrations, verify identities, and monitor voter activity.
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Button>
              <Upload className="mr-2 h-4 w-4" />
              Import Voters
            </Button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Voters</CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{systemStatistics?.totalVoters?.toLocaleString() || '0'}</div>
              <p className="text-xs text-muted-foreground">Registered voters</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Verified</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{systemStatistics?.verifiedVoters?.toLocaleString() || '0'}</div>
              <p className="text-xs text-muted-foreground">Identity verified</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <XCircle className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{systemStatistics?.pendingVerification?.toLocaleString() || '0'}</div>
              <p className="text-xs text-muted-foreground">Awaiting verification</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Today</CardTitle>
              <User className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{systemStatistics?.activeToday?.toLocaleString() || '0'}</div>
              <p className="text-xs text-muted-foreground">Logged in today</p>
            </CardContent>
          </Card>
        </div>

        <div className="flex items-center space-x-2">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search voters..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Voter List</CardTitle>
            <CardDescription>Manage registered voters and their verification status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Filter and Search Controls */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <Input
                    placeholder="Search by name, VIN, or phone..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Verified
                  </Button>
                  <Button variant="outline" size="sm">
                    <XCircle className="mr-2 h-4 w-4" />
                    Pending
                  </Button>
                </div>
              </div>

              {/* Voter Table */}
              <div className="border rounded-lg">
                <div className="grid grid-cols-12 gap-4 p-4 bg-muted/50 font-medium text-sm">
                  <div className="col-span-3">Voter Information</div>
                  <div className="col-span-2">Location</div>
                  <div className="col-span-2">Registration</div>
                  <div className="col-span-2">Status</div>
                  <div className="col-span-2">Last Activity</div>
                  <div className="col-span-1">Actions</div>
                </div>
                
                {/* Sample voter data */}
                {[
                  {
                    id: '1',
                    name: 'John Doe',
                    vin: '12345678901',
                    phone: '+234 801 234 5678',
                    state: 'Lagos',
                    lga: 'Ikeja',
                    registrationDate: '2024-01-15',
                    status: 'verified',
                    lastActivity: '2024-01-20'
                  },
                  {
                    id: '2',
                    name: 'Jane Smith',
                    vin: '12345678902',
                    phone: '+234 802 345 6789',
                    state: 'Ogun',
                    lga: 'Abeokuta',
                    registrationDate: '2024-01-16',
                    status: 'pending',
                    lastActivity: '2024-01-19'
                  },
                  {
                    id: '3',
                    name: 'Ahmed Hassan',
                    vin: '12345678903',
                    phone: '+234 803 456 7890',
                    state: 'Kano',
                    lga: 'Kano Municipal',
                    registrationDate: '2024-01-17',
                    status: 'verified',
                    lastActivity: '2024-01-21'
                  }
                ].filter(voter => 
                  voter.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  voter.vin.includes(searchTerm) ||
                  voter.phone.includes(searchTerm)
                ).map((voter) => (
                  <div key={voter.id} className="grid grid-cols-12 gap-4 p-4 border-t hover:bg-muted/30">
                    <div className="col-span-3">
                      <div>
                        <p className="font-medium">{voter.name}</p>
                        <p className="text-xs text-muted-foreground">VIN: {voter.vin}</p>
                        <p className="text-xs text-muted-foreground">{voter.phone}</p>
                      </div>
                    </div>
                    <div className="col-span-2">
                      <div>
                        <p className="text-sm">{voter.state}</p>
                        <p className="text-xs text-muted-foreground">{voter.lga}</p>
                      </div>
                    </div>
                    <div className="col-span-2">
                      <p className="text-sm">{new Date(voter.registrationDate).toLocaleDateString()}</p>
                    </div>
                    <div className="col-span-2">
                      <Badge 
                        variant={voter.status === 'verified' ? 'default' : 'outline'}
                        className={voter.status === 'verified' 
                          ? 'bg-green-500 hover:bg-green-500/80' 
                          : 'text-yellow-600 border-yellow-600'
                        }
                      >
                        {voter.status === 'verified' ? (
                          <>
                            <CheckCircle className="mr-1 h-3 w-3" />
                            Verified
                          </>
                        ) : (
                          <>
                            <XCircle className="mr-1 h-3 w-3" />
                            Pending
                          </>
                        )}
                      </Badge>
                    </div>
                    <div className="col-span-2">
                      <p className="text-sm">{new Date(voter.lastActivity).toLocaleDateString()}</p>
                    </div>
                    <div className="col-span-1">
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between pt-4">
                <p className="text-sm text-muted-foreground">
                  Showing 3 of {systemStatistics?.totalVoters?.toLocaleString() || 0} voters
                </p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" disabled>
                    Previous
                  </Button>
                  <Button variant="outline" size="sm" disabled>
                    Next
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 
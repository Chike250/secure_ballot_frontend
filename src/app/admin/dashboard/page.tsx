"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SystemOverview } from "@/components/admin/system-overview";
import { ElectionManagement } from "@/components/admin/election-management";
import { VoterOverview } from "@/components/admin/voter-overview";
import { AuditLogs } from "@/components/admin/audit-logs";
import { NotificationsAlerts } from "@/components/admin/notifications-alerts";
import { AdminLayout } from "@/components/admin/admin-layout";
import { ElectionControl } from "@/components/admin/election-control";
import { SecurityPanel } from "@/components/admin/security-panel";
import { TrafficMonitoring } from "@/components/admin/traffic-monitoring";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  AlertCircle,
  Plus,
  FileText,
  Users,
  Database,
  Settings,
  BarChart3,
  RefreshCw,
} from "lucide-react";
import { useAdminData } from "@/hooks/useAdminData";
import { useElectionData } from "@/hooks/useElectionData";
import { useAuthStore, useUIStore } from "@/store/useStore";
import { useRouter } from "next/navigation";

export default function AdminDashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const { error } = useUIStore();
  const [activeTab, setActiveTab] = useState("overview");
  const [isReloading, setIsReloading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(false);

  // Admin data hooks
  const {
    adminUsers,
    pollingUnits,
    verificationRequests,
    systemStatistics,
    suspiciousActivities,
    fetchDashboardData,
    isAdmin,
  } = useAdminData();

  // Election data hook for admin context
  const { elections, fetchElections } = useElectionData();

  // Manual reload function
  const handleReload = async () => {
    setIsReloading(true);
    try {
      await Promise.all([fetchDashboardData(), fetchElections()]);
    } catch (err) {
      console.error("Failed to reload admin data:", err);
    } finally {
      setIsReloading(false);
    }
  };

  // Optimized useEffect for authentication, redirect, and data loading
  useEffect(() => {
    // Handle authentication and redirect
    if (!isAuthenticated) {
      router.push("/admin/login");
      return;
    }

    if (!isAdmin) {
      router.push("/dashboard"); // Redirect regular users to normal dashboard
      return;
    }

    // Prevent multiple simultaneous calls
    if (isInitialLoading || isReloading) {
      return;
    }

    // Check if we already have data - only load if we don't have essential data
    const hasEssentialData = systemStatistics || elections?.length > 0;
    if (hasEssentialData) {
      return;
    }

    // Load initial data if authenticated, admin, and no data exists
    const loadAdminData = async () => {
      setIsInitialLoading(true);
      try {
        // Single combined API call for all dashboard data
        await fetchDashboardData();
        // Also load elections separately since it's from a different hook
        await fetchElections();
      } catch (err) {
        console.error("Failed to load admin data:", err);
      } finally {
        setIsInitialLoading(false);
      }
    };

    loadAdminData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, isAdmin]); // Removed router dependency

  if (!isAuthenticated || !isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Verifying admin access...</p>
        </div>
      </div>
    );
  }

  // Quick action handlers - Use router.push directly to avoid dependency issues
  const handleCreateElection = () => {
    router.push("/admin/elections");
  };

  const handleImportVoters = () => {
    router.push("/admin/voters/import");
  };

  const handleGenerateReports = () => {
    router.push("/admin/reports");
  };

  return (
    <AdminLayout>
      <div className="space-y-8 p-6 md:p-8">
        <div className="flex items-center justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <h1 className="text-3xl font-bold tracking-tight">
                Admin Dashboard
              </h1>
              <Badge
                variant="outline"
                className="bg-green-500/10 text-green-500 border-green-500/20"
              >
                {user?.fullName || "Administrator"}
              </Badge>
            </div>
            <p className="text-muted-foreground">
              Manage elections, monitor voter activity, and ensure system
              security.
            </p>
          </div>

          <div className="flex items-center gap-4">
            {systemStatistics && (
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <BarChart3 className="h-4 w-4 text-blue-500" />
                  <span className="text-muted-foreground">
                    Active Elections:
                  </span>
                  <span className="font-medium">
                    {systemStatistics.activeElections || 0}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4 text-green-500" />
                  <span className="text-muted-foreground">Total Voters:</span>
                  <span className="font-medium">
                    {systemStatistics.totalVoters?.toLocaleString() || 0}
                  </span>
                </div>
              </div>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={handleReload}
              disabled={isReloading}
            >
              {isReloading ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Reloading...
                </>
              ) : (
                <>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Reload
                </>
              )}
            </Button>
          </div>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-4 md:w-auto">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="elections">Elections</TabsTrigger>
            <TabsTrigger value="voters">Voters</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <SystemOverview />

            <TrafficMonitoring />

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <ElectionControl />
              <NotificationsAlerts />
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <AuditLogs />
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Common administrative tasks</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">
                  <Card
                    className="p-4 hover:bg-muted/50 cursor-pointer transition-colors"
                    onClick={handleCreateElection}
                  >
                    <div className="flex items-center gap-2">
                      <Plus className="h-4 w-4 text-green-500" />
                      <div className="font-medium">Create New Election</div>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Set up a new election with candidates and polling units
                    </p>
                  </Card>

                  <Card
                    className="p-4 hover:bg-muted/50 cursor-pointer transition-colors"
                    onClick={handleImportVoters}
                  >
                    <div className="flex items-center gap-2">
                      <Database className="h-4 w-4 text-blue-500" />
                      <div className="font-medium">Import Voter Data</div>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Upload and process new voter registration data
                    </p>
                  </Card>

                  <Card
                    className="p-4 hover:bg-muted/50 cursor-pointer transition-colors"
                    onClick={handleGenerateReports}
                  >
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-purple-500" />
                      <div className="font-medium">Generate Reports</div>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Create and download system reports and analytics
                    </p>
                  </Card>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="elections" className="space-y-6">
            <ElectionManagement />
          </TabsContent>

          <TabsContent value="voters" className="space-y-6">
            <VoterOverview />
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <SecurityPanel />
            <AuditLogs />
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}

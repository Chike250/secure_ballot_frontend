"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Shield,
  AlertTriangle,
  Eye,
  Lock,
  Activity,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AdminLayout } from "@/components/admin/admin-layout";
import { useAdminData } from "@/hooks/useAdminData";
import { useAuthStore } from "@/store/useStore";
import { useRouter } from "next/navigation";

export default function AdminSecurityPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const {
    isAdmin,
    suspiciousActivities,
    fetchSuspiciousActivities,
    systemStatistics,
    fetchSystemStatistics,
  } = useAdminData();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(false);

  // Optimized useEffect for authentication, redirect, and data loading
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
    if (isInitialLoading || isRefreshing) {
      return;
    }

    // Check if we already have essential data
    const hasEssentialData =
      systemStatistics ||
      (suspiciousActivities && suspiciousActivities.length > 0);
    if (hasEssentialData) {
      return;
    }

    // Load security data if authenticated, admin, and no data exists
    const loadSecurityData = async () => {
      setIsInitialLoading(true);
      try {
        await Promise.all([
          fetchSuspiciousActivities(),
          fetchSystemStatistics(),
        ]);
      } catch (err) {
        console.error("Failed to load security data:", err);
      } finally {
        setIsInitialLoading(false);
      }
    };

    loadSecurityData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, isAdmin]); // Removed router and function dependencies

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await Promise.all([fetchSuspiciousActivities(), fetchSystemStatistics()]);
    } catch (error) {
      console.error("Failed to refresh security data:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  if (!isAuthenticated || !isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading security dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-8 p-6 md:p-8">
        <div className="flex items-center justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/admin/dashboard">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Dashboard
                </Link>
              </Button>
              <h1 className="text-3xl font-bold tracking-tight">
                Security Dashboard
              </h1>
            </div>
            <p className="text-muted-foreground">
              Monitor system security, detect threats, and manage access
              controls.
            </p>
          </div>
          <Button onClick={handleRefresh} disabled={isRefreshing}>
            {isRefreshing ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Refreshing...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh
              </>
            )}
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Security Status
              </CardTitle>
              <Shield className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Secure</div>
              <p className="text-xs text-muted-foreground">
                All systems operational
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Threats Blocked
              </CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {systemStatistics?.threatsBlocked || 0}
              </div>
              <p className="text-xs text-muted-foreground">Last 24 hours</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Active Sessions
              </CardTitle>
              <Activity className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {systemStatistics?.activeSessions || 0}
              </div>
              <p className="text-xs text-muted-foreground">Current users</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Failed Logins
              </CardTitle>
              <Lock className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {systemStatistics?.failedLogins || 0}
              </div>
              <p className="text-xs text-muted-foreground">Last hour</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Suspicious Activities</CardTitle>
              <CardDescription>
                Recent security alerts and suspicious behavior
              </CardDescription>
            </CardHeader>
            <CardContent>
              {suspiciousActivities && suspiciousActivities.length > 0 ? (
                <div className="space-y-4">
                  {suspiciousActivities.slice(0, 5).map((activity, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                        <div>
                          <p className="text-sm font-medium">
                            {activity.type || "Security Alert"}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {activity.description ||
                              "Suspicious activity detected"}
                          </p>
                        </div>
                      </div>
                      <Badge variant="destructive">High</Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Shield className="h-8 w-8 text-green-500 mx-auto mb-2" />
                  <p className="text-muted-foreground">
                    No suspicious activities detected
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Security Logs</CardTitle>
              <CardDescription>
                Recent security events and system access
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Eye className="h-4 w-4 text-blue-500" />
                    <div>
                      <p className="text-sm font-medium">Admin Login</p>
                      <p className="text-xs text-muted-foreground">
                        User: {user?.fullName}
                      </p>
                    </div>
                  </div>
                  <Badge variant="outline">Info</Badge>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Shield className="h-4 w-4 text-green-500" />
                    <div>
                      <p className="text-sm font-medium">System Backup</p>
                      <p className="text-xs text-muted-foreground">
                        Automated backup completed
                      </p>
                    </div>
                  </div>
                  <Badge variant="outline">Success</Badge>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Lock className="h-4 w-4 text-yellow-500" />
                    <div>
                      <p className="text-sm font-medium">Security Scan</p>
                      <p className="text-xs text-muted-foreground">
                        Routine security scan completed
                      </p>
                    </div>
                  </div>
                  <Badge variant="outline">Info</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Security Settings</CardTitle>
            <CardDescription>
              Configure system security parameters
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                Security configuration interface coming soon
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                This will include firewall settings, access controls, and
                security policies
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}

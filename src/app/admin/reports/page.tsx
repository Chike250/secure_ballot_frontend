"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Download,
  FileText,
  BarChart3,
  PieChart,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AdminLayout } from "@/components/admin/admin-layout";
import { useAdminData } from "@/hooks/useAdminData";
import { useElectionData } from "@/hooks/useElectionData";
import { useAuthStore } from "@/store/useStore";
import { useRouter } from "next/navigation";

export default function AdminReportsPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const { isAdmin, systemStatistics, fetchSystemStatistics } = useAdminData();
  const { elections, fetchElections } = useElectionData();
  const [generatingReport, setGeneratingReport] = useState<string | null>(null);
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
    if (isInitialLoading) {
      return;
    }

    // Check if we already have essential data
    const hasEssentialData =
      systemStatistics || (elections && elections.length > 0);
    if (hasEssentialData) {
      return;
    }

    // Load data if authenticated, admin, and no data exists
    const loadReportsData = async () => {
      setIsInitialLoading(true);
      try {
        await Promise.all([fetchSystemStatistics(), fetchElections()]);
      } catch (err) {
        console.error("Failed to load reports data:", err);
      } finally {
        setIsInitialLoading(false);
      }
    };

    loadReportsData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, isAdmin]); // Removed router and function dependencies

  const generateReport = async (reportType: string) => {
    setGeneratingReport(reportType);
    try {
      // Simulate report generation
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Create a mock CSV download
      const mockData =
        reportType === "election"
          ? `Election Name,Type,Status,Start Date,End Date,Total Votes\n${
              elections
                ?.map(
                  (e) =>
                    `${e.name},${e.type},${e.status},${e.startDate},${e.endDate},0`
                )
                .join("\n") || ""
            }`
          : reportType === "voter"
          ? `Name,VIN,State,LGA,Registration Date,Status\nJohn Doe,12345678901,Lagos,Ikeja,2024-01-15,Verified\nJane Smith,12345678902,Ogun,Abeokuta,2024-01-16,Pending`
          : `Metric,Value,Date\nTotal Voters,${
              systemStatistics?.totalVoters || 0
            },${new Date().toISOString()}\nTotal Votes,${
              systemStatistics?.totalVotes || 0
            },${new Date().toISOString()}`;

      // Create and trigger download
      const blob = new Blob([mockData], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${reportType}_report_${
        new Date().toISOString().split("T")[0]
      }.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error(`Failed to generate ${reportType} report:`, error);
    } finally {
      setGeneratingReport(null);
    }
  };

  if (!isAuthenticated || !isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading reports...</p>
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
                Reports & Analytics
              </h1>
            </div>
            <p className="text-muted-foreground">
              Generate comprehensive reports and analyze electoral data and
              system performance.
            </p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Election Reports
              </CardTitle>
              <CardDescription>
                Detailed election statistics and results
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-sm">
                <p className="font-medium">Available Reports:</p>
                <ul className="mt-2 space-y-1 text-muted-foreground">
                  <li>• Voter turnout analysis</li>
                  <li>• Results breakdown by region</li>
                  <li>• Candidate performance metrics</li>
                </ul>
              </div>
              <Button
                className="w-full"
                onClick={() => generateReport("election")}
                disabled={generatingReport === "election"}
              >
                {generatingReport === "election" ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Download className="mr-2 h-4 w-4" />
                    Generate Election Report
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="h-5 w-5" />
                Voter Analytics
              </CardTitle>
              <CardDescription>
                Voter registration and participation data
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-sm">
                <p className="font-medium">Available Reports:</p>
                <ul className="mt-2 space-y-1 text-muted-foreground">
                  <li>• Registration trends</li>
                  <li>• Demographic breakdown</li>
                  <li>• Geographic distribution</li>
                </ul>
              </div>
              <Button
                className="w-full"
                onClick={() => generateReport("voter")}
                disabled={generatingReport === "voter"}
              >
                {generatingReport === "voter" ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Download className="mr-2 h-4 w-4" />
                    Generate Voter Report
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                System Analytics
              </CardTitle>
              <CardDescription>
                System performance and security metrics
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-sm">
                <p className="font-medium">Available Reports:</p>
                <ul className="mt-2 space-y-1 text-muted-foreground">
                  <li>• System uptime</li>
                  <li>• Security incidents</li>
                  <li>• Performance metrics</li>
                </ul>
              </div>
              <Button
                className="w-full"
                onClick={() => generateReport("system")}
                disabled={generatingReport === "system"}
              >
                {generatingReport === "system" ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Download className="mr-2 h-4 w-4" />
                    Generate System Report
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Quick Statistics</CardTitle>
            <CardDescription>Overview of key metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-4">
              <div className="text-center">
                <div className="text-2xl font-bold">
                  {elections?.length || 0}
                </div>
                <p className="text-sm text-muted-foreground">Total Elections</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">
                  {systemStatistics?.totalVoters?.toLocaleString() || "0"}
                </div>
                <p className="text-sm text-muted-foreground">
                  Registered Voters
                </p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">
                  {systemStatistics?.totalVotes?.toLocaleString() || "0"}
                </div>
                <p className="text-sm text-muted-foreground">
                  Total Votes Cast
                </p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">
                  {systemStatistics?.totalVoters && systemStatistics?.totalVotes
                    ? Math.round(
                        (systemStatistics.totalVotes /
                          systemStatistics.totalVoters) *
                          100
                      )
                    : 0}
                  %
                </div>
                <p className="text-sm text-muted-foreground">Average Turnout</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Custom Reports</CardTitle>
            <CardDescription>
              Generate custom reports based on specific criteria
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                Custom report builder coming soon
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                This will allow you to create custom reports with specific
                filters and parameters
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}

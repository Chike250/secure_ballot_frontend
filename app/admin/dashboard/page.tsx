import type { Metadata } from "next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SystemOverview } from "@/components/admin/system-overview"
import { ElectionManagement } from "@/components/admin/election-management"
import { VoterOverview } from "@/components/admin/voter-overview"
import { AuditLogs } from "@/components/admin/audit-logs"
import { NotificationsAlerts } from "@/components/admin/notifications-alerts"
import { AdminHeader } from "@/components/admin/admin-header"
import { ElectionControl } from "@/components/admin/election-control"
import { SecurityPanel } from "@/components/admin/security-panel"
import { TrafficMonitoring } from "@/components/admin/traffic-monitoring"

export const metadata: Metadata = {
  title: "Admin Dashboard | Secure Ballot",
  description: "Admin dashboard for managing elections, voters, and system security",
}

export default function AdminDashboardPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <AdminHeader />
      <div className="flex-1 space-y-8 p-6 md:p-8">
        <div className="space-y-4">
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage elections, monitor voter activity, and ensure system security.</p>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
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
                  <Card className="p-4 hover:bg-muted/50 cursor-pointer transition-colors">
                    <div className="font-medium">Create New Election</div>
                    <p className="text-sm text-muted-foreground">
                      Set up a new election with candidates and polling units
                    </p>
                  </Card>
                  <Card className="p-4 hover:bg-muted/50 cursor-pointer transition-colors">
                    <div className="font-medium">Import Voter Data</div>
                    <p className="text-sm text-muted-foreground">Upload and process new voter registration data</p>
                  </Card>
                  <Card className="p-4 hover:bg-muted/50 cursor-pointer transition-colors">
                    <div className="font-medium">Generate Reports</div>
                    <p className="text-sm text-muted-foreground">Create and download system reports and analytics</p>
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
    </div>
  )
}

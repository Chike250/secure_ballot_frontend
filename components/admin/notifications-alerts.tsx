"use client"

import { AlertCircle, Bell, CheckCircle, Info } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"

// Mock notifications data
const notifications = [
  {
    id: "1",
    type: "critical",
    message: "Presidential election started at 08:30 AM",
    time: "25 Feb, 08:30 AM",
    read: false,
  },
  {
    id: "2",
    type: "warning",
    message: "Unusual login activity detected from IP 45.227.89.12",
    time: "25 Feb, 10:45 AM",
    read: false,
  },
  {
    id: "3",
    type: "info",
    message: "System backup completed successfully",
    time: "25 Feb, 12:00 PM",
    read: true,
  },
  {
    id: "4",
    type: "success",
    message: "Voter data import completed: 25,000 records processed",
    time: "24 Feb, 03:15 PM",
    read: true,
  },
  {
    id: "5",
    type: "warning",
    message: "High server load detected (85% CPU utilization)",
    time: "24 Feb, 02:30 PM",
    read: true,
  },
]

export function NotificationsAlerts() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center">
              <Bell className="mr-2 h-5 w-5" />
              Notifications & Alerts
            </CardTitle>
            <CardDescription>System alerts and important notifications</CardDescription>
          </div>
          <Button variant="outline" size="sm">
            Mark all as read
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px] pr-4">
          <div className="space-y-4">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`flex items-start gap-4 rounded-lg border p-4 ${
                  notification.read ? "bg-background" : "bg-muted/50"
                }`}
              >
                {notification.type === "critical" && <AlertCircle className="mt-0.5 h-5 w-5 text-destructive" />}
                {notification.type === "warning" && <AlertCircle className="mt-0.5 h-5 w-5 text-amber-500" />}
                {notification.type === "info" && <Info className="mt-0.5 h-5 w-5 text-blue-500" />}
                {notification.type === "success" && <CheckCircle className="mt-0.5 h-5 w-5 text-green-500" />}
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="font-medium">{notification.message}</p>
                    {!notification.read && <span className="flex h-2 w-2 rounded-full bg-blue-600"></span>}
                  </div>
                  <p className="text-xs text-muted-foreground">{notification.time}</p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}

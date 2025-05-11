"use client"

import { Shield, ShieldAlert, ShieldCheck, Lock, Key } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Progress } from "@/src/components/ui/progress"
import { Button } from "@/src/components/ui/button"
import { Switch } from "@/src/components/ui/switch"
import { Label } from "@/src/components/ui/label"

export function SecurityPanel() {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="mr-2 h-5 w-5" />
            Security Status
          </CardTitle>
          <CardDescription>Overall system security status and recommendations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <div className="mb-2 flex items-center justify-between">
                <div className="text-sm font-medium">System Security Score</div>
                <div className="text-sm font-medium">85%</div>
              </div>
              <Progress value={85} className="h-2" />
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-4 rounded-lg border p-4 bg-green-50 dark:bg-green-950/20">
                <ShieldCheck className="mt-0.5 h-5 w-5 text-green-500" />
                <div>
                  <p className="font-medium">Authentication Security</p>
                  <p className="text-sm text-muted-foreground">
                    Two-factor authentication is enabled for all admin accounts
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 rounded-lg border p-4 bg-green-50 dark:bg-green-950/20">
                <Lock className="mt-0.5 h-5 w-5 text-green-500" />
                <div>
                  <p className="font-medium">Data Encryption</p>
                  <p className="text-sm text-muted-foreground">
                    All voter data and ballot information is encrypted at rest and in transit
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 rounded-lg border p-4 bg-amber-50 dark:bg-amber-950/20">
                <ShieldAlert className="mt-0.5 h-5 w-5 text-amber-500" />
                <div>
                  <p className="font-medium">Security Updates</p>
                  <p className="text-sm text-muted-foreground">
                    System update available. Schedule maintenance to apply security patches.
                  </p>
                  <Button size="sm" variant="outline" className="mt-2">
                    Schedule Update
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Key className="mr-2 h-5 w-5" />
            Security Settings
          </CardTitle>
          <CardDescription>Configure system security settings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="two-factor">Two-Factor Authentication</Label>
                <p className="text-sm text-muted-foreground">Require 2FA for all admin accounts</p>
              </div>
              <Switch id="two-factor" defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="ip-restriction">IP Restriction</Label>
                <p className="text-sm text-muted-foreground">Limit admin access to specific IP addresses</p>
              </div>
              <Switch id="ip-restriction" defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="audit-logging">Enhanced Audit Logging</Label>
                <p className="text-sm text-muted-foreground">Log all system activities in detail</p>
              </div>
              <Switch id="audit-logging" defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="auto-logout">Auto Logout</Label>
                <p className="text-sm text-muted-foreground">
                  Automatically log out inactive sessions after 15 minutes
                </p>
              </div>
              <Switch id="auto-logout" defaultChecked />
            </div>

            <Button className="w-full">Save Security Settings</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

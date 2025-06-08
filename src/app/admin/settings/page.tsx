"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, Save, AlertCircle, Shield, Database, Users, Clock, Globe, Mail, Lock, CheckCircle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { AdminHeader } from "@/components/admin/admin-header"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { useAuthStore, useUIStore } from "@/store/useStore"
import { useAdminData } from "@/hooks/useAdminData"
import { useRouter } from "next/navigation"

interface SystemSettings {
  systemName: string
  timezone: string
  dateFormat: string
  language: string
  darkMode: boolean
  compactMode: boolean
  showHelpTips: boolean
  maintenanceMode: boolean
  registrationEnabled: boolean
}

interface SecuritySettings {
  twoFactorRequired: boolean
  sessionTimeout: number
  passwordExpiry: number
  maxLoginAttempts: number
  ipWhitelisting: boolean
  auditLogging: boolean
  suspiciousActivityDetection: boolean
  dataEncryption: boolean
}

interface NotificationSettings {
  emailNotifications: boolean
  smsNotifications: boolean
  pushNotifications: boolean
  securityAlerts: boolean
  systemAlerts: boolean
  electionAlerts: boolean
}

interface BackupSettings {
  automaticBackup: boolean
  backupFrequency: string
  retentionPeriod: number
  cloudBackup: boolean
  backupVerification: boolean
}

export default function AdminSettingsPage() {
  const router = useRouter()
  const { user, isAuthenticated } = useAuthStore()
  const { isLoading, error, setError } = useUIStore()
  const { isAdmin } = useAdminData()

  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [activeTab, setActiveTab] = useState("general")

  const [systemSettings, setSystemSettings] = useState<SystemSettings>({
    systemName: "Secure Ballot Admin",
    timezone: "africa-lagos",
    dateFormat: "dd-mm-yyyy",
    language: "en",
    darkMode: false,
    compactMode: false,
    showHelpTips: true,
    maintenanceMode: false,
    registrationEnabled: true,
  })

  const [securitySettings, setSecuritySettings] = useState<SecuritySettings>({
    twoFactorRequired: true,
    sessionTimeout: 30,
    passwordExpiry: 90,
    maxLoginAttempts: 3,
    ipWhitelisting: false,
    auditLogging: true,
    suspiciousActivityDetection: true,
    dataEncryption: true,
  })

  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    securityAlerts: true,
    systemAlerts: true,
    electionAlerts: true,
  })

  const [backupSettings, setBackupSettings] = useState<BackupSettings>({
    automaticBackup: true,
    backupFrequency: "daily",
    retentionPeriod: 30,
    cloudBackup: true,
    backupVerification: true,
  })

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

  // Load settings from localStorage on mount
  useEffect(() => {
    const loadSettings = () => {
      try {
        const savedSystemSettings = localStorage.getItem("admin-system-settings")
        const savedSecuritySettings = localStorage.getItem("admin-security-settings")
        const savedNotificationSettings = localStorage.getItem("admin-notification-settings")
        const savedBackupSettings = localStorage.getItem("admin-backup-settings")

        if (savedSystemSettings) {
          setSystemSettings(JSON.parse(savedSystemSettings))
        }
        if (savedSecuritySettings) {
          setSecuritySettings(JSON.parse(savedSecuritySettings))
        }
        if (savedNotificationSettings) {
          setNotificationSettings(JSON.parse(savedNotificationSettings))
        }
        if (savedBackupSettings) {
          setBackupSettings(JSON.parse(savedBackupSettings))
        }
      } catch (err) {
        console.error("Failed to load settings:", err)
      }
    }

    if (isAuthenticated && isAdmin) {
      loadSettings()
    }
  }, [isAuthenticated, isAdmin])

  const handleSystemChange = (key: keyof SystemSettings, value: any) => {
    setSystemSettings(prev => ({ ...prev, [key]: value }))
  }

  const handleSecurityChange = (key: keyof SecuritySettings, value: any) => {
    setSecuritySettings(prev => ({ ...prev, [key]: value }))
  }

  const handleNotificationChange = (key: keyof NotificationSettings, value: any) => {
    setNotificationSettings(prev => ({ ...prev, [key]: value }))
  }

  const handleBackupChange = (key: keyof BackupSettings, value: any) => {
    setBackupSettings(prev => ({ ...prev, [key]: value }))
  }

  const handleSave = async () => {
    setIsSaving(true)
    setError(null)

    try {
      // Save to localStorage
      localStorage.setItem("admin-system-settings", JSON.stringify(systemSettings))
      localStorage.setItem("admin-security-settings", JSON.stringify(securitySettings))
      localStorage.setItem("admin-notification-settings", JSON.stringify(notificationSettings))
      localStorage.setItem("admin-backup-settings", JSON.stringify(backupSettings))

      // In a real app, you would call an API to save settings
      // await adminAPI.updateSystemSettings({ systemSettings, securitySettings, notificationSettings, backupSettings })

      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3000)
    } catch (err: any) {
      setError(err.message || "Failed to save settings")
    } finally {
      setIsSaving(false)
    }
  }

  if (!isAuthenticated || !isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading admin settings...</p>
        </div>
      </div>
    )
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
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? (
              <>
                <span className="animate-spin mr-2">⏳</span>
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save All Changes
              </>
            )}
          </Button>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">System Settings</h1>
            <p className="text-muted-foreground">
              Configure system-wide settings and preferences for the voting platform
            </p>
          </div>
          <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
            Administrator
          </Badge>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {saveSuccess && (
          <Alert className="bg-green-500/10 border-green-500/20 text-green-600">
            <CheckCircle className="h-4 w-4" />
            <AlertTitle>Success</AlertTitle>
            <AlertDescription>All settings have been saved successfully.</AlertDescription>
          </Alert>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4 md:w-auto">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="backup">Backup & Recovery</TabsTrigger>
          </TabsList>

          <div className="mt-6">
            <TabsContent value="general" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="h-5 w-5" />
                    System Configuration
                  </CardTitle>
                  <CardDescription>Basic system settings and regional preferences</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="systemName">System Name</Label>
                      <Input 
                        id="systemName" 
                        value={systemSettings.systemName}
                        onChange={(e) => handleSystemChange("systemName", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="timezone">Timezone</Label>
                      <Select value={systemSettings.timezone} onValueChange={(value) => handleSystemChange("timezone", value)}>
                        <SelectTrigger id="timezone">
                          <SelectValue placeholder="Select timezone" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="africa-lagos">Africa/Lagos (GMT+1)</SelectItem>
                          <SelectItem value="africa-cairo">Africa/Cairo (GMT+2)</SelectItem>
                          <SelectItem value="africa-nairobi">Africa/Nairobi (GMT+3)</SelectItem>
                          <SelectItem value="europe-london">Europe/London (GMT+0)</SelectItem>
                          <SelectItem value="america-new_york">America/New_York (GMT-5)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="language">Interface Language</Label>
                      <Select value={systemSettings.language} onValueChange={(value) => handleSystemChange("language", value)}>
                        <SelectTrigger id="language">
                          <SelectValue placeholder="Select language" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="ha">Hausa</SelectItem>
                          <SelectItem value="yo">Yoruba</SelectItem>
                          <SelectItem value="ig">Igbo</SelectItem>
                          <SelectItem value="pcm">Nigerian Pidgin</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dateFormat">Date Format</Label>
                      <Select value={systemSettings.dateFormat} onValueChange={(value) => handleSystemChange("dateFormat", value)}>
                        <SelectTrigger id="dateFormat">
                          <SelectValue placeholder="Select date format" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="dd-mm-yyyy">DD-MM-YYYY</SelectItem>
                          <SelectItem value="mm-dd-yyyy">MM-DD-YYYY</SelectItem>
                          <SelectItem value="yyyy-mm-dd">YYYY-MM-DD</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Interface Preferences</h3>
                    <div className="grid gap-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Dark Mode</Label>
                          <p className="text-sm text-muted-foreground">Enable dark mode for all users</p>
                        </div>
                        <Switch 
                          checked={systemSettings.darkMode}
                          onCheckedChange={(checked) => handleSystemChange("darkMode", checked)}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Compact Mode</Label>
                          <p className="text-sm text-muted-foreground">Reduce spacing for a more compact interface</p>
                        </div>
                        <Switch 
                          checked={systemSettings.compactMode}
                          onCheckedChange={(checked) => handleSystemChange("compactMode", checked)}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Show Help Tips</Label>
                          <p className="text-sm text-muted-foreground">Display helpful tooltips throughout the interface</p>
                        </div>
                        <Switch 
                          checked={systemSettings.showHelpTips}
                          onCheckedChange={(checked) => handleSystemChange("showHelpTips", checked)}
                        />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">System Control</h3>
                    <div className="grid gap-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Maintenance Mode</Label>
                          <p className="text-sm text-muted-foreground">Disable public access to the system</p>
                        </div>
                        <Switch 
                          checked={systemSettings.maintenanceMode}
                          onCheckedChange={(checked) => handleSystemChange("maintenanceMode", checked)}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Voter Registration</Label>
                          <p className="text-sm text-muted-foreground">Allow new voter registrations</p>
                        </div>
                        <Switch 
                          checked={systemSettings.registrationEnabled}
                          onCheckedChange={(checked) => handleSystemChange("registrationEnabled", checked)}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Security Settings
                  </CardTitle>
                  <CardDescription>Configure authentication and security measures</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Authentication</h3>
                    <div className="grid gap-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Require Two-Factor Authentication</Label>
                          <p className="text-sm text-muted-foreground">Force 2FA for all admin accounts</p>
                        </div>
                        <Switch 
                          checked={securitySettings.twoFactorRequired}
                          onCheckedChange={(checked) => handleSecurityChange("twoFactorRequired", checked)}
                        />
                      </div>

                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                          <Input 
                            id="sessionTimeout" 
                            type="number"
                            value={securitySettings.sessionTimeout}
                            onChange={(e) => handleSecurityChange("sessionTimeout", parseInt(e.target.value) || 30)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="passwordExpiry">Password Expiry (days)</Label>
                          <Input 
                            id="passwordExpiry" 
                            type="number"
                            value={securitySettings.passwordExpiry}
                            onChange={(e) => handleSecurityChange("passwordExpiry", parseInt(e.target.value) || 90)}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="maxLoginAttempts">Max Login Attempts</Label>
                        <Input 
                          id="maxLoginAttempts" 
                          type="number"
                          value={securitySettings.maxLoginAttempts}
                          onChange={(e) => handleSecurityChange("maxLoginAttempts", parseInt(e.target.value) || 3)}
                          className="w-32"
                        />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Security Features</h3>
                    <div className="grid gap-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>IP Whitelisting</Label>
                          <p className="text-sm text-muted-foreground">Restrict access to specific IP addresses</p>
                        </div>
                        <Switch 
                          checked={securitySettings.ipWhitelisting}
                          onCheckedChange={(checked) => handleSecurityChange("ipWhitelisting", checked)}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Audit Logging</Label>
                          <p className="text-sm text-muted-foreground">Log all admin actions and system events</p>
                        </div>
                        <Switch 
                          checked={securitySettings.auditLogging}
                          onCheckedChange={(checked) => handleSecurityChange("auditLogging", checked)}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Suspicious Activity Detection</Label>
                          <p className="text-sm text-muted-foreground">Monitor and alert on unusual patterns</p>
                        </div>
                        <Switch 
                          checked={securitySettings.suspiciousActivityDetection}
                          onCheckedChange={(checked) => handleSecurityChange("suspiciousActivityDetection", checked)}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Data Encryption</Label>
                          <p className="text-sm text-muted-foreground">Encrypt sensitive data at rest</p>
                        </div>
                        <Switch 
                          checked={securitySettings.dataEncryption}
                          onCheckedChange={(checked) => handleSecurityChange("dataEncryption", checked)}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notifications" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mail className="h-5 w-5" />
                    Notification Settings
                  </CardTitle>
                  <CardDescription>Configure system-wide notification preferences</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Notification Channels</h3>
                    <div className="grid gap-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Email Notifications</Label>
                          <p className="text-sm text-muted-foreground">Send notifications via email</p>
                        </div>
                        <Switch 
                          checked={notificationSettings.emailNotifications}
                          onCheckedChange={(checked) => handleNotificationChange("emailNotifications", checked)}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>SMS Notifications</Label>
                          <p className="text-sm text-muted-foreground">Send critical alerts via SMS</p>
                        </div>
                        <Switch 
                          checked={notificationSettings.smsNotifications}
                          onCheckedChange={(checked) => handleNotificationChange("smsNotifications", checked)}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Push Notifications</Label>
                          <p className="text-sm text-muted-foreground">Browser push notifications</p>
                        </div>
                        <Switch 
                          checked={notificationSettings.pushNotifications}
                          onCheckedChange={(checked) => handleNotificationChange("pushNotifications", checked)}
                        />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Alert Types</h3>
                    <div className="grid gap-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Security Alerts</Label>
                          <p className="text-sm text-muted-foreground">Authentication & access violations</p>
                        </div>
                        <Switch 
                          checked={notificationSettings.securityAlerts}
                          onCheckedChange={(checked) => handleNotificationChange("securityAlerts", checked)}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>System Alerts</Label>
                          <p className="text-sm text-muted-foreground">Server health & performance issues</p>
                        </div>
                        <Switch 
                          checked={notificationSettings.systemAlerts}
                          onCheckedChange={(checked) => handleNotificationChange("systemAlerts", checked)}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Election Alerts</Label>
                          <p className="text-sm text-muted-foreground">Election status & results updates</p>
                        </div>
                        <Switch 
                          checked={notificationSettings.electionAlerts}
                          onCheckedChange={(checked) => handleNotificationChange("electionAlerts", checked)}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="backup" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="h-5 w-5" />
                    Backup & Recovery
                  </CardTitle>
                  <CardDescription>Configure data backup and disaster recovery settings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Backup Configuration</h3>
                    <div className="grid gap-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Automatic Backup</Label>
                          <p className="text-sm text-muted-foreground">Enable scheduled automatic backups</p>
                        </div>
                        <Switch 
                          checked={backupSettings.automaticBackup}
                          onCheckedChange={(checked) => handleBackupChange("automaticBackup", checked)}
                        />
                      </div>

                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="backupFrequency">Backup Frequency</Label>
                          <Select value={backupSettings.backupFrequency} onValueChange={(value) => handleBackupChange("backupFrequency", value)}>
                            <SelectTrigger id="backupFrequency">
                              <SelectValue placeholder="Select frequency" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="hourly">Hourly</SelectItem>
                              <SelectItem value="daily">Daily</SelectItem>
                              <SelectItem value="weekly">Weekly</SelectItem>
                              <SelectItem value="monthly">Monthly</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="retentionPeriod">Retention Period (days)</Label>
                          <Input 
                            id="retentionPeriod" 
                            type="number"
                            value={backupSettings.retentionPeriod}
                            onChange={(e) => handleBackupChange("retentionPeriod", parseInt(e.target.value) || 30)}
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Cloud Backup</Label>
                          <p className="text-sm text-muted-foreground">Store backups in cloud storage</p>
                        </div>
                        <Switch 
                          checked={backupSettings.cloudBackup}
                          onCheckedChange={(checked) => handleBackupChange("cloudBackup", checked)}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Backup Verification</Label>
                          <p className="text-sm text-muted-foreground">Verify backup integrity automatically</p>
                        </div>
                        <Switch 
                          checked={backupSettings.backupVerification}
                          onCheckedChange={(checked) => handleBackupChange("backupVerification", checked)}
                        />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Manual Actions</h3>
                    <div className="grid gap-4 md:grid-cols-2">
                      <Button variant="outline" className="h-12">
                        <Database className="mr-2 h-4 w-4" />
                        Create Backup Now
                      </Button>
                      <Button variant="outline" className="h-12">
                        <Clock className="mr-2 h-4 w-4" />
                        View Backup History
                      </Button>
                    </div>
                  </div>

                  <Alert>
                    <Database className="h-4 w-4" />
                    <AlertTitle>Backup Status</AlertTitle>
                    <AlertDescription>
                      Last backup: {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}
                      <br />
                      Next scheduled backup: {new Date(Date.now() + 24 * 60 * 60 * 1000).toLocaleDateString()}
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  )
}

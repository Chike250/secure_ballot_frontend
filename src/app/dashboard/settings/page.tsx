"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
  ArrowLeft,
  Globe,
  Moon,
  Save,
  Sun,
  BarChart3,
  Bell,
  Check,
  FileText,
  Smartphone,
  Fingerprint,
  Laptop,
  LogOut,
  Shield,
  AlertCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useTheme } from "next-themes"
import { useLanguage, languages, type LanguageCode } from "@/lib/i18n/LanguageContext"
import { useToast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"
import { useAuthStore, useUIStore } from "@/store/useStore"
import { useUser } from "@/hooks/useUser"

export default function SettingsPage() {
  const { theme, setTheme } = useTheme()
  const { language, setLanguage, t } = useLanguage()
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const { toast } = useToast()
  const { user } = useAuthStore()
  const { isLoading, error, setError } = useUIStore()
  const { profile } = useUser()

  // Settings state
  const [settings, setSettings] = useState(() => {
    // Try to load settings from localStorage if available
    if (typeof window !== "undefined") {
      const savedSettings = localStorage.getItem("userSettings")
      if (savedSettings) {
        try {
          return JSON.parse(savedSettings)
        } catch (e) {
          console.error("Failed to parse saved settings:", e)
        }
      }
    }

    // Default settings
    return {
      language: language,
      theme: theme || "system",
      notifications: {
        email: true,
        sms: true,
        app: true,
        results: true,
        security: true,
        updates: false,
        electionReminders: true,
        votingDeadlines: true,
        newCandidates: false,
      },
      accessibility: {
        highContrast: false,
        largeText: false,
        reducedMotion: false,
        screenReader: false,
        colorBlindMode: false,
        keyboardNavigation: true,
      },
      privacy: {
        shareData: false,
        analytics: true,
        marketing: false,
        locationData: false,
        profileVisibility: "registered",
      },
      display: {
        showVoteCounts: true,
        showPercentages: true,
        defaultView: "chart",
        dataRefreshRate: "medium",
        compactMode: false,
      },
      security: {
        twoFactorAuth: false,
        biometricLogin: false,
        rememberDevice: true,
        sessionTimeout: "30min",
        loginNotifications: true,
      },
    }
  })

  // Effect to update document when accessibility settings change
  useEffect(() => {
    if (settings.accessibility.largeText) {
      document.documentElement.classList.add("text-lg")
    } else {
      document.documentElement.classList.remove("text-lg")
    }

    if (settings.accessibility.highContrast) {
      document.documentElement.classList.add("high-contrast")
    } else {
      document.documentElement.classList.remove("high-contrast")
    }

    if (settings.accessibility.reducedMotion) {
      document.documentElement.classList.add("reduce-motion")
    } else {
      document.documentElement.classList.remove("reduce-motion")
    }
  }, [settings.accessibility])

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setError(null)

    try {
      // Apply language change
      if (settings.language !== language) {
        setLanguage(settings.language as LanguageCode)
      }

      // Apply theme change
      if (settings.theme !== theme) {
        setTheme(settings.theme)
      }

      // Save settings to localStorage
      localStorage.setItem("userSettings", JSON.stringify(settings))

      // Simulate API call for other settings
      setTimeout(() => {
        setIsSaving(false)
        setSaveSuccess(true)
        toast({
          title: "Success",
          description: "Settings saved successfully",
        })
        setTimeout(() => setSaveSuccess(false), 3000)
      }, 1000)
    } catch (err) {
      setIsSaving(false)
      setError("Failed to save settings")
      toast({
        title: "Error",
        description: "Failed to save settings",
        variant: "destructive",
      })
    }
  }

  // Handle theme change
  const handleThemeChange = (value: string) => {
    setSettings({ ...settings, theme: value })
  }

  // Handle language change
  const handleLanguageChange = (value: LanguageCode) => {
    setSettings({ ...settings, language: value })
  }

  // Handle toggle changes
  const handleToggleChange = (category: string, setting: string, value: boolean) => {
    setSettings({
      ...settings,
      [category]: {
        ...settings[category as keyof typeof settings],
        [setting]: value,
      },
    })
  }

  // Handle select changes
  const handleSelectChange = (category: string, setting: string, value: string) => {
    setSettings({
      ...settings,
      [category]: {
        ...settings[category as keyof typeof settings],
        [setting]: value,
      },
    })
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

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">
            Manage your account preferences and application settings
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Badge variant="outline">
            {profile?.fullName || user?.fullName}
          </Badge>
        </div>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {saveSuccess && (
        <Alert className="mb-6 bg-green-500/10 border-green-500/20 text-green-600">
          <Check className="h-4 w-4" />
          <AlertTitle>Success</AlertTitle>
          <AlertDescription>Your settings have been saved successfully.</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="accessibility">Accessibility</TabsTrigger>
            <TabsTrigger value="privacy">Privacy</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Language & Region</CardTitle>
                <CardDescription>
                  Choose your preferred language and regional settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Language</Label>
                    <p className="text-sm text-muted-foreground">
                      Select your preferred language for the interface
                    </p>
                  </div>
                  <Select value={settings.language} onValueChange={handleLanguageChange}>
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(languages).map(([code, languageObj]) => (
                        <SelectItem key={code} value={code}>
                          <div className="flex items-center gap-2">
                            <Globe className="h-4 w-4" />
                            {languageObj.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Appearance</CardTitle>
                <CardDescription>
                  Customize the appearance of the application
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Theme</Label>
                    <p className="text-sm text-muted-foreground">
                      Choose between light, dark, or system theme
                    </p>
                  </div>
                  <RadioGroup
                    value={settings.theme}
                    onValueChange={handleThemeChange}
                    className="flex gap-6"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="light" id="light" />
                      <Label htmlFor="light" className="flex items-center gap-2">
                        <Sun className="h-4 w-4" />
                        Light
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="dark" id="dark" />
                      <Label htmlFor="dark" className="flex items-center gap-2">
                        <Moon className="h-4 w-4" />
                        Dark
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="system" id="system" />
                      <Label htmlFor="system" className="flex items-center gap-2">
                        <Laptop className="h-4 w-4" />
                        System
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Compact Mode</Label>
                    <p className="text-sm text-muted-foreground">
                      Use a more compact layout to show more content
                    </p>
                  </div>
                  <Switch
                    checked={settings.display.compactMode}
                    onCheckedChange={(checked) =>
                      handleToggleChange("display", "compactMode", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Show Vote Counts</Label>
                    <p className="text-sm text-muted-foreground">
                      Display vote counts in results
                    </p>
                  </div>
                  <Switch
                    checked={settings.display.showVoteCounts}
                    onCheckedChange={(checked) =>
                      handleToggleChange("display", "showVoteCounts", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Show Percentages</Label>
                    <p className="text-sm text-muted-foreground">
                      Display percentage values in charts
                    </p>
                  </div>
                  <Switch
                    checked={settings.display.showPercentages}
                    onCheckedChange={(checked) =>
                      handleToggleChange("display", "showPercentages", checked)
                    }
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>
                  Configure how and when you receive notifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications via email
                    </p>
                  </div>
                  <Switch
                    checked={settings.notifications.email}
                    onCheckedChange={(checked) =>
                      handleToggleChange("notifications", "email", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>SMS Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive important alerts via SMS
                    </p>
                  </div>
                  <Switch
                    checked={settings.notifications.sms}
                    onCheckedChange={(checked) =>
                      handleToggleChange("notifications", "sms", checked)
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Election Results</Label>
                    <p className="text-sm text-muted-foreground">
                      Get notified when election results are available
                    </p>
                  </div>
                  <Switch
                    checked={settings.notifications.results}
                    onCheckedChange={(checked) =>
                      handleToggleChange("notifications", "results", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Security Alerts</Label>
                    <p className="text-sm text-muted-foreground">
                      Important security notifications
                    </p>
                  </div>
                  <Switch
                    checked={settings.notifications.security}
                    onCheckedChange={(checked) =>
                      handleToggleChange("notifications", "security", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Election Reminders</Label>
                    <p className="text-sm text-muted-foreground">
                      Reminders about upcoming elections
                    </p>
                  </div>
                  <Switch
                    checked={settings.notifications.electionReminders}
                    onCheckedChange={(checked) =>
                      handleToggleChange("notifications", "electionReminders", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Voting Deadlines</Label>
                    <p className="text-sm text-muted-foreground">
                      Alerts about voting deadlines
                    </p>
                  </div>
                  <Switch
                    checked={settings.notifications.votingDeadlines}
                    onCheckedChange={(checked) =>
                      handleToggleChange("notifications", "votingDeadlines", checked)
                    }
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="accessibility" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Accessibility Options</CardTitle>
                <CardDescription>
                  Configure accessibility features to improve your experience
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>High Contrast</Label>
                    <p className="text-sm text-muted-foreground">
                      Increase contrast for better visibility
                    </p>
                  </div>
                  <Switch
                    checked={settings.accessibility.highContrast}
                    onCheckedChange={(checked) =>
                      handleToggleChange("accessibility", "highContrast", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Large Text</Label>
                    <p className="text-sm text-muted-foreground">
                      Increase text size for better readability
                    </p>
                  </div>
                  <Switch
                    checked={settings.accessibility.largeText}
                    onCheckedChange={(checked) =>
                      handleToggleChange("accessibility", "largeText", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Reduced Motion</Label>
                    <p className="text-sm text-muted-foreground">
                      Minimize animations and transitions
                    </p>
                  </div>
                  <Switch
                    checked={settings.accessibility.reducedMotion}
                    onCheckedChange={(checked) =>
                      handleToggleChange("accessibility", "reducedMotion", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Keyboard Navigation</Label>
                    <p className="text-sm text-muted-foreground">
                      Enhanced keyboard navigation support
                    </p>
                  </div>
                  <Switch
                    checked={settings.accessibility.keyboardNavigation}
                    onCheckedChange={(checked) =>
                      handleToggleChange("accessibility", "keyboardNavigation", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Color Blind Mode</Label>
                    <p className="text-sm text-muted-foreground">
                      Adjust colors for color vision deficiency
                    </p>
                  </div>
                  <Switch
                    checked={settings.accessibility.colorBlindMode}
                    onCheckedChange={(checked) =>
                      handleToggleChange("accessibility", "colorBlindMode", checked)
                    }
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="privacy" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Privacy Settings</CardTitle>
                <CardDescription>
                  Control how your data is used and shared
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Data Sharing</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow sharing anonymized data for research
                    </p>
                  </div>
                  <Switch
                    checked={settings.privacy.shareData}
                    onCheckedChange={(checked) =>
                      handleToggleChange("privacy", "shareData", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Analytics</Label>
                    <p className="text-sm text-muted-foreground">
                      Help improve the platform with usage analytics
                    </p>
                  </div>
                  <Switch
                    checked={settings.privacy.analytics}
                    onCheckedChange={(checked) =>
                      handleToggleChange("privacy", "analytics", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Marketing Communications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive updates about new features
                    </p>
                  </div>
                  <Switch
                    checked={settings.privacy.marketing}
                    onCheckedChange={(checked) =>
                      handleToggleChange("privacy", "marketing", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Location Data</Label>
                    <p className="text-sm text-muted-foreground">
                      Use location data for polling unit suggestions
                    </p>
                  </div>
                  <Switch
                    checked={settings.privacy.locationData}
                    onCheckedChange={(checked) =>
                      handleToggleChange("privacy", "locationData", checked)
                    }
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>
                  Manage your account security and authentication
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Two-Factor Authentication</Label>
                    <p className="text-sm text-muted-foreground">
                      Add an extra layer of security to your account
                    </p>
                  </div>
                  <Switch
                    checked={settings.security.twoFactorAuth}
                    onCheckedChange={(checked) =>
                      handleToggleChange("security", "twoFactorAuth", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Remember Device</Label>
                    <p className="text-sm text-muted-foreground">
                      Stay logged in on this device
                    </p>
                  </div>
                  <Switch
                    checked={settings.security.rememberDevice}
                    onCheckedChange={(checked) =>
                      handleToggleChange("security", "rememberDevice", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Login Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Get notified of login attempts
                    </p>
                  </div>
                  <Switch
                    checked={settings.security.loginNotifications}
                    onCheckedChange={(checked) =>
                      handleToggleChange("security", "loginNotifications", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Session Timeout</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically log out after inactivity
                    </p>
                  </div>
                  <Select
                    value={settings.security.sessionTimeout}
                    onValueChange={(value) =>
                      handleSelectChange("security", "sessionTimeout", value)
                    }
                  >
                    <SelectTrigger className="w-[150px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15min">15 minutes</SelectItem>
                      <SelectItem value="30min">30 minutes</SelectItem>
                      <SelectItem value="1hour">1 hour</SelectItem>
                      <SelectItem value="2hours">2 hours</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Alert>
                  <Shield className="h-4 w-4" />
                  <AlertTitle>Enhanced Security</AlertTitle>
                  <AlertDescription>
                    Your account is protected with enterprise-grade security measures including 
                    encryption, audit trails, and fraud detection.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </TabsContent>

          <div className="flex justify-end gap-4 pt-6">
            <Button variant="outline" type="button">
              Reset to Defaults
            </Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? "Saving..." : "Save Settings"}
              <Save className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </Tabs>
      </form>
    </div>
  )
}

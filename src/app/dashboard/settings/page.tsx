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
  User,
  Vote as VoteIcon,
  TrendingUp
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
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { ThemeToggle } from "@/components/theme-toggle"

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
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <Sidebar variant="inset">
          <SidebarHeader>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton size="lg" asChild>
                  <Link href="/dashboard">
                    <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                      <VoteIcon className="size-4" />
                    </div>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">
                        Voting Platform
                      </span>
                      <span className="truncate text-xs">Settings</span>
                    </div>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/dashboard">
                    <BarChart3 className="size-4" />
                    <span>Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/vote">
                    <VoteIcon className="size-4" />
                    <span>Vote</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/results">
                    <TrendingUp className="size-4" />
                    <span>Results</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/dashboard/profile">
                    <User className="size-4" />
                    <span>Profile</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive>
                  <Link href="/dashboard/settings">
                    <Shield className="size-4" />
                    <span>Settings</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <div className="flex items-center gap-2 px-2 py-1">
                    <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-muted">
                      <User className="size-4" />
                    </div>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">
                        {profile?.fullName || user?.fullName || "User"}
                      </span>
                      <span className="truncate text-xs">
                        {profile?.email || user?.email}
                      </span>
                    </div>
                  </div>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>

        <div className="flex-1">
          <header className="sticky top-0 z-50 flex h-14 items-center justify-between border-b bg-background px-2 md:px-6">
            <div className="flex items-center gap-2 min-w-0">
              <SidebarTrigger />
              <h1 className="truncate text-sm font-semibold md:text-xl">
                Settings
              </h1>
            </div>

            <div className="flex items-center gap-2">
              <ThemeToggle />
            </div>
          </header>

          <main className="flex-1 p-4 md:p-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-4 md:mb-6">
              <div>
                <p className="text-sm md:text-base text-muted-foreground">
                  Manage your account preferences and application settings
                </p>
              </div>
              
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  {profile?.fullName || user?.fullName}
                </Badge>
              </div>
            </div>

            {error && (
              <Alert variant="destructive" className="mb-4 md:mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {saveSuccess && (
              <Alert className="mb-4 md:mb-6 bg-green-500/10 border-green-500/20 text-green-600">
                <Check className="h-4 w-4" />
                <AlertTitle>Success</AlertTitle>
                <AlertDescription>Your settings have been saved successfully.</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit}>
              <Tabs defaultValue="general" className="space-y-4 md:space-y-6">
                <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 h-auto">
                  <TabsTrigger value="general" className="text-xs sm:text-sm">General</TabsTrigger>
                  <TabsTrigger value="notifications" className="text-xs sm:text-sm">Notifications</TabsTrigger>
                  <TabsTrigger value="accessibility" className="text-xs sm:text-sm">Accessibility</TabsTrigger>
                  <TabsTrigger value="privacy" className="text-xs sm:text-sm">Privacy</TabsTrigger>
                  <TabsTrigger value="security" className="text-xs sm:text-sm">Security</TabsTrigger>
                </TabsList>

                <TabsContent value="general" className="space-y-4 md:space-y-6">
                  <Card>
                    <CardHeader className="pb-3 md:pb-6">
                      <CardTitle className="text-lg md:text-xl">Language & Region</CardTitle>
                      <CardDescription className="text-sm">
                        Choose your preferred language and regional settings
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4 md:space-y-6">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="space-y-0.5 flex-1">
                          <Label className="text-sm">Language</Label>
                          <p className="text-xs md:text-sm text-muted-foreground">
                            Select your preferred language for the interface
                          </p>
                        </div>
                        <Select value={settings.language} onValueChange={handleLanguageChange}>
                          <SelectTrigger className="w-full sm:w-[200px]">
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
                    <CardHeader className="pb-3 md:pb-6">
                      <CardTitle className="text-lg md:text-xl">Appearance</CardTitle>
                      <CardDescription className="text-sm">
                        Customize the appearance of the application
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4 md:space-y-6">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="space-y-0.5 flex-1">
                          <Label className="text-sm">Theme</Label>
                          <p className="text-xs md:text-sm text-muted-foreground">
                            Choose between light, dark, or system theme
                          </p>
                        </div>
                        <RadioGroup
                          value={settings.theme}
                          onValueChange={handleThemeChange}
                          className="flex flex-col gap-3 sm:flex-row sm:gap-6"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="light" id="light" />
                            <Label htmlFor="light" className="flex items-center gap-2 text-sm">
                              <Sun className="h-4 w-4" />
                              Light
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="dark" id="dark" />
                            <Label htmlFor="dark" className="flex items-center gap-2 text-sm">
                              <Moon className="h-4 w-4" />
                              Dark
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="system" id="system" />
                            <Label htmlFor="system" className="flex items-center gap-2 text-sm">
                              <Laptop className="h-4 w-4" />
                              System
                            </Label>
                          </div>
                        </RadioGroup>
                      </div>

                      <Separator />

                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="space-y-0.5 flex-1">
                          <Label className="text-sm">Compact Mode</Label>
                          <p className="text-xs md:text-sm text-muted-foreground">
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

                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="space-y-0.5 flex-1">
                          <Label className="text-sm">Show Vote Counts</Label>
                          <p className="text-xs md:text-sm text-muted-foreground">
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

                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="space-y-0.5 flex-1">
                          <Label className="text-sm">Show Percentages</Label>
                          <p className="text-xs md:text-sm text-muted-foreground">
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

                <TabsContent value="notifications" className="space-y-4 md:space-y-6">
                  <Card>
                    <CardHeader className="pb-3 md:pb-6">
                      <CardTitle className="text-lg md:text-xl">Notification Preferences</CardTitle>
                      <CardDescription className="text-sm">
                        Configure how and when you receive notifications
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4 md:space-y-6">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="space-y-0.5 flex-1">
                          <Label className="text-sm">Email Notifications</Label>
                          <p className="text-xs md:text-sm text-muted-foreground">
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

                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="space-y-0.5 flex-1">
                          <Label className="text-sm">SMS Notifications</Label>
                          <p className="text-xs md:text-sm text-muted-foreground">
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

                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="space-y-0.5 flex-1">
                          <Label className="text-sm">Election Results</Label>
                          <p className="text-xs md:text-sm text-muted-foreground">
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

                <TabsContent value="accessibility" className="space-y-4 md:space-y-6">
                  <Card>
                    <CardHeader className="pb-3 md:pb-6">
                      <CardTitle className="text-lg md:text-xl">Accessibility Options</CardTitle>
                      <CardDescription className="text-sm">
                        Customize the interface for better accessibility
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4 md:space-y-6">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="space-y-0.5 flex-1">
                          <Label className="text-sm">High Contrast</Label>
                          <p className="text-xs md:text-sm text-muted-foreground">
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

                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="space-y-0.5 flex-1">
                          <Label className="text-sm">Large Text</Label>
                          <p className="text-xs md:text-sm text-muted-foreground">
                            Increase text size throughout the interface
                          </p>
                        </div>
                        <Switch
                          checked={settings.accessibility.largeText}
                          onCheckedChange={(checked) =>
                            handleToggleChange("accessibility", "largeText", checked)
                          }
                        />
                      </div>

                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="space-y-0.5 flex-1">
                          <Label className="text-sm">Reduced Motion</Label>
                          <p className="text-xs md:text-sm text-muted-foreground">
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

                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="space-y-0.5 flex-1">
                          <Label className="text-sm">Color Blind Mode</Label>
                          <p className="text-xs md:text-sm text-muted-foreground">
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

                <TabsContent value="privacy" className="space-y-4 md:space-y-6">
                  <Card>
                    <CardHeader className="pb-3 md:pb-6">
                      <CardTitle className="text-lg md:text-xl">Privacy Settings</CardTitle>
                      <CardDescription className="text-sm">
                        Control how your data is used and shared
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4 md:space-y-6">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="space-y-0.5 flex-1">
                          <Label className="text-sm">Data Sharing</Label>
                          <p className="text-xs md:text-sm text-muted-foreground">
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

                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="space-y-0.5 flex-1">
                          <Label className="text-sm">Analytics</Label>
                          <p className="text-xs md:text-sm text-muted-foreground">
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

                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="space-y-0.5 flex-1">
                          <Label className="text-sm">Marketing Communications</Label>
                          <p className="text-xs md:text-sm text-muted-foreground">
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

                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="space-y-0.5 flex-1">
                          <Label className="text-sm">Location Data</Label>
                          <p className="text-xs md:text-sm text-muted-foreground">
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

                <TabsContent value="security" className="space-y-4 md:space-y-6">
                  <Card>
                    <CardHeader className="pb-3 md:pb-6">
                      <CardTitle className="text-lg md:text-xl">Security Settings</CardTitle>
                      <CardDescription className="text-sm">
                        Manage your account security and authentication
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4 md:space-y-6">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="space-y-0.5 flex-1">
                          <Label className="text-sm">Two-Factor Authentication</Label>
                          <p className="text-xs md:text-sm text-muted-foreground">
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

                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="space-y-0.5 flex-1">
                          <Label className="text-sm">Remember Device</Label>
                          <p className="text-xs md:text-sm text-muted-foreground">
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

                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="space-y-0.5 flex-1">
                          <Label className="text-sm">Login Notifications</Label>
                          <p className="text-xs md:text-sm text-muted-foreground">
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

                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="space-y-0.5 flex-1">
                          <Label className="text-sm">Session Timeout</Label>
                          <p className="text-xs md:text-sm text-muted-foreground">
                            Automatically log out after inactivity
                          </p>
                        </div>
                        <Select
                          value={settings.security.sessionTimeout}
                          onValueChange={(value) =>
                            handleSelectChange("security", "sessionTimeout", value)
                          }
                        >
                          <SelectTrigger className="w-full sm:w-[150px]">
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
                        <AlertTitle className="text-sm">Enhanced Security</AlertTitle>
                        <AlertDescription className="text-sm">
                          Your account is protected with enterprise-grade security measures including 
                          encryption, audit trails, and fraud detection.
                        </AlertDescription>
                      </Alert>
                    </CardContent>
                  </Card>
                </TabsContent>

                <div className="flex flex-col gap-3 sm:flex-row sm:justify-end sm:gap-4 pt-4 md:pt-6">
                  <Button variant="outline" type="button" className="w-full sm:w-auto">
                    Reset to Defaults
                  </Button>
                  <Button type="submit" disabled={isSaving} className="w-full sm:w-auto">
                    {isSaving ? "Saving..." : "Save Settings"}
                    <Save className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </Tabs>
            </form>
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}

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
} from "lucide-react"
import { Button } from "@/src/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Label } from "@/src/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/src/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select"
import { Separator } from "@/src/components/ui/separator"
import { Switch } from "@/src/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/src/components/ui/alert"
import { useTheme } from "next-themes"
import { useLanguage, languages, type LanguageCode } from "@/lib/i18n/LanguageContext"
import { useToast } from "@/src/hooks/use-toast"
import { Badge } from "@/src/components/ui/badge"

export default function SettingsPage() {
  const { theme, setTheme } = useTheme()
  const { language, setLanguage, t } = useLanguage()
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const { toast } = useToast()

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
  }, [settings.accessibility])

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    // Apply language change
    if (settings.language !== language) {
      setLanguage(settings.language as LanguageCode)
    }

    // Apply theme change
    if (settings.theme !== theme) {
      setTheme(settings.theme)
    }

    // Apply accessibility settings
    // In a real app, these would be persisted to a backend

    // Save settings to localStorage
    localStorage.setItem("userSettings", JSON.stringify(settings))

    // Simulate API call
    setTimeout(() => {
      setIsSaving(false)
      setSaveSuccess(true)
      toast({
        title: t("common.success"),
        description: t("settings.saveSuccess"),
        variant: "success",
      })
      setTimeout(() => setSaveSuccess(false), 3000)
    }, 1000)
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

  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)
  const [biometricEnabled, setBiometricEnabled] = useState(false)
  const [rememberDevice, setRememberDevice] = useState(true)
  const [loginNotifications, setLoginNotifications] = useState(true)

  return (
    <div className="container mx-auto py-6 px-4 max-w-5xl">
      <div className="mb-6">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t("dashboard.back")}
          </Link>
        </Button>
      </div>

      <div className="mb-6">
        <h1 className="text-3xl font-bold">{t("settings.title")}</h1>
        <p className="text-muted-foreground">{t("settings.subtitle")}</p>
      </div>

      {saveSuccess && (
        <Alert className="mb-6 bg-green-500/10 border-green-500/20 text-green-600">
          <Check className="h-4 w-4" />
          <AlertTitle>{t("common.success")}</AlertTitle>
          <AlertDescription>{t("settings.saveSuccess")}</AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="general">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="general">{t("settings.tabs.general")}</TabsTrigger>
          <TabsTrigger value="notifications">{t("settings.tabs.notifications")}</TabsTrigger>
          <TabsTrigger value="accessibility">{t("settings.tabs.accessibility")}</TabsTrigger>
          <TabsTrigger value="privacy">{t("settings.tabs.privacy")}</TabsTrigger>
          <TabsTrigger value="language">{t("settings.tabs.language")}</TabsTrigger>
          <TabsTrigger value="display">{t("settings.tabs.display")}</TabsTrigger>
          <TabsTrigger value="security">{t("settings.tabs.security")}</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>{t("settings.general.title")}</CardTitle>
              <CardDescription>{t("settings.general.description")}</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit}>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="language">{t("settings.general.language.label")}</Label>
                    <Select
                      value={settings.language}
                      onValueChange={(value) => handleLanguageChange(value as LanguageCode)}
                    >
                      <SelectTrigger id="language">
                        <SelectValue placeholder={t("settings.language.selectLanguage")} />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(languages).map(([code, { name, nativeName, flag }]) => (
                          <SelectItem key={code} value={code}>
                            <span className="flex items-center gap-2">
                              <span>{flag}</span>
                              <span>{nativeName}</span>
                              <span className="text-muted-foreground">({name})</span>
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-sm text-muted-foreground">{t("settings.general.language.help")}</p>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <Label>{t("settings.general.theme.label")}</Label>
                    <RadioGroup
                      value={settings.theme}
                      onValueChange={handleThemeChange}
                      className="flex flex-col space-y-1"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="light" id="theme-light" />
                        <Label htmlFor="theme-light" className="flex items-center gap-2 cursor-pointer">
                          <Sun className="h-4 w-4" />
                          {t("settings.general.theme.light")}
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="dark" id="theme-dark" />
                        <Label htmlFor="theme-dark" className="flex items-center gap-2 cursor-pointer">
                          <Moon className="h-4 w-4" />
                          {t("settings.general.theme.dark")}
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="system" id="theme-system" />
                        <Label htmlFor="theme-system" className="flex items-center gap-2 cursor-pointer">
                          <Globe className="h-4 w-4" />
                          {t("settings.general.theme.system")}
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <Label>{t("settings.general.timeZone.label")}</Label>
                    <Select
                      defaultValue="africa-lagos"
                      onValueChange={(value) => handleSelectChange("general", "timeZone", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={t("settings.general.timeZone.label")} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="africa-lagos">Africa/Lagos (GMT+1)</SelectItem>
                        <SelectItem value="africa-abuja">Africa/Abuja (GMT+1)</SelectItem>
                        <SelectItem value="europe-london">Europe/London (GMT+0)</SelectItem>
                        <SelectItem value="america-new_york">America/New York (GMT-5)</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-sm text-muted-foreground">{t("settings.general.timeZone.help")}</p>
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>{t("settings.general.updates.label")}</Label>
                      <p className="text-sm text-muted-foreground">{t("settings.general.updates.help")}</p>
                    </div>
                    <Switch
                      checked={settings.notifications.updates}
                      onCheckedChange={(checked) => handleToggleChange("notifications", "updates", checked)}
                    />
                  </div>

                  <Button type="submit" disabled={isSaving}>
                    {isSaving ? (
                      <>
                        <span className="animate-spin mr-2">⏳</span>
                        {t("common.saving")}
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        {t("common.save")}
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="language" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>{t("settings.language.title")}</CardTitle>
              <CardDescription>{t("settings.language.description")}</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit}>
                <div className="space-y-6">
                  <RadioGroup
                    value={settings.language}
                    onValueChange={(value) => handleLanguageChange(value as LanguageCode)}
                    className="space-y-3"
                  >
                    {Object.entries(languages).map(([code, { name, nativeName, flag }]) => (
                      <div key={code} className="flex items-center space-x-2">
                        <RadioGroupItem value={code} id={`lang-${code}`} />
                        <Label htmlFor={`lang-${code}`} className="flex items-center cursor-pointer">
                          <span className="mr-2 text-lg">{flag}</span>
                          <span className="font-medium">{nativeName}</span>
                          <span className="ml-2 text-sm text-muted-foreground">({name})</span>
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>

                  <Button type="submit" disabled={isSaving}>
                    {isSaving ? (
                      <>
                        <span className="animate-spin mr-2">⏳</span>
                        {t("common.saving")}
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        {t("common.save")}
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>{t("settings.tabs.notifications")}</CardTitle>
              <CardDescription>Control how you receive updates and alerts</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit}>
                <div className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="font-medium text-lg flex items-center gap-2">
                      <Bell className="h-5 w-5" />
                      Notification Channels
                    </h3>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="flex items-center justify-between border p-4 rounded-lg">
                        <div className="space-y-0.5">
                          <Label>Email Notifications</Label>
                          <p className="text-sm text-muted-foreground">Receive updates via email</p>
                        </div>
                        <Switch
                          checked={settings.notifications.email}
                          onCheckedChange={(checked) => handleToggleChange("notifications", "email", checked)}
                        />
                      </div>

                      <div className="flex items-center justify-between border p-4 rounded-lg">
                        <div className="space-y-0.5">
                          <Label>SMS Notifications</Label>
                          <p className="text-sm text-muted-foreground">Receive updates via SMS</p>
                        </div>
                        <Switch
                          checked={settings.notifications.sms}
                          onCheckedChange={(checked) => handleToggleChange("notifications", "sms", checked)}
                        />
                      </div>

                      <div className="flex items-center justify-between border p-4 rounded-lg">
                        <div className="space-y-0.5">
                          <Label>In-App Notifications</Label>
                          <p className="text-sm text-muted-foreground">Show notifications in the app</p>
                        </div>
                        <Switch
                          checked={settings.notifications.app}
                          onCheckedChange={(checked) => handleToggleChange("notifications", "app", checked)}
                        />
                      </div>
                    </div>

                    <Separator className="my-4" />

                    <h3 className="font-medium text-lg flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Notification Types
                    </h3>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="flex items-center justify-between border p-4 rounded-lg">
                        <div className="space-y-0.5">
                          <Label>Election Results</Label>
                          <p className="text-sm text-muted-foreground">Get notified about election results</p>
                        </div>
                        <Switch
                          checked={settings.notifications.results}
                          onCheckedChange={(checked) => handleToggleChange("notifications", "results", checked)}
                        />
                      </div>

                      <div className="flex items-center justify-between border p-4 rounded-lg">
                        <div className="space-y-0.5">
                          <Label>Security Alerts</Label>
                          <p className="text-sm text-muted-foreground">Important security notifications</p>
                        </div>
                        <Switch
                          checked={settings.notifications.security}
                          onCheckedChange={(checked) => handleToggleChange("notifications", "security", checked)}
                        />
                      </div>

                      <div className="flex items-center justify-between border p-4 rounded-lg">
                        <div className="space-y-0.5">
                          <Label>Platform Updates</Label>
                          <p className="text-sm text-muted-foreground">Get notified about platform changes</p>
                        </div>
                        <Switch
                          checked={settings.notifications.updates}
                          onCheckedChange={(checked) => handleToggleChange("notifications", "updates", checked)}
                        />
                      </div>

                      <div className="flex items-center justify-between border p-4 rounded-lg">
                        <div className="space-y-0.5">
                          <Label>Election Reminders</Label>
                          <p className="text-sm text-muted-foreground">Reminders about upcoming elections</p>
                        </div>
                        <Switch
                          checked={settings.notifications.electionReminders}
                          onCheckedChange={(checked) =>
                            handleToggleChange("notifications", "electionReminders", checked)
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between border p-4 rounded-lg">
                        <div className="space-y-0.5">
                          <Label>Voting Deadlines</Label>
                          <p className="text-sm text-muted-foreground">Alerts about closing polls</p>
                        </div>
                        <Switch
                          checked={settings.notifications.votingDeadlines}
                          onCheckedChange={(checked) => handleToggleChange("notifications", "votingDeadlines", checked)}
                        />
                      </div>

                      <div className="flex items-center justify-between border p-4 rounded-lg">
                        <div className="space-y-0.5">
                          <Label>New Candidates</Label>
                          <p className="text-sm text-muted-foreground">Updates about new candidates</p>
                        </div>
                        <Switch
                          checked={settings.notifications.newCandidates}
                          onCheckedChange={(checked) => handleToggleChange("notifications", "newCandidates", checked)}
                        />
                      </div>
                    </div>
                  </div>

                  <Button type="submit" disabled={isSaving}>
                    {isSaving ? (
                      <>
                        <span className="animate-spin mr-2">⏳</span>
                        {t("common.saving")}
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        {t("common.save")}
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="accessibility" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>{t("settings.tabs.accessibility")}</CardTitle>
              <CardDescription>Customize your experience for better accessibility</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit}>
                <div className="space-y-6">
                  <div className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="flex items-center justify-between border p-4 rounded-lg">
                        <div className="space-y-0.5">
                          <Label>High Contrast Mode</Label>
                          <p className="text-sm text-muted-foreground">Increase contrast for better visibility</p>
                        </div>
                        <Switch
                          checked={settings.accessibility.highContrast}
                          onCheckedChange={(checked) => handleToggleChange("accessibility", "highContrast", checked)}
                        />
                      </div>

                      <div className="flex items-center justify-between border p-4 rounded-lg">
                        <div className="space-y-0.5">
                          <Label>Large Text</Label>
                          <p className="text-sm text-muted-foreground">Increase text size throughout the application</p>
                        </div>
                        <Switch
                          checked={settings.accessibility.largeText}
                          onCheckedChange={(checked) => handleToggleChange("accessibility", "largeText", checked)}
                        />
                      </div>

                      <div className="flex items-center justify-between border p-4 rounded-lg">
                        <div className="space-y-0.5">
                          <Label>Reduced Motion</Label>
                          <p className="text-sm text-muted-foreground">Minimize animations and motion effects</p>
                        </div>
                        <Switch
                          checked={settings.accessibility.reducedMotion}
                          onCheckedChange={(checked) => handleToggleChange("accessibility", "reducedMotion", checked)}
                        />
                      </div>

                      <div className="flex items-center justify-between border p-4 rounded-lg">
                        <div className="space-y-0.5">
                          <Label>Screen Reader Support</Label>
                          <p className="text-sm text-muted-foreground">Optimize for screen readers</p>
                        </div>
                        <Switch
                          checked={settings.accessibility.screenReader}
                          onCheckedChange={(checked) => handleToggleChange("accessibility", "screenReader", checked)}
                        />
                      </div>

                      <div className="flex items-center justify-between border p-4 rounded-lg">
                        <div className="space-y-0.5">
                          <Label>Color Blind Mode</Label>
                          <p className="text-sm text-muted-foreground">
                            Use color schemes suitable for color blindness
                          </p>
                        </div>
                        <Switch
                          checked={settings.accessibility.colorBlindMode}
                          onCheckedChange={(checked) => handleToggleChange("accessibility", "colorBlindMode", checked)}
                        />
                      </div>

                      <div className="flex items-center justify-between border p-4 rounded-lg">
                        <div className="space-y-0.5">
                          <Label>Keyboard Navigation</Label>
                          <p className="text-sm text-muted-foreground">Enhance keyboard navigation support</p>
                        </div>
                        <Switch
                          checked={settings.accessibility.keyboardNavigation}
                          onCheckedChange={(checked) =>
                            handleToggleChange("accessibility", "keyboardNavigation", checked)
                          }
                        />
                      </div>
                    </div>
                  </div>

                  <Button type="submit" disabled={isSaving}>
                    {isSaving ? (
                      <>
                        <span className="animate-spin mr-2">⏳</span>
                        {t("common.saving")}
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        {t("common.save")}
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="privacy" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>{t("settings.tabs.privacy")}</CardTitle>
              <CardDescription>Control your data and privacy preferences</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit}>
                <div className="space-y-6">
                  <div className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="flex items-center justify-between border p-4 rounded-lg">
                        <div className="space-y-0.5">
                          <Label>Share Usage Data</Label>
                          <p className="text-sm text-muted-foreground">
                            Help us improve by sharing anonymous usage data
                          </p>
                        </div>
                        <Switch
                          checked={settings.privacy.shareData}
                          onCheckedChange={(checked) => handleToggleChange("privacy", "shareData", checked)}
                        />
                      </div>

                      <div className="flex items-center justify-between border p-4 rounded-lg">
                        <div className="space-y-0.5">
                          <Label>Analytics Cookies</Label>
                          <p className="text-sm text-muted-foreground">
                            Allow analytics cookies to improve our service
                          </p>
                        </div>
                        <Switch
                          checked={settings.privacy.analytics}
                          onCheckedChange={(checked) => handleToggleChange("privacy", "analytics", checked)}
                        />
                      </div>

                      <div className="flex items-center justify-between border p-4 rounded-lg">
                        <div className="space-y-0.5">
                          <Label>Marketing Communications</Label>
                          <p className="text-sm text-muted-foreground">Receive marketing emails and updates</p>
                        </div>
                        <Switch
                          checked={settings.privacy.marketing}
                          onCheckedChange={(checked) => handleToggleChange("privacy", "marketing", checked)}
                        />
                      </div>

                      <div className="flex items-center justify-between border p-4 rounded-lg">
                        <div className="space-y-0.5">
                          <Label>Location Data</Label>
                          <p className="text-sm text-muted-foreground">Allow collection of location data</p>
                        </div>
                        <Switch
                          checked={settings.privacy.locationData}
                          onCheckedChange={(checked) => handleToggleChange("privacy", "locationData", checked)}
                        />
                      </div>
                    </div>

                    <div className="space-y-2 mt-4">
                      <Label>Profile Visibility</Label>
                      <Select
                        value={settings.privacy.profileVisibility}
                        onValueChange={(value) => handleSelectChange("privacy", "profileVisibility", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select visibility level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="public">Public (Everyone can see)</SelectItem>
                          <SelectItem value="registered">Registered Users Only</SelectItem>
                          <SelectItem value="private">Private (Only you)</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-sm text-muted-foreground">Control who can see your profile information</p>
                    </div>
                  </div>

                  <Button type="submit" disabled={isSaving}>
                    {isSaving ? (
                      <>
                        <span className="animate-spin mr-2">⏳</span>
                        {t("common.saving")}
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        {t("common.save")}
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="display" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Display Settings</CardTitle>
              <CardDescription>Customize how election data is displayed</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit}>
                <div className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="font-medium text-lg flex items-center gap-2">
                      <BarChart3 className="h-5 w-5" />
                      Data Display Preferences
                    </h3>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="flex items-center justify-between border p-4 rounded-lg">
                        <div className="space-y-0.5">
                          <Label>Show Vote Counts</Label>
                          <p className="text-sm text-muted-foreground">Display actual vote counts in results</p>
                        </div>
                        <Switch
                          checked={settings.display.showVoteCounts}
                          onCheckedChange={(checked) => handleToggleChange("display", "showVoteCounts", checked)}
                        />
                      </div>

                      <div className="flex items-center justify-between border p-4 rounded-lg">
                        <div className="space-y-0.5">
                          <Label>Show Percentages</Label>
                          <p className="text-sm text-muted-foreground">Display percentage values in results</p>
                        </div>
                        <Switch
                          checked={settings.display.showPercentages}
                          onCheckedChange={(checked) => handleToggleChange("display", "showPercentages", checked)}
                        />
                      </div>

                      <div className="flex items-center justify-between border p-4 rounded-lg">
                        <div className="space-y-0.5">
                          <Label>Compact Mode</Label>
                          <p className="text-sm text-muted-foreground">
                            Use compact layout for dense information display
                          </p>
                        </div>
                        <Switch
                          checked={settings.display.compactMode}
                          onCheckedChange={(checked) => handleToggleChange("display", "compactMode", checked)}
                        />
                      </div>
                    </div>

                    <div className="space-y-2 mt-4">
                      <Label>Default View</Label>
                      <Select
                        value={settings.display.defaultView}
                        onValueChange={(value) => handleSelectChange("display", "defaultView", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select default view" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="chart">Charts</SelectItem>
                          <SelectItem value="map">Map View</SelectItem>
                          <SelectItem value="table">Table (Detailed)</SelectItem>
                          <SelectItem value="card">Card View</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-sm text-muted-foreground">
                        Choose how election results are displayed by default
                      </p>
                    </div>

                    <div className="space-y-2 mt-4">
                      <Label>Data Refresh Rate</Label>
                      <Select
                        value={settings.display.dataRefreshRate}
                        onValueChange={(value) => handleSelectChange("display", "dataRefreshRate", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select refresh rate" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="realtime">Real-time (Live)</SelectItem>
                          <SelectItem value="fast">Fast (15 seconds)</SelectItem>
                          <SelectItem value="medium">Medium (30 seconds)</SelectItem>
                          <SelectItem value="slow">Slow (1 minute)</SelectItem>
                          <SelectItem value="manual">Manual Refresh Only</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-sm text-muted-foreground">Control how often the election data refreshes</p>
                    </div>
                  </div>

                  <Button type="submit" disabled={isSaving}>
                    {isSaving ? (
                      <>
                        <span className="animate-spin mr-2">⏳</span>
                        {t("common.saving")}
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        {t("common.save")}
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>Manage your account security preferences and authentication methods</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Two-Factor Authentication</h3>
                      <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                    </div>
                    <Switch
                      checked={twoFactorEnabled}
                      onCheckedChange={setTwoFactorEnabled}
                      aria-label="Toggle two-factor authentication"
                    />
                  </div>
                  {twoFactorEnabled && (
                    <div className="rounded-md bg-muted p-4">
                      <div className="flex items-start gap-4">
                        <div className="mt-0.5 rounded-full bg-primary/10 p-1">
                          <Smartphone className="h-4 w-4 text-primary" />
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-medium">SMS verification enabled</p>
                          <p className="text-xs text-muted-foreground">
                            A verification code will be sent to your phone when you sign in
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Biometric Login</h3>
                      <p className="text-sm text-muted-foreground">Use fingerprint or face recognition to sign in</p>
                    </div>
                    <Switch
                      checked={biometricEnabled}
                      onCheckedChange={setBiometricEnabled}
                      aria-label="Toggle biometric login"
                    />
                  </div>
                  {biometricEnabled && (
                    <div className="rounded-md bg-muted p-4">
                      <div className="flex items-start gap-4">
                        <div className="mt-0.5 rounded-full bg-primary/10 p-1">
                          <Fingerprint className="h-4 w-4 text-primary" />
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-medium">Fingerprint authentication enabled</p>
                          <p className="text-xs text-muted-foreground">
                            You can use your device's fingerprint scanner to sign in
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="font-medium">Session Management</h3>

                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="session-timeout">Session Timeout</Label>
                    <Select defaultValue="30" id="session-timeout">
                      <SelectTrigger>
                        <SelectValue placeholder="Select timeout duration" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="15">15 minutes</SelectItem>
                        <SelectItem value="30">30 minutes</SelectItem>
                        <SelectItem value="60">1 hour</SelectItem>
                        <SelectItem value="120">2 hours</SelectItem>
                        <SelectItem value="never">Never</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">
                      Your session will expire after this period of inactivity
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Remember This Device</Label>
                        <p className="text-xs text-muted-foreground">Stay signed in on this device for 30 days</p>
                      </div>
                      <Switch
                        checked={rememberDevice}
                        onCheckedChange={setRememberDevice}
                        aria-label="Remember this device"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Login Notifications</Label>
                        <p className="text-xs text-muted-foreground">
                          Get notified when someone logs into your account
                        </p>
                      </div>
                      <Switch
                        checked={loginNotifications}
                        onCheckedChange={setLoginNotifications}
                        aria-label="Login notifications"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="font-medium">Active Sessions</h3>
                <div className="space-y-4">
                  <div className="rounded-md border p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <div className="mt-0.5 rounded-full bg-primary/10 p-1">
                          <Laptop className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-medium">Current Device</p>
                            <Badge
                              variant="outline"
                              className="text-xs bg-green-500/10 text-green-500 border-green-500/20"
                            >
                              Active Now
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground">Windows 11 • Chrome • Lagos, Nigeria</p>
                          <p className="text-xs text-muted-foreground">IP: 102.89.23.xxx • Last active: Just now</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-md border p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <div className="mt-0.5 rounded-full bg-primary/10 p-1">
                          <Smartphone className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Mobile Device</p>
                          <p className="text-xs text-muted-foreground">Android 13 • Chrome • Lagos, Nigeria</p>
                          <p className="text-xs text-muted-foreground">IP: 102.89.24.xxx • Last active: 2 hours ago</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" className="text-destructive">
                        <LogOut className="mr-2 h-3 w-3" />
                        Sign Out
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

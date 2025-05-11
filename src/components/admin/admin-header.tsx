"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Bell, LogOut, Menu, Settings, User, Shield, Search } from "lucide-react"
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/src/components/ui/sheet"
import { ThemeToggle } from "@/src/components/theme-toggle"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/src/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/src/components/ui/avatar"
import { Badge } from "@/src/components/ui/badge"

export function AdminHeader() {
  const router = useRouter()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "System Update",
      message: "System will undergo maintenance in 2 hours",
      time: "10 minutes ago",
      read: false,
    },
    {
      id: 2,
      title: "New Election Created",
      message: "Gubernatorial election for Oyo State has been created",
      time: "1 hour ago",
      read: false,
    },
    {
      id: 3,
      title: "Security Alert",
      message: "Multiple failed login attempts detected",
      time: "2 hours ago",
      read: true,
    },
  ])

  const unreadCount = notifications.filter((n) => !n.read).length

  const handleLogout = () => {
    // In a real app, this would handle the logout process
    console.log("Logging out...")
    router.push("/admin/login")
  }

  const handleProfileClick = () => {
    router.push("/admin/profile")
  }

  const handleSettingsClick = () => {
    router.push("/admin/settings")
  }

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })))
  }

  const markAsRead = (id: number) => {
    setNotifications(notifications.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-between px-6">
        <div className="flex items-center gap-2 md:gap-4">
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[240px] sm:w-[300px]">
              <nav className="flex flex-col gap-4 py-4">
                <Link
                  href="/admin/dashboard"
                  className="flex items-center gap-2 px-2 py-1 text-lg font-semibold"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Shield className="h-5 w-5" />
                  <span>Secure Ballot</span>
                </Link>
                <div className="flex flex-col gap-2 px-2">
                  <Link
                    href="/admin/dashboard"
                    className="rounded-md px-2 py-1 hover:bg-muted"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/admin/elections"
                    className="rounded-md px-2 py-1 hover:bg-muted"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Elections
                  </Link>
                  <Link
                    href="/admin/voters"
                    className="rounded-md px-2 py-1 hover:bg-muted"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Voters
                  </Link>
                  <Link
                    href="/admin/security"
                    className="rounded-md px-2 py-1 hover:bg-muted"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Security
                  </Link>
                  <Link
                    href="/admin/settings"
                    className="rounded-md px-2 py-1 hover:bg-muted"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Settings
                  </Link>
                </div>
              </nav>
            </SheetContent>
          </Sheet>
          <Link href="/admin/dashboard" className="flex items-center gap-2">
            <Shield className="h-6 w-6" />
            <span className="text-lg font-bold hidden md:inline-block">Secure Ballot Admin</span>
          </Link>
        </div>

        <div className="flex-1 px-2 md:px-4 max-w-md mx-4 hidden md:block">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search elections, voters, or logs..."
              className="w-full pl-8 bg-background"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          <ThemeToggle />

          <Dialog open={isNotificationsOpen} onOpenChange={setIsNotificationsOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="sr-only">Notifications</span>
                {unreadCount > 0 && <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500"></span>}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Notifications</DialogTitle>
                <DialogDescription>You have {unreadCount} unread notifications</DialogDescription>
              </DialogHeader>
              <div className="max-h-[60vh] overflow-y-auto">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`mb-4 p-3 rounded-lg border ${notification.read ? "bg-background" : "bg-muted/50"}`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="flex justify-between items-start">
                      <h4 className="font-medium">{notification.title}</h4>
                      {!notification.read && (
                        <Badge variant="default" className="text-xs">
                          New
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                    <p className="text-xs text-muted-foreground mt-2">{notification.time}</p>
                  </div>
                ))}
              </div>
              <div className="flex justify-between mt-4">
                <Button variant="outline" size="sm" onClick={markAllAsRead}>
                  Mark all as read
                </Button>
                <Button variant="outline" size="sm">
                  View all notifications
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Admin" />
                  <AvatarFallback>JA</AvatarFallback>
                </Avatar>
                <span className="sr-only">User menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>
                <div className="flex flex-col">
                  <span>John Adebayo</span>
                  <span className="text-xs text-muted-foreground">Chief Electoral Officer</span>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleProfileClick}>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleSettingsClick}>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}

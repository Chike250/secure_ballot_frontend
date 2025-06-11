"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Users,
  Vote,
  FileText,
  Settings,
  User,
  LayoutDashboard,
  Shield,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/useStore";

const navigation = [
  {
    name: "Dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Elections",
    href: "/admin/elections",
    icon: Vote,
  },
  {
    name: "Voters",
    href: "/admin/voters",
    icon: Users,
  },
  {
    name: "Reports",
    href: "/admin/reports",
    icon: FileText,
  },
  {
    name: "Profile",
    href: "/admin/profile",
    icon: User,
  },
  {
    name: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
];

const getInitials = (name: string): string => {
  return name
    .split(" ")
    .map((part) => part.charAt(0))
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

export function AdminSidebar() {
  const pathname = usePathname();
  const { user } = useAuthStore();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div 
      className={cn(
        "flex min-h-screen flex-col bg-background border-r transition-all duration-300 ease-in-out",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      {/* Toggle Button */}
      <div className="flex justify-end p-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="h-8 w-8 hover:bg-muted"
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Admin Profile Section */}
      <div className={cn("border-b transition-all duration-300", isCollapsed ? "p-2" : "p-6 mt-4")}>
        <div className={cn("flex gap-4 transition-all duration-300", isCollapsed ? "flex-col items-center" : "flex-col items-center")}>
          <Avatar className={cn("transition-all duration-300", isCollapsed ? "h-10 w-10" : "h-16 w-16")}>
            <AvatarImage
              src={(user as any)?.profileImage || (user as any)?.avatar}
              alt={user?.fullName || "Admin"}
            />
            <AvatarFallback className={cn("bg-green-500 text-white font-semibold transition-all duration-300", isCollapsed ? "text-sm" : "text-lg")}>
              {getInitials(user?.fullName || "Admin")}
            </AvatarFallback>
          </Avatar>
          
          {!isCollapsed && (
            <div className="text-center transition-all duration-300">
              <p className="font-semibold text-sm">
                {user?.fullName || "Administrator"}
              </p>
              <div className="flex justify-center mt-2">
                <Badge
                  variant="outline"
                  className="bg-green-500/10 text-green-600 border-green-500/20 text-xs"
                >
                  <Shield className="h-3 w-3 mr-1" />
                  Admin
                </Badge>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-2">
        <ul className="space-y-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors group relative",
                    isCollapsed ? "justify-center" : "gap-3",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                  title={isCollapsed ? item.name : undefined}
                >
                  <item.icon className="h-4 w-4 flex-shrink-0" />
                  
                  {!isCollapsed && (
                    <span className="transition-all duration-300">
                      {item.name}
                    </span>
                  )}
                  
                  {/* Tooltip for collapsed state */}
                  {isCollapsed && (
                    <div className="absolute left-full ml-2 px-2 py-1 bg-background border rounded shadow-lg text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50">
                      {item.name}
                    </div>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className={cn("border-t transition-all duration-300", isCollapsed ? "p-2" : "p-4")}>
        {!isCollapsed ? (
          <div className="text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <div className="h-2 w-2 bg-green-500 rounded-full"></div>
              System Online
            </div>
          </div>
        ) : (
          <div className="flex justify-center">
            <div className="h-2 w-2 bg-green-500 rounded-full" title="System Online"></div>
          </div>
        )}
      </div>
    </div>
  );
}

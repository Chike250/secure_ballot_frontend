"use client"

import type { ReactNode } from "react"
import { SidebarProvider } from "@/components/ui/sidebar"
import { ErrorBoundary } from "@/components/error-boundary"

interface DashboardLayoutProps {
  children: ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <ErrorBoundary>
      <SidebarProvider>
        <div className="flex min-h-screen">{children}</div>
      </SidebarProvider>
    </ErrorBoundary>
  )
}

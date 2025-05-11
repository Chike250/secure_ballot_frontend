"use client"

import type { ReactNode } from "react"
import { SidebarProvider } from "@/src/components/ui/sidebar"
import { ErrorBoundary } from "@/src/components/error-boundary"

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

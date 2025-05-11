import { LoadingSpinner } from "@/src/components/loading-spinner"

export default function AdminDashboardLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <LoadingSpinner size="lg" text="Loading admin dashboard..." />
    </div>
  )
}

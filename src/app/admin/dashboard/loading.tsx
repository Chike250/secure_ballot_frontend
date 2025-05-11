import { LoadingSpinner } from "@/components/loading-spinner"

export default function AdminDashboardLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <LoadingSpinner size={24} text="Loading admin dashboard..." />
    </div>
  )
}

import { LoadingSpinner } from "@/components/loading-spinner"

export default function AdminLoginLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <LoadingSpinner size="lg" text="Loading admin portal..." />
    </div>
  )
}

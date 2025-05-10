import { Loader2 } from "lucide-react"

export default function VoteLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="flex flex-col items-center gap-2">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <h2 className="text-xl font-semibold">Loading Voting Interface...</h2>
        <p className="text-sm text-muted-foreground">Preparing a secure voting environment</p>
      </div>
    </div>
  )
}

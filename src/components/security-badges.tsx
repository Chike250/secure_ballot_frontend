import { Shield, ShieldCheck, Lock } from "lucide-react"
import { Badge } from "@/src/components/ui/badge"

export function SecurityBadges() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <Badge variant="outline" className="flex items-center gap-1 px-3 py-1">
        <ShieldCheck className="h-4 w-4 text-primary" />
        <span>INEC Certified</span>
      </Badge>
      <Badge variant="outline" className="flex items-center gap-1 px-3 py-1">
        <Shield className="h-4 w-4 text-primary" />
        <span>ECC Encryption</span>
      </Badge>
      <Badge variant="outline" className="flex items-center gap-1 px-3 py-1">
        <Lock className="h-4 w-4 text-primary" />
        <span>AES-256 Secured</span>
      </Badge>
    </div>
  )
}

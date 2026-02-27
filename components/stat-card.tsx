import { Scan, UserCheck, AlertTriangle, Activity } from "lucide-react"

const icons = {
  scan: Scan,
  user: UserCheck,
  alert: AlertTriangle,
  activity: Activity
}

export function StatCard({ title, value, icon }: any) {
  const Icon = icons[icon]

  return (
    <div className="rounded-xl border bg-card p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{title}</p>
        <Icon className="h-5 w-5 text-muted-foreground" />
      </div>

      <p className="mt-2 text-2xl font-bold text-foreground">
        {value}
      </p>
    </div>
  )
}

"use client"

import { useState } from "react"
import { UserCheck, AlertTriangle, UserX, Shield, Clock, ChevronRight, Inbox } from "lucide-react"
import { cn } from "@/lib/utils"

export interface Activity {
  id: string
  type: "authorized" | "intrusion" | "denied" | "system"
  message: string
  timestamp: string
  location: string
}

const typeConfig = {
  authorized: { icon: UserCheck, bg: "bg-mint", text: "text-success" },
  intrusion: { icon: AlertTriangle, bg: "bg-blush", text: "text-danger" },
  denied: { icon: UserX, bg: "bg-peach", text: "text-warning" },
  system: { icon: Shield, bg: "bg-lavender", text: "text-primary" },
}

interface ActivityListProps {
  activities?: Activity[]
}

export function ActivityList({ activities = [] }: ActivityListProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      <div className="p-4 border-b border-border bg-gradient-to-r from-lavender/10 via-transparent to-peach/10">
        <h3 className="font-medium text-foreground flex items-center gap-2">
          <div className="p-1.5 rounded-md bg-lavender">
            <Clock className="w-4 h-4 text-primary" />
          </div>
          Recent Activities
        </h3>
      </div>
      <div className="divide-y divide-border max-h-[500px] overflow-y-auto">
        {activities.length === 0 ? (
          <div className="p-8 text-center">
            <div className="p-3 rounded-xl bg-muted w-fit mx-auto mb-3">
              <Inbox className="w-6 h-6 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground text-sm">No recent activities</p>
            <p className="text-muted-foreground/60 text-xs mt-1">Activities will appear here once added</p>
          </div>
        ) : (
          activities.map((activity) => {
            const config = typeConfig[activity.type]
            return (
              <div key={activity.id} className="p-4 hover:bg-muted/50 transition-colors cursor-pointer group">
                <div className="flex items-start gap-3">
                  <div className={cn("p-2 rounded-lg", config.bg)}>
                    <config.icon className={cn("w-4 h-4", config.text)} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{activity.message}</p>
                    <p className="text-xs text-muted-foreground">{activity.location}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground whitespace-nowrap">{activity.timestamp}</span>
                    <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}

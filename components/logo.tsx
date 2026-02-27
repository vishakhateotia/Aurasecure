import { Shield } from "lucide-react"

interface LogoProps {
  size?: "sm" | "md" | "lg"
  showText?: boolean
}

export function Logo({ size = "md", showText = true }: LogoProps) {
  const sizeClasses = {
    sm: "w-9 h-9",
    md: "w-12 h-12",
    lg: "w-16 h-16",
  }

  const textClasses = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl",
  }

  return (
    <div className="flex items-center gap-3">
      <div className={`${sizeClasses[size]} relative`}>
        <div className="absolute inset-0 bg-primary/20 rounded-xl blur-lg" />
        <div className="relative bg-gradient-to-br from-primary to-lavender rounded-xl p-2 flex items-center justify-center shadow-md">
          <Shield className="w-full h-full text-primary-foreground" />
        </div>
      </div>
      {showText && (
        <div className="flex flex-col">
          <span className={`font-bold ${textClasses[size]} text-primary tracking-tight`}>AURA</span>
          <span className="text-xs text-muted-foreground tracking-widest uppercase">Secure</span>
        </div>
      )}
    </div>
  )
}

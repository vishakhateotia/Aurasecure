"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, Lock, Mail, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Logo } from "./logo"
import { cn } from "@/lib/utils"
import { useUser, type UserRole } from "@/lib/user-context"

type LoginType = "user" | "admin"

export function LoginForm() {
  const router = useRouter()
  const { setUser } = useUser()

  const [loginType, setLoginType] = useState<LoginType>("admin")
  const [userRole, setUserRole] = useState<UserRole>("registered")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  
  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  setIsLoading(true)

  try {
    const res = await fetch("http://localhost:5001/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    })

    const data = await res.json()

    if (!res.ok || data.status !== "login success") {
      throw new Error("Invalid credentials")
    }

    setUser({
      email,
      role: data.role,
      name: data.role === "admin" ? "Administrator" : "User",
    })

    router.push("/dashboard")
  } catch (error) {
    alert("Invalid email")
    console.error(error)
  } finally {
    setIsLoading(false)
  }
}

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-lavender/30 via-background to-mint/20">
      <div className="w-full max-w-md">
        <div className="bg-card border rounded-2xl p-8 space-y-6 shadow-lg">

          <div className="text-center space-y-3">
            <Logo size="lg" />
            <h1 className="text-2xl font-semibold">Welcome Back</h1>
            <p className="text-muted-foreground text-sm">
              Sign in to access the security control center
            </p>
          </div>

          <div className="flex gap-1 p-1 bg-muted rounded-lg">
            {["user", "admin"].map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setLoginType(type as LoginType)}
                className={cn(
                  "flex-1 py-2 rounded-md text-sm font-medium",
                  loginType === type
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground"
                )}
              >
                {type === "user" ? "User Login" : "Admin Login"}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">

            <div>
              <Label>Email</Label>
              <Input
                type="email"
                placeholder="admin@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <Label>Password</Label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="admin123"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2 text-muted-foreground"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <p className="text-center text-xs text-muted-foreground">
            Protected by AuraSecure Facial Authentication System
          </p>
        </div>
      </div>
    </div>
  )
}

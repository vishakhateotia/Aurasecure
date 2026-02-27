"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

export type UserRole = "admin" | "registered" | "guest"

interface User {
  email: string
  role: UserRole
  name: string
}

interface UserContextType {
  user: User | null
  setUser: (user: User | null) => void
  isAdmin: boolean
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  const isAdmin = user?.role === "admin"

  return <UserContext.Provider value={{ user, setUser, isAdmin }}>{children}</UserContext.Provider>
}

export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider")
  }
  return context
}

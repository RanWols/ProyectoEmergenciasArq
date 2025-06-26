"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

export interface User {
  id: string
  name: string
  email: string
  role: "administrador" | "coordinador" | "inspector" | "docente"
  department?: string
  phone?: string
  isActive: boolean
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  isLoading: boolean
  hasPermission: (permission: string) => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Mock users database
const mockUsers: (User & { password: string })[] = [
  {
    id: "1",
    name: "Ana Martínez",
    email: "ana.martinez@colegio.cl",
    password: "admin123",
    role: "administrador",
    department: "Dirección",
    phone: "+56912345678",
    isActive: true,
  },
  {
    id: "2",
    name: "Carlos Rodríguez",
    email: "carlos.rodriguez@colegio.cl",
    password: "coord123",
    role: "coordinador",
    department: "Seguridad",
    phone: "+56987654321",
    isActive: true,
  },
  {
    id: "3",
    name: "María González",
    email: "maria.gonzalez@colegio.cl",
    password: "insp123",
    role: "inspector",
    department: "Inspectoría",
    phone: "+56911111111",
    isActive: true,
  },
  {
    id: "4",
    name: "Juan Pérez",
    email: "juan.perez@colegio.cl",
    password: "doc123",
    role: "docente",
    department: "Matemáticas",
    phone: "+56922222222",
    isActive: true,
  },
]

// Role permissions
const rolePermissions = {
  administrador: ["create_alert", "resolve_alert", "view_history", "manage_users", "view_analytics"],
  coordinador: ["create_alert", "resolve_alert", "view_history", "manage_protocols"],
  inspector: ["create_alert", "resolve_alert", "view_active_alerts"],
  docente: ["create_alert", "view_active_alerts"],
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem("school_security_user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true)

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const foundUser = mockUsers.find((u) => u.email === email && u.password === password && u.isActive)

    if (foundUser) {
      const { password: _, ...userWithoutPassword } = foundUser
      setUser(userWithoutPassword)
      localStorage.setItem("school_security_user", JSON.stringify(userWithoutPassword))
      setIsLoading(false)
      return true
    }

    setIsLoading(false)
    return false
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("school_security_user")
  }

  const hasPermission = (permission: string): boolean => {
    if (!user) return false
    return rolePermissions[user.role]?.includes(permission) || false
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading, hasPermission }}>{children}</AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

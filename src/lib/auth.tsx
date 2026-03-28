"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { scheduleExpirationChecks } from "./expiration-checker"
import { createClient } from "./supabaseClient"
import { addToast } from "@/lib/toast"

interface User {
  id: string
  email: string
  name: string
  language: "en" | "rw"
  alertThresholdDays?: number
  muteNotificationsUntil?: string | null
  image?: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  register: (email: string, password: string, name: string) => Promise<boolean>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    let mounted = true

    async function getSession() {
      // Immediate check from localStorage
      const cached = localStorage.getItem("fets_user")
      if (cached && mounted) {
        setUser(JSON.parse(cached))
        setIsLoading(false)
      }

      const { data: { session }, error } = await supabase.auth.getSession()

      if (session?.user && mounted) {
        const appUser: User = {
          id: session.user.id,
          email: session.user.email || "",
          name: session.user.user_metadata?.name || session.user.email?.split("@")[0] || "",
          language: (localStorage.getItem("food-tracker-language") as "en" | "rw") || "en",
          alertThresholdDays: session.user.user_metadata?.alertThresholdDays || 3,
          muteNotificationsUntil: session.user.user_metadata?.muteNotificationsUntil || null
        }
        setUser(appUser)
        localStorage.setItem("fets_user", JSON.stringify(appUser))
        scheduleExpirationChecks(appUser)
      } else if (mounted) {
        setUser(null)
        localStorage.removeItem("fets_user")
      }
      if (mounted) setIsLoading(false)
    }

    getSession()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const appUser: User = {
          id: session.user.id,
          email: session.user.email || "",
          name: session.user.user_metadata?.name || session.user.email?.split("@")[0] || "",
          language: (localStorage.getItem("food-tracker-language") as "en" | "rw") || "en",
          alertThresholdDays: session.user.user_metadata?.alertThresholdDays || 3,
          muteNotificationsUntil: session.user.user_metadata?.muteNotificationsUntil || null
        }
        setUser(appUser)
        localStorage.setItem("fets_user", JSON.stringify(appUser))
        scheduleExpirationChecks(appUser)
      } else {
        setUser(null)
        localStorage.removeItem("fets_user")
      }
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true)
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error || !data.user) {
        console.error("Login error:", error?.message)
        addToast({ 
          title: "Login Failed", 
          description: error?.message === "Invalid login credentials" 
            ? "Incorrect email or password. Please check your credentials." 
            : error?.message || "An error occurred during login", 
          type: "error" 
        })
        setIsLoading(false)
        return false
      }

      addToast({ 
        title: "Welcome Back!", 
        description: `Successfully signed in as ${data.user.user_metadata?.name || data.user.email?.split("@")[0]}`, 
        type: "success" 
      })

      // Sync user to Prisma DB just in case they were created outside or missed sync
      try {
        const { syncUserToDatabase } = await import("@/app/actions/user")
        await syncUserToDatabase(data.user.id, data.user.email || "", data.user.user_metadata?.name, password)
      } catch (syncError) {
        console.error("Failed to sync user on login:", syncError)
      }

      setIsLoading(false)
      return true
    } catch (error) {
      console.error("Unexpected login error:", error)
      setIsLoading(false)
      return false
    }
  }

  const register = async (email: string, password: string, name: string): Promise<boolean> => {
    setIsLoading(true)
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
          },
        }
      })

      if (error) {
        console.error("Register error:", error.message)
        addToast({ title: "Registration Failed", description: error.message, type: "error" })
        setIsLoading(false)
        return false
      }

      if (!data.user) {
        addToast({ title: "Error", description: "Account creation failed. Please try again.", type: "error" })
        setIsLoading(false)
        return false
      }

      // Sync user to our Prisma Database immediately
      try {
        const { syncUserToDatabase } = await import("@/app/actions/user")
        await syncUserToDatabase(data.user.id, email, name, password)
      } catch (syncError) {
        console.error("Failed to sync user to Database:", syncError)
      }

      // If no session is returned (email confirmation still on), try one-time login
      if (!data.session) {
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        
        if (signInError) {
           // If it still fails, it's likely because email confirmation is still required
           addToast({ 
             title: "Account Created", 
             description: "Please check your email to confirm your account before logging in.", 
             type: "info" 
           })
           setIsLoading(false)
           return false
        }
      }

      addToast({ title: "Welcome!", description: "Your account has been created successfully.", type: "success" })
      setIsLoading(false)
      return true
    } catch (error) {
      console.error("Unexpected register error:", error)
      setIsLoading(false)
      return false
    }
  }


  const logout = async () => {
    setIsLoading(true)
    await supabase.auth.signOut()
    setUser(null)
    setIsLoading(false)
    window.location.href = "/"
  }

  return <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}


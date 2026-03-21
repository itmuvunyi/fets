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
          language: (localStorage.getItem("food-tracker-language") as "en" | "rw") || "en"
        }
        setUser(appUser)
        localStorage.setItem("fets_user", JSON.stringify(appUser))
        scheduleExpirationChecks(appUser.id)
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
          language: (localStorage.getItem("food-tracker-language") as "en" | "rw") || "en"
        }
        setUser(appUser)
        localStorage.setItem("fets_user", JSON.stringify(appUser))
        scheduleExpirationChecks(appUser.id)
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

      setIsLoading(false)
      
      if (error || !data.user) {
        console.error("Login error:", error?.message)
        addToast({ title: "Error", description: error?.message || "Invalid email or password", type: "error" })
        return false
      }

      addToast({ title: "Success", description: `Welcome ${data.user.user_metadata?.name || data.user.email?.split("@")[0]} to your account`, type: "success" })

      // Sync user to Prisma DB just in case they were created outside or missed sync
    try {
      const { syncUserToDatabase } = await import("@/app/actions/user")
      await syncUserToDatabase(data.user.id, data.user.email || "", "", password)
    } catch (syncError) {
        console.error("Failed to sync user on login:", syncError)
      }

      return true
    } catch (error) {
      setIsLoading(false)
      return false
    }
  }

  const register = async (email: string, password: string, name: string): Promise<boolean> => {
    setIsLoading(true)
    try {
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || window.location.origin
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
          },
          emailRedirectTo: `${siteUrl}/dashboard`, // Redirect back to dashboard after email click
        }
      })

      if (error) {
        console.error("Register error:", error.message)
        setIsLoading(false)
        return false
      }

      // Sync user to our Prisma Database immediately
      if (data.user) {
        console.log("Supabase user created, syncing to Prisma DB:", data.user.id);
        try {
          const { syncUserToDatabase } = await import("@/app/actions/user")
          const syncResult = await syncUserToDatabase(data.user.id, email, name, password)
          console.log("Sync result:", syncResult);
          if (!syncResult.success) {
             addToast({ title: "Error", description: "Account created but failed to sync to database. Please contact support.", type: "error" });
             setIsLoading(false)
             return false
          }
        } catch (syncError) {
          console.error("Failed to sync user to Database:", syncError)
        }
      }

      addToast({ title: "Success", description: "Registration successful! Welcome to your account.", type: "success" })

      // If no session is returned (email confirmation required), 
      // try to sign in immediately to support "Direct Login" requirement
      if (!data.session) {
        console.log("No session after sign up, checking direct login support...");
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        
        if (signInError) {
          console.warn("Direct login failed after sign up:", signInError.message)
        } else if (signInData.session) {
          console.log("Direct login successful after sign up");
        }
      }

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

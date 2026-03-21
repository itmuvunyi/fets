"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/lib/auth"
import { Loader2 } from "lucide-react"
import { addToast } from "@/lib/toast"
import { useRouter } from "next/navigation"

interface RegisterFormProps {
  onToggleMode: () => void
}

export function RegisterForm({ onToggleMode }: RegisterFormProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const { register, isLoading } = useAuth()
  const router = useRouter()
  
  const passwordRequirements = [
    { regex: /.{6,}/, text: "At least 6 characters" },
    { regex: /[0-9]/, text: "At least one number" },
    { regex: /[A-Z]/, text: "At least one uppercase letter" },
    { regex: /[a-z]/, text: "At least one lowercase letter" },
  ]

  const validatePassword = (pass: string) => {
    return passwordRequirements.filter(req => !req.regex.test(pass)).map(f => f.text)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!email || !password || !name || !confirmPassword) {
      setError("Please fill in all fields")
      return
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    const passwordErrors = validatePassword(password)
    if (passwordErrors.length > 0) {
      setError(`Password is too weak. Please check the requirements below.`)
      return
    }

    const success = await register(email, password, name)
    if (success) {
      addToast({
        type: "success",
        title: "Account created successfully!",
        description: `Welcome ${name}! You're being redirected to your dashboard.`,
      })
      // The auth listener in lib/auth.tsx will update the user state
      // We give it a small moment or just push to dashboard
      setTimeout(() => {
        router.push("/dashboard")
      }, 500)
    } else {
      setError("Registration failed. This might be because the account already exists or another error occurred.")
    }
  }

  return (
    <Card className="w-full max-w-md shadow-xl border-t-4 border-t-primary">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-green-500">
          Create Account
        </CardTitle>
        <CardDescription>Join us to start tracking your food and reducing waste</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              type="text"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isLoading}
              className="bg-muted/30"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="john@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              className="bg-muted/30"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              className="bg-muted/30"
            />
            {password.length > 0 && (
              <div className="pt-2 grid grid-cols-2 gap-2">
                {passwordRequirements.map((req, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <div className={`w-1.5 h-1.5 rounded-full ${req.regex.test(password) ? "bg-green-500" : "bg-muted-foreground/30"}`} />
                    <span className={`text-[10px] ${req.regex.test(password) ? "text-green-600 font-medium" : "text-muted-foreground"}`}>
                      {req.text}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={isLoading}
              className="bg-muted/30"
            />
          </div>
          {error && (
            <div className="p-3 rounded-md bg-destructive/10 border border-destructive/20">
              <p className="text-xs text-destructive font-medium">{error}</p>
            </div>
          )}
          <Button type="submit" className="w-full h-11 text-base font-semibold transition-all hover:scale-[1.02]" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating account...
              </>
            ) : (
              "Create Account"
            )}
          </Button>
        </form>
        <div className="mt-4 text-center">
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <button type="button" onClick={onToggleMode} className="text-primary hover:underline">
              Sign in
            </button>
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

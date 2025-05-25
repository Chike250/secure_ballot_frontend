"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Eye, EyeOff, AlertCircle, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { SecurityBadges } from "@/components/security-badges"
import { useAuth } from "@/hooks/useAuth"
import { useUIStore } from "@/store/useStore"

export default function AdminLoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [formTouched, setFormTouched] = useState({ email: false, password: false })
  const [emailError, setEmailError] = useState("")
  const [passwordError, setPasswordError] = useState("")
  const { adminLogin } = useAuth()
  const { isLoading, error } = useUIStore()

  // Create an effect to handle errors from the auth hook
  useEffect(() => {
    if (error) {
      if (error.includes('email') || error.includes('Email')) {
        setEmailError(error);
      } else if (error.includes('password') || error.includes('credentials')) {
        setPasswordError(error);
      }
    }
  }, [error]);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setEmail(value)
    if (!formTouched.email) setFormTouched({ ...formTouched, email: true })

    if (value.length === 0) {
      setEmailError("Email is required")
    } else if (!/\S+@\S+\.\S+/.test(value)) {
      setEmailError("Please enter a valid email address")
    } else {
      setEmailError("")
    }
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setPassword(value)
    if (!formTouched.password) setFormTouched({ ...formTouched, password: true })

    if (value.length === 0) {
      setPasswordError("Password is required")
    } else if (value.length < 8) {
      setPasswordError("Password must be at least 8 characters")
    } else {
      setPasswordError("")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Force validation
    setFormTouched({ email: true, password: true })

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setEmailError("Please enter a valid email address")
      return
    }

    if (password.length < 8) {
      setPasswordError("Password must be at least 8 characters")
      return
    }

    try {
      await adminLogin(email, password)
      // No need for redirect as the hook will handle it
    } catch (error) {
      // Error handling is done by the hook and useEffect above
      console.error('Login error:', error)
    }
  }

  const isLoginButtonDisabled = () => {
    return isLoading || !email || !/\S+@\S+\.\S+/.test(email) || password.length < 8
  }

  return (
    <div className="relative min-h-screen flex flex-col">
      {/* Background Image */}
      <div className="fixed inset-0 transition-opacity duration-500">
        <div className="absolute inset-0 bg-black/60 z-10" /> {/* Darker overlay for admin */}
        <Image
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/images-WMZghOD427VlHrTxc6lmYvrD0riE2T.jpeg"
          alt="Nigerian electoral map background"
          fill
          className="object-cover"
          priority
        />
      </div>

      <div className="container mx-auto flex max-w-md flex-1 items-center justify-center px-4 py-12 relative z-20">
        <Card className="w-full bg-background/95 shadow-lg border-opacity-50 border-green-800">
          <CardHeader className="space-y-1">
            <div className="flex items-center justify-between">
              <Link href="/" className="text-sm text-muted-foreground hover:text-primary">
                <ArrowLeft className="mr-1 inline-block h-4 w-4" />
                Back to Home
              </Link>
              <div className="bg-green-700 text-white px-2 py-1 rounded-md text-xs font-semibold flex items-center">
                <Shield className="h-3 w-3 mr-1" />
                Admin Portal
              </div>
            </div>
            <CardTitle className="text-2xl flex items-center">
              <Shield className="h-5 w-5 mr-2 text-green-600" />
              Electoral Admin Login
            </CardTitle>
            <CardDescription className="text-sm font-medium text-foreground/80">
              Secure access for election administrators only
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="admin-email" className="flex items-center justify-between">
                  <span>Admin Email</span>
                  {formTouched.email && emailError && <span className="text-xs text-destructive">Required</span>}
                </Label>
                <Input
                  id="admin-email"
                  type="email"
                  placeholder="Enter your admin email"
                  value={email}
                  onChange={handleEmailChange}
                  onBlur={() => setFormTouched({ ...formTouched, email: true })}
                  required
                  className={formTouched.email && emailError ? "border-destructive" : ""}
                />
                <div className="min-h-[20px] transition-all duration-200">
                  {formTouched.email && emailError && (
                    <p className="text-xs text-destructive flex items-center gap-1 animate-in fade-in slide-in-from-bottom-1">
                      <AlertCircle className="h-3 w-3" />
                      {emailError}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="admin-password" className="flex items-center justify-between">
                  <span>Password</span>
                  {formTouched.password && passwordError && <span className="text-xs text-destructive">Required</span>}
                </Label>
                <div className="relative">
                  <Input
                    id="admin-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={handlePasswordChange}
                    onBlur={() => setFormTouched({ ...formTouched, password: true })}
                    required
                    className={formTouched.password && passwordError ? "border-destructive" : ""}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
                <div className="min-h-[20px] transition-all duration-200">
                  {formTouched.password && passwordError && (
                    <p className="text-xs text-destructive flex items-center gap-1 animate-in fade-in slide-in-from-bottom-1">
                      <AlertCircle className="h-3 w-3" />
                      {passwordError}
                    </p>
                  )}
                </div>
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  className="w-full transition-all duration-200 bg-green-700 hover:bg-green-800"
                  disabled={isLoginButtonDisabled()}
                >
                  {isLoading ? "Authenticating..." : "Login as Administrator"}
                </Button>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col">
            <div className="mb-4 w-full">
              <SecurityBadges />
            </div>
            <p className="text-center text-xs font-medium text-muted-foreground">
              This portal is for authorized election administrators only. Unauthorized access attempts are logged and
              may be prosecuted.
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

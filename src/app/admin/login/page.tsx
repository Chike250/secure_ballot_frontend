"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Eye, EyeOff, AlertCircle, Shield } from "lucide-react"
import { Button } from "@/src/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Input } from "@/src/components/ui/input"
import { Label } from "@/src/components/ui/label"
import { SecurityBadges } from "@/src/components/security-badges"

export default function AdminLoginPage() {
  const [nin, setNin] = useState("")
  const [passkey, setPasskey] = useState("")
  const [showPasskey, setShowPasskey] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formTouched, setFormTouched] = useState({ nin: false, passkey: false })
  const [ninError, setNinError] = useState("")
  const [passkeyError, setPasskeyError] = useState("")

  const handleNinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "")
    if (value.length <= 11) {
      setNin(value)
      if (!formTouched.nin) setFormTouched({ ...formTouched, nin: true })

      if (value.length === 0) {
        setNinError("NIN is required")
      } else if (value.length !== 11) {
        setNinError("NIN must be exactly 11 digits")
      } else {
        setNinError("")
      }
    }
  }

  const handlePasskeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setPasskey(value)
    if (!formTouched.passkey) setFormTouched({ ...formTouched, passkey: true })

    if (value.length === 0) {
      setPasskeyError("Admin passkey is required")
    } else if (value.length < 8) {
      setPasskeyError("Admin passkey must be at least 8 characters")
    } else {
      setPasskeyError("")
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Force validation
    setFormTouched({ nin: true, passkey: true })

    if (nin.length !== 11) {
      setNinError("NIN must be exactly 11 digits")
      return
    }

    if (passkey.length < 8) {
      setPasskeyError("Admin passkey must be at least 8 characters")
      return
    }

    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      // Redirect to admin dashboard
      window.location.href = "/admin/dashboard"
    }, 1500)
  }

  const isLoginButtonDisabled = () => {
    return isLoading || nin.length !== 11 || passkey.length < 8
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
                <Label htmlFor="admin-nin" className="flex items-center justify-between">
                  <span>National Identification Number (NIN)</span>
                  {formTouched.nin && ninError && <span className="text-xs text-destructive">Required</span>}
                </Label>
                <Input
                  id="admin-nin"
                  placeholder="Enter your 11-digit NIN"
                  value={nin}
                  onChange={handleNinChange}
                  onBlur={() => setFormTouched({ ...formTouched, nin: true })}
                  required
                  maxLength={11}
                  className={formTouched.nin && ninError ? "border-destructive" : ""}
                />
                <div className="min-h-[20px] transition-all duration-200">
                  {formTouched.nin && ninError && (
                    <p className="text-xs text-destructive flex items-center gap-1 animate-in fade-in slide-in-from-bottom-1">
                      <AlertCircle className="h-3 w-3" />
                      {ninError}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="admin-passkey" className="flex items-center justify-between">
                  <span>Admin Passkey</span>
                  {formTouched.passkey && passkeyError && <span className="text-xs text-destructive">Required</span>}
                </Label>
                <div className="relative">
                  <Input
                    id="admin-passkey"
                    type={showPasskey ? "text" : "password"}
                    placeholder="Enter your admin passkey"
                    value={passkey}
                    onChange={handlePasskeyChange}
                    onBlur={() => setFormTouched({ ...formTouched, passkey: true })}
                    required
                    className={formTouched.passkey && passkeyError ? "border-destructive" : ""}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0"
                    onClick={() => setShowPasskey(!showPasskey)}
                  >
                    {showPasskey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
                <div className="min-h-[20px] transition-all duration-200">
                  {formTouched.passkey && passkeyError && (
                    <p className="text-xs text-destructive flex items-center gap-1 animate-in fade-in slide-in-from-bottom-1">
                      <AlertCircle className="h-3 w-3" />
                      {passkeyError}
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

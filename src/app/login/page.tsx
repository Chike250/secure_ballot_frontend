"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Eye, EyeOff, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { SecurityBadges } from "@/components/security-badges"
import { UserIdNotification } from "@/components/user-id-notification"
import { useAuth } from "@/hooks/useAuth"
import { useUIStore } from "@/store/useStore"

interface ValidationState {
  isValid: boolean
  message: string
}

export default function LoginPage() {
  const [step, setStep] = useState(1)
  const [identifier, setIdentifier] = useState("")
  const [password, setPassword] = useState("")
  const [otp, setOtp] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showUserIdNotification, setShowUserIdNotification] = useState(false)
  const [userId, setUserId] = useState("")
  const [isClient, setIsClient] = useState(false)
  const { login, verifyMFA } = useAuth()
  const { error } = useUIStore()

  // Validation states
  const [identifierValidation, setIdentifierValidation] = useState<ValidationState>({ isValid: true, message: "" })
  const [passwordValidation, setPasswordValidation] = useState<ValidationState>({ isValid: true, message: "" })
  const [otpValidation, setOtpValidation] = useState<ValidationState>({ isValid: true, message: "" })
  const [formTouched, setFormTouched] = useState({ identifier: false, password: false, otp: false })

  // Set isClient to true when component mounts
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Validate identifier (NIN or VIN)
  useEffect(() => {
    if (!formTouched.identifier) return

    if (identifier.length === 0) {
      setIdentifierValidation({ isValid: false, message: "Identifier is required" })
    } else if (identifier.length === 11 && /^\d+$/.test(identifier)) {
      // Valid NIN
      setIdentifierValidation({ isValid: true, message: "" })
    } else if (identifier.length === 19 && /^[A-Za-z0-9]+$/.test(identifier)) {
      // Valid VIN
      setIdentifierValidation({ isValid: true, message: "" })
    } else {
      setIdentifierValidation({ 
        isValid: false, 
        message: "Please enter a valid 11-digit NIN or 19-character VIN" 
      })
    }
  }, [identifier, formTouched.identifier])

  // Validate password
  useEffect(() => {
    if (!formTouched.password) return

    if (password.length === 0) {
      setPasswordValidation({ isValid: false, message: "Password is required" })
    } else if (password.length < 8) {
      setPasswordValidation({ isValid: false, message: "Password must be at least 8 characters" })
    } else {
      setPasswordValidation({ isValid: true, message: "" })
    }
  }, [password, formTouched.password])

  // Validate OTP
  useEffect(() => {
    if (!formTouched.otp) return

    if (otp.length === 0) {
      setOtpValidation({ isValid: false, message: "OTP is required" })
    } else if (otp.length !== 6) {
      setOtpValidation({ isValid: false, message: "OTP must be exactly 6 digits" })
    } else if (!/^\d+$/.test(otp)) {
      setOtpValidation({ isValid: false, message: "OTP must contain only digits" })
    } else {
      setOtpValidation({ isValid: true, message: "" })
    }
  }, [otp, formTouched.otp])

  const handleIdentifierChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^A-Za-z0-9]/g, "").toUpperCase()
    setIdentifier(value)
    if (!formTouched.identifier) setFormTouched({ ...formTouched, identifier: true })
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value)
    if (!formTouched.password) setFormTouched({ ...formTouched, password: true })
  }

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "")
    if (value.length <= 6) {
      setOtp(value)
      if (!formTouched.otp) setFormTouched({ ...formTouched, otp: true })
    }
  }

  const handleSubmitCredentials = async (e: React.FormEvent) => {
    e.preventDefault()

    // Force validation before submission
    setFormTouched({ identifier: true, password: true, otp: formTouched.otp })

    // Only proceed if both fields are valid
    if (!identifierValidation.isValid || !passwordValidation.isValid) {
      return
    }

    try {
      await login(identifier, password)
      // Skip OTP verification for now
      // setStep(2) // Commented out to skip OTP step
    } catch (error) {
      // Error is handled by useAuth hook
      console.error('Login error:', error)
    }
  }

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault()

    // Force validation before submission
    setFormTouched({ ...formTouched, otp: true })

    // Only proceed if OTP is valid
    if (!otpValidation.isValid) {
      return
    }

    try {
      const response = await verifyMFA(userId, otp)
      setShowUserIdNotification(true)
    } catch (error) {
      // Error is handled by useAuth hook
      console.error('OTP verification error:', error)
    }
  }

  const isLoginButtonDisabled = () => {
    if (!formTouched.identifier || !formTouched.password) return true
    return !identifierValidation.isValid || !passwordValidation.isValid
  }

  const isOtpButtonDisabled = () => {
    if (!formTouched.otp) return true
    return !otpValidation.isValid || otp.length !== 6
  }

  // If not client-side yet, return a minimal loading state
  if (!isClient) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse">Loading...</div>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen flex flex-col">
      {/* Background Images */}
      <div className="fixed inset-0 transition-opacity duration-500">
        <div className="absolute inset-0 bg-black/50 z-10" /> {/* Overlay */}
        <Image
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/download%20%281%29-7j13jb7g7883LxA3r7W85qdUSJS01w.jpeg"
          alt="Hand casting vote with Nigerian flag colors"
          fill
          className={`object-cover transition-opacity duration-500 ${step === 1 ? "opacity-100" : "opacity-0"}`}
          priority
        />
        <Image
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/images-WMZghOD427VlHrTxc6lmYvrD0riE2T.jpeg"
          alt="Voting illustration with Nigerian map"
          fill
          className={`object-cover transition-opacity duration-500 ${step === 2 ? "opacity-100" : "opacity-0"}`}
        />
      </div>

      <div className="container mx-auto flex max-w-md flex-1 items-center justify-center px-4 py-12 relative z-20">
        <Card className="w-full bg-background/95 shadow-lg border-opacity-50">
          <CardHeader className="space-y-1">
            <div className="flex items-center justify-between">
              <Link href="/" className="text-sm text-muted-foreground hover:text-primary">
                <ArrowLeft className="mr-1 inline-block h-4 w-4" />
                Back to Home
              </Link>
            </div>
            <CardTitle className="text-2xl">Login to Vote</CardTitle>
            <CardDescription className="text-sm font-medium text-foreground/80">
              {step === 1 ? "Enter your NIN or VIN and password to authenticate" : "Enter the OTP sent to your registered phone"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {step === 1 ? (
              <form onSubmit={handleSubmitCredentials} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="identifier" className="flex items-center justify-between">
                    <span>NIN or VIN</span>
                    {formTouched.identifier && !identifierValidation.isValid && (
                      <span className="text-xs text-destructive">Required</span>
                    )}
                  </Label>
                  <Input
                    id="identifier"
                    placeholder="Enter your NIN or VIN"
                    value={identifier}
                    onChange={handleIdentifierChange}
                    onBlur={() => setFormTouched({ ...formTouched, identifier: true })}
                    required
                    className={formTouched.identifier && !identifierValidation.isValid ? "border-destructive" : ""}
                  />
                  <div className="min-h-[20px] transition-all duration-200">
                    {formTouched.identifier && !identifierValidation.isValid && (
                      <p className="text-xs text-destructive flex items-center gap-1 animate-in fade-in slide-in-from-bottom-1">
                        <AlertCircle className="h-3 w-3" />
                        {identifierValidation.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="flex items-center justify-between">
                    <span>Password</span>
                    {formTouched.password && !passwordValidation.isValid && (
                      <span className="text-xs text-destructive">Required</span>
                    )}
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={handlePasswordChange}
                      onBlur={() => setFormTouched({ ...formTouched, password: true })}
                      required
                      className={formTouched.password && !passwordValidation.isValid ? "border-destructive" : ""}
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
                    {formTouched.password && !passwordValidation.isValid && (
                      <p className="text-xs text-destructive flex items-center gap-1 animate-in fade-in slide-in-from-bottom-1">
                        <AlertCircle className="h-3 w-3" />
                        {passwordValidation.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="pt-2">
                  <Button
                    type="submit"
                    className="w-full transition-all duration-200"
                    disabled={isLoginButtonDisabled()}
                  >
                    Continue
                  </Button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="otp" className="flex items-center justify-between">
                    <span>One-Time Password (OTP)</span>
                    {formTouched.otp && !otpValidation.isValid && (
                      <span className="text-xs text-destructive">Required</span>
                    )}
                  </Label>
                  <Input
                    id="otp"
                    placeholder="Enter 6-digit OTP"
                    value={otp}
                    onChange={handleOtpChange}
                    onBlur={() => setFormTouched({ ...formTouched, otp: true })}
                    required
                    maxLength={6}
                    className={formTouched.otp && !otpValidation.isValid ? "border-destructive" : ""}
                  />
                  <div className="min-h-[20px] transition-all duration-200">
                    {formTouched.otp && !otpValidation.isValid && (
                      <p className="text-xs text-destructive flex items-center gap-1 animate-in fade-in slide-in-from-bottom-1">
                        <AlertCircle className="h-3 w-3" />
                        {otpValidation.message}
                      </p>
                    )}
                  </div>
                  <p className="text-xs font-medium text-muted-foreground">
                    Enter the 6-digit code sent to your registered phone number
                  </p>
                </div>

                <div className="pt-2">
                  <Button type="submit" className="w-full transition-all duration-200" disabled={isOtpButtonDisabled()}>
                    Verify & Continue
                  </Button>
                </div>

                <div className="text-center text-sm">
                  <button
                    type="button"
                    className="text-primary hover:underline"
                    onClick={() => {
                      // Simulate resending OTP
                      alert("A new OTP has been sent to your registered phone number.")
                    }}
                  >
                    Resend OTP
                  </button>
                </div>
              </form>
            )}
          </CardContent>
          <CardFooter className="flex flex-col">
            <div className="mb-4 w-full">
              <SecurityBadges />
            </div>
            <p className="text-center text-xs font-medium text-muted-foreground">
              By continuing, you agree to Secure Ballot's{" "}
              <Link href="/terms" className="text-primary hover:underline font-semibold">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="text-primary hover:underline font-semibold">
                Privacy Policy
              </Link>
              .
            </p>
            <div className="w-full mt-4 pt-4 border-t">
              <Link href="/admin/login">
                <Button variant="outline" className="w-full">
                  Admin Login
                </Button>
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
      {showUserIdNotification && (
        <UserIdNotification userId={userId} onClose={() => setShowUserIdNotification(false)} />
      )}
    </div>
  )
}

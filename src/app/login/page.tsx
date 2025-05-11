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

interface ValidationState {
  isValid: boolean
  message: string
}

export default function LoginPage() {
  const [step, setStep] = useState(1)
  const [nin, setNin] = useState("")
  const [vin, setVin] = useState("")
  const [otp, setOtp] = useState("")
  const [showVin, setShowVin] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showUserIdNotification, setShowUserIdNotification] = useState(false)
  const [userId, setUserId] = useState("")
  const [isClient, setIsClient] = useState(false)

  // Validation states
  const [ninValidation, setNinValidation] = useState<ValidationState>({ isValid: true, message: "" })
  const [vinValidation, setVinValidation] = useState<ValidationState>({ isValid: true, message: "" })
  const [otpValidation, setOtpValidation] = useState<ValidationState>({ isValid: true, message: "" })
  const [formTouched, setFormTouched] = useState({ nin: false, vin: false, otp: false })

  // Set isClient to true when component mounts
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Validate NIN
  useEffect(() => {
    if (!formTouched.nin) return

    if (nin.length === 0) {
      setNinValidation({ isValid: false, message: "NIN is required" })
    } else if (nin.length !== 11) {
      setNinValidation({ isValid: false, message: "NIN must be exactly 11 digits" })
    } else if (!/^\d+$/.test(nin)) {
      setNinValidation({ isValid: false, message: "NIN must contain only digits" })
    } else {
      setNinValidation({ isValid: true, message: "" })
    }
  }, [nin, formTouched.nin])

  // Validate VIN
  useEffect(() => {
    if (!formTouched.vin) return

    if (vin.length === 0) {
      setVinValidation({ isValid: false, message: "VIN is required" })
    } else if (vin.length !== 19) {
      setVinValidation({ isValid: false, message: "VIN must be exactly 19 characters" })
    } else if (!/^[A-Za-z0-9]+$/.test(vin)) {
      setVinValidation({ isValid: false, message: "VIN must contain only letters and numbers" })
    } else {
      setVinValidation({ isValid: true, message: "" })
    }
  }, [vin, formTouched.vin])

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

  const handleNinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "")
    if (value.length <= 11) {
      setNin(value)
      if (!formTouched.nin) setFormTouched({ ...formTouched, nin: true })
    }
  }

  const handleVinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^A-Za-z0-9]/g, "").toUpperCase()
    if (value.length <= 19) {
      setVin(value)
      if (!formTouched.vin) setFormTouched({ ...formTouched, vin: true })
    }
  }

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "")
    if (value.length <= 6) {
      setOtp(value)
      if (!formTouched.otp) setFormTouched({ ...formTouched, otp: true })
    }
  }

  const handleSubmitCredentials = (e: React.FormEvent) => {
    e.preventDefault()

    // Force validation before submission
    setFormTouched({ nin: true, vin: true, otp: formTouched.otp })

    // Only proceed if both fields are valid
    if (!ninValidation.isValid || !vinValidation.isValid) {
      return
    }

    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      setStep(2)
    }, 1500)
  }

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault()

    // Force validation before submission
    setFormTouched({ ...formTouched, otp: true })

    // Only proceed if OTP is valid
    if (!otpValidation.isValid) {
      return
    }

    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)

      // Generate a unique user ID (in a real app, this would come from the server)
      const generatedUserId = `SB${Math.floor(100000 + Math.random() * 900000)}`
      setUserId(generatedUserId)
      setShowUserIdNotification(true)

      // Navigate to dashboard after a short delay
      setTimeout(() => {
        window.location.href = `/dashboard`
      }, 1000)
    }, 1500)
  }

  const isLoginButtonDisabled = () => {
    if (isLoading) return true
    if (!formTouched.nin || !formTouched.vin) return true
    return !ninValidation.isValid || !vinValidation.isValid || nin.length !== 11 || vin.length !== 19
  }

  const isOtpButtonDisabled = () => {
    if (isLoading) return true
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
              {step === 1 ? "Enter your NIN and VIN to authenticate" : "Enter the OTP sent to your registered phone"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {step === 1 ? (
              <form onSubmit={handleSubmitCredentials} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="nin" className="flex items-center justify-between">
                    <span>National Identification Number (NIN)</span>
                    {formTouched.nin && !ninValidation.isValid && (
                      <span className="text-xs text-destructive">Required</span>
                    )}
                  </Label>
                  <Input
                    id="nin"
                    placeholder="Enter your 11-digit NIN"
                    value={nin}
                    onChange={handleNinChange}
                    onBlur={() => setFormTouched({ ...formTouched, nin: true })}
                    required
                    maxLength={11}
                    className={formTouched.nin && !ninValidation.isValid ? "border-destructive" : ""}
                  />
                  <div className="min-h-[20px] transition-all duration-200">
                    {formTouched.nin && !ninValidation.isValid && (
                      <p className="text-xs text-destructive flex items-center gap-1 animate-in fade-in slide-in-from-bottom-1">
                        <AlertCircle className="h-3 w-3" />
                        {ninValidation.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="vin" className="flex items-center justify-between">
                    <span>Voter Identification Number (VIN)</span>
                    {formTouched.vin && !vinValidation.isValid && (
                      <span className="text-xs text-destructive">Required</span>
                    )}
                  </Label>
                  <div className="relative">
                    <Input
                      id="vin"
                      type={showVin ? "text" : "password"}
                      placeholder="Enter your 19-character VIN"
                      value={vin}
                      onChange={handleVinChange}
                      onBlur={() => setFormTouched({ ...formTouched, vin: true })}
                      required
                      maxLength={19}
                      className={formTouched.vin && !vinValidation.isValid ? "border-destructive" : ""}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0"
                      onClick={() => setShowVin(!showVin)}
                    >
                      {showVin ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                  <div className="min-h-[20px] transition-all duration-200">
                    {formTouched.vin && !vinValidation.isValid && (
                      <p className="text-xs text-destructive flex items-center gap-1 animate-in fade-in slide-in-from-bottom-1">
                        <AlertCircle className="h-3 w-3" />
                        {vinValidation.message}
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
                    {isLoading ? "Verifying..." : "Continue"}
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
                    {isLoading ? "Verifying..." : "Verify & Continue"}
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

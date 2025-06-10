"use client";

import type React from "react";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Eye, EyeOff, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SecurityBadges } from "@/components/security-badges";
import { UserIdNotification } from "@/components/user-id-notification";
import { useAuth } from "@/hooks/useAuth";
import { useUIStore } from "@/store/useStore";

interface ValidationState {
  isValid: boolean;
  message: string;
}

export default function LoginPage() {
  // Form states
  const [nin, setNin] = useState("");
  const [vin, setVin] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1); // 1 = credentials, 2 = OTP
  const [showVin, setShowVin] = useState(false);
  const [showUserIdNotification, setShowUserIdNotification] = useState(false);
  const [userId, setUserId] = useState("");

  // Validation states
  const [formTouched, setFormTouched] = useState({
    nin: false,
    vin: false,
    otp: false,
  });

  const {
    requestVoterLogin,
    verifyVoterOTP,
    resendVoterOTP,
    otpState,
    isLoading,
  } = useAuth();
  const { error } = useUIStore();

  // Handle otpState changes to set userId
  useEffect(() => {
    if (otpState.userId && !userId) {
      setUserId(otpState.userId);
      if (step === 2) {
        setShowUserIdNotification(true);
      }
    }
  }, [otpState.userId, userId, step]);

  // Handle error states from API
  useEffect(() => {
    if (error) {
      console.error("Auth error:", error);
      // Errors are displayed through the UI store and components
    }
  }, [error]);

  // Validation functions
  const validateNin = (value: string): ValidationState => {
    if (value.length === 0) {
      return { isValid: false, message: "NIN is required" };
    }
    if (!/^\d{11}$/.test(value)) {
      return { isValid: false, message: "NIN must be exactly 11 digits" };
    }
    return { isValid: true, message: "" };
  };

  const validateVin = (value: string): ValidationState => {
    if (value.length === 0) {
      return { isValid: false, message: "VIN is required" };
    }
    if (!/^[A-Z0-9]{19}$/.test(value.replace(/\s/g, ""))) {
      return {
        isValid: false,
        message: "VIN must be exactly 19 characters (letters and numbers)",
      };
    }
    return { isValid: true, message: "" };
  };

  const validateOtp = (value: string): ValidationState => {
    if (value.length === 0) {
      return { isValid: false, message: "OTP code is required" };
    }
    if (!/^\d{6}$/.test(value)) {
      return { isValid: false, message: "OTP must be exactly 6 digits" };
    }
    return { isValid: true, message: "" };
  };

  // Get validation states
  const ninValidation = validateNin(nin);
  const vinValidation = validateVin(vin);
  const otpValidation = validateOtp(otp);

  // Handle form changes
  const handleNinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 11);
    setNin(value);
  };

  const handleVinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, "")
      .slice(0, 19);
    setVin(value);
  };

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 6);
    setOtp(value);
  };

  // Handle form submissions
  const handleSubmitCredentials = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!ninValidation.isValid || !vinValidation.isValid) {
      setFormTouched({ ...formTouched, nin: true, vin: true });
      return;
    }

    try {
      const result = await requestVoterLogin(nin, vin);
      if (result) {
        setStep(2);
        // Set userId when available from the auth state
        if (otpState.userId) {
          setUserId(otpState.userId);
          setShowUserIdNotification(true);
        }
      }
    } catch (error) {
      console.error("Login request failed:", error);
      // The error handling is managed by the useAuth hook and useUIStore
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!otpValidation.isValid) {
      setFormTouched({ ...formTouched, otp: true });
      return;
    }

    try {
      const result = await verifyVoterOTP(otp);
      if (result) {
        // OTP verification successful - redirect will be handled by the auth hook
        console.log("OTP verification successful");
      }
    } catch (error) {
      console.error("OTP verification failed:", error);
      // The error handling is managed by the useAuth hook and useUIStore
    }
  };

  const handleResendOtp = async () => {
    try {
      const result = await resendVoterOTP();
      if (result) {
        // Clear current OTP and show success message
        setOtp("");
        setFormTouched({ ...formTouched, otp: false });
        console.log("OTP resent successfully");
      }
    } catch (error) {
      console.error("Resend OTP failed:", error);
      // The error handling is managed by the useAuth hook and useUIStore
    }
  };

  // Button disabled states
  const isLoginButtonDisabled = () => {
    return !ninValidation.isValid || !vinValidation.isValid || isLoading;
  };

  const isOtpButtonDisabled = () => {
    return !otpValidation.isValid || isLoading;
  };

  return (
    <div className="relative min-h-screen flex flex-col">
      {/* Background Images */}
      <div className="fixed inset-0 transition-opacity duration-500">
        <div className="absolute inset-0 bg-black/50 z-10" /> {/* Overlay */}
        <Image
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/download%20%281%29-7j13jb7g7883LxA3r7W85qdUSJS01w.jpeg"
          alt="Hand casting vote with Nigerian flag colors"
          fill
          className={`object-cover transition-opacity duration-500 ${
            step === 1 ? "opacity-100" : "opacity-0"
          }`}
          priority
        />
        <Image
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/images-WMZghOD427VlHrTxc6lmYvrD0riE2T.jpeg"
          alt="Voting illustration with Nigerian map"
          fill
          className={`object-cover transition-opacity duration-500 ${
            step === 2 ? "opacity-100" : "opacity-0"
          }`}
        />
      </div>

      <div className="container mx-auto flex max-w-md flex-1 items-center justify-center px-4 py-12 relative z-20">
        <Card className="w-full bg-background/95 shadow-lg border-opacity-50">
          <CardHeader className="space-y-1">
            <div className="flex items-center justify-between">
              <Link
                href="/"
                className="text-sm text-muted-foreground hover:text-primary"
              >
                <ArrowLeft className="mr-1 inline-block h-4 w-4" />
                Back to Home
              </Link>
            </div>
            <CardTitle className="text-2xl">Login to Vote</CardTitle>
            <CardDescription className="text-sm font-medium text-foreground/80">
              {step === 1
                ? "Enter your NIN and VIN to authenticate"
                : "Enter the OTP sent to your registered phone"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {step === 1 ? (
              <form onSubmit={handleSubmitCredentials} className="space-y-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="nin"
                    className="flex items-center justify-between"
                  >
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
                    className={
                      formTouched.nin && !ninValidation.isValid
                        ? "border-destructive"
                        : ""
                    }
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
                  <Label
                    htmlFor="vin"
                    className="flex items-center justify-between"
                  >
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
                      onBlur={() =>
                        setFormTouched({ ...formTouched, vin: true })
                      }
                      required
                      maxLength={19}
                      className={
                        formTouched.vin && !vinValidation.isValid
                          ? "border-destructive"
                          : ""
                      }
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0"
                      onClick={() => setShowVin(!showVin)}
                    >
                      {showVin ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
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
                  <Label
                    htmlFor="otp"
                    className="flex items-center justify-between"
                  >
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
                    className={
                      formTouched.otp && !otpValidation.isValid
                        ? "border-destructive"
                        : ""
                    }
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
                  <Button
                    type="submit"
                    className="w-full transition-all duration-200"
                    disabled={isOtpButtonDisabled()}
                  >
                    {isLoading ? "Verifying..." : "Verify & Continue"}
                  </Button>
                </div>

                <div className="text-center text-sm">
                  <button
                    type="button"
                    className="text-primary hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={handleResendOtp}
                    disabled={isLoading}
                  >
                    {isLoading ? "Sending..." : "Resend OTP"}
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
              <Link
                href="/terms"
                className="text-primary hover:underline font-semibold"
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                href="/privacy"
                className="text-primary hover:underline font-semibold"
              >
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
        <UserIdNotification
          userId={userId}
          onClose={() => setShowUserIdNotification(false)}
        />
      )}
    </div>
  );
}

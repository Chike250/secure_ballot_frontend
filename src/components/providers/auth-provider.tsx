"use client";

import { ReactNode, useEffect } from "react";
import { useAuthStore } from "@/store/useStore";
import axios from "axios";
import Cookies from "js-cookie";

interface AuthProviderProps {
  children: ReactNode;
}

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1";

// Function to clear all storage data in case of corruption
const clearAllStorageData = () => {
  try {
    // Clear all auth-related cookies
    Cookies.remove("auth-storage");
    Cookies.remove("election-storage");
    Cookies.remove("voting-storage");
    Cookies.remove("voter-storage");
    Cookies.remove("admin-storage");

    // Clear localStorage as fallback
    if (typeof window !== "undefined") {
      localStorage.removeItem("auth-storage");
      localStorage.removeItem("election-storage");
      localStorage.removeItem("voting-storage");
      localStorage.removeItem("voter-storage");
      localStorage.removeItem("admin-storage");
    }
  } catch (error) {
    console.error("Failed to clear storage data:", error);
  }
};

export function AuthProvider({ children }: AuthProviderProps) {
  const {
    token,
    user,
    isInitialized,
    setInitialized,
    validateAndSetAuth,
    logout,
  } = useAuthStore();

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // If already initialized, skip
        if (isInitialized) return;

        // If no token stored, mark as initialized and continue
        if (!token || !user) {
          setInitialized(true);
          return;
        }

        // Validate the stored token with the backend
        const response = await axios.post(
          `${API_URL}/auth/refresh-token`,
          {},
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            timeout: 10000, // 10 second timeout
          }
        );

        if (response.data.success) {
          // Token is valid, update auth state
          const { token: newToken, user: updatedUser } = response.data.data;
          validateAndSetAuth(newToken, updatedUser);
        } else {
          // Token is invalid, logout user

          logout();
        }
      } catch (error) {
        // Token validation failed, logout user
        console.error("Token validation failed:", error);

        // If it's a syntax error or parsing error, clear all storage
        if (
          error instanceof SyntaxError ||
          (error as any)?.message?.includes("Unexpected token")
        ) {
          clearAllStorageData();
        }

        logout();
      } finally {
        setInitialized(true);
      }
    };

    // Wrap in try-catch to handle any synchronous errors
    try {
      initializeAuth();
    } catch (error) {
      console.error("Auth initialization error:", error);

      // If it's a syntax error or parsing error, clear all storage
      if (
        error instanceof SyntaxError ||
        (error as any)?.message?.includes("Unexpected token")
      ) {
        clearAllStorageData();
      }

      logout();
      setInitialized(true);
    }
  }, [token, user, isInitialized, setInitialized, validateAndSetAuth, logout]);

  // Show loading state while initializing authentication
  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="text-sm text-muted-foreground">Initializing...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

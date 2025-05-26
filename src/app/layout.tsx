import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { LanguageProvider } from "@/lib/i18n/LanguageContext";
import { Toaster } from "@/components/ui/toaster";
import { StoreProvider } from "@/components/providers/store-provider";
import { AuthProvider } from "@/components/providers/auth-provider";
import { AuthDebug } from "@/components/auth-debug";
import ErrorBoundary from "@/components/error-boundary";
import { ClientErrorHandler } from "@/components/client-error-handler";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Secure Ballot - Nigeria's Secure Voting Platform",
  description:
    "Nigeria's most secure and transparent voting platform for the 2027 General Elections",
  generator: "v0.dev",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ErrorBoundary>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <StoreProvider>
              <AuthProvider>
                <LanguageProvider>
                  <ClientErrorHandler />
                  {children}
                  <Toaster />
                  <AuthDebug />
                </LanguageProvider>
              </AuthProvider>
            </StoreProvider>
          </ThemeProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}

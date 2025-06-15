"use client"

import Link from "next/link"
import { ArrowRight, BarChart3, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CountdownTimer } from "@/components/countdown-timer"
import { SecurityBadges } from "@/components/security-badges"
import { ElectionCards } from "@/components/election-cards"
import { HeroImage } from "@/components/hero-image"
import { ReviewCarousel } from "@/components/review-carousel"
import { useLanguage } from "@/lib/i18n/LanguageContext"
import { RealTimeMonitoring } from "@/components/real-time-monitoring"

export function TranslatedHomePage() {
  const { t } = useLanguage()

  return (
    <>
      {/* Hero Section */}
      <section className="hero-gradient relative overflow-hidden py-12 md:py-16 z-0">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:gap-12 md:grid-cols-2 md:items-center">
            <div className="text-center md:text-left">
              <h1 className="mb-4 text-3xl font-bold tracking-tight md:text-5xl lg:text-6xl z-0">{t("home.hero.title")}</h1>
              <p className="mb-6 text-base md:text-xl text-muted-foreground">{t("home.hero.subtitle")}</p>
              <div className="flex flex-col gap-4 sm:flex-row sm:justify-center md:justify-start">
                <Button asChild size="lg" className="gap-2">
                  <Link href="/login">
                    {t("home.hero.loginButton")}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="gap-2">
                  <Link href="/live-stats">
                    <BarChart3 className="h-4 w-4" />
                    {t("home.hero.statsButton")}
                  </Link>
                </Button>
              </div>
              <div className="mt-8">
                <SecurityBadges />
              </div>
            </div>
            <div>
              <HeroImage />
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute -bottom-16 -left-16 h-32 w-32 rounded-full bg-primary/10 blur-3xl"></div>
        <div className="absolute -right-16 top-32 h-32 w-32 rounded-full bg-primary/10 blur-3xl"></div>
      </section>

      {/* Countdown Section */}
      <section className="py-8 md:py-12">
        <div className="container mx-auto px-4">
          <div className="glassmorphism mx-auto max-w-md rounded-xl p-4 md:p-6 text-center">
            <CountdownTimer />
          </div>
        </div>
      </section>

      {/* Elections Section */}
      <section className="py-8 md:py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="mb-6 md:mb-8 text-center text-2xl md:text-3xl font-bold">{t("home.elections.title")}</h2>
          <ElectionCards />
        </div>
      </section>

      {/* Real-Time Monitoring Section */}
      <RealTimeMonitoring />

      {/* Testimonials Section */}
      <section className="py-8 md:py-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="mb-4 text-2xl md:text-3xl font-bold">{t("home.testimonials.title")}</h2>
            <p className="mx-auto mb-6 md:mb-8 max-w-2xl text-sm md:text-base text-muted-foreground">{t("home.testimonials.subtitle")}</p>
          </div>
          <ReviewCarousel />
        </div>
      </section>

      {/* Security Features Section */}
      <section className="py-8 md:py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="mb-4 text-2xl md:text-3xl font-bold">{t("home.security.title")}</h2>
            <p className="mx-auto mb-6 md:mb-8 max-w-2xl text-sm md:text-base text-muted-foreground">{t("home.security.subtitle")}</p>
          </div>

          <div className="grid gap-4 md:gap-6 md:grid-cols-3">
            <div className="glassmorphism rounded-xl p-4 md:p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <ShieldCheck className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">{t("home.security.mfa.title")}</h3>
              <p className="text-muted-foreground">{t("home.security.mfa.description")}</p>
            </div>

            <div className="glassmorphism rounded-xl p-4 md:p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <ShieldCheck className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">{t("home.security.encryption.title")}</h3>
              <p className="text-muted-foreground">{t("home.security.encryption.description")}</p>
            </div>

            <div className="glassmorphism rounded-xl p-4 md:p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <ShieldCheck className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">{t("home.security.auditLogs.title")}</h3>
              <p className="text-muted-foreground">{t("home.security.auditLogs.description")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <h3 className="mb-4 text-lg font-semibold">{t("common.appName")}</h3>
              <p className="text-sm text-muted-foreground">{t("common.tagline")}</p>
            </div>

            <div>
              <h3 className="mb-4 text-lg font-semibold">{t("nav.about")}</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/about" className="text-muted-foreground hover:text-primary">
                    {t("nav.about")}
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className="text-muted-foreground hover:text-primary">
                    {t("nav.faq")}
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-muted-foreground hover:text-primary">
                    {t("nav.contact")}
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="mb-4 text-lg font-semibold">Legal</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/privacy" className="text-muted-foreground hover:text-primary">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="text-muted-foreground hover:text-primary">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="/security" className="text-muted-foreground hover:text-primary">
                    Security
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="mb-4 text-lg font-semibold">Connect</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-primary">
                    Twitter
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-primary">
                    Facebook
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-primary">
                    Instagram
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-8 border-t pt-6 text-center text-sm text-muted-foreground">
            <p>© 2027 Secure Ballot. All rights reserved. Powered by INEC.</p>
          </div>
        </div>
      </footer>
    </>
  )
}

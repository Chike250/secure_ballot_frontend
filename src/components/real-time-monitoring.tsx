"use client"

import { useEffect, useState } from "react"
import { RefreshCw, Signal, Database, Shield, Activity, BarChart3 } from "lucide-react"
import { Button } from "@/src/components/ui/button"
import { Card, CardContent } from "@/src/components/ui/card"
import Link from "next/link"
import { motion } from "framer-motion"
import { useLanguage } from "@/lib/i18n/LanguageContext"

// Simulated live data for visual elements
const liveData = {
  totalVotes: 24567890,
  turnout: 42.8,
  updatedAt: "2 minutes ago",
  leadingParty: "APC",
  leadingPercentage: 38.2,
  secondParty: "PDP",
  secondPercentage: 31.5,
  pollingUnits: 176846,
  reportedUnits: 87234,
}

export function RealTimeMonitoring() {
  const { t } = useLanguage()
  const [isVisible, setIsVisible] = useState(false)
  const [counter, setCounter] = useState(liveData.totalVotes)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    setIsVisible(true)

    // Animated counter effect
    const interval = setInterval(() => {
      setCounter((prev) => {
        const newValue = prev + Math.floor(Math.random() * 100)
        return newValue > liveData.totalVotes + 5000 ? liveData.totalVotes : newValue
      })
    }, 2000)

    // Progress bar animation
    const progressInterval = setInterval(() => {
      setProgress((prev) => (prev >= 100 ? 0 : prev + 1))
    }, 100)

    return () => {
      clearInterval(interval)
      clearInterval(progressInterval)
    }
  }, [])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 },
    },
  }

  const pulseVariants = {
    pulse: {
      scale: [1, 1.05, 1],
      opacity: [0.7, 1, 0.7],
      transition: {
        duration: 2,
        repeat: Number.POSITIVE_INFINITY,
        repeatType: "reverse",
      },
    },
  }

  return (
    <section className="w-full py-12 md:py-24 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-background to-background/80 z-0"></div>
      <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl"></div>

      <motion.div
        className="container px-4 md:px-6 relative z-10"
        initial="hidden"
        animate={isVisible ? "visible" : "hidden"}
        variants={containerVariants}
      >
        <motion.div
          className="flex flex-col items-center justify-center space-y-4 text-center mb-12"
          variants={itemVariants}
        >
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-4">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
              >
                <RefreshCw className="h-4 w-4" />
              </motion.div>
              {t("realTimeMonitoring.liveUpdates")}
            </div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">{t("realTimeMonitoring.title")}</h2>
            <p className="max-w-[800px] mx-auto text-muted-foreground md:text-xl/relaxed">
              {t("realTimeMonitoring.subtitle")}
            </p>
          </div>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-12 lg:gap-12">
          {/* Left column - How it works */}
          <motion.div className="md:col-span-5 space-y-6" variants={itemVariants}>
            <h3 className="text-2xl font-bold">{t("realTimeMonitoring.howItWorks.title")}</h3>
            <p className="text-muted-foreground">{t("realTimeMonitoring.howItWorks.description")}</p>

            <div className="grid gap-6 mt-6">
              <motion.div
                className="flex items-start gap-4 group"
                variants={itemVariants}
                whileHover={{ x: 5, transition: { type: "spring", stiffness: 300 } }}
              >
                <div className="rounded-full p-3 bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                  <Signal className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-semibold">{t("realTimeMonitoring.howItWorks.secureData.title")}</h4>
                  <p className="text-sm text-muted-foreground">
                    {t("realTimeMonitoring.howItWorks.secureData.description")}
                  </p>
                </div>
              </motion.div>

              <motion.div
                className="flex items-start gap-4 group"
                variants={itemVariants}
                whileHover={{ x: 5, transition: { type: "spring", stiffness: 300 } }}
              >
                <div className="rounded-full p-3 bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                  <Database className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-semibold">{t("realTimeMonitoring.howItWorks.realTimeProcessing.title")}</h4>
                  <p className="text-sm text-muted-foreground">
                    {t("realTimeMonitoring.howItWorks.realTimeProcessing.description")}
                  </p>
                </div>
              </motion.div>

              <motion.div
                className="flex items-start gap-4 group"
                variants={itemVariants}
                whileHover={{ x: 5, transition: { type: "spring", stiffness: 300 } }}
              >
                <div className="rounded-full p-3 bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                  <Activity className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-semibold">{t("realTimeMonitoring.howItWorks.continuousUpdates.title")}</h4>
                  <p className="text-sm text-muted-foreground">
                    {t("realTimeMonitoring.howItWorks.continuousUpdates.description")}
                  </p>
                </div>
              </motion.div>

              <motion.div
                className="flex items-start gap-4 group"
                variants={itemVariants}
                whileHover={{ x: 5, transition: { type: "spring", stiffness: 300 } }}
              >
                <div className="rounded-full p-3 bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                  <Shield className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-semibold">{t("realTimeMonitoring.howItWorks.verifiedResults.title")}</h4>
                  <p className="text-sm text-muted-foreground">
                    {t("realTimeMonitoring.howItWorks.verifiedResults.description")}
                  </p>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Right column - Live data visualization */}
          <motion.div className="md:col-span-7" variants={itemVariants}>
            <Card className="overflow-hidden border-2 border-primary/10 bg-background/50 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <motion.div
                      className="h-3 w-3 rounded-full bg-green-500"
                      variants={pulseVariants}
                      animate="pulse"
                    />
                    <span className="text-sm font-medium">{t("realTimeMonitoring.liveData")}</span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {t("realTimeMonitoring.lastUpdated")}: {liveData.updatedAt}
                  </div>
                </div>

                <div className="grid gap-6 sm:grid-cols-2">
                  <motion.div className="space-y-2" variants={itemVariants}>
                    <div className="text-sm font-medium text-muted-foreground">
                      {t("realTimeMonitoring.totalVotes")}
                    </div>
                    <div className="text-3xl font-bold">{counter.toLocaleString()}</div>
                    <div className="h-2 w-full bg-muted overflow-hidden rounded-full">
                      <motion.div
                        className="h-full bg-primary"
                        initial={{ width: 0 }}
                        animate={{ width: `${liveData.turnout}%` }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                      />
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {liveData.turnout}% {t("realTimeMonitoring.voterTurnout")}
                    </div>
                  </motion.div>

                  <motion.div className="space-y-2" variants={itemVariants}>
                    <div className="text-sm font-medium text-muted-foreground">
                      {t("realTimeMonitoring.leadingParty")}
                    </div>
                    <div className="flex items-end gap-2">
                      <div className="text-3xl font-bold">{liveData.leadingParty}</div>
                      <div className="text-xl font-semibold text-muted-foreground">{liveData.leadingPercentage}%</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-sm">{liveData.secondParty}</div>
                      <div className="h-2 w-full bg-muted overflow-hidden rounded-full">
                        <motion.div
                          className="h-full bg-blue-500"
                          initial={{ width: 0 }}
                          animate={{ width: `${liveData.secondPercentage * 2}px` }}
                          transition={{ duration: 1.5, ease: "easeOut" }}
                        />
                      </div>
                      <div className="text-sm">{liveData.secondPercentage}%</div>
                    </div>
                  </motion.div>
                </div>

                <motion.div className="mt-6 pt-6 border-t" variants={itemVariants}>
                  <div className="flex justify-between items-center mb-2">
                    <div className="text-sm font-medium">{t("realTimeMonitoring.pollingUnitsReporting")}</div>
                    <div className="text-sm font-medium">
                      {Math.round((liveData.reportedUnits / liveData.pollingUnits) * 100)}%
                    </div>
                  </div>
                  <div className="h-2 w-full bg-muted overflow-hidden rounded-full">
                    <motion.div
                      className="h-full bg-primary"
                      style={{ width: `${(liveData.reportedUnits / liveData.pollingUnits) * 100}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <div>
                      {liveData.reportedUnits.toLocaleString()} {t("realTimeMonitoring.reported")}
                    </div>
                    <div>
                      {liveData.pollingUnits.toLocaleString()} {t("realTimeMonitoring.total")}
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  className="mt-8 flex justify-center"
                  variants={itemVariants}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button asChild size="lg" className="gap-2 px-8">
                    <Link href="/live-stats">
                      <BarChart3 className="h-4 w-4" />
                      {t("realTimeMonitoring.viewDetailedStats")}
                    </Link>
                  </Button>
                </motion.div>
              </CardContent>
            </Card>

            {/* Live activity indicator */}
            <motion.div
              className="mt-4 flex items-center justify-center gap-2 text-sm text-muted-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              <div className="relative">
                <div className="absolute -inset-0.5 rounded-full bg-green-500 blur-sm opacity-70"></div>
                <div className="relative h-2 w-2 rounded-full bg-green-500"></div>
              </div>
              <span>
                {Math.floor(Math.random() * 1000) + 5000} {t("realTimeMonitoring.usersMonitoring")}
              </span>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  )
}

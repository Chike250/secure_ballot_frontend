"use client"

import { useEffect, useState } from "react"
import { useLanguage } from "@/lib/i18n/LanguageContext"

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

export function CountdownTimer() {
  const { t } = useLanguage()

  // Set election end date to 3 weeks from now
  const calculateEndDate = () => {
    const now = new Date()
    const endDate = new Date(now)
    endDate.setDate(now.getDate() + 21) // 3 weeks = 21 days
    return endDate.getTime()
  }

  const [electionEndDate, setElectionEndDate] = useState(calculateEndDate())
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  useEffect(() => {
    // Set the initial end date when component mounts
    setElectionEndDate(calculateEndDate())
  }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime()
      const distance = electionEndDate - now

      if (distance < 0) {
        clearInterval(timer)
        setTimeLeft({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
        })
        return
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24))
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((distance % (1000 * 60)) / 1000)

      setTimeLeft({ days, hours, minutes, seconds })
    }, 1000)

    return () => clearInterval(timer)
  }, [electionEndDate])

  return (
    <div className="flex flex-col items-center">
      <h3 className="mb-4 text-lg font-semibold">{t("home.countdown.title")}</h3>
      <div className="flex gap-2">
        <div className="countdown-item">
          <span className="text-xl font-bold">{timeLeft.days}</span>
          <span className="text-xs">{t("home.countdown.days")}</span>
        </div>
        <div className="countdown-item">
          <span className="text-xl font-bold">{timeLeft.hours}</span>
          <span className="text-xs">{t("home.countdown.hours")}</span>
        </div>
        <div className="countdown-item">
          <span className="text-xl font-bold">{timeLeft.minutes}</span>
          <span className="text-xs">{t("home.countdown.mins")}</span>
        </div>
        <div className="countdown-item">
          <span className="text-xl font-bold">{timeLeft.seconds}</span>
          <span className="text-xs">{t("home.countdown.secs")}</span>
        </div>
      </div>
      <p className="mt-4 text-sm text-muted-foreground">{t("home.countdown.period")}</p>
    </div>
  )
}

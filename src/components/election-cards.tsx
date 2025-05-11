"use client"

import Link from "next/link"
import { Users, Building2, LandPlot, GraduationCap } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Button } from "@/src/components/ui/button"
import { useLanguage } from "@/lib/i18n/LanguageContext"
import { memo } from "react"

// Calculate the presidential and senatorial election date (February 25, 2027)
const calculatePresidentialDate = () => {
  return "February 25, 2027"
}

// Calculate the gubernatorial and house of reps election date (March 25, 2027)
const calculateGubernatorialDate = () => {
  return "March 25, 2027"
}

// Memoize the election card to prevent unnecessary re-renders
const ElectionCard = memo(({ election }: { election: any }) => (
  <Card key={election.id} className="election-card">
    <CardHeader className="pb-2">
      <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
        <election.icon className="h-6 w-6 text-primary" />
      </div>
      <CardTitle className="text-lg">{election.title}</CardTitle>
      <CardDescription>{election.description}</CardDescription>
    </CardHeader>
    <CardContent>
      <p className="text-sm">
        <span className="font-medium">{election.date}</span>
      </p>
    </CardContent>
    <CardFooter>
      <Button asChild variant="outline" className="w-full">
        <Link href={`/login?election=${election.id}`}>{election.buttonText}</Link>
      </Button>
    </CardFooter>
  </Card>
))

ElectionCard.displayName = "ElectionCard"

export function ElectionCards() {
  const { t } = useLanguage()

  const elections = [
    {
      id: "presidential",
      title: t("home.elections.presidential.title"),
      description: t("home.elections.presidential.description"),
      icon: Users,
      date: `${t("home.elections.votingPeriod")} (${calculatePresidentialDate()})`,
      buttonText: t("home.elections.voteNow"),
    },
    {
      id: "gubernatorial",
      title: t("home.elections.gubernatorial.title"),
      description: t("home.elections.gubernatorial.description"),
      icon: Building2,
      date: `${t("home.elections.votingPeriod")} (${calculateGubernatorialDate()})`,
      buttonText: t("home.elections.voteNow"),
    },
    {
      id: "house-of-reps",
      title: t("home.elections.houseOfReps.title"),
      description: t("home.elections.houseOfReps.description"),
      icon: LandPlot,
      date: `${t("home.elections.votingPeriod")} (${calculateGubernatorialDate()})`,
      buttonText: t("home.elections.voteNow"),
    },
    {
      id: "senatorial",
      title: t("home.elections.senatorial.title"),
      description: t("home.elections.senatorial.description"),
      icon: GraduationCap,
      date: `${t("home.elections.votingPeriod")} (${calculatePresidentialDate()})`,
      buttonText: t("home.elections.voteNow"),
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {elections.map((election) => (
        <ElectionCard key={election.id} election={election} />
      ))}
    </div>
  )
}

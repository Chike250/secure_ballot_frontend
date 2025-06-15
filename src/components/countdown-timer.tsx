"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { publicAPI } from "@/services/api";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

interface PresidentialElection {
  id: string;
  electionName: string;
  electionType: string;
  startDate: string;
  endDate: string;
  status: string;
}

export function CountdownTimer() {
  const { t } = useLanguage();

  const [presidentialElection, setPresidentialElection] =
    useState<PresidentialElection | null>(null);
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [countdownTarget, setCountdownTarget] = useState<"start" | "end">(
    "start"
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch presidential election from public API
  useEffect(() => {
    const fetchPresidentialElection = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Fetch active elections from public API
        const response = await publicAPI.getElections(
          "active",
          "Presidential",
          1,
          10
        );

        if (response.success && response.data?.elections) {
          const elections = response.data.elections;

          // Find presidential election
          const presidential = elections.find((election: any) => {
            const electionType = election.electionType || "";
            return electionType.toLowerCase() === "presidential";
          });

          if (presidential && presidential.startDate && presidential.endDate) {
            setPresidentialElection(presidential);
          } else {
            setError("No presidential election scheduled");
          }
        } else {
          setError("Unable to load election data");
        }
      } catch (error: any) {
        console.error("Error fetching presidential election:", error);
        setError("Failed to load election information");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPresidentialElection();
  }, []);

  // Calculate countdown target based on election status
  useEffect(() => {
    if (!presidentialElection) return;

    const now = new Date();
    const startDate = new Date(presidentialElection.startDate);
    const endDate = new Date(presidentialElection.endDate);

    // If election hasn't started yet, countdown to start
    if (now < startDate) {
      setCountdownTarget("start");
    }
    // If election is ongoing, countdown to end
    else if (now >= startDate && now < endDate) {
      setCountdownTarget("end");
    }
  }, [presidentialElection]);

  // Main countdown timer effect
  useEffect(() => {
    if (!presidentialElection) return;

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const targetDate =
        countdownTarget === "start"
          ? new Date(presidentialElection.startDate).getTime()
          : new Date(presidentialElection.endDate).getTime();

      const distance = targetDate - now;

      if (distance < 0) {
        clearInterval(timer);
        setTimeLeft({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
        });
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
    }, 1000);

    return () => clearInterval(timer);
  }, [presidentialElection, countdownTarget]);

  // Show loading state while elections are being fetched
  if (isLoading) {
    return (
      <div className="flex flex-col items-center space-y-4">
        <h3 className="text-lg font-semibold text-foreground">
          {t("home.countdown.title")}
        </h3>
        <div className="animate-pulse">
          <div className="flex items-center justify-center gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex flex-col items-center text-center">
                <div className="h-8 w-8 bg-muted rounded mb-1"></div>
                <div className="h-3 w-12 bg-muted rounded"></div>
              </div>
            ))}
          </div>
        </div>
        <p className="text-sm text-muted-foreground text-center">
          Loading election data...
        </p>
      </div>
    );
  }

  // Show error message if API call failed
  if (error) {
    return (
      <div className="flex flex-col items-center space-y-4">
        <h3 className="text-lg font-semibold text-foreground">
          {t("home.countdown.title")}
        </h3>
        <p className="text-sm text-muted-foreground text-center">{error}</p>
      </div>
    );
  }

  // Show message if no presidential election found
  if (!presidentialElection) {
    return (
      <div className="flex flex-col items-center space-y-4">
        <h3 className="text-lg font-semibold text-foreground">
          {t("home.countdown.title")}
        </h3>
        <p className="text-sm text-muted-foreground text-center">
          No presidential election scheduled
        </p>
      </div>
    );
  }

  // Check if election has ended
  const now = new Date();
  const endDate = new Date(presidentialElection.endDate);
  const hasEnded = now > endDate;

  if (hasEnded) {
    return (
      <div className="flex flex-col items-center space-y-4">
        <h3 className="text-lg font-semibold text-foreground">
          Presidential Election
        </h3>
        <div className="text-center">
          <p className="text-lg font-semibold text-green-600 mb-2">
            Election Completed
          </p>
          <p className="text-sm text-muted-foreground">
            {presidentialElection.electionName}
          </p>
          <p className="text-xs text-muted-foreground">
            Ended on {endDate.toLocaleDateString()}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center space-y-4">
      <h3 className="text-lg font-semibold text-foreground">
        {presidentialElection.electionName || "Presidential Election"}
      </h3>

      <div className="flex items-center justify-center gap-4">
        <div className="flex flex-col items-center text-center">
          <div className="text-2xl font-bold text-primary">{timeLeft.days}</div>
          <div className="text-xs text-muted-foreground uppercase tracking-wide">
            {t("home.countdown.days")}
          </div>
        </div>

        <div className="flex flex-col items-center text-center">
          <div className="text-2xl font-bold text-primary">
            {timeLeft.hours}
          </div>
          <div className="text-xs text-muted-foreground uppercase tracking-wide">
            {t("home.countdown.hours")}
          </div>
        </div>

        <div className="flex flex-col items-center text-center">
          <div className="text-2xl font-bold text-primary">
            {timeLeft.minutes}
          </div>
          <div className="text-xs text-muted-foreground uppercase tracking-wide">
            {t("home.countdown.minutes")}
          </div>
        </div>

        <div className="flex flex-col items-center text-center">
          <div className="text-2xl font-bold text-primary">
            {timeLeft.seconds}
          </div>
          <div className="text-xs text-muted-foreground uppercase tracking-wide">
            {t("home.countdown.seconds")}
          </div>
        </div>
      </div>

      <div className="text-center">
        <p className="text-sm text-muted-foreground">
          {countdownTarget === "start"
            ? "Until voting begins"
            : "Until voting ends"}
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          {countdownTarget === "start"
            ? `Starts: ${new Date(
                presidentialElection.startDate
              ).toLocaleDateString()}`
            : `Ends: ${new Date(
                presidentialElection.endDate
              ).toLocaleDateString()}`}
        </p>
      </div>
    </div>
  );
}

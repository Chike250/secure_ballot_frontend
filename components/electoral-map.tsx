"use client"

import { useState, useCallback } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface ElectoralMapProps {
  data: any[]
  view: string
  selectedCandidate: number | null
  isLoading?: boolean
  interactive?: boolean
}

// Party colors
const PARTY_COLORS = {
  APC: "#64748b",
  PDP: "#ef4444",
  LP: "#22c55e",
  NNPP: "#3b82f6",
  Others: "#a855f7",
}

// Simplified Nigeria map with state coordinates
// These are approximate positions for visualization purposes
const STATES = {
  Abia: { x: 70, y: 65, width: 8, height: 8 },
  Adamawa: { x: 80, y: 35, width: 10, height: 10 },
  "Akwa Ibom": { x: 65, y: 75, width: 8, height: 8 },
  Anambra: { x: 60, y: 60, width: 8, height: 8 },
  Bauchi: { x: 70, y: 30, width: 10, height: 10 },
  Bayelsa: { x: 55, y: 75, width: 8, height: 8 },
  Benue: { x: 65, y: 45, width: 10, height: 10 },
  Borno: { x: 85, y: 20, width: 12, height: 12 },
  "Cross River": { x: 65, y: 70, width: 8, height: 10 },
  Delta: { x: 55, y: 65, width: 8, height: 8 },
  Ebonyi: { x: 65, y: 60, width: 8, height: 8 },
  Edo: { x: 55, y: 60, width: 8, height: 8 },
  Ekiti: { x: 45, y: 55, width: 8, height: 8 },
  Enugu: { x: 60, y: 55, width: 8, height: 8 },
  FCT: { x: 55, y: 45, width: 8, height: 8 },
  Gombe: { x: 75, y: 30, width: 8, height: 8 },
  Imo: { x: 65, y: 65, width: 8, height: 8 },
  Jigawa: { x: 65, y: 20, width: 10, height: 10 },
  Kaduna: { x: 55, y: 30, width: 10, height: 10 },
  Kano: { x: 60, y: 20, width: 10, height: 10 },
  Katsina: { x: 50, y: 20, width: 10, height: 10 },
  Kebbi: { x: 40, y: 25, width: 10, height: 10 },
  Kogi: { x: 55, y: 50, width: 8, height: 8 },
  Kwara: { x: 45, y: 45, width: 8, height: 8 },
  Lagos: { x: 40, y: 60, width: 8, height: 8 },
  Nasarawa: { x: 60, y: 45, width: 8, height: 8 },
  Niger: { x: 45, y: 35, width: 10, height: 10 },
  Ogun: { x: 35, y: 60, width: 8, height: 8 },
  Ondo: { x: 45, y: 60, width: 8, height: 8 },
  Osun: { x: 45, y: 55, width: 8, height: 8 },
  Oyo: { x: 35, y: 55, width: 10, height: 10 },
  Plateau: { x: 65, y: 35, width: 10, height: 10 },
  Rivers: { x: 60, y: 75, width: 8, height: 8 },
  Sokoto: { x: 40, y: 15, width: 10, height: 10 },
  Taraba: { x: 75, y: 40, width: 10, height: 10 },
  Yobe: { x: 75, y: 15, width: 10, height: 10 },
  Zamfara: { x: 45, y: 20, width: 10, height: 10 },
}

export function ElectoralMap({
  data,
  view,
  selectedCandidate,
  isLoading = false,
  interactive = false,
}: ElectoralMapProps) {
  const [hoveredState, setHoveredState] = useState<string | null>(null)
  const [selectedState, setSelectedState] = useState<string | null>(null)

  // Handle state click
  const handleStateClick = (stateName: string) => {
    if (interactive) {
      setSelectedState(selectedState === stateName ? null : stateName)
    }
  }

  // Memoize the getStateColor function to prevent unnecessary calculations
  const getStateColor = useCallback(
    (stateName: string) => {
      const stateData = data.find((s) => s.state === stateName)

      if (!stateData) return "#e5e7eb" // Default gray for missing data

      if (view === "winner") {
        // If a candidate is selected, highlight only their states
        if (selectedCandidate) {
          const candidateParty =
            selectedCandidate === 1
              ? "APC"
              : selectedCandidate === 2
                ? "PDP"
                : selectedCandidate === 3
                  ? "LP"
                  : selectedCandidate === 4
                    ? "NNPP"
                    : "Others"

          return stateData.winner === candidateParty
            ? PARTY_COLORS[stateData.winner as keyof typeof PARTY_COLORS]
            : "#e5e7eb"
        }

        return PARTY_COLORS[stateData.winner as keyof typeof PARTY_COLORS] || "#e5e7eb"
      }

      if (view === "turnout") {
        // Color based on turnout percentage
        const turnoutPercentage = (stateData.totalVotes / 1000000) * 100
        if (turnoutPercentage > 70) return "#22c55e" // High turnout
        if (turnoutPercentage > 50) return "#84cc16" // Medium-high turnout
        if (turnoutPercentage > 30) return "#eab308" // Medium turnout
        return "#ef4444" // Low turnout
      }

      if (view === "margin") {
        // Color based on victory margin
        if (stateData.percentage > 60) return "#22c55e" // Strong win
        if (stateData.percentage > 50) return "#84cc16" // Clear win
        if (stateData.percentage > 40) return "#eab308" // Narrow win
        return "#ef4444" // Very close
      }

      return "#e5e7eb"
    },
    [data, selectedCandidate, view],
  )

  // Memoize the getStateInfo function to prevent unnecessary calculations
  const getStateInfo = useCallback(
    (stateName: string) => {
      const stateData = data.find((s) => s.state === stateName)
      if (!stateData) return { title: stateName, content: "No data available" }

      let content = ""
      if (view === "winner") {
        content = `Winner: ${stateData.winner} (${stateData.percentage}%)`
      } else if (view === "turnout") {
        content = `Turnout: ${((stateData.totalVotes / 1000000) * 100).toFixed(1)}%`
      } else if (view === "margin") {
        content = `Victory Margin: ${stateData.percentage}%`
      }

      return {
        title: stateName,
        content,
        votes: `Total Votes: ${stateData.totalVotes.toLocaleString()}`,
      }
    },
    [data, view],
  )

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="space-y-4 w-full">
          <Skeleton className="h-4 w-3/4 mx-auto" />
          <Skeleton className="h-[300px] w-[300px] rounded-md mx-auto" />
          <Skeleton className="h-4 w-1/2 mx-auto" />
        </div>
      </div>
    )
  }

  return (
    <div className="relative h-full w-full flex items-center justify-center">
      <svg viewBox="0 0 100 100" className="max-h-full max-w-full" style={{ background: "rgba(0,0,0,0.03)" }}>
        {/* Draw states */}
        {Object.entries(STATES).map(([stateName, coords]) => {
          const stateColor = getStateColor(stateName)
          const isHighlighted = hoveredState === stateName || selectedState === stateName

          return (
            <TooltipProvider key={stateName}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <rect
                    x={coords.x}
                    y={coords.y}
                    width={coords.width}
                    height={coords.height}
                    rx={2}
                    fill={stateColor}
                    stroke={isHighlighted ? "#000" : "rgba(0,0,0,0.2)"}
                    strokeWidth={isHighlighted ? 0.5 : 0.2}
                    onMouseEnter={() => setHoveredState(stateName)}
                    onMouseLeave={() => setHoveredState(null)}
                    onClick={() => handleStateClick(stateName)}
                    className={`transition-all duration-200 ${
                      interactive ? "cursor-pointer hover:opacity-80" : ""
                    } ${isHighlighted ? "filter drop-shadow-md" : ""}`}
                  />
                </TooltipTrigger>
                <TooltipContent side="right" align="center">
                  <div className="space-y-1">
                    <p className="font-medium">{getStateInfo(stateName).title}</p>
                    <p className="text-sm">{getStateInfo(stateName).content}</p>
                    <p className="text-xs text-muted-foreground">{getStateInfo(stateName).votes}</p>
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )
        })}

        {/* State labels for larger states */}
        {Object.entries(STATES).map(([stateName, coords]) => {
          // Only show labels for larger states to avoid clutter
          if (coords.width >= 10) {
            return (
              <text
                key={`label-${stateName}`}
                x={coords.x + coords.width / 2}
                y={coords.y + coords.height / 2}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="2"
                fill="#fff"
                className="pointer-events-none select-none"
              >
                {stateName.substring(0, 3)}
              </text>
            )
          }
          return null
        })}
      </svg>

      {/* Selected state info panel */}
      {selectedState && interactive && (
        <div className="absolute bottom-4 right-4 bg-background border rounded-lg shadow-lg p-4 max-w-xs">
          <h3 className="font-medium text-lg">{selectedState}</h3>
          <div className="mt-2 space-y-2">
            <div className="flex justify-between">
              <span>Winner:</span>
              <span className="font-medium">{data.find((s) => s.state === selectedState)?.winner}</span>
            </div>
            <div className="flex justify-between">
              <span>Percentage:</span>
              <span className="font-medium">{data.find((s) => s.state === selectedState)?.percentage}%</span>
            </div>
            <div className="flex justify-between">
              <span>Total Votes:</span>
              <span className="font-medium">
                {data.find((s) => s.state === selectedState)?.totalVotes.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

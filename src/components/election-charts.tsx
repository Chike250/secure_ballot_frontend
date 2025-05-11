"use client"

import { useState, useEffect, useRef, useCallback, memo } from "react"
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip as RechartsTooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LineChart,
  Line,
  ReferenceLine,
} from "recharts"
import { Skeleton } from "@/src/components/ui/skeleton"

interface ChartProps {
  type: "pie" | "bar" | "line"
  data: any[]
  selectedCandidate: number | null
  onSelectCandidate?: (id: number) => void
  isLoading?: boolean
  showLegend?: boolean
}

// Memoize the tooltip components to prevent unnecessary re-renders
const PieTooltip = memo(({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload
    return (
      <div className="bg-background border rounded-lg shadow-lg p-3 text-sm">
        <p className="font-medium">{data.name}</p>
        <p className="text-muted-foreground">{data.party}</p>
        <div className="flex justify-between gap-4 mt-1">
          <p>
            Votes: <span className="font-medium">{data.votes.toLocaleString()}</span>
          </p>
          <p>
            Share: <span className="font-medium">{data.value}%</span>
          </p>
        </div>
      </div>
    )
  }
  return null
})

PieTooltip.displayName = "PieTooltip"

// Custom tooltip component for bar chart
const BarTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background border rounded-lg shadow-lg p-3 text-sm">
        <p className="font-medium">{label}</p>
        <div className="mt-1 space-y-1">
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex justify-between gap-4">
              <p style={{ color: entry.color }}>{entry.name}:</p>
              <p className="font-medium">{entry.value.toLocaleString()}</p>
            </div>
          ))}
        </div>
      </div>
    )
  }
  return null
}

// Custom tooltip component for line chart
const LineTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background border rounded-lg shadow-lg p-3 text-sm">
        <p className="font-medium">{label}</p>
        {payload[0].payload.milestone && <p className="text-primary font-medium">{payload[0].payload.milestone}</p>}
        <div className="mt-1 space-y-1">
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex justify-between gap-4">
              <p style={{ color: entry.color }}>{entry.name}:</p>
              <p className="font-medium">{entry.value.toLocaleString()}</p>
            </div>
          ))}
        </div>
      </div>
    )
  }
  return null
}

export function ElectionCharts({
  type,
  data,
  selectedCandidate,
  onSelectCandidate,
  isLoading = false,
  showLegend = false,
}: ChartProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const [chartWidth, setChartWidth] = useState(0)
  const [chartHeight, setChartHeight] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const [animationComplete, setAnimationComplete] = useState(false)

  // Update chart dimensions on resize
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        setChartWidth(containerRef.current.clientWidth)
        setChartHeight(containerRef.current.clientHeight)
      }
    }

    updateDimensions()
    window.addEventListener("resize", updateDimensions)

    return () => window.removeEventListener("resize", updateDimensions)
  }, [])

  // Set animation complete after delay
  useEffect(() => {
    setAnimationComplete(false)
    const timer = setTimeout(() => {
      setAnimationComplete(true)
    }, 1000)

    return () => clearTimeout(timer)
  }, [data])

  // Handle pie/cell hover
  const handlePieEnter = (_, index: number) => {
    setActiveIndex(index)
  }

  // Handle pie/cell click
  const handlePieClick = useCallback(
    (data: any) => {
      if (onSelectCandidate && data.id) {
        onSelectCandidate(data.id)
      }
    },
    [onSelectCandidate],
  )

  // Colors for charts
  const COLORS = ["#64748b", "#ef4444", "#22c55e", "#3b82f6", "#a855f7"]
  const PARTY_COLORS = {
    APC: "#64748b",
    PDP: "#ef4444",
    LP: "#22c55e",
    NNPP: "#3b82f6",
    Others: "#a855f7",
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[300px]">
        <div className="space-y-4 w-full">
          <Skeleton className="h-4 w-3/4 mx-auto" />
          <Skeleton className="h-[200px] w-[200px] rounded-full mx-auto" />
          <Skeleton className="h-4 w-1/2 mx-auto" />
        </div>
      </div>
    )
  }

  // Render appropriate chart based on type
  const renderChart = () => {
    switch (type) {
      case "pie":
        return (
          <div className="h-[300px]" ref={containerRef}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                  animationDuration={1000}
                  animationBegin={0}
                  onMouseEnter={handlePieEnter}
                  onClick={handlePieClick}
                  className="cursor-pointer"
                >
                  {data.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.color || COLORS[index % COLORS.length]}
                      stroke={selectedCandidate === entry.id ? "#fff" : "transparent"}
                      strokeWidth={selectedCandidate === entry.id ? 2 : 0}
                      className={`transition-all duration-300 ${
                        selectedCandidate !== null && selectedCandidate !== entry.id ? "opacity-60" : "opacity-100"
                      } ${
                        activeIndex === index || selectedCandidate === entry.id ? "filter drop-shadow-lg scale-105" : ""
                      }`}
                    />
                  ))}
                </Pie>
                <RechartsTooltip content={<PieTooltip />} />
                {showLegend && (
                  <Legend
                    layout="horizontal"
                    verticalAlign="bottom"
                    align="center"
                    formatter={(value, entry, index) => (
                      <span
                        className={`text-sm ${selectedCandidate !== null && selectedCandidate !== data[index]?.id ? "opacity-60" : "opacity-100"}`}
                      >
                        {data[index]?.party}
                      </span>
                    )}
                    onClick={(data) => {
                      if (onSelectCandidate && data.payload.id) {
                        onSelectCandidate(data.payload.id)
                      }
                    }}
                  />
                )}
              </PieChart>
            </ResponsiveContainer>
          </div>
        )

      case "bar":
        return (
          <div className="h-[300px]" ref={containerRef}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="region" tick={{ fontSize: 12 }} tickLine={false} />
                <YAxis
                  tickFormatter={(value) =>
                    value >= 1000000 ? `${(value / 1000000).toFixed(1)}M` : `${(value / 1000).toFixed(0)}K`
                  }
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                />
                <RechartsTooltip content={<BarTooltip />} />
                {showLegend && (
                  <Legend
                    wrapperStyle={{ paddingTop: 10 }}
                    onClick={(data) => {
                      const partyMap = { APC: 1, PDP: 2, LP: 3, NNPP: 4, Others: 5 }
                      if (onSelectCandidate && partyMap[data.dataKey as keyof typeof partyMap]) {
                        onSelectCandidate(partyMap[data.dataKey as keyof typeof partyMap])
                      }
                    }}
                  />
                )}
                {Object.entries(PARTY_COLORS).map(([party, color], index) => {
                  const partyMap = { APC: 1, PDP: 2, LP: 3, NNPP: 4, Others: 5 }
                  const isSelected = selectedCandidate === partyMap[party as keyof typeof partyMap]
                  const isHighlighted = selectedCandidate === null || isSelected

                  return (
                    <Bar
                      key={party}
                      dataKey={party}
                      fill={color}
                      animationDuration={1000}
                      animationBegin={index * 100}
                      className={`transition-opacity duration-300 ${isHighlighted ? "opacity-100" : "opacity-40"}`}
                      radius={[4, 4, 0, 0]}
                    />
                  )
                })}
              </BarChart>
            </ResponsiveContainer>
          </div>
        )

      case "line":
        // Check if data has party-specific fields or just 'votes'
        const hasPartyData = data.length > 0 && "APC" in data[0]

        return (
          <div className="h-[300px]" ref={containerRef}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} tickLine={false} />
                <YAxis
                  tickFormatter={(value) =>
                    value >= 1000000 ? `${(value / 1000000).toFixed(1)}M` : `${(value / 1000).toFixed(0)}K`
                  }
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                />
                <RechartsTooltip content={<LineTooltip />} />

                {/* Add reference lines for milestones */}
                {data.map((entry, index) => {
                  if (entry.milestone) {
                    return (
                      <ReferenceLine
                        key={index}
                        x={entry.name}
                        stroke="#888"
                        strokeDasharray="3 3"
                        label={{
                          value: entry.milestone,
                          position: "insideTopRight",
                          fill: "#888",
                          fontSize: 10,
                        }}
                      />
                    )
                  }
                  return null
                })}

                {hasPartyData ? (
                  // Render party-specific lines
                  <>
                    {showLegend && (
                      <Legend
                        wrapperStyle={{ paddingTop: 10 }}
                        onClick={(data) => {
                          const partyMap = { APC: 1, PDP: 2, LP: 3, NNPP: 4, Others: 5 }
                          if (onSelectCandidate && partyMap[data.dataKey as keyof typeof partyMap]) {
                            onSelectCandidate(partyMap[data.dataKey as keyof typeof partyMap])
                          }
                        }}
                      />
                    )}
                    {Object.entries(PARTY_COLORS).map(([party, color]) => {
                      const partyMap = { APC: 1, PDP: 2, LP: 3, NNPP: 4, Others: 5 }
                      const isSelected = selectedCandidate === partyMap[party as keyof typeof partyMap]
                      const isHighlighted = selectedCandidate === null || isSelected

                      return (
                        <Line
                          key={party}
                          type="monotone"
                          dataKey={party}
                          stroke={color}
                          strokeWidth={isSelected ? 3 : 2}
                          dot={{ r: 3, fill: color }}
                          activeDot={{ r: 6, fill: color }}
                          animationDuration={1500}
                          className={`transition-opacity duration-300 ${isHighlighted ? "opacity-100" : "opacity-40"}`}
                        />
                      )
                    })}
                  </>
                ) : (
                  // Render single 'votes' line
                  <Line
                    type="monotone"
                    dataKey="votes"
                    stroke="#22c55e"
                    strokeWidth={2}
                    dot={{ r: 3, fill: "#22c55e" }}
                    activeDot={{ r: 6, fill: "#22c55e" }}
                    animationDuration={1500}
                  />
                )}
              </LineChart>
            </ResponsiveContainer>
          </div>
        )

      default:
        return <div>Invalid chart type</div>
    }
  }

  return renderChart()
}

"use client"

import React, { memo } from "react"
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart as RechartsLineChart,
  Line,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Legend,
} from "recharts"

interface ChartProps {
  data: any[]
  index: string
  categories: string[]
  colors: string[]
  valueFormatter?: (value: number) => string
  yAxisWidth?: number
}

// Color palette for charts
const CHART_COLORS = {
  emerald: "#10b981",
  red: "#ef4444",
  blue: "#3b82f6",
  yellow: "#f59e0b",
  purple: "#8b5cf6",
  green: "#22c55e",
  orange: "#f97316",
  pink: "#ec4899",
  indigo: "#6366f1",
  teal: "#14b8a6",
}

const getColor = (colorName: string, index: number = 0): string => {
  if (CHART_COLORS[colorName as keyof typeof CHART_COLORS]) {
    return CHART_COLORS[colorName as keyof typeof CHART_COLORS]
  }
  // Fallback to a default color palette
  const defaultColors = ["#3b82f6", "#ef4444", "#10b981", "#f59e0b", "#8b5cf6"]
  return defaultColors[index % defaultColors.length]
}

export const BarChart: React.FC<ChartProps> = memo(
  ({ data, index, categories, colors, valueFormatter, yAxisWidth = 60 }) => {
    return (
      <ResponsiveContainer width="100%" height="100%">
        <RechartsBarChart
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <XAxis 
            dataKey={index} 
            className="text-xs fill-muted-foreground"
            tick={{ fontSize: 12 }}
          />
          <YAxis 
            width={yAxisWidth}
            className="text-xs fill-muted-foreground"
            tick={{ fontSize: 12 }}
            tickFormatter={valueFormatter}
          />
          <Tooltip
            content={({ active, payload, label }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="rounded-lg border bg-background p-2 shadow-md">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex flex-col">
                        <span className="text-[0.70rem] uppercase text-muted-foreground">
                          {index}
                        </span>
                        <span className="font-bold text-muted-foreground">
                          {label}
                        </span>
                      </div>
                      {payload.map((entry, index) => (
                        <div key={index} className="flex flex-col">
                          <span className="text-[0.70rem] uppercase text-muted-foreground">
                            {entry.dataKey}
                          </span>
                          <span className="font-bold" style={{ color: entry.color }}>
                            {valueFormatter ? valueFormatter(entry.value as number) : entry.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              }
              return null
            }}
          />
          {categories.map((category, idx) => (
            <Bar
              key={category}
              dataKey={category}
              fill={getColor(colors[idx] || colors[0], idx)}
              radius={[4, 4, 0, 0]}
            />
          ))}
        </RechartsBarChart>
      </ResponsiveContainer>
    )
  },
)

BarChart.displayName = "BarChart"

export const LineChart: React.FC<ChartProps> = memo(
  ({ data, index, categories, colors, valueFormatter, yAxisWidth = 60 }) => {
    return (
      <ResponsiveContainer width="100%" height="100%">
        <RechartsLineChart
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <XAxis 
            dataKey={index} 
            className="text-xs fill-muted-foreground"
            tick={{ fontSize: 12 }}
          />
          <YAxis 
            width={yAxisWidth}
            className="text-xs fill-muted-foreground"
            tick={{ fontSize: 12 }}
            tickFormatter={valueFormatter}
          />
          <Tooltip
            content={({ active, payload, label }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="rounded-lg border bg-background p-2 shadow-md">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex flex-col">
                        <span className="text-[0.70rem] uppercase text-muted-foreground">
                          {index}
                        </span>
                        <span className="font-bold text-muted-foreground">
                          {label}
                        </span>
                      </div>
                      {payload.map((entry, index) => (
                        <div key={index} className="flex flex-col">
                          <span className="text-[0.70rem] uppercase text-muted-foreground">
                            {entry.dataKey}
                          </span>
                          <span className="font-bold" style={{ color: entry.color }}>
                            {valueFormatter ? valueFormatter(entry.value as number) : entry.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              }
              return null
            }}
          />
          {categories.map((category, idx) => (
            <Line
              key={category}
              type="monotone"
              dataKey={category}
              stroke={getColor(colors[idx] || colors[0], idx)}
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          ))}
        </RechartsLineChart>
      </ResponsiveContainer>
    )
  },
)

LineChart.displayName = "LineChart"

export const PieChart: React.FC<ChartProps> = memo(({ data, index, categories, colors, valueFormatter }) => {
  // For pie charts, we typically use the first category as the value
  const valueKey = categories[0]
  
  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsPieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          outerRadius={80}
          fill="#8884d8"
          dataKey={valueKey}
          nameKey={index}
        >
          {data.map((entry, idx) => (
            <Cell 
              key={`cell-${idx}`} 
              fill={getColor(colors[idx] || colors[0], idx)} 
            />
          ))}
        </Pie>
        <Tooltip
          content={({ active, payload }) => {
            if (active && payload && payload.length) {
              const data = payload[0].payload
              return (
                <div className="rounded-lg border bg-background p-2 shadow-md">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex flex-col">
                      <span className="text-[0.70rem] uppercase text-muted-foreground">
                        {index}
                      </span>
                      <span className="font-bold text-muted-foreground">
                        {data[index]}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[0.70rem] uppercase text-muted-foreground">
                        {valueKey}
                      </span>
                      <span className="font-bold" style={{ color: payload[0].color }}>
                        {valueFormatter ? valueFormatter(data[valueKey]) : data[valueKey]}
                      </span>
                    </div>
                  </div>
                </div>
              )
            }
            return null
          }}
        />
        <Legend />
      </RechartsPieChart>
    </ResponsiveContainer>
  )
})

PieChart.displayName = "PieChart"

export const ChartContainer: React.FC<{ children: React.ReactNode; config: any }> = memo(({ children, config }) => {
  return <div className="w-full h-full">{children}</div>
})

ChartContainer.displayName = "ChartContainer"

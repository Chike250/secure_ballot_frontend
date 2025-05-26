"use client"

import React from 'react'
import { CircleMarker, Popup } from 'react-leaflet'

interface StateMarkerProps {
  state: {
    name: string
    center: [number, number]
    leadingParty: string
    percentage: number
    votes: number
  }
  color: string
  onSelect: (state: any) => void
}

export const StateMarker: React.FC<StateMarkerProps> = ({ state, color, onSelect }) => {
  // Calculate radius based on vote count (normalized)
  const radius = Math.max(8, Math.min(25, Math.sqrt(state.votes / 50000)))

  return (
    <CircleMarker
      center={state.center}
      radius={radius}
      pathOptions={{
        fillColor: color,
        color: '#ffffff',
        weight: 2,
        opacity: 1,
        fillOpacity: 0.8,
      }}
      eventHandlers={{
        click: () => onSelect(state),
      }}
    >
      <Popup>
        <div className="p-2 min-w-[200px]">
          <h3 className="font-bold text-lg mb-2">{state.name} State</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Leading Party:</span>
              <span 
                className="font-semibold px-2 py-1 rounded text-white text-xs"
                style={{ backgroundColor: color }}
              >
                {state.leadingParty}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Vote Share:</span>
              <span className="font-semibold">{state.percentage}%</span>
            </div>
            <div className="flex justify-between">
              <span>Total Votes:</span>
              <span className="font-semibold">{state.votes.toLocaleString()}</span>
            </div>
          </div>
          <div className="mt-3 pt-2 border-t">
            <button 
              onClick={() => onSelect(state)}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              View Details →
            </button>
          </div>
        </div>
      </Popup>
    </CircleMarker>
  )
} 
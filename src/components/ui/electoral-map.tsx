"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { StateMarker } from "./state-marker";

// Dynamically import map components to avoid SSR issues
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);
const GeoJSON = dynamic(
  () => import("react-leaflet").then((mod) => mod.GeoJSON),
  { ssr: false }
);
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), {
  ssr: false,
});

// Nigerian states data with coordinates and sample election results
const NIGERIAN_STATES = [
  {
    name: "Lagos",
    center: [6.5244, 3.3792],
    leadingParty: "APC",
    percentage: 47,
    votes: 2850000,
  },
  {
    name: "Kano",
    center: [12.0022, 8.592],
    leadingParty: "NNPP",
    percentage: 48,
    votes: 2100000,
  },
  {
    name: "Rivers",
    center: [4.8156, 6.9778],
    leadingParty: "PDP",
    percentage: 46,
    votes: 1650000,
  },
  {
    name: "Kaduna",
    center: [10.5105, 7.4165],
    leadingParty: "APC",
    percentage: 51,
    votes: 1800000,
  },
  {
    name: "Oyo",
    center: [8.0, 4.0],
    leadingParty: "PDP",
    percentage: 44,
    votes: 1450000,
  },
  {
    name: "Katsina",
    center: [12.9908, 7.6006],
    leadingParty: "APC",
    percentage: 53,
    votes: 1320000,
  },
  {
    name: "FCT",
    center: [9.0765, 7.3986],
    leadingParty: "LP",
    percentage: 59,
    votes: 980000,
  },
  {
    name: "Anambra",
    center: [6.2209, 6.9957],
    leadingParty: "LP",
    percentage: 63,
    votes: 890000,
  },
  {
    name: "Enugu",
    center: [6.5244, 7.5086],
    leadingParty: "LP",
    percentage: 61,
    votes: 750000,
  },
  {
    name: "Delta",
    center: [5.8903, 5.6804],
    leadingParty: "PDP",
    percentage: 49,
    votes: 1200000,
  },
  {
    name: "Imo",
    center: [5.4951, 7.026],
    leadingParty: "APC",
    percentage: 47,
    votes: 680000,
  },
  {
    name: "Akwa Ibom",
    center: [5.0077, 7.8536],
    leadingParty: "PDP",
    percentage: 55,
    votes: 920000,
  },
  {
    name: "Ogun",
    center: [7.1608, 3.3476],
    leadingParty: "APC",
    percentage: 48,
    votes: 850000,
  },
  {
    name: "Sokoto",
    center: [13.0059, 5.2476],
    leadingParty: "APC",
    percentage: 51,
    votes: 780000,
  },
  {
    name: "Borno",
    center: [11.8846, 13.1571],
    leadingParty: "APC",
    percentage: 58,
    votes: 920000,
  },
  {
    name: "Osun",
    center: [7.5629, 4.52],
    leadingParty: "APC",
    percentage: 45,
    votes: 650000,
  },
  {
    name: "Kogi",
    center: [7.8006, 6.7401],
    leadingParty: "APC",
    percentage: 49,
    votes: 580000,
  },
  {
    name: "Zamfara",
    center: [12.1704, 6.2649],
    leadingParty: "APC",
    percentage: 55,
    votes: 520000,
  },
  {
    name: "Plateau",
    center: [9.2182, 9.5179],
    leadingParty: "LP",
    percentage: 43,
    votes: 680000,
  },
  {
    name: "Abia",
    center: [5.4527, 7.5248],
    leadingParty: "LP",
    percentage: 48,
    votes: 450000,
  },
  {
    name: "Cross River",
    center: [6.335, 8.5],
    leadingParty: "APC",
    percentage: 45,
    votes: 520000,
  },
  {
    name: "Edo",
    center: [6.335, 5.6037],
    leadingParty: "LP",
    percentage: 44,
    votes: 580000,
  },
  {
    name: "Kwara",
    center: [8.967, 4.5993],
    leadingParty: "APC",
    percentage: 52,
    votes: 480000,
  },
  {
    name: "Bauchi",
    center: [10.3158, 9.8442],
    leadingParty: "APC",
    percentage: 47,
    votes: 720000,
  },
  {
    name: "Jigawa",
    center: [12.2343, 9.3453],
    leadingParty: "APC",
    percentage: 56,
    votes: 650000,
  },
  {
    name: "Kebbi",
    center: [12.4539, 4.1975],
    leadingParty: "APC",
    percentage: 57,
    votes: 480000,
  },
  {
    name: "Niger",
    center: [10.0823, 5.9617],
    leadingParty: "APC",
    percentage: 54,
    votes: 620000,
  },
  {
    name: "Adamawa",
    center: [9.3265, 12.3984],
    leadingParty: "PDP",
    percentage: 52,
    votes: 580000,
  },
  {
    name: "Gombe",
    center: [10.2897, 11.1689],
    leadingParty: "APC",
    percentage: 54,
    votes: 420000,
  },
  {
    name: "Ondo",
    center: [7.25, 5.2058],
    leadingParty: "APC",
    percentage: 46,
    votes: 520000,
  },
  {
    name: "Ekiti",
    center: [7.7193, 5.3106],
    leadingParty: "APC",
    percentage: 53,
    votes: 380000,
  },
  {
    name: "Taraba",
    center: [8.8932, 11.3604],
    leadingParty: "PDP",
    percentage: 48,
    votes: 420000,
  },
  {
    name: "Yobe",
    center: [12.2939, 11.7467],
    leadingParty: "APC",
    percentage: 59,
    votes: 380000,
  },
  {
    name: "Benue",
    center: [7.1906, 8.7501],
    leadingParty: "LP",
    percentage: 42,
    votes: 680000,
  },
  {
    name: "Nasarawa",
    center: [8.5378, 8.3206],
    leadingParty: "APC",
    percentage: 45,
    votes: 420000,
  },
  {
    name: "Bayelsa",
    center: [4.6737, 6.0699],
    leadingParty: "PDP",
    percentage: 51,
    votes: 280000,
  },
  {
    name: "Ebonyi",
    center: [6.2649, 8.0137],
    leadingParty: "APC",
    percentage: 46,
    votes: 380000,
  },
];

// Party colors
const PARTY_COLORS = {
  APC: "#0066cc",
  PDP: "#ff0000",
  LP: "#00cc00",
  NNPP: "#800080",
  APGA: "#ffff00",
  SDP: "#ff6600",
  ADC: "#ff69b4",
  YPP: "#00ffff",
};

interface ElectoralMapProps {
  data?: any[];
  height?: string;
  showLegend?: boolean;
}

const ElectoralMap: React.FC<ElectoralMapProps> = ({
  data = NIGERIAN_STATES,
  height = "500px",
  showLegend = true,
}) => {
  const [isClient, setIsClient] = useState(false);
  const [selectedState, setSelectedState] = useState<any>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Get color based on leading party
  const getStateColor = (party: string) => {
    return PARTY_COLORS[party as keyof typeof PARTY_COLORS] || "#cccccc";
  };

  // Get party statistics
  const getPartyStats = () => {
    const stats: Record<string, number> = {};
    data.forEach((state) => {
      stats[state.leadingParty] = (stats[state.leadingParty] || 0) + 1;
    });
    return stats;
  };

  if (!isClient) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-[500px] w-full" />
        <div className="flex gap-2">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-8 w-20" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div
        style={{ height }}
        className="relative rounded-lg overflow-hidden border"
      >
        <MapContainer
          center={[9.082, 8.6753]} // Center of Nigeria
          zoom={6}
          style={{ height: "100%", width: "100%" }}
          zoomControl={true}
          scrollWheelZoom={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* State markers */}
          {data.map((state, index) => (
            <StateMarker
              key={state.name}
              state={state}
              color={getStateColor(state.leadingParty)}
              onSelect={setSelectedState}
            />
          ))}
        </MapContainer>
      </div>

      {/* Legend */}
      {showLegend && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(getPartyStats()).map(([party, count]) => (
            <Card key={party} className="p-3">
              <div className="flex items-center gap-2">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: getStateColor(party) }}
                />
                <div>
                  <div className="font-semibold text-sm">{party}</div>
                  <div className="text-xs text-muted-foreground">
                    {count} state{count !== 1 ? "s" : ""}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Selected state details */}
      {selectedState && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              {selectedState.name} State
              <Badge
                style={{
                  backgroundColor: getStateColor(selectedState.leadingParty),
                  color: "white",
                }}
              >
                {selectedState.leadingParty}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold">
                  {selectedState.percentage}%
                </div>
                <div className="text-sm text-muted-foreground">Vote Share</div>
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {selectedState.votes.toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground">Total Votes</div>
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {Math.round(selectedState.votes / 1000)}K
                </div>
                <div className="text-sm text-muted-foreground">Avg per LGA</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ElectoralMap;

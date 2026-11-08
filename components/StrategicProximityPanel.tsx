"use client";

import PanelHeader from "./PanelHeader";
import { StrategicLandmark } from "@/utils/types";
import { Plane, Compass } from "lucide-react";

interface StrategicProximityPanelProps {
  landmarks: StrategicLandmark[];
}

export default function StrategicProximityPanel({
  landmarks,
}: StrategicProximityPanelProps) {
  const categoryBadge: Record<string, { bg: string; text: string }> = {
    INTEL: { bg: "bg-cyan-950/80 border-cyan-500/40", text: "text-cyan-400" },
    MILITARY: {
      bg: "bg-emerald-950/80 border-emerald-500/40",
      text: "text-emerald-400",
    },
    COMMAND: { bg: "bg-blue-950/80 border-blue-500/40", text: "text-blue-400" },
    NUCLEAR: {
      bg: "bg-amber-950/80 border-amber-500/40",
      text: "text-amber-400",
    },
  };

  return (
    <div
      className="tactical-panel reveal w-full"
      style={{ gridColumn: "1 / -1" }}
    >
      <div className="flex items-center justify-between p-3 border-b border-nexus-cyan-border bg-panel">
        <div className="flex items-center gap-2">
          <PanelHeader label="Strategic Proximity Matrix (Global Defense)" />
        </div>

        <div className="hidden sm:inline-block text-xs text-nexus-cyan-dim font-mono tracking-wider">
          Haversine Geodesic Calculation
        </div>
      </div>

      <div className="p-3">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {landmarks.map((site) => {
            const badge = categoryBadge[site.category] || categoryBadge.INTEL;
            return (
              <div
                key={site.code}
                className="p-3 bg-[#040810] border border-nexus-cyan-border hover:border-nexus-cyan-dim transition-colors font-ubuntu space-y-2 relative"
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`text-xs px-2 py-0.75 border font-bold ${badge.bg} ${badge.text}`}
                  >
                    {site.category} ({site.code})
                  </span>
                  <span className="text-xs text-nexus-cyan-dim flex items-center gap-1">
                    <Compass className="size-3.5" />
                    {site.bearingDeg}° BEARING
                  </span>
                </div>

                <div
                  className="text-sm font-bold text-white tracking-wide truncate"
                  title={site.name}
                >
                  {site.name}
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1 border-t border-nexus-cyan-border/75 text-[11px]">
                  <div className="space-y-0.5">
                    <span className="text-nexus-cyan-dim text-sm block">
                      RANGE
                    </span>
                    <span className="text-nexus-emerald font-bold">
                      {site.distanceKm.toLocaleString()} KM
                    </span>
                    <span className="text-nexus-cyan text-xs block">
                      ({site.distanceNm.toLocaleString()} NM)
                    </span>
                  </div>

                  <div className="space-y-0.5">
                    <span className="text-nexus-cyan-dim text-sm block">
                      MACH 0.85 INTERCEPT
                    </span>
                    <span className="text-nexus-amber font-bold flex items-center gap-1">
                      <Plane className="size-3.5"/>
                      {site.subsonicFlightTimeMin} MIN
                    </span>
                    <span className="text-nexus-cyan text-xs block">
                      {(site.subsonicFlightTimeMin / 60).toFixed(1)} HRS FLIGHT
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

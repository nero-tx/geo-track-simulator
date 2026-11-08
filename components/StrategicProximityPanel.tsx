"use client";

import PanelHeader from "./PanelHeader";
import { StrategicLandmark } from "@/utils/types";
import { Plane, Compass } from "lucide-react";

interface StrategicProximityPanelProps {
  landmarks: StrategicLandmark[];
}

export default function StrategicProximityPanel({ landmarks }: StrategicProximityPanelProps) {
  const categoryBadge: Record<string, { bg: string; text: string }> = {
    INTEL: { bg: "bg-cyan-950/80 border-cyan-500/40", text: "text-cyan-400" },
    MILITARY: { bg: "bg-emerald-950/80 border-emerald-500/40", text: "text-emerald-400" },
    COMMAND: { bg: "bg-blue-950/80 border-blue-500/40", text: "text-blue-400" },
    NUCLEAR: { bg: "bg-amber-950/80 border-amber-500/40", text: "text-amber-400" }
  };

  return (
    <div className="tactical-panel reveal w-full" style={{ gridColumn: "1 / -1" }}>
      <div className="flex items-center justify-between px-3 py-2 border-b border-cyan-500/20 bg-[#07101f]">
        <div className="flex items-center gap-2">
          <PanelHeader label="STRATEGIC PROXIMITY MATRIX // GLOBAL DEFENSE & INTEL NODES" />
        </div>
        <div className="text-[10px] text-cyan-400/60 font-mono tracking-wider">
          HAVERSINE GEODESIC CALCULATION
        </div>
      </div>

      <div className="p-3">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {landmarks.map((site) => {
            const badge = categoryBadge[site.category] || categoryBadge.INTEL;
            return (
              <div
                key={site.code}
                className="p-3 bg-[#040810] border border-cyan-500/20 hover:border-cyan-400/50 transition-colors font-mono space-y-2 relative"
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`text-[9px] px-2 py-0.5 border font-bold ${badge.bg} ${badge.text}`}
                  >
                    {site.category} {"//"} {site.code}
                  </span>
                  <span className="text-[10px] text-cyan-400/60 flex items-center gap-1">
                    <Compass className="w-3 h-3 text-cyan-400" />
                    {site.bearingDeg}° BEARING
                  </span>
                </div>

                <div className="text-xs font-bold text-white tracking-wide truncate" title={site.name}>
                  {site.name}
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1 border-t border-cyan-500/10 text-[11px]">
                  <div>
                    <span className="text-cyan-400/40 text-[9px] block">RANGE</span>
                    <span className="text-emerald-400 font-bold">
                      {site.distanceKm.toLocaleString()} KM
                    </span>
                    <span className="text-cyan-400/50 text-[9px] block">
                      ({site.distanceNm.toLocaleString()} NM)
                    </span>
                  </div>

                  <div>
                    <span className="text-cyan-400/40 text-[9px] block">MACH 0.85 INTERCEPT</span>
                    <span className="text-amber-400 font-bold flex items-center gap-1">
                      <Plane className="w-3 h-3 text-amber-400" />
                      {site.subsonicFlightTimeMin} MIN
                    </span>
                    <span className="text-cyan-400/50 text-[9px] block">
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

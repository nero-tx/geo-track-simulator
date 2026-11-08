"use client";

import { GeoData } from "@/utils/types";
import PanelHeader from "./PanelHeader";

export default function GPSPanel({ data }: { data: GeoData }) {
  const fields = [
    { label: "LATITUDE", val: data.lat, unit: "°N" },
    { label: "LONGITUDE", val: data.lng, unit: "°E" },
    { label: "ACCURACY RADIUS", val: data.accuracy, unit: "" },
    {
      label: "ALTITUDE MSL",
      val: data.altitudeMeters ? `${data.altitudeMeters}m` : "SEA LEVEL REF",
      unit: "",
    },
  ];

  return (
    <div className="tactical-panel reveal">
      <div className="flex items-center justify-between p-3 border-b border-nexus-cyan-border bg-panel">
        <PanelHeader label="Positioning Intelligence (Telemetry)" />

        <span
          className={`text-sm font-ubuntu px-2 py-1 border ${
            data.gpsOk
              ? "bg-emerald-950/80 text-emerald-400 border-emerald-500/40"
              : "bg-amber-950/80 text-amber-400 border-amber-500/40"
          }`}
        >
          {data.gpsOk ? "GNSS Positioning" : "IP-Based Positioning"}
        </span>
      </div>

      <div className="p-3 grid grid-cols-2 gap-3">
        {fields.map(({ label, val, unit }) => (
          <div
            key={label}
            className="p-2.5 bg-core border border-nexus-cyan-border"
          >
            <div className="text-xs tracking-[1.5px] mb-1 text-nexus-cyan-dim font-mono">
              {label}
            </div>
            <div
              className="text-[clamp(15px,2.5vw,20px)] tracking-wider font-mono font-bold"
              style={{
                color: data.gpsOk ? "#00f0ff" : "#ffaa00",
              }}
            >
              {val}{" "}
              <span className="text-sm font-normal text-nexus-crimson">
                {unit}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

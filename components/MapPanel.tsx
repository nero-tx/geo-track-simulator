"use client";

import { useState } from "react";
import PanelHeader from "./PanelHeader";
import { GeoData } from "@/utils/types";
import { playBeep, playSonarPing } from "@/utils/soundFx";
import { Crosshair, Layers, Radio, ExternalLink } from "lucide-react";

interface MapPanelProps {
  data: GeoData;
}

export default function MapPanel({ data }: MapPanelProps) {
  const [mapMode, setMapMode] = useState<"dark" | "satellite">("dark");
  const [radarActive, setRadarActive] = useState(true);

  const lat = data.mapLat || parseFloat(data.lat) || 30.0;
  const lng = data.mapLng || parseFloat(data.lng) || 31.0;
  const delta = data.gpsOk ? 0.015 : 0.08;

  // OpenStreetMap embed coordinates
  const osmSrc = `https://www.openstreetmap.org/export/embed.html?bbox=${
    lng - delta
  },${lat - delta},${lng + delta},${lat + delta}&layer=mapnik&marker=${lat},${lng}`;

  const toggleMode = (mode: "dark" | "satellite") => {
    playBeep(1100, 0.06);
    setMapMode(mode);
  };

  const pingTarget = () => {
    playSonarPing();
  };

  return (
    <div
      className="tactical-panel reveal w-full"
      style={{ gridColumn: "1 / -1" }}
    >
      <div className="flex items-center justify-between flex-wrap p-3 border-b border-nexus-cyan-border bg-panel font-ubuntu gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          <PanelHeader label="Geospatial Positioning || Location Status" />

          {data.gpsOk ? (
            <span className="text-sm bg-emerald-950/80 text-emerald-400 border border-emerald-500/40 px-2 py-1 tracking-wide">
              High-Accuracy GPS Fix
            </span>
          ) : (
            <span className="text-sm bg-amber-950/80 text-amber-400 border border-amber-500/40 px-2 py-1 tracking-wide">
              IP-Based Approximate Location
            </span>
          )}
        </div>

        {/* Map Mode Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setRadarActive(!radarActive)}
            className={`px-2.5 py-1 text-[11px] font-mono border transition-all cursor-pointer flex items-center gap-1 ${
              radarActive
                ? "bg-cyan-500/20 text-cyan-300 border-cyan-400"
                : "bg-transparent text-cyan-400/50 border-cyan-500/20"
            }`}
          >
            <Radio className="size-4 shrink-0" />
            <span className="hidden sm:inline">RADAR SWEEP</span>
          </button>

          <button
            onClick={() =>
              toggleMode(mapMode === "dark" ? "satellite" : "dark")
            }
            className="px-2.5 py-1 text-[11px] font-mono border border-nexus-cyan-border text-cyan-300 hover:border-cyan-400 bg-transparent cursor-pointer flex items-center gap-1"
          >
            <Layers className="size-4 shrink-0" />
            <span>{mapMode === "dark" ? "TACTICAL" : "OPTICAL"}</span>
          </button>

          <a
            href={`https://www.google.com/maps?q=${lat},${lng}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-2.5 py-1 text-[11px] font-mono border border-nexus-cyan-border text-cyan-300 hover:border-cyan-400 bg-transparent cursor-pointer flex items-center gap-1"
            title="Open in External Geospatial Viewer"
          >
            <ExternalLink className="size-4 shrink-0" />
            <span className="hidden sm:inline">EXTERNAL HUD</span>
          </a>
        </div>
      </div>

      <div
        className="relative overflow-hidden w-full"
        style={{ height: "clamp(340px, 48vw, 520px)" }}
      >
        {/* Map iframe */}
        <iframe
          src={osmSrc}
          className={`w-full h-full border-0 transition-all duration-300 ${
            mapMode === "dark" ? "map-dark" : "brightness-90 contrast-125"
          }`}
          title="Tactical Geolocation Target"
        />

        {/* Tactical Scanlines */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0, 240, 255, 0.035) 3px, rgba(0, 240, 255, 0.035) 4px)",
            zIndex: 3,
          }}
        />

        {/* Concentric Tactical Range Circles */}
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          style={{ zIndex: 4 }}
        >
          <div className="size-45 rounded-full border border-nexus-cyan-border" />
          <div className="absolute w-[320px] h-80 rounded-full border border-nexus-cyan-border border-dashed" />
          <div className="absolute size-115 rounded-full border border-nexus-cyan-border" />

          {/* Compass Rose Axis */}
          <div className="absolute w-full h-px bg-nexus-cyan-dim" />
          <div className="absolute h-full w-px bg-nexus-cyan-dim" />
        </div>

        {/* Animated Radar Sweep Cone */}
        {radarActive && (
          <div
            className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden"
            style={{ zIndex: 5 }}
          >
            <div
              className="radar-sweep size-140 rounded-full"
              style={{
                background:
                  "conic-gradient(from 0deg, rgba(0, 240, 255, 0.22) 0deg, rgba(0, 240, 255, 0.04) 55deg, transparent 70deg)",
              }}
            />
          </div>
        )}

        {/* Center Target Lock Ping */}
        <div
          className="absolute pointer-events-none"
          style={{
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 10,
          }}
        >
          {/* Pulsing Target Ring */}
          <div className="target-ping w-8 h-8 rounded-full border-2 border-nexus-cyan" />

          {/* Target Reticle Crosshairs */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="w-10 h-0.5 bg-nexus-cyan -ml-5 absolute top-0" />
            <div className="h-10 w-0.5 bg-nexus-cyan -mt-5 absolute left-0" />
            <div className="w-3 h-3 rounded-full bg-nexus-cyan shadow-[0_0_12px_#00f0ff] -ml-1.5 -mt-1.5 absolute" />
          </div>
        </div>

        {/* Tactical HUD Header Information */}
        <div
          className="absolute top-3 left-3 p-2 bg-core border border-nexus-cyan-border text-[11px] font-mono pointer-events-auto"
          style={{ zIndex: 12 }}
        >
          <div className="text-nexus-cyan-dim text-xs tracking-widest">
            COORDINATES FIX
          </div>
          <div className="text-nexus-cyan font-bold tracking-wider my-1">
            {lat.toFixed(5)}°N, {lng.toFixed(5)}°E
          </div>
          <div className="text-xs text-nexus-emerald">
            ACCURACY: ±{data.accuracy}
          </div>
        </div>

        {/* Tactical HUD Footer: Exact Physical Location Tag */}
        <div
          className="absolute bottom-3 left-1/2 -translate-x-1/2 px-4 py-2 bg-[#050b17]/90 border border-cyan-400/40 text-[11px] font-mono tracking-wider flex items-center gap-3 shadow-[0_0_20px_rgba(0,0,0,0.8)] max-w-[90%] truncate pointer-events-auto z-12"
        >
          <div className="flex items-center gap-1.5 text-cyan-400 shrink-0">
            <Crosshair
              className="size-3.5 text-nexus-cyan animate-spin"
              style={{ animationDuration: "10s" }}
            />
            <span className="font-bold">LOCKED SECTOR:</span>
          </div>

          <span className="text-white truncate">
            {data.exactAddress.formattedAddress}
          </span>

          <button
            onClick={pingTarget}
            className="text-[10px] text-amber-400 hover:text-amber-300 underline font-mono shrink-0 cursor-pointer ml-auto"
          >
            [PING SECTOR]
          </button>
        </div>

        {/* Corner HUD Brackets */}
        <div className="absolute top-3 right-3 w-5 h-5 border-t-2 border-r-2 border-cyan-400 pointer-events-none z-10" />
        <div className="absolute bottom-3 left-3 w-5 h-5 border-b-2 border-l-2 border-cyan-400 pointer-events-none z-10" />
      </div>
    </div>
  );
}

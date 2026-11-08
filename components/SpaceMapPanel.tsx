"use client";

import { useCallback, useMemo, useState } from "react";
import PanelHeader from "./PanelHeader";
import { OrbitalSatellite, SpaceTelemetry } from "@/utils/types";
import { playBeep, playTargetLock } from "@/utils/soundFx";
import { Satellite, Sun, Moon, Radio, Activity, Disc } from "lucide-react";

interface SpaceMapPanelProps {
  space: SpaceTelemetry;
  userLat?: number;
  userLng?: number;
}

/* ---------- helpers ---------- */

const clamp = (v: number, min: number, max: number) =>
  Math.min(max, Math.max(min, v));

/**
 * Polar → CSS position (percent of the plot area).
 * Zenith (90°) = center, horizon (0°) = edge. Azimuth 0° = North (up).
 * Percent-based so it scales with the container (fully responsive).
 */
function polarPosition(azimuthDeg: number, elevationDeg: number, minR = 0) {
  const el = clamp(Number.isFinite(elevationDeg) ? elevationDeg : 0, 0, 90);
  const r = Math.max(minR, 50 * (1 - el / 90));
  const rad =
    (((Number.isFinite(azimuthDeg) ? azimuthDeg : 0) % 360) * Math.PI) / 180;
  return {
    left: `${50 + r * Math.sin(rad)}%`,
    top: `${50 - r * Math.cos(rad)}%`,
  };
}

const STATUS_STYLES: Record<string, string> = {
  ACQUIRED: "bg-emerald-950 text-emerald-400 border border-emerald-500/40",
  INTERCEPT: "bg-red-950 text-red-400 border border-red-500/40",
};
const STATUS_DEFAULT = "bg-cyan-950 text-cyan-400 border border-cyan-500/40";

const satIconColor = (sat: OrbitalSatellite, selected: boolean) =>
  selected
    ? "text-nexus-cyan drop-shadow-[0_0_8px_#00f0ff]"
    : sat.type === "SPACE_STATION"
      ? "text-nexus-emerald"
      : "text-nexus-amber";

function Stat({
  label,
  value,
  valueClass = "text-white",
}: {
  label: string;
  value: React.ReactNode;
  valueClass?: string;
}) {
  return (
    <div className="p-2 bg-panel border border-nexus-cyan-border space-y-1 min-w-0">
      <span className="text-nexus-cyan-dim text-[10px] sm:text-xs block truncate">
        {label}
      </span>
      <span className={`${valueClass} font-bold block truncate`}>{value}</span>
    </div>
  );
}

/* ---------- component ---------- */

export default function SpaceMapPanel({ space }: SpaceMapPanelProps) {
  const { satellites } = space;

  // Store only the id so the selection stays valid when live telemetry updates
  const [selectedId, setSelectedId] = useState<string | undefined>(
    satellites[0]?.id,
  );

  const selectedSat = useMemo(
    () => satellites.find((s) => s.id === selectedId) ?? satellites[0],
    [satellites, selectedId],
  );

  const selectSatellite = useCallback((sat: OrbitalSatellite) => {
    setSelectedId(sat.id);
    playBeep(1300, 0.05);
  }, []);

  const handleTaskSatellite = useCallback(() => playTargetLock(), []);

  // Sun: always rendered. Below the horizon it's pinned to the horizon ring.
  const sunAlt = Number.isFinite(space.sunAltitudeDeg)
    ? space.sunAltitudeDeg
    : 0;
  const sunBelowHorizon = sunAlt < 0;
  const sunPos = useMemo(
    () => polarPosition(space.sunAzimuthDeg, sunAlt, 8),
    [space.sunAzimuthDeg, sunAlt],
  );

  const satMarkers = useMemo(
    () =>
      satellites.map((sat) => ({
        sat,
        pos: polarPosition(sat.azimuthDeg, sat.elevationDeg),
      })),
    [satellites],
  );

  return (
    <div
      className="tactical-panel reveal w-full col-span-full"
      style={{ gridColumn: "1 / -1" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-2 p-3 border-b border-nexus-cyan-border bg-panel">
        <div className="flex items-center gap-2 flex-wrap min-w-0">
          <PanelHeader label="Orbital Intelligence (Satellite Tracking)" />
          <span className="text-xs bg-cyan-950/80 text-nexus-cyan border border-nexus-cyan/40 px-2 py-0.5 tracking-wider font-mono whitespace-nowrap">
            {satellites.length} Satellites
          </span>
        </div>

        <div className="hidden sm:flex shrink-0 text-xs text-nexus-emerald font-mono tracking-wider items-center gap-2">
          <span className="size-2 rounded-full bg-nexus-emerald animate-pulse" />
          <span>Orbital Ephemeris (Updated)</span>
        </div>
      </div>

      <div className="p-3 sm:p-4 grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5">
        {/* Left: Radar */}
        <div className="lg:col-span-7 flex items-center justify-center bg-panel border border-nexus-cyan-border p-3 sm:p-6 relative overflow-hidden">
          <div className="absolute inset-0 tactical-grid-bg opacity-30" />

          {/* Square, fluid radar. Outer box leaves room for N/E/S/W labels */}
          <div className="relative w-full max-w-md aspect-square">
            {/* Cardinal labels (outside the plot area) */}
            <span className="absolute top-0 left-1/2 -translate-x-1/2 text-xs sm:text-sm font-mono text-white font-bold">
              N
            </span>
            <span className="absolute bottom-0 left-1/2 -translate-x-1/2 text-xs sm:text-sm font-mono text-nexus-cyan-dim">
              S
            </span>
            <span className="absolute right-0 top-1/2 -translate-y-1/2 text-xs sm:text-sm font-mono text-nexus-cyan-dim">
              E
            </span>
            <span className="absolute left-0 top-1/2 -translate-y-1/2 text-xs sm:text-sm font-mono text-nexus-cyan-dim">
              W
            </span>

            {/* Plot area: everything is positioned in % relative to this */}
            <div className="absolute inset-[7%]">
              {/* Horizon 0° */}
              <div className="absolute inset-0 rounded-full border border-nexus-cyan-border" />
              {/* 30° ring */}
              <div className="absolute inset-[16.67%] rounded-full border border-dashed border-nexus-cyan-border" />
              {/* 60° ring */}
              <div className="absolute inset-[33.33%] rounded-full border border-nexus-cyan-border" />
              {/* Zenith dot */}
              <div className="absolute left-1/2 top-1/2 size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-nexus-cyan shadow-[0_0_10px_#00f0ff]" />

              {/* Cross axis */}
              <div className="absolute inset-x-0 top-1/2 h-px bg-nexus-cyan/20" />
              <div className="absolute inset-y-0 left-1/2 w-px bg-nexus-cyan/20" />

              {/* Sweep */}
              <div
                className="radar-sweep absolute inset-0 rounded-full pointer-events-none"
                style={{
                  background:
                    "conic-gradient(from 0deg, rgba(0, 240, 255, 0.8) 0deg, rgba(0, 240, 255, 0.05) 45deg, transparent 65deg)",
                }}
              />

              {/* Sun (always visible) */}
              <div
                className="absolute z-10 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                style={sunPos}
              >
                <div
                  className={`flex flex-col items-center ${
                    sunBelowHorizon ? "opacity-60" : ""
                  }`}
                >
                  <Sun
                    className="size-4 sm:size-5 text-amber-400 animate-spin"
                    style={{ animationDuration: "20s" }}
                  />
                  <span className="text-[9px] sm:text-xs text-amber-400 font-mono whitespace-nowrap bg-black/60 px-0.5">
                    SOL ({sunAlt}°{sunBelowHorizon ? " ↓" : ""})
                  </span>
                </div>
              </div>

              {/* Satellites */}
              {satMarkers.map(({ sat, pos }) => {
                const isSelected = selectedSat?.id === sat.id;
                return (
                  <div
                    key={sat.id}
                    className="absolute -translate-x-1/2 -translate-y-1/2"
                    style={{ ...pos, zIndex: isSelected ? 30 : 20 }}
                  >
                    <button
                      type="button"
                      onClick={() => selectSatellite(sat)}
                      aria-label={`${sat.name}, elevation ${sat.elevationDeg}°, azimuth ${sat.azimuthDeg}°`}
                      aria-pressed={isSelected}
                      title={`${sat.name} (El: ${sat.elevationDeg}°, Az: ${sat.azimuthDeg}°)`}
                      className="relative flex flex-col items-center cursor-pointer transition-transform hover:scale-125 focus-visible:scale-125 focus:outline-none"
                    >
                      {isSelected && (
                        <span className="absolute top-0 size-4 rounded-full border border-nexus-cyan animate-ping" />
                      )}
                      <Satellite
                        className={`size-3.5 sm:size-4 ${satIconColor(sat, isSelected)}`}
                      />
                      <span
                        className={`text-[8px] sm:text-[9px] font-mono tracking-tighter whitespace-nowrap px-1 bg-black/80 border ${
                          isSelected
                            ? "text-nexus-cyan border-nexus-cyan"
                            : "text-nexus-cyan-dim border-nexus-cyan-border"
                        }`}
                      >
                        {sat.id}
                      </span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="absolute bottom-1.5 left-2 right-2 sm:left-3 text-[10px] sm:text-sm text-nexus-crimson font-ubuntu leading-tight pr-24 sm:pr-0">
            Polar Celestial Projection - Zenith Center (90° Elevation)
          </div>

          <div className="absolute top-2 right-2 sm:right-3 text-[10px] sm:text-xs text-emerald-400 font-mono flex items-center gap-1.5">
            <Radio className="size-3 text-nexus-emerald animate-pulse" />
            Live Telemetry Stream
          </div>
        </div>

        {/* Right: Intel + environment */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          {selectedSat ? (
            <div className="bg-core border border-nexus-cyan-border p-3 sm:p-3.5 space-y-3">
              <div className="flex items-center justify-between gap-2 pb-2 border-b border-nexus-cyan-border">
                <div className="flex items-center gap-2 min-w-0">
                  <Satellite className="size-5 shrink-0 text-nexus-cyan" />
                  <span className="text-sm font-bold text-white tracking-wider font-hud truncate">
                    {selectedSat.id}
                  </span>
                </div>
                <span
                  className={`shrink-0 text-xs px-2 py-1 font-mono font-bold ${
                    STATUS_STYLES[selectedSat.trackingStatus] ?? STATUS_DEFAULT
                  }`}
                >
                  {selectedSat.trackingStatus}
                </span>
              </div>

              <div className="text-base font-bold text-nexus-cyan tracking-wide font-ubuntu wrap-break-word">
                {selectedSat.name}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-2 text-sm font-mono">
                <Stat label="NORAD CATALOG" value={selectedSat.noradId} />
                <Stat
                  label="ORBIT ALTITUDE"
                  value={`${selectedSat.altitudeKm} KM`}
                  valueClass="text-emerald-400"
                />
                <Stat
                  label="ORBITAL VELOCITY"
                  value={`${selectedSat.speedKmh.toLocaleString()} KM/H`}
                  valueClass="text-cyan-300"
                />
                <Stat
                  label="INCLINATION"
                  value={`${selectedSat.inclinationDeg}°`}
                />
                <Stat
                  label="ELEVATION ANGLE"
                  value={`${selectedSat.elevationDeg}°`}
                  valueClass="text-amber-400"
                />
                <Stat
                  label="AZIMUTH BEARING"
                  value={`${selectedSat.azimuthDeg.toFixed(3)}°`}
                  valueClass="text-cyan-300"
                />
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                <div className="text-[10px] sm:text-xs text-cyan-400/70 font-mono">
                  Next Zenith Pass:{" "}
                  <span className="text-emerald-400 font-bold">
                    In {selectedSat.overpassMinutes} Min
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleTaskSatellite}
                  className="btn-tactical px-3 py-1.5 text-xs font-bold tracking-wider border border-nexus-cyan text-nexus-cyan bg-transparent cursor-pointer flex items-center gap-1 group"
                >
                  <Disc className="size-4 group-hover:text-core" />
                  <span>[ TASK ASSET ]</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-core border border-nexus-cyan-border p-4 text-xs font-mono text-nexus-cyan-dim">
              NO SATELLITES IN VIEW
            </div>
          )}

          {/* Space environment */}
          <div className="bg-[#050b17] border border-nexus-cyan-border p-3 space-y-2 font-mono">
            <div className="text-[10px] text-cyan-400/50 tracking-wider">
              SPACE ENVIRONMENT &amp; SOLAR TELEMETRY
            </div>

            <div className="grid sm:grid-cols-2 gap-2">
              <div className="flex items-start gap-2 p-2 bg-[#03060c] border border-nexus-cyan-border min-w-0">
                <Moon className="size-4 mt-1 shrink-0 text-nexus-cyan" />
                <div className="min-w-0">
                  <span className="text-xs text-nexus-cyan-dim block">
                    Lunar Phase
                  </span>
                  <span className="text-white text-xs wrap-break-word">
                    {space.moonPhase}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-2 p-2 bg-[#03060c] border border-nexus-cyan-border min-w-0">
                <Activity className="size-4 mt-1 shrink-0 text-emerald-400" />
                <div className="min-w-0">
                  <span className="text-xs text-nexus-cyan-dim block">
                    Geomagnetic Activity
                  </span>
                  <span className="text-emerald-400 text-sm">
                    Kp {space.geomagneticKp}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Satellite selector */}
          {satellites.length > 0 && (
            <div className="space-y-1">
              <span className="text-xs text-nexus-cyan-dim font-mono tracking-widest block">
                SELECT RECON PLATFORM:
              </span>
              <div className="grid grid-cols-[repeat(auto-fit,minmax(4.5rem,1fr))] gap-1">
                {satellites.map((sat) => {
                  const active = selectedSat?.id === sat.id;
                  return (
                    <button
                      type="button"
                      key={sat.id}
                      onClick={() => selectSatellite(sat)}
                      aria-pressed={active}
                      className={`p-2 text-center font-mono text-xs border transition-all cursor-pointer truncate ${
                        active
                          ? "bg-cyan-500/20 border-cyan-400 text-cyan-300 font-bold"
                          : "bg-[#03060c] border-cyan-500/20 text-cyan-400/60 hover:border-nexus-cyan-dim"
                      }`}
                    >
                      {sat.id}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import PanelHeader from "./PanelHeader";
import { OrbitalSatellite, SpaceTelemetry } from "@/utils/types";
import { playBeep, playTargetLock } from "@/utils/soundFx";
import { Satellite, Sun, Moon, Radio, Activity, Disc } from "lucide-react";

interface SpaceMapPanelProps {
  space: SpaceTelemetry;
  userLat?: number;
  userLng?: number;
}

export default function SpaceMapPanel({ space }: SpaceMapPanelProps) {
  const [selectedSat, setSelectedSat] = useState<OrbitalSatellite>(
    space.satellites[0],
  );

  const selectSatellite = (sat: OrbitalSatellite) => {
    setSelectedSat(sat);
    playBeep(1300, 0.05);
  };

  const handleTaskSatellite = () => {
    playTargetLock();
  };

  return (
    <div
      className="tactical-panel reveal w-full"
      style={{ gridColumn: "1 / -1" }}
    >
      <div className="flex items-center justify-between p-3 border-b border-nexus-cyan-border bg-panel">
        <div className="flex items-center gap-2 flex-wrap">
          <PanelHeader label="Orbital Intelligence (Satellite Tracking)" />

          <span className="text-xs bg-cyan-950/80 text-nexus-cyan border border-nexus-cyan/40 px-2 py-0.5 tracking-wider font-mono">
            {space.satellites.length} Satellites
          </span>
        </div>

        <div className="hidden sm:flex text-xs text-nexus-emerald font-mono tracking-wider items-center gap-2">
          <span className="size-2 rounded-full bg-nexus-emtext-nexus-emerald animate-pulse" />
          <span>Orbital Ephemeris (Updated)</span>
        </div>
      </div>

      <div className="p-4 grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: Interactive Orbital Radar Display (7 cols) */}
        <div className="lg:col-span-7 flex flex-col items-center justify-center bg-panel border border-nexus-cyan-border p-4 relative overflow-hidden min-h-95">
          <div className="absolute inset-0 tactical-grid-bg opacity-30" />

          {/* Concentric Elevation Rings (Horizon 0°, 30°, 60°, Zenith 90°) */}
          <div className="relative w-[320px] h-80 sm:size-87.5 rounded-full border border-nexus-cyan-border flex items-center justify-center">
            {/* 30° elevation ring */}
            <div className="size-57.5 rounded-full border border-nexus-cyan-border border-dashed flex items-center justify-center">
              {/* 60° elevation ring */}
              <div className="size-30 rounded-full border border-nexus-cyan-border flex items-center justify-center">
                <div className="w-3 h-3 rounded-full bg-nexus-cyan shadow-[0_0_10px_#00f0ff]" />
              </div>
            </div>

            {/* Radar Cross Axis */}
            <div className="absolute w-full h-px bg-nexus-cyan/20" />
            <div className="absolute h-full w-px bg-nexus-cyan/20" />

            {/* Cardinal Direction Ticks */}
            <span className="absolute top-1 text-sm font-mono text-white font-bold">
              N
            </span>
            <span className="absolute bottom-1 text-sm font-mono text-nexus-cyan-dim">
              S
            </span>
            <span className="absolute right-2 text-sm font-mono text-nexus-cyan-dim">
              E
            </span>
            <span className="absolute left-2 text-sm font-mono text-nexus-cyan-dim">
              W
            </span>

            {/* Radar Sweep Effect */}
            <div
              className="radar-sweep absolute inset-0 rounded-full pointer-events-none"
              style={{
                background:
                  "conic-gradient(from 0deg, rgba(0, 240, 255, 0.8) 0deg, rgba(0, 240, 255, 0.05) 45deg, transparent 65deg)",
              }}
            />

            {/* Overhead Sun Indicator */}
            <div
              className="absolute pointer-events-none flex flex-col items-center"
              style={{
                transform: `rotate(${space.sunAzimuthDeg}deg) translateY(-${Math.max(20, 150 - space.sunAltitudeDeg * 1.5)}px) rotate(-${space.sunAzimuthDeg}deg)`,
              }}
            >
              <Sun
                className="w-5 h-5 text-amber-400 animate-spin"
                style={{ animationDuration: "20s" }}
              />
              <span className="text-xs text-amber-400 font-mono">
                SOL ({space.sunAltitudeDeg}°)
              </span>
            </div>

            {/* Satellites Plotted on Polar Radar */}
            {space.satellites.map((sat) => {
              const radius = 160 * (1 - sat.elevationDeg / 90);
              const isSelected = selectedSat.id === sat.id;

              return (
                <button
                  key={sat.id}
                  onClick={() => selectSatellite(sat)}
                  className="absolute cursor-pointer transition-transform hover:scale-125 focus:outline-none"
                  style={{
                    transform: `rotate(${sat.azimuthDeg}deg) translateY(-${radius}px) rotate(-${sat.azimuthDeg}deg)`,
                    zIndex: isSelected ? 30 : 20,
                  }}
                  title={`${sat.name} (El: ${sat.elevationDeg}°, Az: ${sat.azimuthDeg}°)`.toLocaleLowerCase()}
                >
                  <div className="relative flex flex-col items-center">
                    {isSelected && (
                      <div className="absolute -inset-2 rounded-full border border-nexus-cyan animate-ping" />
                    )}
                    <Satellite
                      className={`w-4 h-4 ${
                        isSelected
                          ? "text-nexus-cyan drop-shadow-[0_0_8px_#00f0ff]"
                          : sat.type === "SPACE_STATION"
                            ? "text-nexus-emerald"
                            : "text-nexus-amber"
                      }`}
                    />
                    <span
                      className={`text-[8px] font-mono tracking-tighter whitespace-nowrap px-1 bg-black/80 border ${
                        isSelected
                          ? "text-nexus-cyan border-nexus-cyan"
                          : "text-nexus-cyan-dim border-nexus-cyan-border"
                      }`}
                    >
                      {sat.id}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="absolute bottom-2 left-3 text-sm text-nexus-crimson font-ubuntu">
            Polar Celestial Projection - Zenith Center (90° Elevation)
          </div>

          <div className="absolute top-2 right-3 text-xs text-emerald-400 font-mono flex items-center gap-1.5">
            <Radio className="size-3 text-nexus-emerald animate-pulse" />
            Live Telemetry Stream
          </div>
        </div>

        {/* Right: Selected Satellite Intelligence & Space Weather (5 cols) */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
          <div className="bg-core border border-nexus-cyan-border p-3.5 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-nexus-cyan-border">
              <div className="flex items-center gap-2">
                <Satellite className="size-5 text-nexus-cyan" />
                <span className="text-sm font-bold text-white tracking-wider font-hud">
                  {selectedSat.id}
                </span>
              </div>
              <span
                className={`text-xs px-2 py-1 font-mono font-bold ${
                  selectedSat.trackingStatus === "ACQUIRED"
                    ? "bg-emerald-950 text-emerald-400 border border-emerald-500/40"
                    : selectedSat.trackingStatus === "INTERCEPT"
                      ? "bg-red-950 text-red-400 border border-red-500/40"
                      : "bg-cyan-950 text-cyan-400 border border-cyan-500/40"
                }`}
              >
                {selectedSat.trackingStatus}
              </span>
            </div>

            <div className="text-base font-bold text-nexus-cyan tracking-wide font-ubuntu">
              {selectedSat.name}
            </div>

            <div className="grid grid-cols-2 gap-2 text-sm font-mono">
              <div className="p-2 bg-panel border border-nexus-cyan-border space-y-1">
                <span className="text-nexus-cyan-dim text-xs block">
                  NORAD CATALOG
                </span>
                <span className="text-white font-bold">
                  {selectedSat.noradId}
                </span>
              </div>
              <div className="p-2 bg-[#03060c] border border-nexus-cyan-border space-y-1">
                <span className="text-nexus-cyan-dim text-xs block">
                  ORBIT ALTITUDE
                </span>
                <span className="text-emerald-400 font-bold">
                  {selectedSat.altitudeKm} KM
                </span>
              </div>
              <div className="p-2 bg-[#03060c] border border-nexus-cyan-border space-y-1">
                <span className="text-nexus-cyan-dim text-xs block">
                  ORBITAL VELOCITY
                </span>
                <span className="text-cyan-300 font-bold">
                  {selectedSat.speedKmh.toLocaleString()} KM/H
                </span>
              </div>
              <div className="p-2 bg-[#03060c] border border-nexus-cyan-border space-y-1">
                <span className="text-nexus-cyan-dim text-xs block">
                  INCLINATION
                </span>
                <span className="text-white">
                  {selectedSat.inclinationDeg}°
                </span>
              </div>
              <div className="p-2 bg-[#03060c] border border-nexus-cyan-border space-y-1">
                <span className="text-nexus-cyan-dim text-xs block">
                  ELEVATION ANGLE
                </span>
                <span className="text-amber-400 font-bold">
                  {selectedSat.elevationDeg}°
                </span>
              </div>
              <div className="p-2 bg-[#03060c] border border-nexus-cyan-border space-y-1">
                <span className="text-nexus-cyan-dim text-xs block">
                  AZIMUTH BEARING
                </span>
                <span className="text-cyan-300">
                  {selectedSat.azimuthDeg.toFixed(3)}°
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <div className="text-[10px] text-cyan-400/70 font-mono">
                Next Zenith Pass:{" "}
                <span className="text-emerald-400 font-bold">
                  In {selectedSat.overpassMinutes} Min
                </span>
              </div>

              <button
                onClick={handleTaskSatellite}
                className="btn-tactical px-3 py-1.5 text-xs font-bold tracking-wider border border-nexus-cyan text-nexus-cyan bg-transparent cursor-pointer flex items-center gap-1 group"
              >
                <Disc className="size-4 group-hover:text-core" />
                <span>[ TASK ASSET ]</span>
              </button>
            </div>
          </div>

          {/* Space Environment & Solar Weather */}
          <div className="bg-[#050b17] border border-nexus-cyan-border p-3 space-y-2 text-[11px] font-mono">
            <div className="text-[10px] text-cyan-400/50 tracking-wider">
              SPACE ENVIRONMENT &amp; SOLAR TELEMETRY
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-start gap-2 p-2 bg-[#03060c] border border-nexus-cyan-border">
                <Moon className="size-4 mt-1 text-nexus-cyan" />
                <div>
                  <span className="text-sm text-nexus-cyan-dim block">
                    Lunar Phase
                  </span>
                  <span className="text-white text-xs">{space.moonPhase}</span>
                </div>
              </div>

              <div className="flex items-start gap-2 p-2 bg-[#03060c] border border-nexus-cyan-border">
                <Activity className="size-4 mt-1 text-emerald-400" />
                <div>
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

          {/* Satellite Selection Carousel Tabs */}
          <div className="space-y-1">
            <span className="text-xs text-nexus-cyan-dim font-mono tracking-widest block">
              SELECT RECON PLATFORM:
            </span>
            <div className="grid grid-cols-5 gap-1">
              {space.satellites.map((sat) => (
                <button
                  key={sat.id}
                  onClick={() => selectSatellite(sat)}
                  className={`p-2 text-center font-mono text-xs border transition-all cursor-pointer truncate ${
                    selectedSat.id === sat.id
                      ? "bg-cyan-500/20 border-cyan-400 text-cyan-300 font-bold"
                      : "bg-[#03060c] border-cyan-500/20 text-cyan-400/60 hover:border-nexus-ctext-nexus-cyan-dim"
                  }`}
                >
                  {sat.id}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

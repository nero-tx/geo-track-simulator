"use client";

import { useState } from "react";
import PanelHeader from "./PanelHeader";
import { OrbitalSatellite, SpaceTelemetry } from "@/utils/types";
import { playBeep, playTargetLock } from "@/utils/soundFx";
import {
  Satellite,
  Sun,
  Moon,
  Radio,
  Activity,
  Disc
} from "lucide-react";

interface SpaceMapPanelProps {
  space: SpaceTelemetry;
  userLat?: number;
  userLng?: number;
}

export default function SpaceMapPanel({ space }: SpaceMapPanelProps) {
  const [selectedSat, setSelectedSat] = useState<OrbitalSatellite>(space.satellites[0]);

  const selectSatellite = (sat: OrbitalSatellite) => {
    setSelectedSat(sat);
    playBeep(1300, 0.05);
  };

  const handleTaskSatellite = () => {
    playTargetLock();
  };

  return (
    <div className="tactical-panel reveal w-full" style={{ gridColumn: "1 / -1" }}>
      <div className="flex items-center justify-between px-3 py-2 border-b border-cyan-500/20 bg-[#07101f]">
        <div className="flex items-center gap-2">
          <PanelHeader label="SPACE ORBITAL SURVEILLANCE // CELESTIAL SENSORS" />
          <span className="text-[10px] bg-cyan-950/80 text-cyan-400 border border-cyan-500/40 px-2 py-0.5 tracking-wider font-mono">
            {space.satellites.length} ORBITAL RECON ASSETS IN RANGE
          </span>
        </div>

        <div className="text-[11px] text-emerald-400 font-mono tracking-wider flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>CELESTIAL EPHEMERIS: SYNCHRONIZED</span>
        </div>
      </div>

      <div className="p-4 grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: Interactive Orbital Radar Display (7 cols) */}
        <div className="lg:col-span-7 flex flex-col items-center justify-center bg-[#03060d] border border-cyan-500/25 p-4 relative overflow-hidden min-h-[380px]">
          {/* Radar background grid */}
          <div className="absolute inset-0 tactical-grid-bg opacity-30" />

          {/* Concentric Elevation Rings (Horizon 0°, 30°, 60°, Zenith 90°) */}
          <div className="relative w-[320px] h-[320px] sm:w-[350px] sm:h-[350px] rounded-full border border-cyan-500/40 flex items-center justify-center">
            {/* 30° elevation ring */}
            <div className="w-[230px] h-[230px] rounded-full border border-cyan-500/25 border-dashed flex items-center justify-center">
              {/* 60° elevation ring */}
              <div className="w-[120px] h-[120px] rounded-full border border-cyan-500/30 flex items-center justify-center">
                {/* Zenith Center (Directly Overhead) */}
                <div className="w-3 h-3 rounded-full bg-cyan-400 shadow-[0_0_10px_#00f0ff]" />
              </div>
            </div>

            {/* Radar Cross Axis */}
            <div className="absolute w-full h-px bg-cyan-500/20" />
            <div className="absolute h-full w-px bg-cyan-500/20" />

            {/* Cardinal Direction Ticks */}
            <span className="absolute top-1 text-[10px] font-mono text-cyan-400 font-bold">N</span>
            <span className="absolute bottom-1 text-[10px] font-mono text-cyan-400/60">S</span>
            <span className="absolute right-2 text-[10px] font-mono text-cyan-400/60">E</span>
            <span className="absolute left-2 text-[10px] font-mono text-cyan-400/60">W</span>

            {/* Radar Sweep Effect */}
            <div
              className="radar-sweep absolute inset-0 rounded-full pointer-events-none"
              style={{
                background:
                  "conic-gradient(from 0deg, rgba(0, 240, 255, 0.28) 0deg, rgba(0, 240, 255, 0.05) 45deg, transparent 65deg)"
              }}
            />

            {/* Overhead Sun Indicator */}
            <div
              className="absolute pointer-events-none flex flex-col items-center"
              style={{
                transform: `rotate(${space.sunAzimuthDeg}deg) translateY(-${Math.max(20, 150 - space.sunAltitudeDeg * 1.5)}px) rotate(-${space.sunAzimuthDeg}deg)`
              }}
            >
              <Sun className="w-5 h-5 text-amber-400 animate-spin" style={{ animationDuration: "20s" }} />
              <span className="text-[8px] text-amber-400 font-mono">SOL ({space.sunAltitudeDeg}°)</span>
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
                    zIndex: isSelected ? 30 : 20
                  }}
                  title={`${sat.name} (El: ${sat.elevationDeg}°, Az: ${sat.azimuthDeg}°)`}
                >
                  <div className="relative flex flex-col items-center">
                    {isSelected && (
                      <div className="absolute -inset-2 rounded-full border border-cyan-400 animate-ping" />
                    )}
                    <Satellite
                      className={`w-4 h-4 ${
                        isSelected
                          ? "text-cyan-300 drop-shadow-[0_0_8px_#00f0ff]"
                          : sat.type === "SPACE_STATION"
                          ? "text-emerald-400"
                          : "text-amber-400"
                      }`}
                    />
                    <span
                      className={`text-[8px] font-mono tracking-tighter whitespace-nowrap px-1 bg-black/80 border ${
                        isSelected ? "text-cyan-300 border-cyan-400" : "text-cyan-400/60 border-cyan-500/20"
                      }`}
                    >
                      {sat.id}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="absolute bottom-2 left-3 text-[10px] text-cyan-400/60 font-mono">
            POLAR CELESTIAL PROJECTION // ZENITH CENTER (90° ELEVATION)
          </div>
          <div className="absolute top-2 right-3 text-[10px] text-emerald-400 font-mono flex items-center gap-1.5">
            <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
            LIVE TELEMETRY FEED
          </div>
        </div>

        {/* Right: Selected Satellite Intelligence & Space Weather (5 cols) */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
          {/* Selected Asset Dossier Card */}
          <div className="bg-[#050b17] border border-cyan-500/30 p-3.5 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-cyan-500/20">
              <div className="flex items-center gap-2">
                <Satellite className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-bold text-white tracking-wider" style={{ fontFamily: "var(--font-hud)" }}>
                  {selectedSat.id} {"// DOSSIER"}
                </span>
              </div>
              <span
                className={`text-[9px] px-2 py-0.5 font-mono font-bold ${
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

            <div className="text-[12px] font-bold text-cyan-300 tracking-wide font-mono">
              {selectedSat.name}
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
              <div className="p-1.5 bg-[#03060c] border border-cyan-500/15">
                <span className="text-cyan-400/40 text-[9px] block">NORAD CATALOG</span>
                <span className="text-white font-bold">{selectedSat.noradId}</span>
              </div>
              <div className="p-1.5 bg-[#03060c] border border-cyan-500/15">
                <span className="text-cyan-400/40 text-[9px] block">ORBIT ALTITUDE</span>
                <span className="text-emerald-400 font-bold">{selectedSat.altitudeKm} KM</span>
              </div>
              <div className="p-1.5 bg-[#03060c] border border-cyan-500/15">
                <span className="text-cyan-400/40 text-[9px] block">ORBITAL VELOCITY</span>
                <span className="text-cyan-300 font-bold">{selectedSat.speedKmh.toLocaleString()} KM/H</span>
              </div>
              <div className="p-1.5 bg-[#03060c] border border-cyan-500/15">
                <span className="text-cyan-400/40 text-[9px] block">INCLINATION</span>
                <span className="text-white">{selectedSat.inclinationDeg}°</span>
              </div>
              <div className="p-1.5 bg-[#03060c] border border-cyan-500/15">
                <span className="text-cyan-400/40 text-[9px] block">ELEVATION ANGLE</span>
                <span className="text-amber-400 font-bold">{selectedSat.elevationDeg}°</span>
              </div>
              <div className="p-1.5 bg-[#03060c] border border-cyan-500/15">
                <span className="text-cyan-400/40 text-[9px] block">AZIMUTH BEARING</span>
                <span className="text-cyan-300">{selectedSat.azimuthDeg}°</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <div className="text-[10px] text-cyan-400/70 font-mono">
                NEXT OVERPASS ZENITH: <span className="text-emerald-400 font-bold">IN {selectedSat.overpassMinutes} MIN</span>
              </div>

              <button
                onClick={handleTaskSatellite}
                className="btn-tactical px-3 py-1.5 text-[10px] font-bold tracking-wider border border-cyan-400 text-cyan-400 bg-transparent cursor-pointer flex items-center gap-1"
              >
                <Disc className="w-3 h-3 text-cyan-400" />
                <span>[ TASK ASSET ]</span>
              </button>
            </div>
          </div>

          {/* Space Environment & Solar Weather */}
          <div className="bg-[#050b17] border border-cyan-500/20 p-3 space-y-2 text-[11px] font-mono">
            <div className="text-[10px] text-cyan-400/50 tracking-wider">
              SPACE ENVIRONMENT &amp; SOLAR TELEMETRY
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center gap-2 p-1.5 bg-[#03060c] border border-cyan-500/10">
                <Moon className="w-4 h-4 text-cyan-400" />
                <div>
                  <span className="text-[9px] text-cyan-400/40 block">LUNAR PHASE</span>
                  <span className="text-white text-[10px]">{space.moonPhase}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 p-1.5 bg-[#03060c] border border-cyan-500/10">
                <Activity className="w-4 h-4 text-emerald-400" />
                <div>
                  <span className="text-[9px] text-cyan-400/40 block">GEOMAGNETIC Kp</span>
                  <span className="text-emerald-400 text-[10px]">Kp {space.geomagneticKp} {"// QUIET"}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Satellite Selection Carousel Tabs */}
          <div className="space-y-1">
            <span className="text-[9px] text-cyan-400/50 font-mono tracking-widest block">
              SELECT RECON PLATFORM:
            </span>
            <div className="grid grid-cols-5 gap-1">
              {space.satellites.map((sat) => (
                <button
                  key={sat.id}
                  onClick={() => selectSatellite(sat)}
                  className={`p-1.5 text-center font-mono text-[9px] border transition-all cursor-pointer truncate ${
                    selectedSat.id === sat.id
                      ? "bg-cyan-500/20 border-cyan-400 text-cyan-300 font-bold"
                      : "bg-[#03060c] border-cyan-500/20 text-cyan-400/60 hover:border-cyan-400/40"
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

"use client";

import PanelHeader from "./PanelHeader";
import { ShieldAlert, Crosshair, Satellite, MapPin, Activity, Terminal } from "lucide-react";

const capabilities = [
  { icon: Crosshair, label: "Exact Browser GNSS Triangulation (High-Accuracy Lat/Lng)" },
  { icon: MapPin, label: "Physical Street-Level Reverse Geocode (OSM Nominatim)" },
  { icon: Satellite, label: "Overhead Reconnaissance Spy Satellites & Celestial Radar" },
  { icon: Activity, label: "Real Atmospheric & Environmental Telemetry (Open-Meteo)" },
  { icon: Terminal, label: "Hardware GPU, CPU Concurrency & Carrier Fingerprint" },
  { icon: ShieldAlert, label: "Strategic Proximity Matrix to World Intelligence Hubs" }
];

export default function MissionBrief() {
  return (
    <div className="tactical-panel font-mono">
      <div className="flex items-center justify-between px-3 py-2 border-b border-cyan-500/20 bg-[#07101f]">
        <PanelHeader label="MISSION DIRECTIVE // BLACKBRIAR RECON" />
        <span className="text-[10px] text-amber-400 font-bold">
          CLASSIFIED // EYES ONLY
        </span>
      </div>

      <div className="p-3">
        <ul className="space-y-1.5">
          {capabilities.map(({ icon: Icon, label }) => (
            <li
              key={label}
              className="text-xs py-1 flex items-center gap-2 text-cyan-300/80 border-b border-cyan-500/10"
            >
              <Icon className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
              <span>{label}</span>
            </li>
          ))}
        </ul>

        <div className="mt-3 p-2 bg-[#03060c] border border-cyan-500/20 text-[10px] text-cyan-400/60 leading-relaxed">
          <span className="text-amber-400 font-bold block mb-0.5">AUTHORIZATION PROTOCOL:</span>
          Initiating scan commands browser GPS permissions. If denied or timed out, system automatically fails over to telecommunications cell tower approximations.
        </div>
      </div>
    </div>
  );
}

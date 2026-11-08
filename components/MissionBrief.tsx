"use client";

import PanelHeader from "./PanelHeader";
import {
  ShieldAlert,
  Crosshair,
  Satellite,
  MapPin,
  Activity,
  Terminal,
} from "lucide-react";

const capabilities = [
  {
    icon: Crosshair,
    label: "High-Precision Browser Geolocation & GNSS Positioning",
  },
  {
    icon: MapPin,
    label: "Street-Level Reverse Geocoding & Address Resolution",
  },
  {
    icon: Satellite,
    label: "Satellite Imagery & Orbital Intelligence Tracking",
  },
  {
    icon: Activity,
    label: "Live Atmospheric & Environmental Telemetry",
  },
  {
    icon: Terminal,
    label: "Hardware Profiling, CPU Concurrency & Network Fingerprinting",
  },
  {
    icon: ShieldAlert,
    label: "Strategic Proximity Analysis & Intelligence Hub Mapping",
  },
];

export default function MissionBrief() {
  return (
    <div className="tactical-panel font-ubuntu">
      <div className="flex items-center justify-between p-3 border-b border-nexus-cyan-border bg-panel">
        <PanelHeader label="Operational Intelligence || Field Recon" />
        <span className="hidden sm:inline-block text-xs text-nexus-amber font-bold">
          Restricted // Level 04
        </span>
      </div>

      <div className="p-3">
        <ul className="space-y-1.5">
          {capabilities.map(({ icon: Icon, label }) => (
            <li
              key={label}
              className="text-sm py-1 flex items-center gap-2 text-nexus-cyan border-b border-nexus-cyan-border"
            >
              <Icon className="size-4 text-nexus-cyan shrink-0" />
              <span>{label}</span>
            </li>
          ))}
        </ul>

        <div className="mt-3 p-2 bg-core border border-nexus-cyan-border text-sm text-white leading-relaxed">
          <span className="text-nexus-amber font-bold block mb-0.5 text-base">
            Authorization Protocol:
          </span>
          Initiating Browser-Based GNSS Acquisition. If Permission Is Denied Or
          The Request Times Out, The System Automatically Falls Back To Cellular
          Network Triangulation For Approximate Positioning.
        </div>
      </div>
    </div>
  );
}

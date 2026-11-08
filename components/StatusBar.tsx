"use client";

import { ShieldCheck, Satellite, Cpu, Globe } from "lucide-react";

const dots = [
  {
    icon: Globe,
    color: "#00f0ff",
    label: "Global Intelligence Network // Operational",
  },
  {
    icon: ShieldCheck,
    color: "#00ff88",
    label: "Military-Grade Encryption // AES-256",
  },
  {
    icon: Satellite,
    color: "#ffaa00",
    label: "Orbital Surveillance Array // Locked",
  },
  {
    icon: Cpu,
    color: "#8a63ff",
    label: "Nexus Command Matrix // Online",
  },
];

export default function StatusBar() {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 p-4 py-5 tracking-wider font-ubuntu bg-core border-b border-nexus-cyan-border text-nexus-cyan-dim">
      <div className="flex flex-wrap gap-x-4 gap-y-2 items-center text-sm">
        {dots.map((d) => {
          const Icon = d.icon;
          return (
            <span
              key={d.label}
              className="flex items-center gap-1.5"
              style={{
                color: d.color,
              }}
            >
              <span
                className="pulse-dot inline-block rounded-full size-2"
                style={{
                  background: d.color,
                }}
              />
              <Icon className="size-4 shrink-0" />
              <span>{d.label}</span>
            </span>
          );
        })}
      </div>
      
      <div className="hidden sm:flex items-center gap-2 text-nexus-cyan text-sm">
        <span>Security Sector: 07-Bravo</span>
        <span>•</span>
        <span className="text-nexus-emerald font-bold">
          All Sensors Nominal
        </span>
      </div>
    </div>
  );
}

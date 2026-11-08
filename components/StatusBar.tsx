"use client";

import { ShieldCheck, Satellite, Cpu, Globe } from "lucide-react";

const dots = [
  { icon: Globe, color: "#00f0ff", label: "GLOBAL SURVEILLANCE GRID // ACTIVE" },
  { icon: ShieldCheck, color: "#00ff88", label: "QUANTUM ENCRYPTION // SHA-512" },
  { icon: Satellite, color: "#ffaa00", label: "ORBITAL RECON SATS // 5 ACQUIRED" },
  { icon: Cpu, color: "#8a63ff", label: "PALANTIR GOTHAM MATRIX // ONLINE" }
];

export default function StatusBar() {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2 text-[10px] tracking-wider font-mono bg-[#03060c] border-b border-cyan-500/15 text-cyan-400/70">
      <div className="flex flex-wrap gap-x-5 gap-y-1 items-center">
        {dots.map((d) => {
          const Icon = d.icon;
          return (
            <span key={d.label} className="flex items-center gap-1.5">
              <span
                className="pulse-dot inline-block rounded-full"
                style={{
                  width: 6,
                  height: 6,
                  background: d.color
                }}
              />
              <Icon className="w-3 h-3 text-cyan-400" />
              <span>{d.label}</span>
            </span>
          );
        })}
      </div>

      <div className="hidden md:flex items-center gap-2 text-cyan-400/50">
        <span>SECURITY SECTOR: 07-BRAVO</span>
        <span>•</span>
        <span className="text-emerald-400 font-bold">ALL SENSORS NOMINAL</span>
      </div>
    </div>
  );
}

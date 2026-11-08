"use client";

import { ScanPhase } from "@/utils/types";
import PanelHeader from "./PanelHeader";
import { playBeep, playScanChirp } from "@/utils/soundFx";
import { Crosshair, RefreshCw } from "lucide-react";

interface ScanControlProps {
  phase: ScanPhase;
  logMsg?: string;
  onScan: () => void;
  onReset: () => void;
}

const phaseLabel: Record<ScanPhase, string> = {
  idle: "_ AWAITING OPERATOR LAUNCH AUTHORIZATION...",
  uplink: "> INITIALIZING QUANTUM-ENCRYPTED SATELLITE UPLINK...",
  satellite: "> INTERROGATING TELECOM NODES & PUBLIC IP REGISTRY...",
  gps: "> ACQUIRING HIGH-ACCURACY BROWSER GNSS SENSORS...",
  reverse_geo: "> RESOLVING STREET-LEVEL PHYSICAL ADDRESS VIA NOMINATIM...",
  space_orbital: "> COMPUTING ORBITAL RECON SATELLITE OVERPASS VECTORS...",
  telemetry: "> SYNCHRONIZING REAL LOCAL ATMOSPHERIC & NETWORK TELEMETRY...",
  fingerprint: "> COMPILING HARDWARE FINGERPRINT & STRATEGIC PROXIMITY...",
  done: "✓ PALANTIR OMNI-LOCK COMPLETE — DOSSIER ASSEMBLED & ACTIVE"
};

export default function ScanControl({ phase, onScan, onReset }: ScanControlProps) {
  const busy = phase !== "idle" && phase !== "done";
  const done = phase === "done";

  const handleScanClick = () => {
    playScanChirp();
    onScan();
  };

  const handleResetClick = () => {
    playBeep(700, 0.08);
    onReset();
  };

  return (
    <div className="tactical-panel">
      <div className="flex items-center justify-between px-3 py-2 border-b border-cyan-500/20 bg-[#07101f]">
        <PanelHeader label="MISSION INITIATION &amp; TARGET LOCK" />
        <span className="text-[10px] text-cyan-400/60 font-mono">
          DIRECTIVE 94 // OMNI
        </span>
      </div>

      <div className="p-4 flex flex-col gap-3 font-mono">
        <button
          onClick={handleScanClick}
          disabled={busy || done}
          className="btn-tactical w-full py-4 text-sm font-black tracking-[3px] disabled:opacity-40 disabled:cursor-not-allowed border border-cyan-400 text-cyan-300 bg-transparent flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_15px_rgba(0,240,255,0.15)]"
        >
          <Crosshair className="w-4 h-4 text-cyan-400 animate-spin" style={{ animationDuration: busy ? "2s" : "12s" }} />
          <span>[ INITIATE TARGET ACQUISITION &amp; LOCK ]</span>
        </button>

        {/* Phase Status Readout */}
        <div
          className="text-[11px] leading-relaxed min-h-12 tracking-[0.5px] p-2.5 bg-[#03060c] border border-cyan-500/20 flex items-center"
          style={{
            color:
              phase === "done"
                ? "#00ff88"
                : phase === "idle"
                ? "rgba(0, 240, 255, 0.45)"
                : "#ffaa00"
          }}
        >
          {busy && (
            <span
              className="inline-block mr-2.5 rounded-full border-2 border-cyan-400/30 border-t-amber-400 animate-spin w-3.5 h-3.5 flex-shrink-0"
            />
          )}
          <span>{phaseLabel[phase]}</span>
        </div>

        {done && (
          <div className="flex items-center justify-between pt-1">
            <span className="text-[10px] text-emerald-400/80">
              TARGET LOCKED // RECON ACTIVE
            </span>
            <button
              onClick={handleResetClick}
              className="text-[11px] tracking-[1px] text-cyan-400/50 hover:text-amber-400 transition-colors cursor-pointer flex items-center gap-1 font-mono"
            >
              <RefreshCw className="w-3 h-3" />
              <span>{"// RE-INITIALIZE TARGET RADAR"}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

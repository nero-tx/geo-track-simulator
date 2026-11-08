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
  idle: "_ Awaiting Operator Authorization...",
  uplink: "> Establishing Secure Satellite Communications...",
  satellite: "> Querying Telecom Infrastructure & Public IP Registry...",
  gps: "> Acquiring High-Precision GNSS Positioning Data...",
  reverse_geo: "> Resolving Geographic Coordinates To Physical Address...",
  space_orbital: "> Calculating Orbital Trajectories & Satellite Coverage...",
  telemetry: "> Synchronizing Environmental & Network Telemetry...",
  fingerprint: "> Collecting Hardware Fingerprint & Network Metadata...",
  done: "✓ Data Acquisition Complete — All Available Records Collected",
};

export default function ScanControl({
  phase,
  onScan,
  onReset,
}: ScanControlProps) {
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
      <div className="flex items-center justify-between p-3 border-b border-nexus-cyan-border bg-panel">
        <PanelHeader label="Target Acquisition || Initialization" />
        <span className="hidden sm:inline-block text-xs text-cyan-400/60 font-mono">
          Protocol 94 // Geospatial
        </span>
      </div>

      <div className="p-4 flex flex-col gap-3 font-mono">
        <button
          onClick={handleScanClick}
          disabled={busy || done}
          className="btn-tactical w-full py-4 text-sm font-black tracking-[3px] disabled:opacity-40 disabled:cursor-not-allowed border border-cyan-400 text-cyan-300 bg-transparent flex flex-col sm:flex-row items-center justify-center gap-2 cursor-pointer shadow-[0_0_15px_rgba(0,240,255,0.15)] group"
        >
          <Crosshair
            className="size-5 sm:size-4 text-nexus-cyan animate-spin group-hover:text-core"
            style={{ animationDuration: busy ? "2s" : "12s" }}
          />
          <span>[ Initiate Geospatial Data Acquisition ]</span>
        </button>

        {/* Phase Status Readout */}
        <div
          className="text-xs leading-relaxed min-h-12 tracking-[0.5px] p-2.5 bg-[#03060c] border border-nexus-cyan-border flex items-center"
          style={{
            color:
              phase === "done"
                ? "#00ff88"
                : phase === "idle"
                  ? "rgba(0, 240, 255, 0.45)"
                  : "#ffaa00",
          }}
        >
          {busy && (
            <span className="inline-block mr-2.5 rounded-full border-2 border-nexus-cyan-border border-t-nexus-amber animate-spin w-3.5 h-3.5 shrink-0" />
          )}
          <span>{phaseLabel[phase]}</span>
        </div>

        {done && (
          <div className="flex items-center justify-between pt-1 flex-wrap gap-2">
            <span className="text-xs text-nexus-emerald">
              Acquisition Active || Target Coordinates Resolved
            </span>
            <button
              onClick={handleResetClick}
              className="text-[11px] tracking-[1px] text-nexus-cyan-dim hover:text-nexus-amber transition-colors cursor-pointer flex items-center gap-1 font-mono p-1"
            >
              <RefreshCw className="size-3 shrink-0" />
              <span>{"|| Reinitialize Acquisition"}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

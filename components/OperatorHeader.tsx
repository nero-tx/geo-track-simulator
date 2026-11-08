"use client";

import { useEffect, useState } from "react";
import { OperatorProfile } from "@/utils/avatarGenerator";
import { DefconLevel } from "@/utils/types";
import { playBeep, isSoundEnabled, setSoundMuted } from "@/utils/soundFx";
import {
  Radio,
  Volume2,
  VolumeX,
  Pencil,
  ShieldAlert,
  Clock
} from "lucide-react";

interface OperatorHeaderProps {
  operator: OperatorProfile;
  defcon: DefconLevel;
  onSetDefcon: (level: DefconLevel) => void;
  onEditOperator: () => void;
}

export default function OperatorHeader({
  operator,
  defcon,
  onSetDefcon,
  onEditOperator
}: OperatorHeaderProps) {
  const [timeUtc, setTimeUtc] = useState("");
  const [timeLangley, setTimeLangley] = useState("");
  const [timeLocal, setTimeLocal] = useState("");
  const [soundOn, setSoundOn] = useState(() => isSoundEnabled());

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setTimeUtc(now.toISOString().slice(11, 19) + "Z");

      // Langley, VA is US Eastern Time (America/New_York)
      try {
        const langleyFormatter = new Intl.DateTimeFormat("en-US", {
          timeZone: "America/New_York",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false
        });
        setTimeLangley(langleyFormatter.format(now));
      } catch {
        setTimeLangley("--:--:--");
      }

      const localFormatter = new Intl.DateTimeFormat("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false
      });
      setTimeLocal(localFormatter.format(now));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const toggleSound = () => {
    const next = !soundOn;
    setSoundOn(next);
    setSoundMuted(!next);
    if (next) playBeep(1200, 0.08);
  };

  const cycleDefcon = () => {
    playBeep(600, 0.1);
    const next = (defcon === 1 ? 5 : defcon - 1) as DefconLevel;
    onSetDefcon(next);
  };

  const defconColors: Record<DefconLevel, { text: string; bg: string; border: string }> = {
    1: { text: "text-red-400", bg: "bg-red-950/70", border: "border-red-500" },
    2: { text: "text-amber-400", bg: "bg-amber-950/70", border: "border-amber-500" },
    3: { text: "text-yellow-400", bg: "bg-yellow-950/70", border: "border-yellow-500" },
    4: { text: "text-cyan-400", bg: "bg-cyan-950/70", border: "border-cyan-500" },
    5: { text: "text-emerald-400", bg: "bg-emerald-950/70", border: "border-emerald-500" }
  };

  return (
    <header className="tactical-panel border-b border-cyan-500/20 bg-[#050b17]/95 sticky top-0 z-40 backdrop-blur-md">
      {/* Top Security Banner */}
      <div className="bg-[#03060c] border-b border-cyan-500/15 px-4 py-1 flex items-center justify-between text-[10px] font-mono tracking-widest text-cyan-400/60">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-cyan-300">
            <Radio className="w-3 h-3 text-cyan-400 animate-pulse" />
            PALANTIR GOTHAM // OMNI-SURVEILLANCE
          </span>
          <span className="hidden md:inline text-cyan-400/30">|</span>
          <span className="hidden md:inline text-amber-400/90 font-bold">
            TOP SECRET // SCI // NOFORN
          </span>
          <span className="hidden lg:inline text-cyan-400/30">|</span>
          <span className="hidden lg:inline text-cyan-400/70">
            PROJECT: BLACKBRIAR // GLOBAL GRID RECON
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            <span className="font-bold">GLOBAL GRID: ONLINE</span>
          </div>
          <button
            onClick={toggleSound}
            title={soundOn ? "Mute Tactical Audio" : "Enable Tactical Audio"}
            className="flex items-center gap-1 text-cyan-400/70 hover:text-cyan-300 transition-colors cursor-pointer"
          >
            {soundOn ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5 text-red-400" />}
            <span className="hidden sm:inline">{soundOn ? "SFX ON" : "MUTED"}</span>
          </button>
        </div>
      </div>

      {/* Main Header Operator Hub */}
      <div className="px-4 py-3 flex flex-wrap items-center justify-between gap-4">
        {/* Left: Controlling Operator Profile */}
        <div className="flex items-center gap-3.5">
          <div className="relative group cursor-pointer" onClick={onEditOperator} title="Click to modify Callsign">
            <div className="w-13 h-13 border-2 border-cyan-400 p-0.5 bg-black relative shadow-[0_0_12px_rgba(0,240,255,0.3)]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={operator.avatarDataUrl}
                alt={operator.codename}
                className="w-full h-full object-cover"
              />
              <div className="absolute -bottom-1 -right-1 bg-cyan-400 text-[#040810] text-[8px] font-black px-1 leading-tight tracking-tighter">
                LVL5
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span
                className="text-base md:text-lg font-black text-white tracking-wider"
                style={{ fontFamily: "var(--font-hud)" }}
              >
                {operator.codename}
              </span>
              <button
                onClick={onEditOperator}
                title="Edit Callsign"
                className="text-cyan-400/50 hover:text-cyan-300 transition-colors cursor-pointer p-0.5"
              >
                <Pencil className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="text-[11px] text-emerald-400 font-mono tracking-wider flex items-center gap-1.5">
              <span>{operator.rank}</span>
            </div>

            <div className="text-[10px] text-cyan-400/60 font-mono tracking-tight flex items-center gap-2">
              <span className="text-cyan-400/80">{operator.agentId}</span>
              <span>•</span>
              <span className="text-amber-400/90 font-medium">OMNI-COMMAND // WORLD GRID CONTROLLER</span>
            </div>
          </div>
        </div>

        {/* Center / Right: Live Theaters Clocks & Defcon */}
        <div className="flex flex-wrap items-center gap-3 md:gap-5 ml-auto">
          {/* Tactical Clocks */}
          <div className="hidden sm:flex items-center gap-3 bg-[#03060c] border border-cyan-500/20 px-3 py-1.5 font-mono text-[11px]">
            <Clock className="w-3.5 h-3.5 text-cyan-400/60" />
            <div>
              <span className="text-cyan-400/40 text-[9px] block">ZULU / UTC</span>
              <span className="text-cyan-300 font-bold">{timeUtc || "12:00:00Z"}</span>
            </div>
            <div className="w-px h-6 bg-cyan-500/20" />
            <div>
              <span className="text-cyan-400/40 text-[9px] block">LANGLEY (EST)</span>
              <span className="text-cyan-300">{timeLangley || "08:00:00"}</span>
            </div>
            <div className="w-px h-6 bg-cyan-500/20" />
            <div>
              <span className="text-cyan-400/40 text-[9px] block">LOCAL TIME</span>
              <span className="text-emerald-400">{timeLocal || "15:00:00"}</span>
            </div>
          </div>

          {/* DEFCON Controller */}
          <button
            onClick={cycleDefcon}
            title="Cycle Defense Readiness Condition"
            className={`flex items-center gap-2 px-3 py-1.5 border font-mono text-xs cursor-pointer transition-all ${defconColors[defcon].bg} ${defconColors[defcon].border}`}
          >
            <ShieldAlert className={`w-4 h-4 ${defconColors[defcon].text}`} />
            <div className="text-left">
              <div className="text-[9px] text-white/50 tracking-widest leading-none">STATUS</div>
              <div className={`font-black tracking-widest text-[11px] ${defconColors[defcon].text}`}>
                DEFCON {defcon}
              </div>
            </div>
          </button>
        </div>
      </div>
    </header>
  );
}

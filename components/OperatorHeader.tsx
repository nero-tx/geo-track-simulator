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
  Clock,
} from "lucide-react";
import { getFormattedTime, getUtcTime } from "@/utils/time";
import Image from "next/image";

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
  onEditOperator,
}: OperatorHeaderProps) {
  const [timeUtc, setTimeUtc] = useState("");
  const [timeLangley, setTimeLangley] = useState("");
  const [timeLocal, setTimeLocal] = useState("");
  const [soundOn, setSoundOn] = useState(() => isSoundEnabled());

  useEffect(() => {
    const updateTime = () => {
      setTimeUtc(getUtcTime());
      setTimeLocal(getFormattedTime());
      setTimeLangley(
        getFormattedTime(Intl.DateTimeFormat().resolvedOptions().timeZone),
      );
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);

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

  const defconColors: Record<
    DefconLevel,
    { text: string; bg: string; border: string }
  > = {
    1: { text: "text-red-400", bg: "bg-red-950/70", border: "border-red-500" },
    2: {
      text: "text-amber-400",
      bg: "bg-amber-950/70",
      border: "border-amber-500",
    },
    3: {
      text: "text-yellow-400",
      bg: "bg-yellow-950/70",
      border: "border-yellow-500",
    },
    4: {
      text: "text-cyan-400",
      bg: "bg-cyan-950/70",
      border: "border-cyan-500",
    },
    5: {
      text: "text-emerald-400",
      bg: "bg-emerald-950/70",
      border: "border-emerald-500",
    },
  };

  return (
    <header className="tactical-panel font-ubuntu border-b border-cyan-500/20 bg-panel/95 sticky top-0 z-40 backdrop-blur-md">
      {/* Top Security Banner */}
      <div className="bg-core border-b border-nexus-cyan-border p-4 flex items-center justify-between text-[10px] font-mono tracking-widest text-cyan-400/60">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-nexus-cyan text-base font-semibold">
            <Radio className="size-6 text-nexus-cyan animate-pulse" />
            NEXUS
          </span>
          <span className="hidden lg:inline text-cyan-400/40 text-sm">|</span>
          <span className="hidden lg:inline text-cyan-400/70 text-sm">
            PROJECT: BLACKBRIAR - GLOBAL GRID RECON
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-nexus-emerald">
            <span className="w-1.5 h-1.5 rounded-full bg-nexus-emerald animate-ping" />
            <span className="font-bold text-sm">STATUS: ONLINE</span>
          </div>
          <button
            onClick={toggleSound}
            title={soundOn ? "Mute Tactical Audio" : "Enable Tactical Audio"}
            className="flex items-center gap-1 text-cyan-400/70 hover:text-cyan-300 transition-colors cursor-pointer"
          >
            {soundOn ? (
              <Volume2 className="size-4" />
            ) : (
              <VolumeX className="size-4 text-red-400" />
            )}
            <span className="hidden sm:inline text-xs">
              {soundOn ? "SFX ON" : "MUTED"}
            </span>
          </button>
        </div>
      </div>

      {/* Main Header Operator Hub */}
      <div className="p-4 flex flex-wrap items-center justify-between gap-4">
        {/* Left: Controlling Operator Profile */}
        <div className="flex items-center gap-3.5">
          <div
            className="relative group cursor-pointer"
            onClick={onEditOperator}
            title="Click to modify Callsign"
          >
            <div className="size-15 border-2 border-cyan-400 p-0.5 bg-black relative shadow-[0_0_12px_rgba(0,240,255,0.3)]">
              <Image
                src={operator.avatarDataUrl}
                alt={operator.codename}
                className="w-full h-full object-cover"
                width={65}
                height={64}
              />
              <div className="absolute -bottom-1 -right-1 bg-cyan-400 text-[#040810] text-[8px] font-black px-1 leading-tight tracking-tighter">
                LVL5
              </div>
            </div>
          </div>

          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="text-base md:text-lg font-black text-white tracking-wider font-ubuntu">
                {operator.codename}
              </span>
              <button
                onClick={onEditOperator}
                title="Edit Callsign"
                className="text-nexus-cyan-dim hover:text-cyan-300 transition-colors cursor-pointer p-0.5"
              >
                <Pencil className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="text-xs text-nexus-emerald font-ubuntu tracking-wider flex items-center gap-1.5">
              <span>{operator.rank}</span>
            </div>

            <div className="text-xs text-nexus-cyan font-mono tracking-tight flex items-center gap-2">
              <span>{operator.agentId}</span>
            </div>
          </div>
        </div>

        {/* Center / Right: Live Theaters Clocks & Defcon */}
        <div className="flex flex-wrap items-center gap-3 md:gap-5 ml-auto">
          {/* Tactical Clocks */}
          <div className="hidden sm:flex items-center gap-3 bg-[#03060c] border border-cyan-500/20 px-3 py-1.5 font-mono text-xs">
            <Clock className="size-4" />
            <div>
              <span className="text-white text-sm block">ZULU / UTC</span>
              <span className="text-cyan-300 font-bold">
                {timeUtc || "12:00:00Z"}
              </span>
            </div>
            <div className="w-px h-6 bg-cyan-500/20" />
            <div>
              <span className="text-white text-sm block">LANGLEY (EST)</span>
              <span className="text-cyan-300">{timeLangley || "08:00:00"}</span>
            </div>
            <div className="w-px h-6 bg-cyan-500/20" />
            <div>
              <span className="text-white text-sm block">LOCAL TIME</span>
              <span className="text-emerald-400">
                {timeLocal || "15:00:00"}
              </span>
            </div>
          </div>

          {/* DEFCON Controller */}
          <button
            onClick={cycleDefcon}
            title="Cycle Defense Readiness Condition"
            className={`flex items-center justify-center gap-2 px-3 py-2 border font-mono text-xs cursor-pointer transition-all ${defconColors[defcon].bg} ${defconColors[defcon].border}`}
          >
            <ShieldAlert
              className={`size-4 shrink-0 ${defconColors[defcon].text}`}
            />
            <div className="text-left">
              <div className="text-xs text-white/50 tracking-widest leading-none">
                STATUS
              </div>
              <div
                className={`font-black tracking-widest text-xs ${defconColors[defcon].text}`}
              >
                DEFCON {defcon}
              </div>
            </div>
          </button>
        </div>
      </div>
    </header>
  );
}

"use client";

import { useState } from "react";
import { generateOperatorProfile, OperatorProfile } from "@/utils/avatarGenerator";
import { playBeep, playKeyBlip, playTargetLock } from "@/utils/soundFx";
import { ShieldCheck, Terminal, Lock } from "lucide-react";

interface OperatorModalProps {
  isOpen: boolean;
  onSave: (profile: OperatorProfile) => void;
  initialName?: string;
}

export default function OperatorModal({ isOpen, onSave, initialName = "" }: OperatorModalProps) {
  const [name, setName] = useState(initialName || "");
  const [profilePreview, setProfilePreview] = useState<OperatorProfile>(
    generateOperatorProfile(initialName || "DIRECTOR_SHADOW")
  );

  if (!isOpen) return null;

  const handleInputChange = (val: string) => {
    setName(val);
    playKeyBlip();
    setProfilePreview(generateOperatorProfile(val || "AGENT_UNKNOWN"));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalName = name.trim() || "DIRECTOR_SHADOW";
    const profile = generateOperatorProfile(finalName);
    playTargetLock();
    if (typeof window !== "undefined") {
      localStorage.setItem("operator_profile", JSON.stringify(profile));
      localStorage.setItem("operator_callsign", finalName);
    }
    onSave(profile);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div
        className="tactical-panel w-full max-w-xl p-6 rounded-none relative overflow-hidden"
        style={{
          background: "linear-gradient(145deg, #070e1c 0%, #040810 100%)",
          border: "1px solid rgba(0, 240, 255, 0.4)",
          boxShadow: "0 0 50px rgba(0, 240, 255, 0.15), inset 0 0 30px rgba(0, 240, 255, 0.03)"
        }}
      >
        {/* Top Header with Classified Strip */}
        <div className="flex items-center justify-between pb-3 border-b border-cyan-500/20 mb-5">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-cyan-400" />
            <span
              className="text-[12px] font-bold tracking-[3px] text-cyan-400"
              style={{ fontFamily: "var(--font-hud)" }}
            >
              CLEARANCE VERIFICATION // LEVEL 5
            </span>
          </div>
          <div className="flex items-center gap-2 text-[10px] text-amber-400/80 tracking-widest">
            <span className="inline-block w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            <span>IDENTITY UNVERIFIED</span>
          </div>
        </div>

        {/* Cinematic Briefing Text */}
        <div className="mb-6">
          <h2
            className="text-lg md:text-xl font-black text-white tracking-wider flex items-center gap-2"
            style={{ fontFamily: "var(--font-hud)" }}
          >
            ENTER OPERATOR CALLSIGN
          </h2>
          <p className="text-[12px] text-cyan-400/70 mt-1 leading-relaxed">
            Specify your codename to initialize the Palantir Global Surveillance Console. Your cryptographic biometric avatar and world control clearance will be synthesized deterministically.
          </p>
        </div>

        {/* Live Profile & Procedural Avatar Preview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-[#0a1324] border border-cyan-500/25 mb-6">
          <div className="flex flex-col items-center justify-center">
            <div className="relative w-28 h-28 border border-cyan-400/40 p-1 bg-black/60 shadow-[0_0_15px_rgba(0,240,255,0.2)]">
              {/* Corner reticles */}
              <div className="absolute -top-1 -left-1 w-2 h-2 border-t-2 border-l-2 border-cyan-400" />
              <div className="absolute -top-1 -right-1 w-2 h-2 border-t-2 border-r-2 border-cyan-400" />
              <div className="absolute -bottom-1 -left-1 w-2 h-2 border-b-2 border-l-2 border-cyan-400" />
              <div className="absolute -bottom-1 -right-1 w-2 h-2 border-b-2 border-r-2 border-cyan-400" />

              {/* Avatar Image Generated */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={profilePreview.avatarDataUrl}
                alt={profilePreview.codename}
                className="w-full h-full object-cover"
              />

              <div className="absolute bottom-1 right-1 px-1 bg-black/80 text-[8px] text-cyan-400 font-mono tracking-tighter">
                SYNTH
              </div>
            </div>
            <div className="text-[10px] text-cyan-400/60 mt-1 font-mono tracking-wider">
              {profilePreview.agentId}
            </div>
          </div>

          <div className="md:col-span-2 flex flex-col justify-center space-y-2 text-[11px] font-mono">
            <div>
              <span className="text-cyan-400/40 text-[9px] tracking-widest block">OPERATOR CODENAME</span>
              <span className="text-white text-sm font-bold tracking-wider" style={{ fontFamily: "var(--font-hud)" }}>
                {profilePreview.codename || "AGENT_UNKNOWN"}
              </span>
            </div>

            <div>
              <span className="text-cyan-400/40 text-[9px] tracking-widest block">ASSIGNED RANK & ROLE</span>
              <span className="text-emerald-400 font-medium">
                {profilePreview.rank}
              </span>
            </div>

            <div>
              <span className="text-cyan-400/40 text-[9px] tracking-widest block">SECURITY CLEARANCE</span>
              <span className="text-amber-400">
                {profilePreview.clearance}
              </span>
            </div>

            <div>
              <span className="text-cyan-400/40 text-[9px] tracking-widest block">TACTICAL DESIGNATION</span>
              <span className="text-cyan-300">
                PALANTIR OMNI-SURVEILLANCE NODE // ACTIVE
              </span>
            </div>
          </div>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[11px] text-cyan-400/80 mb-1.5 tracking-wider font-mono">
              [ENTER CALLSIGN / AGENT NAME]:
            </label>
            <div className="relative">
              <Terminal className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cyan-400" />
              <input
                type="text"
                value={name}
                onChange={(e) => handleInputChange(e.target.value)}
                placeholder="e.g. DIRECTOR_VANCE, VALKYRIE, GHOST_ONE..."
                maxLength={24}
                autoFocus
                className="w-full bg-[#03060c] border border-cyan-500/40 py-2.5 pl-10 pr-4 text-white text-sm font-mono tracking-wider focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 shadow-inner"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-[10px] text-cyan-400/50 font-mono tracking-wider">
              ENCRYPTED BIOMETRICS // PERSISTED LOCALLY
            </span>

            <button
              type="submit"
              onClick={() => playBeep(960, 0.08)}
              className="btn-tactical px-6 py-2.5 text-xs font-bold tracking-[2px] border border-cyan-400 text-cyan-400 bg-transparent cursor-pointer flex items-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>[ AUTHORIZE &amp; TAKE COMMAND ]</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

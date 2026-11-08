"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  generateOperatorProfile,
  OperatorProfile,
} from "@/utils/avatarGenerator";
import { playBeep, playKeyBlip, playTargetLock } from "@/utils/soundFx";
import { ShieldCheck, Terminal, X } from "lucide-react";

const DEFAULT_CALLSIGN = "DIRECTOR_SHADOW";

interface OperatorModalProps {
  isOpen: boolean;
  onSave: (profile: OperatorProfile) => void;
  initialName?: string;
  setOpen: (s: boolean) => void;
}

export default function OperatorModal({
  isOpen,
  onSave,
  initialName = "",
  setOpen,
}: OperatorModalProps) {
  const [name, setName] = useState(initialName);
  const [profilePreview, setProfilePreview] = useState<OperatorProfile>(() =>
    generateOperatorProfile(initialName || DEFAULT_CALLSIGN),
  );

  useEffect(() => {
    if (!isOpen) return;
    setName(initialName);
    setProfilePreview(generateOperatorProfile(initialName || DEFAULT_CALLSIGN));
  }, [isOpen, initialName]);

  if (!isOpen) return null;

  const handleInputChange = (val: string) => {
    setName(val);
    playKeyBlip();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalName = name.trim() || DEFAULT_CALLSIGN;
    const profile = generateOperatorProfile(finalName);
    playTargetLock();
    setProfilePreview(profile);
    if (typeof window !== "undefined") {
      localStorage.setItem("operator_profile", JSON.stringify(profile));
      localStorage.setItem("operator_callsign", finalName);
    }
    onSave(profile);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/85 backdrop-blur-md sm:items-center sm:p-4"
      onClick={() => setOpen(false)}
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="operator-modal-title"
        onClick={(e) => e.stopPropagation()}
        className="tactical-panel relative flex h-dvh w-full flex-col overflow-y-auto overscroll-contain rounded-none p-4 font-ubuntu sm:h-auto sm:max-h-[90dvh] sm:max-w-xl sm:p-6"
        style={{
          background: "linear-gradient(145deg, #070e1c 0%, #040810 100%)",
          border: "1px solid rgba(0, 240, 255, 0.4)",
          boxShadow:
            "0 0 50px rgba(0, 240, 255, 0.15), inset 0 0 30px rgba(0, 240, 255, 0.03)",
          paddingTop: "max(1rem, env(safe-area-inset-top))",
          paddingBottom: "max(1rem, env(safe-area-inset-bottom))",
        }}
      >
        {/* Close button */}
        <button
          type="button"
          onClick={() => setOpen(false)}
          aria-label="Close"
          className="absolute right-3 top-3 z-10 flex size-9 items-center justify-center border border-cyan-400/40 bg-black/50 text-nexus-cyan transition-colors hover:bg-cyan-400/10 active:bg-cyan-400/20 sm:right-4 sm:top-4"
          style={{ marginTop: "env(safe-area-inset-top)" }}
        >
          <X className="size-4" />
        </button>

        {/* Briefing */}
        <div className="mb-5 pr-10 sm:mb-6">
          <h2
            id="operator-modal-title"
            className="flex items-center gap-2 text-base font-bold tracking-wider text-white sm:text-xl"
          >
            ENTER OPERATOR CALLSIGN
          </h2>
          <p className="mt-1 text-xs leading-relaxed text-nexus-cyan sm:text-sm">
            Specify your codename to initialize the NEXUS Global Surveillance
            Console. Your cryptographic biometric avatar and world control
            clearance will be synthesized deterministically.
          </p>
        </div>

        {/* Live preview */}
        <div className="mb-5 grid grid-cols-1 gap-4 border border-cyan-500/25 bg-[#0a1324] p-3 sm:mb-6 sm:grid-cols-3 sm:p-4">
          <div className="flex flex-col items-center justify-center">
            <div className="relative size-24 border border-cyan-400/40 bg-black/60 p-1 shadow-[0_0_15px_rgba(0,240,255,0.2)] sm:size-28">
              <span className="absolute -left-1 -top-1 size-2 border-l-2 border-t-2 border-cyan-400" />
              <span className="absolute -right-1 -top-1 size-2 border-r-2 border-t-2 border-cyan-400" />
              <span className="absolute -bottom-1 -left-1 size-2 border-b-2 border-l-2 border-cyan-400" />
              <span className="absolute -bottom-1 -right-1 size-2 border-b-2 border-r-2 border-cyan-400" />

              <Image
                src={profilePreview.avatarDataUrl}
                alt={`Avatar for ${profilePreview.codename}`}
                className="h-full w-full object-cover"
                width={112}
                height={112}
                unoptimized
              />
            </div>
            <div className="mt-1 font-ubuntu-mono text-[10px] tracking-wider text-cyan-400/60">
              {profilePreview.agentId}
            </div>
          </div>

          <div className="flex min-w-0 flex-col justify-center gap-2 text-sm sm:col-span-2">
            <div className="min-w-0">
              <span className="block text-xs tracking-widest text-cyan-400/40">
                OPERATOR CODENAME
              </span>
              <span className="block truncate font-medium tracking-wider text-white">
                {profilePreview.codename || "AGENT_UNKNOWN"}
              </span>
            </div>

            <div>
              <span className="block text-xs tracking-widest text-cyan-400/40">
                ASSIGNED RANK &amp; ROLE
              </span>
              <span className="font-medium text-emerald-400">
                {profilePreview.rank}
              </span>
            </div>

            <div>
              <span className="block text-xs tracking-widest text-cyan-400/40">
                SECURITY CLEARANCE
              </span>
              <span className="text-amber-400">{profilePreview.clearance}</span>
            </div>

            <div>
              <span className="block text-xs tracking-widest text-cyan-400/40">
                TACTICAL DESIGNATION
              </span>
              <span className="text-cyan-300">
                NEXUS OMNI-SURVEILLANCE NODE
              </span>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-1 flex-col gap-4">
          <div>
            <label
              htmlFor="operator-callsign"
              className="mb-1 block font-ubuntu-mono text-xs tracking-wide text-nexus-cyan sm:text-sm"
            >
              ENTER CALLSIGN / AGENT NAME:
            </label>
            <div className="relative">
              <Terminal className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-nexus-cyan" />
              <input
                id="operator-callsign"
                type="text"
                value={name}
                onChange={(e) => handleInputChange(e.target.value)}
                placeholder="e.g. DIRECTOR_VANCE, VALKYRIE..."
                maxLength={24}
                autoFocus
                autoComplete="off"
                autoCapitalize="characters"
                spellCheck={false}
                className="w-full border border-nexus-cyan-border bg-[#03060c] py-2.5 pl-10 pr-4 font-ubuntu-mono text-base tracking-wider text-white shadow-inner placeholder:text-white/30 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400 sm:text-sm"
              />
            </div>
          </div>

          <div className="mt-auto flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
            <span className="text-center font-ubuntu-mono text-[11px] tracking-wider text-nexus-cyan-dim sm:text-left sm:text-xs">
              ENCRYPTED BIOMETRICS
            </span>

            <button
              type="submit"
              onClick={() => playBeep(960, 0.08)}
              className="btn-tactical flex h-12 w-full cursor-pointer items-center justify-center gap-2 border border-palantir-cyan bg-transparent px-6 text-xs font-bold tracking-[0.15em] text-nexus-cyan transition-colors hover:bg-cyan-400/10 active:bg-cyan-400/20 sm:h-11 sm:w-auto"
            >
              <ShieldCheck className="size-4" />
              <span>AUTHORIZE &amp; TAKE COMMAND</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

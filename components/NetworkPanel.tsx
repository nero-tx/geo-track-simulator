"use client";

import { useState } from "react";
import PanelHeader from "./PanelHeader";
import { formatDossier } from "@/utils/utils";
import { GeoData } from "@/utils/types";
import { playTargetLock } from "@/utils/soundFx";
import { Copy, Check } from "lucide-react";

interface NetworkPanelProps {
  data: GeoData;
  operatorCodename?: string;
}

export default function NetworkPanel({ data, operatorCodename = "OPERATOR" }: NetworkPanelProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    playTargetLock();
    const dossierText = formatDossier(data, operatorCodename);
    await navigator.clipboard.writeText(dossierText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="tactical-panel reveal" style={{ gridColumn: "1 / -1" }}>
      <div className="flex items-center justify-between px-3 py-2 border-b border-cyan-500/20 bg-[#07101f]">
        <PanelHeader label="NETWORK SIGNATURE &amp; TELECOMMUNICATIONS DOSSIER" />
        <span className="text-[10px] text-cyan-400/60 font-mono">
          INTERCEPT PORT 443 // TLS 1.3
        </span>
      </div>

      <div className="p-4 flex flex-wrap items-center justify-between gap-5 font-mono">
        <div>
          <div className="text-[10px] tracking-[2px] mb-1 text-cyan-400/50">
            PUBLIC IP ADDRESS
          </div>
          <div
            className="text-[clamp(18px,4vw,26px)] tracking-[2px] font-bold text-amber-400"
          >
            {data.ip}
          </div>
        </div>

        <div className="flex-1 min-w-[200px]">
          <div className="text-[10px] tracking-[2px] mb-1 text-cyan-400/50">
            INTERNET SERVICE PROVIDER / AS ORGANIZATION
          </div>
          <div className="text-sm tracking-wide text-cyan-300 font-bold truncate max-w-md">
            {data.isp || "CARRIER SIGNATURE DETECTED"}
          </div>
          <div className="text-[11px] text-cyan-400/60 mt-0.5">
            TYPE: {data.networkType} | DOWNLINK: {data.downlinkSpeed}
          </div>
        </div>

        <button
          onClick={handleCopy}
          className="btn-tactical px-5 py-3 border border-cyan-400 text-cyan-300 text-xs font-bold tracking-[2px] cursor-pointer flex items-center gap-2 bg-transparent transition-all"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-cyan-400" />}
          <span>{copied ? "[ DOSSIER EXPORTED // CLASSIFIED ]" : "[ EXPORT PALANTIR DOSSIER ]"}</span>
        </button>
      </div>
    </div>
  );
}

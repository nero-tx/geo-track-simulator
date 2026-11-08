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

export default function NetworkPanel({
  data,
  operatorCodename = "OPERATOR",
}: NetworkPanelProps) {
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
      <div className="flex items-center justify-between p-3 border-b border-nexus-cyan-border bg-panel">
        <PanelHeader label="Network Intelligence" />

        <span className="hidden sm:inline-block text-xs text-nexus-cyan-dim font-mono">
          Secure Connection // HTTPS · TLS 1.3
        </span>
      </div>

      <div className="p-4 flex flex-wrap items-center justify-between gap-5 font-ubuntu">
        <div>
          <div className="text-xs tracking-[2px] mb-1 text-nexus-cyan-dim">
            PUBLIC IP ADDRESS
          </div>
          <div className="text-[clamp(18px,4vw,26px)] tracking-[2px] font-bold text-nexus-amber">
            {data.ip}
          </div>
        </div>

        <div className="flex-1 min-w-50">
          <div className="text-[10px] tracking-[2px] mb-1 text-nexus-cyan-dim">
            Network Provider // Autonomous System
          </div>

          <div className="text-sm tracking-wide text-nexus-cyan font-bold truncate max-w-md">
            {data.isp || "Provider Signature Unavailable"}
          </div>

          <div className="text-sm text-nexus-cyan-dim mt-0.5">
            Network Type:{" "}
            <span className="text-nexus-violet">{data.networkType}</span> |
            Download Bandwidth:{" "}
            <span className="text-nexus-emerald">{data.downlinkSpeed}</span>
          </div>
        </div>

        <button
          onClick={handleCopy}
          className="btn-tactical px-5 py-3 border border-cyan-400 text-cyan-300 text-xs font-bold tracking-[2px] cursor-pointer flex items-center gap-2 bg-transparent transition-all"
        >
          {copied ? (
            <Check className="w-4 h-4 text-emerald-400" />
          ) : (
            <Copy className="w-4 h-4 text-nexus-cyan" />
          )}
          <span>
            {copied
              ? "[ Data Exported Successfully ]"
              : "[ Export Geospatial Report ]"}
          </span>
        </button>
      </div>
    </div>
  );
}

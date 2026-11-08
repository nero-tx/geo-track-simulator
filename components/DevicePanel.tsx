"use client";

import PanelHeader from "./PanelHeader";
import DataEntry from "./DataEntry";
import { GeoData } from "@/utils/types";

export default function DevicePanel({ data }: { data: GeoData }) {
  return (
    <div className="tactical-panel reveal">
      <div className="flex items-center justify-between px-3 py-2 border-b border-cyan-500/20 bg-[#07101f]">
        <PanelHeader label="DEVICE &amp; HARDWARE FINGERPRINT" />
        <span className="text-[10px] text-cyan-400/60 font-mono">
          FINGERPRINT MATRIX: UNIQUE
        </span>
      </div>

      <div className="p-3">
        <div className="grid grid-cols-1 gap-1 stagger font-mono">
          <DataEntry label="Operating System" value={data.os} highlight />
          <DataEntry label="Browser Platform" value={data.browser} />
          <DataEntry label="Form Factor" value={data.device} highlight />
          <DataEntry label="Hardware Cores" value={data.cores} />
          <DataEntry label="Display Matrix" value={data.screen} />
          <DataEntry label="System Language" value={data.language} />
          <DataEntry label="Timezone Region" value={data.clientTz} dim />
          <DataEntry
            label="Graphics Engine"
            value={data.gpuRenderer || "Integrated GPU / Metal Engine"}
            highlight
          />
        </div>
      </div>
    </div>
  );
}

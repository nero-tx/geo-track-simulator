"use client";

import PanelHeader from "./PanelHeader";
import DataEntry from "./DataEntry";
import { GeoData } from "@/utils/types";
import { MapPin } from "lucide-react";

export default function LocationPanel({ data }: { data: GeoData }) {
  return (
    <div className="tactical-panel reveal" style={{ gridColumn: "1 / -1" }}>
      <div className="flex items-center justify-between px-3 py-2 border-b border-cyan-500/20 bg-[#07101f]">
        <PanelHeader label="GEOLOCATION INTELLIGENCE // EXACT PHYSICAL TARGETING" />
        <span className="text-[10px] text-cyan-400/70 font-mono">
          NOMINATIM REVERSE RESOLUTION: OK
        </span>
      </div>

      <div className="p-3">
        {/* Full Street Address Banner */}
        <div className="p-3 mb-3 bg-[#03060c] border border-cyan-500/30 font-mono">
          <div className="flex items-center gap-1.5 text-cyan-400 text-[10px] tracking-widest mb-1">
            <MapPin className="w-3.5 h-3.5 text-cyan-400" />
            <span>EXACT PHYSICAL STREET ADDRESS:</span>
          </div>
          <div className="text-white text-sm md:text-base font-bold tracking-wide">
            {data.exactAddress.formattedAddress}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 stagger font-mono">
          <DataEntry
            label="Street / Road"
            value={data.exactAddress.road || data.exactAddress.neighborhood || "--"}
            highlight
          />
          <DataEntry
            label="District / Suburb"
            value={data.exactAddress.suburb || data.exactAddress.county || data.city}
          />
          <DataEntry
            label="City / Municipality"
            value={data.exactAddress.city || data.city}
            highlight
          />
          <DataEntry
            label="Postal Code"
            value={data.exactAddress.postcode || "--"}
          />
          <DataEntry
            label="State / Region"
            value={data.exactAddress.state || data.region}
          />
          <DataEntry
            label="Country"
            value={`${data.country} [${data.countryCode}]`}
            highlight
          />
          <DataEntry
            label="Timezone Offset"
            value={data.timezone}
          />
          <DataEntry
            label="National Currency"
            value={data.currency}
            dim
          />
        </div>
      </div>
    </div>
  );
}

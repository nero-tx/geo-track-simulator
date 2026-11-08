"use client";

import PanelHeader from "./PanelHeader";
import DataEntry from "./DataEntry";
import { GeoData } from "@/utils/types";
import { MapPin } from "lucide-react";

export default function LocationPanel({ data }: { data: GeoData }) {
  return (
    <div className="tactical-panel reveal" style={{ gridColumn: "1 / -1" }}>
      <div className="flex items-center justify-between p-3 border-b border-cyan-500/20 bg-panel">
        <PanelHeader label="Geospatial Intelligence" />

        <span className="hidden sm:inline-block text-xs text-nexus-cyan-border font-mono">
          Address Resolution // Operational
        </span>
      </div>

      <div className="p-3">
        {/* Full Street Address Banner */}
        <div className="p-3 mb-3 bg-core border border-nexus-cyan-border font-mono">
          <div className="flex items-center gap-1.5 text-nexus-cyan text-xs tracking-widest mb-1">
            <MapPin className="size-4 shrink-0 text-cyan-400" />
            <span>EXACT PHYSICAL STREET ADDRESS:</span>
          </div>
          <div className="text-white text-sm md:text-base font-bold tracking-wide mt-2">
            {data.exactAddress.formattedAddress}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 stagger font-ubuntu">
          <DataEntry
            label="Street / Road"
            value={
              data.exactAddress.road || data.exactAddress.neighborhood || "--"
            }
            highlight
          />
          <DataEntry
            label="District / Suburb"
            value={
              data.exactAddress.suburb || data.exactAddress.county || data.city
            }
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
          <DataEntry label="Timezone Offset" value={data.timezone} />
          <DataEntry label="National Currency" value={data.currency} dim />
        </div>
      </div>
    </div>
  );
}

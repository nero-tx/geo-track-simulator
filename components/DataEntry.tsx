"use client";

interface DataEntryProps {
  label: string;
  value: string;
  highlight?: boolean;
  dim?: boolean;
}

export default function DataEntry({ label, value, highlight, dim }: DataEntryProps) {
  const valueColor = highlight ? "text-amber-400 font-bold" : dim ? "text-cyan-400/50" : "text-cyan-300";

  return (
    <div className="flex flex-col gap-0.5 py-1.5 border-b border-cyan-500/10 font-mono">
      <span className="text-[10px] tracking-[1.5px] uppercase text-cyan-400/40">
        {label}
      </span>
      <span className={`text-[12px] tracking-[0.5px] truncate ${valueColor}`}>
        {value || "UNRECORDED"}
      </span>
    </div>
  );
}

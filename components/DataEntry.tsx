"use client";

interface DataEntryProps {
  label: string;
  value: string;
  highlight?: boolean;
  dim?: boolean;
}

export default function DataEntry({
  label,
  value,
  highlight,
  dim,
}: DataEntryProps) {
  const valueColor = highlight
    ? "text-nexus-amber font-bold"
    : dim
      ? "text-nexus-emerald"
      : "text-nexus-cyan";

  return (
    <div className="flex flex-col gap-0.5 py-1.5 border-b border-cyan-500/10 font-ubuntu">
      <span className="text-[15px] tracking-[1.5px] capitalize text-nexus-cyan-dim">
        {label}
      </span>
      <span className={`text-sm tracking-[0.5px] truncate ${valueColor}`}>
        {value || "UNRECORDED"}
      </span>
    </div>
  );
}

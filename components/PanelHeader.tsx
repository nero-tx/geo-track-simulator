"use client";

interface PanelHeaderProps {
  label: string;
}

export default function PanelHeader({ label }: PanelHeaderProps) {
  return (
    <div className="flex items-center gap-2 text-sm font-mono font-bold tracking-[2px] text-nexus-cyan">
      <div className="size-2 border border-nexus-cyan-border rotate-45 shrink-0 bg-cyan-400/20" />
      <span>{label}</span>
    </div>
  );
}

"use client";

interface PanelHeaderProps {
  label: string;
}

export default function PanelHeader({ label }: PanelHeaderProps) {
  return (
    <div className="flex items-center gap-2 text-xs font-mono font-bold tracking-[2px] text-cyan-300">
      <div className="w-2 h-2 border border-cyan-400 rotate-45 flex-shrink-0 bg-cyan-400/20" />
      <span>{label}</span>
    </div>
  );
}

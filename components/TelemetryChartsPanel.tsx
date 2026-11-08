"use client";

import { memo, useEffect, useId, useMemo, useState } from "react";
import PanelHeader from "./PanelHeader";
import { EnvironmentalTelemetry } from "@/utils/types";
import {
  Thermometer,
  Gauge,
  Wind,
  Sun,
  Activity,
  CloudRain,
  Radio,
  Wifi,
} from "lucide-react";

const W = 500;
const H = 120;
const PAD = 14;

function domainOf(values: number[], pad = 0): [number, number] {
  let min = Infinity;
  let max = -Infinity;
  for (const v of values) {
    if (v < min) min = v;
    if (v > max) max = v;
  }
  if (!Number.isFinite(min)) return [0, 1];
  return [min - pad, max + pad];
}

type Point = readonly [number, number];

function buildPath(values: number[], min: number, max: number) {
  const n = values.length;
  if (n < 2) return { line: "", area: "", last: null as Point | null };

  const range = Math.max(1e-6, max - min);
  const pts: Point[] = values.map((v, i) => [
    (i / (n - 1)) * W,
    H - ((v - min) / range) * (H - PAD * 2) - PAD,
  ]);

  const line = pts
    .map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(2)},${y.toFixed(2)}`)
    .join(" ");
  const area = `${line} L${W},${H} L0,${H} Z`;

  return { line, area, last: pts[pts.length - 1] };
}

interface SparklineProps {
  values: number[];
  min: number;
  max: number;
  color: string;
  labels?: string[];
}

const Sparkline = memo(function Sparkline({
  values,
  min,
  max,
  color,
  labels,
}: SparklineProps) {
  const gradId = useId().replace(/:/g, "");

  const { line, area, last } = useMemo(
    () => buildPath(values, min, max),
    [values, min, max],
  );

  return (
    <>
      <div className="relative w-full h-32 overflow-hidden">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          preserveAspectRatio="none"
          className="w-full h-full"
        >
          <defs>
            <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity="0.35" />
              <stop offset="100%" stopColor={color} stopOpacity="0" />
            </linearGradient>
          </defs>

          {[0.25, 0.5, 0.75].map((f) => (
            <line
              key={f}
              x1="0"
              x2={W}
              y1={H * f}
              y2={H * f}
              stroke={color}
              strokeOpacity="0.1"
              strokeDasharray="2 2"
            />
          ))}

          <path d={area} fill={`url(#${gradId})`} />
          <path
            d={line}
            fill="none"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
          />
        </svg>

        {last && (
          <span
            className="absolute size-2 rounded-full -translate-x-1/2 -translate-y-1/2 ring-2 ring-[#040810]"
            style={{
              backgroundColor: color,
              left: `${(last[0] / W) * 100}%`,
              top: `${(last[1] / H) * 100}%`,
            }}
          />
        )}
      </div>

      {labels && labels.length > 0 && (
        <div className="flex justify-between text-[10px] text-nexus-cyan-dim mt-1 px-1">
          {labels.map((l, i) => (
            <span key={`${l}-${i}`}>{l}</span>
          ))}
        </div>
      )}
    </>
  );
});

const LATENCY_MAX = 150;
const LATENCY_SAMPLES = 60;
const PROBE_INTERVAL_MS = 1000;

const LatencyMonitor = memo(function LatencyMonitor() {
  const [samples, setSamples] = useState<number[]>([]);
  const [online, setOnline] = useState(true);

  useEffect(() => {
    let cancelled = false;
    let busy = false;

    const probe = async () => {
      if (busy) return; // don't stack requests if one is slow
      busy = true;

      const t0 = performance.now();
      let ms = LATENCY_MAX;
      let ok = true;

      try {
        await fetch(`${location.origin}/?_probe=${Date.now()}`, {
          method: "HEAD",
          mode: "no-cors",
          cache: "no-store",
        });
        ms = performance.now() - t0;
      } catch {
        ok = false;
      } finally {
        busy = false;
      }

      if (cancelled) return;
      setOnline(ok);
      setSamples((prev) =>
        [...prev, Math.min(ms, LATENCY_MAX)].slice(-LATENCY_SAMPLES),
      );
    };

    probe();
    const id = setInterval(probe, PROBE_INTERVAL_MS);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  const current = samples.length
    ? Math.round(samples[samples.length - 1])
    : null;
  const color =
    current === null
      ? "#64748b" // Unavailable
      : current > 120
        ? "#ff3355" // Critical
        : current > 80
          ? "#ffaa00" // Elevated
          : "#00f0ff"; // Normal

  return (
    <div className="bg-[#040810] border border-nexus-cyan-border p-3 font-mono">
      <div className="flex items-center justify-between text-xs mb-2">
        <span className="flex items-center gap-2 text-white font-bold tracking-wider">
          <Radio className="size-4 text-nexus-emerald animate-pulse" />
          LIVE UPLINK LATENCY (ms)
        </span>
        <span className="flex items-center gap-2" style={{ color }}>
          <Wifi className="size-4" />
          {online && current !== null ? `${current} ms` : "PROBE FAILED"}
        </span>
      </div>

      <Sparkline values={samples} min={0} max={LATENCY_MAX} color={color} />
    </div>
  );
});

interface TelemetryChartsPanelProps {
  env: EnvironmentalTelemetry | null;
  lat: number;
  lng: number;
}

export default function TelemetryChartsPanel({
  env,
  lat,
  lng,
}: TelemetryChartsPanelProps) {
  const hourly = useMemo(() => env?.hourly ?? [], [env]);

  const temps = useMemo(() => hourly.map((h) => h.temp), [hourly]);
  const pressures = useMemo(() => hourly.map((h) => h.pressure), [hourly]);
  const hourLabels = useMemo(
    () => hourly.filter((_, i) => i % 4 === 0).map((h) => h.hour),
    [hourly],
  );

  const [tempMin, tempMax] = useMemo(
    () =>
      env
        ? domainOf([...temps, env.temperatureC], 3)
        : ([0, 1] as [number, number]),
    [env, temps],
  );

  const [pressMin, pressMax] = useMemo(
    () =>
      env
        ? domainOf([...pressures, env.surfacePressureHpa], 5)
        : ([0, 1] as [number, number]),
    [env, pressures],
  );

  if (!env) {
    return (
      <div
        className="tactical-panel p-4 text-center font-mono text-nexus-cyan-dim"
        style={{ gridColumn: "1 / -1" }}
      >
        [ ATMOSPHERIC SENSORS INITIALIZING... ]
      </div>
    );
  }

  const metrics = [
    {
      label: "Temperature",
      icon: Thermometer,
      iconColor: "text-cyan-400",
      value: `${env.temperatureC}°C`,
      valueColor: "text-white",
      detail: `Feels ${env.apparentTempC}°C (${env.temperatureF}°F)`,
    },
    {
      label: "Atmospheric Pressure",
      icon: Gauge,
      iconColor: "text-emerald-400",
      value: env.surfacePressureHpa,
      valueColor: "text-emerald-400",
      detail: "hPa (Barometric)",
    },
    {
      label: "Wind Vector",
      icon: Wind,
      iconColor: "text-cyan-400",
      value: (
        <>
          {env.windSpeedKmh} <span className="text-xs font-normal">km/h</span>
        </>
      ),
      valueColor: "text-cyan-300",
      detail: `Direction ${env.windDirectionDeg}° (Azimuth)`,
    },
    {
      label: "Humidity",
      icon: CloudRain,
      iconColor: "text-blue-400",
      value: `${env.relativeHumidity}%`,
      valueColor: "text-blue-400",
      detail: "Dew Cell Saturation",
    },
    {
      label: "UV Radiation",
      icon: Sun,
      iconColor: "text-amber-400",
      value: (
        <>
          {env.uvIndex} <span className="text-xs font-normal">UVI</span>
        </>
      ),
      valueColor: "text-amber-400",
      detail: `Cloud Cover ${env.cloudCoverPercent}%`,
    },
  ];

  return (
    <div
      className="tactical-panel reveal w-full"
      style={{ gridColumn: "1 / -1" }}
    >
      <div className="flex items-center justify-between p-3 border-b border-nexus-cyan-border bg-panel flex-wrap gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          <PanelHeader label="Local Environmental Telemetry" />
          <span className="text-xs bg-emerald-950/80 text-emerald-400 border border-emerald-500/40 px-2 py-1 tracking-wider font-mono">
            Geo-Station: {lat.toFixed(3)}°, {lng.toFixed(3)}°
          </span>
        </div>

        <div className="text-sm text-nexus-cyan font-mono tracking-wider flex items-center gap-2">
          <Activity className="size-4 animate-pulse" />
          <span>Sensors: Active</span>
        </div>
      </div>

      <div className="p-3 space-y-5">
        {/* Metric badges */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 font-mono">
          {metrics.map((m) => {
            const Icon = m.icon;
            return (
              <div
                key={m.label}
                className="p-2.5 bg-core border border-nexus-cyan-border"
              >
                <div className="flex items-center justify-between text-nexus-cyan-dim text-xs mb-1">
                  <span>{m.label}</span>
                  <Icon className={`size-4 shrink-0 ${m.iconColor}`} />
                </div>
                <div
                  className={`text-xl font-bold tracking-wider ${m.valueColor}`}
                >
                  {m.value}
                </div>
                <div className="text-xs text-nexus-cyan mt-0.5">{m.detail}</div>
              </div>
            );
          })}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-[#040810] border border-cyan-500/25 p-3 font-mono">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="text-nexus-cyan font-bold tracking-wider flex items-center gap-1.5">
                <Thermometer className="size-4" />
                24-HOUR TEMPERATURE (°C)
              </span>
              <span className="text-white">
                {tempMin.toFixed(1)}° – {tempMax.toFixed(1)}°C
              </span>
            </div>
            <Sparkline
              values={temps}
              min={tempMin}
              max={tempMax}
              color="#00f0ff"
              labels={hourLabels}
            />
          </div>

          <div className="bg-[#040810] border border-nexus-cyan-border p-3 font-mono">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="text-nexus-emerald font-bold tracking-wider flex items-center gap-1.5">
                <Gauge className="size-4" />
                BAROMETRIC PRESSURE (hPa)
              </span>
              <span className="text-emerald-400/60">
                {pressMin.toFixed(1)} – {pressMax.toFixed(1)}
              </span>
            </div>
            <Sparkline
              values={pressures}
              min={pressMin}
              max={pressMax}
              color="#00ff88"
              labels={hourLabels}
            />
          </div>
        </div>

        <LatencyMonitor />

        <div className="text-sm text-nexus-amber font-mono">
          Atmospheric Status:{" "}
          <span className="text-white font-bold">{env.weatherCondition}</span>
        </div>
      </div>
    </div>
  );
}

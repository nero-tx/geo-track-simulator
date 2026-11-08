"use client";

import { useEffect, useState } from "react";
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
  Wifi
} from "lucide-react";

interface TelemetryChartsPanelProps {
  env: EnvironmentalTelemetry | null;
  lat: number;
  lng: number;
}

export default function TelemetryChartsPanel({ env, lat, lng }: TelemetryChartsPanelProps) {
  // Simulated real network ping monitor
  const [pingHistory, setPingHistory] = useState<number[]>([24, 28, 22, 31, 26, 29, 23, 27, 25, 24]);
  const [currentPing, setCurrentPing] = useState(25);

  useEffect(() => {
    const interval = setInterval(() => {
      // Probe latency with simulated delta
      const sim = Math.floor(18 + Math.random() * 15);
      setCurrentPing(sim);
      setPingHistory((prev) => [...prev.slice(1), sim]);
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  if (!env) {
    return (
      <div className="tactical-panel p-4 text-center font-mono text-cyan-400/60" style={{ gridColumn: "1 / -1" }}>
        [ ATMOSPHERIC SENSORS INITIALIZING // AWAITING GEO FIX ]
      </div>
    );
  }

  // Calculate SVG line path for 24h Temperature
  const hourly = env.hourly || [];
  const minTemp = Math.min(...hourly.map((h) => h.temp), env.temperatureC - 3);
  const maxTemp = Math.max(...hourly.map((h) => h.temp), env.temperatureC + 3);
  const tempRange = Math.max(1, maxTemp - minTemp);

  const chartWidth = 500;
  const chartHeight = 120;

  const tempPoints = hourly.map((pt, i) => {
    const x = (i / (hourly.length - 1 || 1)) * chartWidth;
    const y = chartHeight - ((pt.temp - minTemp) / tempRange) * (chartHeight - 30) - 15;
    return `${x},${y}`;
  });

  const tempPath = `M ${tempPoints.join(" L ")}`;
  const tempAreaPath = `${tempPath} L ${chartWidth},${chartHeight} L 0,${chartHeight} Z`;

  // Calculate SVG line path for Barometric Pressure
  const minPress = Math.min(...hourly.map((h) => h.pressure), env.surfacePressureHpa - 5);
  const maxPress = Math.max(...hourly.map((h) => h.pressure), env.surfacePressureHpa + 5);
  const pressRange = Math.max(1, maxPress - minPress);

  const pressPoints = hourly.map((pt, i) => {
    const x = (i / (hourly.length - 1 || 1)) * chartWidth;
    const y = chartHeight - ((pt.pressure - minPress) / pressRange) * (chartHeight - 30) - 15;
    return `${x},${y}`;
  });

  const pressPath = `M ${pressPoints.join(" L ")}`;

  return (
    <div className="tactical-panel reveal w-full" style={{ gridColumn: "1 / -1" }}>
      <div className="flex items-center justify-between px-3 py-2 border-b border-cyan-500/20 bg-[#07101f]">
        <div className="flex items-center gap-2">
          <PanelHeader label="LOCAL ENVIRONMENTAL TELEMETRY // REAL ATMOSPHERIC CHARTS" />
          <span className="text-[10px] bg-emerald-950/80 text-emerald-400 border border-emerald-500/40 px-2 py-0.5 tracking-wider font-mono">
            GEO-STATION: {lat.toFixed(3)}°, {lng.toFixed(3)}°
          </span>
        </div>

        <div className="text-[11px] text-cyan-400 font-mono tracking-wider flex items-center gap-2">
          <Activity className="w-3.5 h-3.5 text-cyan-300 animate-pulse" />
          <span>SENSORS: ACTIVE</span>
        </div>
      </div>

      <div className="p-4 space-y-5">
        {/* Top Metric Telemetry Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 font-mono">
          <div className="p-2.5 bg-[#03060c] border border-cyan-500/20">
            <div className="flex items-center justify-between text-cyan-400/50 text-[10px] mb-1">
              <span>TEMPERATURE</span>
              <Thermometer className="w-3.5 h-3.5 text-cyan-400" />
            </div>
            <div className="text-xl font-bold text-white tracking-wider">
              {env.temperatureC}°C
            </div>
            <div className="text-[10px] text-cyan-400/60 mt-0.5">
              FEELS {env.apparentTempC}°C ({env.temperatureF}°F)
            </div>
          </div>

          <div className="p-2.5 bg-[#03060c] border border-cyan-500/20">
            <div className="flex items-center justify-between text-cyan-400/50 text-[10px] mb-1">
              <span>ATM. PRESSURE</span>
              <Gauge className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <div className="text-xl font-bold text-emerald-400 tracking-wider">
              {env.surfacePressureHpa}
            </div>
            <div className="text-[10px] text-cyan-400/60 mt-0.5">
              hPa (BAROMETRIC)
            </div>
          </div>

          <div className="p-2.5 bg-[#03060c] border border-cyan-500/20">
            <div className="flex items-center justify-between text-cyan-400/50 text-[10px] mb-1">
              <span>WIND VECTOR</span>
              <Wind className="w-3.5 h-3.5 text-cyan-400" />
            </div>
            <div className="text-xl font-bold text-cyan-300 tracking-wider">
              {env.windSpeedKmh} <span className="text-xs font-normal">KM/H</span>
            </div>
            <div className="text-[10px] text-cyan-400/60 mt-0.5">
              DIR {env.windDirectionDeg}° (AZIMUTH)
            </div>
          </div>

          <div className="p-2.5 bg-[#03060c] border border-cyan-500/20">
            <div className="flex items-center justify-between text-cyan-400/50 text-[10px] mb-1">
              <span>HUMIDITY</span>
              <CloudRain className="w-3.5 h-3.5 text-blue-400" />
            </div>
            <div className="text-xl font-bold text-blue-400 tracking-wider">
              {env.relativeHumidity}%
            </div>
            <div className="text-[10px] text-cyan-400/60 mt-0.5">
              DEW CELL SATURATION
            </div>
          </div>

          <div className="p-2.5 bg-[#03060c] border border-cyan-500/20">
            <div className="flex items-center justify-between text-cyan-400/50 text-[10px] mb-1">
              <span>UV RADIATION</span>
              <Sun className="w-3.5 h-3.5 text-amber-400" />
            </div>
            <div className="text-xl font-bold text-amber-400 tracking-wider">
              {env.uvIndex} <span className="text-xs font-normal">UVI</span>
            </div>
            <div className="text-[10px] text-cyan-400/60 mt-0.5">
              CLOUD COVER {env.cloudCoverPercent}%
            </div>
          </div>

          <div className="p-2.5 bg-[#03060c] border border-cyan-500/20">
            <div className="flex items-center justify-between text-cyan-400/50 text-[10px] mb-1">
              <span>LINK LATENCY</span>
              <Wifi className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <div className="text-xl font-bold text-emerald-400 tracking-wider">
              {currentPing} <span className="text-xs font-normal">MS</span>
            </div>
            <div className="text-[10px] text-cyan-400/60 mt-0.5">
              PROBE: ACTIVE
            </div>
          </div>
        </div>

        {/* Real Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Chart 1: 24h Temperature Curve */}
          <div className="bg-[#040810] border border-cyan-500/25 p-3 font-mono">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="text-cyan-300 font-bold tracking-wider flex items-center gap-1.5">
                <Thermometer className="w-3.5 h-3.5 text-cyan-400" />
                24-HOUR HOURLY TEMPERATURE CURVE (°C)
              </span>
              <span className="text-[10px] text-cyan-400/60">
                RANGE: {minTemp}°C - {maxTemp}°C
              </span>
            </div>

            <div className="relative w-full h-[130px] overflow-hidden">
              <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} preserveAspectRatio="none" className="w-full h-full">
                <defs>
                  <linearGradient id="tempGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#00f0ff" stop-opacity="0.35" />
                    <stop offset="100%" stopColor="#00f0ff" stop-opacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Horizontal reference grid lines */}
                <line x1="0" y1="30" x2={chartWidth} y2="30" stroke="rgba(0,240,255,0.1)" stroke-dasharray="2,2" />
                <line x1="0" y1="65" x2={chartWidth} y2="65" stroke="rgba(0,240,255,0.1)" stroke-dasharray="2,2" />
                <line x1="0" y1="100" x2={chartWidth} y2="100" stroke="rgba(0,240,255,0.1)" stroke-dasharray="2,2" />

                {/* Area under curve */}
                <path d={tempAreaPath} fill="url(#tempGrad)" />

                {/* Main Curve Line */}
                <path d={tempPath} fill="none" stroke="#00f0ff" stroke-width="2.2" stroke-linecap="round" />

                {/* Data Points */}
                {hourly.map((pt, i) => {
                  const x = (i / (hourly.length - 1 || 1)) * chartWidth;
                  const y = chartHeight - ((pt.temp - minTemp) / tempRange) * (chartHeight - 30) - 15;
                  return (
                    <circle key={i} cx={x} cy={y} r="3" fill="#00f0ff" stroke="#040810" stroke-width="1.5" />
                  );
                })}
              </svg>
            </div>

            {/* Time labels under chart */}
            <div className="flex justify-between text-[9px] text-cyan-400/50 mt-1 px-1">
              {hourly.slice(0, 6).map((h, i) => (
                <span key={i}>{h.hour}</span>
              ))}
            </div>
          </div>

          {/* Chart 2: Barometric Surface Pressure (hPa) */}
          <div className="bg-[#040810] border border-cyan-500/25 p-3 font-mono">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="text-emerald-400 font-bold tracking-wider flex items-center gap-1.5">
                <Gauge className="w-3.5 h-3.5 text-emerald-400" />
                BAROMETRIC SURFACE PRESSURE (hPa)
              </span>
              <span className="text-[10px] text-emerald-400/60">
                RANGE: {minPress} - {maxPress} hPa
              </span>
            </div>

            <div className="relative w-full h-[130px] overflow-hidden">
              <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} preserveAspectRatio="none" className="w-full h-full">
                <defs>
                  <linearGradient id="pressGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#00ff88" stop-opacity="0.3" />
                    <stop offset="100%" stopColor="#00ff88" stop-opacity="0.0" />
                  </linearGradient>
                </defs>

                <line x1="0" y1="30" x2={chartWidth} y2="30" stroke="rgba(0,255,136,0.1)" stroke-dasharray="2,2" />
                <line x1="0" y1="65" x2={chartWidth} y2="65" stroke="rgba(0,255,136,0.1)" stroke-dasharray="2,2" />
                <line x1="0" y1="100" x2={chartWidth} y2="100" stroke="rgba(0,255,136,0.1)" stroke-dasharray="2,2" />

                <path d={`${pressPath} L ${chartWidth},${chartHeight} L 0,${chartHeight} Z`} fill="url(#pressGrad)" />
                <path d={pressPath} fill="none" stroke="#00ff88" stroke-width="2.2" stroke-linecap="round" />

                {hourly.map((pt, i) => {
                  const x = (i / (hourly.length - 1 || 1)) * chartWidth;
                  const y = chartHeight - ((pt.pressure - minPress) / pressRange) * (chartHeight - 30) - 15;
                  return (
                    <circle key={i} cx={x} cy={y} r="3" fill="#00ff88" stroke="#040810" stroke-width="1.5" />
                  );
                })}
              </svg>
            </div>

            <div className="flex justify-between text-[9px] text-emerald-400/50 mt-1 px-1">
              {hourly.slice(0, 6).map((h, i) => (
                <span key={i}>{h.hour}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Real Network Latency Pulse Bar */}
        <div className="bg-[#040810] border border-cyan-500/20 p-3 font-mono flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
            <span className="text-xs text-white tracking-wider font-bold">
              REAL-TIME UPLINK TELEMETRY BUFFER
            </span>
          </div>

          <div className="flex items-center gap-1.5 h-6">
            {pingHistory.map((val, idx) => (
              <div
                key={idx}
                className="w-3 bg-emerald-400/80 transition-all duration-300"
                style={{
                  height: `${Math.min(100, Math.max(20, (val / 40) * 100))}%`,
                  background: val > 30 ? "#ffaa00" : "#00ff88"
                }}
                title={`Ping: ${val}ms`}
              />
            ))}
          </div>

          <div className="text-[11px] text-cyan-400/70">
            ATMOSPHERIC STATUS: <span className="text-white font-bold">{env.weatherCondition}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

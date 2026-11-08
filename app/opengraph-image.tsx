import { ImageResponse } from "next/og";

export const alt =
  "NEXUS GEO-TRACK — a fictional geo-recon terminal built on ordinary web APIs";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/* ---------- design tokens ---------- */
const C = {
  bg: "#03060c",
  cyan: "#00f0ff",
  emerald: "#00ff88",
  amber: "#ffaa00",
  white: "#ffffff",
};
const cyanA = (a: number) => `rgba(0, 240, 255, ${a})`;

/* ---------- radar geometry (SVG viewBox 400x400, center 200,200) ---------- */
const CX = 200;
const CY = 200;
const R = 180;
const polar = (az: number, el: number) => {
  const r = R * (1 - el / 90);
  const a = (az * Math.PI) / 180;
  return { x: CX + r * Math.sin(a), y: CY - r * Math.cos(a) };
};

const SATS = [
  { az: 38, el: 62, color: C.emerald, selected: false }, // station
  { az: 118, el: 34, color: C.cyan, selected: true }, // selected
  { az: 205, el: 48, color: C.amber, selected: false },
  { az: 292, el: 22, color: C.amber, selected: false },
  { az: 330, el: 70, color: C.amber, selected: false },
].map((s) => ({ ...s, ...polar(s.az, s.el) }));

const SUN = polar(250, 18);
const SWEEP_END = polar(70, 0);

const BADGES = [
  "GPS ACQUISITION",
  "NETWORK INTEL",
  "ORBITAL RADAR",
  "ATMOSPHERIC TELEMETRY",
  "PROXIMITY MAP",
];

const FOOTER = [
  { k: "PIPELINE", v: "UPLINK › SAT › GPS › MAP", c: C.white },
  { k: "MODE", v: "SIMULATION", c: C.emerald },
  { k: "BUILD", v: "v4.2", c: C.cyan },
  { k: "AUTHOR", v: "@nero-tx", c: C.amber },
];

export default async function Image() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        position: "relative",
        backgroundColor: C.bg,
        backgroundImage: `radial-gradient(circle at 82% 48%, ${cyanA(0.18)} 0%, transparent 55%), radial-gradient(circle at 8% 100%, rgba(0, 255, 136, 0.1) 0%, transparent 45%)`,
        color: C.cyan,
        fontFamily: "monospace",
      }}
    >
      {/* Tactical grid background */}
      <svg
        width="1200"
        height="630"
        viewBox="0 0 1200 630"
        style={{ position: "absolute", top: 0, left: 0 }}
      >
        {Array.from({ length: 24 }).map((_, i) => (
          <line
            key={`v${i}`}
            x1={i * 50}
            y1="0"
            x2={i * 50}
            y2="630"
            stroke={cyanA(0.05)}
            strokeWidth="1"
          />
        ))}
        {Array.from({ length: 13 }).map((_, i) => (
          <line
            key={`h${i}`}
            x1="0"
            y1={i * 50}
            x2="1200"
            y2={i * 50}
            stroke={cyanA(0.05)}
            strokeWidth="1"
          />
        ))}
      </svg>

      {/* Corner brackets */}
      {[
        { top: 24, left: 24, borderTop: true, borderLeft: true },
        { top: 24, right: 24, borderTop: true, borderRight: true },
        { bottom: 24, left: 24, borderBottom: true, borderLeft: true },
        { bottom: 24, right: 24, borderBottom: true, borderRight: true },
      ].map((b, i) => {
        const { borderTop, borderLeft, borderRight, borderBottom, ...pos } = b;
        const line = `2px solid ${cyanA(0.7)}`;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              width: 34,
              height: 34,
              ...pos,
              borderTop: borderTop ? line : undefined,
              borderLeft: borderLeft ? line : undefined,
              borderRight: borderRight ? line : undefined,
              borderBottom: borderBottom ? line : undefined,
            }}
          />
        );
      })}

      {/* Content */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          width: "100%",
          height: "100%",
          padding: "56px 72px 48px",
        }}
      >
        {/* Top bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: `1px solid ${cyanA(0.25)}`,
            paddingBottom: 18,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div
              style={{
                width: 14,
                height: 14,
                backgroundColor: C.cyan,
                transform: "rotate(45deg)",
                boxShadow: `0 0 14px ${C.cyan}`,
              }}
            />
            <span
              style={{
                fontSize: 20,
                fontWeight: 700,
                letterSpacing: 6,
                color: C.cyan,
              }}
            >
              NEXUS
            </span>
            <span style={{ fontSize: 16, color: cyanA(0.35) }}>|</span>
            <span
              style={{
                fontSize: 14,
                letterSpacing: 3,
                color: C.amber,
                fontWeight: 700,
              }}
            >
              FICTIONAL INTERFACE // ENTERTAINMENT &amp; EDUCATION
            </span>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "6px 16px",
              border: "1px solid rgba(0, 255, 136, 0.5)",
              backgroundColor: "rgba(0, 255, 136, 0.1)",
            }}
          >
            <div
              style={{
                width: 10,
                height: 10,
                borderRadius: 999,
                backgroundColor: C.emerald,
                boxShadow: `0 0 10px ${C.emerald}`,
              }}
            />
            <span
              style={{
                fontSize: 14,
                fontWeight: 700,
                letterSpacing: 3,
                color: C.emerald,
              }}
            >
              SCAN READY
            </span>
          </div>
        </div>

        {/* Main stage */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexGrow: 1,
          }}
        >
          {/* Left: copy */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              maxWidth: 640,
            }}
          >
            <div
              style={{
                fontSize: 15,
                letterSpacing: 4,
                color: C.emerald,
                fontWeight: 700,
              }}
            >
              [ GEO-RECON TERMINAL ]
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                marginTop: 14,
                fontSize: 92,
                fontWeight: 900,
                lineHeight: 1,
                letterSpacing: 4,
                color: C.white,
                textShadow: `0 0 30px ${cyanA(0.45)}`,
              }}
            >
              <span>NEXUS</span>
              <span style={{ color: C.cyan }}>GEO-TRACK</span>
            </div>

            <div
              style={{
                marginTop: 22,
                fontSize: 22,
                lineHeight: 1.4,
                color: cyanA(0.8),
                letterSpacing: 1,
              }}
            >
              Your location, network &amp; device — scanned through a cinematic
              command-center interface.
            </div>

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 10,
                marginTop: 26,
              }}
            >
              {BADGES.map((badge) => (
                <div
                  key={badge}
                  style={{
                    display: "flex",
                    padding: "6px 14px",
                    fontSize: 13,
                    fontWeight: 700,
                    letterSpacing: 2,
                    color: C.cyan,
                    backgroundColor: cyanA(0.08),
                    border: `1px solid ${cyanA(0.35)}`,
                  }}
                >
                  {badge}
                </div>
              ))}
            </div>
          </div>

          {/* Right: orbital radar */}
          <div
            style={{
              display: "flex",
              position: "relative",
              width: 380,
              height: 380,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width="380" height="380" viewBox="0 0 400 400">
              <defs>
                <radialGradient
                  id="sweep"
                  cx={CX}
                  cy={CY}
                  r={R}
                  gradientUnits="userSpaceOnUse"
                >
                  <stop offset="0" stopColor={C.cyan} stopOpacity="0" />
                  <stop offset="1" stopColor={C.cyan} stopOpacity="0.38" />
                </radialGradient>
                <radialGradient id="disc" cx="0.5" cy="0.5" r="0.5">
                  <stop offset="0" stopColor="#0a1a2e" stopOpacity="0.9" />
                  <stop offset="1" stopColor="#050b17" stopOpacity="0.9" />
                </radialGradient>
              </defs>

              {/* Disc + elevation rings (horizon 0°, 30°, 60°) */}
              <circle cx={CX} cy={CY} r={R} fill="url(#disc)" />
              <circle
                cx={CX}
                cy={CY}
                r={R}
                fill="none"
                stroke={cyanA(0.7)}
                strokeWidth="2"
              />
              <circle
                cx={CX}
                cy={CY}
                r={120}
                fill="none"
                stroke={cyanA(0.4)}
                strokeWidth="1"
                strokeDasharray="5 5"
              />
              <circle
                cx={CX}
                cy={CY}
                r={60}
                fill="none"
                stroke={cyanA(0.4)}
                strokeWidth="1"
              />

              {/* Axes + diagonals */}
              <line
                x1={CX}
                y1={CY - R}
                x2={CX}
                y2={CY + R}
                stroke={cyanA(0.2)}
              />
              <line
                x1={CX - R}
                y1={CY}
                x2={CX + R}
                y2={CY}
                stroke={cyanA(0.2)}
              />
              <line
                x1={CX - 127}
                y1={CY - 127}
                x2={CX + 127}
                y2={CY + 127}
                stroke={cyanA(0.1)}
              />
              <line
                x1={CX + 127}
                y1={CY - 127}
                x2={CX - 127}
                y2={CY + 127}
                stroke={cyanA(0.1)}
              />

              {/* Sweep wedge (0° → 70°) */}
              <path
                d={`M${CX} ${CY} L${CX} ${CY - R} A${R} ${R} 0 0 1 ${SWEEP_END.x} ${SWEEP_END.y} Z`}
                fill="url(#sweep)"
              />
              <line
                x1={CX}
                y1={CY}
                x2={SWEEP_END.x}
                y2={SWEEP_END.y}
                stroke={C.cyan}
                strokeWidth="2"
              />

              {/* Zenith */}
              <circle cx={CX} cy={CY} r="9" fill={C.cyan} fillOpacity="0.25" />
              <circle cx={CX} cy={CY} r="4" fill={C.cyan} />

              {/* Sun */}
              <circle
                cx={SUN.x}
                cy={SUN.y}
                r="14"
                fill={C.amber}
                fillOpacity="0.2"
              />
              <circle cx={SUN.x} cy={SUN.y} r="6" fill={C.amber} />

              {/* Satellites */}
              {SATS.map((s, i) => (
                <g key={i}>
                  {s.selected && (
                    <circle
                      cx={s.x}
                      cy={s.y}
                      r="18"
                      fill="none"
                      stroke={C.cyan}
                      strokeWidth="1.5"
                    />
                  )}
                  <circle
                    cx={s.x}
                    cy={s.y}
                    r="11"
                    fill={s.color}
                    fillOpacity="0.2"
                  />
                  <circle cx={s.x} cy={s.y} r="4.5" fill={s.color} />
                </g>
              ))}
            </svg>

            {/* Cardinal labels */}
            <span
              style={{
                position: "absolute",
                top: -4,
                left: 182,
                fontSize: 15,
                fontWeight: 700,
                color: C.white,
              }}
            >
              N
            </span>
            <span
              style={{
                position: "absolute",
                bottom: -4,
                left: 184,
                fontSize: 14,
                color: cyanA(0.6),
              }}
            >
              S
            </span>
            <span
              style={{
                position: "absolute",
                right: -4,
                top: 180,
                fontSize: 14,
                color: cyanA(0.6),
              }}
            >
              E
            </span>
            <span
              style={{
                position: "absolute",
                left: -4,
                top: 180,
                fontSize: 14,
                color: cyanA(0.6),
              }}
            >
              W
            </span>
          </div>
        </div>

        {/* Footer telemetry bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: `1px solid ${cyanA(0.2)}`,
            paddingTop: 16,
            fontSize: 13,
            letterSpacing: 2,
            color: cyanA(0.6),
          }}
        >
          {FOOTER.map((f) => (
            <div key={f.k} style={{ display: "flex", gap: 8 }}>
              <span>{f.k}:</span>
              <span style={{ color: f.c, fontWeight: 700 }}>{f.v}</span>
            </div>
          ))}
        </div>
      </div>
    </div>,
    { ...size },
  );
}

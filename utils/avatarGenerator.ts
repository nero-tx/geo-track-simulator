// Procedural Tactical Avatar and Agent Profile Generator
// Produces deterministic SVG avatars and intelligence dossier data from any username

export interface OperatorProfile {
  username: string;
  codename: string;
  rank: string;
  clearance: string;
  agentId: string;
  avatarSvg: string;
  avatarDataUrl: string;
  primaryColor: string;
  secondaryColor: string;
  joinedAt: string;
  worldControlStatus: string;
}

function hashString(str: string): number {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) + hash) + str.charCodeAt(i);
    hash = hash & hash;
  }
  return Math.abs(hash);
}

const RANKS = [
  "DIRECTOR OF COVERT OPS",
  "GLOBAL SURVEILLANCE OVERSEER",
  "CHIEF OF TACTICAL OPERATIONS",
  "OMEGA-9 STATION CONTROLLER",
  "DEFENSE CYBER COMMANDER",
  "BLACK-OPS MISSION SPECIALIST",
  "GLOBAL RECONNAISSANCE CHIEF"
];

const CLEARANCES = [
  "TOP SECRET // SCI // NOFORN [LVL 5]",
  "OMNI-CLEARANCE // EYES ONLY [LVL 5]",
  "PALANTIR GOTHAM OVERLORD [LVL 5]",
  "SPECIAL ACCESS PROGRAM // ZERO",
  "COSMIC TOP SECRET // ATOMAL",
  "DIRECTOR GENERAL PRIVILEGED"
];

const PALETTES = [
  { primary: "#00f0ff", secondary: "#0077ff", name: "CYAN_STEALTH" },
  { primary: "#00ff88", secondary: "#00a86b", name: "EMERALD_SPECTRE" },
  { primary: "#ffaa00", secondary: "#ff5500", name: "AMBER_VANGUARD" },
  { primary: "#ff3355", secondary: "#aa0033", name: "CRIMSON_VALKYRIE" },
  { primary: "#8a63ff", secondary: "#4d2fff", name: "ULTRAVIOLET_PHANTOM" },
  { primary: "#38bdf8", secondary: "#0284c7", name: "AEGIS_BLUE" }
];

export function generateOperatorProfile(rawName: string): OperatorProfile {
  const username = (rawName || "AGENT_UNKNOWN").trim();
  const seed = hashString(username);

  const palette = PALETTES[seed % PALETTES.length];
  const rank = RANKS[seed % RANKS.length];
  const clearance = CLEARANCES[(seed >> 3) % CLEARANCES.length];
  const idNum = 1000 + (seed % 9000);
  const prefix = ["CIA", "NEXUS", "PLTR", "NSA", "NRO"][seed % 5];
  const agentId = `${prefix}-${idNum}-${username.slice(0, 3).toUpperCase()}`;

  // Procedural SVG elements based on hash bits
  const visorStyle = (seed >> 1) % 4;
  const gridDensity = 4 + (seed % 4);
  const reticleAngle = (seed * 37) % 360;
  const antennaSide = seed % 2 === 0 ? "left" : "right";

  // Create an intricate, high-tech tactical cyber helmet / operative wireframe SVG
  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="100%" height="100%">
  <defs>
    <radialGradient id="bgGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="${palette.primary}" stop-opacity="0.25"/>
      <stop offset="70%" stop-color="${palette.secondary}" stop-opacity="0.1"/>
      <stop offset="100%" stop-color="#040810" stop-opacity="0.9"/>
    </radialGradient>
    <linearGradient id="visorGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${palette.primary}" stop-opacity="0.95"/>
      <stop offset="50%" stop-color="${palette.secondary}" stop-opacity="0.8"/>
      <stop offset="100%" stop-color="${palette.primary}" stop-opacity="0.4"/>
    </linearGradient>
    <pattern id="miniGrid" width="${gridDensity}" height="${gridDensity}" patternUnits="userSpaceOnUse">
      <path d="M ${gridDensity} 0 L 0 0 0 ${gridDensity}" fill="none" stroke="${palette.primary}" stroke-width="0.3" stroke-opacity="0.15"/>
    </pattern>
  </defs>

  <!-- Background base -->
  <rect width="120" height="120" fill="#040810"/>
  <rect width="120" height="120" fill="url(#bgGlow)"/>
  <rect width="120" height="120" fill="url(#miniGrid)"/>

  <!-- Outer HUD Targeting Ring -->
  <circle cx="60" cy="60" r="54" fill="none" stroke="${palette.primary}" stroke-width="0.8" stroke-opacity="0.3" stroke-dasharray="4, 3"/>
  <circle cx="60" cy="60" r="48" fill="none" stroke="${palette.secondary}" stroke-width="0.5" stroke-opacity="0.4"/>

  <!-- Angle ticks around perimeter -->
  <g transform="rotate(${reticleAngle} 60 60)">
    <line x1="60" y1="4" x2="60" y2="10" stroke="${palette.primary}" stroke-width="1.5"/>
    <line x1="60" y1="110" x2="60" y2="116" stroke="${palette.primary}" stroke-width="1.5"/>
    <line x1="4" y1="60" x2="10" y2="60" stroke="${palette.primary}" stroke-width="1.5"/>
    <line x1="110" y1="60" x2="116" y2="60" stroke="${palette.primary}" stroke-width="1.5"/>
  </g>

  <!-- Operative Shoulders / Tactical Armor -->
  <path d="M 24 116 L 36 96 L 84 96 L 96 116 Z" fill="#0c172d" stroke="${palette.primary}" stroke-width="1" stroke-opacity="0.5"/>
  <path d="M 40 96 L 46 86 L 74 86 L 80 96 Z" fill="#081020" stroke="${palette.secondary}" stroke-width="0.8"/>

  <!-- Head Base / Helmet Contour -->
  <path d="M 38 46 C 38 28, 82 28, 82 46 L 80 76 C 80 84, 60 88, 60 88 C 60 88, 40 84, 40 76 Z" 
        fill="#071124" stroke="${palette.primary}" stroke-width="1.2"/>

  <!-- Cheek Armor Facets -->
  <path d="M 38 52 L 46 72 L 40 76 Z" fill="#0d1b38" stroke="${palette.secondary}" stroke-width="0.6"/>
  <path d="M 82 52 L 74 72 L 80 76 Z" fill="#0d1b38" stroke="${palette.secondary}" stroke-width="0.6"/>

  <!-- Visor Styles -->
  ${visorStyle === 0 ? `
    <!-- Monolithic Tactical Bar Visor -->
    <path d="M 42 46 L 78 46 L 75 58 L 45 58 Z" fill="url(#visorGrad)" stroke="${palette.primary}" stroke-width="1"/>
    <line x1="42" y1="52" x2="78" y2="52" stroke="#ffffff" stroke-width="0.8" stroke-opacity="0.9"/>
  ` : visorStyle === 1 ? `
    <!-- Dual Biometric Combat Goggles -->
    <rect x="42" y="47" width="15" height="11" rx="2" fill="url(#visorGrad)" stroke="${palette.primary}" stroke-width="1"/>
    <rect x="63" y="47" width="15" height="11" rx="2" fill="url(#visorGrad)" stroke="${palette.primary}" stroke-width="1"/>
    <line x1="57" y1="52" x2="63" y2="52" stroke="${palette.primary}" stroke-width="1.5"/>
    <circle cx="49.5" cy="52.5" r="2.5" fill="#ffffff" opacity="0.8"/>
    <circle cx="70.5" cy="52.5" r="2.5" fill="#ffffff" opacity="0.8"/>
  ` : visorStyle === 2 ? `
    <!-- Hexagonal Cyber Sight -->
    <polygon points="60,43 76,49 74,60 60,63 46,60 44,49" fill="url(#visorGrad)" stroke="${palette.primary}" stroke-width="1.2"/>
    <circle cx="60" cy="53" r="4" fill="none" stroke="#ffffff" stroke-width="1" stroke-opacity="0.8"/>
    <line x1="53" y1="53" x2="67" y2="53" stroke="#ffffff" stroke-width="0.8"/>
  ` : `
    <!-- Angular Stealth Visor -->
    <path d="M 41 50 L 60 44 L 79 50 L 74 59 L 60 55 L 46 59 Z" fill="url(#visorGrad)" stroke="${palette.primary}" stroke-width="1"/>
    <line x1="48" y1="52" x2="72" y2="52" stroke="#ffffff" stroke-width="0.6"/>
  `}

  <!-- Cybernetic Facial Line Markings -->
  <line x1="50" y1="67" x2="70" y2="67" stroke="${palette.primary}" stroke-width="0.8" stroke-opacity="0.6"/>
  <line x1="54" y1="72" x2="66" y2="72" stroke="${palette.secondary}" stroke-width="0.8" stroke-opacity="0.4"/>
  <line x1="60" y1="74" x2="60" y2="84" stroke="${palette.primary}" stroke-width="0.7" stroke-opacity="0.5"/>

  <!-- Comms Antenna -->
  ${antennaSide === "left" ? `
    <line x1="36" y1="46" x2="31" y2="28" stroke="${palette.primary}" stroke-width="1.2"/>
    <circle cx="30" cy="27" r="2" fill="${palette.primary}"/>
    <circle cx="30" cy="27" r="4" fill="none" stroke="${palette.primary}" stroke-width="0.5" stroke-opacity="0.5"/>
  ` : `
    <line x1="84" y1="46" x2="89" y2="28" stroke="${palette.primary}" stroke-width="1.2"/>
    <circle cx="90" cy="27" r="2" fill="${palette.primary}"/>
    <circle cx="90" cy="27" r="4" fill="none" stroke="${palette.primary}" stroke-width="0.5" stroke-opacity="0.5"/>
  `}

  <!-- Forehead Sensor Array -->
  <rect x="56" y="34" width="8" height="3" rx="1" fill="${palette.primary}" opacity="0.9"/>
  <circle cx="51" cy="35.5" r="1" fill="${palette.secondary}"/>
  <circle cx="69" cy="35.5" r="1" fill="${palette.secondary}"/>


  <!-- Corner Brackets -->
  <path d="M 6 12 L 6 6 L 12 6" fill="none" stroke="${palette.primary}" stroke-width="1.2"/>
  <path d="M 114 12 L 114 6 L 108 6" fill="none" stroke="${palette.primary}" stroke-width="1.2"/>
  <path d="M 6 108 L 6 114 L 12 114" fill="none" stroke="${palette.primary}" stroke-width="1.2"/>
  <path d="M 114 108 L 114 114 L 108 114" fill="none" stroke="${palette.primary}" stroke-width="1.2"/>
</svg>
  `.trim();

  const avatarDataUrl = `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;

  return {
    username,
    codename: username.toUpperCase().replace(/\s+/g, "_"),
    rank,
    clearance,
    agentId,
    avatarSvg: svg,
    avatarDataUrl,
    primaryColor: palette.primary,
    secondaryColor: palette.secondary,
    joinedAt: new Date().toISOString(),
    worldControlStatus: "GLOBAL SURVEILLANCE GRID: CONNECTED // DEFCON 2"
  };
}

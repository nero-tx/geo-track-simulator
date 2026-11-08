"use client";

import { useEffect, useState } from "react";
import { DashboardTab, DefconLevel, GeoData, ScanPhase } from "@/utils/types";
import {
  calculateSpaceTelemetry,
  calculateStrategicLandmarks,
  fetchRealEnvironment,
  getCurrentLocation,
  parseUA,
  reverseGeocode,
  sleep,
} from "@/utils/utils";
import {
  generateOperatorProfile,
  OperatorProfile,
} from "@/utils/avatarGenerator";
import {
  playBeep,
  playScanChirp,
  playSonarPing,
  playTargetLock,
} from "@/utils/soundFx";

import OperatorHeader from "@/components/OperatorHeader";
import OperatorModal from "@/components/OperatorModal";
import StatusBar from "@/components/StatusBar";
import MissionBrief from "@/components/MissionBrief";
import ScanControl from "@/components/ScanControl";
import MapPanel from "@/components/MapPanel";
import SpaceMapPanel from "@/components/SpaceMapPanel";
import TelemetryChartsPanel from "@/components/TelemetryChartsPanel";
import StrategicProximityPanel from "@/components/StrategicProximityPanel";
import LocationPanel from "@/components/LocationPanel";
import GPSPanel from "@/components/GPSPanel";
import DevicePanel from "@/components/DevicePanel";
import NetworkPanel from "@/components/NetworkPanel";

import { MapPin, Satellite, Activity, Shield } from "lucide-react";

export default function Home() {
  const [operator, setOperator] = useState<OperatorProfile | null>(null);
  const [showOperatorModal, setShowOperatorModal] = useState(false);
  const [defcon, setDefcon] = useState<DefconLevel>(2);

  const [phase, setPhase] = useState<ScanPhase>("idle");
  const [data, setData] = useState<GeoData | null>(null);
  const [activeTab, setActiveTab] = useState<DashboardTab>("tactical_map");

  // Load Operator Profile from localStorage
  useEffect(() => {
    const timer = setTimeout(() => {
      if (typeof window !== "undefined") {
        const savedProfile = localStorage.getItem("operator_profile");
        const savedName = localStorage.getItem("operator_callsign");
        if (savedProfile) {
          try {
            setOperator(JSON.parse(savedProfile));
          } catch {
            const prof = generateOperatorProfile(
              savedName || "COMMANDER_VANCE",
            );
            setOperator(prof);
          }
        } else {
          // First visit: ask for operator callsign
          setShowOperatorModal(true);
        }
      }
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  const handleSaveOperator = (profile: OperatorProfile) => {
    setOperator(profile);
    setShowOperatorModal(false);
  };

  // High-Accuracy Full Mission Scan Sequence
  const startScan = async () => {
    setData(null);
    const d: Partial<GeoData> = {};

    setPhase("uplink");
    playScanChirp();
    await sleep(400);

    // 1. Telecom & IP-based fallback
    setPhase("satellite");
    try {
      const r = await fetch("https://ipapi.co/json/");
      const j = await r.json();
      d.ip = j.ip || "127.0.0.1";
      d.country = j.country_name || "UNKNOWN SECTOR";
      d.countryCode = j.country_code || "--";
      d.region = j.region || "--";
      d.city = j.city || "UNKNOWN";
      d.isp = j.org || "DEFENSE TELECOM GATEWAY";
      d.timezone = j.timezone || "UTC";
      d.currency = j.currency || "USD";
      d.ipLat = typeof j.latitude === "number" ? j.latitude : 38.9517;
      d.ipLng = typeof j.longitude === "number" ? j.longitude : -77.1467;
    } catch {
      d.ip = "204.110.244.1";
      d.country = "UNITED STATES";
      d.countryCode = "US";
      d.region = "VIRGINIA";
      d.city = "MCLEAN";
      d.isp = "DEFENSE INFORMATION SYSTEMS AGENCY";
      d.timezone = "America/New_York";
      d.currency = "USD";
      d.ipLat = 38.9517;
      d.ipLng = -77.1467;
    }
    await sleep(350);

    // 2. High-Accuracy Browser Geolocation
    setPhase("gps");
    let targetLat = d.ipLat ?? 38.9517;
    let targetLng = d.ipLng ?? -77.1467;

    try {
      const pos = await getCurrentLocation();
      targetLat = pos.lat;
      targetLng = pos.lng;
      d.lat = pos.lat.toFixed(6);
      d.lng = pos.lng.toFixed(6);
      d.accuracy = `${pos.accuracy}m`;
      d.accuracyMeters = pos.accuracy;
      d.gpsOk = true;
      d.altitudeMeters = pos.altitude;
      d.speed = pos.speed;
      d.heading = pos.heading;
      playBeep(1400, 0.08);
    } catch {
      d.lat = targetLat.toFixed(5);
      d.lng = targetLng.toFixed(5);
      d.accuracy = "±5000m (IP CELL)";
      d.accuracyMeters = 5000;
      d.gpsOk = false;
      d.altitudeMeters = null;
    }
    d.mapLat = targetLat;
    d.mapLng = targetLng;
    await sleep(300);

    // 3. Exact Reverse Geocoding
    setPhase("reverse_geo");
    const address = await reverseGeocode(targetLat, targetLng);
    d.exactAddress = address;
    if (address.city) d.city = address.city;
    if (address.country) d.country = address.country;
    if (address.countryCode) d.countryCode = address.countryCode;
    await sleep(350);

    // 4. Space Orbital Satellite Ephemeris
    setPhase("space_orbital");
    d.space = calculateSpaceTelemetry(targetLat, targetLng);
    await sleep(350);

    // 5. Real Atmospheric Telemetry (Open-Meteo)
    setPhase("telemetry");
    d.environment = await fetchRealEnvironment(targetLat, targetLng);
    await sleep(350);

    // 6. Device Fingerprint & Strategic Proximity
    setPhase("fingerprint");
    const ua = parseUA();
    d.browser = ua.browser;
    d.os = ua.os;
    d.device = ua.device;
    d.gpuRenderer = ua.gpuRenderer;
    d.networkType = ua.networkType;
    d.downlinkSpeed = ua.downlinkSpeed;
    d.language =
      typeof navigator !== "undefined" ? navigator.language : "en-US";
    d.clientTz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    d.screen =
      typeof screen !== "undefined"
        ? `${screen.width}x${screen.height}`
        : "1920x1080";
    d.cores = `${typeof navigator !== "undefined" ? navigator.hardwareConcurrency || 8 : 8} CORES`;

    // Strategic Landmarks Calculation
    d.landmarks = calculateStrategicLandmarks(targetLat, targetLng);
    await sleep(300);

    setData(d as GeoData);
    setPhase("done");
    playTargetLock();
    playSonarPing();
  };

  const reset = () => {
    playBeep(600, 0.08);
    setPhase("idle");
    setData(null);
  };

  // Default operator placeholder while initializing
  const activeOperator =
    operator || generateOperatorProfile("COMMANDER_SHADOW");

  return (
    <div className="min-h-screen bg-[#040810] text-[#00f0ff] tactical-grid-bg relative pb-16">
      {/* Operator Callsign / Avatar Onboarding Modal */}
      <OperatorModal
        isOpen={showOperatorModal}
        onSave={handleSaveOperator}
        initialName={operator?.username || ""}
        setOpen={setShowOperatorModal}
      />

      {/* Top Palantir / CIA Operator Control Header */}
      <OperatorHeader
        operator={activeOperator}
        defcon={defcon}
        onSetDefcon={setDefcon}
        onEditOperator={() => setShowOperatorModal(true)}
      />

      {/* Classified Surveillance Status Bar */}
      <StatusBar />

      {/* Main Tactical Dashboard Container */}
      <main className="max-w-full mx-auto p-3 sm:p-5 space-y-5">
        {/* Top Control Grid: Directive Brief & Target Authorization */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <MissionBrief />
          <ScanControl phase={phase} onScan={startScan} onReset={reset} />
        </div>

        {/* Display Intel Panels once Scan completes */}
        {data && (
          <div className="space-y-5 reveal">
            {/* Navigation Tabs for Hollywood Spy Command Experience */}
            <div className="flex flex-wrap items-center gap-2 border-b border-cyan-500/20 pb-2">
              {[
                {
                  id: "tactical_map",
                  label: "TACTICAL GEO-RADAR",
                  icon: MapPin,
                },
                {
                  id: "space_recon",
                  label: "ORBITAL SPACE RECON",
                  icon: Satellite,
                },
                {
                  id: "telemetry_charts",
                  label: "REAL ATMOSPHERIC CHARTS",
                  icon: Activity,
                },
                {
                  id: "intel_dossier",
                  label: "GLOBAL INTEL & STRATEGIC MATRIX",
                  icon: Shield,
                },
              ].map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => {
                    playBeep(1100, 0.04);
                    setActiveTab(id as DashboardTab);
                  }}
                  className={`btn-tactical px-4 py-2.5 text-xs font-mono font-bold tracking-wider border cursor-pointer flex items-center gap-2 transition-all ${
                    activeTab === id
                      ? "bg-cyan-500/20 text-cyan-300 border-cyan-400 shadow-[0_0_12px_rgba(0,240,255,0.3)]"
                      : "bg-[#060c18] text-cyan-400/60 border-cyan-500/20 hover:border-cyan-400/40"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{label}</span>
                </button>
              ))}
            </div>

            {/* Active Tab View */}
            {activeTab === "tactical_map" && (
              <div className="space-y-4">
                <MapPanel data={data} />
                <LocationPanel data={data} />
              </div>
            )}

            {activeTab === "space_recon" && (
              <div className="space-y-4">
                <SpaceMapPanel
                  space={data.space}
                  userLat={data.mapLat}
                  userLng={data.mapLng}
                />
              </div>
            )}

            {activeTab === "telemetry_charts" && (
              <div className="space-y-4">
                <TelemetryChartsPanel
                  env={data.environment}
                  lat={data.mapLat}
                  lng={data.mapLng}
                />
              </div>
            )}

            {activeTab === "intel_dossier" && (
              <div className="space-y-4">
                <StrategicProximityPanel landmarks={data.landmarks} />
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <GPSPanel data={data} />
                  <DevicePanel data={data} />
                </div>
                <NetworkPanel
                  data={data}
                  operatorCodename={activeOperator.codename}
                />
              </div>
            )}

            {/* Quick Access Grid for Complete Operational Overview */}
            {activeTab === "tactical_map" && (
              <div className="pt-2 border-t border-cyan-500/15">
                <div className="text-[10px] text-cyan-400/50 font-mono tracking-widest mb-3">
                  SECONDARY TELEMETRY TILES:
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <GPSPanel data={data} />
                  <DevicePanel data={data} />
                  <NetworkPanel
                    data={data}
                    operatorCodename={activeOperator.codename}
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}


export interface StrategicLandmark {
  name: string;
  code: string;
  category: "INTEL" | "MILITARY" | "NUCLEAR" | "COMMAND";
  lat: number;
  lng: number;
  distanceKm: number;
  distanceNm: number;
  bearingDeg: number;
  subsonicFlightTimeMin: number;
}

export interface HourlyTelemetryPoint {
  time: string;
  hour: string;
  temp: number;
  pressure: number;
  humidity: number;
  windSpeed: number;
}

export interface EnvironmentalTelemetry {
  temperatureC: number;
  temperatureF: number;
  apparentTempC: number;
  relativeHumidity: number;
  surfacePressureHpa: number;
  windSpeedKmh: number;
  windDirectionDeg: number;
  weatherCode: number;
  weatherCondition: string;
  uvIndex: number;
  cloudCoverPercent: number;
  hourly: HourlyTelemetryPoint[];
}

export interface OrbitalSatellite {
  id: string;
  name: string;
  type: "RECON_OPTICAL" | "SIGINT_SURVEILLANCE" | "SPACE_STATION" | "RADAR_IMAGERY";
  noradId: number;
  altitudeKm: number;
  speedKmh: number;
  inclinationDeg: number;
  azimuthDeg: number;
  elevationDeg: number;
  overpassMinutes: number;
  trackingStatus: "ACQUIRED" | "INTERCEPT" | "IN_RANGE" | "LOS";
}

export interface SpaceTelemetry {
  satellites: OrbitalSatellite[];
  sunAltitudeDeg: number;
  sunAzimuthDeg: number;
  moonPhase: string;
  solarFluxIndex: number;
  geomagneticKp: number;
}

export interface ExactAddress {
  road?: string;
  houseNumber?: string;
  neighborhood?: string;
  suburb?: string;
  city?: string;
  county?: string;
  state?: string;
  postcode?: string;
  country?: string;
  countryCode?: string;
  formattedAddress: string;
}

export interface GeoData {
  // IP-based fallback & ISP
  ip: string;
  country: string;
  countryCode: string;
  region: string;
  city: string;
  isp: string;
  timezone: string;
  currency: string;
  ipLat: number;
  ipLng: number;

  // Exact Browser GPS Precision
  lat: string;
  lng: string;
  accuracy: string;
  accuracyMeters: number;
  gpsOk: boolean;
  mapLat: number;
  mapLng: number;
  altitudeMeters?: number | null;
  heading?: number | null;
  speed?: number | null;

  // Exact reverse-geocoded physical address
  exactAddress: ExactAddress;

  // Strategic Proximity Matrix
  landmarks: StrategicLandmark[];

  // Real Environmental & Atmospheric Data (Open-Meteo)
  environment: EnvironmentalTelemetry | null;

  // Space & Orbital Tracking
  space: SpaceTelemetry;

  // Browser & Device Fingerprint
  browser: string;
  os: string;
  device: string;
  language: string;
  clientTz: string;
  screen: string;
  cores: string;
  gpuRenderer?: string;
  networkType?: string;
  downlinkSpeed?: string;
}

export type ScanPhase =
  | "idle"
  | "uplink"
  | "satellite"
  | "gps"
  | "reverse_geo"
  | "space_orbital"
  | "telemetry"
  | "fingerprint"
  | "done";

export type DashboardTab = "tactical_map" | "space_recon" | "telemetry_charts" | "intel_dossier";

export type DefconLevel = 1 | 2 | 3 | 4 | 5;

import {
  EnvironmentalTelemetry,
  ExactAddress,
  GeoData,
  HourlyTelemetryPoint,
  OrbitalSatellite,
  SpaceTelemetry,
  StrategicLandmark,
} from "./types";

export function sleep(ms: number) {
  return new Promise<void>((r) => setTimeout(r, ms));
}

// Tactical WebGL and Browser Fingerprinting
export function parseUA() {
  if (typeof navigator === "undefined") {
    return {
      browser: "Unknown",
      os: "Unknown",
      device: "DESKTOP",
      gpuRenderer: "UNKNOWN_HARDWARE",
      networkType: "UNKNOWN",
      downlinkSpeed: "UNKNOWN",
    };
  }

  const ua = navigator.userAgent;
  let browser = "Unknown",
    os = "Unknown",
    device = "DESKTOP";

  if (/Chrome\//.test(ua) && !/Edg|OPR/.test(ua)) {
    const m = ua.match(/Chrome\/([\d]+)/);
    browser = "Chrome " + (m ? m[1] : "");
  } else if (/Firefox\//.test(ua)) {
    const m = ua.match(/Firefox\/([\d]+)/);
    browser = "Firefox " + (m ? m[1] : "");
  } else if (/Safari\//.test(ua) && !/Chrome/.test(ua)) {
    browser = "Safari";
  } else if (/Edg\//.test(ua)) {
    browser = "Edge";
  } else if (/OPR\//.test(ua)) {
    browser = "Opera";
  }

  if (/Win/.test(ua)) os = "Windows";
  else if (/Android/.test(ua)) {
    os = "Android";
    device = "MOBILE";
  } else if (/iPhone/.test(ua)) {
    os = "iOS";
    device = "MOBILE";
  } else if (/iPad/.test(ua)) {
    os = "iOS";
    device = "TABLET";
  } else if (/Mac/.test(ua)) os = "macOS";
  else if (/Linux/.test(ua)) os = "Linux";

  // Attempt WebGL GPU query
  let gpuRenderer = "Integrated Graphics Engine";
  try {
    const canvas = document.createElement("canvas");
    const gl =
      canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    if (gl) {
      const debugInfo = (gl as WebGLRenderingContext).getExtension(
        "WEBGL_debug_renderer_info",
      );
      if (debugInfo) {
        gpuRenderer =
          (gl as WebGLRenderingContext).getParameter(
            debugInfo.UNMASKED_RENDERER_WEBGL,
          ) || gpuRenderer;
      }
    }
  } catch {
    // ignore
  }

  // Network connection telemetry
  let networkType = "High-Speed Uplink";
  let downlinkSpeed = "Gigabit Optical";
  const navConn = (
    navigator as unknown as {
      connection?: { effectiveType?: string; downlink?: number };
    }
  ).connection;
  if (navConn) {
    if (navConn.effectiveType)
      networkType = navConn.effectiveType.toUpperCase() + " TELECOM";
    if (navConn.downlink) downlinkSpeed = `${navConn.downlink} Mbps`;
  }

  return { browser, os, device, gpuRenderer, networkType, downlinkSpeed };
}

// Browser High-Accuracy Geolocation Detection
export function getCurrentLocation(): Promise<{
  lat: number;
  lng: number;
  accuracy: number;
  altitude: number | null;
  heading: number | null;
  speed: number | null;
}> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation hardware not detected"));
      return;
    }

    console.log("Requesting high-accuracy geolocation from browser...");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: Math.round(position.coords.accuracy),
          altitude: position.coords.altitude
            ? Math.round(position.coords.altitude)
            : null,
          heading: position.coords.heading,
          speed: position.coords.speed,
        });

        console.log(position);
      },
      (error) => {
        reject(new Error(error.message));
      },
      {
        enableHighAccuracy: true,
        timeout: 12000,
        maximumAge: 0,
      },
    );
  });
}

// Reverse Geocoding with OpenStreetMap Nominatim
export async function reverseGeocode(
  lat: number,
  lng: number,
): Promise<ExactAddress> {
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`;
    const res = await fetch(url, {
      headers: {
        "Accept-Language": "en-US,en",
      },
    });
    if (!res.ok) throw new Error("Reverse geocode failed");
    const json = await res.json();
    const addr = json.address || {};

    const formattedAddress = json.display_name || "LOCAL SECTOR UNRECORDED";

    return {
      road: addr.road || addr.pedestrian || addr.street,
      houseNumber: addr.house_number,
      neighborhood: addr.neighbourhood || addr.suburb || addr.quarter,
      suburb: addr.suburb || addr.city_district,
      city: addr.city || addr.town || addr.village || addr.municipality,
      county: addr.county,
      state: addr.state,
      postcode: addr.postcode,
      country: addr.country,
      countryCode: addr.country_code
        ? addr.country_code.toUpperCase()
        : undefined,
      formattedAddress,
    };
  } catch {
    return {
      formattedAddress: `GRID COORD [${lat.toFixed(4)}, ${lng.toFixed(4)}] // ADDRESS MASKED`,
    };
  }
}

// Real Environmental Telemetry via Open-Meteo
const WEATHER_CODES: Record<number, string> = {
  0: "Clear Sky (Optimal Visibility)",
  1: "Mainly Clear (High Cloud Ceiling)",
  2: "Partly Cloudy (Minimal Cloud Cover)",
  3: "Overcast (Low Cloud Base)",
  45: "Fog (Reduced Visibility)",
  48: "Depositing Rime Fog",
  51: "Light Drizzle",
  61: "Slight Rainfall",
  63: "Moderate Rainfall",
  65: "Heavy Rainfall",
  71: "Light Snowfall",
  73: "Moderate Snowfall",
  80: "Scattered Rain Showers",
  95: "Thunderstorm (Weather Advisory)",
};

export async function fetchRealEnvironment(
  lat: number,
  lng: number,
): Promise<EnvironmentalTelemetry | null> {
  try {
    const params = new URLSearchParams({
      latitude: String(lat),
      longitude: String(lng),

      current: [
        "temperature_2m",
        "relative_humidity_2m",
        "apparent_temperature",
        "surface_pressure",
        "wind_speed_10m",
        "wind_direction_10m",
        "weather_code",
        "cloud_cover",
      ].join(","),

      hourly: [
        "temperature_2m",
        "surface_pressure",
        "relative_humidity_2m",
        "wind_speed_10m",
        "uv_index",
      ].join(","),

      forecast_days: "1",
    });

    const res = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`);
    const json = await res.json();

    if (!res.ok) {
      console.error("Open-Meteo error:", json.reason);
      throw new Error(json.reason);
    }

    const cur = json.current || {};
    const hr = json.hourly || {};

    const hourlyPoints: HourlyTelemetryPoint[] = [];
    if (Array.isArray(hr.time)) {
      // Pick every 2 hours for 12 data points
      for (let i = 0; i < Math.min(hr.time.length, 24); i += 2) {
        const tStr = hr.time[i] as string;
        const hourLabel = tStr.split("T")[1]?.slice(0, 5) || `${i}:00`;
        hourlyPoints.push({
          time: tStr,
          hour: hourLabel,
          temp: Math.round((hr.temperature_2m?.[i] ?? 0) * 10) / 10,
          pressure: Math.round(hr.surface_pressure?.[i] ?? 1013),
          humidity: Math.round(hr.relative_humidity?.[i] ?? 50),
          windSpeed: Math.round((hr.wind_speed_10m?.[i] ?? 0) * 10) / 10,
        });
      }
    }

    const tempC = Math.round((cur.temperature_2m ?? 20) * 10) / 10;
    const tempF = Math.round(((tempC * 9) / 5 + 32) * 10) / 10;
    const weatherCode = cur.weather_code ?? 0;

    return {
      temperatureC: tempC,
      temperatureF: tempF,
      apparentTempC: Math.round((cur.apparent_temperature ?? tempC) * 10) / 10,
      relativeHumidity: Math.round(cur.relative_humidity_2m ?? 50),
      surfacePressureHpa: Math.round(cur.surface_pressure ?? 1013),
      windSpeedKmh: Math.round((cur.wind_speed_10m ?? 12) * 10) / 10,
      windDirectionDeg: Math.round(cur.wind_direction_10m ?? 180),
      weatherCode,
      weatherCondition: WEATHER_CODES[weatherCode] || "ATMOSPHERIC PHENOMENON",
      uvIndex: Math.round((cur.uv_index ?? 2) * 10) / 10,
      cloudCoverPercent: Math.round(cur.cloud_cover ?? 20),
      hourly: hourlyPoints,
    };
  } catch {
    return null;
  }
}

// Great-circle distance (Haversine formula) in km and bearing in degrees
function calculateHaversine(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
) {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distanceKm = Math.round(R * c);
  const distanceNm = Math.round(distanceKm * 0.539957);

  // Bearing
  const y = Math.sin(dLon) * Math.cos((lat2 * Math.PI) / 180);
  const x =
    Math.cos((lat1 * Math.PI) / 180) * Math.sin((lat2 * Math.PI) / 180) -
    Math.sin((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.cos(dLon);
  const bearingDeg = Math.round(
    ((Math.atan2(y, x) * 180) / Math.PI + 360) % 360,
  );

  // Subsonic flight time (assumes 900 km/h Mach 0.85 jet)
  const flightTimeMin = Math.round((distanceKm / 900) * 60);

  return { distanceKm, distanceNm, bearingDeg, flightTimeMin };
}

export function calculateStrategicLandmarks(
  userLat: number,
  userLng: number,
): StrategicLandmark[] {
  const SITES: {
    name: string;
    code: string;
    category: "INTEL" | "MILITARY" | "NUCLEAR" | "COMMAND";
    lat: number;
    lng: number;
  }[] = [
    {
      name: "CIA Headquarters (George Bush Center)",
      code: "LANGLEY-HQ",
      category: "INTEL",
      lat: 38.9517,
      lng: -77.1467,
    },
    {
      name: "The Pentagon (Department Of Defense)",
      code: "DOD-SECDEF",
      category: "COMMAND",
      lat: 38.8719,
      lng: -77.0563,
    },
    {
      name: "MI6 (Secret Intelligence Service)",
      code: "SIS-VAUXHALL",
      category: "INTEL",
      lat: 51.4872,
      lng: -0.1244,
    },
    {
      name: "NORAD (Cheyenne Mountain Complex)",
      code: "NORAD-CHEYENNE",
      category: "NUCLEAR",
      lat: 38.7444,
      lng: -104.8467,
    },
    {
      name: "NATO (Allied Command Operations)",
      code: "NATO-SHAPE",
      category: "MILITARY",
      lat: 50.8778,
      lng: 4.4258,
    },
    {
      name: "Area 51 (Groom Lake Test Facility)",
      code: "GROOM-LAKE-DET3",
      category: "MILITARY",
      lat: 37.2431,
      lng: -115.793,
    },
    {
      name: "INTERPOL (General Secretariat)",
      code: "INTERPOL-LYON",
      category: "INTEL",
      lat: 45.7797,
      lng: 4.8497,
    },
    {
      name: "Japan Ministry Of Defense (Ichigaya)",
      code: "MOD-ICHIJOGAYA",
      category: "COMMAND",
      lat: 35.6928,
      lng: 139.7314,
    },
    {
      name: "CERN (Geneva Research Complex)",
      code: "GENEVA-CERN-VAULT",
      category: "MILITARY",
      lat: 46.2044,
      lng: 6.1432,
    },
  ];

  return SITES.map((s) => {
    const calc = calculateHaversine(userLat, userLng, s.lat, s.lng);
    return {
      name: s.name,
      code: s.code,
      category: s.category,
      lat: s.lat,
      lng: s.lng,
      distanceKm: calc.distanceKm,
      distanceNm: calc.distanceNm,
      bearingDeg: calc.bearingDeg,
      subsonicFlightTimeMin: calc.flightTimeMin,
    };
  }).sort((a, b) => a.distanceKm - b.distanceKm);
}

// Overhead Spy Satellites & Celestial Calculation
export function calculateSpaceTelemetry(
  userLat: number,
  userLng: number,
): SpaceTelemetry {
  const now = new Date();
  const dayOfYear = Math.floor(
    (now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / 86400000,
  );
  const hour = now.getUTCHours() + now.getUTCMinutes() / 60;

  // Approximate Sun position
  const sunDeclination =
    -23.44 * Math.cos(((2 * Math.PI) / 365) * (dayOfYear + 10));
  const hourAngle = (hour - 12) * 15 + userLng;
  const sinSunAlt =
    Math.sin((userLat * Math.PI) / 180) *
      Math.sin((sunDeclination * Math.PI) / 180) +
    Math.cos((userLat * Math.PI) / 180) *
      Math.cos((sunDeclination * Math.PI) / 180) *
      Math.cos((hourAngle * Math.PI) / 180);
  const sunAltitudeDeg = Math.round(
    (Math.asin(Math.max(-1, Math.min(1, sinSunAlt))) * 180) / Math.PI,
  );
  const sunAzimuthDeg = Math.round(
    ((Math.atan2(
      Math.sin((hourAngle * Math.PI) / 180),
      Math.cos((hourAngle * Math.PI) / 180) *
        Math.sin((userLat * Math.PI) / 180) -
        Math.tan((sunDeclination * Math.PI) / 180) *
          Math.cos((userLat * Math.PI) / 180),
    ) *
      180) /
      Math.PI +
      360) %
      360,
  );

  // Satellite orbit tracking targets
  const satellites: OrbitalSatellite[] = [
    {
      id: "USA-224",
      name: "USA-224 (KH-11 Kennen)",
      type: "RECON_OPTICAL",
      noradId: 37348,
      altitudeKm: 265,
      speedKmh: 27850,
      inclinationDeg: 97.9,
      azimuthDeg: (userLng * 2 + 45) % 360,
      elevationDeg: 68,
      overpassMinutes: 14,
      trackingStatus: "ACQUIRED",
    },
    {
      id: "USA-245",
      name: "USA-245 (Keyhole Reconnaissance)",
      type: "RECON_OPTICAL",
      noradId: 39232,
      altitudeKm: 390,
      speedKmh: 27500,
      inclinationDeg: 97.9,
      azimuthDeg: (userLng * 1.5 + 180) % 360,
      elevationDeg: 42,
      overpassMinutes: 48,
      trackingStatus: "IN_RANGE",
    },
    {
      id: "ISS-ZARYA",
      name: "International Space Station (ISS)",
      type: "SPACE_STATION",
      noradId: 25544,
      altitudeKm: 418,
      speedKmh: 27600,
      inclinationDeg: 51.6,
      azimuthDeg: (userLng * 3 + 90) % 360,
      elevationDeg: 81,
      overpassMinutes: 3,
      trackingStatus: "INTERCEPT",
    },
    {
      id: "COSMOS-2558",
      name: "Cosmos-2558 (Orbital Inspector)",
      type: "SIGINT_SURVEILLANCE",
      noradId: 53323,
      altitudeKm: 435,
      speedKmh: 27420,
      inclinationDeg: 97.4,
      azimuthDeg: (userLng + 290) % 360,
      elevationDeg: 28,
      overpassMinutes: 112,
      trackingStatus: "IN_RANGE",
    },
    {
      id: "SAR-LUPE-3",
      name: "SAR-Lupe 3 (Synthetic Aperture Radar)",
      type: "RADAR_IMAGERY",
      noradId: 32258,
      altitudeKm: 495,
      speedKmh: 27200,
      inclinationDeg: 98.2,
      azimuthDeg: (userLng * 0.8 + 220) % 360,
      elevationDeg: 54,
      overpassMinutes: 26,
      trackingStatus: "ACQUIRED",
    },
  ];

  const moonPhases = [
    "New Moon (0% Illumination)",
    "Waxing Crescent (25% Illumination)",
    "First Quarter (50% Illumination)",
    "Waxing Gibbous (75% Illumination)",
    "Full Moon (100% Illumination)",
    "Waning Gibbous (75% Illumination)",
    "Last Quarter (50% Illumination)",
    "Waning Crescent (25% Illumination)",
  ];
  const moonPhase = moonPhases[(dayOfYear % 29) % moonPhases.length];

  return {
    satellites,
    sunAltitudeDeg,
    sunAzimuthDeg,
    moonPhase,
    solarFluxIndex: 142,
    geomagneticKp: 2,
  };
}

// CIA / Palantir Classified Intelligence Dossier
export function formatDossier(
  d: GeoData,
  operatorCodename = "UNKNOWN_OPERATOR",
) {
  return `======================================================================
CLASSIFIED // TOP SECRET // PALANTIR GOTHAM SURVEILLANCE DOSSIER
CONTROLLING OPERATOR : ${operatorCodename}
SECURITY CLEARANCE   : OMNI-CLEARANCE LEVEL 5 // SPECIAL ACCESS REQUIRED
TIMESTAMP (UTC)      : ${new Date().toISOString()}
======================================================================

[1] PRIMARY TARGET FIX
----------------------------------------------------------------------
LATITUDE             : ${d.lat}
LONGITUDE            : ${d.lng}
GPS ACCURACY         : ${d.accuracy}
ALTITUDE             : ${d.altitudeMeters ? d.altitudeMeters + "m MSL" : "UNRECORDED"}
CONFIRMATION         : ${d.gpsOk ? "VERIFIED HARDWARE GPS FIX" : "IP-DERIVED APPROXIMATION"}

[2] EXACT PHYSICAL ADDRESS
----------------------------------------------------------------------
FORMATTED ADDRESS    : ${d.exactAddress.formattedAddress}
STREET / ROAD        : ${d.exactAddress.road || "--"}
NEIGHBORHOOD         : ${d.exactAddress.neighborhood || "--"}
MUNICIPALITY / CITY  : ${d.exactAddress.city || d.city || "--"}
STATE / REGION       : ${d.exactAddress.state || d.region || "--"}
POSTAL CODE          : ${d.exactAddress.postcode || "--"}
COUNTRY              : ${d.country} [${d.countryCode}]

[3] CARRIER & TELECOMMUNICATIONS SIGNATURE
----------------------------------------------------------------------
PUBLIC IP            : ${d.ip}
INTERNET SERVICE PROV: ${d.isp}
NETWORK TYPE         : ${d.networkType || "--"}
CARRIER DOWNLINK     : ${d.downlinkSpeed || "--"}
TIMEZONE REGISTER    : ${d.timezone} (CLIENT: ${d.clientTz})

[4] HARDWARE & HARDENING PROFILE
----------------------------------------------------------------------
BROWSER PLATFORM     : ${d.browser}
OPERATING SYSTEM     : ${d.os}
FORM FACTOR          : ${d.device}
HARDWARE CORES       : ${d.cores}
GRAPHICS HARDWARE    : ${d.gpuRenderer || "--"}
DISPLAY MATRIX       : ${d.screen}
SYSTEM LOCALE        : ${d.language}

[5] PROXIMITY TO STRATEGIC COMMAND HUBS
----------------------------------------------------------------------
${d.landmarks
  .slice(0, 4)
  .map(
    (l) =>
      `${l.code.padEnd(18)}: ${l.distanceKm} km (${l.distanceNm} NM) | BEARING ${l.bearingDeg}° | FLIGHT ${l.subsonicFlightTimeMin}m`,
  )
  .join("\n")}

======================================================================
END OF DOSSIER // EYES ONLY // DESTROY AFTER DISSEMINATION
======================================================================`;
}

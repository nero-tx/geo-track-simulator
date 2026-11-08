# 🛰️ NEXUS GEO-TRACK

> **A fun, terminal-inspired reconnaissance tool for exploring your location, network, and device information.**

NEXUS GEO-TRACK is a small interactive web application that simulates a futuristic geo-recon mission. With a single scan, it collects publicly available IP information, requests your browser's GPS location, visualizes your coordinates on a map, and reveals basic browser and device details.

Designed with a cyberpunk-inspired interface, animated scanning phases, and a classified-mission aesthetic, NEXUS turns ordinary browser APIs into a fun interactive experience.

---

## ✨ Features

- **🌐 IP Reconnaissance** — Retrieves your public IP address, approximate location, ISP, timezone, and currency using [ipapi](https://ipapi.co/).
- **📡 GPS Tracking** — Requests your device's location using the browser Geolocation API, including coordinates and accuracy.
- **🗺️ Interactive Map** — Visualizes your location using GPS coordinates or an approximate IP-based fallback.
- **🖥️ Device Fingerprinting** — Detects browser, operating system, device type, screen resolution, language, timezone, and available CPU cores.
- **📶 Network Intelligence** — Displays collected IP and network-related information.
- **⚡ Animated Scan Sequence** — Walks through simulated uplink, satellite, GPS, map, and fingerprinting phases.
- **🔄 Scan Reset** — Reset the interface and run another reconnaissance session.
- **🎮 Cyberpunk UI** — A green terminal aesthetic with orange accents, live indicators, and classified mission panels.

---

## 🔍 Reconnaissance Workflow

Every scan follows a sequence of phases:

| Phase         | Operation                                  |
| ------------- | ------------------------------------------ |
| `idle`        | Waiting for a new mission                  |
| `uplink`      | Initializing reconnaissance                |
| `satellite`   | Retrieving IP-based geographic information |
| `gps`         | Requesting browser GPS coordinates         |
| `map`         | Preparing the location visualization       |
| `fingerprint` | Collecting browser and device information  |
| `done`        | Mission completed                          |

---

## 📊 Information Collected

### Location & Network

- Public IP address
- Country and country code
- Region and city
- ISP / organization
- Timezone
- Currency
- IP-based latitude and longitude

### GPS

- Latitude and longitude
- GPS accuracy
- GPS permission status
- Map coordinates

### Device

- Browser name
- Operating system
- Device type
- Browser language
- Client timezone
- Screen resolution
- Available logical CPU cores

---

## 🛠️ Tech Stack

- **Next.js** — React framework and application architecture
- **React** — Interactive UI and state management
- **TypeScript** — Type-safe application data
- **Browser APIs** — Geolocation, Navigator, Screen, and Intl APIs
- **ipapi** — IP geolocation and network information

---

## 🚀 Getting Started

### Prerequisites

- Node.js
- npm, pnpm, yarn, or bun

### Installation

```bash
git clone https://github.com/nero-tx/net-info.git
cd net-info
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production

```bash
npm run build
npm run start
```

---

## 📍 Location Permissions

NEXUS uses two different location sources:

| Source         | Description                                                               |
| -------------- | ------------------------------------------------------------------------- |
| IP Geolocation | Estimates your location from your public IP address                       |
| Browser GPS    | Requests precise coordinates from your device, if available and permitted |

GPS access requires browser permission and a secure context (HTTPS or localhost).

If GPS access is denied or unavailable, the application falls back to IP-based coordinates for its map location.

**Note:** IP-based location is approximate and may not represent your actual physical location.

---

## 🔐 Privacy & Security

NEXUS GEO-TRACK is an informational and educational tool, not a surveillance system.

- GPS coordinates are requested only when you initiate a scan.
- GPS access requires explicit browser permission.
- IP information is retrieved through the external ipapi service.
- Device information is collected through browser APIs.
- Browser information is approximate and does not identify a person uniquely.
- GPS coordinates and device details should be treated as sensitive information.

The application does not bypass browser permissions or access restricted device information.

---

## ⚠️ Disclaimer

NEXUS GEO-TRACK is intended for educational purposes, personal experimentation, and entertainment.

It does not provide access to private networks, hidden device information, or unauthorized tracking capabilities.

---

## 👨‍💻 Author

**Tarek Fawzy**

- GitHub: [@nero-tx](https://github.com/nero-tx)

---

> `NEXUS // GEO-TRACK v4.2`
>
> `Initialize uplink. Acquire coordinates. Complete reconnaissance.`

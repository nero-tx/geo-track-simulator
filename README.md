# 🛰️ NEXUS GEO-TRACK

> **A fictional reconnaissance terminal for exploring your location, network, and device — inspired by military intelligence systems and futuristic command interfaces.**

NEXUS GEO-TRACK is an interactive, terminal-inspired web application that transforms ordinary browser capabilities into a simulated geospatial reconnaissance mission.

With a single scan, NEXUS collects publicly available IP information, requests browser-based geolocation, visualizes geographic coordinates, retrieves environmental telemetry, and displays basic browser and device information.

The experience combines real-world data with a fictional military command-center interface, featuring animated acquisition sequences, strategic proximity maps, orbital-themed visualizations, network telemetry, and a classified-mission aesthetic.

> This is an entertainment and educational project. It does not access classified networks, military infrastructure, restricted databases, or actual military surveillance systems. Military-style statuses and simulated intelligence operations are part of the interface.

---

## ⚡ Mission Capabilities

| System                  | Description                                                   |
| ----------------------- | ------------------------------------------------------------- |
| Geospatial Acquisition  | Browser-based GPS positioning and coordinate resolution       |
| Network Intelligence    | Public IP address, ISP, and network metadata                  |
| Environmental Telemetry | Real-time weather and atmospheric measurements                |
| Device Profiling        | Browser, operating system, and hardware information           |
| Strategic Proximity     | Geographic distance calculations to selected public landmarks |
| Orbital Visualization   | Satellite-themed tracking interface and celestial information |
| Intelligence Export     | Generate a consolidated report of collected information       |

---

## ✨ Features

- **🌐 IP Reconnaissance** — Retrieves your public IP address, approximate location, ISP, timezone, and currency using [ipapi](https://ipapi.co/).
- **📡 GPS Tracking** — Requests your device's location using the browser Geolocation API, including coordinates and accuracy.
- **🗺️ Interactive Map** — Visualizes your location using GPS coordinates or an approximate IP-based fallback.
- **🛰️ Orbital Radar** — A polar satellite-tracking display with elevation rings, a sun indicator, and per-satellite telemetry.
- **🖥️ Device Fingerprinting** — Detects browser, operating system, device type, screen resolution, language, timezone, and available CPU cores.
- **📶 Network Intelligence** — Displays collected IP and network-related information.
- **⚡ Animated Scan Sequence** — Walks through simulated uplink, satellite, GPS, map, and fingerprinting phases.
- **🔄 Scan Reset** — Reset the interface and run another reconnaissance session.
- **🎮 Cyberpunk UI** — A green terminal aesthetic with orange accents, live indicators, and classified mission panels.

---

## 🎮 The Experience

NEXUS is designed to feel like operating a futuristic intelligence terminal.

- **Acquisition Sequence** — A multi-stage animated scan that simulates a reconnaissance mission.
- **Command Center** — A dark, military-inspired dashboard with real-time data panels.
- **Strategic Map** — A geographic visualization of your position and selected public reference locations.
- **Telemetry Feed** — Live environmental and network metrics presented in a terminal-style interface.
- **Mission Report** — A consolidated view of the information collected during a scan.

The military terminology, classified labels, and mission statuses are visual storytelling elements — not representations of actual military operations.

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

### Environment

- Weather and atmospheric measurements from public weather APIs

### Device

- Browser name
- Operating system
- Device type
- Browser language
- Client timezone
- Screen resolution
- Available logical CPU cores

---

## 🧠 Did You Know? // Strategic Systems & Defense Technology

![Declassified](https://img.shields.io/badge/BRIEFING-7_FILES-00f0ff?style=for-the-badge&labelColor=03060c)
![Mode](https://img.shields.io/badge/MODE-EDUCATIONAL-00ff88?style=for-the-badge&labelColor=03060c)
![Interface](https://img.shields.io/badge/INTERFACE-FICTIONAL-ffaa00?style=for-the-badge&labelColor=03060c)

A look into the real technologies and principles that inspired the NEXUS interface.

### 01. Nuclear Command & Control

<p align="center">
  <img
    src="https://commons.wikimedia.org/wiki/Special:FilePath/AirDefenceOpsCenter1.jpg?width=820"
    alt="Personnel working inside the NORAD Air Defense Operations Center at Cheyenne Mountain"
    width="720"
  >
  <br>
  <sub>
    <i>
      NORAD Air Defense Operations Center, Cheyenne Mountain Complex,
      Colorado — October 18, 1984. Photo by Bob Simons, U.S. Air Force.
    </i>
  </sub>
</p>

Nuclear command-and-control systems are designed around strict authorization, authentication, communication, and safety procedures.

They are not simply computers with a launch button. Multiple layers of safeguards, established command authority, and procedural controls are involved in preventing unauthorized use.

> [!TIP]
> **NEXUS Inspiration:** Authorization protocols, restricted-access interfaces, and multi-stage acquisition sequences.

### 02. Air-Gapped Networks

![Air gap](https://img.shields.io/badge/NETWORK-AIR--GAPPED-ff3355?style=for-the-badge&labelColor=03060c)
![Uplink](https://img.shields.io/badge/UPLINK-ISOLATED-00f0ff?style=for-the-badge&labelColor=03060c)
![Myth](https://img.shields.io/badge/INVULNERABLE-NO-ffaa00?style=for-the-badge&labelColor=03060c)

Some sensitive military and government systems use isolated networks to reduce exposure to external threats.

An air-gapped system is physically or logically separated from less-trusted networks. However, isolation does not make a system invulnerable, and it does not mean nobody can inspect its software.

> [!TIP]
> **NEXUS Inspiration:** Isolated communication channels, secure terminal aesthetics, and restricted network indicators.

### 03. Permissive Action Links (PALs)

![Access](https://img.shields.io/badge/ACCESS-AUTHORIZATION_REQUIRED-ff3355?style=for-the-badge&labelColor=03060c)
![Safeguards](https://img.shields.io/badge/SAFEGUARDS-MULTI--LAYER-00ff88?style=for-the-badge&labelColor=03060c)

Permissive Action Links are security mechanisms associated with preventing unauthorized use of nuclear weapons.

They are part of a broader system of safeguards and authorization controls, rather than ordinary passwords or generic access codes.

> [!TIP]
> **NEXUS Inspiration:** Authorization states, security clearance indicators, and access-control visualizations.

### 04. Early Warning Radar

<table align="center">
  <tr>
    <td align="center">
      <img src="https://commons.wikimedia.org/wiki/Special:FilePath/Cape_Cod_Air_Station_-_HAER_MA-151-A_-_384568pu.jpg?width=600" alt="Close-up of the PAVE PAWS phased-array antenna elements" width="420">
      <br>
      <sub><i>PAVE PAWS phased-array antenna elements, Cape Cod.</i></sub>
    </td>
    <td align="center">
      <img src="https://commons.wikimedia.org/wiki/Special:FilePath/Pave_Paws_Radar_Screen.jpg?width=400" alt="An operator studying a PAVE PAWS radar screen, 1986" width="240">
      <br>
      <sub><i>An operator at a PAVE PAWS radar screen (1986).</i></sub>
    </td>
  </tr>
</table>

Early warning radar systems detect and track objects over large geographic areas. Depending on their mission, they can support air defense, missile warning, and space surveillance.

These systems rely on sensors, signal processing, tracking algorithms, and dedicated communication infrastructure.

> [!TIP]
> **NEXUS Inspiration:** Radar-style telemetry, tracking indicators, and target-acquisition visuals.

### 05. Satellite Tracking & Orbital Mechanics

<p align="center">
  <img src="https://commons.wikimedia.org/wiki/Special:FilePath/International_Space_Station_after_undocking_of_STS-132.jpg?width=900" alt="The International Space Station photographed from the departing Space Shuttle Atlantis" width="720">
  <br>
  <sub><i>The International Space Station, photographed from Space Shuttle Atlantis (NASA, 2010).</i></sub>
</p>

Satellites move along predictable orbital paths governed by gravity and orbital mechanics. Their positions can be estimated using orbital elements and mathematical propagation models.

Public orbital tracking data can be used to calculate approximate satellite positions relative to an observer on Earth.

> [!TIP]
> **NEXUS Inspiration:** Orbital maps, satellite identifiers, elevation readings, and overpass visualizations.

### 06. Nuclear Deterrence & Strategic Infrastructure

<p align="center">
  <img src="https://commons.wikimedia.org/wiki/Special:FilePath/Minuteman_III_Launch_(6777470).jpg?width=820" alt="An unarmed Minuteman III missile launching during an operational test" width="720">
  <br>
  <sub><i>An unarmed Minuteman III launching during a routine test at Vandenberg (U.S. Space Force, 2021).</i></sub>
</p>

Nuclear deterrence is based on the concept that the threat of unacceptable retaliation can discourage an adversary from initiating an attack.

Strategic infrastructure may include command centers, early warning facilities, communication networks, and other supporting systems.

> [!TIP]
> **NEXUS Inspiration:** Strategic proximity maps, command-center layouts, and defense infrastructure classifications.

### 07. Defense Systems Are Not Ordinary Internet Services

<p align="center">
  <img src="https://commons.wikimedia.org/wiki/Special:FilePath/NORADBlast-Doors.jpg?width=820" alt="The 25-ton blast door at the Cheyenne Mountain Complex" width="720">
  <br>
  <sub><i>A 25-ton blast door at the Cheyenne Mountain Complex.</i></sub>
</p>

Sensitive defense systems may use dedicated communication networks, specialized hardware, strict access controls, and carefully managed software environments.

However, there is no universal architecture: security practices vary between countries, organizations, and systems. Network isolation alone does not guarantee security.

> [!TIP]
> **NEXUS Inspiration:** Secure uplink indicators, restricted network states, and fictional classified-system interfaces.

<details>
<summary><b>📷 Image credits</b></summary>

<br>

Photos are loaded from [Wikimedia Commons](https://commons.wikimedia.org/) and come from U.S. government sources (U.S. Air Force, U.S. Space Force, NORAD, NASA, and the Library of Congress HAER survey). Check each file's Commons page for its exact license and attribution before reusing it.

- [NORADCommandCenter.jpg](https://commons.wikimedia.org/wiki/File:NORADCommandCenter.jpg)
- [Cape Cod Air Station - HAER MA-151-A](https://commons.wikimedia.org/wiki/File:Cape_Cod_Air_Station_-_HAER_MA-151-A_-_384568pu.jpg)
- [Pave Paws Radar Screen.jpg](https://commons.wikimedia.org/wiki/File:Pave_Paws_Radar_Screen.jpg)
- [International Space Station after undocking of STS-132.jpg](https://commons.wikimedia.org/wiki/File:International_Space_Station_after_undocking_of_STS-132.jpg)
- [Minuteman III Launch (6777470).jpg](<https://commons.wikimedia.org/wiki/File:Minuteman_III_Launch_(6777470).jpg>)
- [NORADBlast-Doors.jpg](https://commons.wikimedia.org/wiki/File:NORADBlast-Doors.jpg)

</details>

---

## 🛠️ Tech Stack

- **Next.js** — React framework and application architecture
- **React** — Interactive UI and state management
- **TypeScript** — Type-safe application data
- **Browser APIs** — Geolocation, Navigator, Screen, and Intl APIs
- **ipapi** — IP geolocation and network information
- **Public weather APIs** — Environmental telemetry

---

## 🚀 Getting Started

### Prerequisites

- Node.js
- npm, pnpm, yarn, or bun

### Installation

```bash
git clone https://github.com/nero-tx/geo-track-simulator.git
cd geo-track-simulator
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

NEXUS GEO-TRACK is an informational and educational tool, not a surveillance system. It uses publicly accessible information and browser-provided capabilities.

- GPS coordinates are requested only when you initiate a scan.
- GPS access requires explicit browser permission.
- IP information is retrieved through the external ipapi service.
- Environmental data is retrieved from public weather APIs.
- Device information is limited to what the browser exposes, collected through browser APIs.
- Browser information is approximate and does not identify a person uniquely.
- GPS coordinates and device details should be treated as sensitive information.

The application does not bypass browser permissions, and it does not gain access to private files, classified systems, restricted networks, or hidden device information.

Always review the source code and the privacy policies of external services before using the application.

---

## ⚙️ Project Philosophy

**Ordinary Web APIs. Extraordinary Presentation.**

NEXUS GEO-TRACK explores how familiar web technologies can be presented through a cinematic, military-inspired interface. It is an experiment in frontend engineering, geospatial visualization, browser APIs, real-time data presentation, and interactive UI design.

No classified systems. No military access. Just code, data, and a simulated reconnaissance experience.

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
>
> _Built for exploration. Inspired by intelligence systems. Powered by the open web._

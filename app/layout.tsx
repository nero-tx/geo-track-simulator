import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

export const viewport: Viewport = {
  themeColor: "#040810",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: "https://geo-track-simulator.vercel.app/",
  title: "NEXUS GEO-TRACK",
  description:
    "Classified Global Geolocation, Orbital Space Recon & Real-Time Atmospheric Intelligence Console",
  keywords: [
    "Palantir",
    "CIA",
    "Surveillance",
    "Geolocation",
    "Orbital Satellites",
    "Tactical Radar",
    "Atmospheric Telemetry",
    "Blackbriar",
  ],
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
  openGraph: {
    title: "NEXUS GEO-TRACK",
    description:
      "Classified Global Geolocation, Orbital Space Recon & Real-Time Atmospheric Intelligence Console",
    siteName: "NEXUS",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "NEXUS GEO-TRACK",
    description:
      "Classified Global Geolocation, Orbital Space Recon & Real-Time Atmospheric Intelligence Console",
    creator: "@GEO_LOC",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="crt-flicker bg-[#040810] text-[#00f0ff]">
        <div className="scanlines" />
        {children}

        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}

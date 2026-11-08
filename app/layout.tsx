import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  themeColor: "#040810",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://nexus-tracker.defense.local"),
  title: "PALANTIR GOTHAM // OMNI-SURVEILLANCE COMMAND",
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
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico" },
    ],
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
  openGraph: {
    title: "PALANTIR GOTHAM // OMNI-SURVEILLANCE COMMAND",
    description:
      "Classified Global Geolocation, Orbital Space Recon & Real-Time Atmospheric Intelligence Console",
    siteName: "PALANTIR GOTHAM",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PALANTIR GOTHAM // OMNI-SURVEILLANCE COMMAND",
    description:
      "Classified Global Geolocation, Orbital Space Recon & Real-Time Atmospheric Intelligence Console",
    creator: "@OMNI_COMMAND",
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
      </body>
    </html>
  );
}

import { ImageResponse } from "next/og";

export const alt = "PALANTIR GOTHAM // OMNI-SURVEILLANCE COMMAND";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#040810",
          backgroundImage:
            "radial-gradient(circle at 85% 50%, rgba(0, 240, 255, 0.15) 0%, transparent 60%), radial-gradient(circle at 15% 90%, rgba(0, 255, 136, 0.1) 0%, transparent 50%)",
          color: "#00f0ff",
          fontFamily: "monospace",
          padding: "50px 60px",
          border: "4px solid rgba(0, 240, 255, 0.3)",
          position: "relative",
          boxSizing: "border-box",
        }}
      >
        {/* Top classified strip */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: "2px solid rgba(0, 240, 255, 0.25)",
            paddingBottom: "20px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div
              style={{
                width: "14px",
                height: "14px",
                backgroundColor: "#00f0ff",
                transform: "rotate(45deg)",
              }}
            />
            <span
              style={{
                fontSize: "18px",
                fontWeight: 900,
                letterSpacing: "4px",
                color: "#00f0ff",
              }}
            >
              NEXUS // PALANTIR GOTHAM
            </span>
            <span style={{ color: "rgba(0, 240, 255, 0.4)", fontSize: "16px" }}>
              |
            </span>
            <span
              style={{
                fontSize: "15px",
                color: "#ffaa00",
                fontWeight: 700,
                letterSpacing: "2px",
              }}
            >
              TOP SECRET // SCI // NOFORN
            </span>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              backgroundColor: "rgba(255, 51, 85, 0.15)",
              border: "1px solid #ff3355",
              padding: "6px 16px",
            }}
          >
            <div
              style={{
                width: "10px",
                height: "10px",
                borderRadius: "50%",
                backgroundColor: "#ff3355",
              }}
            />
            <span
              style={{
                fontSize: "15px",
                fontWeight: 900,
                color: "#ff3355",
                letterSpacing: "2px",
              }}
            >
              DEFCON 2
            </span>
          </div>
        </div>

        {/* Center Main Stage */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            margin: "20px 0",
          }}
        >
          {/* Left Text Block */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "14px",
              maxWidth: "720px",
            }}
          >
            <div
              style={{
                fontSize: "14px",
                color: "#00ff88",
                letterSpacing: "3px",
                fontWeight: 700,
              }}
            >
              [ SYSTEM STATUS: GLOBAL SURVEILLANCE GRID ACTIVE ]
            </div>

            <div
              style={{
                fontSize: "56px",
                fontWeight: 900,
                color: "#ffffff",
                letterSpacing: "4px",
                lineHeight: "1.1",
                textShadow: "0 0 25px rgba(0, 240, 255, 0.4)",
              }}
            >
              OMNI-COMMAND
            </div>

            <div
              style={{
                fontSize: "22px",
                color: "rgba(0, 240, 255, 0.8)",
                letterSpacing: "2px",
                lineHeight: "1.3",
              }}
            >
              Classified Geospatial Intelligence, Orbital Space Recon &amp; Real-Time Atmospheric Telemetry
            </div>

            {/* Tactical Badges */}
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "10px",
                marginTop: "10px",
              }}
            >
              {[
                "HIGH-ACCURACY GNSS",
                "STREET REVERSE GEO",
                "ORBITAL SPY SATS",
                "ATMOSPHERIC CHARTS",
                "DEFENSE HUBS PROXIMITY",
              ].map((badge) => (
                <div
                  key={badge}
                  style={{
                    display: "flex",
                    backgroundColor: "rgba(0, 240, 255, 0.08)",
                    border: "1px solid rgba(0, 240, 255, 0.35)",
                    padding: "6px 14px",
                    fontSize: "12px",
                    fontWeight: 700,
                    letterSpacing: "1px",
                    color: "#00f0ff",
                  }}
                >
                  {badge}
                </div>
              ))}
            </div>
          </div>

          {/* Right: Radar Reticle Graphic */}
          <div
            style={{
              width: "240px",
              height: "240px",
              borderRadius: "50%",
              border: "2px solid rgba(0, 240, 255, 0.6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
              backgroundColor: "rgba(7, 14, 28, 0.6)",
              boxShadow: "0 0 35px rgba(0, 240, 255, 0.25)",
            }}
          >
            {/* Inner Ring */}
            <div
              style={{
                width: "160px",
                height: "160px",
                borderRadius: "50%",
                border: "1px dashed rgba(0, 240, 255, 0.4)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {/* Core Ring */}
              <div
                style={{
                  width: "80px",
                  height: "80px",
                  borderRadius: "50%",
                  border: "1px solid rgba(0, 255, 136, 0.5)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <div
                  style={{
                    width: "16px",
                    height: "16px",
                    borderRadius: "50%",
                    backgroundColor: "#ffaa00",
                    boxShadow: "0 0 15px #ffaa00",
                  }}
                />
              </div>
            </div>

            {/* Target Reticle Cross Lines */}
            <div
              style={{
                position: "absolute",
                width: "240px",
                height: "1px",
                backgroundColor: "rgba(0, 240, 255, 0.3)",
              }}
            />
            <div
              style={{
                position: "absolute",
                height: "240px",
                width: "1px",
                backgroundColor: "rgba(0, 240, 255, 0.3)",
              }}
            />
          </div>
        </div>

        {/* Bottom Footer Telemetry Bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: "1px solid rgba(0, 240, 255, 0.2)",
            paddingTop: "16px",
            fontSize: "13px",
            color: "rgba(0, 240, 255, 0.6)",
            letterSpacing: "1px",
          }}
        >
          <div style={{ display: "flex", gap: "6px" }}>
            <span>CLEARANCE:</span>
            <span style={{ color: "#ffffff", fontWeight: 700 }}>
              LEVEL 5 // OMNI
            </span>
          </div>
          <div style={{ display: "flex", gap: "6px" }}>
            <span>ENCRYPTION:</span>
            <span style={{ color: "#00ff88", fontWeight: 700 }}>
              AES-256-GCM / SHA-512
            </span>
          </div>
          <div style={{ display: "flex", gap: "6px" }}>
            <span>NETWORK NODES:</span>
            <span style={{ color: "#00f0ff", fontWeight: 700 }}>
              4,812 ONLINE
            </span>
          </div>
          <div style={{ display: "flex", gap: "6px" }}>
            <span>TERMINAL:</span>
            <span style={{ color: "#ffaa00", fontWeight: 700 }}>
              STATION CHIEF
            </span>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}

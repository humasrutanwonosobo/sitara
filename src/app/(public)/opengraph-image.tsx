import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "SITARA — Sistem Informasi Tracking Reintegrasi Narapidana";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #080c14 0%, #0c1120 50%, #080c14 100%)",
          position: "relative",
        }}
      >
        {/* Glow */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 500,
            height: 500,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(20,184,166,0.15) 0%, transparent 70%)",
          }}
        />

        {/* Content */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 24, position: "relative" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 80,
              height: 80,
              borderRadius: 20,
              background: "linear-gradient(135deg, #14b8a6, #10b981)",
              boxShadow: "0 20px 40px rgba(20,184,166,0.3)",
            }}
          >
            <span style={{ fontSize: 36, fontWeight: 900, color: "white" }}>S</span>
          </div>

          <span style={{ fontSize: 48, fontWeight: 900, color: "white", letterSpacing: "0.1em" }}>
            SITARA
          </span>

          <span style={{ fontSize: 20, color: "rgba(255,255,255,0.5)", textAlign: "center", maxWidth: 600 }}>
            Sistem Informasi Tracking Reintegrasi Narapidana
          </span>

          <div style={{ display: "flex", gap: 16, marginTop: 16 }}>
            {["Real-time", "Transparan", "Gratis"].map((label) => (
              <div
                key={label}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  background: "rgba(20,184,166,0.1)",
                  border: "1px solid rgba(20,184,166,0.2)",
                  borderRadius: 20,
                  padding: "8px 16px",
                }}
              >
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#14b8a6" }} />
                <span style={{ fontSize: 14, color: "#5eead4", fontWeight: 600 }}>{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div style={{ position: "absolute", bottom: 40, display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 14, color: "rgba(255,255,255,0.25)" }}>
            Rumah Tahanan Negara Wonosobo
          </span>
        </div>
      </div>
    ),
    { ...size }
  );
}

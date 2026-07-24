import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "SITARA — Sistem Informasi Tracking Reintegrasi Narapidana";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OGImage() {
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
          background: "linear-gradient(135deg, #080c14 0%, #0d1f1c 50%, #080c14 100%)",
          fontFamily: "sans-serif",
        }}
      >
        {/* Glow */}
        <div
          style={{
            position: "absolute",
            top: "-15%",
            left: "30%",
            width: "500px",
            height: "500px",
            borderRadius: "50%",
            background: "rgba(45, 212, 191, 0.08)",
            filter: "blur(100px)",
            display: "flex",
          }}
        />
        {/* Logo badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "80px",
            height: "80px",
            borderRadius: "20px",
            background: "linear-gradient(135deg, #2dd4bf 0%, #34d399 100%)",
            marginBottom: "32px",
            boxShadow: "0 0 40px rgba(45, 212, 191, 0.3)",
          }}
        >
          <span style={{ fontSize: "40px", fontWeight: 900, color: "#080c14" }}>S</span>
        </div>
        {/* Title */}
        <div
          style={{
            display: "flex",
            fontSize: "56px",
            fontWeight: 900,
            color: "#ffffff",
            letterSpacing: "-0.02em",
            marginBottom: "16px",
          }}
        >
          SITARA
        </div>
        {/* Subtitle */}
        <div
          style={{
            display: "flex",
            fontSize: "24px",
            color: "rgba(255,255,255,0.5)",
            maxWidth: "700px",
            textAlign: "center",
            lineHeight: 1.4,
          }}
        >
          Sistem Informasi Tracking Reintegrasi Narapidana
        </div>
        {/* Org */}
        <div
          style={{
            display: "flex",
            marginTop: "40px",
            fontSize: "18px",
            color: "rgba(45, 212, 191, 0.8)",
            fontWeight: 600,
          }}
        >
          Rumah Tahanan Negara Kelas IIB Wonosobo
        </div>
      </div>
    ),
    { ...size },
  );
}

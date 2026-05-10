import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Panduan Penggunaan SITARA";
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
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            height: 400,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(20,184,166,0.1) 0%, transparent 70%)",
          }}
        />

        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20, position: "relative" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 64,
              height: 64,
              borderRadius: 16,
              background: "linear-gradient(135deg, #14b8a6, #10b981)",
              boxShadow: "0 16px 32px rgba(20,184,166,0.25)",
            }}
          >
            <span style={{ fontSize: 28, fontWeight: 900, color: "white" }}>S</span>
          </div>

          <span style={{ fontSize: 42, fontWeight: 900, color: "white" }}>Panduan Penggunaan</span>

          <span style={{ fontSize: 18, color: "rgba(255,255,255,0.4)", textAlign: "center", maxWidth: 500 }}>
            3 langkah mudah untuk memantau status reintegrasi anggota keluarga Anda
          </span>

          {/* Steps */}
          <div style={{ display: "flex", gap: 24, marginTop: 16 }}>
            {["1. Dapatkan Kode", "2. Masukkan Kode", "3. Pantau Status"].map((step) => (
              <div
                key={step}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 12,
                  padding: "10px 16px",
                }}
              >
                <span style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", fontWeight: 600 }}>{step}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ position: "absolute", bottom: 40, fontSize: 13, color: "rgba(255,255,255,0.2)", letterSpacing: "0.15em", fontWeight: 700 }}>
          SITARA
        </div>
      </div>
    ),
    { ...size }
  );
}

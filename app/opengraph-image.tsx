import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "BlindHire — Confidential Hiring on-chain";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#f5f4f0",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "80px",
          fontFamily: "serif",
        }}
      >
        {/* Top — eyebrow */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ width: "32px", height: "1px", background: "#999" }} />
          <span style={{ fontFamily: "monospace", fontSize: "14px", color: "#999", letterSpacing: "0.1em", textTransform: "uppercase" }}>
            Powered by Zama FHEVM · Sepolia
          </span>
        </div>

        {/* Middle — headline */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0px" }}>
          <span style={{ fontSize: "96px", fontWeight: "400", color: "#1a1a1a", lineHeight: "0.95", letterSpacing: "-0.02em" }}>
            Hire without
          </span>
          <span style={{ fontSize: "96px", fontWeight: "400", color: "#999", lineHeight: "0.95", letterSpacing: "-0.02em" }}>
            bias or exposure.
          </span>
          <p style={{ marginTop: "32px", fontSize: "24px", color: "#666", maxWidth: "700px", lineHeight: "1.5", fontFamily: "sans-serif" }}>
            Employers encrypt their requirements. Candidates encrypt their credentials. The blockchain computes the match. Nobody sees the other side's data.
          </p>
        </div>

        {/* Bottom — branding */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: "32px", fontWeight: "400", color: "#1a1a1a", letterSpacing: "-0.02em" }}>
            BlindHire
          </span>
          <span style={{ fontFamily: "monospace", fontSize: "12px", color: "#999" }}>
            blindhire.xyz
          </span>
        </div>
      </div>
    ),
    { ...size }
  );
}

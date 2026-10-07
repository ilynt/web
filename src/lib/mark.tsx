import { ImageResponse } from "next/og";

// Raster version of the logo mark (app/icon.svg) for places that need PNG:
// the Apple touch icon, the web manifest and the Organization logo in JSON-LD.
export function renderMark(size: number) {
  const pad = Math.round(size * 0.18);
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#0a0a09",
      }}
    >
      <svg width={size - pad * 2} height={size - pad * 2} viewBox="0 0 32 32">
        <circle cx="9" cy="22" r="4.5" fill="#c8f53c" />
        <circle cx="23" cy="10" r="4.5" fill="none" stroke="#ecebe6" strokeWidth="2" />
        <path d="M12.2 18.8 19.8 13.2" stroke="#ecebe6" strokeWidth="2" strokeLinecap="round" />
      </svg>
    </div>,
    { width: size, height: size },
  );
}

import { ImageResponse } from "next/og";

export const ogSize = { width: 1200, height: 630 };

// Shared Open Graph card: wordmark, a large title and a metadata line.
export function renderOg({ title, meta, accent }: { title: string; meta: string; accent?: string }) {
  const dots = Array.from({ length: 9 * 18 }, (_, i) => i);
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: "#0a0a09",
        color: "#ecebe6",
        padding: 72,
        position: "relative",
      }}
    >
      <div
        style={{
          position: "absolute",
          right: 48,
          top: 48,
          width: 18 * 28,
          display: "flex",
          flexWrap: "wrap",
        }}
      >
        {dots.map((i) => {
          const lit = (i * 37) % 23 === 0 || (i * 11) % 29 === 0;
          return (
            <div
              key={i}
              style={{
                width: 28,
                height: 28,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  width: lit ? 9 : 3,
                  height: lit ? 9 : 3,
                  borderRadius: 9,
                  background: lit ? "#c8f53c" : "rgba(236,235,230,0.22)",
                }}
              />
            </div>
          );
        })}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 30 }}>
        <svg width="40" height="40" viewBox="0 0 32 32">
          <circle cx="9" cy="22" r="4.5" fill="#c8f53c" />
          <circle cx="23" cy="10" r="4.5" fill="none" stroke="#ecebe6" strokeWidth="2" />
          <path d="M12.2 18.8 19.8 13.2" stroke="#ecebe6" strokeWidth="2" strokeLinecap="round" />
        </svg>
        Ilynt Labs
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
        <div style={{ fontSize: 76, lineHeight: 1.02, letterSpacing: -3, maxWidth: 980 }}>{title}</div>
        <div
          style={{
            display: "flex",
            gap: 24,
            fontSize: 24,
            color: "#9a9993",
            textTransform: "uppercase",
            letterSpacing: 1,
          }}
        >
          {accent && <span style={{ color: "#c8f53c" }}>{accent}</span>}
          <span>{meta}</span>
        </div>
      </div>
    </div>,
    ogSize,
  );
}

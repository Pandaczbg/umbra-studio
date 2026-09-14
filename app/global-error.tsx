"use client";
export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="sr">
      <body
        style={{
          margin: 0,
          background: "#080908",
          color: "#f1eee5",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <main style={{ maxWidth: 700, margin: "auto", padding: "15vh 24px" }}>
          <p style={{ color: "#cfb784" }}>UMBRA STUDIO</p>
          <h1 style={{ fontSize: "clamp(36px, 6vw, 60px)", fontWeight: 400 }}>
            Stranica nije učitana
          </h1>
          <p>Stranica nije mogla da se učita.</p>
          <p lang="en">The page could not load. Please try again.</p>
          <button
            type="button"
            onClick={reset}
            style={{
              minHeight: 48,
              padding: "12px 24px",
              marginTop: 24,
              color: "#080908",
              background: "#cfb784",
              fontSize: 16,
              border: "1px solid #cfb784",
              cursor: "pointer",
            }}
          >
            Pokušaj ponovo / <span lang="en">Retry</span>
          </button>
        </main>
      </body>
    </html>
  );
}

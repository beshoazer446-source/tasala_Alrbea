export default function Loading() {
  return (
    <div style={{
      maxWidth: 1280,
      margin: "0 auto",
      padding: "28px 24px"
    }}>
      {/* Hero skeleton */}
      <div style={{
        height: 220,
        borderRadius: 16,
        background: "linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)",
        backgroundSize: "200% 100%",
        animation: "shimmer 1.4s infinite",
        marginBottom: 24,
      }}/>

      {/* Grid skeleton */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(170px, 1fr))",
        gap: 16,
      }}>
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} style={{
            borderRadius: 14,
            overflow: "hidden",
            background: "#fff",
            boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
          }}>
            <div style={{
              aspectRatio: "1",
              background: "linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)",
              backgroundSize: "200% 100%",
              animation: `shimmer 1.4s infinite ${i * 0.1}s`,
            }}/>
            <div style={{ padding: "12px" }}>
              <div style={{
                height: 14, borderRadius: 7,
                background: "linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)",
                backgroundSize: "200% 100%",
                animation: "shimmer 1.4s infinite",
                marginBottom: 8,
              }}/>
              <div style={{
                height: 12, width: "60%", borderRadius: 6,
                background: "linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)",
                backgroundSize: "200% 100%",
                animation: "shimmer 1.4s infinite",
              }}/>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes shimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  );
}
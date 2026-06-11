export default function Loading() {
  return (
    <div style={{ maxWidth: 1280, margin: "0 auto", padding: "32px 24px" }}>
      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 1.1fr",
        gap: 40,
        background: "#fff",
        borderRadius: 20,
        padding: 32,
      }}>
        {[0, 1].map(i => (
          <div key={i} style={{
            borderRadius: 16,
            aspectRatio: i === 0 ? "1" : "auto",
            minHeight: i === 1 ? 400 : "auto",
            background: "linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)",
            backgroundSize: "200% 100%",
            animation: "shimmer 1.4s infinite",
          }}/>
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
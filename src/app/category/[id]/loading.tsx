export default function Loading() {
  return (
    <div style={{ padding: "20px 24px", maxWidth: 1280, margin: "0 auto" }}>
      <div style={{
        height: 180, borderRadius: 16, marginBottom: 20,
        background: "linear-gradient(90deg,#f0f0f0 25%,#e8e8e8 50%,#f0f0f0 75%)",
        backgroundSize: "400% 100%", animation: "shine 1.2s ease infinite",
      }}/>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(160px,1fr))", gap:14 }}>
        {Array.from({length:8}).map((_,i) => (
          <div key={i} style={{ borderRadius:12, overflow:"hidden", background:"#fff", boxShadow:"0 2px 8px rgba(0,0,0,0.06)" }}>
            <div style={{ aspectRatio:"1", background:"linear-gradient(90deg,#f0f0f0 25%,#e8e8e8 50%,#f0f0f0 75%)", backgroundSize:"400% 100%", animation:`shine 1.2s ease ${i*0.08}s infinite` }}/>
            <div style={{padding:10}}>
              <div style={{height:12,borderRadius:6,background:"#f0f0f0",marginBottom:8}}/>
              <div style={{height:10,width:"60%",borderRadius:5,background:"#f0f0f0"}}/>
            </div>
          </div>
        ))}
      </div>
      <style>{`@keyframes shine{0%{background-position:100% 0}100%{background-position:-100% 0}}`}</style>
    </div>
  );
}

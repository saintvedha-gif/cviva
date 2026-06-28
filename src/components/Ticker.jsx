const Ticker = () => {
  const items = ["ATS-Friendly", "IA para extraer tu CV", "PDF Export", "Word Export", "Filterable Skills", "Dark Mode", "Mobile First", "Real-time Editor", "Link público", "Analytics"];
  const doubled = [...items, ...items];
  return (
    <div style={{ overflow: "hidden", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)", padding: "12px 0", background: "var(--surface)" }}>
      <div className="ticker-track" style={{ display: "flex", gap: 64, whiteSpace: "nowrap", width: "max-content" }}>
        {doubled.map((item, i) => (
          <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: 10, color: "var(--muted)", fontSize: "0.82rem", fontWeight: 500, fontFamily: "Syne, sans-serif", letterSpacing: "0.06em", textTransform: "uppercase" }}>
            <span style={{ width: 5, height: 5, borderRadius: "50%", background: "var(--accent)", display: "inline-block", flexShrink: 0 }} />
            {item}
          </span>
        ))}
      </div>
    </div>
  );
};

export default Ticker;
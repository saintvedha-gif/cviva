import { Sparkles, FileText, Globe, Zap } from "lucide-react";

const Stats = () => (
  <section style={{ padding: "80px 24px" }}>
    <div style={{ maxWidth: 900, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 32, textAlign: "center" }}>
      {[
        { value: "IA", label: "extrae tu CV automáticamente", icon: <Sparkles size={20} />, color: "#00E5FF" },
        { value: "PDF + Word", label: "exportación incluida", icon: <FileText size={20} />, color: "#FFD166" },
        { value: "1 link", label: "para compartir tu CV", icon: <Globe size={20} />, color: "#C77DFF" },
        { value: "< 5min", label: "para publicar tu CV", icon: <Zap size={20} />, color: "#00E5A0" },
      ].map((s, i) => (
        <div key={i}>
          <div style={{ color: s.color, marginBottom: 10, display: "flex", justifyContent: "center" }}>{s.icon}</div>
          <div style={{ fontFamily: "Syne, sans-serif", fontWeight: 800, fontSize: "2.4rem", color: s.color, letterSpacing: "-0.04em" }}>{s.value}</div>
          <div style={{ color: "var(--muted)", fontSize: "0.85rem", marginTop: 6 }}>{s.label}</div>
        </div>
      ))}
    </div>
  </section>
);

export default Stats;
// src/components/dashboard/AnalyticsPage.jsx
import { TrendingUp, Eye, Download, MousePointerClick } from "lucide-react";

const stats = [
  { icon: Eye,              label: "Vistas totales",    value: "1,240", change: "+18%", color: "#00E5FF" },
  { icon: Download,         label: "Descargas",          value: "87",    change: "+9%",  color: "#C77DFF" },
  { icon: MousePointerClick,label: "Clics en links",     value: "342",   change: "+24%", color: "#FFD166" },
  { icon: TrendingUp,       label: "Tasa de apertura",   value: "68%",   change: "+3%",  color: "#00E5A0" },
];

export default function AnalyticsPage() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
      <div>
        <h2 style={{ fontFamily: "Syne,sans-serif", fontWeight: 800, fontSize: "1.3rem", color: "var(--text)", margin: 0 }}>Analíticas</h2>
        <p style={{ color: "var(--muted)", fontSize: "0.85rem", marginTop: 4 }}>Rendimiento de tus CVs este mes.</p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16 }}>
        {stats.map(({ icon: Icon, label, value, change, color }) => (
          <div key={label} className="card" style={{ padding: "22px 24px", display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: color + "18", display: "flex", alignItems: "center", justifyContent: "center", color }}>
                <Icon size={19} />
              </div>
              <span style={{ fontSize: "0.72rem", color: "#00E5A0", fontFamily: "Syne,sans-serif", fontWeight: 700, background: "rgba(0,229,160,0.1)", padding: "3px 10px", borderRadius: 100, border: "1px solid rgba(0,229,160,0.2)" }}>
                {change}
              </span>
            </div>
            <div>
              <div style={{ fontFamily: "Syne,sans-serif", fontWeight: 800, fontSize: "2rem", color: "var(--text)", letterSpacing: "-0.04em", lineHeight: 1 }}>{value}</div>
              <div style={{ fontSize: "0.8rem", color: "var(--muted)", marginTop: 5 }}>{label}</div>
            </div>
          </div>
        ))}
      </div>
      <div style={{ padding: "32px", background: "var(--surface)", border: "1.5px dashed var(--border)", borderRadius: 16, textAlign: "center" }}>
        <div style={{ fontFamily: "Syne,sans-serif", fontWeight: 700, color: "var(--muted)", fontSize: "0.9rem" }}>
          Gráficas detalladas disponibles en el plan Pro ✨
        </div>
      </div>
    </div>
  );
}
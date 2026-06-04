// src/components/dashboard/CVPreviewPage.jsx
import { Eye } from "lucide-react";

export default function CVPreviewPage() {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <Eye size={18} color="var(--accent)" />
        <h2 style={{ fontFamily: "Syne,sans-serif", fontWeight: 800, fontSize: "1.3rem", color: "var(--text)", margin: 0 }}>Vista previa</h2>
      </div>
      <div style={{ width: "100%", maxWidth: 700, padding: "40px 32px", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 18, textAlign: "center" }}>
        <div style={{ fontSize: "2.5rem", marginBottom: 16 }}>👁️</div>
        <div style={{ fontFamily: "Syne,sans-serif", fontWeight: 800, fontSize: "1.1rem", color: "var(--text)", marginBottom: 8 }}>Abre un CV para previsualizarlo</div>
        <div style={{ fontSize: "0.88rem", color: "var(--muted)" }}>Ve a <strong style={{ color: "var(--accent)" }}>Mis CVs</strong>, edita uno y verás la vista previa en tiempo real desde el editor.</div>
      </div>
    </div>
  );
}
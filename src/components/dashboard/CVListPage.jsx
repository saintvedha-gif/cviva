// src/components/dashboard/CVListPage.jsx
import { useState } from "react";
import { Plus, Eye, Clock, Download, Trash2, FileText } from "lucide-react";
import { Link } from "react-router-dom";
import ExportModal from "./ExportModal";

const demoCVs = [
  { id: "1", title: "CV Principal — Full Stack", slug: "juan-dev", updated: "hace 2h", published: true, color: "#00E5FF", views: 142, downloads: 23, name: "Juan Dev", role: "Full Stack Developer", email: "juan@email.com", phone: "+57 300 000 0000", location: "Colombia", linkedin: "", summary: "Dev Full Stack.", experience: [], education: [], skills: ["React", "Node.js"] },
  { id: "2", title: "CV Freelance — React Dev", slug: "juan-freelance", updated: "hace 3 días", published: false, color: "#FFD166", views: 38, downloads: 5, name: "Juan Freelance", role: "React Developer", email: "juan@email.com", phone: "", location: "Colombia", linkedin: "", summary: "", experience: [], education: [], skills: ["React"] },
];

export default function CVListPage() {
  const [exportTarget, setExportTarget] = useState(null);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
        <div>
          <h2 style={{ fontFamily: "Syne,sans-serif", fontWeight: 800, fontSize: "1.3rem", color: "var(--text)", margin: 0 }}>Mis CVs</h2>
          <p style={{ color: "var(--muted)", fontSize: "0.85rem", marginTop: 4 }}>{demoCVs.length} CV{demoCVs.length !== 1 ? "s" : ""} creado{demoCVs.length !== 1 ? "s" : ""}</p>
        </div>
        <Link to="/dashboard/cvs/new" style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          background: "var(--accent)", color: "#000", padding: "11px 20px",
          borderRadius: 10, textDecoration: "none", fontFamily: "Syne,sans-serif",
          fontWeight: 700, fontSize: "0.88rem", transition: "box-shadow 0.18s, transform 0.18s",
        }}
          onMouseEnter={e => { e.currentTarget.style.boxShadow = "var(--accent-glow)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
          onMouseLeave={e => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "none"; }}
        >
          <Plus size={15} strokeWidth={3} /> Nuevo CV
        </Link>
      </div>

      {demoCVs.length === 0 ? (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "80px 24px", textAlign: "center", background: "var(--surface)", border: "2px dashed var(--border)", borderRadius: 18, gap: 16 }}>
          <div style={{ width: 64, height: 64, borderRadius: 18, background: "var(--accent-soft)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <FileText size={28} color="var(--accent)" />
          </div>
          <div style={{ fontFamily: "Syne,sans-serif", fontWeight: 800, fontSize: "1.1rem", color: "var(--text)" }}>Sin CVs todavía</div>
          <div style={{ fontSize: "0.88rem", color: "var(--muted)" }}>Crea tu primer CV interactivo.</div>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 16 }}>
          {demoCVs.map(cv => (
            <div key={cv.id} className="card" style={{ padding: 20, position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: cv.color }} />
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, marginBottom: 16 }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: "Syne,sans-serif", fontWeight: 700, fontSize: "0.95rem", color: "var(--text)", marginBottom: 4, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{cv.title}</div>
                  <div style={{ fontSize: "0.75rem", color: "var(--muted)", display: "flex", alignItems: "center", gap: 5 }}>
                    <Clock size={11} /> {cv.updated}
                  </div>
                </div>
                <span style={{ fontSize: "0.68rem", fontFamily: "Syne,sans-serif", fontWeight: 700, padding: "3px 9px", borderRadius: 100, background: cv.published ? "rgba(0,229,160,0.12)" : "var(--surface-high)", color: cv.published ? "#00E5A0" : "var(--muted)", border: `1px solid ${cv.published ? "rgba(0,229,160,0.3)" : "var(--border)"}`, flexShrink: 0 }}>
                  {cv.published ? "Publicado" : "Borrador"}
                </span>
              </div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <Link to={`/dashboard/cvs/${cv.id}/edit`} style={{ flex: 1, minWidth: 70, display: "flex", alignItems: "center", justifyContent: "center", gap: 5, padding: "8px", borderRadius: 8, border: "1px solid var(--border)", background: "transparent", color: "var(--muted)", fontSize: "0.75rem", textDecoration: "none", fontFamily: "Syne,sans-serif", fontWeight: 600, transition: "border-color 0.18s, color 0.18s" }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--accent)"; e.currentTarget.style.color = "var(--accent)"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--muted)"; }}
                >
                  Editar
                </Link>
                <Link to={`/cv/${cv.slug}`} target="_blank" style={{ flex: 1, minWidth: 70, display: "flex", alignItems: "center", justifyContent: "center", gap: 5, padding: "8px", borderRadius: 8, background: "var(--accent)", color: "#000", fontSize: "0.75rem", textDecoration: "none", fontFamily: "Syne,sans-serif", fontWeight: 700, transition: "box-shadow 0.18s" }}
                  onMouseEnter={e => e.currentTarget.style.boxShadow = "var(--accent-glow)"}
                  onMouseLeave={e => e.currentTarget.style.boxShadow = "none"}
                >
                  <Eye size={12} /> Ver
                </Link>
                <button onClick={() => setExportTarget(cv)} style={{ flex: 1, minWidth: 70, display: "flex", alignItems: "center", justifyContent: "center", gap: 5, padding: "8px", borderRadius: 8, border: "1px solid var(--border)", background: "transparent", color: "var(--muted)", fontSize: "0.75rem", fontFamily: "Syne,sans-serif", fontWeight: 600, cursor: "pointer", transition: "border-color 0.18s, color 0.18s" }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--gold)"; e.currentTarget.style.color = "var(--gold)"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--muted)"; }}
                >
                  <Download size={12} /> Exportar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ExportModal isOpen={!!exportTarget} onClose={() => setExportTarget(null)} cvData={exportTarget} previewElementId="cv-preview" />
    </div>
  );
}
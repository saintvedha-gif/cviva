// src/components/dashboard/DashboardHome.jsx
import { useState } from "react";
import { FileText, Eye, TrendingUp, Plus, ArrowRight, Clock, Zap, Download } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import ExportModal from "./ExportModal";

const StatCard = ({ icon: Icon, label, value, color, sub }) => (
  <div className="card" style={{ padding: "22px 24px", display: "flex", flexDirection: "column", gap: 12 }}>
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <div style={{ width: 40, height: 40, borderRadius: 12, background: color + "18", display: "flex", alignItems: "center", justifyContent: "center", color }}>
        <Icon size={19} />
      </div>
      <span style={{ fontSize: "0.72rem", color: "var(--muted)", fontFamily: "Syne,sans-serif", fontWeight: 600, background: "var(--surface-high)", padding: "3px 10px", borderRadius: 100, border: "1px solid var(--border)" }}>
        {sub}
      </span>
    </div>
    <div>
      <div style={{ fontFamily: "Syne,sans-serif", fontWeight: 800, fontSize: "2rem", color: "var(--text)", letterSpacing: "-0.04em", lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: "0.8rem", color: "var(--muted)", marginTop: 5 }}>{label}</div>
    </div>
  </div>
);

const EmptyState = () => (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "60px 24px", textAlign: "center", background: "var(--surface)", border: "2px dashed var(--border)", borderRadius: 18, gap: 16 }}>
    <div style={{ width: 64, height: 64, borderRadius: 18, background: "var(--accent-soft)", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <FileText size={28} color="var(--accent)" />
    </div>
    <div>
      <div style={{ fontFamily: "Syne,sans-serif", fontWeight: 800, fontSize: "1.1rem", color: "var(--text)", marginBottom: 8 }}>Aún no tienes CVs</div>
      <div style={{ fontSize: "0.88rem", color: "var(--muted)", maxWidth: 300, lineHeight: 1.6 }}>Crea tu primer CV interactivo en menos de 5 minutos.</div>
    </div>
    <Link to="/dashboard/cvs/new" style={{
      display: "inline-flex", alignItems: "center", gap: 8,
      background: "var(--accent)", color: "#000", padding: "12px 24px",
      borderRadius: 10, textDecoration: "none", fontFamily: "Syne,sans-serif",
      fontWeight: 700, fontSize: "0.9rem", transition: "box-shadow 0.18s, transform 0.18s",
    }}
      onMouseEnter={e => { e.currentTarget.style.boxShadow = "var(--accent-glow)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "none"; }}
    >
      <Plus size={16} strokeWidth={3} /> Crear mi primer CV
    </Link>
  </div>
);

const CVCard = ({ cv, onExport }) => (
  <div className="card" style={{ padding: "20px", position: "relative", overflow: "hidden" }}>
    <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: cv.color || "var(--accent)" }} />
    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: "Syne,sans-serif", fontWeight: 700, fontSize: "0.95rem", color: "var(--text)", marginBottom: 4, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{cv.title}</div>
        <div style={{ fontSize: "0.78rem", color: "var(--muted)", display: "flex", alignItems: "center", gap: 5 }}>
          <Clock size={11} /> Editado {cv.updated}
        </div>
      </div>
      <div style={{ display: "flex", gap: 6, alignItems: "center", flexShrink: 0 }}>
        <span style={{ fontSize: "0.68rem", fontFamily: "Syne,sans-serif", fontWeight: 700, padding: "3px 9px", borderRadius: 100, background: cv.published ? "rgba(0,229,160,0.12)" : "var(--surface-high)", color: cv.published ? "#00E5A0" : "var(--muted)", border: `1px solid ${cv.published ? "rgba(0,229,160,0.3)" : "var(--border)"}` }}>
          {cv.published ? "Publicado" : "Borrador"}
        </span>
      </div>
    </div>

    <div style={{ display: "flex", gap: 8, marginTop: 16, flexWrap: "wrap" }}>
      <Link to={`/dashboard/cvs/${cv.id}/edit`}
        style={{ flex: 1, minWidth: 80, display: "flex", alignItems: "center", justifyContent: "center", gap: 5, padding: "8px", borderRadius: 8, border: "1px solid var(--border)", background: "transparent", color: "var(--muted)", fontSize: "0.75rem", textDecoration: "none", fontFamily: "Syne,sans-serif", fontWeight: 600, transition: "border-color 0.18s, color 0.18s" }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--accent)"; e.currentTarget.style.color = "var(--accent)"; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--muted)"; }}
      >
        Editar
      </Link>
      <Link to={`/cv/${cv.slug}`} target="_blank"
        style={{ flex: 1, minWidth: 80, display: "flex", alignItems: "center", justifyContent: "center", gap: 5, padding: "8px", borderRadius: 8, background: "var(--accent)", color: "#000", fontSize: "0.75rem", textDecoration: "none", fontFamily: "Syne,sans-serif", fontWeight: 700, border: "none", transition: "box-shadow 0.18s" }}
        onMouseEnter={e => e.currentTarget.style.boxShadow = "var(--accent-glow)"}
        onMouseLeave={e => e.currentTarget.style.boxShadow = "none"}
      >
        <Eye size={12} /> Ver
      </Link>
      <button
        onClick={() => onExport(cv)}
        style={{ flex: 1, minWidth: 80, display: "flex", alignItems: "center", justifyContent: "center", gap: 5, padding: "8px", borderRadius: 8, border: "1px solid var(--border)", background: "transparent", color: "var(--muted)", fontSize: "0.75rem", fontFamily: "Syne,sans-serif", fontWeight: 600, cursor: "pointer", transition: "border-color 0.18s, color 0.18s" }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--gold)"; e.currentTarget.style.color = "var(--gold)"; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--muted)"; }}
      >
        <Download size={12} /> Exportar
      </button>
    </div>

    <div style={{ display: "flex", gap: 16, marginTop: 14, paddingTop: 14, borderTop: "1px solid var(--border)" }}>
      <div style={{ fontSize: "0.72rem", color: "var(--muted)" }}>
        <span style={{ fontFamily: "Syne,sans-serif", fontWeight: 700, color: "var(--text)", fontSize: "0.88rem" }}>{cv.views}</span> vistas
      </div>
      <div style={{ fontSize: "0.72rem", color: "var(--muted)" }}>
        <span style={{ fontFamily: "Syne,sans-serif", fontWeight: 700, color: "var(--text)", fontSize: "0.88rem" }}>{cv.downloads}</span> descargas
      </div>
    </div>
  </div>
);

// Demo data — will come from Supabase in Sprint 4
const demoCVs = [
  { id: "1", title: "CV Principal — Full Stack", slug: "juan-dev", updated: "hace 2h", published: true, color: "#00E5FF", views: 142, downloads: 23, name: "Juan Dev", role: "Full Stack Developer", email: "juan@email.com", phone: "+57 300 000 0000", location: "Colombia", linkedin: "linkedin.com/in/juandev", summary: "Desarrollador Full Stack con experiencia en React, Node.js y bases de datos relacionales y NoSQL.", experience: [{ company: "NAHARASOFT", role: "Full Stack Developer", period: "2024 - Presente", description: "Desarrollo de aplicaciones web con React y Node.js." }], education: [{ institution: "Universidad de Colombia", degree: "Ingeniería de Sistemas", period: "2020 - 2024" }], skills: ["React", "Node.js", "TypeScript", "MongoDB", "Tailwind CSS"] },
  { id: "2", title: "CV Freelance — React Dev", slug: "juan-freelance", updated: "hace 3 días", published: false, color: "#FFD166", views: 38, downloads: 5, name: "Juan Freelance", role: "React Developer", email: "juan@email.com", phone: "+57 300 000 0000", location: "Colombia", linkedin: "", summary: "Desarrollador React especializado en interfaces modernas y performantes.", experience: [], education: [], skills: ["React", "Tailwind CSS", "Figma"] },
];

const DashboardHome = () => {
  const { user } = useAuth();
  const [exportTarget, setExportTarget] = useState(null);
  const name = user?.user_metadata?.full_name?.split(" ")[0] || "ahí";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>

      {/* Welcome */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
        <div>
          <h2 style={{ fontFamily: "Syne,sans-serif", fontWeight: 800, fontSize: "clamp(1.3rem,3vw,1.7rem)", color: "var(--text)", margin: 0, letterSpacing: "-0.02em" }}>
            Hola, {name} 👋
          </h2>
          <p style={{ color: "var(--muted)", fontSize: "0.88rem", marginTop: 4 }}>Aquí tienes un resumen de tu actividad.</p>
        </div>
        <Link to="/dashboard/cvs/new" style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          background: "var(--accent)", color: "#000", padding: "11px 20px",
          borderRadius: 10, textDecoration: "none", fontFamily: "Syne,sans-serif",
          fontWeight: 700, fontSize: "0.88rem", transition: "box-shadow 0.18s, transform 0.18s", flexShrink: 0,
        }}
          onMouseEnter={e => { e.currentTarget.style.boxShadow = "var(--accent-glow)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
          onMouseLeave={e => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "none"; }}
        >
          <Plus size={15} strokeWidth={3} /> Nuevo CV
        </Link>
      </div>

      {/* Stats */}
      <div className="stats-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16 }}>        <StatCard icon={FileText} label="CVs creados" value="2" color="#00E5FF" sub="Total" />
        <StatCard icon={Eye} label="Vistas totales" value="180" color="#FFD166" sub="Este mes" />
        <StatCard icon={TrendingUp} label="Descargas" value="28" color="#C77DFF" sub="Este mes" />
        <StatCard icon={Zap} label="Tasa de apertura" value="68%" color="#00E5A0" sub="Promedio" />
      </div>

      {/* CVs */}
      <div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, flexWrap: "wrap", gap: 10 }}>
          <h3 style={{ fontFamily: "Syne,sans-serif", fontWeight: 700, fontSize: "1rem", color: "var(--text)", margin: 0 }}>Mis CVs</h3>
          <Link to="/dashboard/cvs" style={{ fontSize: "0.8rem", color: "var(--accent)", textDecoration: "none", fontFamily: "Syne,sans-serif", fontWeight: 600, display: "flex", alignItems: "center", gap: 4 }}>
            Ver todos <ArrowRight size={13} />
          </Link>
        </div>
        {demoCVs.length === 0 ? (
          <EmptyState />
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
            {demoCVs.map(cv => <CVCard key={cv.id} cv={cv} onExport={setExportTarget} />)}
          </div>
        )}
      </div>

      {/* Upgrade banner */}
      <div style={{ padding: "24px 28px", borderRadius: 18, background: "linear-gradient(135deg, color-mix(in srgb, var(--accent) 12%, var(--surface)), var(--surface))", border: "1px solid color-mix(in srgb, var(--accent) 30%, var(--border))", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
        <div>
          <div style={{ fontFamily: "Syne,sans-serif", fontWeight: 800, fontSize: "1rem", color: "var(--text)", marginBottom: 4 }}>
            ✨ Estás en el plan Free
          </div>
          <div style={{ fontSize: "0.82rem", color: "var(--muted)" }}>Sube a Pro y desbloquea CVs ilimitados, analíticas y exportación Word.</div>
        </div>
        <Link to="/pricing" style={{ display: "inline-flex", alignItems: "center", gap: 7, background: "var(--accent)", color: "#000", padding: "10px 20px", borderRadius: 9, textDecoration: "none", fontFamily: "Syne,sans-serif", fontWeight: 700, fontSize: "0.85rem", flexShrink: 0, transition: "box-shadow 0.18s" }}
          onMouseEnter={e => e.currentTarget.style.boxShadow = "var(--accent-glow)"}
          onMouseLeave={e => e.currentTarget.style.boxShadow = "none"}
        >
          Subir a Pro <ArrowRight size={14} />
        </Link>
      </div>

      {/* Export Modal */}
      <ExportModal
        isOpen={!!exportTarget}
        onClose={() => setExportTarget(null)}
        cvData={exportTarget}
        previewElementId="cv-preview"
      />
    </div>
  );
};

export default DashboardHome;
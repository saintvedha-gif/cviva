// src/components/dashboard/AnalyticsPage.jsx
import { TrendingUp, Eye, Download, FileText, Globe, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { useCVs } from "../../hooks/useCVs";
import { useSubscription } from "../../hooks/useSubscription";

const StatCard = ({ icon: Icon, label, value, color, loading }) => (
  <div className="card" style={{ padding: "22px 24px", display: "flex", flexDirection: "column", gap: 12 }}>
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <div style={{
        width: 40, height: 40, borderRadius: 12,
        background: color + "18",
        display: "flex", alignItems: "center", justifyContent: "center", color,
      }}>
        <Icon size={19} />
      </div>
    </div>
    <div>
      {loading ? (
        <div style={{ height: 32, width: 60, borderRadius: 8, background: "var(--border)", animation: "pulse 1.5s ease-in-out infinite" }} />
      ) : (
        <div style={{ fontFamily: "Syne,sans-serif", fontWeight: 800, fontSize: "2rem", color: "var(--text)", letterSpacing: "-0.04em", lineHeight: 1 }}>
          {value}
        </div>
      )}
      <div style={{ fontSize: "0.8rem", color: "var(--muted)", marginTop: 5 }}>{label}</div>
    </div>
  </div>
);

const CVRow = ({ cv }) => {
  const updatedAt = new Date(cv.updated_at);
  const diffD = Math.floor((Date.now() - updatedAt.getTime()) / 86400000);
  const timeAgo = diffD === 0 ? "hoy" : diffD === 1 ? "ayer" : `hace ${diffD}d`;

  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 16,
      padding: "14px 0",
      borderBottom: "1px solid var(--border)",
    }}>
      {/* Status dot */}
      <div style={{
        width: 8, height: 8, borderRadius: "50%", flexShrink: 0,
        background: cv.published ? "#00E5A0" : "var(--border)",
      }} />

      {/* Título */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontFamily: "Syne,sans-serif", fontWeight: 600, fontSize: "0.88rem",
          color: "var(--text)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
        }}>
          {cv.title}
        </div>
        <div style={{ fontSize: "0.72rem", color: "var(--muted)", marginTop: 2 }}>
          Editado {timeAgo}
          {cv.published && cv.slug && (
            <Link
              to={`/cv/${cv.slug}`}
              target="_blank"
              style={{ color: "var(--accent)", marginLeft: 8, textDecoration: "none", fontFamily: "Syne,sans-serif", fontWeight: 600 }}
            >
              Ver →
            </Link>
          )}
        </div>
      </div>

      {/* Vistas */}
      <div style={{ textAlign: "right", minWidth: 60 }}>
        <div style={{ fontFamily: "Syne,sans-serif", fontWeight: 700, fontSize: "1rem", color: "#00E5FF" }}>
          {cv.views || 0}
        </div>
        <div style={{ fontSize: "0.68rem", color: "var(--muted)" }}>vistas</div>
      </div>

      {/* Descargas */}
      <div style={{ textAlign: "right", minWidth: 70 }}>
        <div style={{ fontFamily: "Syne,sans-serif", fontWeight: 700, fontSize: "1rem", color: "#C77DFF" }}>
          {cv.downloads || 0}
        </div>
        <div style={{ fontSize: "0.68rem", color: "var(--muted)" }}>descargas</div>
      </div>

      {/* Estado */}
      <span style={{
        fontSize: "0.68rem", fontFamily: "Syne,sans-serif", fontWeight: 700,
        padding: "3px 9px", borderRadius: 100, flexShrink: 0,
        background: cv.published ? "rgba(0,229,160,0.12)" : "var(--surface-high)",
        color: cv.published ? "#00E5A0" : "var(--muted)",
        border: `1px solid ${cv.published ? "rgba(0,229,160,0.3)" : "var(--border)"}`,
      }}>
        {cv.published ? "Publicado" : "Borrador"}
      </span>
    </div>
  );
};

export default function AnalyticsPage() {
  const { cvs, loading, error } = useCVs();
  const { isFree } = useSubscription();

  const totalViews     = cvs.reduce((s, cv) => s + (cv.views     || 0), 0);
  const totalDownloads = cvs.reduce((s, cv) => s + (cv.downloads || 0), 0);
  const totalPublished = cvs.filter(cv => cv.published).length;
  const topCV          = [...cvs].sort((a, b) => (b.views || 0) - (a.views || 0))[0];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>

      {/* Header */}
      <div>
        <h2 style={{ fontFamily: "Syne,sans-serif", fontWeight: 800, fontSize: "1.3rem", color: "var(--text)", margin: 0 }}>
          Analíticas
        </h2>
        <p style={{ color: "var(--muted)", fontSize: "0.85rem", marginTop: 4 }}>
          Rendimiento real de tus CVs.
        </p>
      </div>

      {/* Error */}
      {error && (
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 18px", borderRadius: 12, background: "rgba(255,77,109,0.08)", border: "1px solid rgba(255,77,109,0.25)" }}>
          <AlertCircle size={16} color="var(--danger)" />
          <span style={{ fontSize: "0.85rem", color: "var(--danger)" }}>Error cargando datos: {error}</span>
        </div>
      )}

      {/* Stats cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16 }}>
        <StatCard icon={Eye}       label="Vistas totales"  value={totalViews}     color="#00E5FF" loading={loading} />
        <StatCard icon={Download}  label="Descargas"        value={totalDownloads} color="#C77DFF" loading={loading} />
        <StatCard icon={Globe}     label="CVs publicados"   value={totalPublished} color="#00E5A0" loading={loading} />
        <StatCard icon={FileText}  label="CVs totales"      value={cvs.length}     color="#FFD166" loading={loading} />
      </div>

      {/* Top CV */}
      {!loading && topCV && topCV.views > 0 && (
        <div style={{
          padding: "20px 24px", borderRadius: 16,
          background: "linear-gradient(135deg, color-mix(in srgb, var(--accent) 8%, var(--surface)), var(--surface))",
          border: "1px solid color-mix(in srgb, var(--accent) 25%, var(--border))",
          display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12,
        }}>
          <div>
            <div style={{ fontSize: "0.72rem", fontFamily: "Syne,sans-serif", fontWeight: 700, color: "var(--accent)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 6 }}>
              ⭐ CV más visto
            </div>
            <div style={{ fontFamily: "Syne,sans-serif", fontWeight: 800, fontSize: "1rem", color: "var(--text)" }}>
              {topCV.title}
            </div>
            <div style={{ fontSize: "0.8rem", color: "var(--muted)", marginTop: 3 }}>
              {topCV.views} vistas · {topCV.downloads} descargas
            </div>
          </div>
          {topCV.published && topCV.slug && (
            <Link
              to={`/cv/${topCV.slug}`}
              target="_blank"
              style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                background: "var(--accent)", color: "#000",
                padding: "8px 16px", borderRadius: 8,
                textDecoration: "none", fontFamily: "Syne,sans-serif", fontWeight: 700, fontSize: "0.82rem",
              }}
            >
              Ver CV →
            </Link>
          )}
        </div>
      )}

      {/* Tabla de CVs */}
      <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 16, padding: "20px 24px" }}>
        <div style={{ fontFamily: "Syne,sans-serif", fontWeight: 800, fontSize: "0.9rem", color: "var(--text)", marginBottom: 16 }}>
          Detalle por CV
        </div>

        {loading ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[1, 2, 3].map(i => (
              <div key={i} style={{ height: 48, borderRadius: 8, background: "var(--border)", animation: "pulse 1.5s ease-in-out infinite" }} />
            ))}
          </div>
        ) : cvs.length === 0 ? (
          <div style={{ textAlign: "center", padding: "32px 0", color: "var(--muted)", fontSize: "0.85rem" }}>
            Aún no tienes CVs. <Link to="/dashboard/cvs/new" style={{ color: "var(--accent)", textDecoration: "none", fontFamily: "Syne,sans-serif", fontWeight: 700 }}>Crea uno →</Link>
          </div>
        ) : (
          <div>
            {/* Header tabla */}
            <div style={{ display: "flex", alignItems: "center", gap: 16, paddingBottom: 10, borderBottom: "2px solid var(--border)", marginBottom: 4 }}>
              <div style={{ width: 8, flexShrink: 0 }} />
              <div style={{ flex: 1, fontSize: "0.68rem", fontFamily: "Syne,sans-serif", fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.08em" }}>CV</div>
              <div style={{ minWidth: 60, textAlign: "right", fontSize: "0.68rem", fontFamily: "Syne,sans-serif", fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.08em" }}>Vistas</div>
              <div style={{ minWidth: 70, textAlign: "right", fontSize: "0.68rem", fontFamily: "Syne,sans-serif", fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.08em" }}>Descargas</div>
              <div style={{ minWidth: 80, fontSize: "0.68rem", fontFamily: "Syne,sans-serif", fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.08em" }}>Estado</div>
            </div>
            {cvs.map(cv => <CVRow key={cv.id} cv={cv} />)}
          </div>
        )}
      </div>

      {/* Banner Pro si es free */}
      {isFree && (
        <div style={{
          padding: "24px 28px", borderRadius: 16,
          background: "var(--surface)", border: "1.5px dashed var(--border)",
          textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: 12,
        }}>
          <TrendingUp size={24} color="var(--accent)" />
          <div style={{ fontFamily: "Syne,sans-serif", fontWeight: 800, fontSize: "0.95rem", color: "var(--text)" }}>
            Gráficas históricas disponibles en Pro
          </div>
          <div style={{ fontSize: "0.82rem", color: "var(--muted)", maxWidth: 320 }}>
            Con el plan Pro verás la evolución de vistas día a día, los horarios de mayor tráfico y de dónde vienen tus visitas.
          </div>
          <Link
            to="/pricing"
            style={{
              display: "inline-flex", alignItems: "center", gap: 7,
              background: "var(--accent)", color: "#000",
              padding: "10px 20px", borderRadius: 9,
              textDecoration: "none", fontFamily: "Syne,sans-serif", fontWeight: 700, fontSize: "0.85rem",
            }}
          >
            Ver planes →
          </Link>
        </div>
      )}

      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }`}</style>
    </div>
  );
}
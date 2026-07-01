// src/components/dashboard/DashboardHome.jsx
import { useState, useEffect } from "react";
import { FileText, Eye, TrendingUp, Plus, ArrowRight, Clock, Zap, Download, Trash2, AlertCircle, Copy, Check } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useSubscription } from "../../hooks/useSubscription";
import { useCVs } from "../../hooks/useCVs";
import { createCV } from "../../lib/supabase";
import ExportModal from "./ExportModal";
import { useCopyLink } from "../../hooks/useCopyLink";
import OnboardingModal, { shouldShowOnboarding } from "./OnboardingModal";

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

const CVCard = ({ cv, onExport, onDelete }) => {
  const { copied: linkCopied, copy: copyLink } = useCopyLink();
  const updatedAt = new Date(cv.updated_at);
  const diffMs = Date.now() - updatedAt.getTime();
  const diffH = Math.floor(diffMs / 3600000);
  const diffD = Math.floor(diffMs / 86400000);
  const timeAgo = diffH < 1 ? "hace menos de 1h" : diffH < 24 ? `hace ${diffH}h` : `hace ${diffD}d`;

  return (
    <div className="card" style={{ padding: "20px", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: "var(--accent)" }} />
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: "Syne,sans-serif", fontWeight: 700, fontSize: "0.95rem", color: "var(--text)", marginBottom: 4, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {cv.title}
          </div>
          <div style={{ fontSize: "0.78rem", color: "var(--muted)", display: "flex", alignItems: "center", gap: 5 }}>
            <Clock size={11} /> Editado {timeAgo}
          </div>
        </div>
        <div style={{ display: "flex", gap: 6, alignItems: "center", flexShrink: 0 }}>
          <span style={{ fontSize: "0.68rem", fontFamily: "Syne,sans-serif", fontWeight: 700, padding: "3px 9px", borderRadius: 100, background: cv.published ? "rgba(0,229,160,0.12)" : "var(--surface-high)", color: cv.published ? "#00E5A0" : "var(--muted)", border: `1px solid ${cv.published ? "rgba(0,229,160,0.3)" : "var(--border)"}` }}>
            {cv.published ? "Publicado" : "Borrador"}
          </span>
        </div>
      </div>

      <div style={{ display: "flex", gap: 8, marginTop: 16, flexWrap: "wrap" }}>
        <Link
          to={`/dashboard/cvs/${cv.id}/edit`}
          style={{ flex: 1, minWidth: 70, display: "flex", alignItems: "center", justifyContent: "center", gap: 5, padding: "8px", borderRadius: 8, border: "1px solid var(--border)", background: "transparent", color: "var(--muted)", fontSize: "0.75rem", textDecoration: "none", fontFamily: "Syne,sans-serif", fontWeight: 600, transition: "border-color 0.18s, color 0.18s" }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--accent)"; e.currentTarget.style.color = "var(--accent)"; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--muted)"; }}
        >
          Editar
        </Link>
        {cv.published && cv.slug && (
          <Link
            to={`/cv/${cv.slug}`}
            target="_blank"
            style={{ flex: 1, minWidth: 70, display: "flex", alignItems: "center", justifyContent: "center", gap: 5, padding: "8px", borderRadius: 8, background: "var(--accent)", color: "#000", fontSize: "0.75rem", textDecoration: "none", fontFamily: "Syne,sans-serif", fontWeight: 700, transition: "box-shadow 0.18s" }}
            onMouseEnter={e => e.currentTarget.style.boxShadow = "var(--accent-glow)"}
            onMouseLeave={e => e.currentTarget.style.boxShadow = "none"}
          >
            <Eye size={12} /> Ver
          </Link>
        )}
        {cv.published && cv.slug && (
          <button
            onClick={() => copyLink(`${window.location.origin}/cv/${cv.slug}`)}
            style={{ flex: 1, minWidth: 70, display: "flex", alignItems: "center", justifyContent: "center", gap: 5, padding: "8px", borderRadius: 8, border: `1px solid ${linkCopied ? "rgba(0,229,160,0.4)" : "var(--border)"}`, background: linkCopied ? "rgba(0,229,160,0.08)" : "transparent", color: linkCopied ? "#00E5A0" : "var(--muted)", fontSize: "0.75rem", fontFamily: "Syne,sans-serif", fontWeight: 600, cursor: "pointer", transition: "all 0.18s" }}
          >
            {linkCopied ? <><Check size={12} /> ¡Copiado!</> : <><Copy size={12} /> Link</>}
          </button>
        )}
        <button
          onClick={() => onExport(cv)}
          style={{ flex: 1, minWidth: 70, display: "flex", alignItems: "center", justifyContent: "center", gap: 5, padding: "8px", borderRadius: 8, border: "1px solid var(--border)", background: "transparent", color: "var(--muted)", fontSize: "0.75rem", fontFamily: "Syne,sans-serif", fontWeight: 600, cursor: "pointer", transition: "border-color 0.18s, color 0.18s" }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--gold)"; e.currentTarget.style.color = "var(--gold)"; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--muted)"; }}
        >
          <Download size={12} /> Exportar
        </button>
        <button
          onClick={() => onDelete(cv.id)}
          style={{ width: 34, display: "flex", alignItems: "center", justifyContent: "center", padding: "8px", borderRadius: 8, border: "1px solid var(--border)", background: "transparent", color: "var(--muted)", cursor: "pointer", transition: "border-color 0.18s, color 0.18s" }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--danger)"; e.currentTarget.style.color = "var(--danger)"; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--muted)"; }}
        >
          <Trash2 size={12} />
        </button>
      </div>

      <div style={{ display: "flex", gap: 16, marginTop: 14, paddingTop: 14, borderTop: "1px solid var(--border)" }}>
        <div style={{ fontSize: "0.72rem", color: "var(--muted)" }}>
          <span style={{ fontFamily: "Syne,sans-serif", fontWeight: 700, color: "var(--text)", fontSize: "0.88rem" }}>{cv.views || 0}</span> vistas
        </div>
        <div style={{ fontSize: "0.72rem", color: "var(--muted)" }}>
          <span style={{ fontFamily: "Syne,sans-serif", fontWeight: 700, color: "var(--text)", fontSize: "0.88rem" }}>{cv.downloads || 0}</span> descargas
        </div>
      </div>
    </div>
  );
};

const DashboardHome = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { plan, isFree } = useSubscription();
  const { cvs, loading, remove } = useCVs();
  const [exportTarget, setExportTarget] = useState(null);

  const [creating, setCreating] = useState(false);

  const handleCopyLink = (slug, id) => {
    const url = `${window.location.origin}/cv/${slug}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };
  const [showOnboarding, setShowOnboarding] = useState(false);

  const name = user?.user_metadata?.full_name?.split(" ")[0] || "ahí";
  const FREE_LIMIT = 1;
  const canCreate = !isFree || cvs.length < FREE_LIMIT;

  // Mostrar onboarding solo una vez, a usuarios sin CVs todavía
  useEffect(() => {
    if (!loading && cvs.length === 0 && shouldShowOnboarding()) {
      setShowOnboarding(true);
    }
  }, [loading, cvs.length]);

  const handleNewCV = async () => {
    if (!canCreate) return;
    setCreating(true);
    setCreateError("");
    const { data, error: createErr } = await createCV(user.id, "Mi nuevo CV");
    setCreating(false);
    // ✅ navigate() en vez de window.location.href
    if (data) {
      navigate(`/dashboard/cvs/${data.id}/edit`);
    } else if (createErr) {
      const isLimitError = createErr.message?.includes("free_plan_limit_reached");
      setCreateError(
        isLimitError
          ? "Alcanzaste el límite del plan Free (1 CV). Actualiza a Pro para crear más."
          : createErr.message || "No se pudo crear el CV. Intenta de nuevo."
      );
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("¿Eliminar este CV?")) return;
    await remove(id);
  };

  const totalViews     = cvs.reduce((s, cv) => s + (cv.views     || 0), 0);
  const totalDownloads = cvs.reduce((s, cv) => s + (cv.downloads || 0), 0);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>

      {/* Bienvenida */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
        <div>
          <h2 style={{ fontFamily: "Syne,sans-serif", fontWeight: 800, fontSize: "clamp(1.3rem,3vw,1.7rem)", color: "var(--text)", margin: 0, letterSpacing: "-0.02em" }}>
            Hola, {name} 👋
          </h2>
          <p style={{ color: "var(--muted)", fontSize: "0.88rem", marginTop: 4 }}>
            Plan <span style={{ color: plan === "free" ? "var(--muted)" : "var(--accent)", fontFamily: "Syne,sans-serif", fontWeight: 700, textTransform: "capitalize" }}>{plan}</span>
          </p>
        </div>
        <button
          onClick={handleNewCV}
          disabled={!canCreate || creating}
          style={{ display: "inline-flex", alignItems: "center", gap: 8, background: canCreate ? "var(--accent)" : "var(--surface-high)", color: canCreate ? "#000" : "var(--muted)", padding: "11px 20px", borderRadius: 10, border: "none", fontFamily: "Syne,sans-serif", fontWeight: 700, fontSize: "0.88rem", cursor: canCreate ? "pointer" : "not-allowed", transition: "box-shadow 0.18s, transform 0.18s", flexShrink: 0 }}
          onMouseEnter={e => { if (canCreate) { e.currentTarget.style.boxShadow = "var(--accent-glow)"; e.currentTarget.style.transform = "translateY(-2px)"; } }}
          onMouseLeave={e => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "none"; }}
        >
          <Plus size={15} strokeWidth={3} /> {creating ? "Creando..." : "Nuevo CV"}
        </button>
      </div>

      {/* Alerta límite free */}
      {isFree && cvs.length >= FREE_LIMIT && (
        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 18px", borderRadius: 12, background: "rgba(255,159,28,0.08)", border: "1px solid rgba(255,159,28,0.25)" }}>
          <AlertCircle size={16} color="#FF9F1C" style={{ flexShrink: 0 }} />
          <div style={{ flex: 1, fontSize: "0.85rem", color: "var(--text)" }}>
            Alcanzaste el límite del plan Free (1 CV).{" "}
            <Link to="/pricing" style={{ color: "var(--accent)", fontFamily: "Syne,sans-serif", fontWeight: 700, textDecoration: "none" }}>
              Actualiza a Pro →
            </Link>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="stats-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16 }}>
        <StatCard icon={FileText}   label="CVs creados"    value={loading ? "—" : cvs.length}    color="#00E5FF" sub="Total" />
        <StatCard icon={Eye}        label="Vistas totales" value={loading ? "—" : totalViews}     color="#FFD166" sub="Total" />
        <StatCard icon={TrendingUp} label="Descargas"      value={loading ? "—" : totalDownloads} color="#C77DFF" sub="Total" />
        <StatCard icon={Zap}        label="Plan activo"    value={plan.charAt(0).toUpperCase() + plan.slice(1)} color="#00E5A0" sub="Actual" />
      </div>

      {/* CVs recientes */}
      <div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, flexWrap: "wrap", gap: 10 }}>
          <h3 style={{ fontFamily: "Syne,sans-serif", fontWeight: 700, fontSize: "1rem", color: "var(--text)", margin: 0 }}>Mis CVs</h3>
          <Link to="/dashboard/cvs" style={{ fontSize: "0.8rem", color: "var(--accent)", textDecoration: "none", fontFamily: "Syne,sans-serif", fontWeight: 600, display: "flex", alignItems: "center", gap: 4 }}>
            Ver todos <ArrowRight size={13} />
          </Link>
        </div>

        {loading ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
            {[1, 2].map(i => (
              <div key={i} style={{ height: 180, borderRadius: 18, background: "var(--surface)", border: "1px solid var(--border)", animation: "pulse 1.5s ease-in-out infinite" }} />
            ))}
          </div>
        ) : cvs.length === 0 ? (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "60px 24px", textAlign: "center", background: "var(--surface)", border: "2px dashed var(--border)", borderRadius: 18, gap: 16 }}>
            <div style={{ width: 64, height: 64, borderRadius: 18, background: "var(--accent-soft)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <FileText size={28} color="var(--accent)" />
            </div>
            <div style={{ fontFamily: "Syne,sans-serif", fontWeight: 800, fontSize: "1.1rem", color: "var(--text)" }}>Aún no tienes CVs</div>
            <div style={{ fontSize: "0.88rem", color: "var(--muted)", maxWidth: 300, lineHeight: 1.6 }}>Crea tu primer CV interactivo en menos de 5 minutos.</div>
            <button
              onClick={handleNewCV}
              style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "var(--accent)", color: "#000", padding: "12px 24px", borderRadius: 10, border: "none", fontFamily: "Syne,sans-serif", fontWeight: 700, fontSize: "0.9rem", cursor: "pointer" }}
            >
              <Plus size={16} strokeWidth={3} /> Crear mi primer CV
            </button>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
            {cvs.slice(0, 4).map(cv => (
              <CVCard key={cv.id} cv={cv} onExport={setExportTarget} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </div>

      {/* Banner upgrade free */}
      {isFree && (
        <div style={{ padding: "24px 28px", borderRadius: 18, background: "linear-gradient(135deg, color-mix(in srgb, var(--accent) 12%, var(--surface)), var(--surface))", border: "1px solid color-mix(in srgb, var(--accent) 30%, var(--border))", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
          <div>
            <div style={{ fontFamily: "Syne,sans-serif", fontWeight: 800, fontSize: "1rem", color: "var(--text)", marginBottom: 4 }}>
              ✨ Estás en el plan Free
            </div>
            <div style={{ fontSize: "0.82rem", color: "var(--muted)" }}>
              Sube a Pro: CVs ilimitados, analíticas de visitas y sin marca de agua.
            </div>
          </div>
          <Link
            to="/pricing"
            style={{ display: "inline-flex", alignItems: "center", gap: 7, background: "var(--accent)", color: "#000", padding: "10px 20px", borderRadius: 9, textDecoration: "none", fontFamily: "Syne,sans-serif", fontWeight: 700, fontSize: "0.85rem", flexShrink: 0, transition: "box-shadow 0.18s" }}
            onMouseEnter={e => e.currentTarget.style.boxShadow = "var(--accent-glow)"}
            onMouseLeave={e => e.currentTarget.style.boxShadow = "none"}
          >
            Subir a Pro <ArrowRight size={14} />
          </Link>
        </div>
      )}

      <ExportModal
        isOpen={!!exportTarget}
        onClose={() => setExportTarget(null)}
        cvData={exportTarget?.cv_data}
        cvId={exportTarget?.id}
        previewElementId="cv-preview"
      />

      {showOnboarding && (
        <OnboardingModal
          onClose={() => setShowOnboarding(false)}
          onStart={() => {
            setShowOnboarding(false);
            handleNewCV();
          }}
        />
      )}

      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }`}</style>
    </div>
  );
};

export default DashboardHome;
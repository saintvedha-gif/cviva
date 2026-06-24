// src/components/dashboard/CVListPage.jsx
import { useState } from "react";
import { Plus, Eye, Clock, Download, Trash2, FileText, Copy, Check } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import ExportModal from "./ExportModal";
import { useCVs } from "../../hooks/useCVs";
import { useAuth } from "../../hooks/useAuth";
import { useSubscription } from "../../hooks/useSubscription";
import { createCV } from "../../lib/supabase";
import { useCopyLink } from "../../hooks/useCopyLink";


export default function CVListPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isFree } = useSubscription();
  const { cvs, loading, error, remove } = useCVs();
  const [exportTarget, setExportTarget] = useState(null);
  const [creating, setCreating] = useState(false);
  const { copied: copiedId, copy: copyLink } = useCopyLink();

  const FREE_LIMIT = 1;
  const canCreate = !isFree || cvs.length < FREE_LIMIT;

  const handleNewCV = async () => {
    if (!canCreate) return;
    setCreating(true);
    const { data } = await createCV(user.id, "Mi nuevo CV");
    setCreating(false);
    if (data) navigate(`/dashboard/cvs/${data.id}/edit`);
  };

  const handleDelete = async (id) => {
    if (!confirm("¿Eliminar este CV? Esta acción no se puede deshacer.")) return;
    await remove(id);
  };

  const formatTimeAgo = (dateStr) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const h = Math.floor(diff / 3600000);
    const d = Math.floor(diff / 86400000);
    if (h < 1) return "hace menos de 1h";
    if (h < 24) return `hace ${h}h`;
    return `hace ${d}d`;
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
        <div>
          <h2 style={{ fontFamily: "Syne,sans-serif", fontWeight: 800, fontSize: "1.3rem", color: "var(--text)", margin: 0 }}>
            Mis CVs
          </h2>
          <p style={{ color: "var(--muted)", fontSize: "0.85rem", marginTop: 4 }}>
            {loading ? "Cargando..." : `${cvs.length} CV${cvs.length !== 1 ? "s" : ""} creado${cvs.length !== 1 ? "s" : ""}`}
          </p>
        </div>
        <button
          onClick={handleNewCV}
          disabled={!canCreate || creating}
          style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: canCreate ? "var(--accent)" : "var(--surface-high)",
            color: canCreate ? "#000" : "var(--muted)",
            padding: "11px 20px", borderRadius: 10, border: "none",
            fontFamily: "Syne,sans-serif", fontWeight: 700, fontSize: "0.88rem",
            cursor: canCreate ? "pointer" : "not-allowed",
            transition: "box-shadow 0.18s, transform 0.18s",
          }}
          onMouseEnter={e => { if (canCreate) { e.currentTarget.style.boxShadow = "var(--accent-glow)"; e.currentTarget.style.transform = "translateY(-2px)"; } }}
          onMouseLeave={e => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "none"; }}
        >
          <Plus size={15} strokeWidth={3} /> {creating ? "Creando..." : "Nuevo CV"}
        </button>
      </div>

      {/* Límite plan free */}
      {isFree && cvs.length >= FREE_LIMIT && (
        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 18px", borderRadius: 12, background: "rgba(255,159,28,0.08)", border: "1px solid rgba(255,159,28,0.25)" }}>
          <span style={{ fontSize: "0.85rem", color: "var(--text)" }}>
            Alcanzaste el límite del plan Free (1 CV).{" "}
            <Link to="/pricing" style={{ color: "var(--accent)", fontFamily: "Syne,sans-serif", fontWeight: 700, textDecoration: "none" }}>
              Actualiza a Pro →
            </Link>
          </span>
        </div>
      )}

      {/* Error */}
      {error && (
        <div style={{ padding: "14px 18px", borderRadius: 12, background: "rgba(255,77,109,0.08)", border: "1px solid rgba(255,77,109,0.25)", fontSize: "0.85rem", color: "var(--danger)" }}>
          Error cargando CVs: {error}
        </div>
      )}

      {/* Loading skeletons */}
      {loading ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 16 }}>
          {[1, 2, 3].map(i => (
            <div key={i} style={{ height: 200, borderRadius: 18, background: "var(--surface)", border: "1px solid var(--border)", animation: "pulse 1.5s ease-in-out infinite" }} />
          ))}
          <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }`}</style>
        </div>
      ) : cvs.length === 0 ? (
        /* Empty state */
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "80px 24px", textAlign: "center", background: "var(--surface)", border: "2px dashed var(--border)", borderRadius: 18, gap: 16 }}>
          <div style={{ width: 64, height: 64, borderRadius: 18, background: "var(--accent-soft)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <FileText size={28} color="var(--accent)" />
          </div>
          <div style={{ fontFamily: "Syne,sans-serif", fontWeight: 800, fontSize: "1.1rem", color: "var(--text)" }}>Sin CVs todavía</div>
          <div style={{ fontSize: "0.88rem", color: "var(--muted)", maxWidth: 300, lineHeight: 1.6 }}>
            Crea tu primer CV interactivo en menos de 5 minutos.
          </div>
          <button
            onClick={handleNewCV}
            style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "var(--accent)", color: "#000", padding: "12px 24px", borderRadius: 10, border: "none", fontFamily: "Syne,sans-serif", fontWeight: 700, fontSize: "0.9rem", cursor: "pointer" }}
          >
            <Plus size={16} strokeWidth={3} /> Crear mi primer CV
          </button>
        </div>
      ) : (
        /* Grid de CVs */
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 16 }}>
          {cvs.map(cv => (
            <div key={cv.id} className="card" style={{ padding: 20, position: "relative", overflow: "hidden" }}>
              {/* Barra superior accent */}
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: "var(--accent)" }} />

              {/* Header card */}
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, marginBottom: 16 }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: "Syne,sans-serif", fontWeight: 700, fontSize: "0.95rem", color: "var(--text)", marginBottom: 4, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {cv.title}
                  </div>
                  <div style={{ fontSize: "0.75rem", color: "var(--muted)", display: "flex", alignItems: "center", gap: 5 }}>
                    <Clock size={11} /> Editado {formatTimeAgo(cv.updated_at)}
                  </div>
                </div>
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

              {/* Acciones */}
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <Link
                  to={`/dashboard/cvs/${cv.id}/edit`}
                  style={{ flex: 1, minWidth: 70, display: "flex", alignItems: "center", justifyContent: "center", gap: 5, padding: "8px", borderRadius: 8, border: "1px solid var(--border)", background: "transparent", color: "var(--muted)", fontSize: "0.75rem", textDecoration: "none", fontFamily: "Syne,sans-serif", fontWeight: 600, transition: "border-color 0.18s, color 0.18s" }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--accent)"; e.currentTarget.style.color = "var(--accent)"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--muted)"; }}
                >
                  Editar
                </Link>

                {cv.published && (
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
                    style={{ flex: 1, minWidth: 70, display: "flex", alignItems: "center", justifyContent: "center", gap: 5, padding: "8px", borderRadius: 8, border: `1px solid ${copiedId ? "rgba(0,229,160,0.4)" : "var(--border)"}`, background: copiedId ? "rgba(0,229,160,0.08)" : "transparent", color: copiedId ? "#00E5A0" : "var(--muted)", fontSize: "0.75rem", fontFamily: "Syne,sans-serif", fontWeight: 600, cursor: "pointer", transition: "all 0.18s" }}
                  >
                    {copiedId ? <><Check size={12} /> ¡Copiado!</> : <><Copy size={12} /> Link</>}
                  </button>
                )}

                <button
                  onClick={() => setExportTarget(cv)}
                  style={{ flex: 1, minWidth: 70, display: "flex", alignItems: "center", justifyContent: "center", gap: 5, padding: "8px", borderRadius: 8, border: "1px solid var(--border)", background: "transparent", color: "var(--muted)", fontSize: "0.75rem", fontFamily: "Syne,sans-serif", fontWeight: 600, cursor: "pointer", transition: "border-color 0.18s, color 0.18s" }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--gold)"; e.currentTarget.style.color = "var(--gold)"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--muted)"; }}
                >
                  <Download size={12} /> Exportar
                </button>

                <button
                  onClick={() => handleDelete(cv.id)}
                  style={{ width: 34, display: "flex", alignItems: "center", justifyContent: "center", padding: "8px", borderRadius: 8, border: "1px solid var(--border)", background: "transparent", color: "var(--muted)", cursor: "pointer", transition: "border-color 0.18s, color 0.18s" }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--danger)"; e.currentTarget.style.color = "var(--danger)"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--muted)"; }}
                >
                  <Trash2 size={12} />
                </button>
              </div>

              {/* Stats */}
              <div style={{ display: "flex", gap: 16, marginTop: 14, paddingTop: 14, borderTop: "1px solid var(--border)" }}>
                <div style={{ fontSize: "0.72rem", color: "var(--muted)" }}>
                  <span style={{ fontFamily: "Syne,sans-serif", fontWeight: 700, color: "var(--text)", fontSize: "0.88rem" }}>{cv.views || 0}</span> vistas
                </div>
                <div style={{ fontSize: "0.72rem", color: "var(--muted)" }}>
                  <span style={{ fontFamily: "Syne,sans-serif", fontWeight: 700, color: "var(--text)", fontSize: "0.88rem" }}>{cv.downloads || 0}</span> descargas
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <ExportModal
        isOpen={!!exportTarget}
        onClose={() => setExportTarget(null)}
        cvData={exportTarget?.cv_data}
        cvId={exportTarget?.id}
        previewElementId="cv-preview"
      />
    </div>
  );
}
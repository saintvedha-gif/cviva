// src/components/dashboard/ExportModal.jsx
import { useState } from "react";
import { X, FileText, Download, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { exportToPDF, exportToATSPDF } from "../../lib/exportPDF";
import { exportToWord } from "../../lib/exportWord";
import { incrementCVDownloads } from "../../lib/supabase";

const FORMATS = [
  {
    id: "pdf-ats",
    label: "PDF (compatible con ATS)",
    desc: "Texto real, una columna. Recomendado para postularte a empleos.",
    icon: "📄",
    color: "#00E5A0",
  },
  {
    id: "pdf-visual",
    label: "PDF (diseño visual)",
    desc: "Captura el diseño exacto de la vista previa. No es legible por sistemas ATS.",
    icon: "🎨",
    color: "#FF6B6B",
  },
  {
    id: "word",
    label: "Word (.docx)",
    desc: "Editable en Microsoft Word",
    icon: "📝",
    color: "#00E5FF",
  },
];

const ExportModal = ({ isOpen, onClose, cvData, cvId, previewElementId = "cv-preview" }) => {
  const [selected, setSelected] = useState("pdf-ats");
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [errorMsg, setErrorMsg] = useState("");

  if (!isOpen) return null;

  const fileName = `${(cvData?.name || "cv").toLowerCase().replace(/\s+/g, "-")}-cviva`;

  const handleExport = async () => {
    setStatus("loading");
    setErrorMsg("");
    try {
      if (selected === "pdf-visual") {
        // El PDF visual necesita el elemento de la vista previa en el DOM.
        // Eso solo existe dentro del editor; si no está (por ejemplo, al
        // exportar desde la lista de CVs o el dashboard), usamos el PDF
        // de texto real como respaldo en vez de fallar.
        const elementExists = !!document.getElementById(previewElementId);
        if (elementExists) {
          await exportToPDF(previewElementId, `${fileName}.pdf`);
        } else {
          await exportToATSPDF(cvData, `${fileName}.pdf`);
        }
      } else if (selected === "pdf-ats") {
        await exportToATSPDF(cvData, `${fileName}.pdf`);
      } else {
        await exportToWord(cvData, `${fileName}.docx`);
      }
      setStatus("success");
      if (cvId) incrementCVDownloads(cvId);
      setTimeout(() => setStatus("idle"), 2500);
    } catch (err) {
      setErrorMsg(err.message || "Error al exportar");
      setStatus("error");
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.65)",
          backdropFilter: "blur(6px)", zIndex: 900,
        }}
      />

      {/* Modal */}
      <div style={{
        position: "fixed", top: "50%", left: "50%",
        transform: "translate(-50%, -50%)",
        width: "min(480px, calc(100vw - 32px))",
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: 20, padding: 28,
        zIndex: 901,
        boxShadow: "0 24px 80px rgba(0,0,0,0.5)",
      }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 38, height: 38, borderRadius: 11,
              background: "var(--accent-soft)", display: "flex",
              alignItems: "center", justifyContent: "center",
            }}>
              <Download size={18} color="var(--accent)" />
            </div>
            <div>
              <h2 style={{ fontFamily: "Syne,sans-serif", fontWeight: 800, fontSize: "1rem", color: "var(--text)", margin: 0 }}>
                Exportar CV
              </h2>
              <p style={{ fontSize: "0.75rem", color: "var(--muted)", margin: 0 }}>
                Elige el formato de descarga
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{ width: 32, height: 32, borderRadius: 8, border: "1px solid var(--border)", background: "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--muted)" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--danger)"; e.currentTarget.style.color = "var(--danger)"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--muted)"; }}
          >
            <X size={15} />
          </button>
        </div>

        {/* Format picker */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
          {FORMATS.map((fmt) => {
            const active = selected === fmt.id;
            return (
              <button
                key={fmt.id}
                onClick={() => setSelected(fmt.id)}
                style={{
                  display: "flex", alignItems: "center", gap: 14,
                  padding: "14px 16px", borderRadius: 12, cursor: "pointer",
                  background: active ? "var(--accent-soft)" : "var(--surface-high)",
                  border: `1.5px solid ${active ? "var(--accent)" : "var(--border)"}`,
                  textAlign: "left", transition: "all 0.18s",
                }}
              >
                <span style={{ fontSize: "1.5rem" }}>{fmt.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: "Syne,sans-serif", fontWeight: 700, fontSize: "0.88rem", color: active ? "var(--accent)" : "var(--text)" }}>
                    {fmt.label}
                  </div>
                  <div style={{ fontSize: "0.75rem", color: "var(--muted)", marginTop: 2 }}>
                    {fmt.desc}
                  </div>
                </div>
                <div style={{
                  width: 18, height: 18, borderRadius: "50%",
                  border: `2px solid ${active ? "var(--accent)" : "var(--border)"}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0,
                }}>
                  {active && (
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--accent)" }} />
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Info box para PDF */}
        {selected === "pdf-ats" && (
          <div style={{
            display: "flex", alignItems: "flex-start", gap: 10,
            padding: "10px 14px", borderRadius: 10,
            background: "rgba(0,229,160,0.06)", border: "1px solid rgba(0,229,160,0.15)",
            marginBottom: 20,
          }}>
            <FileText size={14} color="#00E5A0" style={{ marginTop: 2, flexShrink: 0 }} />
            <p style={{ fontSize: "0.75rem", color: "var(--muted)", margin: 0, lineHeight: 1.6 }}>
              Este PDF tiene texto real (no es una imagen), en una sola columna, sin colores ni gráficos. Es el formato recomendado para postularte a empleos.
            </p>
          </div>
        )}
        {selected === "pdf-visual" && (
          <div style={{
            display: "flex", alignItems: "flex-start", gap: 10,
            padding: "10px 14px", borderRadius: 10,
            background: "rgba(255,107,107,0.06)", border: "1px solid rgba(255,107,107,0.15)",
            marginBottom: 20,
          }}>
            <FileText size={14} color="#FF6B6B" style={{ marginTop: 2, flexShrink: 0 }} />
            <p style={{ fontSize: "0.75rem", color: "var(--muted)", margin: 0, lineHeight: 1.6 }}>
              El PDF captura el diseño exacto de la vista previa, pero queda como imagen: no es legible por sistemas ATS. Úsalo solo para enviar por email o redes, no para postularte a empleos.
            </p>
          </div>
        )}

        {/* Error */}
        {status === "error" && (
          <div style={{
            display: "flex", alignItems: "center", gap: 8,
            padding: "10px 14px", borderRadius: 10, marginBottom: 16,
            background: "rgba(255,77,109,0.08)", border: "1px solid rgba(255,77,109,0.2)",
          }}>
            <AlertCircle size={14} color="var(--danger)" />
            <span style={{ fontSize: "0.78rem", color: "var(--danger)" }}>{errorMsg}</span>
          </div>
        )}

        {/* CTA */}
        <button
          onClick={handleExport}
          disabled={status === "loading"}
          style={{
            width: "100%", padding: "13px", borderRadius: 11, border: "none",
            background: status === "success" ? "#00E5A0" : "var(--accent)",
            color: "#000", fontFamily: "Syne,sans-serif", fontWeight: 700,
            fontSize: "0.92rem", cursor: status === "loading" ? "not-allowed" : "pointer",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            transition: "box-shadow 0.18s, transform 0.18s, background 0.25s",
            opacity: status === "loading" ? 0.8 : 1,
          }}
          onMouseEnter={e => { if (status !== "loading") e.currentTarget.style.boxShadow = "var(--accent-glow)"; }}
          onMouseLeave={e => { e.currentTarget.style.boxShadow = "none"; }}
        >
          {status === "loading" && <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} />}
          {status === "success" && <CheckCircle2 size={16} />}
          {status === "idle" || status === "error" ? <Download size={16} /> : null}
          {status === "loading"
            ? "Exportando..."
            : status === "success"
              ? "¡Descargado!"
              : `Descargar ${selected === "word" ? "WORD" : "PDF"}`}
        </button>

        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </>
  );
};

export default ExportModal;
// src/components/dashboard/CVUploader.jsx
import { useState, useRef } from "react";
import { Upload, FileText, Loader2, CheckCircle2, AlertCircle, X, Sparkles } from "lucide-react";
import { extractTextFromFile, parseWithAI } from "../../lib/parseCVClient";

const ACCEPTED = ".pdf,.doc,.docx";
const MAX_SIZE_MB = 10;

export default function CVUploader({ onParsed }) {
  const [status, setStatus] = useState("idle"); // idle | reading | parsing | done | error
  const [fileName, setFileName] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef();

  const handleFile = async (file) => {
    if (!file) return;

    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      setErrorMsg(`El archivo supera ${MAX_SIZE_MB}MB. Sube uno más liviano.`);
      setStatus("error");
      return;
    }

    setFileName(file.name);
    setErrorMsg("");

    try {
      setStatus("reading");
      const text = await extractTextFromFile(file);

      setStatus("parsing");
      const parsed = await parseWithAI(text);

      if (!parsed || !parsed.name) {
        throw new Error("No se pudo extraer la información. Intenta con otro archivo.");
      }

      // Normalizar IDs para experience/education (la IA no los genera)
      const result = {
        ...parsed,
        experience: (parsed.experience || []).map((e, i) => ({ ...e, id: e.id || Date.now() + i })),
        education:  (parsed.education  || []).map((e, i) => ({ ...e, id: e.id || Date.now() + 100 + i })),
        // skills ya viene como array de objetos { name, level, category } desde api/parse-cv.js
        skills: Array.isArray(parsed.skills) ? parsed.skills : [],
      };

      setStatus("done");
      setTimeout(() => onParsed(result), 800);
    } catch (err) {
      setErrorMsg(err.message || "Error procesando el archivo");
      setStatus("error");
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const reset = () => {
    setStatus("idle");
    setFileName("");
    setErrorMsg("");
  };

  const isLoading = status === "reading" || status === "parsing";

  return (
    <div style={{
      background: "var(--surface)", border: "1px solid var(--border)",
      borderRadius: 18, padding: 28, display: "flex", flexDirection: "column", gap: 20,
    }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
        <div style={{ width: 44, height: 44, borderRadius: 13, background: "var(--accent-soft)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <Sparkles size={20} color="var(--accent)" />
        </div>
        <div>
          <h3 style={{ fontFamily: "Syne,sans-serif", fontWeight: 800, fontSize: "1rem", color: "var(--text)", margin: 0, marginBottom: 4 }}>
            Importar CV existente con IA
          </h3>
          <p style={{ fontSize: "0.82rem", color: "var(--muted)", margin: 0, lineHeight: 1.5 }}>
            Sube tu hoja de vida en PDF o Word y la convertimos automáticamente en un CV interactivo.
          </p>
        </div>
      </div>

      {/* Drop zone */}
      {status === "idle" || status === "error" ? (
        <div
          onDragOver={e => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          style={{
            border: `2px dashed ${dragOver ? "var(--accent)" : "var(--border)"}`,
            borderRadius: 14, padding: "36px 24px", textAlign: "center", cursor: "pointer",
            background: dragOver ? "var(--accent-soft)" : "var(--surface-high)",
            transition: "all 0.18s",
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--accent)"; e.currentTarget.style.background = "var(--accent-soft)"; }}
          onMouseLeave={e => { if (!dragOver) { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.background = "var(--surface-high)"; } }}
        >
          <input
            ref={inputRef}
            type="file"
            accept={ACCEPTED}
            style={{ display: "none" }}
            onChange={e => handleFile(e.target.files[0])}
          />
          <div style={{ width: 52, height: 52, borderRadius: 14, background: "var(--surface)", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}>
            <Upload size={22} color="var(--accent)" />
          </div>
          <div style={{ fontFamily: "Syne,sans-serif", fontWeight: 700, fontSize: "0.92rem", color: "var(--text)", marginBottom: 6 }}>
            Arrastra tu CV aquí o haz click para seleccionar
          </div>
          <div style={{ fontSize: "0.78rem", color: "var(--muted)" }}>
            PDF, DOC o DOCX · Máximo {MAX_SIZE_MB}MB
          </div>
        </div>
      ) : null}

      {/* Loading state */}
      {isLoading && (
        <div style={{ background: "var(--surface-high)", border: "1px solid var(--border)", borderRadius: 14, padding: "28px 24px", textAlign: "center" }}>
          <div style={{ width: 48, height: 48, borderRadius: "50%", background: "var(--accent-soft)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", animation: "spin 1s linear infinite" }}>
            <Loader2 size={22} color="var(--accent)" />
          </div>
          <div style={{ fontFamily: "Syne,sans-serif", fontWeight: 700, fontSize: "0.92rem", color: "var(--text)", marginBottom: 6 }}>
            {status === "reading" ? "Leyendo el archivo..." : "Analizando con IA..."}
          </div>
          <div style={{ fontSize: "0.78rem", color: "var(--muted)" }}>
            {status === "reading" ? "Extrayendo el contenido de tu CV" : `Esto puede tardar unos segundos — procesando "${fileName}"`}
          </div>
          <div style={{ marginTop: 20, height: 4, borderRadius: 100, background: "var(--border)", overflow: "hidden" }}>
            <div style={{ height: "100%", width: status === "reading" ? "40%" : "85%", background: "var(--accent)", borderRadius: 100, transition: "width 0.8s ease" }} />
          </div>
        </div>
      )}

      {/* Success */}
      {status === "done" && (
        <div style={{ background: "rgba(0,229,160,0.06)", border: "1px solid rgba(0,229,160,0.25)", borderRadius: 14, padding: "24px", display: "flex", alignItems: "center", gap: 14 }}>
          <CheckCircle2 size={28} color="#00E5A0" style={{ flexShrink: 0 }} />
          <div>
            <div style={{ fontFamily: "Syne,sans-serif", fontWeight: 700, color: "#00E5A0", fontSize: "0.92rem", marginBottom: 3 }}>
              ¡CV procesado con éxito!
            </div>
            <div style={{ fontSize: "0.78rem", color: "var(--muted)" }}>Cargando el editor...</div>
          </div>
        </div>
      )}

      {/* Error */}
      {status === "error" && (
        <div style={{ background: "rgba(255,77,109,0.06)", border: "1px solid rgba(255,77,109,0.2)", borderRadius: 14, padding: "16px 18px", display: "flex", alignItems: "center", gap: 12 }}>
          <AlertCircle size={18} color="var(--danger)" style={{ flexShrink: 0 }} />
          <div style={{ flex: 1, fontSize: "0.82rem", color: "var(--danger)" }}>{errorMsg}</div>
          <button onClick={reset} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--muted)", display: "flex" }}>
            <X size={16} />
          </button>
        </div>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
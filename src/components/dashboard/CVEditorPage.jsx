// src/components/dashboard/CVEditorPage.jsx
import { useState } from "react";
import { Plus, Trash2, Save, Eye, Upload, User, Briefcase, GraduationCap, Wrench, FileText } from "lucide-react";
import ExportModal from "./ExportModal";
import CVUploader from "./CVUploader";

const TABS = [
  { id: "info",       label: "Info",        icon: User },
  { id: "experience", label: "Experiencia", icon: Briefcase },
  { id: "education",  label: "Educación",   icon: GraduationCap },
  { id: "skills",     label: "Skills",      icon: Wrench },
];

const Field = ({ label, value, onChange, placeholder, type = "text", multiline = false }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
    <label style={{ fontSize: "0.78rem", fontFamily: "Syne,sans-serif", fontWeight: 600, color: "var(--muted)" }}>
      {label}
    </label>
    {multiline ? (
      <textarea
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        rows={4}
        style={{
          background: "var(--surface-high)", border: "1.5px solid var(--border)",
          borderRadius: 10, padding: "10px 14px", color: "var(--text)",
          fontFamily: "DM Sans,sans-serif", fontSize: "0.88rem", resize: "vertical",
          outline: "none", transition: "border-color 0.18s", lineHeight: 1.6,
          width: "100%",
        }}
        onFocus={e => e.target.style.borderColor = "var(--accent)"}
        onBlur={e => e.target.style.borderColor = "var(--border)"}
      />
    ) : (
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          background: "var(--surface-high)", border: "1.5px solid var(--border)",
          borderRadius: 10, padding: "10px 14px", color: "var(--text)",
          fontFamily: "DM Sans,sans-serif", fontSize: "0.88rem",
          outline: "none", transition: "border-color 0.18s",
          width: "100%",
        }}
        onFocus={e => e.target.style.borderColor = "var(--accent)"}
        onBlur={e => e.target.style.borderColor = "var(--border)"}
      />
    )}
  </div>
);

const emptyExp = () => ({ id: Date.now(), company: "", role: "", period: "", description: "" });
const emptyEdu = () => ({ id: Date.now(), institution: "", degree: "", period: "" });

export default function CVEditorPage() {
  const [activeTab, setActiveTab] = useState("info");
  const [showExport, setShowExport] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [showUploader, setShowUploader] = useState(true);

  const [info, setInfo] = useState({
    name: "", role: "", email: "", phone: "", location: "", linkedin: "", summary: "",
  });
  const [experience, setExperience] = useState([emptyExp()]);
  const [education, setEducation] = useState([emptyEdu()]);
  const [skills, setSkills] = useState("");

  const cvData = {
    ...info,
    experience,
    education,
    skills: skills.split(",").map(s => s.trim()).filter(Boolean),
  };

  const handleParsed = (parsed) => {
    setInfo({
      name:     parsed.name     || "",
      role:     parsed.role     || "",
      email:    parsed.email    || "",
      phone:    parsed.phone    || "",
      location: parsed.location || "",
      linkedin: parsed.linkedin || "",
      summary:  parsed.summary  || "",
    });
    setExperience(parsed.experience?.length ? parsed.experience : [emptyExp()]);
    setEducation(parsed.education?.length   ? parsed.education  : [emptyEdu()]);
    setSkills(parsed.skills || "");
    setShowUploader(false);
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const updateExp = (id, field, val) =>
    setExperience(prev => prev.map(e => e.id === id ? { ...e, [field]: val } : e));
  const removeExp = (id) => setExperience(prev => prev.filter(e => e.id !== id));

  const updateEdu = (id, field, val) =>
    setEducation(prev => prev.map(e => e.id === id ? { ...e, [field]: val } : e));
  const removeEdu = (id) => setEducation(prev => prev.filter(e => e.id !== id));

  return (
    <div className="cv-editor-layout">

      {/* ── Editor panel ── */}
      <div className="cv-editor-panel" style={{ display: "flex", flexDirection: "column", gap: 20 }}>

        {/* Upload / manual toggle */}
        {showUploader ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <CVUploader onParsed={handleParsed} />
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
              <span style={{ fontSize: "0.78rem", color: "var(--muted)", fontFamily: "Syne,sans-serif", fontWeight: 600, whiteSpace: "nowrap" }}>
                o crea desde cero
              </span>
              <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
            </div>
            <button
              onClick={() => setShowUploader(false)}
              style={{
                padding: "12px", borderRadius: 10, border: "1.5px dashed var(--border)",
                background: "transparent", color: "var(--muted)", cursor: "pointer",
                fontFamily: "Syne,sans-serif", fontWeight: 600, fontSize: "0.88rem",
                transition: "all 0.18s",
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--accent)"; e.currentTarget.style.color = "var(--accent)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--muted)"; }}
            >
              Completar manualmente →
            </button>
          </div>
        ) : (
          <>
            {/* Back to uploader */}
            <button
              onClick={() => setShowUploader(true)}
              style={{
                display: "flex", alignItems: "center", gap: 6, padding: "8px 14px",
                borderRadius: 9, border: "1px solid var(--border)", background: "transparent",
                color: "var(--muted)", fontSize: "0.78rem", fontFamily: "Syne,sans-serif",
                fontWeight: 600, cursor: "pointer", alignSelf: "flex-start", transition: "all 0.18s",
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--accent)"; e.currentTarget.style.color = "var(--accent)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--muted)"; }}
            >
              <Upload size={13} /> Importar CV
            </button>

            {/* Tabs */}
            <div style={{ display: "flex", gap: 5, background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, padding: 5, flexWrap: "wrap" }}>
              {TABS.map(({ id, label, icon: Icon }) => {
                const active = activeTab === id;
                return (
                  <button key={id} onClick={() => setActiveTab(id)} style={{
                    display: "flex", alignItems: "center", gap: 6,
                    padding: "8px 12px", borderRadius: 8, border: "none", cursor: "pointer",
                    background: active ? "var(--accent)" : "transparent",
                    color: active ? "#000" : "var(--muted)",
                    fontFamily: "Syne,sans-serif", fontWeight: 700, fontSize: "0.78rem",
                    transition: "all 0.18s", whiteSpace: "nowrap", flex: "1 1 auto",
                    justifyContent: "center",
                  }}>
                    <Icon size={13} /> {label}
                  </button>
                );
              })}
            </div>

            {/* Tab: Info */}
            {activeTab === "info" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 14, background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 16, padding: 20 }}>
                <h3 style={{ fontFamily: "Syne,sans-serif", fontWeight: 800, fontSize: "0.95rem", color: "var(--text)", margin: 0 }}>
                  Información personal
                </h3>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 14 }}>
                  <Field label="Nombre completo" value={info.name} onChange={v => setInfo(p => ({ ...p, name: v }))} placeholder="Juan Pérez" />
                  <Field label="Cargo / Rol" value={info.role} onChange={v => setInfo(p => ({ ...p, role: v }))} placeholder="Full Stack Developer" />
                  <Field label="Email" value={info.email} onChange={v => setInfo(p => ({ ...p, email: v }))} placeholder="juan@email.com" type="email" />
                  <Field label="Teléfono" value={info.phone} onChange={v => setInfo(p => ({ ...p, phone: v }))} placeholder="+57 300 000 0000" />
                  <Field label="Ciudad / País" value={info.location} onChange={v => setInfo(p => ({ ...p, location: v }))} placeholder="Bogotá, Colombia" />
                  <Field label="LinkedIn" value={info.linkedin} onChange={v => setInfo(p => ({ ...p, linkedin: v }))} placeholder="linkedin.com/in/juan" />
                </div>
                <Field label="Perfil profesional" value={info.summary} onChange={v => setInfo(p => ({ ...p, summary: v }))} placeholder="Describe tu perfil en 2-3 oraciones..." multiline />
              </div>
            )}

            {/* Tab: Experience */}
            {activeTab === "experience" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {experience.map((exp, i) => (
                  <div key={exp.id} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 16, padding: 20, display: "flex", flexDirection: "column", gap: 12 }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <span style={{ fontFamily: "Syne,sans-serif", fontWeight: 700, fontSize: "0.85rem", color: "var(--accent)" }}>
                        Experiencia #{i + 1}
                      </span>
                      {experience.length > 1 && (
                        <button onClick={() => removeExp(exp.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--muted)", display: "flex", alignItems: "center", gap: 4, fontSize: "0.75rem", fontFamily: "Syne,sans-serif" }}
                          onMouseEnter={e => e.currentTarget.style.color = "var(--danger)"}
                          onMouseLeave={e => e.currentTarget.style.color = "var(--muted)"}
                        >
                          <Trash2 size={13} /> Eliminar
                        </button>
                      )}
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12 }}>
                      <Field label="Empresa" value={exp.company} onChange={v => updateExp(exp.id, "company", v)} placeholder="Google" />
                      <Field label="Período" value={exp.period} onChange={v => updateExp(exp.id, "period", v)} placeholder="2022 - Presente" />
                    </div>
                    <Field label="Cargo" value={exp.role} onChange={v => updateExp(exp.id, "role", v)} placeholder="Senior Developer" />
                    <Field label="Descripción" value={exp.description} onChange={v => updateExp(exp.id, "description", v)} placeholder="Describe tus responsabilidades y logros..." multiline />
                  </div>
                ))}
                <button onClick={() => setExperience(p => [...p, emptyExp()])} style={{
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                  padding: "12px", borderRadius: 10, border: "1.5px dashed var(--border)",
                  background: "transparent", color: "var(--muted)", cursor: "pointer",
                  fontFamily: "Syne,sans-serif", fontWeight: 600, fontSize: "0.85rem",
                  transition: "border-color 0.18s, color 0.18s", width: "100%",
                }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--accent)"; e.currentTarget.style.color = "var(--accent)"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--muted)"; }}
                >
                  <Plus size={15} /> Agregar experiencia
                </button>
              </div>
            )}

            {/* Tab: Education */}
            {activeTab === "education" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {education.map((edu, i) => (
                  <div key={edu.id} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 16, padding: 20, display: "flex", flexDirection: "column", gap: 12 }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <span style={{ fontFamily: "Syne,sans-serif", fontWeight: 700, fontSize: "0.85rem", color: "var(--accent)" }}>
                        Educación #{i + 1}
                      </span>
                      {education.length > 1 && (
                        <button onClick={() => removeEdu(edu.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--muted)", display: "flex", alignItems: "center", gap: 4, fontSize: "0.75rem", fontFamily: "Syne,sans-serif" }}
                          onMouseEnter={e => e.currentTarget.style.color = "var(--danger)"}
                          onMouseLeave={e => e.currentTarget.style.color = "var(--muted)"}
                        >
                          <Trash2 size={13} /> Eliminar
                        </button>
                      )}
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12 }}>
                      <Field label="Institución" value={edu.institution} onChange={v => updateEdu(edu.id, "institution", v)} placeholder="Universidad Nacional" />
                      <Field label="Período" value={edu.period} onChange={v => updateEdu(edu.id, "period", v)} placeholder="2018 - 2022" />
                    </div>
                    <Field label="Título / Carrera" value={edu.degree} onChange={v => updateEdu(edu.id, "degree", v)} placeholder="Ingeniería de Sistemas" />
                  </div>
                ))}
                <button onClick={() => setEducation(p => [...p, emptyEdu()])} style={{
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                  padding: "12px", borderRadius: 10, border: "1.5px dashed var(--border)",
                  background: "transparent", color: "var(--muted)", cursor: "pointer",
                  fontFamily: "Syne,sans-serif", fontWeight: 600, fontSize: "0.85rem",
                  transition: "border-color 0.18s, color 0.18s", width: "100%",
                }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--accent)"; e.currentTarget.style.color = "var(--accent)"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--muted)"; }}
                >
                  <Plus size={15} /> Agregar educación
                </button>
              </div>
            )}

            {/* Tab: Skills */}
            {activeTab === "skills" && (
              <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 16, padding: 20, display: "flex", flexDirection: "column", gap: 14 }}>
                <h3 style={{ fontFamily: "Syne,sans-serif", fontWeight: 800, fontSize: "0.95rem", color: "var(--text)", margin: 0 }}>
                  Habilidades
                </h3>
                <Field
                  label="Escribe tus skills separadas por coma"
                  value={skills}
                  onChange={setSkills}
                  placeholder="React, TypeScript, Node.js, SQL, Figma..."
                  multiline
                />
                {skills && (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {skills.split(",").map(s => s.trim()).filter(Boolean).map((skill, i) => (
                      <span key={i} className="tag">{skill}</span>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Actions */}
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <button onClick={handleSave} style={{
                flex: 1, minWidth: 120, display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                padding: "12px 20px", borderRadius: 10, border: "none", cursor: "pointer",
                background: saved ? "#00E5A0" : "var(--accent)", color: "#000",
                fontFamily: "Syne,sans-serif", fontWeight: 700, fontSize: "0.88rem",
                transition: "background 0.25s, box-shadow 0.18s",
              }}
                onMouseEnter={e => e.currentTarget.style.boxShadow = "var(--accent-glow)"}
                onMouseLeave={e => e.currentTarget.style.boxShadow = "none"}
              >
                <Save size={15} /> {saved ? "¡Guardado!" : "Guardar"}
              </button>
              <button onClick={() => setShowExport(true)} style={{
                flex: 1, minWidth: 120, display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                padding: "12px 20px", borderRadius: 10, cursor: "pointer",
                background: "transparent", color: "var(--text)",
                border: "1.5px solid var(--border)",
                fontFamily: "Syne,sans-serif", fontWeight: 700, fontSize: "0.88rem",
                transition: "border-color 0.18s, color 0.18s",
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--accent)"; e.currentTarget.style.color = "var(--accent)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--text)"; }}
              >
                <FileText size={15} /> Exportar
              </button>
              <button onClick={() => setShowPreview(p => !p)} className="preview-toggle-btn" style={{
                flex: 1, minWidth: 120, display: "none", alignItems: "center", justifyContent: "center", gap: 8,
                padding: "12px 20px", borderRadius: 10, cursor: "pointer",
                background: showPreview ? "var(--accent-soft)" : "transparent",
                color: showPreview ? "var(--accent)" : "var(--muted)",
                border: "1.5px solid var(--border)",
                fontFamily: "Syne,sans-serif", fontWeight: 700, fontSize: "0.88rem",
                transition: "all 0.18s",
              }}>
                <Eye size={15} /> {showPreview ? "Ocultar preview" : "Ver preview"}
              </button>
            </div>
          </>
        )}
      </div>

      {/* ── Live preview ── */}
      <div className={`cv-preview-panel${showPreview ? " preview-visible" : ""}`}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
          <Eye size={14} color="var(--accent)" />
          <span style={{ fontFamily: "Syne,sans-serif", fontWeight: 700, fontSize: "0.82rem", color: "var(--muted)" }}>
            Vista previa en tiempo real
          </span>
        </div>
        <CVPreview cvData={cvData} />
      </div>

      <ExportModal
        isOpen={showExport}
        onClose={() => setShowExport(false)}
        cvData={cvData}
        previewElementId="cv-preview"
      />

      <style>{`
        @media (max-width: 768px) {
          .preview-toggle-btn { display: flex !important; }
          .cv-preview-panel { display: none; width: 100% !important; }
          .cv-preview-panel.preview-visible { display: block !important; }
        }
      `}</style>
    </div>
  );
}

function CVPreview({ cvData }) {
  const { name, role, email, phone, location, linkedin, summary, experience, education, skills } = cvData;
  return (
    <div id="cv-preview" style={{
      background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 16,
      padding: 24, fontSize: "0.78rem", color: "var(--text)", lineHeight: 1.6,
      maxHeight: "calc(100vh - 160px)", overflowY: "auto",
    }}>
      <div style={{ marginBottom: 18, paddingBottom: 16, borderBottom: "1px solid var(--border)" }}>
        <div style={{ fontFamily: "Syne,sans-serif", fontWeight: 800, fontSize: "1.4rem", color: "var(--accent)", letterSpacing: "-0.03em", lineHeight: 1.1 }}>
          {name || "Tu nombre"}
        </div>
        <div style={{ color: "var(--muted)", fontSize: "0.82rem", marginTop: 4 }}>{role || "Cargo / Rol"}</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "4px 12px", marginTop: 8, color: "var(--muted)", fontSize: "0.72rem" }}>
          {email && <span>{email}</span>}
          {phone && <span>{phone}</span>}
          {location && <span>{location}</span>}
          {linkedin && <span style={{ color: "var(--accent)" }}>{linkedin}</span>}
        </div>
      </div>
      {summary && <PreviewSection title="Perfil"><p style={{ margin: 0, color: "var(--muted)" }}>{summary}</p></PreviewSection>}
      {experience?.some(e => e.company) && (
        <PreviewSection title="Experiencia">
          {experience.filter(e => e.company).map(exp => (
            <div key={exp.id} style={{ marginBottom: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 4 }}>
                <span style={{ fontFamily: "Syne,sans-serif", fontWeight: 700, color: "var(--text)" }}>{exp.company}</span>
                <span style={{ color: "var(--muted)", fontSize: "0.7rem" }}>{exp.period}</span>
              </div>
              <div style={{ color: "var(--accent)", fontSize: "0.75rem", marginBottom: 4 }}>{exp.role}</div>
              <div style={{ color: "var(--muted)" }}>{exp.description}</div>
            </div>
          ))}
        </PreviewSection>
      )}
      {education?.some(e => e.institution) && (
        <PreviewSection title="Educación">
          {education.filter(e => e.institution).map(edu => (
            <div key={edu.id} style={{ marginBottom: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 4 }}>
                <span style={{ fontFamily: "Syne,sans-serif", fontWeight: 700, color: "var(--text)" }}>{edu.institution}</span>
                <span style={{ color: "var(--muted)", fontSize: "0.7rem" }}>{edu.period}</span>
              </div>
              <div style={{ color: "var(--muted)" }}>{edu.degree}</div>
            </div>
          ))}
        </PreviewSection>
      )}
      {skills?.length > 0 && (
        <PreviewSection title="Habilidades">
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {skills.map((s, i) => (
              <span key={i} style={{ padding: "3px 10px", borderRadius: 100, fontSize: "0.7rem", background: "var(--accent-soft)", color: "var(--accent)", border: "1px solid color-mix(in srgb, var(--accent) 30%, transparent)", fontFamily: "Syne,sans-serif", fontWeight: 700 }}>{s}</span>
            ))}
          </div>
        </PreviewSection>
      )}
    </div>
  );
}

function PreviewSection({ title, children }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ fontFamily: "Syne,sans-serif", fontWeight: 800, fontSize: "0.72rem", color: "var(--accent)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8, paddingBottom: 4, borderBottom: "1px solid var(--border)" }}>
        {title}
      </div>
      {children}
    </div>
  );
}
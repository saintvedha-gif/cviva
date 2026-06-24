// src/components/dashboard/CVEditorPage.jsx
import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Plus, Trash2, Save, Eye, Upload, User, Briefcase, GraduationCap, Wrench, FileText, Globe, Camera } from "lucide-react";
import ExportModal from "./ExportModal";
import CVUploader from "./CVUploader";
import { useAuth } from "../../hooks/useAuth";
import { getCVById, updateCV, createCV, uploadCVPhoto } from "../../lib/supabase";

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
      <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={4}
        style={{ background: "var(--surface-high)", border: "1.5px solid var(--border)", borderRadius: 10, padding: "10px 14px", color: "var(--text)", fontFamily: "DM Sans,sans-serif", fontSize: "0.88rem", resize: "vertical", outline: "none", transition: "border-color 0.18s", lineHeight: 1.6, width: "100%" }}
        onFocus={e => e.target.style.borderColor = "var(--accent)"}
        onBlur={e => e.target.style.borderColor = "var(--border)"}
      />
    ) : (
      <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        style={{ background: "var(--surface-high)", border: "1.5px solid var(--border)", borderRadius: 10, padding: "10px 14px", color: "var(--text)", fontFamily: "DM Sans,sans-serif", fontSize: "0.88rem", outline: "none", transition: "border-color 0.18s", width: "100%" }}
        onFocus={e => e.target.style.borderColor = "var(--accent)"}
        onBlur={e => e.target.style.borderColor = "var(--border)"}
      />
    )}
  </div>
);

const emptyExp   = () => ({ id: Date.now(),       company: "", role: "", period: "", description: "", responsibilities: [] });
const emptyEdu   = () => ({ id: Date.now() + 1,   institution: "", degree: "", period: "", description: "" });
const emptySkill = () => ({ id: Date.now() + 2,   name: "", level: 3, category: "technical", description: "" });

export default function CVEditorPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [activeTab,      setActiveTab]      = useState("info");
  const [showExport,     setShowExport]     = useState(false);
  const [saved,          setSaved]          = useState(false);
  const [saving,         setSaving]         = useState(false);
  const [saveError,      setSaveError]      = useState("");
  const [showPreview,    setShowPreview]    = useState(false);
  const [showUploader,   setShowUploader]   = useState(true);
  const [cvId,           setCvId]           = useState(id && id !== "new" ? id : null);
  const [cvTitle,        setCvTitle]        = useState("Mi CV");
  const [published,      setPublished]      = useState(false);
  const [photo,          setPhoto]          = useState(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const photoRef = useRef();

  const [info, setInfo] = useState({
    name: "", role: "", email: "", phone: "",
    location: "", linkedin: "", github: "", portfolio: "", summary: "",
  });
  const [experience, setExperience] = useState([emptyExp()]);
  const [education,  setEducation]  = useState([emptyEdu()]);
  const [skills,     setSkills]     = useState([emptySkill()]);

  // Cargar CV existente
  useEffect(() => {
    if (!id || id === "new") return;
    getCVById(id).then(({ data }) => {
      if (!data) return;
      setCvId(data.id);
      setCvTitle(data.title);
      setPublished(data.published);
      const d = data.cv_data || {};
      if (d.name !== undefined) {
        setInfo({
          name:      d.name      || "",
          role:      d.role      || "",
          email:     d.email     || "",
          phone:     d.phone     || "",
          location:  d.location  || "",
          linkedin:  d.linkedin  || "",
          github:    d.github    || "",
          portfolio: d.portfolio || "",
          summary:   d.summary   || "",
        });
        if (d.photo)             setPhoto(d.photo);
        if (d.experience?.length) setExperience(d.experience);
        if (d.education?.length)  setEducation(d.education);
        if (d.skills?.length) setSkills(
          d.skills.map((s, i) => typeof s === "string"
            ? { id: Date.now() + i, name: s, level: 3, category: "technical", description: "" }
            : s
          )
        );
        setShowUploader(false);
      }
    });
  }, [id]);

  const cvData = { ...info, photo, experience, education, skills };

  const handleSave = async (publishFlag) => {
    setSaving(true);
    setSaveError("");
    const shouldPublish = publishFlag !== undefined ? publishFlag : published;
    const payload = {
      cv_data: cvData,
      title: cvData.name ? `CV — ${cvData.name}` : cvTitle,
      published: shouldPublish,
    };
    try {
      if (cvId) {
        const { error } = await updateCV(cvId, payload);
        if (error) throw new Error(error.message);
        if (publishFlag !== undefined) setPublished(publishFlag);
      } else {
        const { data, error: createError } = await createCV(user.id, payload.title);
        if (createError) throw new Error(createError.message);
        if (data) {
          const { error: updateError } = await updateCV(data.id, { cv_data: cvData, published: shouldPublish });
          if (updateError) throw new Error(updateError.message);
          setCvId(data.id);
          navigate(`/dashboard/cvs/${data.id}/edit`, { replace: true });
        }
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      setSaveError(err.message || "Error al guardar. Intenta de nuevo.");
      setTimeout(() => setSaveError(""), 4000);
    } finally {
      setSaving(false);
    }
  };

  const handleParsed = (parsed) => {
    setInfo({
      name:      parsed.name      || "",
      role:      parsed.role      || "",
      email:     parsed.email     || "",
      phone:     parsed.phone     || "",
      location:  parsed.location  || "",
      linkedin:  parsed.linkedin  || "",
      github:    parsed.github    || "",
      portfolio: parsed.portfolio || "",
      summary:   parsed.summary   || "",
    });
    if (parsed.photo) setPhoto(parsed.photo);
    setExperience(parsed.experience?.length ? parsed.experience : [emptyExp()]);
    setEducation(parsed.education?.length   ? parsed.education  : [emptyEdu()]);
    if (parsed.skills?.length) {
      setSkills(parsed.skills.map((s, i) =>
        typeof s === "string"
          ? { id: Date.now() + i, name: s, level: 3, category: "technical", description: "" }
          : { id: s.id || Date.now() + i, ...s }
      ));
    } else {
      setSkills([emptySkill()]);
    }
    setShowUploader(false);
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingPhoto(true);
    const tempId = cvId || "temp";
    const { url, error } = await uploadCVPhoto(user.id, tempId, file);
    if (!error) setPhoto(url);
    setUploadingPhoto(false);
  };

  const updateExp   = (id, f, v) => setExperience(p => p.map(e => e.id === id ? { ...e, [f]: v } : e));
  const removeExp   = (id)       => setExperience(p => p.filter(e => e.id !== id));
  const updateEdu   = (id, f, v) => setEducation(p => p.map(e => e.id === id ? { ...e, [f]: v } : e));
  const removeEdu   = (id)       => setEducation(p => p.filter(e => e.id !== id));
  const updateSkill = (id, f, v) => setSkills(p => p.map(s => s.id === id ? { ...s, [f]: v } : s));
  const removeSkill = (id)       => setSkills(p => p.filter(s => s.id !== id));

  const addResp    = (expId)       => setExperience(p => p.map(e => e.id === expId ? { ...e, responsibilities: [...(e.responsibilities || []), ""] } : e));
  const updateResp = (expId, i, v) => setExperience(p => p.map(e => e.id === expId ? { ...e, responsibilities: e.responsibilities.map((r, j) => j === i ? v : r) } : e));
  const removeResp = (expId, i)    => setExperience(p => p.map(e => e.id === expId ? { ...e, responsibilities: e.responsibilities.filter((_, j) => j !== i) } : e));

  return (
    <div className="cv-editor-layout">

      {/* Editor panel */}
      <div className="cv-editor-panel" style={{ display: "flex", flexDirection: "column", gap: 20 }}>

        {showUploader ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <CVUploader onParsed={handleParsed} />
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
              <span style={{ fontSize: "0.78rem", color: "var(--muted)", fontFamily: "Syne,sans-serif", fontWeight: 600, whiteSpace: "nowrap" }}>o crea desde cero</span>
              <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
            </div>
            <button onClick={() => setShowUploader(false)}
              style={{ padding: "12px", borderRadius: 10, border: "1.5px dashed var(--border)", background: "transparent", color: "var(--muted)", cursor: "pointer", fontFamily: "Syne,sans-serif", fontWeight: 600, fontSize: "0.88rem", transition: "all 0.18s" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--accent)"; e.currentTarget.style.color = "var(--accent)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--muted)"; }}
            >
              Completar manualmente →
            </button>
          </div>
        ) : (
          <>
            {/* Back to uploader */}
            <button onClick={() => setShowUploader(true)}
              style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 9, border: "1px solid var(--border)", background: "transparent", color: "var(--muted)", fontSize: "0.78rem", fontFamily: "Syne,sans-serif", fontWeight: 600, cursor: "pointer", alignSelf: "flex-start", transition: "all 0.18s" }}
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
                  <button key={id} onClick={() => setActiveTab(id)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 12px", borderRadius: 8, border: "none", cursor: "pointer", background: active ? "var(--accent)" : "transparent", color: active ? "#000" : "var(--muted)", fontFamily: "Syne,sans-serif", fontWeight: 700, fontSize: "0.78rem", transition: "all 0.18s", whiteSpace: "nowrap", flex: "1 1 auto", justifyContent: "center" }}>
                    <Icon size={13} /> {label}
                  </button>
                );
              })}
            </div>

            {/* INFO */}
            {activeTab === "info" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 14, background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 16, padding: 20 }}>
                <h3 style={{ fontFamily: "Syne,sans-serif", fontWeight: 800, fontSize: "0.95rem", color: "var(--text)", margin: 0 }}>Información personal</h3>

                {/* Foto del CV */}
                <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "12px 0", borderBottom: "1px solid var(--border)" }}>
                  <div style={{ position: "relative", width: 64, height: 64, flexShrink: 0 }}>
                    {photo ? (
                      <img src={photo} alt="foto CV"
                        style={{ width: 64, height: 64, borderRadius: "50%", objectFit: "cover", border: "2px solid var(--border)" }} />
                    ) : (
                      <div style={{ width: 64, height: 64, borderRadius: "50%", background: "var(--surface-high)", border: "2px dashed var(--border)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <User size={24} color="var(--muted)" />
                      </div>
                    )}
                    <button onClick={() => photoRef.current.click()} disabled={uploadingPhoto}
                      style={{ position: "absolute", bottom: 0, right: 0, width: 22, height: 22, borderRadius: "50%", background: "var(--accent)", border: "2px solid var(--bg)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                      <Camera size={11} color="#000" />
                    </button>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                    <span style={{ fontSize: "0.82rem", fontFamily: "Syne,sans-serif", fontWeight: 600, color: "var(--text)" }}>Foto del CV</span>
                    <span style={{ fontSize: "0.75rem", color: "var(--muted)" }}>
                      {uploadingPhoto ? "Subiendo..." : "JPG, PNG — máx 6MB"}
                    </span>
                  </div>
                  <input ref={photoRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handlePhotoUpload} />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 14 }}>
                  <Field label="Nombre completo" value={info.name}      onChange={v => setInfo(p => ({ ...p, name: v }))}      placeholder="Juan Pérez" />
                  <Field label="Cargo / Rol"      value={info.role}      onChange={v => setInfo(p => ({ ...p, role: v }))}      placeholder="Full Stack Developer" />
                  <Field label="Email"            value={info.email}     onChange={v => setInfo(p => ({ ...p, email: v }))}     placeholder="juan@email.com" type="email" />
                  <Field label="Teléfono"         value={info.phone}     onChange={v => setInfo(p => ({ ...p, phone: v }))}     placeholder="+57 300 000 0000" />
                  <Field label="Ciudad / País"    value={info.location}  onChange={v => setInfo(p => ({ ...p, location: v }))}  placeholder="Bogotá, Colombia" />
                  <Field label="LinkedIn"         value={info.linkedin}  onChange={v => setInfo(p => ({ ...p, linkedin: v }))}  placeholder="linkedin.com/in/juan" />
                  <Field label="GitHub"           value={info.github    || ""} onChange={v => setInfo(p => ({ ...p, github: v }))}    placeholder="github.com/tuusuario" />
                  <Field label="Portfolio / Web"  value={info.portfolio || ""} onChange={v => setInfo(p => ({ ...p, portfolio: v }))} placeholder="tuportafolio.com" />
                </div>
                <Field label="Perfil profesional" value={info.summary} onChange={v => setInfo(p => ({ ...p, summary: v }))} placeholder="Describe tu perfil en 2-3 oraciones..." multiline />
              </div>
            )}

            {/* EXPERIENCE */}
            {activeTab === "experience" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {experience.map((exp, i) => (
                  <div key={exp.id} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 16, padding: 20, display: "flex", flexDirection: "column", gap: 12 }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <span style={{ fontFamily: "Syne,sans-serif", fontWeight: 700, fontSize: "0.85rem", color: "var(--accent)" }}>Experiencia #{i + 1}</span>
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
                      <Field label="Período" value={exp.period}  onChange={v => updateExp(exp.id, "period",  v)} placeholder="2022 - Presente" />
                    </div>
                    <Field label="Cargo"       value={exp.role}        onChange={v => updateExp(exp.id, "role",        v)} placeholder="Senior Developer" />
                    <Field label="Descripción" value={exp.description} onChange={v => updateExp(exp.id, "description", v)} placeholder="Describe brevemente tu rol..." multiline />
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      <label style={{ fontSize: "0.78rem", fontFamily: "Syne,sans-serif", fontWeight: 600, color: "var(--muted)" }}>Responsabilidades / Logros</label>
                      {(exp.responsibilities || []).map((resp, idx) => (
                        <div key={idx} style={{ display: "flex", gap: 8, alignItems: "center" }}>
                          <input value={resp} onChange={e => updateResp(exp.id, idx, e.target.value)} placeholder={`Logro ${idx + 1}...`}
                            style={{ flex: 1, background: "var(--surface-high)", border: "1.5px solid var(--border)", borderRadius: 9, padding: "8px 12px", color: "var(--text)", fontFamily: "DM Sans,sans-serif", fontSize: "0.85rem", outline: "none" }}
                            onFocus={e => e.target.style.borderColor = "var(--accent)"}
                            onBlur={e => e.target.style.borderColor = "var(--border)"}
                          />
                          <button onClick={() => removeResp(exp.id, idx)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--muted)", padding: 4, display: "flex", flexShrink: 0 }}
                            onMouseEnter={e => e.currentTarget.style.color = "var(--danger)"}
                            onMouseLeave={e => e.currentTarget.style.color = "var(--muted)"}
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      ))}
                      <button onClick={() => addResp(exp.id)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 12px", borderRadius: 8, border: "1px dashed var(--border)", background: "transparent", color: "var(--muted)", cursor: "pointer", fontSize: "0.75rem", fontFamily: "Syne,sans-serif", fontWeight: 600, alignSelf: "flex-start", transition: "all 0.18s" }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--accent)"; e.currentTarget.style.color = "var(--accent)"; }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--muted)"; }}
                      >
                        <Plus size={12} /> Agregar responsabilidad
                      </button>
                    </div>
                  </div>
                ))}
                <button onClick={() => setExperience(p => [...p, emptyExp()])} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "12px", borderRadius: 10, border: "1.5px dashed var(--border)", background: "transparent", color: "var(--muted)", cursor: "pointer", fontFamily: "Syne,sans-serif", fontWeight: 600, fontSize: "0.85rem", transition: "border-color 0.18s, color 0.18s", width: "100%" }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--accent)"; e.currentTarget.style.color = "var(--accent)"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--muted)"; }}
                >
                  <Plus size={15} /> Agregar experiencia
                </button>
              </div>
            )}

            {/* EDUCATION */}
            {activeTab === "education" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {education.map((edu, i) => (
                  <div key={edu.id} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 16, padding: 20, display: "flex", flexDirection: "column", gap: 12 }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <span style={{ fontFamily: "Syne,sans-serif", fontWeight: 700, fontSize: "0.85rem", color: "var(--accent)" }}>Educación #{i + 1}</span>
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
                      <Field label="Período"     value={edu.period}      onChange={v => updateEdu(edu.id, "period",      v)} placeholder="2018 - 2022" />
                    </div>
                    <Field label="Título / Carrera"     value={edu.degree}           onChange={v => updateEdu(edu.id, "degree",      v)} placeholder="Ingeniería de Sistemas" />
                    <Field label="Descripción / Logros" value={edu.description || ""} onChange={v => updateEdu(edu.id, "description", v)} placeholder="Graduado con honores..." multiline />
                  </div>
                ))}
                <button onClick={() => setEducation(p => [...p, emptyEdu()])} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "12px", borderRadius: 10, border: "1.5px dashed var(--border)", background: "transparent", color: "var(--muted)", cursor: "pointer", fontFamily: "Syne,sans-serif", fontWeight: 600, fontSize: "0.85rem", transition: "border-color 0.18s, color 0.18s", width: "100%" }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--accent)"; e.currentTarget.style.color = "var(--accent)"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--muted)"; }}
                >
                  <Plus size={15} /> Agregar educación
                </button>
              </div>
            )}

            {/* SKILLS */}
            {activeTab === "skills" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {skills.map((skill, i) => (
                  <div key={skill.id} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 14, padding: 16, display: "flex", flexDirection: "column", gap: 10 }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <span style={{ fontFamily: "Syne,sans-serif", fontWeight: 700, fontSize: "0.82rem", color: "var(--accent)" }}>Skill #{i + 1}</span>
                      {skills.length > 1 && (
                        <button onClick={() => removeSkill(skill.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--muted)", display: "flex", alignItems: "center", gap: 4, fontSize: "0.75rem", fontFamily: "Syne,sans-serif" }}
                          onMouseEnter={e => e.currentTarget.style.color = "var(--danger)"}
                          onMouseLeave={e => e.currentTarget.style.color = "var(--muted)"}
                        >
                          <Trash2 size={13} /> Eliminar
                        </button>
                      )}
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 10 }}>
                      <Field label="Nombre" value={skill.name} onChange={v => updateSkill(skill.id, "name", v)} placeholder="React, Liderazgo..." />
                      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                        <label style={{ fontSize: "0.78rem", fontFamily: "Syne,sans-serif", fontWeight: 600, color: "var(--muted)" }}>Categoría</label>
                        <select value={skill.category} onChange={e => updateSkill(skill.id, "category", e.target.value)} style={{ background: "var(--surface-high)", border: "1.5px solid var(--border)", borderRadius: 10, padding: "10px 14px", color: "var(--text)", fontFamily: "DM Sans,sans-serif", fontSize: "0.88rem", outline: "none" }}>
                          <option value="technical">Técnica</option>
                          <option value="soft">Blanda</option>
                        </select>
                      </div>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                      <label style={{ fontSize: "0.78rem", fontFamily: "Syne,sans-serif", fontWeight: 600, color: "var(--muted)" }}>
                        Nivel: {["", "Básico", "Elemental", "Intermedio", "Avanzado", "Experto"][skill.level]}
                      </label>
                      <div style={{ display: "flex", gap: 6 }}>
                        {[1,2,3,4,5].map(n => (
                          <button key={n} onClick={() => updateSkill(skill.id, "level", n)} style={{ flex: 1, height: 8, borderRadius: 100, border: "none", cursor: "pointer", background: n <= skill.level ? (skill.category === "technical" ? "var(--accent)" : "#C77DFF") : "var(--border)", transition: "background 0.18s" }} />
                        ))}
                      </div>
                    </div>
                    <Field label="Descripción (opcional)" value={skill.description || ""} onChange={v => updateSkill(skill.id, "description", v)} placeholder="Detalle adicional..." />
                  </div>
                ))}
                <button onClick={() => setSkills(p => [...p, emptySkill()])} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "12px", borderRadius: 10, border: "1.5px dashed var(--border)", background: "transparent", color: "var(--muted)", cursor: "pointer", fontFamily: "Syne,sans-serif", fontWeight: 600, fontSize: "0.85rem", transition: "border-color 0.18s, color 0.18s", width: "100%" }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--accent)"; e.currentTarget.style.color = "var(--accent)"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--muted)"; }}
                >
                  <Plus size={15} /> Agregar skill
                </button>
              </div>
            )}

            {/* Error al guardar */}
            {saveError && (
              <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 16px", borderRadius: 10, background: "rgba(255,77,109,0.08)", border: "1px solid rgba(255,77,109,0.2)", fontSize: "0.82rem", color: "var(--danger)" }}>
                ⚠️ {saveError}
              </div>
            )}

            {/* Actions */}
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <button onClick={() => handleSave(false)} disabled={saving} style={{ flex: 1, minWidth: 120, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "12px 20px", borderRadius: 10, border: "none", cursor: "pointer", background: saved ? "#00E5A0" : "var(--accent)", color: "#000", fontFamily: "Syne,sans-serif", fontWeight: 700, fontSize: "0.88rem", transition: "background 0.25s, box-shadow 0.18s" }}
                onMouseEnter={e => e.currentTarget.style.boxShadow = "var(--accent-glow)"}
                onMouseLeave={e => e.currentTarget.style.boxShadow = "none"}
              >
                <Save size={15} /> {saving ? "Guardando..." : saved ? "¡Guardado!" : "Guardar"}
              </button>
              <button onClick={() => handleSave(true)} disabled={saving} style={{ flex: 1, minWidth: 120, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "12px 20px", borderRadius: 10, cursor: "pointer", background: published ? "rgba(0,229,160,0.1)" : "transparent", color: published ? "#00E5A0" : "var(--muted)", border: `1.5px solid ${published ? "rgba(0,229,160,0.4)" : "var(--border)"}`, fontFamily: "Syne,sans-serif", fontWeight: 700, fontSize: "0.88rem", transition: "all 0.18s" }}>
                <Globe size={15} /> {published ? "Publicado ✓" : "Publicar"}
              </button>
              <button onClick={() => setShowExport(true)} style={{ flex: 1, minWidth: 120, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "12px 20px", borderRadius: 10, cursor: "pointer", background: "transparent", color: "var(--text)", border: "1.5px solid var(--border)", fontFamily: "Syne,sans-serif", fontWeight: 700, fontSize: "0.88rem", transition: "border-color 0.18s, color 0.18s" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--accent)"; e.currentTarget.style.color = "var(--accent)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--text)"; }}
              >
                <FileText size={15} /> Exportar
              </button>
              <button onClick={() => setShowPreview(p => !p)} className="preview-toggle-btn" style={{ flex: 1, minWidth: 120, display: "none", alignItems: "center", justifyContent: "center", gap: 8, padding: "12px 20px", borderRadius: 10, cursor: "pointer", background: showPreview ? "var(--accent-soft)" : "transparent", color: showPreview ? "var(--accent)" : "var(--muted)", border: "1.5px solid var(--border)", fontFamily: "Syne,sans-serif", fontWeight: 700, fontSize: "0.88rem", transition: "all 0.18s" }}>
                <Eye size={15} /> {showPreview ? "Ocultar preview" : "Ver preview"}
              </button>
            </div>
          </>
        )}
      </div>

      {/* Live preview */}
      <div className={`cv-preview-panel${showPreview ? " preview-visible" : ""}`}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
          <Eye size={14} color="var(--accent)" />
          <span style={{ fontFamily: "Syne,sans-serif", fontWeight: 700, fontSize: "0.82rem", color: "var(--muted)" }}>Vista previa en tiempo real</span>
        </div>
        <CVPreview cvData={cvData} />
      </div>

      <ExportModal isOpen={showExport} onClose={() => setShowExport(false)} cvData={cvData} previewElementId="cv-preview" />

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
  const { name, role, email, phone, location, linkedin, github, portfolio, summary, photo, experience, education, skills } = cvData;
  return (
    <div id="cv-preview" style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 16, padding: 24, fontSize: "0.78rem", color: "var(--text)", lineHeight: 1.6, maxHeight: "calc(100vh - 160px)", overflowY: "auto", overflowX: "hidden", wordBreak: "break-word", minWidth: 0 }}>      <div style={{ marginBottom: 18, paddingBottom: 16, borderBottom: "1px solid var(--border)", display: "flex", gap: 16, alignItems: "flex-start" }}>
        {photo && (
          <img src={photo} alt="foto"
            style={{ width: 56, height: 56, borderRadius: "50%", objectFit: "cover", border: "2px solid var(--border)", flexShrink: 0 }} />
        )}
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: "Syne,sans-serif", fontWeight: 800, fontSize: "1.4rem", color: "var(--accent)", letterSpacing: "-0.03em", lineHeight: 1.1 }}>{name || "Tu nombre"}</div>
          <div style={{ color: "var(--muted)", fontSize: "0.82rem", marginTop: 4 }}>{role || "Cargo / Rol"}</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "4px 12px", marginTop: 8, color: "var(--muted)", fontSize: "0.72rem" }}>
            {email    && <span>{email}</span>}
            {phone    && <span>{phone}</span>}
            {location && <span>{location}</span>}
            {linkedin  && <span style={{ color: "var(--accent)" }}>{linkedin}</span>}
            {github   && <span style={{ color: "var(--accent)" }}>{github}</span>}
            {portfolio && <span style={{ color: "var(--accent)" }}>{portfolio}</span>}
          </div>
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
              {exp.description && <div style={{ color: "var(--muted)", marginBottom: 4 }}>{exp.description}</div>}
              {exp.responsibilities?.filter(r => r).map((r, i) => (
                <div key={i} style={{ display: "flex", gap: 6, fontSize: "0.75rem", color: "var(--muted)" }}>
                  <span style={{ color: "var(--accent)", fontWeight: 700 }}>•</span>{r}
                </div>
              ))}
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
              {edu.description && <div style={{ color: "var(--muted)", fontSize: "0.72rem", marginTop: 2 }}>{edu.description}</div>}
            </div>
          ))}
        </PreviewSection>
      )}
      {skills?.length > 0 && (
        <PreviewSection title="Habilidades">
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {skills.map((s, i) => (
              <span key={i} style={{ padding: "3px 10px", borderRadius: 100, fontSize: "0.7rem", background: "var(--accent-soft)", color: "var(--accent)", border: "1px solid color-mix(in srgb, var(--accent) 30%, transparent)", fontFamily: "Syne,sans-serif", fontWeight: 700 }}>
                {typeof s === "string" ? s : s.name}
              </span>
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
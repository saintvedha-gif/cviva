// src/components/cv/InteractiveCVPage.jsx
import { useState } from "react";
import { Download, FileText, Globe, Filter, MapPin, Mail, Phone, Linkedin, ArrowLeft, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import ExportModal from "../dashboard/ExportModal";

// Demo data — en Sprint 4 vendrá de Supabase por slug
const DEMO_CV = {
  name: "María Rodríguez",
  role: "Senior UX Designer",
  email: "maria@email.com",
  phone: "+57 300 123 4567",
  location: "Bogotá, Colombia",
  linkedin: "linkedin.com/in/mariarodriguez",
  summary: "Diseñadora UX con más de 6 años de experiencia creando productos digitales centrados en el usuario. Especialista en design systems, investigación de usuarios y prototipado de alta fidelidad.",
  experience: [
    { id: 1, company: "TechCorp", role: "Lead Designer", period: "2022 - Presente", description: "Lideré el equipo de diseño de 5 personas, establecí el design system corporativo y mejoré la retención de usuarios en un 40%." },
    { id: 2, company: "StartupXYZ", role: "UX Designer", period: "2020 - 2022", description: "Diseñé la experiencia completa del producto desde cero, realizando investigación de usuarios y pruebas de usabilidad." },
    { id: 3, company: "Agency Co", role: "Visual Designer", period: "2018 - 2020", description: "Creé identidades visuales y materiales digitales para más de 30 clientes." },
  ],
  education: [
    { id: 1, institution: "Universidad de los Andes", degree: "Diseño Industrial", period: "2014 - 2018" },
    { id: 2, institution: "Coursera / Google", degree: "UX Design Certificate", period: "2019" },
  ],
  skills: ["Figma", "React", "Design Systems", "User Research", "Prototyping", "Motion Design", "Tailwind CSS", "Framer"],
};

const COLORS = ["#00E5FF", "#FFD166", "#FF6B6B", "#C77DFF", "#00E5A0", "#FF9F1C"];

export default function InteractiveCVPage({ cvData = DEMO_CV }) {
  const [activeSkill, setActiveSkill] = useState(null);
  const [activeSection, setActiveSection] = useState("experience");
  const [showExport, setShowExport] = useState(false);

  const sections = [
    { id: "experience", label: "Experiencia" },
    { id: "education",  label: "Educación" },
    { id: "skills",     label: "Habilidades" },
  ];

  const filteredExp = activeSkill
    ? cvData.experience.filter(e =>
        e.description?.toLowerCase().includes(activeSkill.toLowerCase()) ||
        e.role?.toLowerCase().includes(activeSkill.toLowerCase())
      )
    : cvData.experience;

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--text)" }}>

      {/* Topbar */}
      <div style={{ position: "sticky", top: 0, zIndex: 50, background: "color-mix(in srgb, var(--bg) 85%, transparent)", backdropFilter: "blur(14px)", borderBottom: "1px solid var(--border)", padding: "0 20px", height: 58, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Link to="/" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none", color: "var(--muted)", fontSize: "0.82rem", fontFamily: "Syne,sans-serif", fontWeight: 600 }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: "var(--accent)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Zap size={13} color="#000" strokeWidth={3} />
          </div>
          CViva
        </Link>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={() => setShowExport(true)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 14px", borderRadius: 9, border: "1px solid var(--border)", background: "var(--surface)", color: "var(--muted)", fontSize: "0.78rem", fontFamily: "Syne,sans-serif", fontWeight: 600, cursor: "pointer", transition: "all 0.18s" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--accent)"; e.currentTarget.style.color = "var(--accent)"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--muted)"; }}
          >
            <Download size={13} /> Descargar
          </button>
          <Link to="/auth/register" style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 14px", borderRadius: 9, background: "var(--accent)", color: "#000", fontSize: "0.78rem", fontFamily: "Syne,sans-serif", fontWeight: 700, textDecoration: "none" }}>
            <Globe size={13} /> Crear el mío
          </Link>
        </div>
      </div>

      <div id="cv-preview" style={{ maxWidth: 780, margin: "0 auto", padding: "32px 20px 60px" }}>

        {/* Profile header */}
        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 20, overflow: "hidden", marginBottom: 20 }}>
          <div style={{ background: "linear-gradient(135deg, var(--accent), #0062FF)", padding: "28px 28px 24px", position: "relative" }}>
            <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(0,0,0,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.08) 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
            <div style={{ position: "relative", display: "flex", alignItems: "flex-end", gap: 20, flexWrap: "wrap" }}>
              <div style={{ width: 72, height: 72, borderRadius: "50%", background: "rgba(0,0,0,0.2)", border: "3px solid rgba(255,255,255,0.4)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Syne,sans-serif", fontWeight: 800, fontSize: "1.6rem", color: "#fff", flexShrink: 0 }}>
                {cvData.name?.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()}
              </div>
              <div>
                <h1 style={{ fontFamily: "Syne,sans-serif", fontWeight: 800, fontSize: "clamp(1.3rem,4vw,1.8rem)", color: "#000", margin: 0, letterSpacing: "-0.02em" }}>
                  {cvData.name}
                </h1>
                <div style={{ fontSize: "0.88rem", color: "rgba(0,0,0,0.65)", marginTop: 4 }}>{cvData.role}</div>
              </div>
            </div>
          </div>

          {/* Contact row */}
          <div style={{ padding: "16px 28px", display: "flex", flexWrap: "wrap", gap: "8px 24px", borderBottom: "1px solid var(--border)" }}>
            {cvData.email && <ContactItem icon={Mail} text={cvData.email} />}
            {cvData.phone && <ContactItem icon={Phone} text={cvData.phone} />}
            {cvData.location && <ContactItem icon={MapPin} text={cvData.location} />}
            {cvData.linkedin && <ContactItem icon={Linkedin} text={cvData.linkedin} accent />}
          </div>

          {/* Summary */}
          {cvData.summary && (
            <div style={{ padding: "18px 28px" }}>
              <p style={{ fontSize: "0.88rem", color: "var(--muted)", lineHeight: 1.7, margin: 0 }}>{cvData.summary}</p>
            </div>
          )}
        </div>

        {/* Skills filter */}
        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 16, padding: "16px 20px", marginBottom: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
            <Filter size={13} color="var(--accent)" />
            <span style={{ fontFamily: "Syne,sans-serif", fontWeight: 700, fontSize: "0.78rem", color: "var(--muted)", letterSpacing: "0.08em", textTransform: "uppercase" }}>
              Filtrar por skill
            </span>
            {activeSkill && (
              <button onClick={() => setActiveSkill(null)} style={{ marginLeft: "auto", fontSize: "0.72rem", color: "var(--danger)", background: "none", border: "none", cursor: "pointer", fontFamily: "Syne,sans-serif", fontWeight: 600 }}>
                Limpiar filtro ×
              </button>
            )}
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {cvData.skills?.map((skill, i) => {
              const active = activeSkill === skill;
              return (
                <button key={skill} onClick={() => setActiveSkill(active ? null : skill)} style={{
                  padding: "5px 13px", borderRadius: 100, fontSize: "0.78rem",
                  fontFamily: "Syne,sans-serif", fontWeight: 700, cursor: "pointer",
                  background: active ? COLORS[i % COLORS.length] : "var(--surface-high)",
                  color: active ? "#000" : "var(--muted)",
                  border: `1.5px solid ${active ? COLORS[i % COLORS.length] : "var(--border)"}`,
                  transition: "all 0.18s",
                }}>
                  {skill}
                </button>
              );
            })}
          </div>
        </div>

        {/* Sections nav */}
        <div style={{ display: "flex", gap: 5, background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, padding: 5, marginBottom: 16 }}>
          {sections.map(({ id, label }) => {
            const active = activeSection === id;
            return (
              <button key={id} onClick={() => setActiveSection(id)} style={{
                flex: 1, padding: "9px", borderRadius: 8, border: "none", cursor: "pointer",
                background: active ? "var(--accent)" : "transparent",
                color: active ? "#000" : "var(--muted)",
                fontFamily: "Syne,sans-serif", fontWeight: 700, fontSize: "0.82rem",
                transition: "all 0.18s",
              }}>
                {label}
              </button>
            );
          })}
        </div>

        {/* Experience */}
        {activeSection === "experience" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {(filteredExp.length > 0 ? filteredExp : cvData.experience).map((exp, i) => (
              <div key={exp.id} className="card" style={{ padding: "20px 24px", position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", top: 0, left: 0, bottom: 0, width: 3, background: COLORS[i % COLORS.length] }} />
                <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8, marginBottom: 6 }}>
                  <div>
                    <div style={{ fontFamily: "Syne,sans-serif", fontWeight: 800, fontSize: "0.95rem", color: "var(--text)" }}>{exp.role}</div>
                    <div style={{ fontSize: "0.82rem", color: COLORS[i % COLORS.length], fontFamily: "Syne,sans-serif", fontWeight: 600, marginTop: 2 }}>{exp.company}</div>
                  </div>
                  <span style={{ fontSize: "0.72rem", color: "var(--muted)", background: "var(--surface-high)", padding: "4px 10px", borderRadius: 100, border: "1px solid var(--border)", height: "fit-content", whiteSpace: "nowrap" }}>
                    {exp.period}
                  </span>
                </div>
                <p style={{ fontSize: "0.84rem", color: "var(--muted)", margin: 0, lineHeight: 1.65 }}>{exp.description}</p>
              </div>
            ))}
            {filteredExp.length === 0 && activeSkill && (
              <div style={{ textAlign: "center", padding: "40px 24px", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 16, color: "var(--muted)", fontSize: "0.88rem" }}>
                No hay experiencia relacionada con <strong style={{ color: "var(--accent)" }}>{activeSkill}</strong>
              </div>
            )}
          </div>
        )}

        {/* Education */}
        {activeSection === "education" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {cvData.education?.map((edu, i) => (
              <div key={edu.id} className="card" style={{ padding: "20px 24px", position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", top: 0, left: 0, bottom: 0, width: 3, background: COLORS[i % COLORS.length] }} />
                <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
                  <div>
                    <div style={{ fontFamily: "Syne,sans-serif", fontWeight: 800, fontSize: "0.95rem", color: "var(--text)" }}>{edu.degree}</div>
                    <div style={{ fontSize: "0.82rem", color: COLORS[i % COLORS.length], fontFamily: "Syne,sans-serif", fontWeight: 600, marginTop: 2 }}>{edu.institution}</div>
                  </div>
                  <span style={{ fontSize: "0.72rem", color: "var(--muted)", background: "var(--surface-high)", padding: "4px 10px", borderRadius: 100, border: "1px solid var(--border)", height: "fit-content", whiteSpace: "nowrap" }}>
                    {edu.period}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Skills */}
        {activeSection === "skills" && (
          <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 16, padding: "24px" }}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
              {cvData.skills?.map((skill, i) => (
                <div key={skill} style={{ padding: "10px 18px", borderRadius: 12, background: "var(--surface-high)", border: `1.5px solid ${COLORS[i % COLORS.length]}30`, display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: COLORS[i % COLORS.length], flexShrink: 0 }} />
                  <span style={{ fontFamily: "Syne,sans-serif", fontWeight: 700, fontSize: "0.85rem", color: "var(--text)" }}>{skill}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CTA bottom */}
        <div style={{ marginTop: 32, padding: "24px 28px", background: "linear-gradient(135deg, color-mix(in srgb, var(--accent) 10%, var(--surface)), var(--surface))", border: "1px solid color-mix(in srgb, var(--accent) 25%, var(--border))", borderRadius: 18, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
          <div>
            <div style={{ fontFamily: "Syne,sans-serif", fontWeight: 800, fontSize: "0.95rem", color: "var(--text)", marginBottom: 4 }}>
              ¿Quieres un CV como este?
            </div>
            <div style={{ fontSize: "0.82rem", color: "var(--muted)" }}>Crea el tuyo gratis en CViva en menos de 5 minutos.</div>
          </div>
          <Link to="/auth/register" style={{ display: "inline-flex", alignItems: "center", gap: 7, background: "var(--accent)", color: "#000", padding: "10px 20px", borderRadius: 9, textDecoration: "none", fontFamily: "Syne,sans-serif", fontWeight: 700, fontSize: "0.85rem", flexShrink: 0 }}>
            Crear mi CV gratis →
          </Link>
        </div>
      </div>

      <ExportModal
        isOpen={showExport}
        onClose={() => setShowExport(false)}
        cvData={cvData}
        previewElementId="cv-preview"
      />
    </div>
  );
}

function ContactItem({ icon: Icon, text, accent }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "0.8rem", color: accent ? "var(--accent)" : "var(--muted)" }}>
      <Icon size={13} />
      {text}
    </div>
  );
}
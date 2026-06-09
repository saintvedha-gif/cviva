// src/components/cv/InteractiveCVPage.jsx
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Download, Globe, Mail, Phone, MapPin, Linkedin, Github,
  Briefcase, GraduationCap, Wrench, User, Star, Menu, X,
  Zap, ExternalLink, Award, FolderOpen
} from "lucide-react";
import ExportModal from "../dashboard/ExportModal";
import { getCVBySlug } from "../../lib/supabase";

const ACCENT_COLORS = ["#00E5FF", "#FFD166", "#FF6B6B", "#C77DFF", "#00E5A0", "#FF9F1C"];

const DEMO_CV = {
  name: "María Rodríguez",
  role: "Senior UX Designer",
  photo: "",
  email: "maria@email.com",
  phone: "+57 300 123 4567",
  location: "Bogotá, Colombia",
  linkedin: "linkedin.com/in/mariarodriguez",
  github: "github.com/mariaro",
  portfolio: "mariaro.design",
  summary: "Diseñadora UX con más de 6 años de experiencia creando productos digitales centrados en el usuario. Especialista en design systems, investigación y prototipado de alta fidelidad.",
  experience: [
    {
      id: 1, company: "TechCorp", role: "Lead Designer", period: "2022 - Presente",
      description: "Lideré el equipo de diseño de 5 personas y establecí el design system corporativo.",
      responsibilities: ["Establecí el design system corporativo", "Mejoré retención de usuarios en un 40%", "Coordiné con equipos de producto e ingeniería"],
    },
    {
      id: 2, company: "StartupXYZ", role: "UX Designer", period: "2020 - 2022",
      description: "Diseñé la experiencia completa del producto desde cero.",
      responsibilities: ["Investigación de usuarios y pruebas de usabilidad", "Wireframes y prototipos de alta fidelidad"],
    },
  ],
  education: [
    { id: 1, institution: "Universidad de los Andes", degree: "Diseño Industrial", period: "2014 - 2018", description: "Graduada con honores." },
    { id: 2, institution: "Google / Coursera", degree: "UX Design Certificate", period: "2019", description: "" },
  ],
  skills: [
    { name: "Figma", level: 5, category: "technical" },
    { name: "User Research", level: 4, category: "technical" },
    { name: "React", level: 3, category: "technical" },
    { name: "Liderazgo", level: 4, category: "soft" },
    { name: "Comunicación", level: 5, category: "soft" },
  ],
  certifications: [],
  projects: [],
  languages: [],
  references: [],
  extraSections: [],
};

const SECTIONS = [
  { id: "profile",        label: "Perfil",          icon: User },
  { id: "experience",     label: "Experiencia",     icon: Briefcase },
  { id: "education",      label: "Educación",       icon: GraduationCap },
  { id: "skills",         label: "Habilidades",     icon: Wrench },
  { id: "certifications", label: "Certificaciones", icon: Award },
  { id: "projects",       label: "Proyectos",       icon: FolderOpen },
];

export default function InteractiveCVPage() {
  const { slug } = useParams();
  const [cvData, setCvData] = useState(null);
  const [loadingCV, setLoadingCV] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [activeSection, setActiveSection] = useState("profile");
  const [showExport, setShowExport] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!slug) {
      setCvData(DEMO_CV);
      setLoadingCV(false);
      return;
    }
    getCVBySlug(slug).then(({ data }) => {
      if (data?.cv_data) setCvData(data.cv_data);
      else setNotFound(true);
      setLoadingCV(false);
    });
  }, [slug]);

  if (loadingCV) return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: 40, height: 40, border: "3px solid var(--border)", borderTopColor: "var(--accent)", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  if (notFound) return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16, padding: 24 }}>
      <div style={{ fontFamily: "Syne,sans-serif", fontWeight: 800, fontSize: "1.5rem", color: "var(--text)" }}>CV no encontrado</div>
      <div style={{ color: "var(--muted)", textAlign: "center" }}>Este CV no existe o no está publicado.</div>
      <Link to="/" style={{ color: "var(--accent)", fontFamily: "Syne,sans-serif", fontWeight: 600, textDecoration: "none" }}>← Volver al inicio</Link>
    </div>
  );

  const visibleSections = SECTIONS.filter(s => {
    if (s.id === "profile")        return true;
    if (s.id === "experience")     return cvData.experience?.length > 0;
    if (s.id === "education")      return cvData.education?.length > 0;
    if (s.id === "skills")         return cvData.skills?.length > 0;
    if (s.id === "certifications") return cvData.certifications?.length > 0;
    if (s.id === "projects")       return cvData.projects?.length > 0;
    return false;
  });

  const allSections = [
    ...visibleSections,
    ...(cvData.extraSections || []).map(s => ({ id: s.id, label: s.title, icon: Star })),
  ];

  const initials = cvData.name?.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase() || "CV";

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", display: "flex", flexDirection: "column" }}>

      {/* Topbar */}
      <header style={{
        position: "sticky", top: 0, zIndex: 50,
        background: "color-mix(in srgb, var(--bg) 88%, transparent)",
        backdropFilter: "blur(14px)", borderBottom: "1px solid var(--border)",
        height: 56, display: "flex", alignItems: "center",
        justifyContent: "space-between", padding: "0 20px", flexShrink: 0,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button
            onClick={() => setSidebarOpen(o => !o)}
            className="sidebar-toggle"
            style={{ width: 34, height: 34, borderRadius: 8, border: "1px solid var(--border)", background: "var(--surface)", display: "none", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "var(--text)" }}
          >
            {sidebarOpen ? <X size={16} /> : <Menu size={16} />}
          </button>
          <Link to="/" style={{ display: "flex", alignItems: "center", gap: 7, textDecoration: "none" }}>
            <div style={{ width: 26, height: 26, borderRadius: 7, background: "var(--accent)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Zap size={12} color="#000" strokeWidth={3} />
            </div>
            <span style={{ fontFamily: "Syne,sans-serif", fontWeight: 800, fontSize: "0.9rem", color: "var(--muted)" }}>
              CV<span style={{ color: "var(--accent)" }}>iva</span>
            </span>
          </Link>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={() => setShowExport(true)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 14px", borderRadius: 8, border: "1px solid var(--border)", background: "var(--surface)", color: "var(--muted)", fontSize: "0.78rem", fontFamily: "Syne,sans-serif", fontWeight: 600, cursor: "pointer", transition: "all 0.18s" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--accent)"; e.currentTarget.style.color = "var(--accent)"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--muted)"; }}
          >
            <Download size={13} /> Descargar
          </button>
          <Link to="/auth/register" style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 14px", borderRadius: 8, background: "var(--accent)", color: "#000", fontSize: "0.78rem", fontFamily: "Syne,sans-serif", fontWeight: 700, textDecoration: "none" }}>
            <Globe size={13} /> Crear el mío
          </Link>
        </div>
      </header>

      <div style={{ display: "flex", flex: 1, position: "relative" }}>

        {sidebarOpen && (
          <div onClick={() => setSidebarOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 39, backdropFilter: "blur(4px)" }} />
        )}

        {/* Sidebar */}
        <aside style={{
          width: 230, flexShrink: 0, borderRight: "1px solid var(--border)",
          background: "var(--surface)", display: "flex", flexDirection: "column",
          position: "sticky", top: 56, height: "calc(100vh - 56px)", overflowY: "auto",
        }} className={`cv-sidebar${sidebarOpen ? " cv-sidebar-open" : ""}`}>

          <div style={{ padding: "24px 20px 20px", borderBottom: "1px solid var(--border)", display: "flex", flexDirection: "column", alignItems: "center", gap: 12, textAlign: "center" }}>
            {cvData.photo ? (
              <img src={cvData.photo} alt={cvData.name} style={{ width: 72, height: 72, borderRadius: "50%", objectFit: "cover", border: "3px solid var(--accent)" }} />
            ) : (
              <div style={{ width: 72, height: 72, borderRadius: "50%", background: "linear-gradient(135deg, var(--accent), #0062FF)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Syne,sans-serif", fontWeight: 800, fontSize: "1.4rem", color: "#000", border: "3px solid var(--accent-soft)" }}>
                {initials}
              </div>
            )}
            <div>
              <div style={{ fontFamily: "Syne,sans-serif", fontWeight: 800, fontSize: "0.88rem", color: "var(--text)", lineHeight: 1.2 }}>{cvData.name}</div>
              <div style={{ fontSize: "0.72rem", color: "var(--accent)", fontFamily: "Syne,sans-serif", fontWeight: 600, marginTop: 3 }}>{cvData.role}</div>
            </div>
          </div>

          <nav style={{ flex: 1, padding: "12px 10px" }}>
            {allSections.map(({ id, label, icon: Icon }) => {
              const active = activeSection === id;
              return (
                <button key={id} onClick={() => { setActiveSection(id); setSidebarOpen(false); }} style={{
                  width: "100%", display: "flex", alignItems: "center", gap: 10,
                  padding: "10px 12px", borderRadius: 9, border: "none", cursor: "pointer",
                  background: active ? "var(--accent-soft)" : "transparent",
                  color: active ? "var(--accent)" : "var(--muted)",
                  fontFamily: "Syne,sans-serif", fontWeight: 600, fontSize: "0.82rem",
                  marginBottom: 3, textAlign: "left", position: "relative", transition: "all 0.18s",
                }}
                  onMouseEnter={e => { if (!active) { e.currentTarget.style.background = "var(--surface-high)"; e.currentTarget.style.color = "var(--text)"; } }}
                  onMouseLeave={e => { if (!active) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--muted)"; } }}
                >
                  {active && <div style={{ position: "absolute", left: 0, top: "50%", transform: "translateY(-50%)", width: 3, height: 18, background: "var(--accent)", borderRadius: "0 3px 3px 0" }} />}
                  <Icon size={15} />
                  {label}
                </button>
              );
            })}
          </nav>

          <div style={{ padding: "16px", borderTop: "1px solid var(--border)", display: "flex", flexDirection: "column", gap: 8 }}>
            {cvData.email    && <ContactMini icon={Mail}     text={cvData.email} />}
            {cvData.phone    && <ContactMini icon={Phone}    text={cvData.phone} />}
            {cvData.location && <ContactMini icon={MapPin}   text={cvData.location} />}
            {cvData.linkedin && <ContactMini icon={Linkedin} text="LinkedIn"  href={`https://${cvData.linkedin}`}  accent />}
            {cvData.github   && <ContactMini icon={Github}   text="GitHub"    href={`https://${cvData.github}`}    accent />}
            {cvData.portfolio && <ContactMini icon={Globe}   text="Portfolio" href={`https://${cvData.portfolio}`} accent />}
          </div>
        </aside>

        {/* Main */}
        <main id="cv-preview" style={{ flex: 1, padding: "28px 24px", overflowY: "auto", minWidth: 0 }}>

          {/* PROFILE */}
          {activeSection === "profile" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 20, maxWidth: 740 }}>
              <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 18, overflow: "hidden" }}>
                <div style={{ background: "linear-gradient(135deg, var(--accent) 0%, #0062FF 100%)", padding: "32px 28px", position: "relative" }}>
                  <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(0,0,0,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.07) 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
                  <div style={{ position: "relative", display: "flex", alignItems: "flex-end", gap: 20, flexWrap: "wrap" }}>
                    {cvData.photo ? (
                      <img src={cvData.photo} alt={cvData.name} style={{ width: 80, height: 80, borderRadius: "50%", objectFit: "cover", border: "3px solid rgba(255,255,255,0.5)", flexShrink: 0 }} />
                    ) : (
                      <div style={{ width: 80, height: 80, borderRadius: "50%", background: "rgba(0,0,0,0.2)", border: "3px solid rgba(255,255,255,0.4)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Syne,sans-serif", fontWeight: 800, fontSize: "1.8rem", color: "#fff", flexShrink: 0 }}>
                        {initials}
                      </div>
                    )}
                    <div>
                      <h1 style={{ fontFamily: "Syne,sans-serif", fontWeight: 800, fontSize: "clamp(1.4rem,4vw,2rem)", color: "#000", margin: 0, letterSpacing: "-0.02em" }}>{cvData.name}</h1>
                      <div style={{ fontSize: "0.9rem", color: "rgba(0,0,0,0.6)", marginTop: 4 }}>{cvData.role}</div>
                    </div>
                  </div>
                </div>
                {cvData.summary && (
                  <div style={{ padding: "20px 28px" }}>
                    <p style={{ fontSize: "0.9rem", color: "var(--muted)", lineHeight: 1.75, margin: 0 }}>{cvData.summary}</p>
                  </div>
                )}
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: 12 }}>
                {[
                  { label: "Experiencias",   value: cvData.experience?.length    || 0, color: "#00E5FF" },
                  { label: "Educación",      value: cvData.education?.length     || 0, color: "#FFD166" },
                  { label: "Habilidades",    value: cvData.skills?.length        || 0, color: "#C77DFF" },
                  ...(cvData.certifications?.length > 0 ? [{ label: "Certificaciones", value: cvData.certifications.length, color: "#00E5A0" }] : []),
                  ...(cvData.projects?.length       > 0 ? [{ label: "Proyectos",       value: cvData.projects.length,       color: "#FF6B6B" }] : []),
                ].map(({ label, value, color }) => (
                  <div key={label} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 14, padding: "18px 16px", textAlign: "center" }}>
                    <div style={{ fontFamily: "Syne,sans-serif", fontWeight: 800, fontSize: "2rem", color, lineHeight: 1 }}>{value}</div>
                    <div style={{ fontSize: "0.75rem", color: "var(--muted)", marginTop: 6 }}>{label}</div>
                  </div>
                ))}
              </div>

              {cvData.languages?.length > 0 && (
                <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 16, padding: "20px 24px" }}>
                  <SectionTitle>Idiomas</SectionTitle>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 14 }}>
                    {cvData.languages.map((lang, i) => (
                      <div key={i} style={{ padding: "8px 16px", borderRadius: 10, background: "var(--surface-high)", border: "1px solid var(--border)", display: "flex", flexDirection: "column", alignItems: "center", gap: 4, minWidth: 90 }}>
                        <span style={{ fontFamily: "Syne,sans-serif", fontWeight: 700, fontSize: "0.85rem", color: "var(--text)" }}>{lang.name}</span>
                        <span style={{ fontSize: "0.7rem", color: "var(--accent)", fontFamily: "Syne,sans-serif", fontWeight: 600 }}>{lang.level}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* EXPERIENCE */}
          {activeSection === "experience" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 740 }}>
              <SectionTitle>Experiencia Laboral</SectionTitle>
              {cvData.experience?.map((exp, i) => (
                <div key={exp.id} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 16, overflow: "hidden" }}>
                  <div style={{ borderLeft: `4px solid ${ACCENT_COLORS[i % ACCENT_COLORS.length]}`, padding: "20px 24px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 10, marginBottom: 8 }}>
                      <div>
                        <div style={{ fontFamily: "Syne,sans-serif", fontWeight: 800, fontSize: "1rem", color: "var(--text)" }}>{exp.role}</div>
                        <div style={{ fontSize: "0.85rem", color: ACCENT_COLORS[i % ACCENT_COLORS.length], fontFamily: "Syne,sans-serif", fontWeight: 600, marginTop: 2 }}>{exp.company}</div>
                      </div>
                      <span style={{ fontSize: "0.72rem", color: "var(--muted)", background: "var(--surface-high)", padding: "4px 12px", borderRadius: 100, border: "1px solid var(--border)", height: "fit-content", whiteSpace: "nowrap" }}>
                        {exp.period}
                      </span>
                    </div>
                    {exp.description && <p style={{ fontSize: "0.85rem", color: "var(--muted)", margin: "0 0 12px", lineHeight: 1.65 }}>{exp.description}</p>}
                    {exp.responsibilities?.filter(r => r).length > 0 && (
                      <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 6 }}>
                        {exp.responsibilities.filter(r => r).map((resp, j) => (
                          <li key={j} style={{ display: "flex", gap: 10, fontSize: "0.82rem", color: "var(--muted)", alignItems: "flex-start" }}>
                            <span style={{ color: ACCENT_COLORS[i % ACCENT_COLORS.length], fontWeight: 700, marginTop: 1, flexShrink: 0 }}>•</span>
                            {resp}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* EDUCATION */}
          {activeSection === "education" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 740 }}>
              <SectionTitle>Educación</SectionTitle>
              {cvData.education?.map((edu, i) => (
                <div key={edu.id} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 16, overflow: "hidden" }}>
                  <div style={{ borderLeft: `4px solid ${ACCENT_COLORS[i % ACCENT_COLORS.length]}`, padding: "20px 24px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
                      <div>
                        <div style={{ fontFamily: "Syne,sans-serif", fontWeight: 800, fontSize: "1rem", color: "var(--text)" }}>{edu.degree}</div>
                        <div style={{ fontSize: "0.85rem", color: ACCENT_COLORS[i % ACCENT_COLORS.length], fontFamily: "Syne,sans-serif", fontWeight: 600, marginTop: 2 }}>{edu.institution}</div>
                      </div>
                      <span style={{ fontSize: "0.72rem", color: "var(--muted)", background: "var(--surface-high)", padding: "4px 12px", borderRadius: 100, border: "1px solid var(--border)", height: "fit-content", whiteSpace: "nowrap" }}>
                        {edu.period}
                      </span>
                    </div>
                    {edu.description && <p style={{ fontSize: "0.82rem", color: "var(--muted)", margin: "10px 0 0", lineHeight: 1.6 }}>{edu.description}</p>}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* SKILLS */}
          {activeSection === "skills" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 20, maxWidth: 740 }}>
              <SectionTitle>Habilidades</SectionTitle>
              {["technical", "soft"].map(cat => {
                const filtered = cvData.skills?.filter(s => s.category === cat || (!s.category && cat === "technical"));
                if (!filtered?.length) return null;
                return (
                  <div key={cat}>
                    <div style={{ fontSize: "0.72rem", fontFamily: "Syne,sans-serif", fontWeight: 700, color: "var(--muted)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 12 }}>
                      {cat === "technical" ? "Técnicas" : "Blandas"}
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 12 }}>
                      {filtered.map((skill, i) => <SkillCard key={i} skill={skill} isTechnical={cat === "technical"} />)}
                    </div>
                  </div>
                );
              })}
              {cvData.skills?.every(s => !s.category) && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                  {cvData.skills.map((skill, i) => (
                    <span key={i} style={{ padding: "8px 16px", borderRadius: 100, background: "var(--accent-soft)", color: "var(--accent)", fontFamily: "Syne,sans-serif", fontWeight: 700, fontSize: "0.82rem", border: "1px solid color-mix(in srgb, var(--accent) 30%, transparent)" }}>
                      {typeof skill === "string" ? skill : skill.name}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* CERTIFICATIONS */}
          {activeSection === "certifications" && cvData.certifications?.length > 0 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 740 }}>
              <SectionTitle>Certificaciones</SectionTitle>
              {cvData.certifications.map((cert, i) => (
                <div key={cert.id || i} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 16, padding: "18px 22px", display: "flex", gap: 16, alignItems: "flex-start" }}>
                  <div style={{ width: 42, height: 42, borderRadius: 12, background: "var(--accent-soft)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Award size={18} color="var(--accent)" />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: "Syne,sans-serif", fontWeight: 700, fontSize: "0.92rem", color: "var(--text)", marginBottom: 3 }}>{cert.name}</div>
                    <div style={{ fontSize: "0.8rem", color: "var(--accent)", fontFamily: "Syne,sans-serif", fontWeight: 600, marginBottom: 4 }}>{cert.institution}</div>
                    {cert.period && <div style={{ fontSize: "0.72rem", color: "var(--muted)" }}>{cert.period}</div>}
                    {cert.description && <p style={{ fontSize: "0.8rem", color: "var(--muted)", margin: "8px 0 0", lineHeight: 1.6 }}>{cert.description}</p>}
                  </div>
                  {cert.url && <a href={cert.url} target="_blank" rel="noreferrer" style={{ color: "var(--accent)", flexShrink: 0 }}><ExternalLink size={15} /></a>}
                </div>
              ))}
            </div>
          )}

          {/* PROJECTS */}
          {activeSection === "projects" && cvData.projects?.length > 0 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 740 }}>
              <SectionTitle>Proyectos</SectionTitle>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
                {cvData.projects.map((proj, i) => (
                  <div key={proj.id || i} className="card" style={{ padding: "18px 20px", position: "relative", overflow: "hidden" }}>
                    <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: ACCENT_COLORS[i % ACCENT_COLORS.length] }} />
                    <div style={{ fontFamily: "Syne,sans-serif", fontWeight: 800, fontSize: "0.92rem", color: "var(--text)", marginBottom: 6 }}>{proj.title}</div>
                    {proj.role && <div style={{ fontSize: "0.75rem", color: "var(--accent)", fontFamily: "Syne,sans-serif", fontWeight: 600, marginBottom: 8 }}>{proj.role}</div>}
                    <p style={{ fontSize: "0.8rem", color: "var(--muted)", margin: "0 0 12px", lineHeight: 1.6 }}>{proj.description}</p>
                    {proj.technologies?.length > 0 && (
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                        {proj.technologies.map((tech, j) => (
                          <span key={j} style={{ fontSize: "0.68rem", padding: "2px 8px", borderRadius: 100, background: "var(--surface-high)", color: "var(--muted)", border: "1px solid var(--border)", fontFamily: "Syne,sans-serif", fontWeight: 600 }}>{tech}</span>
                        ))}
                      </div>
                    )}
                    {proj.url && (
                      <a href={proj.url} target="_blank" rel="noreferrer" style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 12, fontSize: "0.75rem", color: "var(--accent)", textDecoration: "none", fontFamily: "Syne,sans-serif", fontWeight: 600 }}>
                        <ExternalLink size={12} /> Ver proyecto
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* EXTRA SECTIONS */}
          {cvData.extraSections?.map(section => (
            activeSection === section.id && (
              <div key={section.id} style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 740 }}>
                <SectionTitle>{section.title}</SectionTitle>
                {section.items?.map((item, i) => (
                  <div key={i} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 14, padding: "16px 20px" }}>
                    {item.title && <div style={{ fontFamily: "Syne,sans-serif", fontWeight: 700, fontSize: "0.9rem", color: "var(--text)", marginBottom: 6 }}>{item.title}</div>}
                    {item.subtitle && <div style={{ fontSize: "0.78rem", color: "var(--accent)", fontFamily: "Syne,sans-serif", fontWeight: 600, marginBottom: 6 }}>{item.subtitle}</div>}
                    {item.description && <p style={{ fontSize: "0.82rem", color: "var(--muted)", margin: 0, lineHeight: 1.6 }}>{item.description}</p>}
                  </div>
                ))}
              </div>
            )
          ))}

          {/* CTA */}
          <div style={{ marginTop: 32, maxWidth: 740, padding: "22px 26px", background: "linear-gradient(135deg, color-mix(in srgb, var(--accent) 10%, var(--surface)), var(--surface))", border: "1px solid color-mix(in srgb, var(--accent) 25%, var(--border))", borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 14 }}>
            <div>
              <div style={{ fontFamily: "Syne,sans-serif", fontWeight: 800, fontSize: "0.92rem", color: "var(--text)", marginBottom: 3 }}>¿Quieres un CV como este?</div>
              <div style={{ fontSize: "0.8rem", color: "var(--muted)" }}>Crea el tuyo gratis en CViva en minutos.</div>
            </div>
            <Link to="/auth/register" style={{ display: "inline-flex", alignItems: "center", gap: 7, background: "var(--accent)", color: "#000", padding: "9px 18px", borderRadius: 9, textDecoration: "none", fontFamily: "Syne,sans-serif", fontWeight: 700, fontSize: "0.82rem", flexShrink: 0 }}>
              Crear mi CV gratis →
            </Link>
          </div>
        </main>
      </div>

      <ExportModal isOpen={showExport} onClose={() => setShowExport(false)} cvData={cvData} previewElementId="cv-preview" />

      <style>{`
        @media (max-width: 768px) {
          .sidebar-toggle { display: flex !important; }
          .cv-sidebar {
            position: fixed !important; top: 56px !important; left: 0 !important;
            height: calc(100vh - 56px) !important; z-index: 40;
            transform: translateX(-100%);
            transition: transform 0.3s cubic-bezier(.4,0,.2,1);
          }
          .cv-sidebar.cv-sidebar-open { transform: translateX(0) !important; }
        }
      `}</style>
    </div>
  );
}

function SkillCard({ skill, isTechnical }) {
  const level = skill.level || 0;
  const color = isTechnical ? "var(--accent)" : "#C77DFF";
  return (
    <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, padding: "14px 16px" }}>
      <div style={{ fontFamily: "Syne,sans-serif", fontWeight: 700, fontSize: "0.85rem", color: "var(--text)", marginBottom: 4 }}>
        {typeof skill === "string" ? skill : skill.name}
      </div>
      {skill.description && <div style={{ fontSize: "0.72rem", color: "var(--muted)", marginBottom: 8 }}>{skill.description}</div>}
      {level > 0 && (
        <div style={{ display: "flex", gap: 4, marginTop: 8 }}>
          {[1,2,3,4,5].map(n => (
            <div key={n} style={{ flex: 1, height: 5, borderRadius: 100, background: n <= level ? color : "var(--border)", transition: "background 0.2s" }} />
          ))}
        </div>
      )}
    </div>
  );
}

function SectionTitle({ children }) {
  return (
    <div style={{ fontFamily: "Syne,sans-serif", fontWeight: 800, fontSize: "1.1rem", color: "var(--text)", paddingBottom: 12, borderBottom: "2px solid var(--accent)", marginBottom: 4, display: "inline-block" }}>
      {children}
    </div>
  );
}

function ContactMini({ icon: Icon, text, href, accent }) {
  const content = (
    <div style={{ display: "flex", alignItems: "center", gap: 7, fontSize: "0.72rem", color: accent ? "var(--accent)" : "var(--muted)", overflow: "hidden" }}>
      <Icon size={12} style={{ flexShrink: 0 }} />
      <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{text}</span>
    </div>
  );
  if (href) return <a href={href} target="_blank" rel="noreferrer" style={{ textDecoration: "none" }}>{content}</a>;
  return content;
}
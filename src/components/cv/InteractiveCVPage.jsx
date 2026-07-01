// src/components/cv/InteractiveCVPage.jsx
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Download, Globe, Mail, Phone, MapPin, Linkedin, Github,
  Briefcase, GraduationCap, Sparkles, User, Star, Menu, X,
  Zap, ExternalLink, Award, FolderOpen
} from "lucide-react";
import ExportModal from "../dashboard/ExportModal";
import { getCVBySlug, incrementCVViews } from "../../lib/supabase";

// Sanitiza una URL antes de usarla en href. Los campos de certificaciones y
// proyectos vienen del parseo con IA o de edición manual del JSON, sin
// validar — sin esto, alguien podría guardar "javascript:..." y ejecutar
// código en el navegador de cualquier visitante que vea ese CV público.
// Solo se permiten enlaces http(s); todo lo demás se descarta.
function safeUrl(raw) {
  if (!raw) return null;
  const trimmed = String(raw).trim();
  // Si no trae protocolo, asumimos https (igual que linkedin/github/portfolio)
  const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  try {
    const parsed = new URL(withProtocol);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") return null;
    return parsed.href;
  } catch {
    return null;
  }
}

// ── Paleta Ejecutivo Oscuro ──────────────────────────────────────────────────
const T = {
  bg:          "#0B0F19",
  surface:     "#111827",
  surfaceHigh: "#1A2236",
  border:      "#1E2D45",
  borderLight: "#243352",
  text:        "#E8ECF3",
  muted:       "#6B7E9F",
  accent:      "#1F6FEB",
  accentSoft:  "rgba(31,111,235,0.12)",
  accentBright:"#58A6FF",
  gold:        "#F0A500",
  goldSoft:    "rgba(240,165,0,0.12)",
  green:       "#00C875",
  greenSoft:   "rgba(0,200,117,0.12)",
  purple:      "#8B5CF6",
  purpleSoft:  "rgba(139,92,246,0.12)",
  red:         "#F87171",
  redSoft:     "rgba(248,113,113,0.12)",
};

const ACCENT_COLORS = [T.accentBright, T.gold, T.green, T.purple, T.red];

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
    { name: "Figma", level: 5, category: "general" },
    { name: "User Research", level: 4, category: "general" },
    { name: "React", level: 3, category: "general" },
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
  { id: "skills",         label: "Habilidades",     icon: Sparkles },
  { id: "certifications", label: "Certificaciones", icon: Award },
  { id: "projects",       label: "Proyectos",       icon: FolderOpen },
];

export default function InteractiveCVPage() {
  const { slug } = useParams();
  const [cvData, setCvData]           = useState(null);
  const [loadingCV, setLoadingCV]     = useState(true);
  const [notFound, setNotFound]       = useState(false);
  const [activeSection, setActiveSection] = useState("profile");
  const [showExport, setShowExport]   = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!slug) { setNotFound(true); setLoadingCV(false); return; }
    getCVBySlug(slug).then(({ data }) => {
      if (data?.cv_data) {
        setCvData(data.cv_data);
        incrementCVViews(data.id);
      } else {
        setNotFound(true);
      }
      setLoadingCV(false);
    });
  }, [slug]);

  if (loadingCV) return (
    <div style={{ minHeight: "100vh", background: T.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: 40, height: 40, border: `3px solid ${T.border}`, borderTopColor: T.accentBright, borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  if (notFound) return (
    <div style={{ minHeight: "100vh", background: T.bg, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 20, padding: 24, textAlign: "center" }}>
      <div style={{ width: 72, height: 72, borderRadius: 20, background: T.surface, border: `1px solid ${T.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32 }}>🔍</div>
      <div>
        <div style={{ fontFamily: "Syne,sans-serif", fontWeight: 800, fontSize: "1.5rem", color: T.text, marginBottom: 8 }}>CV no encontrado</div>
        <div style={{ color: T.muted, fontSize: "0.9rem", maxWidth: 320, lineHeight: 1.6 }}>Este CV no existe, fue eliminado o su dueño lo despublicó.</div>
      </div>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
        <Link to="/" style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "10px 20px", borderRadius: 10, background: T.accent, color: "#fff", textDecoration: "none", fontFamily: "Syne,sans-serif", fontWeight: 700, fontSize: "0.88rem" }}>Ir al inicio</Link>
        <Link to="/auth/register" style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "10px 20px", borderRadius: 10, border: `1px solid ${T.border}`, background: "transparent", color: T.text, textDecoration: "none", fontFamily: "Syne,sans-serif", fontWeight: 700, fontSize: "0.88rem" }}>Crear mi CV gratis →</Link>
      </div>
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
    <div style={{ minHeight: "100vh", background: T.bg, display: "flex", flexDirection: "column", fontFamily: "'DM Sans', sans-serif" }}>

      {/* ── Topbar ── */}
      <header style={{
        position: "sticky", top: 0, zIndex: 50,
        background: `${T.bg}EE`,
        backdropFilter: "blur(16px)",
        borderBottom: `1px solid ${T.border}`,
        height: 58, display: "flex", alignItems: "center",
        justifyContent: "space-between", padding: "0 24px", flexShrink: 0,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button
            onClick={() => setSidebarOpen(o => !o)}
            className="sidebar-toggle"
            style={{ width: 34, height: 34, borderRadius: 8, border: `1px solid ${T.border}`, background: T.surface, display: "none", alignItems: "center", justifyContent: "center", cursor: "pointer", color: T.text }}
          >
            {sidebarOpen ? <X size={16} /> : <Menu size={16} />}
          </button>
          <Link to="/" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
            <div style={{ width: 26, height: 26, borderRadius: 7, background: T.accent, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Zap size={12} color="#fff" strokeWidth={3} />
            </div>
            <span style={{ fontFamily: "Syne,sans-serif", fontWeight: 800, fontSize: "0.92rem", color: T.muted }}>
              CV<span style={{ color: T.accentBright }}>iva</span>
            </span>
          </Link>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button
            onClick={() => setShowExport(true)}
            style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 14px", borderRadius: 8, border: `1px solid ${T.border}`, background: T.surface, color: T.muted, fontSize: "0.78rem", fontFamily: "Syne,sans-serif", fontWeight: 600, cursor: "pointer", transition: "all 0.18s" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = T.accentBright; e.currentTarget.style.color = T.accentBright; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.color = T.muted; }}
          >
            <Download size={13} /> Descargar
          </button>
          <Link to="/auth/register" style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 14px", borderRadius: 8, background: T.accent, color: "#fff", fontSize: "0.78rem", fontFamily: "Syne,sans-serif", fontWeight: 700, textDecoration: "none", transition: "opacity 0.18s" }}
            onMouseEnter={e => e.currentTarget.style.opacity = "0.85"}
            onMouseLeave={e => e.currentTarget.style.opacity = "1"}
          >
            <Globe size={13} /> Crear el mío
          </Link>
        </div>
      </header>

      <div style={{ display: "flex", flex: 1, position: "relative" }}>

        {sidebarOpen && (
          <div onClick={() => setSidebarOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 39, backdropFilter: "blur(4px)" }} />
        )}

        {/* ── Sidebar ── */}
        <aside
          className={`cv-sidebar${sidebarOpen ? " cv-sidebar-open" : ""}`}
          style={{
            width: 240, flexShrink: 0,
            borderRight: `1px solid ${T.border}`,
            background: T.surface,
            display: "flex", flexDirection: "column",
            position: "sticky", top: 58,
            height: "calc(100vh - 58px)", overflowY: "auto",
          }}
        >
          {/* Perfil del sidebar */}
          <div style={{ padding: "28px 20px 22px", borderBottom: `1px solid ${T.border}`, display: "flex", flexDirection: "column", alignItems: "center", gap: 14, textAlign: "center" }}>
            {cvData.photo ? (
              <div style={{ position: "relative", display: "inline-block" }}>
                <img
                  src={cvData.photo} alt={cvData.name}
                  style={{ width: 80, height: 80, borderRadius: "50%", objectFit: "cover", border: `3px solid ${T.border}`, display: "block" }}
                />
                <div style={{ position: "absolute", inset: -3, borderRadius: "50%", border: `2px solid ${T.accent}`, opacity: 0.5 }} />
              </div>
            ) : (
              <div style={{
                width: 80, height: 80, borderRadius: "50%",
                background: `linear-gradient(135deg, ${T.accent}, ${T.purple})`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: "Syne,sans-serif", fontWeight: 800, fontSize: "1.5rem", color: "#fff",
                border: `3px solid ${T.surfaceHigh}`,
                boxShadow: `0 0 0 2px ${T.accent}44`,
              }}>
                {initials}
              </div>
            )}
            <div>
              <div style={{ fontFamily: "Syne,sans-serif", fontWeight: 800, fontSize: "0.9rem", color: T.text, lineHeight: 1.25, marginBottom: 4 }}>
                {cvData.name}
              </div>
              <div style={{ fontSize: "0.72rem", color: T.accentBright, fontFamily: "Syne,sans-serif", fontWeight: 600 }}>
                {cvData.role}
              </div>
            </div>
          </div>

          {/* Navegación */}
          <nav style={{ flex: 1, padding: "14px 10px" }}>
            {allSections.map(({ id, label, icon: Icon }) => {
              const active = activeSection === id;
              return (
                <button
                  key={id}
                  onClick={() => { setActiveSection(id); setSidebarOpen(false); }}
                  style={{
                    width: "100%", display: "flex", alignItems: "center", gap: 10,
                    padding: "10px 14px", borderRadius: 10, border: "none", cursor: "pointer",
                    background: active ? T.accentSoft : "transparent",
                    color: active ? T.accentBright : T.muted,
                    fontFamily: "Syne,sans-serif", fontWeight: 600, fontSize: "0.82rem",
                    marginBottom: 2, textAlign: "left", position: "relative", transition: "all 0.18s",
                  }}
                  onMouseEnter={e => { if (!active) { e.currentTarget.style.background = T.surfaceHigh; e.currentTarget.style.color = T.text; } }}
                  onMouseLeave={e => { if (!active) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = T.muted; } }}
                >
                  {active && (
                    <div style={{ position: "absolute", left: 0, top: "50%", transform: "translateY(-50%)", width: 3, height: 20, background: T.accentBright, borderRadius: "0 3px 3px 0" }} />
                  )}
                  <Icon size={15} />
                  {label}
                </button>
              );
            })}
          </nav>

          {/* Contacto */}
          <div style={{ padding: "16px 18px", borderTop: `1px solid ${T.border}`, display: "flex", flexDirection: "column", gap: 9 }}>
            {cvData.email    && <ContactRow icon={Mail}     text={cvData.email} />}
            {cvData.phone    && <ContactRow icon={Phone}    text={cvData.phone} />}
            {cvData.location && <ContactRow icon={MapPin}   text={cvData.location} />}
            {cvData.linkedin && <ContactRow icon={Linkedin} text="LinkedIn"  href={safeUrl(cvData.linkedin)}  accent />}
            {cvData.github   && <ContactRow icon={Github}   text="GitHub"    href={safeUrl(cvData.github)}    accent />}
            {cvData.portfolio && <ContactRow icon={Globe}   text="Portfolio" href={safeUrl(cvData.portfolio)} accent />}
          </div>
        </aside>

        {/* ── Main ── */}
        <main id="cv-preview" style={{ flex: 1, padding: "32px 28px", overflowY: "auto", minWidth: 0, background: T.bg }}>

          {/* PERFIL */}
          {activeSection === "profile" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 20, maxWidth: 760 }}>

              {/* Hero card */}
              <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 20, overflow: "hidden" }}>
                {/* Banner */}
                <div style={{
                  padding: "36px 32px",
                  background: `linear-gradient(135deg, #0D1F44 0%, #0B1929 50%, #0D1117 100%)`,
                  position: "relative", overflow: "hidden",
                }}>
                  {/* Grid sutil */}
                  <div style={{ position: "absolute", inset: 0, backgroundImage: `linear-gradient(${T.border}44 1px, transparent 1px), linear-gradient(90deg, ${T.border}44 1px, transparent 1px)`, backgroundSize: "32px 32px", pointerEvents: "none" }} />
                  {/* Glow accent */}
                  <div style={{ position: "absolute", top: -60, right: -60, width: 240, height: 240, borderRadius: "50%", background: `radial-gradient(circle, ${T.accent}22 0%, transparent 70%)`, pointerEvents: "none" }} />

                  <div style={{ position: "relative", display: "flex", alignItems: "center", gap: 24, flexWrap: "wrap" }}>
                    {cvData.photo ? (
                      <img
                        src={cvData.photo} alt={cvData.name}
                        style={{ width: 88, height: 88, borderRadius: "50%", objectFit: "cover", border: `3px solid ${T.border}`, boxShadow: `0 0 0 3px ${T.accent}55`, flexShrink: 0 }}
                      />
                    ) : (
                      <div style={{
                        width: 88, height: 88, borderRadius: "50%", flexShrink: 0,
                        background: `linear-gradient(135deg, ${T.accent}, ${T.purple})`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontFamily: "Syne,sans-serif", fontWeight: 800, fontSize: "2rem", color: "#fff",
                        boxShadow: `0 0 0 3px ${T.accent}44`,
                      }}>
                        {initials}
                      </div>
                    )}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <h1 style={{ fontFamily: "Syne,sans-serif", fontWeight: 800, fontSize: "clamp(1.5rem,3.5vw,2.2rem)", color: T.text, margin: 0, letterSpacing: "-0.03em", lineHeight: 1.1 }}>
                        {cvData.name}
                      </h1>
                      <div style={{ fontSize: "0.95rem", color: T.accentBright, marginTop: 8, fontFamily: "Syne,sans-serif", fontWeight: 600 }}>
                        {cvData.role}
                      </div>
                      {/* Tags de contacto rápido */}
                      <div style={{ display: "flex", gap: 8, marginTop: 14, flexWrap: "wrap" }}>
                        {cvData.location && (
                          <span style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "4px 10px", borderRadius: 100, background: T.surfaceHigh, border: `1px solid ${T.borderLight}`, fontSize: "0.72rem", color: T.muted }}>
                            <MapPin size={10} /> {cvData.location}
                          </span>
                        )}
                        {cvData.linkedin && safeUrl(cvData.linkedin) && (
                          <a href={safeUrl(cvData.linkedin)} target="_blank" rel="noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "4px 10px", borderRadius: 100, background: T.accentSoft, border: `1px solid ${T.accent}44`, fontSize: "0.72rem", color: T.accentBright, textDecoration: "none" }}>
                            <Linkedin size={10} /> LinkedIn
                          </a>
                        )}
                        {cvData.github && safeUrl(cvData.github) && (
                          <a href={safeUrl(cvData.github)} target="_blank" rel="noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "4px 10px", borderRadius: 100, background: T.surfaceHigh, border: `1px solid ${T.borderLight}`, fontSize: "0.72rem", color: T.muted, textDecoration: "none" }}>
                            <Github size={10} /> GitHub
                          </a>
                        )}
                        {cvData.portfolio && safeUrl(cvData.portfolio) && (
                          <a href={safeUrl(cvData.portfolio)} target="_blank" rel="noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "4px 10px", borderRadius: 100, background: T.surfaceHigh, border: `1px solid ${T.borderLight}`, fontSize: "0.72rem", color: T.muted, textDecoration: "none" }}>
                            <Globe size={10} /> Portfolio
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Resumen */}
                {cvData.summary && (
                  <div style={{ padding: "22px 32px", borderTop: `1px solid ${T.border}` }}>
                    <div style={{ fontSize: "0.7rem", fontFamily: "Syne,sans-serif", fontWeight: 700, color: T.accentBright, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 10 }}>
                      Perfil profesional
                    </div>
                    <p style={{ fontSize: "0.92rem", color: T.muted, lineHeight: 1.8, margin: 0 }}>
                      {cvData.summary}
                    </p>
                  </div>
                )}
              </div>

              {/* Stats */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: 12 }}>
                {[
                  { label: "Experiencias",   value: cvData.experience?.length    || 0, color: T.accentBright, soft: T.accentSoft },
                  { label: "Educación",      value: cvData.education?.length     || 0, color: T.gold,        soft: T.goldSoft },
                  { label: "Habilidades",    value: cvData.skills?.length        || 0, color: T.purple,      soft: T.purpleSoft },
                  ...(cvData.certifications?.length > 0 ? [{ label: "Certificaciones", value: cvData.certifications.length, color: T.green, soft: T.greenSoft }] : []),
                  ...(cvData.projects?.length       > 0 ? [{ label: "Proyectos",       value: cvData.projects.length,       color: T.red,   soft: T.redSoft   }] : []),
                ].map(({ label, value, color, soft }) => (
                  <div key={label} style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 14, padding: "18px 14px", textAlign: "center", position: "relative", overflow: "hidden" }}>
                    <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 3, background: color }} />
                    <div style={{ fontFamily: "Syne,sans-serif", fontWeight: 800, fontSize: "2.2rem", color, lineHeight: 1, marginBottom: 6 }}>
                      {value}
                    </div>
                    <div style={{ fontSize: "0.72rem", color: T.muted, fontFamily: "Syne,sans-serif", fontWeight: 600 }}>
                      {label}
                    </div>
                  </div>
                ))}
              </div>

              {/* Idiomas */}
              {cvData.languages?.length > 0 && (
                <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 16, padding: "22px 26px" }}>
                  <SectionLabel>Idiomas</SectionLabel>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 14 }}>
                    {cvData.languages.map((lang, i) => (
                      <div key={i} style={{ padding: "10px 18px", borderRadius: 12, background: T.surfaceHigh, border: `1px solid ${T.borderLight}`, display: "flex", flexDirection: "column", alignItems: "center", gap: 4, minWidth: 100 }}>
                        <span style={{ fontFamily: "Syne,sans-serif", fontWeight: 700, fontSize: "0.88rem", color: T.text }}>{lang.name}</span>
                        <span style={{ fontSize: "0.68rem", color: T.accentBright, fontFamily: "Syne,sans-serif", fontWeight: 600 }}>{lang.level}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* EXPERIENCIA */}
          {activeSection === "experience" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 760 }}>
              <SectionTitle color={T.accentBright}>Experiencia Laboral</SectionTitle>
              {cvData.experience?.map((exp, i) => {
                const color = ACCENT_COLORS[i % ACCENT_COLORS.length];
                return (
                  <div key={exp.id} style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 16, overflow: "hidden", transition: "border-color 0.2s" }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = `${color}66`}
                    onMouseLeave={e => e.currentTarget.style.borderColor = T.border}
                  >
                    <div style={{ borderLeft: `3px solid ${color}`, padding: "22px 26px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 10, marginBottom: 12 }}>
                        <div>
                          <div style={{ fontFamily: "Syne,sans-serif", fontWeight: 800, fontSize: "1.02rem", color: T.text }}>{exp.role}</div>
                          <div style={{ fontSize: "0.85rem", color, fontFamily: "Syne,sans-serif", fontWeight: 600, marginTop: 3 }}>{exp.company}</div>
                        </div>
                        <span style={{ fontSize: "0.72rem", color: T.muted, background: T.surfaceHigh, padding: "4px 12px", borderRadius: 100, border: `1px solid ${T.borderLight}`, height: "fit-content", whiteSpace: "nowrap" }}>
                          {exp.period}
                        </span>
                      </div>
                      {exp.description && (
                        <p style={{ fontSize: "0.87rem", color: T.muted, margin: "0 0 12px", lineHeight: 1.72 }}>{exp.description}</p>
                      )}
                      {exp.responsibilities?.filter(r => r).length > 0 && (
                        <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 7 }}>
                          {exp.responsibilities.filter(r => r).map((resp, j) => (
                            <li key={j} style={{ display: "flex", gap: 10, fontSize: "0.84rem", color: T.muted, alignItems: "flex-start" }}>
                              <span style={{ color, fontWeight: 700, marginTop: 1, flexShrink: 0 }}>▸</span>
                              {resp}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* EDUCACIÓN */}
          {activeSection === "education" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 760 }}>
              <SectionTitle color={T.gold}>Educación</SectionTitle>
              {cvData.education?.map((edu, i) => {
                const color = ACCENT_COLORS[i % ACCENT_COLORS.length];
                return (
                  <div key={edu.id} style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 16, overflow: "hidden" }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = `${color}66`}
                    onMouseLeave={e => e.currentTarget.style.borderColor = T.border}
                  >
                    <div style={{ borderLeft: `3px solid ${color}`, padding: "22px 26px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
                        <div>
                          <div style={{ fontFamily: "Syne,sans-serif", fontWeight: 800, fontSize: "1.02rem", color: T.text }}>{edu.degree}</div>
                          <div style={{ fontSize: "0.85rem", color, fontFamily: "Syne,sans-serif", fontWeight: 600, marginTop: 3 }}>{edu.institution}</div>
                        </div>
                        <span style={{ fontSize: "0.72rem", color: T.muted, background: T.surfaceHigh, padding: "4px 12px", borderRadius: 100, border: `1px solid ${T.borderLight}`, height: "fit-content", whiteSpace: "nowrap" }}>
                          {edu.period}
                        </span>
                      </div>
                      {edu.description && (
                        <p style={{ fontSize: "0.84rem", color: T.muted, margin: "12px 0 0", lineHeight: 1.65 }}>{edu.description}</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* HABILIDADES */}
          {activeSection === "skills" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 22, maxWidth: 760 }}>
              <SectionTitle color={T.purple}>Habilidades</SectionTitle>
              {["general", "soft"].map(cat => {
                // Acepta "general" (valor nuevo) y "technical" (valor usado antes
                // de este cambio, para no romper CVs ya guardados con ese nombre).
                const filtered = cvData.skills?.filter(s =>
                  cat === "general"
                    ? (s.category === "general" || s.category === "technical" || !s.category)
                    : s.category === cat
                );
                if (!filtered?.length) return null;
                return (
                  <div key={cat}>
                    <div style={{ fontSize: "0.7rem", fontFamily: "Syne,sans-serif", fontWeight: 700, color: T.muted, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 14 }}>
                      {cat === "general" ? "Habilidades" : "Blandas"}
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(190px, 1fr))", gap: 12 }}>
                      {filtered.map((skill, i) => {
                        const isGeneral = cat === "general";
                        const color  = isGeneral ? T.accentBright : T.purple;
                        const level  = skill.level || 0;
                        return (
                          <div key={i} style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 14, padding: "16px 18px", transition: "border-color 0.18s" }}
                            onMouseEnter={e => e.currentTarget.style.borderColor = `${color}66`}
                            onMouseLeave={e => e.currentTarget.style.borderColor = T.border}
                          >
                            <div style={{ fontFamily: "Syne,sans-serif", fontWeight: 700, fontSize: "0.88rem", color: T.text, marginBottom: skill.description ? 4 : 10 }}>
                              {typeof skill === "string" ? skill : skill.name}
                            </div>
                            {skill.description && (
                              <div style={{ fontSize: "0.72rem", color: T.muted, marginBottom: 10, lineHeight: 1.5 }}>{skill.description}</div>
                            )}
                            {level > 0 && (
                              <div style={{ display: "flex", gap: 4 }}>
                                {[1,2,3,4,5].map(n => (
                                  <div key={n} style={{ flex: 1, height: 4, borderRadius: 100, background: n <= level ? color : T.borderLight, transition: "background 0.2s" }} />
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
              {cvData.skills?.every(s => !s.category) && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                  {cvData.skills.map((skill, i) => (
                    <span key={i} style={{ padding: "8px 16px", borderRadius: 100, background: T.accentSoft, color: T.accentBright, fontFamily: "Syne,sans-serif", fontWeight: 700, fontSize: "0.82rem", border: `1px solid ${T.accent}44` }}>
                      {typeof skill === "string" ? skill : skill.name}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* CERTIFICACIONES */}
          {activeSection === "certifications" && cvData.certifications?.length > 0 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 760 }}>
              <SectionTitle color={T.green}>Certificaciones</SectionTitle>
              {cvData.certifications.map((cert, i) => (
                <div key={cert.id || i} style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 16, padding: "20px 24px", display: "flex", gap: 16, alignItems: "flex-start" }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: T.greenSoft, border: `1px solid ${T.green}44`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Award size={18} color={T.green} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: "Syne,sans-serif", fontWeight: 700, fontSize: "0.95rem", color: T.text, marginBottom: 3 }}>{cert.name}</div>
                    <div style={{ fontSize: "0.8rem", color: T.green, fontFamily: "Syne,sans-serif", fontWeight: 600, marginBottom: cert.period ? 3 : 0 }}>{cert.institution}</div>
                    {cert.period && <div style={{ fontSize: "0.72rem", color: T.muted }}>{cert.period}</div>}
                    {cert.description && <p style={{ fontSize: "0.82rem", color: T.muted, margin: "8px 0 0", lineHeight: 1.6 }}>{cert.description}</p>}
                  </div>
                  {cert.url && safeUrl(cert.url) && (
                    <a href={safeUrl(cert.url)} target="_blank" rel="noreferrer" style={{ color: T.accentBright, flexShrink: 0 }}>
                      <ExternalLink size={15} />
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* PROYECTOS */}
          {activeSection === "projects" && cvData.projects?.length > 0 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 760 }}>
              <SectionTitle color={T.red}>Proyectos</SectionTitle>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(290px, 1fr))", gap: 16 }}>
                {cvData.projects.map((proj, i) => {
                  const color = ACCENT_COLORS[i % ACCENT_COLORS.length];
                  return (
                    <div key={proj.id || i} style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 16, padding: "20px 22px", position: "relative", overflow: "hidden", transition: "border-color 0.2s" }}
                      onMouseEnter={e => e.currentTarget.style.borderColor = `${color}66`}
                      onMouseLeave={e => e.currentTarget.style.borderColor = T.border}
                    >
                      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: color }} />
                      <div style={{ fontFamily: "Syne,sans-serif", fontWeight: 800, fontSize: "0.95rem", color: T.text, marginBottom: 5 }}>{proj.title}</div>
                      {proj.role && <div style={{ fontSize: "0.75rem", color, fontFamily: "Syne,sans-serif", fontWeight: 600, marginBottom: 10 }}>{proj.role}</div>}
                      <p style={{ fontSize: "0.82rem", color: T.muted, margin: "0 0 14px", lineHeight: 1.65 }}>{proj.description}</p>
                      {proj.technologies?.length > 0 && (
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                          {proj.technologies.map((tech, j) => (
                            <span key={j} style={{ fontSize: "0.68rem", padding: "3px 9px", borderRadius: 100, background: T.surfaceHigh, color: T.muted, border: `1px solid ${T.borderLight}`, fontFamily: "Syne,sans-serif", fontWeight: 600 }}>{tech}</span>
                          ))}
                        </div>
                      )}
                      {proj.url && safeUrl(proj.url) && (
                        <a href={safeUrl(proj.url)} target="_blank" rel="noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 5, marginTop: 14, fontSize: "0.75rem", color, textDecoration: "none", fontFamily: "Syne,sans-serif", fontWeight: 600 }}>
                          <ExternalLink size={12} /> Ver proyecto
                        </a>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* SECCIONES EXTRA */}
          {cvData.extraSections?.map(section => (
            activeSection === section.id && (
              <div key={section.id} style={{ display: "flex", flexDirection: "column", gap: 14, maxWidth: 760 }}>
                <SectionTitle color={T.accentBright}>{section.title}</SectionTitle>
                {section.items?.map((item, i) => (
                  <div key={i} style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 14, padding: "18px 22px" }}>
                    {item.title    && <div style={{ fontFamily: "Syne,sans-serif", fontWeight: 700, fontSize: "0.92rem", color: T.text, marginBottom: 5 }}>{item.title}</div>}
                    {item.subtitle && <div style={{ fontSize: "0.78rem", color: T.accentBright, fontFamily: "Syne,sans-serif", fontWeight: 600, marginBottom: 7 }}>{item.subtitle}</div>}
                    {item.description && <p style={{ fontSize: "0.84rem", color: T.muted, margin: 0, lineHeight: 1.65 }}>{item.description}</p>}
                  </div>
                ))}
              </div>
            )
          ))}

          {/* CTA */}
          <div style={{
            marginTop: 36, maxWidth: 760,
            padding: "24px 28px",
            background: `linear-gradient(135deg, ${T.accentSoft}, ${T.surface})`,
            border: `1px solid ${T.accent}44`,
            borderRadius: 18,
            display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 14,
          }}>
            <div>
              <div style={{ fontFamily: "Syne,sans-serif", fontWeight: 800, fontSize: "0.95rem", color: T.text, marginBottom: 4 }}>¿Quieres un CV como este?</div>
              <div style={{ fontSize: "0.82rem", color: T.muted }}>Crea el tuyo gratis en CViva en minutos.</div>
            </div>
            <Link to="/auth/register" style={{ display: "inline-flex", alignItems: "center", gap: 7, background: T.accent, color: "#fff", padding: "10px 20px", borderRadius: 10, textDecoration: "none", fontFamily: "Syne,sans-serif", fontWeight: 700, fontSize: "0.85rem", flexShrink: 0, transition: "opacity 0.18s" }}
              onMouseEnter={e => e.currentTarget.style.opacity = "0.85"}
              onMouseLeave={e => e.currentTarget.style.opacity = "1"}
            >
              Crear mi CV gratis →
            </Link>
          </div>
        </main>
      </div>

      <ExportModal isOpen={showExport} onClose={() => setShowExport(false)} cvData={cvData} previewElementId="cv-preview" />

      <style>{`
        body { background: ${T.bg} !important; }
        @media (max-width: 768px) {
          .sidebar-toggle { display: flex !important; }
          .cv-sidebar {
            position: fixed !important; top: 58px !important; left: 0 !important;
            height: calc(100vh - 58px) !important; z-index: 40;
            transform: translateX(-100%);
            transition: transform 0.28s cubic-bezier(.4,0,.2,1);
          }
          .cv-sidebar.cv-sidebar-open { transform: translateX(0) !important; }
        }
      `}</style>
    </div>
  );
}

function SectionTitle({ children, color }) {
  return (
    <div style={{ marginBottom: 4 }}>
      <div style={{ fontFamily: "Syne,sans-serif", fontWeight: 800, fontSize: "1.15rem", color: "#E8ECF3", display: "inline-block", paddingBottom: 10, borderBottom: `2px solid ${color || "#1F6FEB"}` }}>
        {children}
      </div>
    </div>
  );
}

function SectionLabel({ children }) {
  return (
    <div style={{ fontSize: "0.7rem", fontFamily: "Syne,sans-serif", fontWeight: 700, color: "#58A6FF", letterSpacing: "0.12em", textTransform: "uppercase" }}>
      {children}
    </div>
  );
}

function ContactRow({ icon: Icon, text, href, accent }) {
  const color = accent ? "#58A6FF" : "#6B7E9F";
  const content = (
    <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "0.72rem", color, overflow: "hidden" }}>
      <Icon size={12} style={{ flexShrink: 0, color: accent ? "#58A6FF" : "#6B7E9F" }} />
      <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{text}</span>
    </div>
  );
  if (href) return <a href={href} target="_blank" rel="noreferrer" style={{ textDecoration: "none" }}>{content}</a>;
  return content;
}
import { useState } from "react";
import { Filter, Download, FileText, ArrowRight, Play } from "lucide-react";

const demoProfiles = [
  { name: "Laura Jiménez", role: "Asesora comercial", location: "Bogotá, CO", skills: ["Atención al cliente", "Negociación", "CRM", "Ventas B2B"], experience: "4 años", accent: "#FFD166" },
  { name: "Andrés Torres", role: "Auxiliar de enfermería", location: "Cali, CO", skills: ["Cuidado de pacientes", "Primeros auxilios", "Trabajo en equipo", "Signos vitales"], experience: "5 años", accent: "#C77DFF" },
  { name: "Carlos Méndez", role: "Desarrollador Full Stack", location: "Medellín, CO", skills: ["React", "Node.js", "PostgreSQL", "AWS"], experience: "6 años", accent: "#00E5FF" },
];

const DemoCard = ({ profile }) => {
  const [active, setActive] = useState(0);
  return (
    <div className="card" style={{ overflow: "hidden", position: "relative" }}>
      <div style={{ height: 4, background: profile.accent, position: "absolute", top: 0, left: 0, right: 0 }} />
      <div style={{ padding: "28px 24px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
          <div style={{ width: 46, height: 46, borderRadius: "50%", background: profile.accent + "22", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontFamily: "Syne, sans-serif", fontWeight: 800, fontSize: "1rem", color: profile.accent }}>
              {profile.name.split(" ").map(n => n[0]).join("")}
            </span>
          </div>
          <div>
            <div style={{ fontFamily: "Syne, sans-serif", fontWeight: 800, fontSize: "0.95rem" }}>{profile.name}</div>
            <div style={{ fontSize: "0.75rem", color: "var(--muted)", marginTop: 2 }}>{profile.role} · {profile.location}</div>
          </div>
          <div style={{ marginLeft: "auto", fontSize: "0.72rem", color: "var(--muted)", background: "var(--surface-high)", padding: "4px 10px", borderRadius: 100, border: "1px solid var(--border)" }}>
            {profile.experience}
          </div>
        </div>
        <div style={{ marginBottom: 18 }}>
          <div style={{ fontSize: "0.72rem", color: "var(--muted)", marginBottom: 8, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>Filtrar por habilidad</div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {profile.skills.map((s, i) => (
              <button key={s} onClick={() => setActive(i)} style={{ padding: "5px 12px", borderRadius: 100, fontSize: "0.72rem", fontWeight: 700, cursor: "pointer", fontFamily: "Syne, sans-serif", letterSpacing: "0.04em", border: "1px solid", borderColor: active === i ? profile.accent : "var(--border)", background: active === i ? profile.accent + "18" : "transparent", color: active === i ? profile.accent : "var(--muted)", transition: "all 0.18s" }}>
                {s}
              </button>
            ))}
          </div>
        </div>
        <div style={{ background: "var(--surface-high)", borderRadius: 12, padding: "14px 16px", marginBottom: 16 }}>
          <div style={{ fontSize: "0.72rem", color: "var(--muted)", marginBottom: 10, fontWeight: 600, display: "flex", alignItems: "center", gap: 5 }}>
            <Filter size={10} /> Mostrando experiencia con {profile.skills[active]}
          </div>
          {[...Array(2)].map((_, i) => (
            <div key={i} style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: i === 0 ? 8 : 0 }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: profile.accent, flexShrink: 0 }} />
              <div style={{ height: 8, background: "var(--border)", borderRadius: 4, flex: 1, opacity: 0.6 + i * 0.2 }} />
            </div>
          ))}
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button style={{ flex: 1, padding: "8px", borderRadius: 8, border: "1px solid var(--border)", background: "transparent", color: "var(--muted)", fontSize: "0.72rem", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 4, fontFamily: "Syne, sans-serif", fontWeight: 600 }}>
            <Download size={11} /> PDF
          </button>
          <button style={{ flex: 1, padding: "8px", borderRadius: 8, border: "1px solid var(--border)", background: "transparent", color: "var(--muted)", fontSize: "0.72rem", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 4, fontFamily: "Syne, sans-serif", fontWeight: 600 }}>
            <FileText size={11} /> Word
          </button>
          <button style={{ flex: 2, padding: "8px", borderRadius: 8, background: profile.accent, color: "#000", fontSize: "0.72rem", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 4, fontFamily: "Syne, sans-serif", fontWeight: 700, border: "none" }}>
            Ver CV <ArrowRight size={11} />
          </button>
        </div>
      </div>
    </div>
  );
};

const Demo = () => (
  <section id="demo" style={{ padding: "100px 24px", background: "var(--surface)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
    <div style={{ maxWidth: 1180, margin: "0 auto" }}>
      <div style={{ textAlign: "center", marginBottom: 60 }}>
        <span className="tag"><Play size={10} /> Demo interactivo</span>
        <h2 style={{ fontSize: "clamp(2rem, 3.5vw, 3rem)", marginTop: 20, letterSpacing: "-0.03em" }}>CVs que hablan por ti</h2>
        <p style={{ color: "var(--muted)", marginTop: 16 }}>Haz clic en las habilidades para ver el filtrado en acción.</p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24 }}>
        {demoProfiles.map((p, i) => <DemoCard key={i} profile={p} />)}
      </div>
    </div>
  </section>
);

export default Demo;
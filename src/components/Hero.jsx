import { ArrowRight, Play, Star, Sparkles, Filter, Download, FileText, Globe } from "lucide-react";

const CVMockup = () => (
  <div style={{ width: "100%", maxWidth: 400, background: "var(--surface)", borderRadius: 20, border: "1px solid var(--border)", overflow: "hidden", boxShadow: "0 40px 80px rgba(0,0,0,0.4), var(--accent-glow)" }}>
    <div style={{ background: "var(--accent)", padding: "20px 24px", display: "flex", alignItems: "center", gap: 14 }}>
      <div style={{ width: 52, height: 52, borderRadius: "50%", background: "rgba(0,0,0,0.2)", border: "2px solid rgba(255,255,255,0.3)" }} />
      <div>
        <div style={{ fontFamily: "Syne, sans-serif", fontWeight: 800, fontSize: "1.05rem", color: "#000" }}>María Rodríguez</div>
        <div style={{ fontSize: "0.78rem", color: "rgba(0,0,0,0.65)", marginTop: 2 }}>Senior UX Designer · Bogotá</div>
      </div>
    </div>
    <div style={{ padding: "14px 20px", borderBottom: "1px solid var(--border)", display: "flex", gap: 6, flexWrap: "wrap" }}>
      {["Figma", "React", "Design Systems", "Motion"].map((s, i) => (
        <span key={s} style={{ fontSize: "0.7rem", fontWeight: 600, padding: "4px 10px", borderRadius: 100, background: i === 0 ? "var(--accent)" : "var(--surface-high)", color: i === 0 ? "#000" : "var(--muted)", border: "1px solid var(--border)", cursor: "pointer", fontFamily: "Syne, sans-serif", letterSpacing: "0.04em" }}>
          {s}
        </span>
      ))}
      <span style={{ fontSize: "0.7rem", color: "var(--accent)", fontWeight: 600, display: "flex", alignItems: "center", gap: 3, cursor: "pointer" }}>
        <Filter size={11} /> Filtrar
      </span>
    </div>
    <div style={{ padding: "16px 20px", display: "flex", flexDirection: "column", gap: 14 }}>
      {[
        { role: "Lead Designer", company: "TechCorp", period: "2022–Pres.", color: "#00E5FF" },
        { role: "UX Designer", company: "StartupXYZ", period: "2020–2022", color: "#FFD166" },
        { role: "Visual Designer", company: "Agency Co", period: "2018–2020", color: "#FF6B6B" },
      ].map(exp => (
        <div key={exp.role} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: exp.color, marginTop: 6, flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: "0.82rem", color: "var(--text)" }}>{exp.role}</div>
            <div style={{ fontSize: "0.72rem", color: "var(--muted)", marginTop: 1 }}>{exp.company} · {exp.period}</div>
          </div>
        </div>
      ))}
    </div>
    <div style={{ padding: "12px 20px 18px", borderTop: "1px solid var(--border)", display: "flex", gap: 8 }}>
      <button style={{ flex: 1, padding: "9px", borderRadius: 9, border: "1px solid var(--border)", background: "var(--surface-high)", color: "var(--muted)", fontSize: "0.75rem", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 5, fontFamily: "Syne, sans-serif", fontWeight: 600 }}>
        <Download size={13} /> PDF
      </button>
      <button style={{ flex: 1, padding: "9px", borderRadius: 9, border: "1px solid var(--border)", background: "var(--surface-high)", color: "var(--muted)", fontSize: "0.75rem", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 5, fontFamily: "Syne, sans-serif", fontWeight: 600 }}>
        <FileText size={13} /> Word
      </button>
      <button style={{ flex: 2, padding: "9px", borderRadius: 9, background: "var(--accent)", color: "#000", fontSize: "0.75rem", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 5, fontFamily: "Syne, sans-serif", fontWeight: 700, border: "none" }}>
        <Globe size={13} /> Compartir
      </button>
    </div>
  </div>
);

const Hero = () => (
  <section id="hero" style={{ position: "relative", overflow: "hidden", padding: "140px 24px 100px", minHeight: "100vh", display: "flex", alignItems: "center" }}>
    <div className="grid-bg" style={{ position: "absolute", inset: 0, opacity: 0.35 }} />
    <div className="hero-deco hero-deco-top" style={{ position: "absolute", top: "15%", left: "10%", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, color-mix(in srgb, var(--accent) 18%, transparent), transparent 70%)", filter: "blur(60px)", pointerEvents: "none" }} />
    <div className="hero-deco hero-deco-bottom" style={{ position: "absolute", bottom: "10%", right: "8%", width: 380, height: 380, borderRadius: "50%", background: "radial-gradient(circle, color-mix(in srgb, var(--gold) 12%, transparent), transparent 70%)", filter: "blur(60px)", pointerEvents: "none" }} />
    <div className="hero-grid" style={{ maxWidth: 1180, margin: "0 auto", width: "100%", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "center" }}>
      <div>
        <div className="fade-up d1">
          <span className="tag"><Sparkles size={10} /> Launching MVP</span>
        </div>
        <h1 className="fade-up d2" style={{ fontSize: "clamp(2.8rem, 5vw, 4.2rem)", marginTop: 24, marginBottom: 24, letterSpacing: "-0.03em" }}>
          Tu CV merece ser{" "}
          <span className="shimmer-text">inolvidable</span>
        </h1>
        <p className="fade-up d3" style={{ fontSize: "1.15rem", color: "var(--muted)", maxWidth: 460, lineHeight: 1.7, marginBottom: 40 }}>
          Transforma tu hoja de vida estática en un CV interactivo, filtrable y descargable. Conecta con reclutadores de forma única.
        </p>
        <div className="fade-up d4 hero-cta" style={{ display: "flex", gap: 14, flexWrap: "wrap", justifyContent: "flex-start" }}>
          <a href="#pricing" className="btn-primary">Crear mi CV <ArrowRight size={16} /></a>
          <a href="#demo" className="btn-ghost"><Play size={15} fill="currentColor" /> Ver demo</a>
        </div>
        <div className="fade-up d5" style={{ marginTop: 48, display: "flex", alignItems: "center", gap: 20 }}>
          <div style={{ display: "flex" }}>
            {["#0E7DFF", "#FF6B6B", "#00E5A0", "#FFD166"].map((c, i) => (
              <div key={i} style={{ width: 34, height: 34, borderRadius: "50%", background: c, border: "2px solid var(--bg)", marginLeft: i === 0 ? 0 : -10 }} />
            ))}
          </div>
          <div>
            <div style={{ display: "flex", gap: 2, marginBottom: 3 }}>
              {[...Array(5)].map((_, i) => <Star key={i} size={13} fill="var(--gold)" color="var(--gold)" />)}
            </div>
            <span style={{ fontSize: "0.82rem", color: "var(--muted)" }}>+2,400 profesionales confían en CViva</span>
          </div>
        </div>
      </div>
      <div className="float-anim" style={{ position: "relative", display: "flex", justifyContent: "center" }}>
        <CVMockup />
      </div>
    </div>
  </section>
);

export default Hero;

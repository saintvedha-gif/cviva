import { Zap, Star } from "lucide-react";
import { Link } from "react-router-dom";

const AuthLayout = ({ children, title, subtitle }) => (
  <div style={{ minHeight: "100vh", display: "flex", background: "var(--bg)", position: "relative", overflow: "hidden" }}>

    {/* ── Left panel: branding (desktop only) ── */}
    <div className="auth-left" style={{
      display: "none", flex: "0 0 460px",
      background: "var(--surface)", borderRight: "1px solid var(--border)",
      padding: "48px", flexDirection: "column", justifyContent: "space-between",
      position: "relative", overflow: "hidden",
    }}>
      <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)", backgroundSize: "48px 48px", opacity: 0.35 }} />
      <div style={{ position: "absolute", bottom: "-10%", left: "20%", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, color-mix(in srgb, var(--accent) 20%, transparent), transparent 70%)", filter: "blur(60px)", pointerEvents: "none" }} />

      {/* Logo */}
      <Link to="/" style={{ position: "relative", display: "flex", alignItems: "center", gap: 12, textDecoration: "none" }}>
        <div style={{ width: 40, height: 40, borderRadius: 12, background: "var(--accent)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Zap size={20} color="#000" strokeWidth={3} />
        </div>
        <span style={{ fontFamily: "Syne, sans-serif", fontWeight: 800, fontSize: "1.35rem", color: "var(--text)" }}>
          CV<span style={{ color: "var(--accent)" }}>iva</span>
        </span>
      </Link>

      {/* Testimonial desktop — orden: persona → estrellas → frase → stats */}
      <div style={{ position: "relative" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
          <div style={{ width: 44, height: 44, borderRadius: "50%", background: "linear-gradient(135deg, #00E5FF, #0062FF)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Syne, sans-serif", fontWeight: 800, color: "#000", fontSize: "0.9rem", flexShrink: 0 }}>JM</div>
          <div>
            <div style={{ fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: "0.9rem", color: "var(--text)" }}>Juliana Morales</div>
            <div style={{ fontSize: "0.78rem", color: "var(--muted)" }}>Product Designer · Medellín</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 2, marginBottom: 16 }}>
          {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="var(--gold)" color="var(--gold)" />)}
        </div>
        <div style={{ fontSize: "1.4rem", fontFamily: "Syne, sans-serif", fontWeight: 700, color: "var(--text)", lineHeight: 1.45, marginBottom: 28 }}>
          "Conseguí 3 entrevistas en una semana. Mi CV nunca había tenido tanto impacto."
        </div>
        <div style={{ display: "flex", gap: 24, marginTop: 36, paddingTop: 28, borderTop: "1px solid var(--border)" }}>
          {[["2,400+", "Usuarios"], ["3×", "Más entrevistas"], ["< 5min", "Para publicar"]].map(([val, label]) => (
            <div key={label}>
              <div style={{ fontFamily: "Syne, sans-serif", fontWeight: 800, fontSize: "1.3rem", color: "var(--accent)", letterSpacing: "-0.04em" }}>{val}</div>
              <div style={{ fontSize: "0.72rem", color: "var(--muted)", marginTop: 2 }}>{label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* ── Right panel: form ── */}
    <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-start", padding: "0 16px 40px", overflowY: "auto", position: "relative" }}>
      <div style={{ position: "fixed", top: "10%", right: "5%", width: 280, height: 280, borderRadius: "50%", background: "radial-gradient(circle, color-mix(in srgb, var(--accent) 10%, transparent), transparent 70%)", filter: "blur(60px)", pointerEvents: "none" }} />

      {/* Mobile header */}
      <div className="auth-mobile-header" style={{ width: "100%", maxWidth: 420, paddingTop: 24, paddingBottom: 8, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Link to="/" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
          <div style={{ width: 32, height: 32, borderRadius: 9, background: "var(--accent)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Zap size={16} color="#000" strokeWidth={3} />
          </div>
          <span style={{ fontFamily: "Syne, sans-serif", fontWeight: 800, fontSize: "1.1rem", color: "var(--text)" }}>
            CV<span style={{ color: "var(--accent)" }}>iva</span>
          </span>
        </Link>
        <Link to="/" style={{ fontSize: "0.78rem", color: "var(--muted)", textDecoration: "none", fontFamily: "Syne, sans-serif", fontWeight: 600 }}>
          ← Inicio
        </Link>
      </div>

      {/* Form */}
      <div style={{ width: "100%", maxWidth: 420, position: "relative", paddingTop: 24 }}>
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontFamily: "Syne, sans-serif", fontWeight: 800, fontSize: "clamp(1.6rem, 5vw, 2rem)", letterSpacing: "-0.03em", color: "var(--text)", marginBottom: 8, lineHeight: 1.2 }}>
            {title}
          </h1>
          <p style={{ color: "var(--muted)", fontSize: "0.9rem", lineHeight: 1.6 }}>{subtitle}</p>
        </div>
        {children}
      </div>

      {/* Testimonial móvil — orden: persona → estrellas → frase */}
      <div className="auth-mobile-testimonial" style={{ width: "100%", maxWidth: 420, marginTop: 32, padding: "16px", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 14 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
          <div style={{ width: 28, height: 28, borderRadius: "50%", background: "linear-gradient(135deg, #00E5FF, #0062FF)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Syne, sans-serif", fontWeight: 800, color: "#000", fontSize: "0.65rem", flexShrink: 0 }}>JM</div>
          <span style={{ fontSize: "0.75rem", color: "var(--text)", fontFamily: "Syne, sans-serif", fontWeight: 600 }}>Juliana M. · Product Designer</span>
        </div>
        <div style={{ display: "flex", gap: 2, marginBottom: 8 }}>
          {[...Array(5)].map((_, i) => <Star key={i} size={11} fill="var(--gold)" color="var(--gold)" />)}
        </div>
        <p style={{ fontSize: "0.8rem", color: "var(--muted)", lineHeight: 1.6, margin: 0 }}>
          "Conseguí 3 entrevistas en una semana con CViva."
        </p>
      </div>
    </div>

    <style>{`
      @media (min-width: 860px) {
        .auth-left { display: flex !important; }
        .auth-mobile-header { padding-top: 40px !important; }
        .auth-mobile-testimonial { display: none !important; }
      }
      @media (max-width: 400px) {
        .auth-mobile-header { padding-top: 16px !important; }
      }
    `}</style>
  </div>
);

export default AuthLayout;
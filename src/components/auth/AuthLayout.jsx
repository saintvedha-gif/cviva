import { Zap } from "lucide-react";
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

      {/* Beneficios desktop — reemplaza el testimonio anterior, que citaba a una
          persona y cifras de uso ficticias. Esto se actualizará con testimonios
          reales en cuanto existan. */}
      <div style={{ position: "relative" }}>
        <div style={{ fontSize: "1.3rem", fontFamily: "Syne, sans-serif", fontWeight: 700, color: "var(--text)", lineHeight: 1.4, marginBottom: 24 }}>
          Tu CV interactivo, listo en minutos.
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {[
            "Sube tu CV en PDF o Word y la IA extrae tu información",
            "Edita y personaliza cada sección en tiempo real",
            "Comparte un link público o descarga en PDF / Word",
          ].map((text, i) => (
            <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
              <div style={{ width: 20, height: 20, borderRadius: "50%", background: "var(--accent-soft)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2, color: "var(--accent)", fontFamily: "Syne, sans-serif", fontWeight: 800, fontSize: "0.7rem" }}>
                {i + 1}
              </div>
              <span style={{ fontSize: "0.88rem", color: "var(--muted)", lineHeight: 1.5 }}>{text}</span>
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

      {/* Beneficios móvil — versión compacta del panel desktop, mismo contenido honesto */}
      <div className="auth-mobile-testimonial" style={{ width: "100%", maxWidth: 420, marginTop: 32, padding: "16px", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 14 }}>
        <div style={{ fontSize: "0.85rem", fontFamily: "Syne, sans-serif", fontWeight: 700, color: "var(--text)", marginBottom: 10 }}>
          Tu CV interactivo, listo en minutos
        </div>
        <p style={{ fontSize: "0.8rem", color: "var(--muted)", lineHeight: 1.6, margin: 0 }}>
          Sube tu CV, edítalo en tiempo real y compártelo con un link o descárgalo en PDF / Word.
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
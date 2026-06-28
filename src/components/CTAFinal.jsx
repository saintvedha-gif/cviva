import { Zap, ArrowRight } from "lucide-react";

const CTAFinal = () => (
  <section style={{ padding: "100px 24px", position: "relative", overflow: "hidden" }}>
    <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at center, color-mix(in srgb, var(--accent) 10%, transparent), transparent 70%)", pointerEvents: "none" }} />
    <div className="grid-bg" style={{ position: "absolute", inset: 0, opacity: 0.2 }} />
    <div style={{ maxWidth: 720, margin: "0 auto", textAlign: "center", position: "relative" }}>
      <div style={{ width: 64, height: 64, borderRadius: 18, background: "var(--accent)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 32px" }}>
        <Zap size={28} color="#000" strokeWidth={3} />
      </div>
      <h2 style={{ fontSize: "clamp(2.2rem, 4vw, 3.4rem)", letterSpacing: "-0.04em", marginBottom: 20 }}>
        Tu próxima oportunidad<br />empieza con un mejor CV.
      </h2>
      <p style={{ color: "var(--muted)", fontSize: "1.05rem", maxWidth: 460, margin: "0 auto 40px" }}>
        Crea tu CV interactivo hoy mismo. Gratis para empezar, poderoso para escalar.
      </p>
      <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
        <a href="#pricing" className="btn-primary" style={{ fontSize: "1rem", padding: "16px 32px" }}>
          Crear mi CV gratis <ArrowRight size={18} />
        </a>
        <a href="#demo" className="btn-ghost" style={{ fontSize: "1rem", padding: "15px 30px" }}>
          Ver ejemplos
        </a>
      </div>
    </div>
  </section>
);

export default CTAFinal;
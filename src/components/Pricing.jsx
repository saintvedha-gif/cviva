import { Star, Check } from "lucide-react";

const plans = [
  {
    name: "Free", price: "$0", period: "siempre", desc: "Para explorar y empezar.",
    features: ["1 CV interactivo", "URL pública", "PDF básico", "CViva branding"],
    cta: "Empezar gratis", accent: "var(--border)", highlight: false,
  },
  {
    name: "Pro", price: "$12", period: "/ mes", desc: "Para profesionales en búsqueda activa.",
    features: ["CVs ilimitados", "URL personalizada", "PDF + Word export", "Analíticas de visitas", "Sin branding", "Soporte prioritario"],
    cta: "Comenzar prueba gratis", accent: "var(--accent)", highlight: true, badge: "Más popular",
  },
  {
    name: "Teams", price: "$49", period: "/ mes", desc: "Para equipos de talento y agencias.",
    features: ["Todo en Pro", "Hasta 20 usuarios", "Dashboard de equipo", "API access", "Integración ATS", "Onboarding dedicado"],
    cta: "Contactar ventas", accent: "var(--gold)", highlight: false,
  },
];

const Pricing = () => (
  <section id="pricing" style={{ padding: "100px 24px", position: "relative", overflow: "hidden" }}>
    <div style={{ position: "absolute", top: "30%", left: "50%", transform: "translateX(-50%)", width: 800, height: 400, borderRadius: "50%", background: "radial-gradient(ellipse, color-mix(in srgb, var(--accent) 8%, transparent), transparent 70%)", filter: "blur(60px)", pointerEvents: "none" }} />
    <div style={{ maxWidth: 1100, margin: "0 auto", position: "relative" }}>
      <div style={{ textAlign: "center", marginBottom: 60 }}>
        <span className="tag"><Star size={10} /> Planes</span>
        <h2 style={{ fontSize: "clamp(2rem, 3.5vw, 3rem)", marginTop: 20, letterSpacing: "-0.03em" }}>Invierte en tu carrera</h2>
        <p style={{ color: "var(--muted)", marginTop: 16 }}>14 días de prueba gratis en todos los planes pagos. Sin tarjeta de crédito.</p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20, alignItems: "start" }}>
        {plans.map((plan, i) => (
          <div key={i} className={plan.highlight ? "" : "card"} style={{ padding: "36px 30px", borderRadius: 20, border: "1px solid", borderColor: plan.highlight ? plan.accent : "var(--border)", background: plan.highlight ? "color-mix(in srgb, var(--accent) 6%, var(--surface))" : "var(--surface)", position: "relative", boxShadow: plan.highlight ? "var(--accent-glow)" : "none" }}>
            {plan.badge && (
              <div style={{ position: "absolute", top: -14, left: "50%", transform: "translateX(-50%)", background: "var(--accent)", color: "#000", fontSize: "0.72rem", fontFamily: "Syne, sans-serif", fontWeight: 800, padding: "5px 16px", borderRadius: 100, letterSpacing: "0.06em", whiteSpace: "nowrap" }}>
                {plan.badge}
              </div>
            )}
            <div style={{ marginBottom: 8 }}>
              <span style={{ fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: "0.85rem", color: plan.highlight ? plan.accent : "var(--muted)" }}>{plan.name}</span>
            </div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 6 }}>
              <span style={{ fontFamily: "Syne, sans-serif", fontWeight: 800, fontSize: "3rem", letterSpacing: "-0.05em", color: "var(--text)" }}>{plan.price}</span>
              <span style={{ color: "var(--muted)", fontSize: "0.85rem" }}>{plan.period}</span>
            </div>
            <p style={{ color: "var(--muted)", fontSize: "0.85rem", marginBottom: 28 }}>{plan.desc}</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 32 }}>
              {plan.features.map((f, j) => (
                <div key={j} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                  <div style={{ width: 20, height: 20, borderRadius: "50%", background: (plan.accent === "var(--border)" ? "var(--accent)" : plan.accent) + "18", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
                    <Check size={11} color={plan.accent === "var(--border)" ? "var(--accent)" : plan.accent} strokeWidth={3} />
                  </div>
                  <span style={{ fontSize: "0.85rem", color: "var(--muted)" }}>{f}</span>
                </div>
              ))}
            </div>
            <button className={plan.highlight ? "btn-primary" : "btn-ghost"} style={{ width: "100%", justifyContent: "center", fontSize: "0.9rem" }}>
              {plan.cta}
            </button>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default Pricing;

import { Star, Check, Lock } from "lucide-react";

// Mismos datos que PricingPage.jsx (la página real de precios). Si cambias un
// precio o feature, actualiza ambos archivos para que no queden inconsistentes.
const WOMPI_ACTIVE = !!(
  import.meta.env.VITE_WOMPI_PUBLIC_KEY &&
  import.meta.env.VITE_WOMPI_PUBLIC_KEY !== "pub_test_XXXXXXXXX" &&
  import.meta.env.VITE_WOMPI_PUBLIC_KEY !== "pub_test_REEMPLAZAR_AQUI"
);

const plans = [
  {
    name: "Free", price: "$0", period: "siempre", desc: "Para explorar y empezar.",
    features: ["1 CV interactivo", "URL pública", "Exportar PDF y Word", "Marca CViva"],
    cta: "Empezar gratis", accent: "var(--border)", highlight: false,
  },
  {
    name: "Pro", price: "$14.900", period: "/ mes COP", desc: "Para profesionales en búsqueda activa.",
    features: ["CVs ilimitados", "URL personalizada", "Analíticas de visitas", "Sin marca de agua", "Soporte prioritario"],
    cta: "Comenzar con Pro", accent: "var(--accent)", highlight: true, badge: "Más popular", isPaid: true,
  },
];

const Pricing = ({ onSelectPlan }) => (
  <section id="pricing" style={{ padding: "100px 24px", position: "relative", overflow: "hidden" }}>
    <div style={{ position: "absolute", top: "30%", left: "50%", transform: "translateX(-50%)", width: 800, height: 400, borderRadius: "50%", background: "radial-gradient(ellipse, color-mix(in srgb, var(--accent) 8%, transparent), transparent 70%)", filter: "blur(60px)", pointerEvents: "none" }} />
    <div style={{ maxWidth: 1100, margin: "0 auto", position: "relative" }}>
      <div style={{ textAlign: "center", marginBottom: 60 }}>
        <span className="tag"><Star size={10} /> Planes</span>
        <h2 style={{ fontSize: "clamp(2rem, 3.5vw, 3rem)", marginTop: 20, letterSpacing: "-0.03em" }}>Invierte en tu carrera</h2>
        <p style={{ color: "var(--muted)", marginTop: 16 }}>Paga con tarjeta, Nequi, Daviplata o PSE. Cancela cuando quieras.</p>
        {!WOMPI_ACTIVE && (
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, marginTop: 18, padding: "8px 16px", borderRadius: 10, background: "rgba(255,159,28,0.08)", border: "1px solid rgba(255,159,28,0.25)", fontSize: "0.8rem", color: "#FF9F1C" }}>
            <Lock size={12} /> Los planes de pago estarán disponibles muy pronto
          </div>
        )}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20, alignItems: "start" }}>
        {plans.map((plan, i) => {
          const disabled = plan.isPaid && !WOMPI_ACTIVE;
          return (
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
              <button
                className={plan.highlight ? "btn-primary" : "btn-ghost"}
                onClick={() => onSelectPlan?.(plan)}
                disabled={disabled}
                style={{ width: "100%", justifyContent: "center", fontSize: "0.9rem", opacity: disabled ? 0.6 : 1, cursor: disabled ? "default" : "pointer" }}
              >
                {disabled ? <><Lock size={13} style={{ marginRight: 6 }} /> Próximamente</> : plan.cta}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  </section>
);

export default Pricing;
// src/components/PricingPage.jsx
import { useState } from "react";
import { Check, Star, ArrowRight, Zap } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useSubscription } from "../hooks/useSubscription";

const PLANS = [
  {
    id: "free",
    name: "Free",
    price: 0,
    priceLabel: "$0",
    period: "siempre",
    desc: "Para explorar y empezar.",
    features: ["1 CV interactivo", "URL pública", "Exportar PDF", "Marca CViva"],
    cta: "Tu plan actual",
    highlight: false,
    color: "var(--border)",
  },
  {
    id: "pro",
    name: "Pro",
    price: 29900,
    priceLabel: "$29.900",
    period: "/ mes COP",
    desc: "Para profesionales en búsqueda activa.",
    features: ["CVs ilimitados", "URL personalizada", "PDF + Word", "Analíticas de visitas", "Sin marca de agua", "Soporte prioritario"],
    cta: "Comenzar con Pro",
    highlight: true,
    badge: "Más popular",
    color: "var(--accent)",
    wompiRef: "cviva_pro_mensual",
  },
  {
    id: "teams",
    name: "Teams",
    price: 149900,
    priceLabel: "$149.900",
    period: "/ mes COP",
    desc: "Para equipos de talento y agencias.",
    features: ["Todo en Pro", "Hasta 20 usuarios", "Dashboard de equipo", "Soporte dedicado"],
    cta: "Comenzar con Teams",
    highlight: false,
    color: "var(--gold)",
    wompiRef: "cviva_teams_mensual",
  },
];

export default function PricingPage() {
  const { user } = useAuth();
  const { plan: currentPlan } = useSubscription();
  const navigate = useNavigate();
  const [loadingPlan, setLoadingPlan] = useState(null);

  const handlePay = async (plan) => {
    if (!user) { navigate("/auth/register"); return; }
    if (plan.id === "free" || plan.id === currentPlan) return;

    setLoadingPlan(plan.id);

    // Wompi checkout — abre el widget de pago
    const script = document.createElement("script");
    script.src = "https://checkout.wompi.co/widget.js";
    script.setAttribute("data-render", "button");
    script.setAttribute("data-public-key", import.meta.env.VITE_WOMPI_PUBLIC_KEY || "pub_test_XXXXXXXXX");
    script.setAttribute("data-currency", "COP");
    script.setAttribute("data-amount-in-cents", String(plan.price * 100));
    script.setAttribute("data-reference", `${plan.wompiRef}_${user.id}_${Date.now()}`);
    script.setAttribute("data-customer-email", user.email);
    script.setAttribute("data-redirect-url", `${window.location.origin}/checkout/success?gateway=wompi&plan=${plan.id}`);
    document.body.appendChild(script);

    // Trigger click en el botón de Wompi una vez cargado
    script.onload = () => {
      const btn = document.querySelector("[data-wompi-checkout]");
      if (btn) btn.click();
      setLoadingPlan(null);
    };
    script.onerror = () => setLoadingPlan(null);
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--text)" }}>
      {/* Header */}
      <div style={{ borderBottom: "1px solid var(--border)", padding: "0 20px", height: 58, display: "flex", alignItems: "center" }}>
        <Link to="/" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: "var(--accent)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Zap size={13} color="#000" strokeWidth={3} />
          </div>
          <span style={{ fontFamily: "Syne,sans-serif", fontWeight: 800, fontSize: "1rem", color: "var(--text)" }}>
            CV<span style={{ color: "var(--accent)" }}>iva</span>
          </span>
        </Link>
      </div>

      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "60px 20px" }}>
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <span className="tag"><Star size={10} /> Planes</span>
          <h1 style={{ fontSize: "clamp(2rem,4vw,3rem)", marginTop: 20, letterSpacing: "-0.03em", fontFamily: "Syne,sans-serif", fontWeight: 800 }}>
            Invierte en tu carrera
          </h1>
          <p style={{ color: "var(--muted)", marginTop: 14, fontSize: "1rem" }}>
            Paga con tarjeta, Nequi, Daviplata o PSE. Cancela cuando quieras.
          </p>
          {/* Payment methods */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginTop: 20, flexWrap: "wrap" }}>
            {["Nequi", "Daviplata", "PSE", "Visa", "Mastercard"].map(m => (
              <span key={m} style={{ padding: "4px 12px", borderRadius: 8, background: "var(--surface)", border: "1px solid var(--border)", fontSize: "0.75rem", color: "var(--muted)", fontFamily: "Syne,sans-serif", fontWeight: 600 }}>
                {m}
              </span>
            ))}
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20, alignItems: "start" }}>
          {PLANS.map(plan => {
            const isCurrent = plan.id === currentPlan;
            return (
              <div key={plan.id} style={{
                padding: "36px 28px", borderRadius: 20,
                border: `1.5px solid ${plan.highlight ? plan.color : "var(--border)"}`,
                background: plan.highlight ? "color-mix(in srgb, var(--accent) 6%, var(--surface))" : "var(--surface)",
                position: "relative",
                boxShadow: plan.highlight ? "var(--accent-glow)" : "none",
              }}>
                {plan.badge && (
                  <div style={{ position: "absolute", top: -14, left: "50%", transform: "translateX(-50%)", background: "var(--accent)", color: "#000", fontSize: "0.72rem", fontFamily: "Syne,sans-serif", fontWeight: 800, padding: "5px 16px", borderRadius: 100, whiteSpace: "nowrap" }}>
                    {plan.badge}
                  </div>
                )}
                {isCurrent && (
                  <div style={{ position: "absolute", top: 14, right: 14, background: "rgba(0,229,160,0.12)", border: "1px solid rgba(0,229,160,0.3)", color: "#00E5A0", fontSize: "0.68rem", fontFamily: "Syne,sans-serif", fontWeight: 700, padding: "3px 10px", borderRadius: 100 }}>
                    Plan actual
                  </div>
                )}
                <div style={{ fontFamily: "Syne,sans-serif", fontWeight: 700, fontSize: "0.85rem", color: plan.highlight ? plan.color : "var(--muted)", marginBottom: 8 }}>
                  {plan.name}
                </div>
                <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 6 }}>
                  <span style={{ fontFamily: "Syne,sans-serif", fontWeight: 800, fontSize: "2.5rem", letterSpacing: "-0.04em", color: "var(--text)" }}>{plan.priceLabel}</span>
                  <span style={{ color: "var(--muted)", fontSize: "0.82rem" }}>{plan.period}</span>
                </div>
                <p style={{ color: "var(--muted)", fontSize: "0.85rem", marginBottom: 24, lineHeight: 1.5 }}>{plan.desc}</p>

                <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 28 }}>
                  {plan.features.map((f, j) => (
                    <div key={j} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                      <div style={{ width: 20, height: 20, borderRadius: "50%", background: (plan.color === "var(--border)" ? "var(--accent)" : plan.color) + "18", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
                        <Check size={11} color={plan.color === "var(--border)" ? "var(--accent)" : plan.color} strokeWidth={3} />
                      </div>
                      <span style={{ fontSize: "0.85rem", color: "var(--muted)" }}>{f}</span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => handlePay(plan)}
                  disabled={isCurrent || loadingPlan === plan.id}
                  style={{
                    width: "100%", padding: "13px", borderRadius: 11,
                    border: plan.highlight ? "none" : "1.5px solid var(--border)",
                    background: isCurrent ? "var(--surface-high)" : plan.highlight ? "var(--accent)" : "transparent",
                    color: isCurrent ? "var(--muted)" : plan.highlight ? "#000" : "var(--text)",
                    fontFamily: "Syne,sans-serif", fontWeight: 700, fontSize: "0.92rem",
                    cursor: isCurrent ? "default" : "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                    transition: "box-shadow 0.18s, transform 0.18s",
                  }}
                  onMouseEnter={e => { if (!isCurrent) e.currentTarget.style.boxShadow = plan.highlight ? "var(--accent-glow)" : "0 0 0 1px var(--accent)"; }}
                  onMouseLeave={e => e.currentTarget.style.boxShadow = "none"}
                >
                  {loadingPlan === plan.id ? "Cargando..." : isCurrent ? "Plan actual ✓" : <>{plan.cta} <ArrowRight size={15} /></>}
                </button>
              </div>
            );
          })}
        </div>

        <p style={{ textAlign: "center", color: "var(--muted)", fontSize: "0.82rem", marginTop: 40 }}>
          ¿Preguntas? Escríbenos a{" "}
          <a href="mailto:hola@cviva.co" style={{ color: "var(--accent)", textDecoration: "none" }}>hola@cviva.co</a>
        </p>
      </div>
    </div>
  );
}
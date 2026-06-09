// src/components/dashboard/PlanGate.jsx
import { Lock, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function PlanGate({ feature, children, isPro }) {
  if (isPro) return children;
  return (
    <div style={{ position: "relative", userSelect: "none" }}>
      <div style={{ filter: "blur(3px)", pointerEvents: "none", opacity: 0.4 }}>
        {children}
      </div>
      <div style={{
        position: "absolute", inset: 0, display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center", gap: 12, textAlign: "center",
        padding: 24,
      }}>
        <div style={{ width: 44, height: 44, borderRadius: 12, background: "var(--accent-soft)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Lock size={20} color="var(--accent)" />
        </div>
        <div style={{ fontFamily: "Syne,sans-serif", fontWeight: 800, fontSize: "0.95rem", color: "var(--text)" }}>
          {feature} — Plan Pro
        </div>
        <div style={{ fontSize: "0.82rem", color: "var(--muted)", maxWidth: 240 }}>
          Actualiza tu plan para desbloquear esta función.
        </div>
        <Link to="/pricing" style={{ display: "inline-flex", alignItems: "center", gap: 7, background: "var(--accent)", color: "#000", padding: "10px 18px", borderRadius: 9, textDecoration: "none", fontFamily: "Syne,sans-serif", fontWeight: 700, fontSize: "0.85rem" }}>
          Ver planes <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
}
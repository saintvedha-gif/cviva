// src/components/dashboard/OnboardingModal.jsx
import { useState } from "react";
import { Upload, Sparkles, Share2, X, ArrowRight } from "lucide-react";

const STEPS = [
  {
    icon: Upload,
    title: "Sube tu CV actual",
    description: "Arrastra tu PDF o Word. Nuestra IA extrae automáticamente tu experiencia, educación y habilidades.",
    color: "#00E5FF",
  },
  {
    icon: Sparkles,
    title: "Personaliza en segundos",
    description: "Edita cualquier campo, agrega tu foto y ajusta el orden de tus secciones con el editor visual.",
    color: "#C77DFF",
  },
  {
    icon: Share2,
    title: "Comparte con un link",
    description: "Publica tu CV interactivo y compártelo en LinkedIn, WhatsApp o donde quieras. Sin archivos adjuntos.",
    color: "#00E5A0",
  },
];

const STORAGE_KEY = "cviva_onboarding_seen";

export function shouldShowOnboarding() {
  try {
    return !localStorage.getItem(STORAGE_KEY);
  } catch {
    return false;
  }
}

function markOnboardingSeen() {
  try {
    localStorage.setItem(STORAGE_KEY, "1");
  } catch {}
}

export default function OnboardingModal({ onClose, onStart }) {
  const [step, setStep] = useState(0);
  const isLast = step === STEPS.length - 1;
  const current = STEPS[step];
  const Icon = current.icon;

  const handleClose = () => {
    markOnboardingSeen();
    onClose();
  };

  const handleNext = () => {
    if (isLast) {
      markOnboardingSeen();
      onStart();
    } else {
      setStep(s => s + 1);
    }
  };

  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 9999,
        background: "rgba(5,8,14,0.78)",
        backdropFilter: "blur(6px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: 20,
      }}
      onClick={handleClose}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: 22,
          padding: "36px 32px 28px",
          maxWidth: 420,
          width: "100%",
          position: "relative",
          boxShadow: "0 24px 60px rgba(0,0,0,0.4)",
        }}
      >
        {/* Cerrar */}
        <button
          onClick={handleClose}
          style={{
            position: "absolute", top: 16, right: 16,
            width: 30, height: 30, borderRadius: "50%",
            display: "flex", alignItems: "center", justifyContent: "center",
            background: "var(--surface-high)", border: "1px solid var(--border)",
            color: "var(--muted)", cursor: "pointer",
          }}
        >
          <X size={14} />
        </button>

        {/* Icono */}
        <div style={{
          width: 56, height: 56, borderRadius: 16,
          background: current.color + "18",
          display: "flex", alignItems: "center", justifyContent: "center",
          marginBottom: 20,
        }}>
          <Icon size={26} color={current.color} />
        </div>

        {/* Contenido */}
        <div style={{
          fontFamily: "Syne,sans-serif", fontWeight: 800, fontSize: "1.25rem",
          color: "var(--text)", marginBottom: 10, letterSpacing: "-0.02em",
        }}>
          {current.title}
        </div>
        <div style={{
          fontSize: "0.92rem", color: "var(--muted)", lineHeight: 1.6, marginBottom: 28,
        }}>
          {current.description}
        </div>

        {/* Dots */}
        <div style={{ display: "flex", gap: 6, marginBottom: 24 }}>
          {STEPS.map((_, i) => (
            <div
              key={i}
              style={{
                height: 4, borderRadius: 100,
                flex: 1,
                background: i <= step ? "var(--accent)" : "var(--border)",
                transition: "background 0.25s",
              }}
            />
          ))}
        </div>

        {/* Acciones */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
          <button
            onClick={handleClose}
            style={{
              background: "none", border: "none", color: "var(--muted)",
              fontSize: "0.82rem", fontFamily: "Syne,sans-serif", fontWeight: 600,
              cursor: "pointer", padding: "10px 4px",
            }}
          >
            Omitir
          </button>
          <button
            onClick={handleNext}
            style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: "var(--accent)", color: "#000",
              padding: "11px 22px", borderRadius: 10, border: "none",
              fontFamily: "Syne,sans-serif", fontWeight: 700, fontSize: "0.88rem",
              cursor: "pointer", transition: "box-shadow 0.18s",
            }}
            onMouseEnter={e => e.currentTarget.style.boxShadow = "var(--accent-glow)"}
            onMouseLeave={e => e.currentTarget.style.boxShadow = "none"}
          >
            {isLast ? "Crear mi CV" : "Siguiente"} <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
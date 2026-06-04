// src/components/dashboard/SettingsPage.jsx
import { useState } from "react";
import { Save, User, Lock } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";

const Field = ({ label, value, onChange, type = "text", placeholder }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
    <label style={{ fontSize: "0.78rem", fontFamily: "Syne,sans-serif", fontWeight: 600, color: "var(--muted)" }}>{label}</label>
    <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} style={{ background: "var(--surface-high)", border: "1.5px solid var(--border)", borderRadius: 10, padding: "10px 14px", color: "var(--text)", fontFamily: "DM Sans,sans-serif", fontSize: "0.88rem", outline: "none", transition: "border-color 0.18s" }}
      onFocus={e => e.target.style.borderColor = "var(--accent)"}
      onBlur={e => e.target.style.borderColor = "var(--border)"}
    />
  </div>
);

export default function SettingsPage() {
  const { user } = useAuth();
  const [name, setName] = useState(user?.user_metadata?.full_name || "");
  const [email] = useState(user?.email || "");
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24, maxWidth: 560 }}>
      <div>
        <h2 style={{ fontFamily: "Syne,sans-serif", fontWeight: 800, fontSize: "1.3rem", color: "var(--text)", margin: 0 }}>Configuración</h2>
        <p style={{ color: "var(--muted)", fontSize: "0.85rem", marginTop: 4 }}>Gestiona tu cuenta y preferencias.</p>
      </div>

      {/* Profile */}
      <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 16, padding: 24, display: "flex", flexDirection: "column", gap: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
          <User size={16} color="var(--accent)" />
          <span style={{ fontFamily: "Syne,sans-serif", fontWeight: 800, fontSize: "0.9rem", color: "var(--text)" }}>Perfil</span>
        </div>
        <Field label="Nombre completo" value={name} onChange={setName} placeholder="Tu nombre" />
        <Field label="Email" value={email} onChange={() => {}} type="email" placeholder="tu@email.com" />
        <button onClick={handleSave} style={{ alignSelf: "flex-start", display: "flex", alignItems: "center", gap: 8, padding: "10px 20px", borderRadius: 10, border: "none", cursor: "pointer", background: saved ? "#00E5A0" : "var(--accent)", color: "#000", fontFamily: "Syne,sans-serif", fontWeight: 700, fontSize: "0.85rem", transition: "background 0.25s" }}>
          <Save size={14} /> {saved ? "¡Guardado!" : "Guardar cambios"}
        </button>
      </div>

      {/* Password */}
      <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 16, padding: 24, display: "flex", flexDirection: "column", gap: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
          <Lock size={16} color="var(--accent)" />
          <span style={{ fontFamily: "Syne,sans-serif", fontWeight: 800, fontSize: "0.9rem", color: "var(--text)" }}>Contraseña</span>
        </div>
        <div style={{ fontSize: "0.85rem", color: "var(--muted)", lineHeight: 1.6 }}>
          Para cambiar tu contraseña, te enviaremos un enlace de recuperación a <strong style={{ color: "var(--text)" }}>{email}</strong>.
        </div>
        <button style={{ alignSelf: "flex-start", display: "flex", alignItems: "center", gap: 8, padding: "10px 20px", borderRadius: 10, cursor: "pointer", background: "transparent", color: "var(--text)", border: "1.5px solid var(--border)", fontFamily: "Syne,sans-serif", fontWeight: 700, fontSize: "0.85rem", transition: "border-color 0.18s" }}
          onMouseEnter={e => e.currentTarget.style.borderColor = "var(--accent)"}
          onMouseLeave={e => e.currentTarget.style.borderColor = "var(--border)"}
        >
          Enviar enlace
        </button>
      </div>
    </div>
  );
}
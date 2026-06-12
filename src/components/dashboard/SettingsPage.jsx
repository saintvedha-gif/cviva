// src/components/dashboard/SettingsPage.jsx
import { useState, useRef } from "react";
import { Save, User, Lock, Camera } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { uploadAvatar } from "../../lib/supabase";

const Field = ({ label, value, onChange, type = "text", placeholder }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
    <label style={{ fontSize: "0.78rem", fontFamily: "Syne,sans-serif", fontWeight: 600, color: "var(--muted)" }}>{label}</label>
    <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
      style={{ background: "var(--surface-high)", border: "1.5px solid var(--border)", borderRadius: 10, padding: "10px 14px", color: "var(--text)", fontFamily: "DM Sans,sans-serif", fontSize: "0.88rem", outline: "none", transition: "border-color 0.18s" }}
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
  const [avatarUrl, setAvatarUrl] = useState(user?.user_metadata?.avatar_url || null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const fileRef = useRef();

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingAvatar(true);
    const { url, error } = await uploadAvatar(user.id, file);
    if (!error) setAvatarUrl(url);
    setUploadingAvatar(false);
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

        {/* Avatar */}
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ position: "relative", width: 72, height: 72, flexShrink: 0 }}>
            {avatarUrl ? (
              <img src={avatarUrl} alt="avatar"
                style={{ width: 72, height: 72, borderRadius: "50%", objectFit: "cover", border: "2px solid var(--border)" }} />
            ) : (
              <div style={{ width: 72, height: 72, borderRadius: "50%", background: "var(--surface-high)", border: "2px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <User size={28} color="var(--muted)" />
              </div>
            )}
            <button onClick={() => fileRef.current.click()} disabled={uploadingAvatar}
              style={{ position: "absolute", bottom: 0, right: 0, width: 24, height: 24, borderRadius: "50%", background: "var(--accent)", border: "2px solid var(--bg)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
              <Camera size={12} color="#000" />
            </button>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <span style={{ fontSize: "0.82rem", fontFamily: "Syne,sans-serif", fontWeight: 600, color: "var(--text)" }}>Foto de perfil</span>
            <span style={{ fontSize: "0.75rem", color: "var(--muted)" }}>
              {uploadingAvatar ? "Subiendo..." : "JPG, PNG — máx 2MB"}
            </span>
          </div>
          <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleAvatarChange} />
        </div>

        <Field label="Nombre completo" value={name} onChange={setName} placeholder="Tu nombre" />
        <Field label="Email" value={email} onChange={() => {}} type="email" placeholder="tu@email.com" />
        <button onClick={handleSave}
          style={{ alignSelf: "flex-start", display: "flex", alignItems: "center", gap: 8, padding: "10px 20px", borderRadius: 10, border: "none", cursor: "pointer", background: saved ? "#00E5A0" : "var(--accent)", color: "#000", fontFamily: "Syne,sans-serif", fontWeight: 700, fontSize: "0.85rem", transition: "background 0.25s" }}>
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
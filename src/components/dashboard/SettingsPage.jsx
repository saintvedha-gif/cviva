// src/components/dashboard/SettingsPage.jsx
import { useState, useRef } from "react";
import { Save, User, Lock, Camera, AlertCircle, CheckCircle2 } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { uploadAvatar, updateProfile } from "../../lib/supabase";
import { supabase } from "../../lib/supabase";

const Field = ({ label, value, onChange, type = "text", placeholder, disabled = false }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
    <label style={{ fontSize: "0.78rem", fontFamily: "Syne,sans-serif", fontWeight: 600, color: "var(--muted)" }}>
      {label}
    </label>
    <input
      type={type}
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      disabled={disabled}
      style={{
        background: disabled ? "var(--surface)" : "var(--surface-high)",
        border: "1.5px solid var(--border)",
        borderRadius: 10,
        padding: "10px 14px",
        color: disabled ? "var(--muted)" : "var(--text)",
        fontFamily: "DM Sans,sans-serif",
        fontSize: "0.88rem",
        outline: "none",
        transition: "border-color 0.18s",
        cursor: disabled ? "not-allowed" : "text",
        opacity: disabled ? 0.7 : 1,
      }}
      onFocus={e => { if (!disabled) e.target.style.borderColor = "var(--accent)"; }}
      onBlur={e => e.target.style.borderColor = "var(--border)"}
    />
  </div>
);

export default function SettingsPage() {
  const { user } = useAuth();
  const [name, setName] = useState(user?.user_metadata?.full_name || "");
  const [email] = useState(user?.email || "");

  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState("idle"); // idle | success | error
  const [saveError, setSaveError] = useState("");

  const [avatarUrl, setAvatarUrl] = useState(user?.user_metadata?.avatar_url || null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [avatarError, setAvatarError] = useState("");

  const [sendingReset, setSendingReset] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  const fileRef = useRef();

  const handleSave = async () => {
    setSaving(true);
    setSaveStatus("idle");
    setSaveError("");

    const { error } = await updateProfile(user.id, { full_name: name });

    if (error) {
      setSaveError(error.message || "Error al guardar");
      setSaveStatus("error");
    } else {
      // Actualizar también user_metadata en Supabase Auth
      await supabase.auth.updateUser({ data: { full_name: name } });
      setSaveStatus("success");
      setTimeout(() => setSaveStatus("idle"), 2500);
    }
    setSaving(false);
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar tamaño (máx 6MB)
    if (file.size > 6 * 1024 * 1024) {
      setAvatarError("La imagen debe pesar menos de 6MB.");
      return;
    }

    setAvatarError("");
    setUploadingAvatar(true);
    const { url, error } = await uploadAvatar(user.id, file);
    if (error) {
      setAvatarError("Error al subir la foto. Intenta de nuevo.");
    } else {
      setAvatarUrl(url);
      await supabase.auth.updateUser({ data: { avatar_url: url } });
    }
    setUploadingAvatar(false);
  };

  const handleSendReset = async () => {
    setSendingReset(true);
    await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/update-password`,
    });
    setSendingReset(false);
    setResetSent(true);
    setTimeout(() => setResetSent(false), 4000);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24, maxWidth: 560 }}>
      <div>
        <h2 style={{ fontFamily: "Syne,sans-serif", fontWeight: 800, fontSize: "1.3rem", color: "var(--text)", margin: 0 }}>
          Configuración
        </h2>
        <p style={{ color: "var(--muted)", fontSize: "0.85rem", marginTop: 4 }}>
          Gestiona tu cuenta y preferencias.
        </p>
      </div>

      {/* Perfil */}
      <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 16, padding: 24, display: "flex", flexDirection: "column", gap: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
          <User size={16} color="var(--accent)" />
          <span style={{ fontFamily: "Syne,sans-serif", fontWeight: 800, fontSize: "0.9rem", color: "var(--text)" }}>Perfil</span>
        </div>

        {/* Avatar */}
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ position: "relative", width: 72, height: 72, flexShrink: 0 }}>
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt="avatar"
                style={{ width: 72, height: 72, borderRadius: "50%", objectFit: "cover", border: "2px solid var(--border)" }}
              />
            ) : (
              <div style={{ width: 72, height: 72, borderRadius: "50%", background: "var(--surface-high)", border: "2px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <User size={28} color="var(--muted)" />
              </div>
            )}
            <button
              onClick={() => fileRef.current.click()}
              disabled={uploadingAvatar}
              style={{ position: "absolute", bottom: 0, right: 0, width: 24, height: 24, borderRadius: "50%", background: "var(--accent)", border: "2px solid var(--bg)", display: "flex", alignItems: "center", justifyContent: "center", cursor: uploadingAvatar ? "not-allowed" : "pointer", opacity: uploadingAvatar ? 0.6 : 1 }}
            >
              <Camera size={12} color="#000" />
            </button>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <span style={{ fontSize: "0.82rem", fontFamily: "Syne,sans-serif", fontWeight: 600, color: "var(--text)" }}>
              Foto de perfil
            </span>
            <span style={{ fontSize: "0.75rem", color: avatarError ? "var(--danger)" : "var(--muted)" }}>
              {uploadingAvatar ? "Subiendo..." : avatarError || "JPG, PNG — máx 6MB"}
            </span>
          </div>

          <input
            ref={fileRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            style={{ display: "none" }}
            onChange={handleAvatarChange}
          />
        </div>

        <Field label="Nombre completo" value={name} onChange={setName} placeholder="Tu nombre" />
        <Field label="Email" value={email} onChange={() => {}} type="email" placeholder="tu@email.com" disabled />

        {/* Feedback de guardado */}
        {saveStatus === "error" && (
          <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 14px", borderRadius: 10, background: "rgba(255,77,109,0.08)", border: "1px solid rgba(255,77,109,0.2)" }}>
            <AlertCircle size={14} color="var(--danger)" />
            <span style={{ fontSize: "0.78rem", color: "var(--danger)" }}>{saveError}</span>
          </div>
        )}

        <button
          onClick={handleSave}
          disabled={saving}
          style={{
            alignSelf: "flex-start",
            display: "flex", alignItems: "center", gap: 8,
            padding: "10px 20px", borderRadius: 10, border: "none",
            cursor: saving ? "not-allowed" : "pointer",
            background: saveStatus === "success" ? "#00E5A0" : "var(--accent)",
            color: "#000",
            fontFamily: "Syne,sans-serif", fontWeight: 700, fontSize: "0.85rem",
            transition: "background 0.25s",
            opacity: saving ? 0.7 : 1,
          }}
        >
          {saveStatus === "success"
            ? <><CheckCircle2 size={14} /> ¡Guardado!</>
            : <><Save size={14} /> {saving ? "Guardando..." : "Guardar cambios"}</>
          }
        </button>
      </div>

      {/* Contraseña */}
      <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 16, padding: 24, display: "flex", flexDirection: "column", gap: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
          <Lock size={16} color="var(--accent)" />
          <span style={{ fontFamily: "Syne,sans-serif", fontWeight: 800, fontSize: "0.9rem", color: "var(--text)" }}>Contraseña</span>
        </div>

        <div style={{ fontSize: "0.85rem", color: "var(--muted)", lineHeight: 1.6 }}>
          Para cambiar tu contraseña, te enviaremos un enlace de recuperación a{" "}
          <strong style={{ color: "var(--text)" }}>{email}</strong>.
        </div>

        {resetSent && (
          <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 14px", borderRadius: 10, background: "rgba(0,229,160,0.08)", border: "1px solid rgba(0,229,160,0.2)" }}>
            <CheckCircle2 size={14} color="#00E5A0" />
            <span style={{ fontSize: "0.78rem", color: "#00E5A0" }}>Enlace enviado. Revisa tu correo.</span>
          </div>
        )}

        <button
          onClick={handleSendReset}
          disabled={sendingReset || resetSent}
          style={{
            alignSelf: "flex-start",
            display: "flex", alignItems: "center", gap: 8,
            padding: "10px 20px", borderRadius: 10,
            cursor: sendingReset || resetSent ? "not-allowed" : "pointer",
            background: "transparent",
            color: "var(--text)",
            border: "1.5px solid var(--border)",
            fontFamily: "Syne,sans-serif", fontWeight: 700, fontSize: "0.85rem",
            transition: "border-color 0.18s",
            opacity: sendingReset ? 0.7 : 1,
          }}
          onMouseEnter={e => { if (!sendingReset && !resetSent) e.currentTarget.style.borderColor = "var(--accent)"; }}
          onMouseLeave={e => e.currentTarget.style.borderColor = "var(--border)"}
        >
          {sendingReset ? "Enviando..." : resetSent ? "Enlace enviado ✓" : "Enviar enlace"}
        </button>
      </div>
    </div>
  );
}
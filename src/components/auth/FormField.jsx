import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export const FormField = ({ label, type = "text", placeholder, value, onChange, error, icon: Icon, autoComplete }) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const inputType = isPassword ? (showPassword ? "text" : "password") : type;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
      <label style={{ fontFamily: "Syne, sans-serif", fontWeight: 600, fontSize: "0.78rem", color: "var(--text)", letterSpacing: "0.04em", textTransform: "uppercase" }}>
        {label}
      </label>
      <div style={{ position: "relative" }}>
        {Icon && (
          <div style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)", color: "var(--muted)", pointerEvents: "none", display: "flex" }}>
            <Icon size={15} />
          </div>
        )}
        <input
          type={inputType}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          autoComplete={autoComplete}
          style={{
            width: "100%",
            padding: Icon ? "14px 44px 14px 40px" : "14px 44px 14px 14px",
            borderRadius: 12,
            border: `1.5px solid ${error ? "var(--danger)" : "var(--border)"}`,
            background: "var(--surface)",
            color: "var(--text)",
            fontSize: "1rem",         /* bigger tap target on mobile */
            fontFamily: "DM Sans, sans-serif",
            outline: "none",
            transition: "border-color 0.18s, box-shadow 0.18s",
            boxSizing: "border-box",
            WebkitAppearance: "none", /* removes iOS inner shadow */
          }}
          onFocus={e => {
            e.target.style.borderColor = error ? "var(--danger)" : "var(--accent)";
            e.target.style.boxShadow = error ? "0 0 0 3px rgba(255,77,109,0.12)" : "0 0 0 3px var(--accent-soft)";
          }}
          onBlur={e => {
            e.target.style.borderColor = error ? "var(--danger)" : "var(--border)";
            e.target.style.boxShadow = "none";
          }}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(s => !s)}
            style={{ position: "absolute", right: 13, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "var(--muted)", cursor: "pointer", display: "flex", padding: 6 /* bigger tap area */ }}
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}
      </div>
      {error && (
        <span style={{ fontSize: "0.78rem", color: "var(--danger)" }}>{error}</span>
      )}
    </div>
  );
};

export const Divider = ({ label = "o continúa con" }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "4px 0" }}>
    <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
    <span style={{ fontSize: "0.72rem", color: "var(--muted)", fontFamily: "Syne, sans-serif", fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase", whiteSpace: "nowrap" }}>{label}</span>
    <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
  </div>
);

export const GoogleButton = ({ onClick, loading }) => (
  <button
    type="button"
    onClick={onClick}
    disabled={loading}
    style={{
      width: "100%",
      padding: "14px 20px",   /* 48px height — iOS minimum tap */
      borderRadius: 12,
      border: "1.5px solid var(--border)",
      background: "var(--surface)",
      color: "var(--text)",
      fontSize: "0.95rem",
      fontFamily: "Syne, sans-serif",
      fontWeight: 600,
      cursor: loading ? "not-allowed" : "pointer",
      display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
      transition: "border-color 0.18s, background 0.18s, transform 0.18s",
      opacity: loading ? 0.6 : 1,
      WebkitTapHighlightColor: "transparent",
    }}
    onMouseEnter={e => { if (!loading) { e.currentTarget.style.borderColor = "var(--accent)"; e.currentTarget.style.background = "var(--accent-soft)"; }}}
    onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.background = "var(--surface)"; }}
  >
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285F4"/>
      <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z" fill="#34A853"/>
      <path d="M3.964 10.707A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.707V4.961H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.039l3.007-2.332z" fill="#FBBC05"/>
      <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.96L3.964 7.293C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
    </svg>
    Continuar con Google
  </button>
);

export const SubmitButton = ({ children, loading, disabled }) => (
  <button
    type="submit"
    disabled={loading || disabled}
    style={{
      width: "100%",
      padding: "15px 20px",   /* 50px height — comfortable tap */
      borderRadius: 12,
      background: "var(--accent)",
      color: "#000",
      border: "none",
      fontFamily: "Syne, sans-serif",
      fontWeight: 700,
      fontSize: "1rem",
      cursor: loading || disabled ? "not-allowed" : "pointer",
      display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
      transition: "transform 0.18s, box-shadow 0.18s, opacity 0.18s",
      opacity: loading || disabled ? 0.65 : 1,
      letterSpacing: "0.01em",
      WebkitTapHighlightColor: "transparent",
    }}
    onMouseEnter={e => { if (!loading && !disabled) { e.currentTarget.style.boxShadow = "var(--accent-glow)"; }}}
    onMouseLeave={e => { e.currentTarget.style.boxShadow = "none"; }}
  >
    {loading ? (
      <>
        <span style={{ width: 16, height: 16, border: "2px solid rgba(0,0,0,0.3)", borderTopColor: "#000", borderRadius: "50%", display: "inline-block", animation: "spin 0.7s linear infinite" }} />
        Cargando...
      </>
    ) : children}
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
  </button>
);

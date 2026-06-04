import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, User, ArrowRight, Check } from "lucide-react";
import AuthLayout from "./AuthLayout";
import { FormField, Divider, GoogleButton, SubmitButton } from "./FormField";
import { useAuth } from "../../hooks/useAuth";

const getStrength = (pw) => {
  if (!pw) return { score: 0, label: "", color: "var(--border)" };
  let s = 0;
  if (pw.length >= 8) s++;
  if (/[A-Z]/.test(pw)) s++;
  if (/[0-9]/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  return [
    { label: "", color: "var(--border)" },
    { label: "Débil", color: "var(--danger)" },
    { label: "Regular", color: "#FF9F43" },
    { label: "Buena", color: "#FFD166" },
    { label: "Fuerte", color: "#00E5A0" },
  ][s];
};

const requirements = [
  { label: "Mínimo 8 caracteres", test: pw => pw.length >= 8 },
  { label: "Una mayúscula", test: pw => /[A-Z]/.test(pw) },
  { label: "Un número", test: pw => /[0-9]/.test(pw) },
];

const RegisterPage = () => {
  const navigate = useNavigate();
  const { signUp, signInWithGoogle } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const [success, setSuccess] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Tu nombre es requerido";
    if (!form.email) e.email = "El email es requerido";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Email inválido";
    if (!form.password) e.password = "La contraseña es requerida";
    else if (form.password.length < 8) e.password = "Mínimo 8 caracteres";
    if (form.password !== form.confirm) e.confirm = "Las contraseñas no coinciden";
    return e;
  };

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setLoading(true);
    setServerError("");
    const { error } = await signUp(form.email, form.password, form.name);
    setLoading(false);
    if (error) setServerError(error.message);
    else setSuccess(true);
  };

  const set = (key) => (e) => { setForm(f => ({ ...f, [key]: e.target.value })); setErrors(er => ({ ...er, [key]: "" })); };
  const { label: strengthLabel, color: strengthColor } = getStrength(form.password);

  if (success) return (
    <AuthLayout title="¡Revisa tu email!" subtitle="Te enviamos un enlace de confirmación.">
      <div style={{ display: "flex", flexDirection: "column", gap: 20, textAlign: "center" }}>
        <div style={{ width: 72, height: 72, borderRadius: "50%", background: "rgba(0,229,160,0.12)", border: "2px solid #00E5A0", display: "flex", alignItems: "center", justifyContent: "center", margin: "8px auto" }}>
          <Check size={32} color="#00E5A0" strokeWidth={2.5} />
        </div>
        <p style={{ color: "var(--muted)", fontSize: "0.95rem", lineHeight: 1.7 }}>
          Enviamos un email a <strong style={{ color: "var(--text)" }}>{form.email}</strong>. Haz clic en el enlace para activar tu cuenta.
        </p>
        <Link to="/auth/login" className="btn-primary" style={{ justifyContent: "center" }}>Ir al login</Link>
      </div>
    </AuthLayout>
  );

  return (
    <AuthLayout title="Crea tu cuenta" subtitle="Empieza gratis — sin tarjeta de crédito.">
      <form onSubmit={handleSubmit} noValidate style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <GoogleButton onClick={async () => { setGoogleLoading(true); await signInWithGoogle(); setGoogleLoading(false); }} loading={googleLoading} />
        <Divider />

        <FormField label="Nombre completo" type="text" placeholder="María Rodríguez" value={form.name} onChange={set("name")} error={errors.name} icon={User} autoComplete="name" />
        <FormField label="Email" type="email" placeholder="tu@email.com" value={form.email} onChange={set("email")} error={errors.email} icon={Mail} autoComplete="email" />

        {/* Password + strength */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <FormField label="Contraseña" type="password" placeholder="Mínimo 8 caracteres" value={form.password} onChange={set("password")} error={errors.password} icon={Lock} autoComplete="new-password" />
          {form.password && (
            <>
              <div style={{ display: "flex", gap: 4 }}>
                {[1,2,3,4].map(i => {
                  const score = [form.password.length>=8,/[A-Z]/.test(form.password),/[0-9]/.test(form.password),/[^A-Za-z0-9]/.test(form.password)].filter(Boolean).length;
                  return <div key={i} style={{ flex:1, height:3, borderRadius:2, background: i<=score ? strengthColor : "var(--border)", transition:"background 0.25s" }} />;
                })}
              </div>
              {strengthLabel && <span style={{ fontSize:"0.72rem", color: strengthColor, fontFamily:"Syne,sans-serif", fontWeight:600 }}>{strengthLabel}</span>}
              <div style={{ display:"flex", flexDirection:"column", gap:5 }}>
                {requirements.map(req => (
                  <div key={req.label} style={{ display:"flex", alignItems:"center", gap:7 }}>
                    <div style={{ width:14, height:14, borderRadius:"50%", background: req.test(form.password) ? "#00E5A0" : "var(--border)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, transition:"background 0.2s" }}>
                      {req.test(form.password) && <Check size={8} color="#000" strokeWidth={3} />}
                    </div>
                    <span style={{ fontSize:"0.75rem", color: req.test(form.password) ? "var(--text)" : "var(--muted)", transition:"color 0.2s" }}>{req.label}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        <FormField label="Confirmar contraseña" type="password" placeholder="Repite tu contraseña" value={form.confirm} onChange={set("confirm")} error={errors.confirm} icon={Lock} autoComplete="new-password" />

        <p style={{ fontSize:"0.75rem", color:"var(--muted)", lineHeight:1.6 }}>
          Al registrarte aceptas nuestros{" "}
          <Link to="/terms" style={{ color:"var(--accent)", textDecoration:"none" }}>Términos</Link>
          {" "}y{" "}
          <Link to="/privacy" style={{ color:"var(--accent)", textDecoration:"none" }}>Privacidad</Link>.
        </p>

        {serverError && (
          <div style={{ padding:"13px 16px", borderRadius:10, background:"rgba(255,77,109,0.1)", border:"1px solid rgba(255,77,109,0.3)", color:"var(--danger)", fontSize:"0.85rem" }}>
            {serverError}
          </div>
        )}

        <SubmitButton loading={loading}>
          Crear cuenta gratis <ArrowRight size={16} />
        </SubmitButton>

        <p style={{ textAlign:"center", fontSize:"0.88rem", color:"var(--muted)", lineHeight:1.6 }}>
          ¿Ya tienes cuenta?{" "}
          <Link to="/auth/login" style={{ color:"var(--accent)", textDecoration:"none", fontFamily:"Syne,sans-serif", fontWeight:600 }}>
            Inicia sesión
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
};

export default RegisterPage;

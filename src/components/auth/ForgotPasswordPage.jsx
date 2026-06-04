import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, ArrowLeft, ArrowRight, Check } from "lucide-react";
import AuthLayout from "./AuthLayout";
import { FormField, SubmitButton } from "./FormField";
import { useAuth } from "../../hooks/useAuth";

const ForgotPasswordPage = () => {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    if (!email) { setError("El email es requerido"); return; }
    if (!/\S+@\S+\.\S+/.test(email)) { setError("Email inválido"); return; }
    setLoading(true);
    const { error: err } = await resetPassword(email);
    setLoading(false);
    if (err) setError(err.message);
    else setSent(true);
  };

  if (sent) return (
    <AuthLayout title="Revisa tu bandeja" subtitle="Si el email existe, recibirás instrucciones pronto.">
      <div style={{ display:"flex", flexDirection:"column", gap:20, textAlign:"center" }}>
        <div style={{ position:"relative", width:80, height:80, margin:"8px auto" }}>
          <div style={{ position:"absolute", inset:0, borderRadius:"50%", background:"rgba(0,229,160,0.08)", border:"1.5px solid rgba(0,229,160,0.3)", animation:"ping 1.5s ease-out infinite" }} />
          <div style={{ position:"relative", width:"100%", height:"100%", borderRadius:"50%", background:"rgba(0,229,160,0.12)", display:"flex", alignItems:"center", justifyContent:"center" }}>
            <Check size={32} color="#00E5A0" strokeWidth={2.5} />
          </div>
        </div>
        <div>
          <p style={{ color:"var(--muted)", fontSize:"0.9rem", lineHeight:1.7, marginBottom:6 }}>Enviamos instrucciones a</p>
          <p style={{ fontFamily:"Syne,sans-serif", fontWeight:700, color:"var(--accent)", fontSize:"0.95rem", wordBreak:"break-all" }}>{email}</p>
        </div>
        <div style={{ background:"var(--surface)", border:"1px solid var(--border)", borderRadius:12, padding:"14px 16px", textAlign:"left" }}>
          <p style={{ fontSize:"0.8rem", color:"var(--muted)", lineHeight:1.7 }}>
            ¿No lo ves? Revisa spam o{" "}
            <button onClick={() => setSent(false)} style={{ background:"none", border:"none", color:"var(--accent)", cursor:"pointer", fontFamily:"Syne,sans-serif", fontWeight:600, fontSize:"0.8rem", padding:0 }}>
              intenta con otro email
            </button>.
          </p>
        </div>
        <Link to="/auth/login" style={{ display:"inline-flex", alignItems:"center", justifyContent:"center", gap:7, color:"var(--muted)", fontSize:"0.88rem", textDecoration:"none", fontFamily:"Syne,sans-serif", fontWeight:600, padding:"8px 0" }}>
          <ArrowLeft size={14} /> Volver al login
        </Link>
      </div>
      <style>{`@keyframes ping { 0% { transform:scale(1); opacity:0.6; } 100% { transform:scale(1.6); opacity:0; } }`}</style>
    </AuthLayout>
  );

  return (
    <AuthLayout title="Recupera tu acceso" subtitle="Te enviamos un enlace para restablecer tu contraseña.">
      <form onSubmit={handleSubmit} noValidate style={{ display:"flex", flexDirection:"column", gap:18 }}>
        <FormField
          label="Email"
          type="email"
          placeholder="tu@email.com"
          value={email}
          onChange={e => { setEmail(e.target.value); setError(""); }}
          error={error}
          icon={Mail}
          autoComplete="email"
        />
        <SubmitButton loading={loading}>
          Enviar instrucciones <ArrowRight size={16} />
        </SubmitButton>
        <Link to="/auth/login" style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:7, color:"var(--muted)", fontSize:"0.88rem", textDecoration:"none", fontFamily:"Syne,sans-serif", fontWeight:600, padding:"8px 0" }}>
          <ArrowLeft size={14} /> Volver al login
        </Link>
      </form>
    </AuthLayout>
  );
};

export default ForgotPasswordPage;

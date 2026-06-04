import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, ArrowRight } from "lucide-react";
import AuthLayout from "./AuthLayout";
import { FormField, Divider, GoogleButton, SubmitButton } from "./FormField";
import { useAuth } from "../../hooks/useAuth";

const LoginPage = () => {
  const navigate = useNavigate();
  const { signIn, signInWithGoogle } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  const validate = () => {
    const e = {};
    if (!form.email) e.email = "El email es requerido";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Email inválido";
    if (!form.password) e.password = "La contraseña es requerida";
    return e;
  };

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setLoading(true);
    setServerError("");
    const { error } = await signIn(form.email, form.password);
    setLoading(false);
    if (error) {
      setServerError(error.message === "Invalid login credentials" ? "Email o contraseña incorrectos." : error.message);
    } else {
      navigate("/dashboard");
    }
  };

  const handleGoogle = async () => {
    setGoogleLoading(true);
    await signInWithGoogle();
    setGoogleLoading(false);
  };

  const set = (key) => (e) => { setForm(f => ({ ...f, [key]: e.target.value })); setErrors(er => ({ ...er, [key]: "" })); };

  return (
    <AuthLayout title="Bienvenido de vuelta" subtitle="Ingresa a tu cuenta para gestionar tu CV interactivo.">
      <form onSubmit={handleSubmit} noValidate style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        <GoogleButton onClick={handleGoogle} loading={googleLoading} />
        <Divider />

        <FormField label="Email" type="email" placeholder="tu@email.com" value={form.email} onChange={set("email")} error={errors.email} icon={Mail} autoComplete="email" />
        <FormField label="Contraseña" type="password" placeholder="Tu contraseña" value={form.password} onChange={set("password")} error={errors.password} icon={Lock} autoComplete="current-password" />

        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: -4 }}>
          <Link to="/auth/forgot-password" style={{ fontSize: "0.85rem", color: "var(--accent)", textDecoration: "none", fontFamily: "Syne, sans-serif", fontWeight: 600, padding: "4px 0" /* bigger tap area */ }}>
            ¿Olvidaste tu contraseña?
          </Link>
        </div>

        {serverError && (
          <div style={{ padding: "13px 16px", borderRadius: 10, background: "rgba(255,77,109,0.1)", border: "1px solid rgba(255,77,109,0.3)", color: "var(--danger)", fontSize: "0.85rem", lineHeight: 1.5 }}>
            {serverError}
          </div>
        )}

        <SubmitButton loading={loading}>
          Iniciar sesión <ArrowRight size={16} />
        </SubmitButton>

        <p style={{ textAlign: "center", fontSize: "0.88rem", color: "var(--muted)", marginTop: 4, lineHeight: 1.6 }}>
          ¿No tienes cuenta?{" "}
          <Link to="/auth/register" style={{ color: "var(--accent)", textDecoration: "none", fontFamily: "Syne, sans-serif", fontWeight: 600 }}>
            Regístrate gratis
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
};

export default LoginPage;

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, ArrowRight } from "lucide-react";
import AuthLayout from "./AuthLayout";
import { FormField, SubmitButton } from "./FormField";
import { supabase } from "../../lib/supabase";

const UpdatePasswordPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ password: "", confirm: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Supabase procesa el token del hash automáticamente al llamar getSession
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/auth/login");
      } else {
        setReady(true);
      }
    });
  }, [navigate]);

  const set = (key) => (e) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
    setErrors((er) => ({ ...er, [key]: "" }));
  };

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    const e = {};
    if (!form.password) e.password = "La contraseña es requerida";
    else if (form.password.length < 6) e.password = "Mínimo 6 caracteres";
    if (form.password !== form.confirm) e.confirm = "Las contraseñas no coinciden";
    if (Object.keys(e).length) { setErrors(e); return; }

    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password: form.password });
    setLoading(false);

    if (error) {
      setErrors({ password: error.message });
    } else {
      navigate("/dashboard");
    }
  };

  if (!ready) return null;

  return (
    <AuthLayout title="Nueva contraseña" subtitle="Elige una contraseña segura para tu cuenta.">
      <form onSubmit={handleSubmit} noValidate style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        <FormField
          label="Nueva contraseña"
          type="password"
          placeholder="Mínimo 6 caracteres"
          value={form.password}
          onChange={set("password")}
          error={errors.password}
          icon={Lock}
          autoComplete="new-password"
        />
        <FormField
          label="Confirmar contraseña"
          type="password"
          placeholder="Repite tu contraseña"
          value={form.confirm}
          onChange={set("confirm")}
          error={errors.confirm}
          icon={Lock}
          autoComplete="new-password"
        />
        <SubmitButton loading={loading}>
          Guardar contraseña <ArrowRight size={16} />
        </SubmitButton>
      </form>
    </AuthLayout>
  );
};

export default UpdatePasswordPage;
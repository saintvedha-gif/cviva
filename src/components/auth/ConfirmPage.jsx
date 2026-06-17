// src/components/auth/ConfirmPage.jsx
// Esta página es el destino del email de confirmación de Supabase.
// Decide a dónde va el usuario según si tiene plan activo o no,
// leyendo la fuente de verdad real: profiles.plan en Supabase.
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase, getProfile } from "../../lib/supabase";

const ConfirmPage = () => {
  const navigate = useNavigate();
  const [mensaje, setMensaje] = useState("Verificando tu cuenta...");

  useEffect(() => {
    const verificar = async () => {
      // Supabase pone el token en el hash de la URL al redirigir.
      // getSession() lo procesa automáticamente.
      const { data: { session }, error } = await supabase.auth.getSession();

      if (error || !session) {
        // Token inválido o expirado → manda al login
        navigate("/auth/login");
        return;
      }

      setMensaje("Cuenta confirmada. Revisando tu plan...");

      // Fuente de verdad real: tabla profiles, columna plan.
      // (NUNCA usar user_metadata.plan_active — ese campo no existe
      // en ningún flujo del proyecto, el webhook de Wompi actualiza
      // directamente profiles.plan)
      const { data: profile, error: profileError } = await getProfile(session.user.id);

      if (profileError) {
        // Si por algún motivo no existe el profile aún (race condition
        // con el trigger de creación), lo tratamos como plan free
        console.warn("No se pudo leer el perfil:", profileError.message);
        setMensaje("Redirigiendo a planes...");
        navigate("/pricing");
        return;
      }

      const planActivo = profile?.plan && profile.plan !== "free";

      if (planActivo) {
        navigate("/dashboard");
      } else {
        setMensaje("Redirigiendo a planes...");
        navigate("/pricing");
      }
    };

    verificar();
  }, [navigate]);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--bg)",
        gap: 20,
      }}
    >
      {/* Spinner */}
      <div
        style={{
          width: 40,
          height: 40,
          border: "3px solid var(--border)",
          borderTopColor: "var(--accent)",
          borderRadius: "50%",
          animation: "spin 0.7s linear infinite",
        }}
      />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

      <p
        style={{
          color: "var(--muted)",
          fontFamily: "'DM Sans', sans-serif",
          fontSize: "0.9rem",
        }}
      >
        {mensaje}
      </p>
    </div>
  );
};

export default ConfirmPage;
// src/components/auth/ConfirmPage.jsx
// Esta página es el destino del email de confirmación de Supabase.
// Decide a dónde va el usuario según si tiene plan activo o no.
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";

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

      // Acá verificamos si el usuario ya tiene un plan activo en tu backend.
      // OPCIÓN A (con backend NestJS): descomentar esto cuando tengas el endpoint listo:
      /*
      try {
        const res = await fetch("/api/payments/subscription", {
          credentials: "include",
          headers: { Authorization: `Bearer ${session.access_token}` },
        });
        const sub = await res.json();
        if (sub?.status === "active") {
          navigate("/dashboard");
          return;
        }
      } catch (e) {
        // si el backend falla, igual mandamos a pricing por seguridad
      }
      */

      // OPCIÓN B (sin backend todavía): chequeamos metadata de Supabase.
      // Cuando tu webhook active el plan, guarda plan_active: true en user_metadata.
      const planActivo = session.user?.user_metadata?.plan_active === true;

      if (planActivo) {
        navigate("/dashboard");
      } else {
        // Sin plan activo → va a elegir un plan
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
// src/components/auth/ConfirmPage.jsx
// Destino del email de confirmación de Supabase.
// Siempre lleva al dashboard — el banner de upgrade aparece ahí
// de forma natural si el plan es free, sin presionar al usuario
// recién llegado con una página de ventas.
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";

const ConfirmPage = () => {
  const navigate = useNavigate();
  const [mensaje, setMensaje] = useState("Verificando tu cuenta...");

  useEffect(() => {
    const verificar = async () => {
      // Supabase incluye el token en el hash de la URL al redirigir.
      // getSession() lo procesa automáticamente.
      const { data: { session }, error } = await supabase.auth.getSession();

      if (error || !session) {
        // Token inválido o expirado → login
        navigate("/auth/login", { replace: true });
        return;
      }

      setMensaje("¡Cuenta confirmada! Entrando al dashboard...");

      // Siempre al dashboard. Si es plan free, el banner de upgrade
      // ya está integrado en DashboardHome de forma no intrusiva.
      setTimeout(() => navigate("/dashboard", { replace: true }), 800);
    };

    verificar();
  }, [navigate]);

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      background: "var(--bg)",
      gap: 20,
    }}>
      <div style={{
        width: 40, height: 40,
        border: "3px solid var(--border)",
        borderTopColor: "var(--accent)",
        borderRadius: "50%",
        animation: "spin 0.7s linear infinite",
      }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <p style={{
        color: "var(--muted)",
        fontFamily: "'DM Sans', sans-serif",
        fontSize: "0.9rem",
      }}>
        {mensaje}
      </p>
    </div>
  );
};

export default ConfirmPage;
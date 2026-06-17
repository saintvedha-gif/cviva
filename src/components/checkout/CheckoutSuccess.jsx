// src/components/checkout/CheckoutSuccess.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { getProfile } from "../../lib/supabase";

const CheckoutSuccess = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [mensaje, setMensaje] = useState("Confirmando tu pago...");
  const [intento, setIntento] = useState(0);

  useEffect(() => {
    // Si no hay usuario autenticado, redirigir al login
    if (user === null) {
      navigate("/auth/login", { replace: true });
      return;
    }

    // Esperar a que useAuth termine de cargar
    if (user === undefined) return;

    const MAX = 6;
    let intentoActual = 0;

    const verificar = async () => {
      try {
        const { data } = await getProfile(user.id);

        if (data?.plan && data.plan !== "free") {
          setMensaje("¡Pago confirmado! Redirigiendo al dashboard...");
          setTimeout(() => navigate("/dashboard"), 1500);
          return;
        }
      } catch (_) {}

      intentoActual += 1;
      setIntento(intentoActual);

      if (intentoActual >= MAX) {
        // Después de 12 segundos sin confirmar, mandar igual al dashboard
        setMensaje("Redirigiendo...");
        setTimeout(() => navigate("/dashboard"), 1000);
        return;
      }

      // Reintentar cada 2 segundos
      setTimeout(verificar, 2000);
    };

    // Primer intento después de 2 segundos (tiempo para que el webhook llegue)
    const timer = setTimeout(verificar, 2000);
    return () => clearTimeout(timer);
  }, [user, navigate]);

  const porcentaje = Math.min((intento / 6) * 100, 100);

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      background: "var(--bg)",
      gap: 24,
      padding: 24,
      textAlign: "center",
    }}>
      {/* Ícono */}
      <div style={{
        width: 72, height: 72, borderRadius: "50%",
        background: "color-mix(in srgb, var(--accent) 12%, transparent)",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <CheckCircle size={36} color="var(--accent)" />
      </div>

      {/* Texto */}
      <div>
        <h2 style={{
          fontFamily: "'Syne', sans-serif",
          fontWeight: 800,
          fontSize: "1.8rem",
          letterSpacing: "-0.04em",
          marginBottom: 8,
          color: "var(--text)",
        }}>
          ¡Pago exitoso!
        </h2>
        <p style={{ color: "var(--muted)", fontSize: "0.9rem" }}>
          {mensaje}
        </p>
      </div>

      {/* Barra de progreso */}
      {intento < 6 && (
        <div style={{ width: 200, display: "flex", flexDirection: "column", gap: 8 }}>
          <div style={{ height: 4, borderRadius: 100, background: "var(--border)", overflow: "hidden" }}>
            <div style={{
              height: "100%",
              borderRadius: 100,
              background: "var(--accent)",
              width: `${porcentaje}%`,
              transition: "width 0.5s ease",
            }} />
          </div>
          <span style={{ fontSize: "0.72rem", color: "var(--muted)", fontFamily: "Syne,sans-serif" }}>
            Verificando con el banco... {intento}/{6}
          </span>
        </div>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default CheckoutSuccess;
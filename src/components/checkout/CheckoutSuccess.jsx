// src/components/checkout/CheckoutSuccess.jsx
// Mercado Pago y Wompi redirigen aquí tras un pago exitoso.
// Espera a que el webhook active el plan y luego manda al dashboard.
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CheckCircle } from "lucide-react";

const CheckoutSuccess = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const gateway = params.get("gateway") || "mercadopago";

  const [intento, setIntento] = useState(0);
  const [mensaje, setMensaje] = useState("Confirmando tu pago...");

  useEffect(() => {
    // El webhook del backend puede tardar 2-5 segundos en procesar.
    // Hacemos polling hasta 5 intentos con 2 segundos entre cada uno.
    const MAX = 5;

    const verificar = async () => {
      try {
        const res = await fetch("/api/payments/subscription", {
          credentials: "include",
        });
        const sub = await res.json();

        if (sub?.status === "active") {
          setMensaje("¡Pago confirmado! Entrando al dashboard...");
          setTimeout(() => navigate("/dashboard"), 1500);
          return;
        }
      } catch (_) {}

      setIntento(prev => {
        const siguiente = prev + 1;
        if (siguiente >= MAX) {
          // Si después de 5 intentos no hay plan, igual manda al dashboard.
          // El ProtectedRoute con requirePlan se encargará de decidir.
          setMensaje("Redirigiendo...");
          setTimeout(() => navigate("/dashboard"), 1000);
        }
        return siguiente;
      });
    };

    // Espera 2 segundos antes del primer intento (tiempo para que el webhook llegue)
    const timer = setTimeout(verificar, 2000);
    return () => clearTimeout(timer);
  }, [intento, navigate]);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--bg)",
        gap: 24,
        padding: 24,
        textAlign: "center",
      }}
    >
      <div
        style={{
          width: 72,
          height: 72,
          borderRadius: "50%",
          background: "color-mix(in srgb, var(--accent) 12%, transparent)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CheckCircle size={36} color="var(--accent)" />
      </div>

      <div>
        <h2
          style={{
            fontFamily: "'Syne', sans-serif",
            fontWeight: 800,
            fontSize: "1.8rem",
            letterSpacing: "-0.04em",
            marginBottom: 8,
          }}
        >
          ¡Pago exitoso!
        </h2>
        <p style={{ color: "var(--muted)", fontSize: "0.9rem" }}>
          {mensaje}
        </p>
      </div>

      {/* Spinner de espera */}
      {intento < 5 && (
        <div
          style={{
            width: 28,
            height: 28,
            border: "2px solid var(--border)",
            borderTopColor: "var(--accent)",
            borderRadius: "50%",
            animation: "spin 0.7s linear infinite",
          }}
        />
      )}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default CheckoutSuccess;
// src/components/auth/ConfirmDeletionPage.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AlertTriangle, Trash2, Loader2 } from "lucide-react";
import AuthLayout from "./AuthLayout";
import { supabase, confirmAccountDeletion } from "../../lib/supabase";
import { useAuth } from "../../hooks/useAuth";

// Página a la que llega el usuario desde el correo de verificación, antes de
// que se borre nada. El correo (plantilla genérica de "Verifica que eres tú")
// no menciona eliminación de cuenta — esta página es la que muestra con
// claridad qué está a punto de pasar, y exige un segundo clic explícito.
const ConfirmDeletionPage = () => {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const [ready, setReady] = useState(false);
  const [status, setStatus] = useState("idle"); // idle | loading | error | done
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    // El link mágico de Supabase crea la sesión automáticamente al cargar.
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/auth/login");
      } else {
        setReady(true);
      }
    });
  }, [navigate]);

  const handleConfirm = async () => {
    setStatus("loading");
    setErrorMsg("");
    const { error } = await confirmAccountDeletion();
    if (error) {
      setErrorMsg(error.message);
      setStatus("error");
      return;
    }
    setStatus("done");
    await signOut();
    setTimeout(() => navigate("/"), 3000);
  };

  if (!ready) return null;

  if (status === "done") {
    return (
      <AuthLayout title="Cuenta eliminada" subtitle="Tu cuenta y todos tus datos fueron eliminados.">
        <div style={{
          padding: 20, borderRadius: 14,
          background: "rgba(0,229,160,0.06)", border: "1px solid rgba(0,229,160,0.18)",
          color: "var(--muted)", fontSize: "0.9rem", lineHeight: 1.6,
        }}>
          Lamentamos verte ir. Tu cuenta, tus CVs y tu información personal ya
          fueron eliminados de nuestros servidores. Te redirigiremos al inicio
          en unos segundos.
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout title="Eliminar tu cuenta" subtitle="Esta es la confirmación final. Por favor lee con atención antes de continuar.">
      <div style={{
        display: "flex", alignItems: "flex-start", gap: 12,
        padding: 18, borderRadius: 14,
        background: "rgba(255,77,109,0.06)", border: "1px solid rgba(255,77,109,0.2)",
        marginBottom: 22,
      }}>
        <AlertTriangle size={20} color="var(--danger)" style={{ flexShrink: 0, marginTop: 2 }} />
        <div style={{ fontSize: "0.88rem", color: "var(--text)", lineHeight: 1.65 }}>
          <strong>Esta acción no se puede deshacer.</strong> Al confirmar, eliminaremos
          permanentemente:
          <ul style={{ margin: "10px 0 0", paddingLeft: 20, color: "var(--muted)" }}>
            <li>Tu cuenta y tus datos de acceso</li>
            <li>Todos tus CVs, incluyendo los publicados (sus links dejarán de funcionar)</li>
            <li>Tu historial de suscripción y pagos</li>
          </ul>
        </div>
      </div>

      {status === "error" && (
        <div style={{
          padding: "10px 14px", borderRadius: 10, marginBottom: 16,
          background: "rgba(255,77,109,0.08)", border: "1px solid rgba(255,77,109,0.2)",
          color: "var(--danger)", fontSize: "0.85rem",
        }}>
          {errorMsg}
        </div>
      )}

      <button
        onClick={handleConfirm}
        disabled={status === "loading"}
        style={{
          width: "100%", padding: "13px", borderRadius: 11, border: "none",
          background: "var(--danger)", color: "#fff",
          fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: "0.92rem",
          cursor: status === "loading" ? "not-allowed" : "pointer",
          display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
          opacity: status === "loading" ? 0.8 : 1,
        }}
      >
        {status === "loading"
          ? <><Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} /> Eliminando cuenta...</>
          : <><Trash2 size={16} /> Sí, eliminar mi cuenta permanentemente</>}
      </button>

      <button
        onClick={() => navigate("/dashboard")}
        disabled={status === "loading"}
        style={{
          width: "100%", padding: "12px", marginTop: 10, borderRadius: 11,
          border: "1px solid var(--border)", background: "transparent",
          color: "var(--muted)", fontFamily: "Syne, sans-serif", fontWeight: 600,
          fontSize: "0.88rem", cursor: status === "loading" ? "not-allowed" : "pointer",
        }}
      >
        Cancelar, quiero conservar mi cuenta
      </button>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </AuthLayout>
  );
};

export default ConfirmDeletionPage;
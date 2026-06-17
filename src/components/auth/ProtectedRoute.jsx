// src/components/auth/ProtectedRoute.jsx
import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { supabase } from "../../lib/supabase";

const Spinner = () => (
  <div style={{
    minHeight: "100vh", display: "flex", alignItems: "center",
    justifyContent: "center", background: "var(--bg)",
  }}>
    <div style={{
      width: 40, height: 40, border: "3px solid var(--border)",
      borderTopColor: "var(--accent)", borderRadius: "50%",
      animation: "spin 0.7s linear infinite",
    }} />
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
  </div>
);

// requirePlan: si es true, además de sesión verifica que tenga plan pro/teams.
// La query de plan SOLO se ejecuta cuando requirePlan=true, evitando
// queries innecesarias a Supabase en páginas que no lo necesitan.
const ProtectedRoute = ({ children, requirePlan = false }) => {
  const { user, loading: authLoading } = useAuth();
  const [plan, setPlan] = useState(null);
  const [planLoading, setPlanLoading] = useState(requirePlan);

  useEffect(() => {
    if (!requirePlan || !user) {
      setPlanLoading(false);
      return;
    }

    let active = true;
    setPlanLoading(true);

    supabase
      .from("profiles")
      .select("plan")
      .eq("id", user.id)
      .single()
      .then(({ data }) => {
        if (!active) return;
        setPlan(data?.plan || "free");
        setPlanLoading(false);
      });

    return () => { active = false; };
  }, [requirePlan, user]);

  // Espera a que cargue auth. Si requirePlan, espera también el plan.
  if (authLoading || (requirePlan && planLoading)) return <Spinner />;

  // Sin sesión → login
  if (!user) return <Navigate to="/auth/login" replace />;

  // Con requirePlan activo y plan free → pricing
  if (requirePlan && plan === "free") {
    return <Navigate to="/pricing" replace />;
  }

  return children;
};

export default ProtectedRoute;
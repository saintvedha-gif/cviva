// src/components/auth/ProtectedRoute.jsx
import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useSubscription } from "../../hooks/useSubscription";

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

// requirePlan: si es true, además de sesión verifica que tenga plan pro/teams
const ProtectedRoute = ({ children, requirePlan = false }) => {
  const { user, loading: authLoading } = useAuth();
  const { plan, loading: planLoading } = useSubscription();

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
// src/hooks/useSubscription.js
import { useState, useEffect } from "react";
import { getProfile } from "../lib/supabase";
import { useAuth } from "./useAuth";

export function useSubscription() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { setLoading(false); return; }
    getProfile(user.id).then(({ data }) => {
      setProfile(data || null);
      setLoading(false);
    });
  }, [user]);

  // El cron de Supabase (supabase/downgrade_expired_plans.sql) corre cada
  // hora y baja plan_expires vencidos a 'free' en la base de datos. Pero
  // entre que el plan vence y el cron corre puede pasar hasta una hora —
  // esta comparación en el cliente cierra ese hueco: si plan_expires ya
  // pasó, tratamos al usuario como 'free' de inmediato en el UI, aunque la
  // fila en la base de datos todavía no se haya actualizado.
  const isExpired = !!(profile?.plan_expires && new Date(profile.plan_expires) < new Date());
  const plan = isExpired ? "free" : (profile?.plan || "free");

  return {
    plan,
    loading,
    isFree: plan === "free",
    isPro: plan === "pro" || plan === "teams",
    isTeams: plan === "teams",
  };
}
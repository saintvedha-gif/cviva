// src/hooks/useSubscription.js
import { useState, useEffect } from "react";
import { getProfile } from "../lib/supabase";
import { useAuth } from "./useAuth";

export function useSubscription() {
  const { user } = useAuth();
  const [plan, setPlan] = useState("free");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { setLoading(false); return; }
    getProfile(user.id).then(({ data }) => {
      if (data?.plan) setPlan(data.plan);
      setLoading(false);
    });
  }, [user]);

  return {
    plan,
    loading,
    isFree: plan === "free",
    isPro: plan === "pro" || plan === "teams",
    isTeams: plan === "teams",
  };
}
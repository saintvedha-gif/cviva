// src/hooks/useCVs.js
import { useState, useEffect, useCallback } from "react";
import { getCVs, deleteCV } from "../lib/supabase";
import { useAuth } from "./useAuth";

export function useCVs() {
  const { user } = useAuth();
  const [cvs, setCVs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCVs = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    const { data, error } = await getCVs(user.id);
    if (error) setError(error.message);
    else setCVs(data || []);
    setLoading(false);
  }, [user]);

  useEffect(() => { fetchCVs(); }, [fetchCVs]);

  const remove = async (id) => {
    await deleteCV(id);
    setCVs(prev => prev.filter(cv => cv.id !== id));
  };

  return { cvs, loading, error, refetch: fetchCVs, remove };
}
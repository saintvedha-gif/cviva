// src/lib/supabase.js
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ── Helpers ──────────────────────────────────────────────────────────────────

// Genera un slug limpio a partir de un nombre o título.
// Ejemplo: "Juan Pérez López" → "juan-perez-lopez-a3f2"
function generateSlug(text) {
  const base = text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // quitar tildes
    .replace(/[^a-z0-9\s-]/g, "")   // solo letras, números, espacios y guiones
    .trim()
    .replace(/\s+/g, "-")            // espacios → guiones
    .replace(/-+/g, "-")             // múltiples guiones → uno
    .slice(0, 40);                   // máximo 40 chars

  // sufijo corto para unicidad (4 chars hex del timestamp)
  const suffix = Date.now().toString(16).slice(-4);
  return `${base}-${suffix}`;
}

// ── CVs ──────────────────────────────────────────────────────────────────────

export async function getCVs(userId) {
  const { data, error } = await supabase
    .from("cvs")
    .select("*")
    .eq("user_id", userId)
    .order("updated_at", { ascending: false });
  return { data, error };
}

export async function getCVById(id) {
  const { data, error } = await supabase
    .from("cvs")
    .select("*")
    .eq("id", id)
    .single();
  return { data, error };
}

export async function getCVBySlug(slug) {
  const { data, error } = await supabase
    .from("cvs")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .single();
  return { data, error };
}

// Crea un CV nuevo. Si se pasa `ownerName` (el nombre real de la persona),
// el slug queda como "juan-perez-a3f2" en vez de "mi-nuevo-cv-17498234..."
export async function createCV(userId, title, ownerName) {
  const slugBase = ownerName && ownerName.trim()
    ? ownerName.trim()
    : title || "mi-cv";
  const slug = generateSlug(slugBase);

  const { data, error } = await supabase
    .from("cvs")
    .insert({ user_id: userId, title, slug })
    .select()
    .single();
  return { data, error };
}

export async function updateCV(id, updates) {
  // Si se actualizó el nombre (cv_data.name), regenerar el slug
  // para que el link público refleje el nombre real de la persona.
  if (updates.cv_data?.name && updates.published) {
    const newSlug = generateSlug(updates.cv_data.name);
    updates = { ...updates, slug: newSlug };
  }

  const { data, error } = await supabase
    .from("cvs")
    .update(updates)
    .eq("id", id)
    .select()
    .single();
  return { data, error };
}

export async function deleteCV(id) {
  const { error } = await supabase.from("cvs").delete().eq("id", id);
  return { error };
}

// ── Profile ───────────────────────────────────────────────────────────────────

export async function getProfile(userId) {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();
  return { data, error };
}

export async function updateProfile(userId, updates) {
  const { data, error } = await supabase
    .from("profiles")
    .update(updates)
    .eq("id", userId)
    .select()
    .single();
  return { data, error };
}

// ── CV Analytics ──────────────────────────────────────────────────────────────

export async function incrementCVViews(cvId) {
  await supabase.rpc("increment_cv_views", { cv_id: cvId });
}

export async function incrementCVDownloads(cvId) {
  await supabase.rpc("increment_cv_downloads", { cv_id: cvId });
}

// ── Storage ───────────────────────────────────────────────────────────────────

export const uploadAvatar = async (userId, file) => {
  const ext = file.name.split(".").pop();
  const path = `${userId}/avatar.${ext}`;
  const { error } = await supabase.storage
    .from("avatars")
    .upload(path, file, { upsert: true });
  if (error) return { error };
  const { data } = supabase.storage.from("avatars").getPublicUrl(path);
  const { error: updateError } = await supabase
    .from("profiles")
    .update({ avatar_url: data.publicUrl })
    .eq("id", userId);
  return { url: data.publicUrl, error: updateError };
};

export const uploadCVPhoto = async (userId, cvId, file) => {
  const ext = file.name.split(".").pop();
  const path = `${userId}/${cvId}.${ext}`;
  const { error } = await supabase.storage
    .from("cv-photos")
    .upload(path, file, { upsert: true });
  if (error) return { error };
  const { data } = supabase.storage.from("cv-photos").getPublicUrl(path);
  return { url: data.publicUrl, error: null };
};
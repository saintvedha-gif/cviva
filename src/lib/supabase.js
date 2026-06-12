// src/lib/supabase.js
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ── CVs ──
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

export async function createCV(userId, title) {
  const slug = `${title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")}-${Date.now()}`;
  const { data, error } = await supabase
    .from("cvs")
    .insert({ user_id: userId, title, slug })
    .select()
    .single();
  return { data, error };
}

export async function updateCV(id, updates) {
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

// ── Profile ──
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
// ── CV Analytics ──
export async function incrementCVViews(cvId) {
  await supabase.rpc("increment_cv_views", { cv_id: cvId });
}

export async function incrementCVDownloads(cvId) {
  await supabase.rpc("increment_cv_downloads", { cv_id: cvId });
}

// Upload foto de perfil
export const uploadAvatar = async (userId, file) => {
  const ext = file.name.split(".").pop();
  const path = `${userId}/avatar.${ext}`;
  const { error } = await supabase.storage.from("avatars").upload(path, file, { upsert: true });
  if (error) return { error };
  const { data } = supabase.storage.from("avatars").getPublicUrl(path);
  const { error: updateError } = await supabase
    .from("profiles")
    .update({ avatar_url: data.publicUrl })
    .eq("id", userId);
  return { url: data.publicUrl, error: updateError };
};

// Upload foto del CV
export const uploadCVPhoto = async (userId, cvId, file) => {
  const ext = file.name.split(".").pop();
  const path = `${userId}/${cvId}.${ext}`;
  const { error } = await supabase.storage.from("cv-photos").upload(path, file, { upsert: true });
  if (error) return { error };
  const { data } = supabase.storage.from("cv-photos").getPublicUrl(path);
  return { url: data.publicUrl, error: null };
};
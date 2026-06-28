// supabase/functions/delete-account/index.ts
//
// Borra la cuenta del usuario que llama a esta función.
//
// Por qué existe: eliminar un usuario de auth.users requiere la
// service_role key, que nunca debe estar en el navegador. Esta función
// vive en el servidor (Supabase Edge Functions), recibe el token de sesión
// del usuario, confirma que es válido, y solo entonces borra esa cuenta
// específica — nunca otra.
//
// Gracias a "ON DELETE CASCADE" ya configurado en profiles, cvs y payments
// (ver schema.sql), borrar el usuario de auth.users borra automáticamente
// su perfil, sus CVs y su historial de pagos. No hace falta borrar cada
// tabla a mano aquí.
//
// Variables de entorno necesarias (configurar en Supabase → Edge Functions
// → delete-account → Secrets):
//   SUPABASE_URL              (ya existe por defecto en el proyecto)
//   SUPABASE_SERVICE_ROLE_KEY (ya existe por defecto en el proyecto)
// Ninguna de las dos hay que crearla manualmente: Supabase las inyecta
// automáticamente a todas las Edge Functions del proyecto.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: CORS_HEADERS });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
    });
  }

  const authHeader = req.headers.get("Authorization") ?? "";
  const jwt = authHeader.replace("Bearer ", "").trim();

  if (!jwt) {
    return new Response(JSON.stringify({ error: "No autenticado" }), {
      status: 401,
      headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
    });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

  if (!supabaseUrl || !serviceRoleKey) {
    console.error("Faltan variables de entorno SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY");
    return new Response(JSON.stringify({ error: "Configuración del servidor incompleta" }), {
      status: 500,
      headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
    });
  }

  // Cliente con service_role: puede administrar usuarios, pero antes
  // verificamos abajo que el JWT recibido es de un usuario real y válido.
  const adminClient = createClient(supabaseUrl, serviceRoleKey);

  // Verifica el JWT del usuario que está llamando a esta función.
  // Esto es lo que evita que cualquiera borre la cuenta de otra persona:
  // solo se borra el usuario al que pertenece este token, nunca uno distinto.
  const { data: userData, error: userError } = await adminClient.auth.getUser(jwt);

  if (userError || !userData?.user) {
    return new Response(JSON.stringify({ error: "Sesión inválida o expirada" }), {
      status: 401,
      headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
    });
  }

  const userId = userData.user.id;

  const { error: deleteError } = await adminClient.auth.admin.deleteUser(userId);

  if (deleteError) {
    console.error("Error al eliminar usuario:", deleteError.message);
    return new Response(JSON.stringify({ error: "No se pudo eliminar la cuenta" }), {
      status: 500,
      headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
    });
  }

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
  });
});
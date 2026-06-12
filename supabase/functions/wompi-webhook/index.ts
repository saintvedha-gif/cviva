// Use the Deno global `serve` (no remote std import required)
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
 
// Duración del plan en días según periodo
const PERIOD_DAYS: Record<string, number> = {
  quincenal: 15,
  mensual: 30,
  anual: 365,
};
 
// Mapeo de referencia Wompi → plan y periodo
// Las referencias en PricingPage.jsx son: cviva_pro_mensual_{userId}_{ts}
//                                          cviva_teams_mensual_{userId}_{ts}
function parsearReferencia(ref: string): { plan: string; periodo: string; userId: string } | null {
  // Formato: cviva_{plan}_{periodo}_{userId}_{timestamp}
  const partes = ref.split("_");
  if (partes.length < 5 || partes[0] !== "cviva") return null;
  return {
    plan:    partes[1],           // "pro" | "teams"
    periodo: partes[2],           // "mensual" | "quincenal" | "anual"
    userId:  partes.slice(3, -1).join("_"), // UUID del usuario
  };
}
 
Deno.serve(async (req) => {
  // Wompi solo envía POST
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }
 
  let body: any;
  try {
    body = await req.json();
  } catch {
    return new Response("Invalid JSON", { status: 400 });
  }
 
  // ── Verificar firma de Wompi ──────────────────────────────────────────────
  // Wompi envía: body.data + body.timestamp + body.event
  // Firma: SHA256(properties + timestamp + eventsKey)
  const eventsKey = Deno.env.get("WOMPI_EVENTS_KEY") ?? "";
  const checksum  = req.headers.get("x-event-checksum") ?? "";
 
  if (eventsKey && checksum) {
    const encoder   = new TextEncoder();
    const dataStr   = JSON.stringify(body.data) + body.timestamp + eventsKey;
    const keyData   = encoder.encode(eventsKey);
    const msgData   = encoder.encode(dataStr);
    const cryptoKey = await crypto.subtle.importKey("raw", keyData, { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
    const sig       = await crypto.subtle.sign("HMAC", cryptoKey, msgData);
    const sigHex    = Array.from(new Uint8Array(sig)).map(b => b.toString(16).padStart(2, "0")).join("");
 
    if (sigHex !== checksum) {
      console.error("Wompi checksum inválido");
      return new Response("Unauthorized", { status: 401 });
    }
  }
 
  // ── Procesar evento ───────────────────────────────────────────────────────
  const evento      = body.event;
  const transaccion = body.data?.transaction;
 
  console.log(`Evento: ${evento} | Status: ${transaccion?.status} | Ref: ${transaccion?.reference}`);
 
  // Solo nos interesa cuando una transacción se aprueba
  if (evento !== "transaction.updated" || transaccion?.status !== "APPROVED") {
    return new Response(JSON.stringify({ ok: true, skipped: true }), {
      headers: { "Content-Type": "application/json" },
    });
  }
 
  // Parsear la referencia para obtener userId, plan y periodo
  const parsed = parsearReferencia(transaccion.reference ?? "");
  if (!parsed) {
    console.error(`Referencia no parseable: ${transaccion.reference}`);
    return new Response(JSON.stringify({ ok: false, error: "Referencia inválida" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
 
  const { userId, plan, periodo } = parsed;
  const dias      = PERIOD_DAYS[periodo] ?? 30;
  const ahora     = new Date();
  const vencimiento = new Date(ahora.getTime() + dias * 86400000);
 
  // ── Actualizar Supabase ───────────────────────────────────────────────────
  // Usa la SERVICE_ROLE key (no la anon key) para hacer updates sin RLS
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );
 
  // 1. Actualizar tabla profiles con el nuevo plan
  const { error: profileError } = await supabase
    .from("profiles")
    .update({
      plan,
      plan_period:   periodo,
      plan_expires:  vencimiento.toISOString(),
      plan_updated:  ahora.toISOString(),
    })
    .eq("id", userId);
 
  if (profileError) {
    console.error("Error actualizando profile:", profileError);
    return new Response(JSON.stringify({ ok: false, error: profileError.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
 
  // 2. Registrar el pago en tabla payments (opcional pero recomendado para auditoría)
  await supabase.from("payments").insert({
    user_id:        userId,
    plan,
    period:         periodo,
    gateway:        "wompi",
    gateway_tx_id:  transaccion.id,
    amount_cents:   transaccion.amount_in_cents,
    currency:       transaccion.currency,
    status:         "approved",
    paid_at:        ahora.toISOString(),
  });
 
  console.log(`Plan activado: ${userId} → ${plan}/${periodo} hasta ${vencimiento.toISOString()}`);
 
  return new Response(JSON.stringify({ ok: true, userId, plan, periodo }), {
    headers: { "Content-Type": "application/json" },
  });
});
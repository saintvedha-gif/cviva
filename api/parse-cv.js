// api/parse-cv.js
export const config = { runtime: "edge" };

const rateMap = new Map();
const RATE_LIMIT  = 10;
const RATE_WINDOW = 60000;

function checkRateLimit(ip) {
  const now = Date.now();
  const entry = rateMap.get(ip) || { count: 0, start: now };
  if (now - entry.start > RATE_WINDOW) {
    rateMap.set(ip, { count: 1, start: now });
    return true;
  }
  if (entry.count >= RATE_LIMIT) return false;
  rateMap.set(ip, { count: entry.count + 1, start: entry.start });
  return true;
}

const ALLOWED_ORIGINS = [
  "https://cviva-nine.vercel.app",
  "http://localhost:5173",
  "http://localhost:3000",
];

function getAllowedOrigin(requestOrigin) {
  if (!requestOrigin) return ALLOWED_ORIGINS[0];
  if (ALLOWED_ORIGINS.includes(requestOrigin)) return requestOrigin;
  if (requestOrigin.endsWith(".vercel.app")) return requestOrigin;
  return null;
}

function corsHeaders(origin) {
  return {
    "Access-Control-Allow-Origin":  origin || ALLOWED_ORIGINS[0],
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}

// Prompt compartido entre el intento inicial y el reintento — cualquier
// perfil (mesero, domiciliario, desarrollador, contador, lo que sea) debe
// mapear igual de bien a este esquema, porque los campos son genéricos.
function buildPrompt(text, { strict = false } = {}) {
  const strictNote = strict
    ? "\n\nMUY IMPORTANTE: tu respuesta anterior no fue JSON válido. Esta vez responde ÚNICAMENTE con el objeto JSON, empezando en '{' y terminando en '}'. Ni una sola palabra antes o después, ni explicaciones, ni comentarios, ni backticks."
    : "";

  return `Extrae la información de esta hoja de vida y devuelve ÚNICAMENTE un objeto JSON válido, sin texto adicional, sin backticks, sin explicaciones. Esta hoja de vida puede ser de cualquier profesión u oficio (operativo, administrativo, técnico, comercial, etc.) — extrae lo que exista, sin importar el rubro. Si un campo no existe en el CV déjalo como null o array vacío [].${strictNote}

{
  "name": "nombre completo",
  "role": "cargo o título profesional",
  "photo": null,
  "email": "email o null",
  "phone": "teléfono o null",
  "location": "ciudad, país o null",
  "linkedin": "url linkedin sin https:// o null",
  "github": "url github sin https:// o null",
  "portfolio": "url portfolio sin https:// o null",
  "summary": "resumen profesional 2-3 oraciones o null",
  "experience": [
    {
      "id": 1,
      "company": "empresa",
      "role": "cargo",
      "period": "2022 - Presente",
      "description": "descripción general",
      "responsibilities": ["responsabilidad 1", "responsabilidad 2"]
    }
  ],
  "education": [
    {
      "id": 1,
      "institution": "institución",
      "degree": "título o carrera",
      "period": "período",
      "description": "descripción o logros o null"
    }
  ],
  "skills": [
    { "name": "skill", "level": 4, "category": "technical", "description": null }
  ],
  "certifications": [
    { "id": 1, "name": "nombre cert", "institution": "institución", "period": "año", "description": null, "url": null }
  ],
  "projects": [
    { "id": 1, "title": "nombre", "role": "rol", "description": "descripción", "technologies": ["tech1"], "url": null }
  ],
  "languages": [
    { "name": "Español", "level": "Nativo" }
  ],
  "references": [],
  "extraSections": []
}

Notas:
- Para skills, nivel va de 1 (básico) a 5 (experto). Si no hay nivel claro usa 3.
- Para skills category usa "technical" para técnicas/operativas del oficio y "soft" para blandas.
- Si hay secciones que no encajan (voluntariado, publicaciones, premios, referencias personales con teléfono, jefes inmediatos, etc.) agrégalas en extraSections: { "id": "voluntariado", "title": "Voluntariado", "items": [{ "title": "título", "subtitle": "organización", "description": "descripción" }] }

Hoja de vida:
${text.slice(0, 10000)}`;
}

// Extrae el objeto JSON de la respuesta de Claude de forma tolerante:
// 1. Quita backticks/fences si los hay.
// 2. En vez de asumir que TODO el string es JSON puro, recorta desde el
//    primer '{' hasta el último '}' — así, si Claude agrega una palabra
//    de más antes o después (pasa ocasionalmente, más con CVs largos/
//    detallados), igual podemos rescatar el JSON válido que está en medio.
function extractJSON(raw) {
  if (!raw) return null;
  const cleaned = raw.replace(/```json|```/g, "").trim();
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");
  if (start === -1 || end === -1 || end < start) return null;
  const candidate = cleaned.slice(start, end + 1);
  try {
    return JSON.parse(candidate);
  } catch {
    return null;
  }
}

// Llama a Anthropic una vez. Devuelve { parsed, truncated, raw } o lanza
// si la llamada HTTP en sí falla (red, 5xx, etc — eso no se reintenta aquí,
// lo maneja el catch de más afuera).
async function callAnthropic(apiKey, text, { strict = false } = {}) {
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-6",
      max_tokens: 16000,
      messages: [{ role: "user", content: buildPrompt(text, { strict }) }],
    }),
  });

  if (!response.ok) {
    const errBody = await response.text();
    console.error("Anthropic error:", response.status, errBody);
    throw new Error("ANTHROPIC_HTTP_ERROR");
  }

  const data = await response.json();
  const raw  = data.content?.[0]?.text || "";
  const truncated = data.stop_reason === "max_tokens";

  return { parsed: truncated ? null : extractJSON(raw), truncated, raw };
}

export default async function handler(req) {
  const requestOrigin = req.headers.get("origin") || "";
  const allowedOrigin = getAllowedOrigin(requestOrigin);

  if (req.method === "OPTIONS") {
    if (!allowedOrigin) return new Response("Forbidden", { status: 403 });
    return new Response(null, { status: 204, headers: corsHeaders(allowedOrigin) });
  }

  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405, headers: corsHeaders(allowedOrigin) });
  }

  if (!allowedOrigin) {
    return new Response(
      JSON.stringify({ error: "Origen no permitido" }),
      { status: 403, headers: { "Content-Type": "application/json" } }
    );
  }

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("cf-connecting-ip") ||
    "unknown";

  if (!checkRateLimit(ip)) {
    return new Response(
      JSON.stringify({ error: "Demasiadas solicitudes. Espera un momento e intenta de nuevo." }),
      {
        status: 429,
        headers: {
          ...corsHeaders(allowedOrigin),
          "Content-Type": "application/json",
          "Retry-After": "60",
        },
      }
    );
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return new Response(
      JSON.stringify({ error: "Servicio no configurado. Contacta al administrador." }),
      { status: 503, headers: { ...corsHeaders(allowedOrigin), "Content-Type": "application/json" } }
    );
  }

  let text;
  try {
    const body = await req.json();
    text = body?.text;
    if (!text || typeof text !== "string" || text.trim().length === 0) {
      return new Response(
        JSON.stringify({ error: "El campo 'text' es requerido y no puede estar vacío." }),
        { status: 400, headers: { ...corsHeaders(allowedOrigin), "Content-Type": "application/json" } }
      );
    }
  } catch {
    return new Response(
      JSON.stringify({ error: "JSON inválido en el body." }),
      { status: 400, headers: { ...corsHeaders(allowedOrigin), "Content-Type": "application/json" } }
    );
  }

  try {
    // Intento 1: prompt normal.
    let { parsed, truncated, raw } = await callAnthropic(apiKey, text);

    // Si quedó truncado por max_tokens, no tiene sentido reintentar igual
    // (volvería a truncarse) — avisamos directo con mensaje claro.
    if (truncated) {
      console.error("parse-cv: respuesta truncada por max_tokens incluso con 16000");
      return new Response(
        JSON.stringify({ error: "El CV es muy extenso y la IA no alcanzó a procesarlo completo. Intenta con un CV más breve o divídelo en secciones." }),
        { status: 502, headers: { ...corsHeaders(allowedOrigin), "Content-Type": "application/json" } }
      );
    }

    // Si el JSON no se pudo extraer (Claude agregó texto extra, formato
    // raro, etc.), reintentamos UNA vez con el prompt en modo estricto
    // antes de rendirnos. Esto cubre el caso más común: una respuesta
    // no-determinística que en el segundo intento sale limpia.
    if (!parsed) {
      console.error("parse-cv: JSON inválido en intento 1, reintentando en modo estricto. Raw:", raw.slice(0, 500));
      const retry = await callAnthropic(apiKey, text, { strict: true });
      parsed = retry.parsed;
      if (retry.truncated) {
        return new Response(
          JSON.stringify({ error: "El CV es muy extenso y la IA no alcanzó a procesarlo completo. Intenta con un CV más breve o divídelo en secciones." }),
          { status: 502, headers: { ...corsHeaders(allowedOrigin), "Content-Type": "application/json" } }
        );
      }
      if (!parsed) {
        console.error("parse-cv: JSON inválido también en el reintento. Raw:", retry.raw.slice(0, 500));
      }
    }

    if (!parsed) {
      return new Response(
        JSON.stringify({ error: "La IA no pudo extraer información estructurada de este CV. Intenta de nuevo — a veces funciona en el segundo intento — o complétalo manualmente." }),
        { status: 502, headers: { ...corsHeaders(allowedOrigin), "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ result: parsed }),
      {
        status: 200,
        headers: { ...corsHeaders(allowedOrigin), "Content-Type": "application/json" },
      }
    );

  } catch (err) {
    console.error("parse-cv error:", err);
    return new Response(
      JSON.stringify({ error: "Error al procesar el CV. Intenta de nuevo." }),
      { status: 502, headers: { ...corsHeaders(allowedOrigin), "Content-Type": "application/json" } }
    );
  }
}
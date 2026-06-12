// api/parse-cv.js
export const config = { runtime: "edge" };

export default async function handler(req) {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  }

  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  try {
    const { text } = await req.json();

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 1000,
        messages: [
          {
            role: "user",
            content: `Extrae la información de esta hoja de vida y devuelve ÚNICAMENTE un objeto JSON válido, sin texto adicional, sin backticks, sin explicaciones. Si un campo no existe en el CV déjalo como null o array vacío [].

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
    { "id": 1, "title": "nombre", "role": "rol en el proyecto", "description": "descripción", "technologies": ["tech1"], "url": null }
  ],
  "languages": [
    { "name": "Español", "level": "Nativo" }
  ],
  "references": [],
  "extraSections": []
}

Notas importantes:
- Para skills, nivel va de 1 (básico) a 5 (experto). Si no hay nivel claro, usa 3.
- Para skills category usa "technical" para técnicas y "soft" para blandas.
- Si hay secciones que no encajan en ninguna categoría (voluntariado, publicaciones, premios, etc), agrégalas en extraSections con este formato: { "id": "voluntariado", "title": "Voluntariado", "items": [{ "title": "título", "subtitle": "organización", "description": "descripción" }] }
- Para responsibilities extrae los bullets o logros de cada experiencia como array de strings.

Hoja de vida:
${text.slice(0, 10000)}`,
          },
        ],
      }),
    });

    const data = await response.json();
    const raw = data.content?.[0]?.text || "{}";

    let parsed;
    try {
      parsed = JSON.parse(raw.replace(/```json|```/g, "").trim());
    } catch {
      parsed = null;
    }

    return new Response(JSON.stringify({ result: parsed }), {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  }
}
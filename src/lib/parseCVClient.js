// src/lib/parseCVClient.js
//
// Este archivo corre en el NAVEGADOR (cliente). Su trabajo es:
//   1. Extraer texto plano de un archivo PDF o Word subido por el usuario.
//   2. Enviar ese texto al endpoint /api/parse-cv (Edge Function en el servidor)
//      que es quien realmente llama a la API de Anthropic.
//
// IMPORTANTE: nunca llames a la API de Anthropic directamente desde aquí.
// La ANTHROPIC_API_KEY vive solo en el servidor (api/parse-cv.js) y no debe
// llegar nunca al bundle del frontend.

import * as pdfjsLib from "pdfjs-dist";
import mammoth from "mammoth";

// pdfjs necesita un worker. Usamos el que viene empaquetado con la librería.
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

/**
 * Extrae texto plano de un archivo PDF o Word (.doc/.docx).
 * @param {File} file
 * @returns {Promise<string>}
 */
export async function extractTextFromFile(file) {
  const name = file.name.toLowerCase();

  if (name.endsWith(".pdf")) {
    return extractTextFromPDF(file);
  }

  if (name.endsWith(".docx") || name.endsWith(".doc")) {
    return extractTextFromWord(file);
  }

  throw new Error("Formato no soportado. Sube un archivo PDF, DOC o DOCX.");
}

async function extractTextFromPDF(file) {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

  let fullText = "";
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const pageText = content.items.map((item) => item.str).join(" ");
    fullText += pageText + "\n\n";
  }

  if (!fullText.trim()) {
    throw new Error("No se pudo leer texto del PDF. ¿Es un escaneo de imagen?");
  }

  return fullText.trim();
}

async function extractTextFromWord(file) {
  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer });

  if (!result.value || !result.value.trim()) {
    throw new Error("No se pudo extraer texto del documento Word.");
  }

  return result.value.trim();
}

/**
 * Envía el texto extraído al endpoint del servidor para que la IA lo procese.
 * @param {string} text
 * @returns {Promise<object>} CV parseado en formato estructurado
 */
export async function parseWithAI(text) {
  const response = await fetch("/api/parse-cv", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });

  if (!response.ok) {
    let message = "Error al procesar el CV con IA.";
    try {
      const errBody = await response.json();
      if (errBody?.error) message = errBody.error;
    } catch {
      // si la respuesta no es JSON, usamos el mensaje genérico
    }
    throw new Error(message);
  }

  const data = await response.json();

  if (!data.result) {
    throw new Error("La IA no pudo extraer información estructurada de este CV.");
  }

  return data.result;
}
// src/lib/parseCV.js

export async function extractTextFromFile(file) {
  const ext = file.name.split(".").pop().toLowerCase();
  if (ext === "pdf") return await extractFromPDF(file);
  if (ext === "docx" || ext === "doc") return await extractFromWord(file);
  throw new Error("Formato no soportado. Usa PDF o Word (.docx)");
}

async function extractFromPDF(file) {
  const pdfjsLib = await import("pdfjs-dist");
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  let text = "";
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    text += content.items.map((item) => item.str).join(" ") + "\n";
  }
  return text;
}

async function extractFromWord(file) {
  const mammoth = await import("mammoth");
  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer });
  return result.value;
}

export async function parseWithAI(rawText) {
  const response = await fetch("/api/parse-cv", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text: rawText }),
  });
  if (!response.ok) throw new Error("Error al procesar con IA");
  const data = await response.json();
  if (!data.result) throw new Error("No se pudo extraer la información del CV");
  return data.result;
}
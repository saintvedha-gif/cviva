// src/lib/exportPDF.js
// npm install html2canvas jspdf

import html2canvas from "html2canvas";
import jsPDF from "jspdf";

// ── PDF visual (diseño exacto) ────────────────────────────────────────────────
// Rasteriza el DOM de la vista previa a una imagen y la mete en el PDF.
// Útil para plantillas con diseño visual (interactiva / portafolio), pero
// el resultado NO tiene texto seleccionable: un sistema ATS no puede leerlo.
// Por eso esta función requiere que el elemento de vista previa exista en
// el DOM (solo pasa dentro del editor, donde se renderiza la preview).
//
// FIX (auditoría, punto crítico #1): el contenedor #cv-preview tiene
// maxHeight + overflowY: auto en CVEditorPage.jsx para poder hacer scroll
// dentro del editor. html2canvas rasteriza el DOM tal como está, así que
// si no quitamos ese límite antes de capturar, solo se ve la parte
// visible/scrolleada del CV en el PDF final. Por eso aquí:
//   1. Guardamos el maxHeight y overflowY originales del elemento.
//   2. Los quitamos temporalmente (el navegador entonces renderiza el
//      CV completo, sin importar cuán largo sea).
//   3. Capturamos con html2canvas usando windowHeight/height = scrollHeight
//      para asegurar que el canvas cubra todo el contenido, no solo el
//      viewport.
//   4. Restauramos los estilos originales inmediatamente, en un finally,
//      para que el editor se vea exactamente igual que antes aunque la
//      exportación falle a mitad de camino.
export async function exportToPDF(elementId, fileName = "cv.pdf") {
  const el = document.getElementById(elementId);
  if (!el) throw new Error("Element not found");

  const prevMaxHeight = el.style.maxHeight;
  const prevOverflowY = el.style.overflowY;

  try {
    el.style.maxHeight = "none";
    el.style.overflowY = "visible";

    const canvas = await html2canvas(el, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#080C12",
      logging: false,
      windowHeight: el.scrollHeight,
      height: el.scrollHeight,
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const pageW = pdf.internal.pageSize.getWidth();
    const pageH = pdf.internal.pageSize.getHeight();
    const ratio = canvas.width / canvas.height;
    const imgH = pageW / ratio;

    let heightLeft = imgH;
    let position = 0;

    pdf.addImage(imgData, "PNG", 0, position, pageW, imgH);
    heightLeft -= pageH;

    while (heightLeft > 0) {
      position = heightLeft - imgH;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, position, pageW, imgH);
      heightLeft -= pageH;
    }

    pdf.save(fileName);
  } finally {
    el.style.maxHeight = prevMaxHeight;
    el.style.overflowY = prevOverflowY;
  }
}

// ── PDF compatible con ATS (texto real) ───────────────────────────────────────
// Construye el PDF escribiendo texto directamente con jsPDF, sin pasar por
// imagen. El resultado es texto seleccionable y copiable, en una sola columna,
// con fuente estándar (Helvetica) y sin elementos gráficos — el formato que
// los sistemas de seguimiento de candidatos (ATS) pueden leer correctamente.
// No depende del DOM: solo necesita el objeto cvData, así que funciona desde
// cualquier pantalla (editor, lista de CVs, vista pública), no solo dentro
// del editor.

function skillNameATS(s) {
  if (typeof s === "string") return s;
  if (s && typeof s === "object" && s.name) return s.name;
  return "";
}

export async function exportToATSPDF(cvData, fileName = "cv.pdf") {
  const {
    name = "",
    role = "",
    email = "",
    phone = "",
    location = "",
    linkedin = "",
    github = "",
    portfolio = "",
    summary = "",
    experience = [],
    education = [],
    skills = [],
    certifications = [],
    projects = [],
    languages = [],
  } = cvData || {};

  const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

  const marginX = 18;
  const pageW = pdf.internal.pageSize.getWidth();
  const pageH = pdf.internal.pageSize.getHeight();
  const contentW = pageW - marginX * 2;
  const bottomLimit = pageH - 18;

  let y = 20;

  // Avanza a una nueva página si no queda espacio suficiente para "needed" mm
  const ensureSpace = (needed) => {
    if (y + needed > bottomLimit) {
      pdf.addPage();
      y = 20;
    }
  };

  const writeLines = (text, { fontSize = 10, fontStyle = "normal", lineGap = 4.6, gapAfter = 2 } = {}) => {
    if (!text) return;
    pdf.setFont("helvetica", fontStyle);
    pdf.setFontSize(fontSize);
    const lines = pdf.splitTextToSize(String(text), contentW);
    lines.forEach((line) => {
      ensureSpace(lineGap);
      pdf.text(line, marginX, y);
      y += lineGap;
    });
    y += gapAfter;
  };

  const writeSectionTitle = (title) => {
    ensureSpace(9);
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(11.5);
    pdf.setTextColor(20, 20, 20);
    pdf.text(title.toUpperCase(), marginX, y);
    y += 1.5;
    ensureSpace(2);
    pdf.setDrawColor(180, 180, 180);
    pdf.line(marginX, y, marginX + contentW, y);
    y += 6;
    pdf.setTextColor(0, 0, 0);
  };

  // ── Encabezado ──
  pdf.setTextColor(0, 0, 0);
  writeLines(name || "Sin nombre", { fontSize: 18, fontStyle: "bold", lineGap: 6.5, gapAfter: 1 });
  if (role) writeLines(role, { fontSize: 11.5, fontStyle: "normal", lineGap: 5.5, gapAfter: 1 });

  const contactParts = [email, phone, location, linkedin, github, portfolio].filter(Boolean);
  if (contactParts.length) {
    writeLines(contactParts.join("  |  "), { fontSize: 9.5, lineGap: 4.6, gapAfter: 4 });
  }

  ensureSpace(2);
  pdf.setDrawColor(120, 120, 120);
  pdf.line(marginX, y, marginX + contentW, y);
  y += 7;

  // ── Perfil profesional ──
  if (summary) {
    writeSectionTitle("Perfil Profesional");
    writeLines(summary, { fontSize: 10, lineGap: 4.8, gapAfter: 5 });
  }

  // ── Experiencia ──
  if (experience.length) {
    writeSectionTitle("Experiencia");
    experience.forEach((exp) => {
      const header = [exp.company, exp.period].filter(Boolean).join("  —  ");
      if (header) writeLines(header, { fontSize: 10.5, fontStyle: "bold", lineGap: 5, gapAfter: 0.5 });
      if (exp.role) writeLines(exp.role, { fontSize: 10, fontStyle: "italic", lineGap: 4.8, gapAfter: 1 });
      if (exp.description) writeLines(exp.description, { fontSize: 9.8, lineGap: 4.6, gapAfter: 1 });
      (exp.responsibilities || []).filter(Boolean).forEach((resp) => {
        writeLines(`•  ${resp}`, { fontSize: 9.8, lineGap: 4.6, gapAfter: 0.5 });
      });
      y += 3;
    });
  }

  // ── Educación ──
  if (education.length) {
    writeSectionTitle("Educación");
    education.forEach((edu) => {
      const header = [edu.institution, edu.period].filter(Boolean).join("  —  ");
      if (header) writeLines(header, { fontSize: 10.5, fontStyle: "bold", lineGap: 5, gapAfter: 0.5 });
      if (edu.degree) writeLines(edu.degree, { fontSize: 10, lineGap: 4.8, gapAfter: 0.5 });
      if (edu.description) writeLines(edu.description, { fontSize: 9.8, lineGap: 4.6, gapAfter: 1 });
      y += 2;
    });
  }

  // ── Habilidades ──
  const skillNames = skills.map(skillNameATS).filter(Boolean);
  if (skillNames.length) {
    writeSectionTitle("Habilidades");
    writeLines(skillNames.join("  ·  "), { fontSize: 9.8, lineGap: 4.6, gapAfter: 5 });
  }

  // ── Certificaciones ──
  if (certifications?.length) {
    writeSectionTitle("Certificaciones");
    certifications.forEach((cert) => {
      const header = [cert.name, cert.institution].filter(Boolean).join("  —  ");
      if (header) writeLines(header, { fontSize: 10, fontStyle: "bold", lineGap: 4.8, gapAfter: 0.5 });
      if (cert.period) writeLines(cert.period, { fontSize: 9.5, lineGap: 4.4, gapAfter: 1 });
      y += 2;
    });
  }

  // ── Proyectos ──
  if (projects?.length) {
    writeSectionTitle("Proyectos");
    projects.forEach((proj) => {
      const header = [proj.title, proj.role].filter(Boolean).join("  —  ");
      if (header) writeLines(header, { fontSize: 10, fontStyle: "bold", lineGap: 4.8, gapAfter: 0.5 });
      if (proj.description) writeLines(proj.description, { fontSize: 9.8, lineGap: 4.6, gapAfter: 0.5 });
      if (proj.technologies?.length) writeLines(proj.technologies.join(", "), { fontSize: 9.3, fontStyle: "italic", lineGap: 4.4, gapAfter: 1 });
      y += 2;
    });
  }

  // ── Idiomas ──
  if (languages?.length) {
    writeSectionTitle("Idiomas");
    writeLines(languages.map((l) => `${l.name} (${l.level})`).join("  ·  "), { fontSize: 9.8, lineGap: 4.6, gapAfter: 2 });
  }

  pdf.save(fileName);
}
// src/lib/exportWord.js
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  BorderStyle,
  SectionType,
} from "docx";
import { saveAs } from "file-saver";

function buildSection(title, items = []) {
  return [
    new Paragraph({
      text: title.toUpperCase(),
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 280, after: 120 },
      border: {
        bottom: { style: BorderStyle.SINGLE, size: 6, color: "00E5FF" },
      },
    }),
    ...items,
  ];
}

// Normaliza un skill que puede ser string u objeto { name, level, category }
function skillName(s) {
  if (typeof s === "string") return s;
  if (s && typeof s === "object" && s.name) return s.name;
  return "";
}

export async function exportToWord(cvData, fileName = "cv.docx") {
  const {
    name = "",
    role = "",
    email = "",
    phone = "",
    location = "",
    linkedin = "",
    summary = "",
    experience = [],
    education = [],
    skills = [],
    certifications = [],
    projects = [],
    languages = [],
  } = cvData || {};

  // Filtrar skills vacíos y normalizar nombres
  const skillNames = skills
    .map(skillName)
    .filter(Boolean);

  const doc = new Document({
    sections: [
      {
        properties: { type: SectionType.CONTINUOUS },
        children: [
          // ── Nombre ──
          new Paragraph({
            children: [
              new TextRun({
                text: name || "Sin nombre",
                bold: true,
                size: 48,
                color: "00E5FF",
                font: "Calibri",
              }),
            ],
            alignment: AlignmentType.LEFT,
            spacing: { after: 80 },
          }),

          // ── Cargo ──
          new Paragraph({
            children: [
              new TextRun({
                text: role,
                size: 26,
                color: "6B7E9F",
                font: "Calibri",
              }),
            ],
            spacing: { after: 120 },
          }),

          // ── Contacto ──
          new Paragraph({
            children: [
              email    ? new TextRun({ text: email,    size: 20, font: "Calibri" }) : null,
              email && phone    ? new TextRun({ text: "  ·  ", size: 20, color: "6B7E9F" }) : null,
              phone    ? new TextRun({ text: phone,    size: 20, font: "Calibri" }) : null,
              location ? new TextRun({ text: "  ·  " + location, size: 20, color: "6B7E9F" }) : null,
              linkedin ? new TextRun({ text: "  ·  " + linkedin, size: 20, color: "0062FF" }) : null,
            ].filter(Boolean),
            spacing: { after: 60 },
          }),

          // ── Separador ──
          new Paragraph({
            border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: "1E2D45" } },
            spacing: { after: 200 },
          }),

          // ── Perfil profesional ──
          ...(summary
            ? buildSection("Perfil Profesional", [
                new Paragraph({
                  children: [new TextRun({ text: summary, size: 20, font: "Calibri" })],
                  spacing: { after: 80 },
                }),
              ])
            : []),

          // ── Experiencia ──
          ...(experience.length
            ? buildSection(
                "Experiencia",
                experience.flatMap((exp) => [
                  new Paragraph({
                    children: [
                      new TextRun({ text: exp.company || "", bold: true, size: 22, font: "Calibri" }),
                      exp.period ? new TextRun({ text: "  —  " + exp.period, size: 20, color: "6B7E9F" }) : null,
                    ].filter(Boolean),
                    spacing: { before: 160, after: 40 },
                  }),
                  new Paragraph({
                    children: [
                      new TextRun({ text: exp.role || "", size: 21, color: "00E5FF", font: "Calibri" }),
                    ],
                    spacing: { after: 60 },
                  }),
                  exp.description
                    ? new Paragraph({
                        children: [new TextRun({ text: exp.description, size: 20, font: "Calibri" })],
                        spacing: { after: 60 },
                      })
                    : null,
                  // Responsabilidades
                  ...(exp.responsibilities?.filter(r => r) || []).map(resp =>
                    new Paragraph({
                      children: [
                        new TextRun({ text: "• ", size: 20, color: "00E5FF" }),
                        new TextRun({ text: resp, size: 20, font: "Calibri" }),
                      ],
                      spacing: { after: 30 },
                    })
                  ),
                ].filter(Boolean))
              )
            : []),

          // ── Educación ──
          ...(education.length
            ? buildSection(
                "Educación",
                education.flatMap((edu) => [
                  new Paragraph({
                    children: [
                      new TextRun({ text: edu.institution || "", bold: true, size: 22, font: "Calibri" }),
                      edu.period ? new TextRun({ text: "  ·  " + edu.period, size: 20, color: "6B7E9F" }) : null,
                    ].filter(Boolean),
                    spacing: { before: 160, after: 40 },
                  }),
                  new Paragraph({
                    children: [new TextRun({ text: edu.degree || "", size: 21, font: "Calibri" })],
                    spacing: { after: edu.description ? 30 : 60 },
                  }),
                  edu.description
                    ? new Paragraph({
                        children: [new TextRun({ text: edu.description, size: 20, color: "6B7E9F", font: "Calibri" })],
                        spacing: { after: 60 },
                      })
                    : null,
                ].filter(Boolean))
              )
            : []),

          // ── Habilidades ──
          ...(skillNames.length
            ? buildSection("Habilidades", [
                new Paragraph({
                  children: skillNames.flatMap((s, i) => [
                    new TextRun({ text: s, size: 20, font: "Calibri" }),
                    i < skillNames.length - 1
                      ? new TextRun({ text: "  ·  ", size: 20, color: "6B7E9F" })
                      : null,
                  ]).filter(Boolean),
                  spacing: { after: 80 },
                }),
              ])
            : []),

          // ── Certificaciones ──
          ...(certifications?.length
            ? buildSection(
                "Certificaciones",
                certifications.flatMap((cert) => [
                  new Paragraph({
                    children: [
                      new TextRun({ text: cert.name || "", bold: true, size: 21, font: "Calibri" }),
                      cert.institution ? new TextRun({ text: "  —  " + cert.institution, size: 20, color: "6B7E9F" }) : null,
                    ].filter(Boolean),
                    spacing: { before: 120, after: 30 },
                  }),
                  cert.period
                    ? new Paragraph({
                        children: [new TextRun({ text: cert.period, size: 19, color: "6B7E9F", font: "Calibri" })],
                        spacing: { after: 60 },
                      })
                    : null,
                ].filter(Boolean))
              )
            : []),

          // ── Idiomas ──
          ...(languages?.length
            ? buildSection("Idiomas", [
                new Paragraph({
                  children: languages.flatMap((lang, i) => [
                    new TextRun({ text: `${lang.name} (${lang.level})`, size: 20, font: "Calibri" }),
                    i < languages.length - 1
                      ? new TextRun({ text: "  ·  ", size: 20, color: "6B7E9F" })
                      : null,
                  ]).filter(Boolean),
                  spacing: { after: 80 },
                }),
              ])
            : []),
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, fileName);
}
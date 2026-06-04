// src/lib/exportWord.js
// npm install docx file-saver

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
  } = cvData;

  const doc = new Document({
    sections: [
      {
        properties: { type: SectionType.CONTINUOUS },
        children: [
          // Header — name
          new Paragraph({
            children: [
              new TextRun({
                text: name,
                bold: true,
                size: 48,
                color: "00E5FF",
                font: "Calibri",
              }),
            ],
            alignment: AlignmentType.LEFT,
            spacing: { after: 80 },
          }),

          // Role
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

          // Contact line
          new Paragraph({
            children: [
              new TextRun({ text: email, size: 20, font: "Calibri" }),
              email && phone ? new TextRun({ text: "  ·  ", size: 20, color: "6B7E9F" }) : null,
              new TextRun({ text: phone, size: 20, font: "Calibri" }),
              location ? new TextRun({ text: "  ·  " + location, size: 20, color: "6B7E9F" }) : null,
              linkedin ? new TextRun({ text: "  ·  " + linkedin, size: 20, color: "0062FF" }) : null,
            ].filter(Boolean),
            spacing: { after: 60 },
          }),

          // Divider
          new Paragraph({
            border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: "1E2D45" } },
            spacing: { after: 200 },
          }),

          // Summary
          ...(summary
            ? buildSection("Perfil Profesional", [
                new Paragraph({
                  children: [new TextRun({ text: summary, size: 20, font: "Calibri" })],
                  spacing: { after: 80 },
                }),
              ])
            : []),

          // Experience
          ...(experience.length
            ? buildSection(
                "Experiencia",
                experience.flatMap((exp) => [
                  new Paragraph({
                    children: [
                      new TextRun({ text: exp.company, bold: true, size: 22, font: "Calibri" }),
                      new TextRun({ text: "  —  " + exp.period, size: 20, color: "6B7E9F" }),
                    ],
                    spacing: { before: 160, after: 40 },
                  }),
                  new Paragraph({
                    children: [
                      new TextRun({ text: exp.role, size: 21, color: "00E5FF", font: "Calibri" }),
                    ],
                    spacing: { after: 60 },
                  }),
                  new Paragraph({
                    children: [new TextRun({ text: exp.description, size: 20, font: "Calibri" })],
                    spacing: { after: 60 },
                  }),
                ])
              )
            : []),

          // Education
          ...(education.length
            ? buildSection(
                "Educación",
                education.flatMap((edu) => [
                  new Paragraph({
                    children: [
                      new TextRun({ text: edu.institution, bold: true, size: 22, font: "Calibri" }),
                      new TextRun({ text: "  ·  " + edu.period, size: 20, color: "6B7E9F" }),
                    ],
                    spacing: { before: 160, after: 40 },
                  }),
                  new Paragraph({
                    children: [new TextRun({ text: edu.degree, size: 21, font: "Calibri" })],
                    spacing: { after: 60 },
                  }),
                ])
              )
            : []),

          // Skills
          ...(skills.length
            ? buildSection("Habilidades", [
                new Paragraph({
                  children: skills.flatMap((s, i) => [
                    new TextRun({ text: s, size: 20, font: "Calibri" }),
                    i < skills.length - 1
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
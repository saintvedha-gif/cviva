import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  { q: "¿Necesito saber programar para usar CViva?", a: "No. CViva está diseñado para cualquier profesional. Solo sube tu CV o rellena el formulario guiado y en minutos tienes tu CV interactivo listo." },
  { q: "¿Los CVs pasan filtros ATS?", a: "Sí. Los PDFs y documentos Word generados siguen las mejores prácticas ATS: sin columnas complejas, fuentes estándar y estructura semántica correcta." },
  { q: "¿Puedo cancelar en cualquier momento?", a: "Absolutamente. Sin contratos, sin penalizaciones. Cancela desde tu dashboard con un clic y conservas acceso hasta el fin del período pagado." },
  { q: "¿Mis datos están seguros?", a: "Tu información está cifrada en reposo y en tránsito. Nunca compartimos tus datos con terceros. Tienes control total para eliminar tu cuenta y datos en cualquier momento." },
];

const FAQ = () => {
  const [open, setOpen] = useState(null);
  return (
    <section id="faq" style={{ padding: "100px 24px", background: "var(--surface)", borderTop: "1px solid var(--border)" }}>
      <div style={{ maxWidth: 700, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <span className="tag">FAQ</span>
          <h2 style={{ fontSize: "clamp(1.8rem, 3vw, 2.6rem)", marginTop: 20, letterSpacing: "-0.03em" }}>Preguntas frecuentes</h2>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {faqs.map((f, i) => (
            <div key={i} className="card" style={{ overflow: "hidden", cursor: "pointer" }} onClick={() => setOpen(open === i ? null : i)}>
              <div style={{ padding: "20px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16 }}>
                <span style={{ fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: "0.95rem" }}>{f.q}</span>
                <ChevronDown size={18} color="var(--muted)" style={{ flexShrink: 0, transform: open === i ? "rotate(180deg)" : "none", transition: "transform 0.25s" }} />
              </div>
              {open === i && (
                <div style={{ padding: "0 24px 20px", color: "var(--muted)", fontSize: "0.88rem", lineHeight: 1.7 }}>{f.a}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;

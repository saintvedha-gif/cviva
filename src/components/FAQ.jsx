import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  { q: "¿Necesito saber programar para usar CViva?", a: "No. CViva está diseñado para cualquier profesional. Solo sube tu CV o rellena el formulario guiado y en minutos tienes tu CV interactivo listo." },
  { q: "¿Los CVs pasan filtros ATS?", a: "Sí. Al exportar, elige la opción \"PDF (compatible con ATS)\": genera texto real en una sola columna, sin colores ni gráficos. El Word también es texto real. La opción \"PDF (diseño visual)\" es una imagen pensada para compartir, no para postular a empleos." },
  { q: "¿Puedo cancelar en cualquier momento?", a: "Sí. Por ahora la cancelación se gestiona escribiéndonos a hola@cviva.co y la procesamos manualmente sin penalizaciones; conservas el acceso hasta el fin del período pagado." },
  { q: "¿Mis datos están seguros?", a: "Tu información se almacena de forma segura y nunca compartimos tus datos con terceros. Si quieres eliminar tu cuenta y tus datos, escríbenos a hola@cviva.co y lo gestionamos por ti." },
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
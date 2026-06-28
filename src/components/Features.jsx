import { Filter, Download, Sparkles, Globe, BarChart2, Lock, Layers } from "lucide-react";

const features = [
  { icon: <Filter size={22} />, title: "Filtros inteligentes", desc: "Los reclutadores filtran tus habilidades en tiempo real. Tu CV se adapta a cada búsqueda sin recargar la página.", color: "#00E5FF" },
  { icon: <Download size={22} />, title: "Exportación rápida", desc: "Descarga tu CV en PDF compatible con ATS, PDF visual, o Word totalmente editable. Tú eliges el formato.", color: "#FFD166" },
  { icon: <Sparkles size={22} />, title: "Editor en tiempo real", desc: "Edita cualquier sección y ve los cambios al instante. Sin plantillas rígidas, sin fricción.", color: "#FF6B6B" },
  { icon: <Globe size={22} />, title: "Link público", desc: "Comparte tu CV con un link único y fácil de recordar. Perfecto para emails y LinkedIn.", color: "#C77DFF" },
  { icon: <BarChart2 size={22} />, title: "Analíticas de visitas", desc: "Sabe cuándo y cuántas veces revisaron tu CV. Información real para optimizar tu búsqueda.", color: "#00E5A0" },
  { icon: <Lock size={22} />, title: "Privacidad total", desc: "Controla quién puede ver tu CV. Activa y desactiva el acceso público en segundos.", color: "#FF9F43" },
];

const Features = () => (
  <section id="features" style={{ padding: "100px 24px", position: "relative" }}>
    <div style={{ maxWidth: 1180, margin: "0 auto" }}>
      <div style={{ textAlign: "center", marginBottom: 64 }}>
        <span className="tag"><Layers size={10} /> Features</span>
        <h2 style={{ fontSize: "clamp(2rem, 3.5vw, 3rem)", marginTop: 20, letterSpacing: "-0.03em" }}>
          Todo lo que necesitas,<br />nada de lo que no.
        </h2>
        <p style={{ color: "var(--muted)", marginTop: 16, maxWidth: 480, margin: "16px auto 0" }}>
          Construido para profesionales que saben que la primera impresión es digital.
        </p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 20 }}>
        {features.map((f, i) => (
          <div key={i} className="card" style={{ padding: "28px 28px" }}>
            <div style={{ width: 48, height: 48, borderRadius: 14, background: f.color + "18", display: "flex", alignItems: "center", justifyContent: "center", color: f.color, marginBottom: 18 }}>
              {f.icon}
            </div>
            <h3 style={{ fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: "1.05rem", marginBottom: 10 }}>{f.title}</h3>
            <p style={{ color: "var(--muted)", fontSize: "0.9rem", lineHeight: 1.65 }}>{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default Features;
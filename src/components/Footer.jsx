import { Zap, Twitter, Linkedin, Github, Mail } from "lucide-react";

const Footer = () => (
  <footer style={{ borderTop: "1px solid var(--border)", padding: "48px 24px 32px", background: "var(--surface)" }}>
    <div style={{ maxWidth: 1180, margin: "0 auto" }}>
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 40, marginBottom: 48 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
            <div style={{ width: 32, height: 32, borderRadius: 9, background: "var(--accent)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Zap size={15} color="#000" strokeWidth={3} />
            </div>
            <span style={{ fontFamily: "Syne, sans-serif", fontWeight: 800, fontSize: "1.05rem" }}>
              CV<span style={{ color: "var(--accent)" }}>iva</span>
            </span>
          </div>
          <p style={{ color: "var(--muted)", fontSize: "0.85rem", lineHeight: 1.7, maxWidth: 260 }}>
            CVs interactivos para profesionales modernos. Porque tu carrera merece más que un PDF estático.
          </p>
          <div style={{ display: "flex", gap: 12, marginTop: 20 }}>
            {[<Twitter size={16} />, <Linkedin size={16} />, <Github size={16} />, <Mail size={16} />].map((icon, i) => (
              <a key={i} href="#" style={{ width: 36, height: 36, borderRadius: 9, border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--muted)", textDecoration: "none", transition: "border-color 0.18s, color 0.18s" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--accent)"; e.currentTarget.style.color = "var(--accent)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--muted)"; }}>
                {icon}
              </a>
            ))}
          </div>
        </div>
        {[
          { title: "Producto", links: ["Features", "Pricing", "Demo", "Changelog"] },
          { title: "Empresa", links: ["About", "Blog", "Careers", "Press"] },
          { title: "Legal", links: ["Privacy", "Terms", "Cookies", "GDPR"] },
        ].map((col, i) => (
          <div key={i}>
            <div style={{ fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: "0.8rem", color: "var(--text)", marginBottom: 16, textTransform: "uppercase", letterSpacing: "0.07em" }}>{col.title}</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {col.links.map(l => (
                <a key={l} href="#" style={{ color: "var(--muted)", fontSize: "0.85rem", textDecoration: "none", transition: "color 0.18s" }}
                  onMouseEnter={e => e.target.style.color = "var(--text)"}
                  onMouseLeave={e => e.target.style.color = "var(--muted)"}>
                  {l}
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div style={{ borderTop: "1px solid var(--border)", paddingTop: 24, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
        <span style={{ color: "var(--muted)", fontSize: "0.8rem" }}>© 2025 CViva. Hecho con <span style={{ color: "var(--danger)" }}>♥</span> en Colombia.</span>
        <span style={{ color: "var(--muted)", fontSize: "0.8rem" }}>Powered by Vite + React</span>
      </div>
    </div>
  </footer>
);

export default Footer;

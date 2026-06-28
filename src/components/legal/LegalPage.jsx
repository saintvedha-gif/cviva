// src/components/legal/LegalPage.jsx
import { Link } from "react-router-dom";
import { Zap, ArrowLeft } from "lucide-react";
import Footer from "../Footer";

// Layout compartido para las páginas legales (Términos, Privacidad, Cookies).
// Reutiliza el mismo tema visual del resto del proyecto (variables CSS de
// GlobalStyles.jsx), así que respeta automáticamente modo oscuro/claro.
const LegalPage = ({ title, updatedAt, children }) => (
  <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
    {/* Header simple, sin la lógica de scroll/menú móvil del Nav del landing */}
    <header style={{
      borderBottom: "1px solid var(--border)",
      padding: "18px 24px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      flexWrap: "wrap",
      gap: 12,
    }}>
      <Link to="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
        <div style={{ width: 32, height: 32, borderRadius: 9, background: "var(--accent)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Zap size={15} color="#000" strokeWidth={3} />
        </div>
        <span style={{ fontFamily: "Syne, sans-serif", fontWeight: 800, fontSize: "1.05rem", color: "var(--text)" }}>
          CV<span style={{ color: "var(--accent)" }}>iva</span>
        </span>
      </Link>
      <Link to="/" style={{ display: "flex", alignItems: "center", gap: 6, color: "var(--muted)", textDecoration: "none", fontSize: "0.85rem", fontFamily: "Syne, sans-serif", fontWeight: 600 }}>
        <ArrowLeft size={14} /> Volver al inicio
      </Link>
    </header>

    <main style={{ flex: 1, padding: "56px 24px 80px" }}>
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        <h1 style={{
          fontFamily: "Syne, sans-serif",
          fontWeight: 800,
          fontSize: "clamp(1.8rem, 4vw, 2.4rem)",
          letterSpacing: "-0.03em",
          color: "var(--text)",
          marginBottom: 8,
        }}>
          {title}
        </h1>
        <p style={{ color: "var(--muted)", fontSize: "0.85rem", marginBottom: 40 }}>
          Última actualización: {updatedAt}
        </p>

        <div className="legal-content" style={{ color: "var(--text)", fontSize: "0.95rem", lineHeight: 1.75 }}>
          {children}
        </div>
      </div>
    </main>

    <Footer />

    {/* Estilos para el contenido legal: headings y párrafos consistentes
        con el resto del proyecto, usando las mismas variables de tema. */}
    <style>{`
      .legal-content h2 {
        font-family: "Syne", sans-serif;
        font-weight: 700;
        font-size: 1.2rem;
        color: var(--text);
        margin: 32px 0 12px;
        letter-spacing: -0.01em;
      }
      .legal-content h2:first-child {
        margin-top: 0;
      }
      .legal-content p {
        margin: 0 0 14px;
        color: var(--muted);
      }
      .legal-content ul {
        margin: 0 0 14px;
        padding-left: 22px;
        color: var(--muted);
      }
      .legal-content li {
        margin-bottom: 6px;
      }
      .legal-content a {
        color: var(--accent);
        text-decoration: none;
      }
      .legal-content a:hover {
        text-decoration: underline;
      }
      .legal-content strong {
        color: var(--text);
      }
    `}</style>
  </div>
);

export default LegalPage;
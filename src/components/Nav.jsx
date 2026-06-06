// src/components/Nav.jsx
import { useState, useEffect, useRef } from "react";
import { Zap, Sun, Moon, ArrowRight, Menu, X } from "lucide-react";
import { Link } from "react-router-dom";

const Nav = ({ mode, toggleMode }) => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const scrollYRef = useRef(0);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    const fn = () => { if (window.innerWidth > 768) setMenuOpen(false); };
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);

  // Bloquear scroll del body cuando el menú está abierto (soporta móviles)
  useEffect(() => {
    if (menuOpen) {
      scrollYRef.current = window.scrollY || window.pageYOffset || 0;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollYRef.current}px`;
      document.body.style.left = "0";
      document.body.style.right = "0";
      document.body.style.width = "100%";
      document.body.style.overflow = "hidden";
    } else {
      const top = document.body.style.top;
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.left = "";
      document.body.style.right = "";
      document.body.style.width = "";
      document.body.style.overflow = "";
      if (top) {
        const restoreY = Math.abs(parseInt(top || "0"));
        window.scrollTo(0, restoreY);
      }
    }

    return () => {
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.left = "";
      document.body.style.right = "";
      document.body.style.width = "";
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const links = ["Features", "Demo", "Pricing", "FAQ"];

  return (
    <>
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        padding: "0 20px",
        background: scrolled || menuOpen ? "var(--bg)" : "transparent",
        borderBottom: scrolled || menuOpen ? "1px solid var(--border)" : "none",
        transition: "all 0.3s",
      }}>
        <div style={{ maxWidth: 1180, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 62 }}>

          {/* Logo */}
          <Link to="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none", flexShrink: 0 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: "var(--accent)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Zap size={18} color="#000" strokeWidth={3} />
            </div>
            <span style={{ fontFamily: "Syne, sans-serif", fontWeight: 800, fontSize: "1.15rem", color: "var(--text)" }}>
              CV<span style={{ color: "var(--accent)" }}>iva</span>
            </span>
          </Link>

          {/* Desktop links */}
          <div className="desktop-nav" style={{ display: "flex", gap: 32, alignItems: "center" }}>
            {links.map(l => (
              <a key={l} href={"#" + l.toLowerCase()}
                style={{ color: "var(--muted)", fontSize: "0.9rem", fontWeight: 500, textDecoration: "none", transition: "color 0.18s" }}
                onMouseEnter={e => e.target.style.color = "var(--text)"}
                onMouseLeave={e => e.target.style.color = "var(--muted)"}
              >{l}</a>
            ))}
          </div>

          {/* Right actions */}
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <button onClick={toggleMode} style={{ width: 38, height: 38, borderRadius: 9, border: "1px solid var(--border)", background: "var(--surface)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--muted)", flexShrink: 0 }}>
              {mode === "dark" ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            <Link to="/auth/login" className="btn-ghost desktop-nav" style={{ fontSize: "0.85rem", padding: "9px 16px" }}>
              Log in
            </Link>
            <Link to="/auth/register" className="btn-primary desktop-nav" style={{ fontSize: "0.85rem", padding: "9px 16px" }}>
              Get started <ArrowRight size={14} />
            </Link>
            <button
              className="mobile-menu-btn"
              onClick={() => setMenuOpen(o => !o)}
              style={{ width: 38, height: 38, borderRadius: 9, border: "1px solid var(--border)", background: "var(--surface)", cursor: "pointer", display: "none", alignItems: "center", justifyContent: "center", color: "var(--text)", flexShrink: 0 }}
            >
              {menuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </nav>

{/* Mobile menu — fullscreen overlay */}
      {menuOpen && (
        <div 
          style={{
            position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
            zIndex: 98,
            background: "var(--bg)",
          }}
          // Evita que los gestos táctiles se transmitan al fondo en el contenedor principal
          onTouchMove={(e) => e.stopPropagation()} 
        >
          {/* Header del menú */}
          <div style={{
            height: 62, display: "flex", alignItems: "center",
            justifyContent: "space-between", padding: "0 20px",
            borderBottom: "1px solid var(--border)",
          }}>
            <Link to="/" onClick={() => setMenuOpen(false)} style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: "var(--accent)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Zap size={18} color="#000" strokeWidth={3} />
              </div>
              <span style={{ fontFamily: "Syne, sans-serif", fontWeight: 800, fontSize: "1.15rem", color: "var(--text)" }}>
                CV<span style={{ color: "var(--accent)" }}>iva</span>
              </span>
            </Link>
            <button
              onClick={() => setMenuOpen(false)}
              style={{ width: 38, height: 38, borderRadius: 9, border: "1px solid var(--border)", background: "var(--surface)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text)" }}
            >
              <X size={18} />
            </button>
          </div>

          {/* Contenido */}
          <div 
            style={{ padding: "32px 24px 40px", display: "flex", flexDirection: "column", height: "calc(100vh - 62px)", overflowY: "auto" }}
            // Permite el scroll nativo dentro de la lista de links pero detiene el rebote del fondo
            onTouchMove={(e) => e.stopPropagation()} 
          >
            {/* Nav links */}
            <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 32 }}>
              {links.map(l => (
                <a
                  key={l}
                  href={"#" + l.toLowerCase()}
                  onClick={() => setMenuOpen(false)}
                  style={{
                    color: "var(--text)", fontSize: "1.6rem",
                    fontFamily: "Syne, sans-serif", fontWeight: 800,
                    textDecoration: "none", padding: "14px 0",
                    borderBottom: "1px solid var(--border)",
                    letterSpacing: "-0.02em",
                  }}
                >
                  {l}
                </a>
              ))}
            </div>

            {/* Auth buttons */}
            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: "auto" }}>
              <Link
                to="/auth/register"
                onClick={() => setMenuOpen(false)}
                style={{
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                  background: "var(--accent)", color: "#000",
                  fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: "1rem",
                  padding: "16px", borderRadius: 12, textDecoration: "none",
                }}
              >
                Crear cuenta gratis <ArrowRight size={16} />
              </Link>
              <Link
                to="/auth/login"
                onClick={() => setMenuOpen(false)}
                style={{
                  display: "flex", alignItems: "center", justifyContent: "center",
                  background: "transparent", color: "var(--text)",
                  fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: "1rem",
                  padding: "16px", borderRadius: 12, textDecoration: "none",
                  border: "1.5px solid var(--border)",
                }}
              >
                Iniciar sesión
              </Link>
            </div>

            {/* Toggle mode */}
            <div style={{ marginTop: 24, paddingTop: 20, borderTop: "1px solid var(--border)" }}>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
      `}</style>
    </>
  );
};

export default Nav;
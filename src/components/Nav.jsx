import { useState, useEffect } from "react";
import { Zap, Sun, Moon, ArrowRight, Menu, X } from "lucide-react";
import { Link } from "react-router-dom";

const Nav = ({ mode, toggleMode }) => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  // Close menu on resize
  useEffect(() => {
    const fn = () => { if (window.innerWidth > 768) setMenuOpen(false); };
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);

  const links = ["Features", "Demo", "Pricing", "FAQ"];

  return (
    <>
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        padding: "0 24px",
        background: scrolled || menuOpen ? "color-mix(in srgb, var(--bg) 92%, transparent)" : "transparent",
        backdropFilter: scrolled || menuOpen ? "blur(18px)" : "none",
        borderBottom: scrolled || menuOpen ? "1px solid var(--border)" : "none",
        transition: "all 0.3s",
      }}>
        <div style={{ maxWidth: 1180, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>

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
              <a key={l} href={"#" + l.toLowerCase()} style={{ color: "var(--muted)", fontSize: "0.9rem", fontWeight: 500, textDecoration: "none", transition: "color 0.18s" }}
                onMouseEnter={e => e.target.style.color = "var(--text)"}
                onMouseLeave={e => e.target.style.color = "var(--muted)"}
              >{l}</a>
            ))}
          </div>

          {/* Right actions */}
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            {/* Theme toggle — always visible */}
            <button onClick={toggleMode} style={{ width: 38, height: 38, borderRadius: 9, border: "1px solid var(--border)", background: "var(--surface)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--muted)", flexShrink: 0 }}>
              {mode === "dark" ? <Sun size={16} /> : <Moon size={16} />}
            </button>

            {/* Desktop auth buttons */}
            <Link to="/auth/login" className="btn-ghost desktop-nav" style={{ fontSize: "0.85rem", padding: "9px 16px" }}>
              Log in
            </Link>
            <Link to="/auth/register" className="btn-primary desktop-nav" style={{ fontSize: "0.85rem", padding: "9px 16px" }}>
              Get started <ArrowRight size={14} />
            </Link>

            {/* Mobile hamburger */}
            <button
              className="mobile-menu-btn"
              onClick={() => setMenuOpen(o => !o)}
              style={{ width: 38, height: 38, borderRadius: 9, border: "1px solid var(--border)", background: "var(--surface)", cursor: "pointer", display: "none", alignItems: "center", justifyContent: "center", color: "var(--text)", flexShrink: 0 }}
            >
              {menuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown menu */}
        {menuOpen && (
          <div style={{ borderTop: "1px solid var(--border)", padding: "16px 0 20px", display: "flex", flexDirection: "column", gap: 4 }}>
            {links.map(l => (
              <a key={l} href={"#" + l.toLowerCase()} onClick={() => setMenuOpen(false)} style={{ color: "var(--muted)", fontSize: "1rem", fontWeight: 500, textDecoration: "none", padding: "12px 4px", display: "block", borderRadius: 8, transition: "color 0.18s" }}>
                {l}
              </a>
            ))}
            <div style={{ display: "flex", gap: 10, marginTop: 12, paddingTop: 16, borderTop: "1px solid var(--border)" }}>
              <Link to="/auth/login" onClick={() => setMenuOpen(false)} className="btn-ghost" style={{ flex: 1, justifyContent: "center", fontSize: "0.9rem" }}>
                Log in
              </Link>
              <Link to="/auth/register" onClick={() => setMenuOpen(false)} className="btn-primary" style={{ flex: 1, justifyContent: "center", fontSize: "0.9rem" }}>
                Get started
              </Link>
            </div>
          </div>
        )}
      </nav>

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

import { Sun, Moon, Menu, Bell } from "lucide-react";

const DashboardTopbar = ({ mode, toggleMode, onMenuOpen, title = "Dashboard" }) => (
  <header style={{
    height: 64, display:"flex", alignItems:"center", justifyContent:"space-between",
    padding:"0 24px", borderBottom:"1px solid var(--border)",
    background:"color-mix(in srgb, var(--bg) 80%, transparent)",
    backdropFilter:"blur(12px)", position:"sticky", top:0, zIndex:10, flexShrink:0,
  }}>
    <div style={{ display:"flex", alignItems:"center", gap:14 }}>
      <button onClick={onMenuOpen} className="topbar-menu-btn" style={{ display:"none", width:36, height:36, borderRadius:9, border:"1px solid var(--border)", background:"var(--surface)", cursor:"pointer", alignItems:"center", justifyContent:"center", color:"var(--text)" }}>
        <Menu size={18}/>
      </button>
      <h1 style={{ fontFamily:"Syne,sans-serif", fontWeight:800, fontSize:"1.15rem", color:"var(--text)", margin:0 }}>
        {title}
      </h1>
    </div>
    <div style={{ display:"flex", alignItems:"center", gap:8 }}>
      <button style={{ width:36, height:36, borderRadius:9, border:"1px solid var(--border)", background:"var(--surface)", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", color:"var(--muted)", position:"relative" }}>
        <Bell size={16}/>
        <div style={{ position:"absolute", top:8, right:8, width:7, height:7, borderRadius:"50%", background:"var(--accent)", border:"2px solid var(--bg)" }} />
      </button>
      <button onClick={toggleMode} style={{ width:36, height:36, borderRadius:9, border:"1px solid var(--border)", background:"var(--surface)", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", color:"var(--muted)" }}>
        {mode === "dark" ? <Sun size={16}/> : <Moon size={16}/>}
      </button>
    </div>
    <style>{`
      @media (max-width: 768px) {
        .topbar-menu-btn { display: flex !important; }
      }
    `}</style>
  </header>
);

export default DashboardTopbar;
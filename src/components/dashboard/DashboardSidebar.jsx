import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Zap, LayoutDashboard, FileText, Eye,
  BarChart2, Settings, LogOut, ChevronLeft,
  ChevronRight, Plus, X
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard",     path: "/dashboard" },
  { icon: FileText,        label: "Mis CVs",       path: "/dashboard/cvs" },
  { icon: Eye,             label: "Vista previa",  path: "/dashboard/preview" },
  { icon: BarChart2,       label: "Analíticas",    path: "/dashboard/analytics" },
  { icon: Settings,        label: "Configuración", path: "/dashboard/settings" },
];

const DashboardSidebar = ({ mobileOpen, onMobileClose }) => {
  const [collapsed, setCollapsed] = useState(false);
  const { user, signOut } = useAuth();
  const location = useLocation();

  const initials = user?.user_metadata?.full_name
    ? user.user_metadata.full_name.split(" ").map(n => n[0]).join("").slice(0,2).toUpperCase()
    : user?.email?.[0].toUpperCase() ?? "U";

  const name  = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Usuario";
  const email = user?.email || "";

  return (
    <>
      {mobileOpen && (
        <div onClick={onMobileClose} style={{
          position:"fixed", inset:0, background:"rgba(0,0,0,0.6)",
          zIndex:199, backdropFilter:"blur(4px)"
        }} />
      )}

      <aside style={{
        position:"fixed", top:0, left:0, bottom:0, zIndex:200,
        width: collapsed ? 72 : 240,
        background:"var(--surface)",
        borderRight:"1px solid var(--border)",
        display:"flex", flexDirection:"column",
        transition:"width 0.25s cubic-bezier(.4,0,.2,1), transform 0.3s cubic-bezier(.4,0,.2,1)",
        overflow:"hidden",
      }} className={`dash-sidebar${mobileOpen ? " mobile-open" : ""}`}>

        {/* Logo */}
        <div style={{ padding: collapsed ? "20px 0" : "20px", display:"flex", alignItems:"center", justifyContent: collapsed ? "center" : "space-between", borderBottom:"1px solid var(--border)", minHeight:68, flexShrink:0 }}>
          {collapsed ? (
            <Link to="/" style={{ textDecoration:"none" }}>
              <div style={{ width:32, height:32, borderRadius:9, background:"var(--accent)", display:"flex", alignItems:"center", justifyContent:"center" }}>
                <Zap size={16} color="#000" strokeWidth={3} />
              </div>
            </Link>
          ) : (
            <Link to="/" style={{ display:"flex", alignItems:"center", gap:10, textDecoration:"none" }}>
              <div style={{ width:32, height:32, borderRadius:9, background:"var(--accent)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                <Zap size={16} color="#000" strokeWidth={3} />
              </div>
              <span style={{ fontFamily:"Syne,sans-serif", fontWeight:800, fontSize:"1.1rem", color:"var(--text)", whiteSpace:"nowrap" }}>
                CV<span style={{ color:"var(--accent)" }}>iva</span>
              </span>
            </Link>
          )}
          <button onClick={onMobileClose} className="sidebar-mobile-close" style={{ display:"none", background:"none", border:"none", color:"var(--muted)", cursor:"pointer", padding:4 }}>
            <X size={18} />
          </button>
          <button onClick={() => setCollapsed(c => !c)} className="sidebar-collapse-btn" style={{ display:"flex", width:28, height:28, borderRadius:7, border:"1px solid var(--border)", background:"var(--surface-high)", alignItems:"center", justifyContent:"center", cursor:"pointer", color:"var(--muted)", flexShrink:0 }}
            onMouseEnter={e => e.currentTarget.style.borderColor="var(--accent)"}
            onMouseLeave={e => e.currentTarget.style.borderColor="var(--border)"}
          >
            {collapsed ? <ChevronRight size={13}/> : <ChevronLeft size={13}/>}
          </button>
        </div>

        {/* New CV */}
        <div style={{ padding: collapsed ? "16px 12px" : "16px", borderBottom:"1px solid var(--border)", flexShrink:0 }}>
          <Link to="/dashboard/cvs/new" style={{
            display:"flex", alignItems:"center", justifyContent: collapsed ? "center" : "flex-start",
            gap:8, padding: collapsed ? "10px" : "10px 14px",
            background:"var(--accent)", color:"#000", borderRadius:10, textDecoration:"none",
            fontFamily:"Syne,sans-serif", fontWeight:700, fontSize:"0.85rem",
            transition:"box-shadow 0.18s, transform 0.18s", whiteSpace:"nowrap",
          }}
            onMouseEnter={e => { e.currentTarget.style.boxShadow="var(--accent-glow)"; e.currentTarget.style.transform="translateY(-1px)"; }}
            onMouseLeave={e => { e.currentTarget.style.boxShadow="none"; e.currentTarget.style.transform="none"; }}
          >
            <Plus size={15} strokeWidth={3}/>
            {!collapsed && "Nuevo CV"}
          </Link>
        </div>

        {/* Nav */}
        <nav style={{ flex:1, padding:"12px 8px", overflowY:"auto", overflowX:"hidden" }}>
          {navItems.map(({ icon:Icon, label, path }) => {
            const active = location.pathname === path;
            return (
              <Link key={path} to={path} style={{
                display:"flex", alignItems:"center", gap:12,
                padding: collapsed ? "11px 0" : "11px 12px",
                justifyContent: collapsed ? "center" : "flex-start",
                borderRadius:10, textDecoration:"none", marginBottom:2,
                background: active ? "var(--accent-soft)" : "transparent",
                color: active ? "var(--accent)" : "var(--muted)",
                fontFamily:"Syne,sans-serif", fontWeight:600, fontSize:"0.85rem",
                transition:"background 0.18s, color 0.18s",
                whiteSpace:"nowrap", position:"relative",
              }}
                onMouseEnter={e => { if(!active){e.currentTarget.style.background="var(--surface-high)"; e.currentTarget.style.color="var(--text)";} }}
                onMouseLeave={e => { if(!active){e.currentTarget.style.background="transparent"; e.currentTarget.style.color="var(--muted)";} }}
              >
                {active && <div style={{ position:"absolute", left:0, top:"50%", transform:"translateY(-50%)", width:3, height:20, background:"var(--accent)", borderRadius:"0 3px 3px 0" }} />}
                <Icon size={17} strokeWidth={active ? 2.5 : 2}/>
                {!collapsed && label}
              </Link>
            );
          })}
        </nav>

        {/* User */}
        <div style={{ padding: collapsed ? "12px 8px" : "12px", borderTop:"1px solid var(--border)", flexShrink:0 }}>
          {!collapsed && (
            <div style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 8px", borderRadius:10, marginBottom:6, background:"var(--surface-high)", border:"1px solid var(--border)" }}>
              <div style={{ width:32, height:32, borderRadius:"50%", background:"linear-gradient(135deg, var(--accent), #0062FF)", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"Syne,sans-serif", fontWeight:800, color:"#000", fontSize:"0.75rem", flexShrink:0 }}>
                {initials}
              </div>
              <div style={{ minWidth:0 }}>
                <div style={{ fontFamily:"Syne,sans-serif", fontWeight:700, fontSize:"0.8rem", color:"var(--text)", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{name}</div>
                <div style={{ fontSize:"0.7rem", color:"var(--muted)", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{email}</div>
              </div>
            </div>
          )}
          <button onClick={signOut} style={{
            width:"100%", display:"flex", alignItems:"center",
            justifyContent: collapsed ? "center" : "flex-start",
            gap:8, padding: collapsed ? "10px 0" : "10px 12px",
            background:"none", border:"none", cursor:"pointer",
            color:"var(--muted)", fontFamily:"Syne,sans-serif", fontWeight:600, fontSize:"0.82rem",
            borderRadius:8, transition:"color 0.18s, background 0.18s",
          }}
            onMouseEnter={e => { e.currentTarget.style.color="var(--danger)"; e.currentTarget.style.background="rgba(255,77,109,0.08)"; }}
            onMouseLeave={e => { e.currentTarget.style.color="var(--muted)"; e.currentTarget.style.background="none"; }}
          >
            <LogOut size={16}/>
            {!collapsed && "Cerrar sesión"}
          </button>
        </div>
      </aside>

      <style>{`
        .dash-sidebar { transform: translateX(0); }
        @media (max-width: 768px) {
          .dash-sidebar { transform: translateX(-100%); width: 260px !important; }
          .dash-sidebar.mobile-open { transform: translateX(0); }
          .sidebar-collapse-btn { display: none !important; }
          .sidebar-mobile-close { display: flex !important; }
        }
      `}</style>
    </>
  );
};

export default DashboardSidebar;
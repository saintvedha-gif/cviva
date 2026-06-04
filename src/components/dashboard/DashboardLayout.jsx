import { useState } from "react";
import DashboardSidebar from "./DashboardSidebar";
import DashboardTopbar from "./DashboardTopbar";

const SIDEBAR_W = 240;
const SIDEBAR_COLLAPSED_W = 72;

const DashboardLayout = ({ children, mode, toggleMode, title }) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div style={{ display:"flex", minHeight:"100vh", background:"var(--bg)" }}>
      <DashboardSidebar
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />

      {/* Main — offset by sidebar width on desktop */}
      <div style={{ flex:1, display:"flex", flexDirection:"column", minWidth:0 }} className="dash-main">
        <DashboardTopbar
          mode={mode}
          toggleMode={toggleMode}
          title={title}
          onMenuOpen={() => setMobileOpen(true)}
        />
        <main style={{ flex:1, padding:"28px 28px", overflowY:"auto" }} className="dash-content">
          {children}
        </main>
      </div>

      <style>{`
        .dash-main { margin-left: ${SIDEBAR_W}px; transition: margin-left 0.25s; }
        @media (max-width: 768px) {
          .dash-main { margin-left: 0 !important; }
          .dash-content { padding: 16px !important; }
        }
      `}</style>
    </div>
  );
};

export default DashboardLayout;
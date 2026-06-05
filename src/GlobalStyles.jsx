import { THEME } from './theme';

const GlobalStyles = ({ mode }) => {
  const t = THEME[mode];
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&display=swap');
      *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
      :root {
        --bg: ${t.bg};
        --surface: ${t.surface};
        --surface-high: ${t.surfaceHigh};
        --border: ${t.border};
        --accent: ${t.accent};
        --accent-soft: ${t.accentSoft};
        --accent-glow: ${t.accentGlow};
        --gold: ${t.gold};
        --text: ${t.text};
        --muted: ${t.muted};
        --danger: ${t.danger};
      }
      html { scroll-behavior: smooth; }
      body {
        background: var(--bg);
        color: var(--text);
        font-family: 'DM Sans', sans-serif;
        font-size: 16px;
        line-height: 1.6;
        -webkit-font-smoothing: antialiased;
        transition: background 0.4s, color 0.4s;
        overflow-x: hidden;
      }
      h1,h2,h3,h4 { font-family: 'Syne', sans-serif; font-weight: 800; line-height: 1.1; }
      ::selection { background: var(--accent); color: #000; }
      ::-webkit-scrollbar { width: 6px; }
      ::-webkit-scrollbar-track { background: var(--bg); }
      ::-webkit-scrollbar-thumb { background: var(--border); border-radius: 3px; }

      @keyframes fadeUp {
        from { opacity: 0; transform: translateY(28px); }
        to   { opacity: 1; transform: translateY(0); }
      }
      @keyframes pulse-ring {
        0%   { transform: scale(1);    opacity: 0.7; }
        100% { transform: scale(1.55); opacity: 0; }
      }
      @keyframes float {
        0%,100% { transform: translateY(0px) rotate(-1deg); }
        50%      { transform: translateY(-14px) rotate(1deg); }
      }
      @keyframes ticker {
        0%   { transform: translateX(0); }
        100% { transform: translateX(-50%); }
      }
      @keyframes shimmer {
        0%   { background-position: -200% center; }
        100% { background-position:  200% center; }
      }

      .fade-up  { animation: fadeUp 0.7s cubic-bezier(.22,1,.36,1) both; }
      .d1 { animation-delay: 0.05s; }
      .d2 { animation-delay: 0.15s; }
      .d3 { animation-delay: 0.25s; }
      .d4 { animation-delay: 0.38s; }
      .d5 { animation-delay: 0.50s; }
      .float-anim { animation: float 6s ease-in-out infinite; }
      .ticker-track { animation: ticker 28s linear infinite; }

      .btn-primary {
        display: inline-flex; align-items: center; gap: 8px;
        background: var(--accent); color: #000;
        font-family: 'Syne', sans-serif; font-weight: 700; font-size: 0.95rem;
        padding: 14px 28px; border-radius: 10px; border: none; cursor: pointer;
        transition: transform 0.18s, box-shadow 0.18s, opacity 0.18s;
        text-decoration: none; letter-spacing: 0.01em;
        white-space: nowrap;
      }
      .btn-primary:hover { transform: translateY(-2px); box-shadow: var(--accent-glow); }
      .btn-ghost {
        display: inline-flex; align-items: center; gap: 8px;
        background: transparent; color: var(--text);
        font-family: 'Syne', sans-serif; font-weight: 600; font-size: 0.95rem;
        padding: 13px 26px; border-radius: 10px;
        border: 1.5px solid var(--border); cursor: pointer;
        transition: border-color 0.18s, background 0.18s, transform 0.18s;
        text-decoration: none; white-space: nowrap;
      }
      .btn-ghost:hover { border-color: var(--accent); background: var(--accent-soft); transform: translateY(-2px); }
      .card {
        background: var(--surface);
        border: 1px solid var(--border);
        border-radius: 18px;
        transition: border-color 0.25s, transform 0.25s, box-shadow 0.25s;
      }
      .card:hover { border-color: var(--accent); transform: translateY(-4px); box-shadow: var(--accent-glow); }
      .tag {
        display: inline-flex; align-items: center; gap: 6px;
        background: var(--accent-soft); color: var(--accent);
        font-family: 'Syne', sans-serif; font-weight: 700; font-size: 0.72rem;
        padding: 5px 13px; border-radius: 100px; letter-spacing: 0.08em; text-transform: uppercase;
        border: 1px solid color-mix(in srgb, var(--accent) 30%, transparent);
      }
      .shimmer-text {
        background: linear-gradient(90deg, var(--text) 0%, var(--accent) 40%, var(--text) 80%);
        background-size: 200% auto;
        -webkit-background-clip: text; -webkit-text-fill-color: transparent;
        background-clip: text;
        animation: shimmer 4s linear infinite;
      }
      .grid-bg {
        background-image: linear-gradient(var(--border) 1px, transparent 1px),
                          linear-gradient(90deg, var(--border) 1px, transparent 1px);
        background-size: 48px 48px;
      }

      /* ── Nav mobile ── */
      .desktop-nav { display: flex !important; }
      .mobile-menu-btn { display: none !important; }
      .mobile-nav-menu { display: none; }

      /* ── Dashboard ── */
      .dash-main { margin-left: 240px; transition: margin-left 0.25s; }
      .dash-content { padding: 28px; }
      .topbar-menu-btn { display: none !important; }

      /* ── CV Editor layout ── */
      .cv-editor-layout { display: flex; gap: 24px; align-items: flex-start; }
      .cv-editor-panel  { flex: 1 1 480px; min-width: 0; }
      .cv-preview-panel { flex: 0 0 340px; position: sticky; top: 88px; }

      /* ── Tablet (max 1024px) ── */
      @media (max-width: 1024px) {
        .cv-preview-panel { flex: 0 0 280px; }
      }

      /* ── Mobile (max 768px) ── */
      @media (max-width: 768px) {
        html, body { font-size: 15px; }

        /* Nav */
        .desktop-nav { display: none !important; }
        .mobile-menu-btn { display: flex !important; }
        .mobile-nav-menu { display: flex; }
        nav { padding: 0 16px !important; }
        nav > div { height: 56px !important; }

        /* Hero */
        #hero { padding: 90px 16px 60px !important; min-height: auto !important; }
        .hero-grid {
          grid-template-columns: 1fr !important;
          gap: 32px !important;
          text-align: center;
        }
        /* Reduce hero headline and spacing so it fits smaller screens */
        .hero-grid h1 {
          font-size: clamp(1.8rem, 6.5vw, 2.6rem) !important;
          letter-spacing: -0.01em !important;
          line-height: 1.06 !important;
          margin-bottom: 10px !important;
          word-break: break-word !important;
          overflow-wrap: break-word !important;
        }
        .hero-grid p { max-width: 100% !important; padding: 0 6px; font-size: 0.98rem !important; }
        .hero-cta { justify-content: center !important; gap: 8px !important; }
        .hero-cta .btn-primary { padding: 10px 14px !important; font-size: 0.9rem !important; }
        .hero-cta .btn-ghost { padding: 10px 12px !important; font-size: 0.88rem !important; }
        /* Slightly scale down mockup to fit narrow viewports */
        .hero-grid .float-anim > div { transform: scale(0.92); max-width: 300px !important; }
        /* hide large absolute decorations that cause overflow */
        .hero-deco { display: none !important; }
        .hero-grid > div:first-child { order: 1; }
        .hero-grid > div:nth-child(2) { order: 2; }
        .hero-grid .float-anim { justify-content: center !important; }
        .hero-grid .float-anim > div { max-width: 100% !important; width: 100% !important; }
        .hero-cta { justify-content: center !important; flex-wrap: wrap; }

        /* Auth */
        .auth-left { display: none !important; }

        /* Dashboard layout */
        .dash-main { margin-left: 0 !important; }
        .dash-content { padding: 16px !important; }
        .topbar-menu-btn { display: flex !important; }

        /* CV Editor — stack vertically */
        .cv-editor-layout { flex-direction: column !important; }
        .cv-editor-panel  { flex: none !important; width: 100% !important; }
        .cv-preview-panel {
          flex: none !important;
          width: 100% !important;
          position: static !important;
        }

        /* Cards grid */
        .card { border-radius: 14px; }

        /* Stats grid */
        .stats-grid { grid-template-columns: 1fr 1fr !important; }

        /* Buttons */
        .btn-primary, .btn-ghost { padding: 11px 18px; font-size: 0.88rem; }
        /* Footer adjustments */
        footer { padding: 36px 16px 28px !important; }
        footer > div { max-width: 100% !important; padding: 0 8px; }
        footer .grid-footer { display: grid; grid-template-columns: 1fr !important; gap: 18px !important; }
        footer p { max-width: 100% !important; }
        footer a { white-space: normal !important; }
      }

      /* ── Small mobile (max 420px) ── */
      @media (max-width: 420px) {
        html, body { font-size: 14px; }
        #hero { padding: 80px 12px 48px !important; }
        .btn-primary, .btn-ghost { padding: 10px 14px; font-size: 0.85rem; }
        .stats-grid { grid-template-columns: 1fr !important; }
        .dash-content { padding: 12px !important; }
        .hero-deco { display: none !important; }
        html, body, #root { max-width: 100vw; overflow-x: hidden; overscroll-behavior-x: none; }
        /* Tighten headline further on very small screens */
        .hero-grid h1 { font-size: clamp(1.6rem, 7.5vw, 2.2rem) !important; }
        .hero-grid p { font-size: 0.95rem !important; }
        .hero-grid .float-anim > div { transform: scale(0.88); }
        /* Footer very small screens */
        footer { padding: 28px 12px 20px !important; }
        footer .grid-footer { gap: 12px !important; }
        /* Keep footer layout similar but smaller: 2 columns, reduced gaps and fonts */
        footer .grid-footer { grid-template-columns: repeat(2, 1fr) !important; gap: 12px !important; }
        footer p { font-size: 0.78rem !important; }
        footer .footer-social-link { width: 30px !important; height: 30px !important; }
        footer .footer-copy, footer .footer-powered { font-size: 0.72rem !important; }
        footer .grid-footer > div { padding-right: 6px !important; }
      }
    `}</style>
  );
};

export default GlobalStyles;
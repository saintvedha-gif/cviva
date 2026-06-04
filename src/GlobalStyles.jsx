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
        0%   { transform: scale(1);   opacity: 0.7; }
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
      }
      .btn-primary:hover { transform: translateY(-2px); box-shadow: var(--accent-glow); }
      .btn-ghost {
        display: inline-flex; align-items: center; gap: 8px;
        background: transparent; color: var(--text);
        font-family: 'Syne', sans-serif; font-weight: 600; font-size: 0.95rem;
        padding: 13px 26px; border-radius: 10px;
        border: 1.5px solid var(--border); cursor: pointer;
        transition: border-color 0.18s, background 0.18s, transform 0.18s;
        text-decoration: none;
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
    `}</style>
  );
};

export default GlobalStyles;
// This file already exports GlobalStyles — appending mobile media queries via a second component
// is handled inside the existing <style> tag. No changes needed here since AuthLayout
// handles its own responsive styles inline.

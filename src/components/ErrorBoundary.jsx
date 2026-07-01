// src/components/ErrorBoundary.jsx
import { Component } from "react";

// Colores fijos (no usan var(--x)) a propósito: si el error ocurre antes de
// que <GlobalStyles /> alcance a renderizar sus variables CSS, esta pantalla
// tiene que verse bien igual. Son los mismos valores que THEME.dark en
// src/theme.js, así que visualmente calza con el resto de la app.
const COLORS = {
  bg: "#080C12",
  surface: "#0F1520",
  border: "#1E2D45",
  accent: "#00E5FF",
  text: "#E8F0FE",
  muted: "#6B7E9F",
  danger: "#FF4D6D",
};

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log en consola para que quede rastro en las herramientas de
    // desarrollador o en el logging del navegador del usuario si te
    // reporta el problema.
    console.error("ErrorBoundary atrapó un error:", error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = "/";
  };

  render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    const isDev = import.meta.env?.DEV;

    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 20,
          padding: "24px",
          background: COLORS.bg,
          color: COLORS.text,
          fontFamily: "'DM Sans', sans-serif",
          textAlign: "center",
        }}
      >
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: 18,
            background: "rgba(255,77,109,0.12)",
            border: `1px solid rgba(255,77,109,0.3)`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "1.8rem",
          }}
        >
          ⚠️
        </div>

        <div>
          <h1
            style={{
              fontFamily: "'Syne', sans-serif",
              fontWeight: 800,
              fontSize: "1.4rem",
              margin: 0,
              marginBottom: 8,
            }}
          >
            Algo salió mal
          </h1>
          <p style={{ color: COLORS.muted, fontSize: "0.92rem", maxWidth: 380, lineHeight: 1.6 }}>
            Ocurrió un error inesperado y no pudimos mostrar esta página. Tu información no se
            perdió — intenta recargar o volver al inicio.
          </p>
        </div>

        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
          <button
            onClick={this.handleReload}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: COLORS.accent,
              color: "#000",
              padding: "12px 22px",
              borderRadius: 10,
              border: "none",
              fontFamily: "'Syne', sans-serif",
              fontWeight: 700,
              fontSize: "0.9rem",
              cursor: "pointer",
            }}
          >
            Recargar página
          </button>
          <button
            onClick={this.handleGoHome}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: "transparent",
              color: COLORS.text,
              padding: "12px 22px",
              borderRadius: 10,
              border: `1.5px solid ${COLORS.border}`,
              fontFamily: "'Syne', sans-serif",
              fontWeight: 600,
              fontSize: "0.9rem",
              cursor: "pointer",
            }}
          >
            Volver al inicio
          </button>
        </div>

        {isDev && this.state.error && (
          <pre
            style={{
              marginTop: 16,
              maxWidth: 600,
              maxHeight: 220,
              overflow: "auto",
              textAlign: "left",
              background: COLORS.surface,
              border: `1px solid ${COLORS.border}`,
              borderRadius: 10,
              padding: 14,
              fontSize: "0.75rem",
              color: COLORS.danger,
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
            }}
          >
            {this.state.error.toString()}
            {"\n\n"}
            {this.state.error.stack}
          </pre>
        )}
      </div>
    );
  }
}
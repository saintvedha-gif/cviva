// src/hooks/useCopyLink.js
// Hook simple para copiar texto al portapapeles con feedback visual.
// Uso: const { copied, copy } = useCopyLink();
//      <button onClick={() => copy(url)}>{copied ? "¡Copiado!" : "Copiar link"}</button>
import { useState } from "react";

export function useCopyLink(duration = 2000) {
  const [copied, setCopied] = useState(false);

  const copy = async (text) => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        // Fallback para navegadores sin Clipboard API
        const ta = document.createElement("textarea");
        ta.value = text;
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.focus();
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), duration);
    } catch {
      // Si falla silenciosamente, no mostrar error — el usuario puede copiar manualmente
      console.warn("No se pudo copiar al portapapeles");
    }
  };

  return { copied, copy };
}
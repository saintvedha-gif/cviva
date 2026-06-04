# CViva 🚀

Landing page interactiva para CViva — CVs modernos e interactivos para profesionales.

## Stack

- **React 18** + **Vite 5**
- **lucide-react** para iconos
- CSS-in-JS (inline styles + global styles via `<style>`)
- Fuentes: Syne + DM Sans (Google Fonts)

## Inicio rápido

```bash
npm install
npm run dev
```

Abre [http://localhost:5173](http://localhost:5173) en tu navegador.

## Estructura

```
src/
├── main.jsx              # Entry point
├── App.jsx               # Root component
├── theme.js              # Colores dark/light
├── GlobalStyles.jsx      # CSS global + animaciones
└── components/
    ├── Nav.jsx           # Navbar fija con scroll effect
    ├── Ticker.jsx        # Banda animada de features
    ├── Hero.jsx          # Hero + CV mockup flotante
    ├── Features.jsx      # Grid de 6 features
    ├── Demo.jsx          # Demo interactivo con filtros
    ├── Stats.jsx         # Métricas clave
    ├── Pricing.jsx       # Planes Free / Pro / Teams
    ├── FAQ.jsx           # Preguntas frecuentes
    ├── CTAFinal.jsx      # Llamada a la acción final
    └── Footer.jsx        # Footer con links
```

## Scripts

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Build de producción |
| `npm run preview` | Preview del build |

## Personalización

- **Colores**: edita `src/theme.js`
- **Contenido**: cada sección en su propio archivo en `src/components/`
- **Fuentes**: cambia los imports en `src/GlobalStyles.jsx`

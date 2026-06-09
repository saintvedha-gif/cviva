# CViva

> Aplicación web para crear, analizar y exportar currículos (CV) de forma interactiva.

## Resumen

CViva es una aplicación frontend en React (Vite) que permite a usuarios registrarse, subir o crear un CV, extraer automáticamente la información del CV usando un servicio de IA, editarlo en un dashboard y exportarlo a PDF/Word. Incluye:
- Autenticación y dashboard (subida, lista, editor, previsualización).
- Página interactiva para mostrar CVs.
- Exportación a PDF y Word desde el cliente.
- Endpoint serverless `api/parse-cv.js` que usa Anthropic para parsear texto de CV.

## Tecnologías

- React 18 + Vite
- Supabase (autenticación y almacenamiento)
- API serverless (función en `api/parse-cv.js`) que usa Anthropic
- Librerías para exportar: `jspdf`, `html2canvas`, `docx`, `file-saver`

Ver dependencias en [package.json](package.json#L1).

## Estructura principal

- `src/` – código fuente React
  - `src/lib/supabase.js` – inicializa cliente Supabase. Ver [src/lib/supabase.js](src/lib/supabase.js#L1).
  - `src/lib/parseCV.js` – utilidades para parsear CV localmente (si aplica).
  - `src/lib/exportPDF.js` y `src/lib/exportWord.js` – funciones para exportar CV.
  - `src/components/` – componentes UI (Nav, Hero, Dashboard, Auth, CV, etc.).
- `api/parse-cv.js` – función edge que manda el texto a Anthropic y devuelve JSON parseado. Ver [api/parse-cv.js](api/parse-cv.js#L1).
- `public/` – recursos públicos.
- `vite.config.js` – configuración de Vite (proxy a `/api`). Ver [vite.config.js](vite.config.js#L1).
- `vercel.json` – configuración de despliegue en Vercel.

## Variables de entorno

Hay variables que debes configurar antes de ejecutar la app:

- `VITE_SUPABASE_URL` — URL del proyecto Supabase (ej: https://xxxx.supabase.co)
- `VITE_SUPABASE_ANON_KEY` — clave anónima pública de Supabase
- `ANTHROPIC_API_KEY` — clave de Anthropic (usada únicamente en el servidor/función `api/parse-cv.js`)

Notas importantes:
- Las variables que empiecen con `VITE_` se exponen al cliente. No pongas en ellas claves privadas.
- `ANTHROPIC_API_KEY` debe establecerse en el entorno del servidor (Vercel/hosting) y NO debe ser pública.

## Instalación y ejecución local

Requisitos: Node.js (16+ recomendado) y npm.

1. Instala dependencias:

```bash
npm install
```

2. Crea un archivo `.env` en la raíz con al menos:

```
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
ANTHROPIC_API_KEY=your-anthropic-key
```

3. Ejecuta en desarrollo:

```bash
npm run dev
```

4. Para construir la versión de producción:

```bash
npm run build
npm run preview
```

## Cómo funciona (flujo de usuario)

1. Registro / Login: la app usa Supabase para auth. El cliente se conecta con `src/lib/supabase.js`.
2. Subir CV: en el dashboard el usuario puede subir un archivo o pegar texto.
3. Parseo automático: cuando se envía texto, la app llama a `api/parse-cv.js` que a su vez llama a Anthropic para extraer un JSON estructurado con la información del CV.
4. Edición: el usuario puede revisar/editar campos en `CVEditorPage` y guardar en Supabase.
5. Exportación: usar `exportPDF.js` o `exportWord.js` para generar archivos descargables.
6. Visualización pública/interactiva: `InteractiveCVPage.jsx` muestra un CV con animaciones y componentes interactivos.

## Endpoint de parseo (detalles técnicos)

- Ruta: `/api/parse-cv` (función edge)
- Método: `POST` con body `{ "text": "...texto del CV..." }`.
- Respuesta: `{ result: <objeto JSON parseado> }` o `{ error: ... }`.
- Requiere `ANTHROPIC_API_KEY` en las variables de entorno del servidor. `api/parse-cv.js` incluye lógica para limpiar la respuesta y devolver JSON.

Ejemplo de llamada desde cliente (fetch):

```js
const res = await fetch('/api/parse-cv', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ text: cvText })
});
const data = await res.json();
// data.result -> objeto con la estructura del CV
```

## Despliegue

- Recomendado: Vercel (archivo `vercel.json` incluido). Asegúrate de definir las variables de entorno en el dashboard de Vercel:
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_ANON_KEY`
  - `ANTHROPIC_API_KEY` (server only)

- Al desplegar en Vercel, la función `api/parse-cv` correrá en el runtime edge y podrá usar `process.env.ANTHROPIC_API_KEY`.

## Troubleshooting rápido

- Si la autenticación falla, verifica `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY`.
- Si el parseo devuelve `null` o estructura inválida, revisa el log del servidor y asegúrate de que `ANTHROPIC_API_KEY` esté correcto.
- Problemas de CORS: la función `api/parse-cv.js` maneja OPTIONS y añade `Access-Control-Allow-Origin: *`.

## Contribuir

- Fork y PR. Mantén la consistencia con las dependencias en `package.json`.
- Añade tests o validaciones si extiendes el parseador o la lógica de exportación.

## Archivos útiles (referencias rápidas)

- [package.json](package.json#L1) — scripts y dependencias.
- [src/lib/supabase.js](src/lib/supabase.js#L1) — inicialización Supabase.
- [api/parse-cv.js](api/parse-cv.js#L1) — función de parseo con Anthropic.
- [vite.config.js](vite.config.js#L1) — proxy y config dev.

## Licencia

Indica aquí la licencia del proyecto si aplica (MIT, Apache, etc.).

---

Si quieres, puedo:
- Añadir ejemplos concretos de `.env` para Vercel.
- Añadir un apartado de seguridad y buenas prácticas para las claves.
- Generar un archivo `ENV.example` con las variables necesarias.

Archivo creado automáticamente por asistente.
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

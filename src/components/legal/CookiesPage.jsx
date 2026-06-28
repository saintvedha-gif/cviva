// src/components/legal/CookiesPage.jsx
import LegalPage from "./LegalPage";

const CookiesPage = () => (
  <LegalPage title="Política de Cookies" updatedAt="26 de junio de 2026">
    <p>
      CViva usa una cantidad mínima de almacenamiento local en tu navegador — no usamos
      cookies de publicidad ni de seguimiento de terceros.
    </p>

    <h2>1. Qué guardamos en tu navegador</h2>
    <ul>
      <li>
        <strong>Sesión de inicio de sesión:</strong> para mantenerte conectado a tu
        cuenta, usamos el almacenamiento local de tu navegador a través de nuestro
        proveedor de autenticación (Supabase). Esto permite que no tengas que iniciar
        sesión cada vez que abres CViva.
      </li>
      <li>
        <strong>Preferencia de pantalla de bienvenida:</strong> guardamos una marca
        simple para recordar si ya viste la pantalla de bienvenida del panel, así no
        te la mostramos de nuevo en cada visita.
      </li>
    </ul>

    <h2>2. Lo que NO usamos</h2>
    <ul>
      <li>No usamos cookies de publicidad ni de redes publicitarias.</li>
      <li>No usamos herramientas de seguimiento de terceros (como Google Analytics o píxeles de redes sociales) en este momento.</li>
      <li>No vendemos ni compartimos datos de navegación con anunciantes.</li>
    </ul>
    <p>
      Si en el futuro incorporamos herramientas de analítica o publicidad,
      actualizaremos esta página para reflejarlo antes de activarlas.
    </p>

    <h2>3. Cómo borrar este almacenamiento</h2>
    <p>
      Puedes borrar el almacenamiento local de tu navegador para CViva en cualquier
      momento desde la configuración de tu navegador (usualmente en
      "Privacidad" o "Datos de sitios"). Si lo borras, simplemente tendrás que iniciar
      sesión de nuevo y volverás a ver la pantalla de bienvenida una vez.
    </p>

    <h2>4. Contacto</h2>
    <p>
      Si tienes preguntas sobre esta política, escríbenos a{" "}
      <a href="mailto:hola@cviva.co">hola@cviva.co</a>.
    </p>
  </LegalPage>
);

export default CookiesPage;
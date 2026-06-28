// src/components/legal/PrivacyPage.jsx
import LegalPage from "./LegalPage";

const PrivacyPage = () => (
  <LegalPage title="Política de Privacidad" updatedAt="28 de junio de 2026">
    <p>
      CViva es operado por <strong>ARB Sistemas Productivos SAS</strong>, NIT
      901.344.972, sociedad colombiana, responsable del tratamiento de tus datos
      personales conforme a la Ley 1581 de 2012 y demás normas colombianas aplicables
      en materia de protección de datos. Cualquier duda sobre tus datos, escríbenos a{" "}
      <a href="mailto:hola@cviva.co">hola@cviva.co</a>.
    </p>

    <h2>1. Qué información recopilamos</h2>
    <p>Recopilamos la información que tú nos das directamente, incluyendo:</p>
    <ul>
      <li>Datos de registro: nombre, correo electrónico y, si usas Google para iniciar sesión, la información básica de tu perfil de Google.</li>
      <li>Datos de tu CV: nombre, cargo, correo, teléfono, ubicación, experiencia, educación, habilidades, certificaciones, proyectos, idiomas y, si la agregas, una foto de perfil.</li>
      <li>El archivo de CV que subas (PDF o Word), si usas la función de extracción automática con IA.</li>
      <li>Datos de uso básicos, como cuántas veces se vio o descargó un CV publicado.</li>
      <li>Datos de pago, si te suscribes a un plan de pago. La información sensible de tu tarjeta es procesada directamente por nuestro proveedor de pagos (Wompi); nosotros no almacenamos el número completo de tu tarjeta.</li>
    </ul>

    <h2>2. Para qué usamos tu información</h2>
    <ul>
      <li>Crear y administrar tu cuenta.</li>
      <li>Generar y mostrar tu CV, incluyendo la versión pública si decides publicarlo.</li>
      <li>Procesar el archivo de tu CV con inteligencia artificial cuando usas la función de extracción automática, para convertirlo en los datos estructurados de tu perfil.</li>
      <li>Procesar pagos y gestionar tu plan de suscripción.</li>
      <li>Comunicarnos contigo sobre tu cuenta (por ejemplo, confirmaciones de registro o de pago).</li>
      <li>Mejorar el Servicio y corregir errores.</li>
    </ul>

    <h2>3. Con quién compartimos tu información</h2>
    <p>No vendemos tu información personal. La compartimos únicamente con:</p>
    <ul>
      <li><strong>Supabase</strong>: nuestro proveedor de base de datos, autenticación y almacenamiento de archivos (como fotos de perfil).</li>
      <li><strong>Anthropic</strong>: el proveedor de inteligencia artificial que usamos para extraer automáticamente los datos de un CV que subas en PDF o Word. El texto de tu CV se envía a este proveedor únicamente para ese propósito.</li>
      <li><strong>Wompi</strong>: nuestro proveedor de procesamiento de pagos, si te suscribes a un plan de pago.</li>
      <li>Cualquier persona con la que compartas tu link público de CV — recuerda que, mientras un CV esté publicado, cualquiera con el enlace puede verlo.</li>
    </ul>
    <p>
      También podríamos compartir información si la ley nos lo exige, o para proteger
      los derechos, la seguridad o la propiedad de CViva o de terceros.
    </p>

    <h2>4. Dónde se almacenan tus datos</h2>
    <p>
      Tus datos se almacenan en la infraestructura de nuestros proveedores (Supabase).
      Si tienes preguntas específicas sobre la ubicación de los servidores o medidas de
      seguridad de estos proveedores, puedes escribirnos y te daremos la información
      disponible.
    </p>

    <h2>5. Cuánto tiempo conservamos tu información</h2>
    <p>
      Conservamos tu información mientras tu cuenta esté activa. Si solicitas la
      eliminación de tu cuenta, eliminamos tus datos personales y tus CVs en un plazo
      razonable, salvo la información que debamos conservar por obligaciones legales o
      contables (por ejemplo, registros de pagos).
    </p>

    <h2>6. Tus derechos</h2>
    <p>
      Conforme a la Ley 1581 de 2012 y demás normas colombianas de protección de
      datos, puedes solicitarnos en cualquier momento, escribiendo a{" "}
      <a href="mailto:hola@cviva.co">hola@cviva.co</a>:
    </p>
    <ul>
      <li>Conocer, actualizar y rectificar tus datos personales.</li>
      <li>Solicitar prueba de la autorización otorgada para el tratamiento de tus datos.</li>
      <li>Ser informado sobre el uso que le hemos dado a tus datos personales.</li>
      <li>Eliminar tu cuenta y tus datos personales, cuando no exista un deber legal o contractual que nos obligue a conservarlos.</li>
      <li>Despublicar cualquier CV que hayas hecho público (esto también lo puedes hacer tú mismo desde tu panel).</li>
      <li>Revocar la autorización y/o solicitar la eliminación de tus datos cuando no se respeten los principios, derechos y garantías constitucionales y legales.</li>
    </ul>
    <p>
      Si consideras que tus datos no han sido tratados conforme a la ley, también
      puedes presentar una queja ante la Superintendencia de Industria y Comercio
      (SIC), autoridad de control en materia de protección de datos en Colombia.
    </p>

    <h2>7. Menores de edad</h2>
    <p>
      CViva no está dirigido a menores de edad. Si tienes conocimiento de que un menor
      ha creado una cuenta sin el consentimiento de sus padres o tutores, contáctanos
      para eliminarla.
    </p>

    <h2>8. Cambios a esta política</h2>
    <p>
      Podemos actualizar esta Política de Privacidad ocasionalmente. Si los cambios son
      significativos, te lo notificaremos por correo o dentro de la plataforma.
    </p>

    <h2>9. Contacto</h2>
    <p>
      Para cualquier solicitud o pregunta sobre tus datos personales, escríbenos a{" "}
      <a href="mailto:hola@cviva.co">hola@cviva.co</a>.
    </p>
  </LegalPage>
);

export default PrivacyPage;
// src/components/legal/TermsPage.jsx
import LegalPage from "./LegalPage";

const TermsPage = () => (
  <LegalPage title="Términos y Condiciones" updatedAt="28 de junio de 2026">
    <p>
      Estos Términos y Condiciones regulan el uso de CViva (en adelante, "el Servicio"),
      una plataforma para crear, editar, publicar y exportar hojas de vida interactivas.
      Al crear una cuenta o usar el Servicio, aceptas estos términos. Si no estás de
      acuerdo, por favor no uses el Servicio.
    </p>
    <p>
      CViva es operado por <strong>ARB Sistemas Productivos SAS</strong>, NIT
      901.344.972, sociedad colombiana (en adelante, "nosotros" o "la Empresa").
      Cualquier duda sobre estos términos, puedes escribirnos a{" "}
      <a href="mailto:hola@cviva.co">hola@cviva.co</a>.
    </p>

    <h2>1. Qué es CViva</h2>
    <p>
      CViva te permite subir un CV existente (en PDF o Word) o crear uno desde cero,
      editarlo, publicarlo con un link público, y descargarlo en distintos formatos
      (PDF compatible con sistemas ATS, PDF de diseño visual, o Word editable).
    </p>

    <h2>2. Tu cuenta</h2>
    <p>
      Para usar el Servicio necesitas crear una cuenta con tu correo electrónico o tu
      cuenta de Google. Eres responsable de mantener la confidencialidad de tu
      contraseña y de toda actividad que ocurra en tu cuenta. Debes proporcionarnos
      información veraz al registrarte.
    </p>

    <h2>3. Planes y pagos</h2>
    <p>
      CViva ofrece un plan gratuito (Free) con funcionalidades limitadas, y planes de
      pago (Pro y Teams) con funcionalidades adicionales, según se describe en nuestra
      página de precios. Los pagos se procesan a través de un proveedor de pagos
      externo (Wompi). No almacenamos los datos completos de tu tarjeta; eso lo
      gestiona directamente el proveedor de pagos.
    </p>
    <p>
      Los precios están sujetos a cambios, que te notificaremos con anticipación
      razonable. Si cambiamos el precio de tu plan, el nuevo precio aplicará a partir
      de tu siguiente período de facturación.
    </p>

    <h2>4. Cancelación y reembolsos</h2>
    <p>
      Puedes solicitar la cancelación de tu suscripción en cualquier momento
      escribiendo a <a href="mailto:hola@cviva.co">hola@cviva.co</a>. Procesamos las
      cancelaciones manualmente y conservas el acceso a las funciones de tu plan hasta
      el final del período ya pagado. Actualmente no ofrecemos reembolsos por períodos
      parcialmente usados, salvo que la ley aplicable indique lo contrario o que el
      caso lo justifique a nuestra discreción.
    </p>

    <h2>5. Contenido que subes</h2>
    <p>
      Tú eres el único responsable de la información que incluyes en tu CV (datos
      personales, experiencia, fotos, enlaces, etc.). No subas información falsa,
      contenido que no te pertenezca, ni datos de terceros sin su consentimiento.
    </p>
    <p>
      Conservas todos los derechos sobre el contenido de tu CV. Nos das permiso
      únicamente para almacenar, procesar y mostrar ese contenido con el fin de
      operar el Servicio (por ejemplo, para mostrar tu CV en el link público que tú
      decides publicar).
    </p>

    <h2>6. CVs públicos</h2>
    <p>
      Cuando publicas un CV, este queda accesible mediante un link público que
      cualquier persona con el enlace puede ver. Puedes despublicarlo en cualquier
      momento desde tu panel; al hacerlo, el link deja de mostrar tu información.
    </p>

    <h2>7. Uso aceptable</h2>
    <ul>
      <li>No usar el Servicio para fines ilegales o fraudulentos.</li>
      <li>No intentar vulnerar la seguridad de la plataforma ni acceder a cuentas de otras personas.</li>
      <li>No usar el Servicio para distribuir contenido difamatorio, discriminatorio o que infrinja derechos de terceros.</li>
    </ul>

    <h2>8. Disponibilidad del Servicio</h2>
    <p>
      Hacemos nuestro mejor esfuerzo para mantener el Servicio disponible, pero no
      garantizamos disponibilidad ininterrumpida. Podemos realizar mantenimientos,
      actualizaciones o cambios en las funcionalidades en cualquier momento.
    </p>

    <h2>9. Limitación de responsabilidad</h2>
    <p>
      El Servicio se ofrece "tal cual". En la medida permitida por la ley, no somos
      responsables por decisiones de contratación de terceros, ni garantizamos que tu
      CV será aceptado por ningún sistema de selección o reclutador específico.
    </p>

    <h2>10. Cambios a estos términos</h2>
    <p>
      Podemos actualizar estos Términos ocasionalmente. Si los cambios son
      significativos, te lo notificaremos por correo o dentro de la plataforma. El uso
      continuado del Servicio después de un cambio implica tu aceptación de los nuevos
      términos.
    </p>

    <h2>11. Ley aplicable</h2>
    <p>
      Estos Términos se rigen por las leyes de la República de Colombia. Cualquier
      controversia relacionada con el Servicio se resolverá ante los jueces y
      tribunales competentes de Colombia, salvo que la ley aplicable indique lo
      contrario.
    </p>

    <h2>12. Contacto</h2>
    <p>
      Si tienes preguntas sobre estos Términos, escríbenos a{" "}
      <a href="mailto:hola@cviva.co">hola@cviva.co</a>.
    </p>
  </LegalPage>
);

export default TermsPage;
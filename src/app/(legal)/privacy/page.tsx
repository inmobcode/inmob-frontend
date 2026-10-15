import type { Metadata } from "next";

import { LegalDocument, LegalLink, type LegalSection } from "@/components/legal/legal-document";
import { LEGAL_ENTITY } from "@/lib/legal";
import { absoluteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Política de privacidad",
  description:
    "Qué datos personales trata Tivvo, para qué, con quién los comparte y cómo ejercer tus derechos.",
  alternates: { canonical: absoluteUrl("/privacy") },
};

const { name, taxId, address, privacyEmail } = LEGAL_ENTITY;

const SUMMARY = [
  "Usamos tus datos para darte el servicio, cobrarlo, mantenerlo seguro y avisarte lo importante. No vendemos datos ni mostramos publicidad.",
  "Los datos de los clientes y propietarios que carga una agencia son de esa agencia: ella decide cómo los usa y nosotros los procesamos por su cuenta.",
  "Trabajamos con proveedores de infraestructura y de email que pueden estar fuera de Argentina, con contratos que protegen tus datos.",
  "Podés pedirnos acceso, corrección o eliminación de tus datos escribiendo a " +
    privacyEmail +
    ". El acceso es gratuito.",
];

const SECTIONS: LegalSection[] = [
  {
    id: "responsable",
    title: "Quién es responsable de tus datos",
    content: (
      <>
        <p>
          Esta Política explica cómo trata datos personales {name}, CUIT {taxId}, con domicilio
          en {address} («Tivvo», «nosotros»), cuando usás tivvo.app, sus subdominios y los
          sitios de agencias publicados con Tivvo. Se aplica conforme a la Ley 25.326 de
          Protección de los Datos Personales, su Decreto reglamentario 1558/2001 y las normas de
          la Agencia de Acceso a la Información Pública (AAIP).
        </p>
        <p>Tivvo tiene dos papeles distintos según de quién sean los datos:</p>
        <ul>
          <li>
            <strong>Somos responsables</strong> de los datos de las agencias y sus usuarios
            (cuenta, facturación, uso del sistema), de quienes piden una demo o nos escriben, y de
            quienes visitan tivvo.app.
          </li>
          <li>
            <strong>Tratamos datos por cuenta de cada agencia</strong> cuando se trata de sus
            clientes, interesados, huéspedes y propietarios. En ese caso la responsable es la
            agencia, y nosotros actuamos como prestador de servicios de tratamiento (artículo 25
            de la Ley 25.326): seguimos sus instrucciones y no usamos esos datos para fines
            propios.
          </li>
        </ul>
        <p>
          Si dejaste tus datos en el sitio de una agencia, recibiste una oferta o tenés una
          reserva, la que decide sobre tus datos es esa agencia. Te conviene escribirle a ella
          primero; si nos escribís a nosotros, le derivamos tu pedido.
        </p>
      </>
    ),
  },
  {
    id: "datos-que-tratamos",
    title: "Qué datos tratamos",
    content: (
      <>
        <h3>Si usás Tivvo en una agencia</h3>
        <ul>
          <li>
            <strong>Cuenta:</strong> nombre, email, contraseña (guardada cifrada con un algoritmo
            de hash, nunca en texto plano), rol y agencia a la que pertenecés.
          </li>
          <li>
            <strong>Ingreso con Google o Apple:</strong> si lo elegís, recibimos de ese proveedor
            tu nombre, tu email y un identificador de cuenta. No recibimos tu contraseña.
          </li>
          <li>
            <strong>Agencia:</strong> nombre, datos de contacto, logo, configuración del sitio y,
            en planes pagos, los datos necesarios para facturar.
          </li>
          <li>
            <strong>Uso y datos técnicos:</strong> fechas de ingreso, acciones relevantes dentro
            del sistema, dirección IP, navegador y registros de errores, que usamos para seguridad
            y para resolver problemas.
          </li>
          <li>
            <strong>Comunicaciones:</strong> lo que nos escribís por email o en el formulario de
            demo (nombre, email, agencia, tamaño del equipo y tu mensaje).
          </li>
        </ul>
        <h3>Datos que las agencias cargan o reciben con Tivvo</h3>
        <p>
          Por cuenta de cada agencia tratamos los datos de sus clientes finales: nombre, email,
          teléfono, consultas y mensajes, notas e historial, ofertas, reservas con fechas y
          cantidad de huéspedes, pagos registrados, documentos que la agencia adjunte y datos de
          los propietarios y sus inmuebles. Qué datos se cargan depende de cada agencia.
        </p>
        <p>
          No pedimos datos sensibles y pedimos a las agencias que no los carguen salvo que la ley
          lo permita y sea indispensable.
        </p>
      </>
    ),
  },
  {
    id: "finalidades",
    title: "Para qué los usamos",
    content: (
      <>
        <p>Usamos los datos de los que somos responsables para:</p>
        <ol>
          <li>crear y administrar tu cuenta y la de tu agencia, y permitirte ingresar;</li>
          <li>prestar el Servicio que contrataste, con sus funciones y límites;</li>
          <li>facturar y cobrar los planes pagos;</li>
          <li>enviarte avisos operativos: seguridad, cambios de contraseña, consultas nuevas, cambios en los planes o en estas condiciones;</li>
          <li>darte soporte y responder tus consultas o tu pedido de demo;</li>
          <li>proteger el Servicio, detectar abusos y prevenir fraudes;</li>
          <li>entender cómo se usa el Servicio para mejorarlo, con datos agregados siempre que sea posible;</li>
          <li>enviarte novedades del producto, si no te opusiste (podés darte de baja desde cualquier email);</li>
          <li>cumplir obligaciones legales, contables e impositivas.</li>
        </ol>
        <p>
          Los datos de los clientes finales los usamos solo para que la agencia pueda trabajar
          con ellos: guardarlos, mostrarlos a su equipo, publicar sus ofertas o reservas en links
          privados y enviar, en nombre de la agencia, los emails de aviso y confirmación de
          consultas, ofertas y reservas.
        </p>
        <p>
          No vendemos datos personales, no los usamos para publicidad de terceros y no tomamos
          decisiones automatizadas que produzcan efectos jurídicos sobre las personas.
        </p>
      </>
    ),
  },
  {
    id: "bases",
    title: "Por qué podemos tratarlos",
    content: (
      <>
        <p>
          Tratamos tus datos porque son necesarios para la relación contractual con tu agencia
          (artículo 5, inciso 2.c de la Ley 25.326), porque nos diste tu consentimiento (por
          ejemplo, al enviar el formulario de demo), o porque una norma nos obliga a conservarlos
          (por ejemplo, los registros de facturación).
        </p>
        <p>
          Los datos marcados como obligatorios en cada formulario son necesarios para prestar el
          Servicio: si no los das, no podemos crear la cuenta o responder tu pedido. Los demás son
          opcionales.
        </p>
        <p>
          Cuando tratamos datos por cuenta de una agencia, es esa agencia quien debe contar con
          una base legal y con el consentimiento de sus clientes cuando corresponda.
        </p>
      </>
    ),
  },
  {
    id: "proveedores",
    title: "Con quién los compartimos",
    content: (
      <>
        <p>
          Compartimos datos solo con proveedores que necesitamos para operar el Servicio, bajo
          contratos que les exigen confidencialidad, seguridad y usarlos solo para prestarnos el
          servicio:
        </p>
        <ul>
          <li>
            <strong>Supabase</strong> (sobre infraestructura de Amazon Web Services): base de
            datos y almacenamiento de fotos y archivos.
          </li>
          <li>
            <strong>Resend</strong>: envío de los emails del sistema (avisos, confirmaciones,
            recuperación de contraseña).
          </li>
          <li>
            <strong>Proveedores de alojamiento de la aplicación web</strong>, que reciben los
            datos técnicos de cada visita (dirección IP, navegador) para servir las páginas.
          </li>
          <li>
            <strong>Google y Apple</strong>, solo si elegís ingresar con su cuenta.
          </li>
        </ul>
        <p>
          Además, los datos se muestran a quien corresponda según cómo uses el Servicio: el equipo
          de tu agencia ve los datos de la agencia, y quien recibe un link de oferta, reserva o
          portal del propietario ve el contenido de ese link.
        </p>
        <p>
          Podemos revelar datos si lo ordena un juez o una autoridad competente, o si es
          necesario para defender nuestros derechos. Si Tivvo se fusiona o es adquirida, los datos
          se transferirán a la nueva entidad, que deberá respetar esta Política.
        </p>
      </>
    ),
  },
  {
    id: "transferencias",
    title: "Transferencias internacionales",
    content: (
      <>
        <p>
          Algunos de nuestros proveedores alojan o procesan datos fuera de Argentina, entre otros
          en los Estados Unidos y en la Unión Europea. La Unión Europea está reconocida por la AAIP
          como un destino con nivel de protección adecuado; para los demás países, las
          transferencias se hacen bajo cláusulas contractuales que ofrecen garantías
          equivalentes a las de la Ley 25.326, en línea con los modelos aprobados por la
          Disposición 60-E/2016 y la Resolución 198/2023 de la AAIP.
        </p>
        <p>
          Al usar el Servicio, y en los términos del artículo 12 de la Ley 25.326, prestás tu
          consentimiento para estas transferencias. Si querés saber más sobre las garantías que
          aplicamos, escribinos.
        </p>
      </>
    ),
  },
  {
    id: "conservacion",
    title: "Cuánto tiempo los guardamos",
    content: (
      <ul>
        <li>
          <strong>Datos de la cuenta y de la agencia:</strong> mientras la cuenta esté activa.
          Si se cierra, quedan 30 días disponibles para exportar y luego se eliminan; las copias
          de seguridad se sobrescriben en un plazo que no supera los 90 días.
        </li>
        <li>
          <strong>Elementos eliminados dentro del sistema:</strong> 30 días en la papelera, donde
          se pueden recuperar; después se borran definitivamente.
        </li>
        <li>
          <strong>Datos de facturación:</strong> 10 años, como exige el artículo 328 del Código
          Civil y Comercial para la documentación contable.
        </li>
        <li>
          <strong>Registros técnicos y de seguridad:</strong> el tiempo necesario para investigar
          incidentes, en general no más de 12 meses.
        </li>
        <li>
          <strong>Pedidos de demo y consultas:</strong> hasta 2 años desde el último contacto, o
          antes si nos pedís que los borremos.
        </li>
      </ul>
    ),
  },
  {
    id: "seguridad",
    title: "Cómo los protegemos",
    content: (
      <>
        <p>
          Aplicamos medidas técnicas y organizativas siguiendo las recomendaciones de la
          Resolución 47/2018 de la AAIP, entre ellas:
        </p>
        <ul>
          <li>cifrado de las comunicaciones (HTTPS/TLS) entre tu navegador, la aplicación y nuestros proveedores;</li>
          <li>contraseñas guardadas con hash, nunca legibles;</li>
          <li>separación de datos por agencia: cada equipo accede solo a su propio espacio;</li>
          <li>permisos por rol dentro de cada agencia;</li>
          <li>links privados de ofertas, reservas y propietarios generados con identificadores difíciles de adivinar;</li>
          <li>copias de seguridad y acceso restringido del personal a los datos de producción.</li>
        </ul>
        <p>
          Ningún sistema es infalible. Si detectamos un incidente de seguridad que afecte datos
          personales, lo investigamos, tomamos medidas para contenerlo, lo comunicamos a las
          agencias afectadas sin demoras indebidas y, cuando corresponda, a la AAIP y a las
          personas afectadas.
        </p>
      </>
    ),
  },
  {
    id: "cookies",
    title: "Cookies y almacenamiento en tu navegador",
    content: (
      <>
        <p>
          Tivvo usa solo cookies y almacenamiento local necesarios para que el Servicio funcione.
          No usamos cookies de publicidad ni de seguimiento de terceros.
        </p>
        <ul>
          <li>
            <strong>Sesión</strong> (<code>access_token</code>, <code>refresh_token</code>,{" "}
            <code>tivvo_user</code>): mantienen tu sesión iniciada hasta 180 días o hasta que
            cierres sesión.
          </li>
          <li>
            <strong>Preferencias</strong> (<code>sidebar_collapsed</code> y almacenamiento local):
            recuerdan si el menú está contraído, la vista elegida en cada listado y el tema claro
            u oscuro.
          </li>
          <li>
            <strong>Ingreso con Google o Apple:</strong> durante el inicio de sesión guardamos en
            la pestaña la página a la que volver; se borra al terminar.
          </li>
        </ul>
        <p>
          Podés borrar o bloquear las cookies desde tu navegador. Si bloqueás las de sesión, no
          vas a poder ingresar al sistema. Los sitios públicos de las agencias no instalan cookies
          de Tivvo.
        </p>
      </>
    ),
  },
  {
    id: "derechos",
    title: "Tus derechos y cómo ejercerlos",
    content: (
      <>
        <p>Como titular de los datos tenés derecho a:</p>
        <ul>
          <li>
            <strong>Acceso:</strong> saber qué datos tuyos tenemos, de dónde salieron y para qué
            los usamos. Es gratuito si lo pedís con intervalos de al menos seis meses, salvo que
            acredites un interés legítimo para hacerlo antes (artículo 14 de la Ley 25.326).
            Respondemos dentro de los 10 días corridos.
          </li>
          <li>
            <strong>Rectificación, actualización y supresión:</strong> que corrijamos datos
            inexactos o borremos los que no corresponda conservar. Lo resolvemos dentro de los 5
            días hábiles (artículo 16).
          </li>
          <li>
            <strong>Oposición a comunicaciones comerciales:</strong> pedir que dejemos de enviarte
            novedades, en cualquier momento (artículo 27).
          </li>
          <li>
            <strong>Revocar tu consentimiento</strong> cuando el tratamiento se base en él, sin
            efecto retroactivo.
          </li>
        </ul>
        <p>
          Para ejercerlos, escribí a{" "}
          <LegalLink href={`mailto:${privacyEmail}`}>{privacyEmail}</LegalLink> desde el email
          asociado a tus datos, indicando qué pedís. Si no podemos verificar tu identidad, te
          pediremos un documento que la acredite. También podés corregir la mayoría de tus datos
          desde tu perfil.
        </p>
        <p>
          Si tus datos los cargó una agencia (por ejemplo, porque le hiciste una consulta), el
          pedido debe dirigirse a esa agencia; si nos llega a nosotros, se lo reenviamos dentro de
          los 5 días hábiles y la ayudamos a responderlo.
        </p>
        <p>
          Si no respondemos en plazo o la respuesta no te satisface, podés reclamar ante la
          Agencia de Acceso a la Información Pública en{" "}
          <LegalLink href="https://www.argentina.gob.ar/aaip/datospersonales">
            argentina.gob.ar/aaip
          </LegalLink>
          .
        </p>
      </>
    ),
  },
  {
    id: "menores",
    title: "Menores de edad",
    content: (
      <p>
        Tivvo es una herramienta profesional para mayores de 18 años y no está dirigida a menores.
        Si sabés que un menor nos dio sus datos sin autorización, escribinos y los eliminamos.
      </p>
    ),
  },
  {
    id: "cambios",
    title: "Cambios en esta Política",
    content: (
      <p>
        Podemos actualizar esta Política para reflejar cambios en el Servicio o en la ley. Si el
        cambio es relevante, te avisamos por email y dentro del Servicio con al menos 30 días de
        anticipación. La fecha de la versión vigente figura al principio de esta página.
      </p>
    ),
  },
  {
    id: "contacto",
    title: "Contacto",
    content: (
      <>
        <p>
          Por cualquier consulta sobre privacidad escribinos a{" "}
          <LegalLink href={`mailto:${privacyEmail}`}>{privacyEmail}</LegalLink> o por correo a{" "}
          {address}.
        </p>
        <p className="border-l-2 border-line pl-4 text-sm text-quiet">
          LA AGENCIA DE ACCESO A LA INFORMACIÓN PÚBLICA, en su carácter de Órgano de Control de la
          Ley N° 25.326, tiene la atribución de atender las denuncias y reclamos que interpongan
          quienes resulten afectados en sus derechos por incumplimiento de las normas vigentes en
          materia de protección de datos personales.
        </p>
      </>
    ),
  },
];

export default function PrivacyPage() {
  return (
    <LegalDocument
      title="Política de privacidad"
      intro={
        <p>
          Qué datos personales tratamos, para qué, con quién los compartimos y cómo podés
          acceder a ellos, corregirlos o pedir que los borremos.
        </p>
      }
      summary={SUMMARY}
      sections={SECTIONS}
      related={{ href: "/terms", label: "Términos y condiciones" }}
    />
  );
}

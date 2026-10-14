import type { Metadata } from "next";

import { LegalDocument, LegalLink, type LegalSection } from "@/components/legal/legal-document";
import { LEGAL_ENTITY } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Términos y condiciones · Tivvo",
  description:
    "Condiciones de uso de Tivvo, el sistema de gestión para agencias de venta y alquiler temporario.",
};

const { name, taxId, address, jurisdiction, contactEmail } = LEGAL_ENTITY;

const SUMMARY = [
  "Tivvo es una herramienta para que tu agencia gestione propiedades, clientes, ofertas y reservas, y publique su propio sitio. No somos parte de las operaciones que hagas con tus clientes.",
  "Los datos que cargás son de tu agencia. Nosotros los guardamos y procesamos para prestarte el servicio, y podés exportarlos.",
  "Tu agencia es responsable de cumplir las normas de su actividad: matrícula, publicidad veraz, contratos de alquiler y protección de datos de sus clientes.",
  "Podés dar de baja tu plan cuando quieras, por el mismo medio en que lo contrataste. Te avisamos con 30 días de anticipación si cambian los precios o estas condiciones.",
];

const SECTIONS: LegalSection[] = [
  {
    id: "quienes-somos",
    title: "Quiénes somos y qué regulan estos términos",
    content: (
      <>
        <p>
          Estos Términos y condiciones (los «Términos») regulan el acceso y el uso de Tivvo, el
          sistema de gestión para agencias inmobiliarias disponible en tivvo.app y sus subdominios
          (el «Servicio»). El Servicio es prestado por {name}, CUIT {taxId}, con domicilio en{" "}
          {address} («Tivvo», «nosotros»).
        </p>
        <p>
          Los Términos forman, junto con la{" "}
          <LegalLink href="/privacidad">Política de privacidad</LegalLink> y las condiciones del
          plan que contrates, el acuerdo completo entre Tivvo y la Agencia. Si una condición
          particular de tu plan (por ejemplo, un acuerdo Enterprise firmado) dice algo distinto,
          prevalece la condición particular.
        </p>
      </>
    ),
  },
  {
    id: "definiciones",
    title: "Definiciones",
    content: (
      <ul>
        <li>
          <strong>Agencia:</strong> la persona humana o jurídica que crea una cuenta en Tivvo para
          gestionar su actividad inmobiliaria.
        </li>
        <li>
          <strong>Usuarios:</strong> las personas que la Agencia habilita para usar su cuenta
          (titulares, administradores, agentes y demás roles).
        </li>
        <li>
          <strong>Clientes finales:</strong> las personas cuyos datos la Agencia carga o recibe a
          través del Servicio: interesados, compradores, inquilinos, huéspedes y propietarios.
        </li>
        <li>
          <strong>Datos de la Agencia:</strong> toda la información que la Agencia y sus Usuarios
          cargan en el Servicio o reciben a través de él: propiedades, fotos, textos, tarifas,
          clientes, consultas, ofertas, reservas, pagos registrados y documentos.
        </li>
        <li>
          <strong>Sitio de la Agencia:</strong> el sitio público que la Agencia arma con el editor
          de Tivvo y que se publica en un subdominio de Tivvo con el nombre de la Agencia.
        </li>
      </ul>
    ),
  },
  {
    id: "aceptacion",
    title: "Aceptación y capacidad",
    content: (
      <>
        <p>
          Al crear una cuenta, ingresar con Google o Apple, o usar el Servicio, aceptás estos
          Términos. Si no estás de acuerdo, no uses el Servicio.
        </p>
        <p>
          Para crear una cuenta tenés que ser mayor de 18 años y tener capacidad para contratar.
          Si la creás en nombre de una empresa o de otra persona, declarás que tenés facultades
          suficientes para obligarla; en ese caso, «vos» y «la Agencia» se refieren a esa empresa
          o persona.
        </p>
        <p>
          Estos Términos son un contrato por adhesión en los términos de los artículos 984 y
          siguientes del Código Civil y Comercial de la Nación. Los redactamos para que se
          entiendan sin ayuda; si algo no queda claro, escribinos antes de aceptarlos.
        </p>
      </>
    ),
  },
  {
    id: "cuenta",
    title: "Cuenta, usuarios y seguridad",
    content: (
      <>
        <p>
          La Agencia tiene que dar información verdadera y mantenerla actualizada, en especial el
          email de contacto, porque es el medio por el que te avisamos de cambios importantes.
        </p>
        <p>
          La Agencia decide quién accede a su cuenta y con qué permisos, y responde por lo que
          hagan sus Usuarios dentro del Servicio. Cada Usuario debe tener credenciales propias:
          no compartas contraseñas entre personas.
        </p>
        <p>
          Si sospechás que alguien accedió a tu cuenta sin autorización, cambiá la contraseña y
          avisanos de inmediato a{" "}
          <LegalLink href={`mailto:${contactEmail}`}>{contactEmail}</LegalLink>.
        </p>
      </>
    ),
  },
  {
    id: "servicio",
    title: "Qué incluye el Servicio",
    content: (
      <>
        <p>Según el plan contratado, el Servicio permite, entre otras cosas:</p>
        <ul>
          <li>cargar y publicar propiedades en venta y en alquiler temporario;</li>
          <li>
            gestionar clientes, consultas, ofertas, reservas, disponibilidad, tarifas por
            temporada y pagos registrados;
          </li>
          <li>
            compartir ofertas, reservas y el portal del propietario mediante links privados;
          </li>
          <li>armar y publicar el Sitio de la Agencia;</li>
          <li>trabajar en equipo con roles y permisos.</li>
        </ul>
        <p>
          Tivvo mejora el Servicio de forma continua: podemos agregar, cambiar o retirar
          funciones. Si retiramos una función esencial de un plan pago, te avisamos con al menos
          30 días de anticipación y, si no te sirve el cambio, podés dar de baja el plan sin
          costo.
        </p>
        <p>
          Algunas funciones pueden ofrecerse como «beta» o de prueba. Se prestan tal como están,
          pueden cambiar sin aviso y no conviene apoyarse en ellas para tareas críticas.
        </p>
      </>
    ),
  },
  {
    id: "rol-de-tivvo",
    title: "Tivvo no es parte de tus operaciones",
    content: (
      <>
        <p>
          Tivvo es una herramienta de software. No es una inmobiliaria, no actúa como corredor ni
          intermediario, no cobra en nombre de la Agencia y no garantiza que una operación se
          concrete. Las ventas, alquileres, reservas, señas, comisiones y cobros son acuerdos
          entre la Agencia, sus clientes y los propietarios.
        </p>
        <p>
          Los pagos que la Agencia registra en Tivvo son anotaciones para su propio control; Tivvo
          no los procesa ni los custodia. Las disponibilidades sincronizadas con calendarios
          externos (por ejemplo, por iCal) dependen de esos servicios y pueden tener demoras: la
          Agencia debe confirmar la disponibilidad antes de cerrar una reserva.
        </p>
      </>
    ),
  },
  {
    id: "obligaciones-agencia",
    title: "Responsabilidades de la Agencia",
    content: (
      <>
        <p>La Agencia es la única responsable de su actividad y, en particular, de:</p>
        <ul>
          <li>
            cumplir las normas del corretaje inmobiliario que le correspondan (matrícula, colegio
            profesional y leyes de cada provincia o de la Ciudad de Buenos Aires);
          </li>
          <li>
            que la información de sus propiedades, precios y condiciones sea veraz, completa y
            esté actualizada, como exige la Ley 24.240 de Defensa del Consumidor;
          </li>
          <li>
            los contratos que celebre con sus clientes y propietarios, incluidas las normas sobre
            locaciones y alquileres temporarios;
          </li>
          <li>
            tratar los datos personales de sus Clientes finales conforme a la Ley 25.326 (ver la
            sección «Datos personales»);
          </li>
          <li>
            tener los derechos sobre las fotos, planos, textos y marcas que publica, y el permiso
            de los propietarios para publicar sus inmuebles;
          </li>
          <li>
            los impuestos y obligaciones fiscales que surjan de su actividad.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "uso-aceptable",
    title: "Uso aceptable",
    content: (
      <>
        <p>No está permitido usar el Servicio para:</p>
        <ul>
          <li>publicar propiedades inexistentes, precios engañosos o contenido ilícito;</li>
          <li>
            enviar comunicaciones comerciales no solicitadas o usar datos de contacto obtenidos
            sin una base legal;
          </li>
          <li>
            cargar datos sensibles (salud, origen racial o étnico, opiniones políticas,
            convicciones religiosas, vida sexual) salvo que la ley lo permita y sea indispensable;
          </li>
          <li>
            infringir derechos de propiedad intelectual, de imagen o de privacidad de terceros;
          </li>
          <li>
            intentar acceder a cuentas o datos de otras agencias, probar vulnerabilidades sin
            autorización, sobrecargar la infraestructura o distribuir software malicioso;
          </li>
          <li>
            copiar el Servicio de forma automatizada (scraping), hacer ingeniería inversa o
            revenderlo sin un acuerdo escrito con Tivvo.
          </li>
        </ul>
        <p>
          Si encontrás una vulnerabilidad, contanos a{" "}
          <LegalLink href={`mailto:${contactEmail}`}>{contactEmail}</LegalLink>: la revisamos y
          te respondemos.
        </p>
      </>
    ),
  },
  {
    id: "planes-y-pagos",
    title: "Planes, precios y pagos",
    content: (
      <>
        <p>
          Tivvo ofrece un plan gratuito con límites (por ejemplo, cantidad de propiedades y de
          Usuarios) y planes pagos. Los precios, límites y funciones vigentes de cada plan se
          publican en <LegalLink href="/#planes">tivvo.app</LegalLink> o se acuerdan por escrito
          en el caso de planes a medida.
        </p>
        <ul>
          <li>
            Los planes pagos se facturan por adelantado en forma mensual (o en el período que se
            acuerde) y se renuevan automáticamente hasta que la Agencia los dé de baja.
          </li>
          <li>
            Los precios publicados en dólares estadounidenses pueden abonarse en pesos al tipo de
            cambio que se informe al momento del pago. Los impuestos aplicables se suman al
            precio salvo que se indique lo contrario.
          </li>
          <li>
            Si cambiamos el precio de tu plan, te avisamos por email con al menos 30 días de
            anticipación. El nuevo precio se aplica desde el período siguiente al aviso; si no
            estás de acuerdo, podés dar de baja el plan antes de que rija.
          </li>
          <li>
            Si un pago no se acredita, te avisamos y tenés 15 días corridos para regularizarlo.
            Pasado ese plazo, podemos pasar la cuenta al plan gratuito o suspenderla. Tus datos
            no se borran por la suspensión.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "baja",
    title: "Baja y derecho de revocación",
    content: (
      <>
        <p>
          La Agencia puede dar de baja su plan en cualquier momento, sin explicar el motivo y sin
          penalidad, por el mismo medio en que lo contrató o escribiendo a{" "}
          <LegalLink href={`mailto:${contactEmail}`}>{contactEmail}</LegalLink>. Dentro de las 24
          horas te enviamos, por el mismo medio, un código que identifica tu pedido de baja.
        </p>
        <p>
          La baja tiene efecto al final del período ya pagado: hasta entonces seguís teniendo
          acceso al plan. No hacemos reintegros proporcionales de períodos ya comenzados, salvo
          que la ley disponga lo contrario.
        </p>
        <p>
          Si contratás como consumidor en los términos de la Ley 24.240, podés revocar la
          contratación dentro de los 10 días corridos desde que la hiciste (artículo 34 de esa
          ley y artículo 1110 del Código Civil y Comercial), sin costo ni responsabilidad, y te
          reintegramos lo que hayas pagado. Este derecho no aplica cuando el Servicio se contrata
          para integrarlo a una actividad comercial o profesional, que es el uso habitual de una
          agencia.
        </p>
      </>
    ),
  },
  {
    id: "datos-personales",
    title: "Datos de la Agencia y datos personales",
    content: (
      <>
        <p>
          Los Datos de la Agencia son de la Agencia. Tivvo los usa solo para prestar, mantener y
          mejorar el Servicio, darte soporte y cumplir la ley; no los vende ni los usa para
          contactar a tus clientes por cuenta propia.
        </p>
        <p>
          Respecto de los datos personales de los Clientes finales, la Agencia es la responsable
          de la base de datos y Tivvo actúa como prestador de servicios de tratamiento por su
          cuenta, en los términos del artículo 25 de la Ley 25.326. En consecuencia, Tivvo:
        </p>
        <ul>
          <li>trata esos datos solo para prestar el Servicio y según las instrucciones de la Agencia, que surgen de estos Términos y de cómo configura y usa el Servicio;</li>
          <li>no los cede a terceros, salvo a los proveedores que necesita para operar o cuando una autoridad lo ordene;</li>
          <li>aplica medidas de seguridad técnicas y organizativas y exige confidencialidad a su personal y proveedores;</li>
          <li>avisa a la Agencia sin demoras indebidas si detecta un incidente de seguridad que afecte sus datos;</li>
          <li>colabora con la Agencia para responder los pedidos de acceso, rectificación o supresión de los Clientes finales;</li>
          <li>al terminar el Servicio, elimina esos datos en los plazos de la sección «Exportación y eliminación de datos».</li>
        </ul>
        <p>
          La Agencia, por su parte, garantiza que tiene una base legal para cargar esos datos y
          que informa a sus Clientes finales cómo los trata. La{" "}
          <LegalLink href="/privacidad">Política de privacidad</LegalLink> explica qué datos trata
          Tivvo, con qué proveedores y en qué países.
        </p>
      </>
    ),
  },
  {
    id: "contenido",
    title: "Contenido de la Agencia y licencia",
    content: (
      <>
        <p>
          La Agencia conserva todos sus derechos sobre las fotos, textos, logos y demás contenido
          que carga. Nos otorga una licencia no exclusiva, gratuita y limitada a la vigencia del
          Servicio para alojar, copiar, adaptar (por ejemplo, reducir el tamaño de las imágenes)
          y mostrar ese contenido, únicamente para prestar el Servicio y publicar el Sitio de la
          Agencia.
        </p>
        <p>
          Si recibimos un reclamo fundado de que un contenido infringe derechos de terceros,
          podemos retirarlo y te lo informaremos.
        </p>
      </>
    ),
  },
  {
    id: "sitio-y-links",
    title: "Sitio de la Agencia y links compartidos",
    content: (
      <>
        <p>
          El Sitio de la Agencia es de la Agencia: ella decide qué publica y es responsable de su
          contenido. Las consultas que llegan por el sitio, por las fichas de propiedad o por las
          ofertas se guardan en la cuenta de la Agencia, y Tivvo envía los emails de aviso y de
          confirmación en su nombre.
        </p>
        <p>
          Las ofertas, reservas y el portal del propietario se comparten mediante links privados
          difíciles de adivinar. Cualquiera que tenga el link puede ver su contenido, así que la
          Agencia debe enviarlos solo a la persona que corresponde.
        </p>
        <p>
          Hoy el Sitio de la Agencia se publica en un subdominio de Tivvo. Si la Agencia deja el
          Servicio, el sitio deja de estar disponible.
        </p>
      </>
    ),
  },
  {
    id: "propiedad-intelectual",
    title: "Propiedad intelectual de Tivvo",
    content: (
      <p>
        El software, el diseño, las plantillas del sitio, la marca Tivvo y su logo son de Tivvo o
        de sus licenciantes. Estos Términos no te transfieren ningún derecho sobre ellos, más allá
        del permiso para usar el Servicio mientras tu cuenta esté vigente. Si nos enviás ideas o
        sugerencias, podemos usarlas libremente para mejorar el Servicio, sin obligación de
        compensarte.
      </p>
    ),
  },
  {
    id: "terceros",
    title: "Servicios de terceros",
    content: (
      <p>
        El Servicio se integra con servicios de terceros, como el inicio de sesión con Google o
        Apple, o la sincronización de calendarios de plataformas de alquiler. Esos servicios se
        rigen por sus propios términos y políticas, y Tivvo no responde por su funcionamiento ni
        por cambios que hagan en sus condiciones.
      </p>
    ),
  },
  {
    id: "disponibilidad",
    title: "Disponibilidad y soporte",
    content: (
      <>
        <p>
          Hacemos esfuerzos razonables para que el Servicio esté disponible y funcione bien, pero
          no podemos garantizar que no tenga interrupciones o errores. Cuando sea posible,
          programamos los mantenimientos en horarios de poco uso y los anunciamos con
          anticipación.
        </p>
        <p>
          Atendemos consultas y reclamos por email en{" "}
          <LegalLink href={`mailto:${contactEmail}`}>{contactEmail}</LegalLink>, los días hábiles
          de lunes a viernes. Los compromisos de disponibilidad o de tiempos de respuesta
          (acuerdos de nivel de servicio) solo existen si se pactan por escrito, por ejemplo en
          un plan Enterprise.
        </p>
      </>
    ),
  },
  {
    id: "exportacion",
    title: "Exportación y eliminación de datos",
    content: (
      <>
        <p>
          Lo que se elimina dentro del Servicio va a la papelera, donde se puede recuperar durante
          30 días; después se borra de forma definitiva.
        </p>
        <p>
          Si la Agencia da de baja su cuenta o la cuenta se cierra por cualquier motivo, los Datos
          de la Agencia quedan disponibles para exportar durante 30 días. Pasado ese plazo los
          eliminamos de nuestros sistemas activos, y las copias de seguridad se sobrescriben en
          su ciclo normal, que no supera los 90 días. Solo conservamos por más tiempo lo que la
          ley nos obliga a guardar (por ejemplo, registros de facturación) o, hasta un máximo de
          dos años, lo que la Agencia nos autorice expresamente a conservar, como permite el
          artículo 25 de la Ley 25.326.
        </p>
      </>
    ),
  },
  {
    id: "suspension",
    title: "Suspensión y terminación por parte de Tivvo",
    content: (
      <>
        <p>
          Podemos suspender o cerrar una cuenta si la Agencia incumple gravemente estos Términos,
          si el uso de la cuenta pone en riesgo la seguridad del Servicio o de otras agencias, o
          si una autoridad competente lo ordena. Salvo urgencia o impedimento legal, te avisamos
          antes y te damos un plazo razonable para corregir el problema.
        </p>
        <p>
          También podemos dejar de prestar el Servicio en general, avisando con al menos 90 días
          de anticipación y reintegrando la parte proporcional de lo que hayas pagado por
          adelantado.
        </p>
      </>
    ),
  },
  {
    id: "responsabilidad",
    title: "Limitación de responsabilidad",
    content: (
      <>
        <p>
          En la medida que lo permita la ley, Tivvo no responde por el lucro cesante, la pérdida
          de oportunidades comerciales ni los daños indirectos que surjan del uso o de la
          imposibilidad de usar el Servicio, ni por las operaciones entre la Agencia, sus clientes
          y los propietarios.
        </p>
        <p>
          La responsabilidad total de Tivvo frente a la Agencia por cualquier reclamo vinculado al
          Servicio se limita al monto que la Agencia haya pagado a Tivvo en los 12 meses
          anteriores al hecho que origina el reclamo.
        </p>
        <p>
          Estos límites no se aplican cuando hay dolo o culpa grave de Tivvo, ni limitan los
          derechos que las normas de orden público, como la Ley 24.240, reconocen a los
          consumidores.
        </p>
      </>
    ),
  },
  {
    id: "indemnidad",
    title: "Indemnidad",
    content: (
      <p>
        La Agencia mantendrá indemne a Tivvo frente a reclamos de terceros (incluidos Clientes
        finales, propietarios y autoridades) que surjan del contenido que publica, de las
        operaciones que realiza o del incumplimiento de estos Términos o de la normativa
        aplicable a su actividad, incluidos los gastos razonables de defensa.
      </p>
    ),
  },
  {
    id: "cambios",
    title: "Cambios en estos Términos",
    content: (
      <>
        <p>
          Podemos actualizar estos Términos. Si el cambio es relevante, te avisamos por email y
          dentro del Servicio con al menos 30 días de anticipación a que entre en vigencia. Los
          cambios exigidos por la ley o que solo te benefician pueden regir antes.
        </p>
        <p>
          Si no estás de acuerdo con la nueva versión, podés dar de baja tu cuenta antes de que
          entre en vigencia. Si seguís usando el Servicio después, se entiende que la aceptás. La
          fecha de la versión vigente figura al principio de esta página.
        </p>
      </>
    ),
  },
  {
    id: "ley-aplicable",
    title: "Ley aplicable y jurisdicción",
    content: (
      <>
        <p>
          Estos Términos se rigen por las leyes de la República Argentina. Ante cualquier
          diferencia, primero intentaremos resolverla de buena fe escribiéndonos a{" "}
          <LegalLink href={`mailto:${contactEmail}`}>{contactEmail}</LegalLink>.
        </p>
        <p>
          Si no hay acuerdo, serán competentes los tribunales ordinarios de {jurisdiction}. Si
          contrataste como consumidor, podés presentar tu reclamo ante los tribunales de tu
          domicilio y ante las autoridades de defensa del consumidor (en el ámbito nacional, a
          través de{" "}
          <LegalLink href="https://www.argentina.gob.ar/produccion/defensadelconsumidor">
            argentina.gob.ar/defensadelconsumidor
          </LegalLink>
          ).
        </p>
      </>
    ),
  },
  {
    id: "contacto",
    title: "Contacto",
    content: (
      <p>
        Para cualquier consulta sobre estos Términos escribinos a{" "}
        <LegalLink href={`mailto:${contactEmail}`}>{contactEmail}</LegalLink>. Domicilio legal:{" "}
        {address}.
      </p>
    ),
  },
];

export default function TermsPage() {
  return (
    <LegalDocument
      title="Términos y condiciones"
      intro={
        <p>
          Las reglas para usar Tivvo: qué hacemos nosotros, qué le corresponde a tu agencia y qué
          pasa con tus datos, tus pagos y tu cuenta.
        </p>
      }
      summary={SUMMARY}
      sections={SECTIONS}
      related={{ href: "/privacidad", label: "Política de privacidad" }}
    />
  );
}

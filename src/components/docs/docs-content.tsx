import {
  Building2,
  CalendarDays,
  Compass,
  Globe,
  Inbox,
  Keyboard,
  KeyRound,
  Settings,
  Sparkles,
  Tag,
  UserRound,
  Users,
  UsersRound,
  type LucideIcon,
} from "lucide-react";

import {
  DocFigure,
  DocH3,
  DocList,
  DocP,
  DocPill,
  DocSection,
  DocStep,
  DocSteps,
  DocTerms,
  DocTip,
  Kbd,
} from "@/components/docs/docs-parts";
import type { DocSectionId } from "@/components/docs/docs-sections";

export interface DocEntry {
  /** Also what the dashboard's help links point at: see docs-sections.ts. */
  id: DocSectionId;
  label: string;
  icon: LucideIcon;
  adminOnly?: boolean;
  Content: () => React.ReactNode;
}

function Basics() {
  return (
    <DocSection
      id="primeros-pasos"
      icon={Compass}
      title="Primeros pasos"
      intro="Tivvo reúne en un solo lugar tu cartera de propiedades, las propuestas que mandás, tus clientes, sus consultas y las reservas. Todo lo que publicás aparece en el portal web de tu agencia."
    >
      <DocFigure
        src="/docs-media/panel.webp"
        alt="El panel de Tivvo con el menú lateral, la lista de propiedades y la tarjeta de perfil"
        width={1489}
        height={812}
        markers={[
          { x: 16.3, y: 13.5, label: "El menú lateral: cada herramienta del panel." },
          { x: 16.3, y: 5, label: "Contraer o expandir el menú (Ctrl/⌘ + B)." },
          { x: 38.4, y: 4, label: "La barra de la lista: buscador, orden, filtros, vistas y papelera." },
          { x: 90.6, y: 4, label: "Crear uno nuevo." },
          { x: 16.3, y: 94.3, label: "Tu tarjeta de perfil: tu cuenta, el modo claro u oscuro y esta documentación." },
        ]}
      />

      <DocH3>El menú lateral</DocH3>
      <DocP>
        A la izquierda está cada herramienta: Propiedades, Ofertas, Clientes, Consultas, Reservas y Servicios. Si sos
        propietario o administrador de la cuenta también ves Equipo, Portal y Configuración. «Consultas» muestra un número
        cuando tenés consultas sin leer; se actualiza solo cada minuto.
      </DocP>
      <DocP>
        Podés contraer el menú con el botón de arriba o con <Kbd>Ctrl/⌘</Kbd> <Kbd>B</Kbd> para ganar espacio; Tivvo
        recuerda cómo lo dejaste. En el celular el menú se abre desde el ícono de arriba a la derecha.
      </DocP>

      <DocH3>Tu tarjeta de perfil</DocH3>
      <DocP>
        Abajo del menú está tu nombre. Al tocarlo se abre el menú de tu cuenta: tu perfil, la configuración, cambiar de
        agencia (si trabajás en más de una), ver o copiar el link de tu portal, el modo claro u oscuro, el buscador, los
        atajos de teclado, esta documentación y cerrar sesión.
      </DocP>

      <DocH3>Roles</DocH3>
      <DocTerms
        items={[
          ["Propietario", "El dueño de la cuenta. Tiene acceso a todo."],
          ["Administrador", "Gestiona el equipo, el portal, la configuración, propiedades y ofertas."],
          ["Agente", "Trabaja con propiedades, ofertas, clientes, consultas, reservas y servicios. No ve Equipo, Portal ni Configuración."],
        ]}
      />

      <DocH3>Cosas que se repiten en todo el panel</DocH3>
      <DocTerms
        items={[
          [
            "Barra de acciones",
            "En los editores aparece arriba una barra con Guardar, Publicar y Cancelar. Cuando hay algo sin guardar muestra «Cambios sin guardar». Ctrl/⌘ + S guarda sin tocar el mouse.",
          ],
          [
            "Vistas",
            "Las listas se pueden ver en cuadrícula, lista o tabla (teclas 1, 2 y 3). Tivvo recuerda la vista que elegiste en cada navegador.",
          ],
          ["Buscador y filtros", "Cada lista tiene un buscador y filtros para acotar lo que ves. «Quitar filtros» vuelve a mostrar todo."],
          [
            "Papelera",
            "Lo que borrás de Propiedades, Ofertas y Reservas va a la papelera, no desaparece. Ahí queda 30 días por si te arrepentís; después se borra definitivamente. Al borrar, el aviso de abajo tiene «Deshacer».",
          ],
          [
            "«Se muestra en el portal» / «Solo interno»",
            "Cada bloque de un formulario te dice si lo que cargás lo ven tus clientes o queda solo para tu equipo.",
          ],
        ]}
      />
    </DocSection>
  );
}

function Properties() {
  return (
    <DocSection
      id="propiedades"
      icon={Building2}
      title="Propiedades"
      intro="Tu cartera: cada casa, departamento, terreno o alquiler de temporada que comercializás, con todos sus datos, fotos, precios y disponibilidad."
    >
      <DocH3>Cargar una propiedad</DocH3>
      <DocSteps>
        <DocStep>
          Tocá <strong>Nueva propiedad</strong> (o la tecla <Kbd>N</Kbd> en la lista).
        </DocStep>
        <DocStep>
          Elegí qué vas a hacer con ella: <strong>Venta</strong> o <strong>Alquiler</strong>. Esto cambia las categorías
          disponibles y las pestañas del editor.
        </DocStep>
        <DocStep>Escribí un título y elegí la categoría (casa, apartamento, villa, hotel, terreno…).</DocStep>
        <DocStep>
          Tocá <strong>Crear propiedad</strong>. Se crea como <DocPill tone="amber">Borrador</DocPill> y se abre el editor
          para que completes el resto.
        </DocStep>
      </DocSteps>
      <DocFigure
        src="/docs-media/propiedades-nueva.webp"
        alt="El diálogo Nueva propiedad"
        width={784}
        height={967}
        className="max-w-md"
        markers={[
          { x: 49, y: 20.4, label: "Venta o alquiler." },
          { x: 16.8, y: 41, label: "El título con el que la ven tus clientes." },
          { x: 23, y: 55.5, label: "La categoría; cambia según sea venta o alquiler." },
          { x: 78.8, y: 89.6, label: "Crea la propiedad y abre el editor." },
        ]}
      />

      <DocH3>Estados</DocH3>
      <DocTerms
        items={[
          [<DocPill key="d" tone="amber">Borrador</DocPill>, "Solo la ve tu equipo. Ideal mientras la vas completando."],
          [<DocPill key="p" tone="primary">Publicada</DocPill>, "Aparece en tu portal web y se puede sumar a ofertas."],
          [<DocPill key="a">Archivada</DocPill>, "Ya no está en el mercado, pero conservás todos sus datos. Se puede volver a publicar."],
        ]}
      />

      <DocH3>La lista</DocH3>
      <DocFigure
        src="/docs-media/propiedades-lista.webp"
        alt="La lista de propiedades en vista cuadrícula"
        width={1487}
        height={812}
        markers={[
          { x: 25, y: 4.9, label: "Buscador por título, zona o propietario." },
          { x: 55.7, y: 4.9, label: "Orden: recientes, precio o título." },
          { x: 64.3, y: 4.9, label: "Filtros." },
          { x: 71.4, y: 4.9, label: "Vista tabla, lista o cuadrícula." },
          { x: 78.5, y: 4.9, label: "Papelera: lo borrado en los últimos 30 días." },
          { x: 88.6, y: 4.9, label: "Nueva propiedad." },
          { x: 9.4, y: 91.5, label: "El estado de cada propiedad." },
        ]}
      />
      <DocList>
        <li>Buscá por título, zona, región, país o propietario.</li>
        <li>Ordená por más recientes, más antiguas, precio o título.</li>
        <li>
          <strong>Filtros</strong> (tecla <Kbd>F</Kbd>): estado, tipo, categoría, región, propietario, moneda, rango de
          precio y mínimo de dormitorios y baños. Los filtros activos aparecen como etiquetas que podés quitar de a una.
        </li>
        <li>Se muestran 25 por página. Al bajar, el buscador queda flotando arriba para que no tengas que volver.</li>
        <li>
          Desde el menú <strong>⋯</strong> de cada propiedad: editar, verla en el sitio, publicar, despublicar, archivar o
          eliminar.
        </li>
        <li>
          <strong>Acciones en lote:</strong> marcá varias propiedades y aparece una barra abajo para publicarlas,
          despublicarlas, archivarlas o eliminarlas juntas. <Kbd>Esc</Kbd> limpia la selección.
        </li>
      </DocList>
      <DocFigure
        src="/docs-media/propiedades-filtros.webp"
        alt="El panel de filtros de propiedades"
        width={526}
        height={1098}
        className="max-w-xs"
        markers={[
          { x: 22.4, y: 5.2, label: "Estado: podés marcar más de uno; sin marcar, se ven todas." },
          { x: 21.9, y: 59.8, label: "Rango de precio, en la moneda que elijas." },
          { x: 17.1, y: 91.5, label: "Limpiar vuelve todo a cero." },
          { x: 62.5, y: 92.2, label: "Aplica los filtros y te dice cuántas propiedades quedan." },
        ]}
      />

      <DocH3>El editor</DocH3>
      <DocP>
        Arriba está la barra del editor, con las secciones agrupadas: <strong>Información general</strong>,{" "}
        <strong>Multimedia</strong>, <strong>Alquiler</strong> (solo en alquileres), <strong>Gestión</strong> y{" "}
        <strong>Contacto</strong>. Los grupos con flecha abren un menú con sus pestañas. Guardá con{" "}
        <strong>Guardar</strong> o <Kbd>Ctrl/⌘</Kbd> <Kbd>S</Kbd>. <strong>Publicar</strong> guarda y publica en un solo
        paso; si ya está publicada, el botón pasa a ser <strong>Despublicar</strong>.
      </DocP>
      <DocFigure
        src="/docs-media/propiedades-editor.webp"
        alt="El editor de una propiedad en la pestaña Básico"
        width={1350}
        height={896}
        markers={[
          { x: 8.1, y: 10.6, label: "Volver a la lista de propiedades." },
          { x: 22.2, y: 10.6, label: "Las secciones del editor, agrupadas." },
          { x: 89.6, y: 10.6, label: "Cancelar, Guardar y Publicar o Despublicar." },
          { x: 80.7, y: 31, label: "Así se ve la tarjeta en tu cartera, en vivo mientras editás." },
          { x: 9.3, y: 52, label: "Cambiar la operación muestra u oculta las secciones de Alquiler." },
        ]}
      />
      <DocTerms
        items={[
          [
            "Básico",
            "Título, nombre privado (cómo la llama tu equipo), operación, categoría, dormitorios, baños, superficies, cocheras, depósitos, pisos, año de construcción y renovación, certificado energético. En alquileres también huéspedes y estrellas.",
          ],
          [
            "Ubicación",
            "La dirección exacta y el pin en el mapa (solo internos), la ubicación visible que ven tus clientes, características de la zona, vistas, link de Google Maps, folleto en PDF y sitio web. Podés buscar la dirección, hacer clic en el mapa, arrastrar el pin o pegar un link de Google Maps para tomar las coordenadas.",
          ],
          [
            "Amenities & Facilities",
            "Amenities generales (la lista corta de la ficha), comodidades interiores y exteriores, piscinas y jacuzzis con tipo y medidas, dormitorios por tipo, distribución de ambientes y otros servicios y condiciones.",
          ],
          [
            "Content & Services",
            "El resumen y la descripción de la ficha, con títulos y listas. En alquileres, además, los servicios incluidos y las políticas de reserva y cancelación.",
          ],
          ["Precios", "Precio de venta o precio base por noche, y moneda. Si lo dejás vacío, la ficha muestra «Precio a consultar»."],
          [
            "Fotos",
            "Ver más abajo. Los cambios de esta pestaña se guardan al momento, sin tocar Guardar.",
          ],
          [
            "Essentials",
            "Datos internos: quién administra la propiedad, proveedor, licencia, comisión y si se puede comercializar fuera de tu portal.",
          ],
          [
            "Recomendaciones",
            "Mejoras sugeridas para la propiedad con detalle, costo estimado y prioridad. El propietario las ve en su página.",
          ],
          ["Propietario", "El dueño de la propiedad y su link de acceso. Ver «Propietarios» más abajo."],
        ]}
      />

      <DocH3>Fotos y videos</DocH3>
      <DocFigure
        src="/docs-media/propiedades-fotos.webp"
        alt="La galería de fotos de una propiedad"
        width={1502}
        height={812}
        markers={[
          { x: 24.3, y: 5.2, label: "Lo que cargás acá se ve en el portal." },
          { x: 79.2, y: 22.5, label: "Las secciones de la galería; «Agregar» crea una nueva." },
          { x: 90.7, y: 29.6, label: "Arrastrá o elegí fotos: se suben a la sección marcada." },
          { x: 9.7, y: 71.4, label: "La foto de portada." },
        ]}
      />
      <DocList>
        <li>Arrastrá las fotos al recuadro o hacé clic para elegirlas. Se comprimen antes de subirse.</li>
        <li>La primera foto es la portada. Para cambiarla, usá «Hacer portada» sobre otra.</li>
        <li>Agrupá las fotos en secciones (por ejemplo «Living» o «Exterior») y arrastralas para ordenarlas.</li>
        <li>Para quitar una foto tocá la cruz y confirmá con un segundo clic.</li>
        <li>
          <strong>Marca de agua:</strong> pone el logo de tu agencia sobre las fotos publicadas.
        </li>
        <li>
          <strong>Videos:</strong> pegá links de YouTube, Vimeo u otras plataformas.
        </li>
      </DocList>

      <DocH3>Solo en alquileres</DocH3>
      <DocTerms
        items={[
          [
            "Disponibilidad",
            "Bloqueá fechas a mano con una nota opcional. Las reservas bloquean sus fechas solas. Para no tener reservas dobles, pegá el link iCal de Airbnb o Booking y tocá «Sincronizar ahora». Si la propiedad está publicada, también tenés un link para exportar tu disponibilidad a esas plataformas.",
          ],
          [
            "Rates",
            "Períodos de tarifa (por ejemplo «Temporada alta») con fechas, precio oficial por noche, estadía mínima, comisión de la agencia y fee de management.",
          ],
          ["Rooms", "Solo en hoteles: las habitaciones del hotel."],
        ]}
      />
      <DocFigure
        src="/docs-media/propiedades-disponibilidad.webp"
        alt="La pestaña Disponibilidad de un alquiler"
        width={931}
        height={829}
        className="max-w-xl"
        markers={[
          { x: 39.8, y: 4.6, label: "Bloquear fechas a mano, con una nota opcional." },
          { x: 88, y: 45.6, label: "Las fechas tomadas: «BOOKING» viene de una reserva, «MANUAL» de un bloqueo tuyo." },
          { x: 46.8, y: 65, label: "Pegá el link iCal de Airbnb o Booking y sincronizá." },
          { x: 34, y: 81.8, label: "Tu calendario, para cargarlo en esas plataformas." },
        ]}
      />
      <DocFigure
        src="/docs-media/propiedades-tarifas.webp"
        alt="La pestaña Rates con tres temporadas cargadas"
        width={974}
        height={784}
        className="max-w-xl"
        markers={[
          { x: 20.8, y: 5.9, label: "Un período nuevo: etiqueta, fechas, precio por noche y estadía mínima." },
          { x: 3.5, y: 38.3, label: "Comisión de la agencia y fee de management, en %." },
          { x: 23.8, y: 64, label: "Las temporadas cargadas, con su precio y estadía mínima." },
        ]}
      />

      <DocTip>
        Completá primero Básico, Ubicación, Precios y Fotos: con eso la ficha ya se ve bien en tu portal. El resto lo
        podés ir sumando con el tiempo.
      </DocTip>
    </DocSection>
  );
}

function Owners() {
  return (
    <DocSection
      id="propietarios"
      icon={KeyRound}
      title="Propietarios"
      intro="Los dueños de las propiedades que comercializás. Cada uno tiene una página privada donde sigue sus propiedades sin necesitar usuario ni contraseña."
    >
      <DocH3>Asignar un propietario</DocH3>
      <DocSteps>
        <DocStep>
          En el editor de la propiedad, abrí la pestaña <strong>Propietario</strong>.
        </DocStep>
        <DocStep>Buscalo por nombre, email o teléfono, o tocá «Nuevo propietario» para cargarlo ahí mismo.</DocStep>
        <DocStep>Guardá la propiedad. Un mismo propietario puede tener varias propiedades.</DocStep>
      </DocSteps>
      <DocFigure
        src="/docs-media/propietarios-asignar.webp"
        alt="La pestaña Propietario con un propietario asignado y su link de acceso"
        width={941}
        height={808}
        className="max-w-xl"
        markers={[
          { x: 50, y: 4.7, label: "El propietario asignado; «Quitar» lo desvincula." },
          { x: 68.9, y: 57, label: "Copiá su link personal para mandárselo." },
          { x: 97.6, y: 60.1, label: "Regenerar: el link anterior deja de funcionar." },
          { x: 84.3, y: 83.2, label: "Cargá un propietario nuevo sin salir de la propiedad." },
        ]}
      />

      <DocH3>La página del propietario</DocH3>
      <DocP>
        En «Acceso del propietario» está su link personal: copialo y mandáselo. Desde ahí ve sus propiedades y su estado,
        los precios publicados, las reservas con sus fechas y pagos, y las mejoras sugeridas que cargaste en
        Recomendaciones. Nunca ve tu comisión.
      </DocP>
      <DocFigure
        src="/docs-media/propietarios-pagina.webp"
        alt="La página del propietario con el resumen de sus propiedades"
        width={1489}
        height={812}
        markers={[
          { x: 19.6, y: 41.6, label: "Cuántas de sus propiedades están publicadas." },
          { x: 49.3, y: 41.6, label: "La estadía en curso o la próxima." },
          { x: 70.2, y: 41.6, label: "Lo cobrado en pagos de sus reservas." },
          { x: 33.1, y: 70.3, label: "Cada propiedad con su estado, precio y link a tu sitio." },
          { x: 79.9, y: 4.4, label: "Un botón para escribirte." },
        ]}
      />
      <DocTip>
        Si el link llegó a quien no debía, tocá «Regenerar»: el anterior deja de funcionar al instante.
      </DocTip>
    </DocSection>
  );
}

function Offers() {
  return (
    <DocSection
      id="ofertas"
      icon={Tag}
      title="Ofertas"
      intro="Propuestas personalizadas para un cliente: una selección de propiedades y servicios con tus precios, presentada en una página propia que el cliente abre desde un link."
    >
      <DocH3>Armar una oferta</DocH3>
      <DocSteps>
        <DocStep>
          Tocá <strong>Nueva oferta</strong>, ponele un título (por ejemplo «Propuesta para la familia Pérez») y elegí la
          operación: venta, alquiler o ambas. La operación define qué propiedades podés sumar.
        </DocStep>
        <DocStep>
          En <strong>General</strong> elegí el cliente, la moneda y si querés mostrar los precios y la identidad de tu
          agencia (encabezado, pie y datos de contacto).
        </DocStep>
        <DocStep>
          En <strong>Bienvenida</strong> escribí el saludo: un título, la fecha o temporada y un mensaje.
        </DocStep>
        <DocStep>
          En <strong>Propiedades</strong> creá secciones (por ejemplo «Frente al mar») y sumales propiedades.
        </DocStep>
        <DocStep>
          En <strong>Servicios</strong> agregá experiencias de tu librería: chef, traslados, yate…
        </DocStep>
        <DocStep>
          Tocá <strong>Enviar oferta</strong> (si tiene cliente) o <strong>Publicar link</strong> (si no).
        </DocStep>
      </DocSteps>
      <DocFigure
        src="/docs-media/ofertas-lista.webp"
        alt="La lista de ofertas"
        width={1568}
        height={727}
        markers={[
          { x: 25.2, y: 3, label: "Buscador por título o cliente." },
          { x: 61.5, y: 3, label: "Filtros por operación y estado." },
          { x: 89.8, y: 3, label: "Nueva oferta." },
          { x: 8.3, y: 89.4, label: "El estado: acá, el cliente ya la vio." },
        ]}
      />

      <DocH3>Ajustar el precio de cada propiedad</DocH3>
      <DocP>
        Dentro de una sección, «Mostrar ajustes» en cada propiedad te deja poner un precio especial para esta oferta, un
        descuento (porcentaje o monto fijo), un depósito de seguridad y un texto corto como «Incluye limpieza final». El
        precio de la propiedad en tu cartera no cambia.
      </DocP>
      <DocP>
        A la derecha ves el total de la oferta. En alquileres no se suma: son opciones para elegir, con precio por noche.
      </DocP>

      <DocH3>Enviar o compartir</DocH3>
      <DocTerms
        items={[
          ["Con cliente", "«Enviar oferta» le manda el link por email. Después podés usar «Reenviar oferta» cuando quieras."],
          ["Sin cliente", "«Publicar link» activa la página y vos compartís el link por donde prefieras."],
          ["Copiar link", "Disponible en el panel derecho del editor y en el menú ⋯ de cada oferta, una vez enviada o publicada."],
        ]}
      />
      <DocP>
        Si mandaste el link por tu cuenta (WhatsApp, por ejemplo), usá «Marcar como enviada» desde el menú de la oferta.
        Desde la página de la oferta el cliente puede escribirte: esa consulta llega a Consultas.
      </DocP>

      <DocH3>Estados</DocH3>
      <DocTerms
        items={[
          [<DocPill key="d" tone="amber">Borrador</DocPill>, "Todavía no la ve nadie."],
          [<DocPill key="s" tone="primary">Enviada</DocPill>, "El link está activo y se le mandó al cliente."],
          [<DocPill key="v">Vista</DocPill>, "El cliente ya abrió la oferta."],
          [<DocPill key="e">Vencida</DocPill>, "Ya no está vigente; el cliente ve un aviso de que venció."],
        ]}
      />
    </DocSection>
  );
}

function Services() {
  return (
    <DocSection
      id="servicios"
      icon={Sparkles}
      title="Servicios"
      intro="Tu librería de experiencias y servicios extra. Los cargás una vez y los sumás a cualquier oferta."
    >
      <DocH3>Crear un servicio</DocH3>
      <DocSteps>
        <DocStep>
          Tocá <strong>Nuevo servicio</strong> y elegí el tipo: mayordomo, chef privado, yate, traslados, auto, excursiones,
          spa, niñera, limpieza extra, eventos u otro.
        </DocStep>
        <DocStep>Ponele nombre, foto y una descripción: qué incluye, cuánto dura, para cuántas personas.</DocStep>
        <DocStep>
          Definí el precio y cómo se cobra: por servicio, por persona, por día, por noche o por hora. Sin precio se muestra
          «A consultar».
        </DocStep>
        <DocStep>Indicá dónde se ofrece (vacío significa en cualquier lugar) y, si querés, el proveedor.</DocStep>
      </DocSteps>
      <DocFigure
        src="/docs-media/servicios-editar.webp"
        alt="El formulario de un servicio: zonas, precio, unidad de cobro, proveedor y disponibilidad"
        width={784}
        height={970}
        className="max-w-md"
        markers={[
          { x: 27.6, y: 26.5, label: "Las zonas donde se ofrece." },
          { x: 82.6, y: 48, label: "Cómo se cobra: por servicio, persona, día, noche u hora." },
          { x: 20.6, y: 60.2, label: "El proveedor, solo para tu equipo." },
          { x: 82, y: 80.4, label: "Disponible para sumarlo a ofertas nuevas." },
        ]}
      />
      <DocList>
        <li>El proveedor solo lo ve tu equipo, nunca el cliente.</li>
        <li>Si apagás «Disponible», el servicio no se puede sumar a ofertas nuevas, pero sigue en las que ya lo tienen.</li>
        <li>
          En cada oferta podés ajustar precio, cantidad y fecha del servicio para ese cliente, y dejarle una nota.
        </li>
      </DocList>
    </DocSection>
  );
}

function Clients() {
  return (
    <DocSection
      id="clientes"
      icon={Users}
      title="Clientes"
      intro="Tu agenda de contactos y su seguimiento: en qué etapa está cada uno, qué busca y cada vez que hablaron."
    >
      <DocH3>Cómo llegan</DocH3>
      <DocList>
        <li>
          <strong>Carga manual:</strong> «Nuevo cliente» con nombre, email y teléfono.
        </li>
        <li>
          <strong>Desde el portal o una oferta:</strong> cuando alguien te escribe, Tivvo crea el cliente (o lo reconoce por
          su email) y deja una nota en su historial con la propiedad u oferta que consultó.
        </li>
      </DocList>

      <DocH3>Etapas</DocH3>
      <DocTerms
        items={[
          ["Lead", "Recién llegó; todavía no hablaste con él."],
          ["Contactado", "Ya hubo un primer contacto."],
          ["Negociando", "Están conversando una propuesta concreta."],
          ["Cliente", "Cerró una operación con vos."],
          ["Perdido", "No avanzó."],
        ]}
      />
      <DocP>
        Cambiá la etapa desde el menú ⋯ de cada cliente en la lista o desde su ficha. Filtrá la lista por etapa para ver,
        por ejemplo, solo a quienes están negociando.
      </DocP>

      <DocH3>La ficha del cliente</DocH3>
      <DocList>
        <li>
          <strong>Notas:</strong> lo que conviene recordar: qué busca, presupuesto, preferencias.
        </li>
        <li>
          <strong>Historial:</strong> registrá cada nota, llamada, email o reunión. Se ordena del más reciente al más
          antiguo.
        </li>
        <li>Desde el menú ⋯ también podés escribirle, llamarlo o copiar su email.</li>
      </DocList>
    </DocSection>
  );
}

function Inquiries() {
  return (
    <DocSection
      id="consultas"
      icon={Inbox}
      title="Consultas"
      intro="La bandeja de entrada de todo lo que te escriben desde tu portal, desde la ficha de una propiedad o desde una oferta."
    >
      <DocH3>Qué pasa cuando llega una</DocH3>
      <DocList>
        <li>Aparece en Consultas como nueva y suma al número del menú lateral.</li>
        <li>Se crea (o se actualiza) el cliente, con una nota en su historial.</li>
        <li>
          La agencia recibe un aviso por email (al email de contacto de Configuración o, si no hay, a propietarios y
          administradores) y el cliente recibe una confirmación.
        </li>
      </DocList>

      <DocH3>Trabajar la bandeja</DocH3>
      <DocList>
        <li>Alterná entre «Todas» y «Nuevas». Están agrupadas por esta semana y anteriores.</li>
        <li>Al abrir una consulta se marca como leída. Podés volver a marcarla como nueva para no olvidarla.</li>
        <li>«Marcar todas como leídas» limpia la bandeja de una vez.</li>
        <li>
          Respondé con un clic: <strong>Responder por email</strong> (con el asunto y el saludo ya escritos),{" "}
          <strong>WhatsApp</strong> o <strong>Llamar</strong>. También podés ir a la ficha del cliente o a la propiedad u
          oferta que consultó.
        </li>
      </DocList>
    </DocSection>
  );
}

function Bookings() {
  return (
    <DocSection
      id="reservas"
      icon={CalendarDays}
      title="Reservas"
      intro="Cada operación cerrada: un alquiler con sus fechas o una venta, con el precio, la comisión y el seguimiento de los pagos."
    >
      <DocH3>Crear una reserva</DocH3>
      <DocSteps>
        <DocStep>
          Tocá <strong>Nueva reserva</strong> y elegí la propiedad.
        </DocStep>
        <DocStep>Asigná el cliente (opcional).</DocStep>
        <DocStep>En alquileres, elegí las fechas de entrada y salida. Una venta va sin fechas.</DocStep>
        <DocStep>Cargá el precio total y tu comisión.</DocStep>
      </DocSteps>

      <DocH3>Estados</DocH3>
      <DocTerms
        items={[
          [<DocPill key="p" tone="amber">Pendiente</DocPill>, "Recién creada, a la espera de confirmación."],
          [<DocPill key="c" tone="primary">Confirmada</DocPill>, "Está en firme."],
          [<DocPill key="o">Completada</DocPill>, "La estadía terminó o la venta se cerró."],
          [<DocPill key="x">Cancelada</DocPill>, "No va a ocurrir. Te pedimos confirmación antes de cancelar."],
        ]}
      />
      <DocP>Cambiá el estado desde la ficha de la reserva o desde el menú ⋯ de la lista.</DocP>

      <DocH3>Pagos</DocH3>
      <DocP>
        En la ficha de la reserva, «Agregar pago» registra un anticipo, el saldo o tu comisión. Cada pago queda pendiente
        hasta que lo marques como cobrado. Arriba ves el precio total, lo cobrado, lo que falta cobrar y la comisión.
      </DocP>

      <DocH3>La página del cliente</DocH3>
      <DocP>
        Cada reserva tiene una página para el cliente con su estadía, el estado y los pagos (anticipos y saldo, nunca la
        comisión). Si la reserva tiene cliente, le llega por email al crearla, confirmarla o cancelarla. Si no, copiá el
        link desde el menú ⋯ y mandáselo vos.
      </DocP>
    </DocSection>
  );
}

function Team() {
  return (
    <DocSection
      id="equipo"
      icon={UsersRound}
      title="Equipo"
      adminOnly
      intro="Las personas que trabajan en tu agencia dentro de Tivvo y qué puede hacer cada una."
    >
      <DocSteps>
        <DocStep>
          Tocá <strong>Invitar miembro</strong>, escribí su nombre y email y elegí el rol: administrador o agente.
        </DocStep>
        <DocStep>Le llega el acceso por email.</DocStep>
      </DocSteps>
      <DocList>
        <li>Desde el menú ⋯ de cada persona podés cambiarle el rol, copiar su email, desactivar su acceso o quitarla del equipo.</li>
        <li>
          <strong>Desactivar el acceso</strong> le impide entrar pero conserva su lugar; lo podés reactivar cuando quieras.
        </li>
        <li>El propietario de la cuenta no se puede quitar ni cambiar de rol.</li>
      </DocList>
    </DocSection>
  );
}

function Portal() {
  return (
    <DocSection
      id="portal"
      icon={Globe}
      title="Portal web"
      adminOnly
      intro="El sitio público de tu agencia, donde tus clientes ven tus propiedades publicadas y te escriben. Es tuyo: lleva tu nombre, tu logo y tus colores."
    >
      <DocP>
        Se edita desde <strong>Portal</strong> en el menú. El editor ocupa toda la pantalla: a la izquierda las opciones,
        a la derecha una vista previa que podés ver como computadora o como celular. Guardá para publicar los cambios; si
        intentás salir con cambios sin guardar, te avisamos.
      </DocP>
      <DocFigure
        src="/docs-media/portal-editor.webp"
        alt="El editor del portal en la pestaña Diseño, con la vista previa a la derecha"
        width={1489}
        height={812}
        markers={[
          { x: 28.6, y: 10.8, label: "Las pestañas: Diseño, Portada, Bloques y Agencia y contacto." },
          { x: 20.3, y: 32.3, label: "Elegí si estás configurando la versión de computadora o la de celular." },
          { x: 19.5, y: 55.3, label: "La plantilla elegida." },
          { x: 71, y: 3.8, label: "Ver la vista previa como computadora o como celular." },
          { x: 88.4, y: 3.8, label: "Guardar cambios publica lo que editaste." },
          { x: 32.6, y: 11.9, label: "La vista previa, tal como la verán tus clientes." },
        ]}
      />
      <DocTerms
        items={[
          [
            "Diseño",
            "La plantilla de la página de inicio (Portada, Editorial, Compacto, Dividido o Mosaico), que puede ser distinta en celulares; el color de botones y enlaces; y la tipografía.",
          ],
          [
            "Portada",
            "La foto principal (mejor horizontal, de al menos 1920 px de ancho) y, en la plantilla Mosaico, las cuatro fotos del collage.",
          ],
          [
            "Bloques",
            "Secciones propias entre la portada y el listado. Cada una tiene varios diseños y se puede ocultar sin borrarla.",
          ],
          [
            "Agencia y contacto",
            "El titular, el texto sobre tu agencia, teléfono, WhatsApp (activa el botón «Escribinos por WhatsApp»), Instagram y la dirección de la oficina.",
          ],
        ]}
      />

      <DocH3>Tipos de bloque</DocH3>
      <DocFigure
        src="/docs-media/portal-bloques.webp"
        alt="La pestaña Bloques con los seis tipos de bloque para agregar"
        width={602}
        height={980}
        className="max-w-xs"
        caption="En Bloques, elegí qué tipo agregar. Después elegís su diseño y su contenido."
      />
      <DocTerms
        items={[
          ["Ubicación", "Una zona con foto, texto y sus propiedades. Ideal para un destino o tu barrio."],
          ["Promoción", "Propiedades con una etiqueta como «15% OFF», con fecha de validez opcional."],
          ["Propiedades destacadas", "Una selección tuya: lo más nuevo, frente al mar, las más pedidas."],
          ["Destinos", "Varias zonas a la vez, cada una con su foto. Al tocar una, se filtra el listado."],
          ["Texto e imagen", "Contá algo propio: tus servicios, tasaciones, cómo trabajan."],
          ["Llamado a la acción", "Una invitación con un botón que lleva al contacto, a WhatsApp o al listado."],
        ]}
      />
      <DocTip>
        Para ver cómo quedó, usá «Ver publicado» en el editor o «Ver mi portal» en el menú de tu perfil.
      </DocTip>
    </DocSection>
  );
}

function SettingsDoc() {
  return (
    <DocSection
      id="configuracion"
      icon={Settings}
      title="Configuración"
      adminOnly
      intro="Los datos de tu agencia y las preferencias de toda la cuenta."
    >
      <DocTerms
        items={[
          ["Tu agencia", "El nombre y el logo con los que te ven tus clientes, y el email de contacto que recibe las consultas."],
          [
            "Portal público",
            "La dirección de tu portal (solo minúsculas, números y guiones). Si la cambiás, el link anterior deja de funcionar: actualizalo donde lo hayas compartido.",
          ],
          ["Preferencias", "El idioma de los textos y la moneda en la que se muestran los precios por defecto."],
        ]}
      />
    </DocSection>
  );
}

function Profile() {
  return (
    <DocSection
      id="perfil"
      icon={UserRound}
      title="Mi perfil"
      intro="Tus datos personales dentro de la cuenta de la agencia."
    >
      <DocList>
        <li>Tocá tu foto para cambiarla.</li>
        <li>Editá tu nombre y email y guardá con el botón de arriba.</li>
        <li>
          Para cambiar la contraseña te pedimos la actual y la nueva dos veces. Tiene que tener al menos 8 caracteres.
        </li>
      </DocList>
    </DocSection>
  );
}

function Shortcuts() {
  return (
    <DocSection
      id="atajos"
      icon={Keyboard}
      title="Buscador y atajos"
      intro="Para moverte por todo el panel sin soltar el teclado."
    >
      <DocH3>Buscador</DocH3>
      <DocP>
        <Kbd>Ctrl/⌘</Kbd> <Kbd>K</Kbd> abre un buscador que encuentra páginas, propiedades, ofertas y clientes por nombre.
        Desde ahí también podés crear una propiedad, oferta, cliente o reserva, cambiar el modo claro u oscuro y cerrar
        sesión.
      </DocP>
      <DocFigure
        src="/docs-media/buscador.webp"
        alt="El buscador mostrando dos propiedades al escribir «villa»"
        width={957}
        height={314}
        className="max-w-lg"
        caption="Escribí parte de un nombre y elegí con las flechas y Enter."
      />

      <DocH3>Atajos</DocH3>
      <DocTerms
        items={[
          [<><Kbd>Ctrl/⌘</Kbd> <Kbd>S</Kbd></>, "Guardar el formulario abierto"],
          [<><Kbd>Ctrl/⌘</Kbd> <Kbd>B</Kbd></>, "Contraer o expandir el menú lateral"],
          [<Kbd key="q">?</Kbd>, "Ver todos los atajos"],
          [
            <><Kbd>G</Kbd> y una letra</>,
            "Ir a una sección: P propiedades, O ofertas, C clientes, I consultas, R reservas, E equipo, W portal, S configuración, M mi perfil",
          ],
          [<Kbd key="n">N</Kbd>, "Crear uno nuevo en la lista abierta"],
          [<Kbd key="s">/</Kbd>, "Ir al buscador de la lista"],
          [<Kbd key="f">F</Kbd>, "Abrir los filtros"],
          [<><Kbd>1</Kbd> <Kbd>2</Kbd> <Kbd>3</Kbd></>, "Vista cuadrícula, lista o tabla"],
          [<><Kbd>J</Kbd> <Kbd>K</Kbd></>, "Bajar y subir entre elementos; Enter abre el seleccionado"],
          [<Kbd key="e">Esc</Kbd>, "Limpiar la selección"],
        ]}
      />
    </DocSection>
  );
}

export const DOC_SECTIONS: DocEntry[] = [
  { id: "primeros-pasos", label: "Primeros pasos", icon: Compass, Content: Basics },
  { id: "propiedades", label: "Propiedades", icon: Building2, Content: Properties },
  { id: "propietarios", label: "Propietarios", icon: KeyRound, Content: Owners },
  { id: "ofertas", label: "Ofertas", icon: Tag, Content: Offers },
  { id: "servicios", label: "Servicios", icon: Sparkles, Content: Services },
  { id: "clientes", label: "Clientes", icon: Users, Content: Clients },
  { id: "consultas", label: "Consultas", icon: Inbox, Content: Inquiries },
  { id: "reservas", label: "Reservas", icon: CalendarDays, Content: Bookings },
  { id: "equipo", label: "Equipo", icon: UsersRound, adminOnly: true, Content: Team },
  { id: "portal", label: "Portal web", icon: Globe, adminOnly: true, Content: Portal },
  { id: "configuracion", label: "Configuración", icon: Settings, adminOnly: true, Content: SettingsDoc },
  { id: "perfil", label: "Mi perfil", icon: UserRound, Content: Profile },
  { id: "atajos", label: "Buscador y atajos", icon: Keyboard, Content: Shortcuts },
];

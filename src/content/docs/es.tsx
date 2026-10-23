import {
  Building2,
  CalendarCheck,
  CalendarDays,
  Compass,
  Eye,
  Globe,
  Inbox,
  Keyboard,
  KeyRound,
  Settings,
  Sparkles,
  Tag,
  Upload,
  UserRound,
  Users,
  UsersRound,
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

import type { DocEntry } from "./types";

function Basics() {
  return (
    <DocSection
      id="primeros-pasos"
      icon={Compass}
      title="Primeros pasos"
      intro="Tivvo reúne en un solo lugar las consultas que te llegan, tus clientes, tu cartera de propiedades, las propuestas que mandás, las reservas y la disponibilidad. Todo lo que publicás aparece en el portal web de tu agencia."
    >
      <DocFigure
        src="/docs-media/panel.webp"
        alt="El panel de Tivvo con el menú lateral, la lista de propiedades y la tarjeta de perfil"
        width={1584}
        height={946}
        markers={[
          { x: 8.9, y: 11.6, label: "El menú lateral: cada herramienta del panel." },
          { x: 15.5, y: 4.7, label: "Contraer o expandir el menú (Ctrl/⌘ + B)." },
          { x: 15.1, y: 15.5, label: "Cuántas consultas tenés sin leer." },
          { x: 31.9, y: 6, label: "La barra de la lista: buscador, orden, filtros, vistas, papelera e importar." },
          { x: 86.8, y: 6, label: "Crear una nueva." },
          { x: 14.7, y: 90.5, label: "La campana de notificaciones." },
          { x: 3, y: 93.7, label: "Tu tarjeta de perfil: tu cuenta, la apariencia, la ayuda y esta documentación." },
        ]}
      />

      <DocH3>El menú lateral</DocH3>
      <DocP>
        Las herramientas están en el orden en que trabaja una agencia: llega una <strong>consulta</strong>, se vuelve{" "}
        <strong>cliente</strong>, le ofrecés <strong>propiedades</strong> en una <strong>oferta</strong> y termina en una{" "}
        <strong>reserva</strong>. Después vienen <strong>Disponibilidad</strong> y <strong>Servicios</strong>. Si sos
        propietario o administrador de la cuenta, al final ves también <strong>Portal</strong>, <strong>Equipo</strong> y{" "}
        <strong>Configuración</strong>.
      </DocP>
      <DocP>
        «Consultas» muestra un número cuando tenés consultas sin leer; se actualiza solo cada minuto. Podés contraer el
        menú con el botón de arriba o con <Kbd>Ctrl/⌘</Kbd> <Kbd>B</Kbd> para ganar espacio, y Tivvo recuerda cómo lo
        dejaste. En el celular, el menú se abre desde el ícono de arriba.
      </DocP>

      <DocH3>Notificaciones</DocH3>
      <DocP>
        La campana, al lado de tu nombre, te avisa de lo que pasó mientras no mirabas: una consulta nueva, un cliente que
        abrió una oferta o te respondió desde ella, un pago registrado, una reserva y las tareas que te asignaron. El
        número indica cuántos avisos no leíste; se actualiza cada minuto.
      </DocP>
      <DocFigure
        src="/docs-media/notificaciones.webp"
        alt="La lista de notificaciones con consultas nuevas y una oferta abierta"
        width={760}
        height={982}
        className="max-w-sm"
        markers={[
          { x: 77.4, y: 8.1, label: "«Marcar todas» las deja como leídas." },
          { x: 12.5, y: 19, label: "Cada aviso te lleva a lo que pasó (la consulta, la oferta, la reserva). El punto indica que no lo leíste." },
        ]}
      />
      <DocP>
        Para eliminar un aviso, pasá el mouse por encima y tocá la cruz de la derecha (en el celular, la cruz se ve
        siempre). Se borra solo para vos: el resto del equipo sigue viendo el suyo, y no se puede recuperar.
      </DocP>

      <DocH3>Tu tarjeta de perfil</DocH3>
      <DocP>
        Abajo del menú está tu nombre. Al tocarlo se abre el menú de tu cuenta: tu perfil, la configuración, cambiar de
        agencia (si trabajás en más de una), ver o copiar el link de tu portal, la apariencia, el idioma, esta documentación, el
        buscador, los atajos de teclado, la ayuda y cerrar sesión.
      </DocP>
      <DocFigure
        src="/docs-media/menu-perfil.webp"
        alt="El menú de la cuenta abierto desde la tarjeta de perfil"
        width={640}
        height={1180}
        className="max-w-xs"
        markers={[
          { x: 92, y: 30.2, label: "Mi perfil: tus datos y tu contraseña." },
          { x: 92, y: 36.3, label: "Configuración de la agencia (propietarios y administradores)." },
          { x: 92, y: 43.9, label: "Abrir o copiar el link de tu portal." },
          { x: 75, y: 58.7, label: "Apariencia: clara, oscura o automática (sigue a tu computadora)." },
          { x: 92, y: 67.3, label: "Esta documentación, en otra pestaña." },
          { x: 92, y: 73.4, label: "El buscador y, debajo, los atajos de teclado." },
          { x: 92, y: 85.6, label: "Ayuda y soporte: preguntas frecuentes y contacto con Tivvo." },
          { x: 92, y: 93.2, label: "Cerrar sesión." },
        ]}
      />
      <DocTip>
        Si trabajás para más de una agencia, «Cambiar de agencia» aparece en este menú. Cada agencia tiene sus propios
        datos: al cambiar, el panel se recarga con los de la otra.
      </DocTip>

      <DocH3>Roles</DocH3>
      <DocTerms
        items={[
          ["Propietario", "El dueño de la cuenta. Tiene acceso a todo y no se lo puede quitar del equipo."],
          [
            "Administrador",
            "Como el propietario: ve todo, gestiona el equipo, el portal, la configuración y la importación, y reasigna propiedades y clientes.",
          ],
          [
            "Agente",
            "Ve solo las propiedades que tiene asignadas, sus ofertas y reservas, sus clientes y los leads sin asignar. No ve Portal, Equipo, Configuración, Importar ni el estado de cuenta de los propietarios.",
          ],
        ]}
      />

      <DocH3>Cosas que se repiten en todo el panel</DocH3>
      <DocTerms
        items={[
          [
            "Barra de acciones",
            "En los editores aparece arriba una barra con Guardar, Publicar y Cancelar. Cuando hay algo sin guardar, el botón Guardar se activa. Ctrl/⌘ + S guarda sin tocar el mouse.",
          ],
          [
            "Vistas",
            "Las listas se pueden ver en cuadrícula, lista o tabla (teclas 1, 2 y 3). Tivvo recuerda la vista que elegiste en cada navegador.",
          ],
          [
            "Buscador y filtros",
            "Cada lista tiene un buscador y filtros para acotar lo que ves. Cada filtro muestra cuántos elementos hay en cada opción. «Quitar filtros» vuelve a mostrar todo.",
          ],
          [
            "Papelera",
            "Lo que borrás de Propiedades, Ofertas y Reservas va a la papelera, no desaparece. Ahí queda 30 días por si te arrepentís; después se borra definitivamente. Al borrar, el aviso de abajo tiene «Deshacer».",
          ],
          [
            "«Se muestra en el portal» / «Solo interno»",
            "Cada bloque de un formulario te dice si lo que cargás lo ven tus clientes o queda solo para tu equipo.",
          ],
          [
            "Ayuda",
            "El botón con el signo de pregunta, en cada herramienta, abre la parte de esta guía que habla de ella.",
          ],
        ]}
      />

      <DocH3>La papelera</DocH3>
      <DocP>
        Se abre desde el ícono del tacho, en la barra de Propiedades, Ofertas y Reservas. Un número sobre el ícono indica
        cuántas cosas hay adentro.
      </DocP>
      <DocFigure
        src="/docs-media/papelera.webp"
        alt="La papelera de propiedades con una propiedad borrada"
        width={1304}
        height={281}
        markers={[
          { x: 37.4, y: 87.1, label: "Cuándo la borraste y cuántos días le quedan." },
          { x: 72, y: 82, label: "«Restaurar» la devuelve a su lista, tal como estaba." },
          { x: 86, y: 82, label: "«Borrar definitivamente» la elimina ya, sin esperar los 30 días. Te pedimos confirmación." },
        ]}
      />
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
      <DocFigure
        src="/docs-media/consultas.webp"
        alt="La bandeja de consultas con una consulta abierta"
        width={1304}
        height={946}
        markers={[
          { x: 20.7, y: 7.4, label: "Todas o solo las nuevas, con cuántas hay sin leer." },
          { x: 29, y: 7.4, label: "Marcar todas como leídas." },
          { x: 18.9, y: 13.5, label: "Buscá por nombre, email, mensaje, propiedad u oferta." },
          { x: 54.4, y: 21.7, label: "Qué consultó: la propiedad, la oferta o una consulta general." },
          { x: 92.4, y: 8.6, label: "Volver a marcarla como nueva para no olvidarla." },
          { x: 47.7, y: 87.4, label: "Responder por email, WhatsApp o llamar; o ir a la ficha del cliente." },
        ]}
      />

      <DocH3>Qué pasa cuando llega una</DocH3>
      <DocList>
        <li>Aparece en Consultas como nueva, suma al número del menú lateral y a la campana.</li>
        <li>
          Se crea el cliente, o se actualiza si ya existía uno con ese email. En su historial queda una nota que nombra la
          propiedad u oferta que consultó.
        </li>
        <li>
          La agencia recibe un aviso por email (al email de contacto de Configuración o, si no hay, a propietarios y
          administradores) y el cliente recibe una confirmación.
        </li>
      </DocList>

      <DocH3>Trabajar la bandeja</DocH3>
      <DocList>
        <li>
          A la izquierda está la lista, agrupada en Hoy, Ayer, Esta semana y Anteriores; a la derecha, la consulta abierta.
          En el celular se turnan: tocá una para leerla y la flecha para volver.
        </li>
        <li>Al abrir una consulta se marca como leída. El sobre de arriba a la derecha la vuelve a marcar como nueva.</li>
        <li>
          Las de un cliente que ya tenés muestran su etapa (Lead, Contactado…) al lado del nombre.
        </li>
        <li>
          Respondé con un clic: <strong>Responder por email</strong> (con el asunto y el saludo ya escritos),{" "}
          <strong>WhatsApp</strong> (con un mensaje que nombra lo que consultó) o <strong>Llamar</strong>. WhatsApp y
          Llamar aparecen si dejó teléfono. El ícono al lado del email lo copia.
        </li>
        <li>Tocá la propiedad u oferta para abrirla en el panel, o «Ver cliente» para ir a su ficha.</li>
        <li>La bandeja se actualiza sola cada minuto.</li>
      </DocList>
      <DocTip>
        Si todavía no llegó ninguna consulta, compartí el link de tu portal: el formulario de contacto y el de cada ficha
        llegan acá.
      </DocTip>
    </DocSection>
  );
}

function Clients() {
  return (
    <DocSection
      id="clientes"
      icon={Users}
      title="Clientes"
      intro="Tu agenda de contactos y su seguimiento: en qué etapa está cada uno, qué busca, qué hay que hacer con él y cada vez que hablaron."
    >
      <DocFigure
        src="/docs-media/clientes-lista.webp"
        alt="La lista de clientes en cuadrícula"
        width={1304}
        height={946}
        markers={[
          { x: 26.3, y: 6, label: "Buscá por nombre, email o teléfono." },
          { x: 64.3, y: 6, label: "Filtrá por etapa." },
          { x: 89.4, y: 6, label: "Cargar un cliente a mano." },
          { x: 76.6, y: 86.9, label: "La etapa de cada cliente." },
          { x: 39.8, y: 72.8, label: "De dónde llegó: portal, oferta o carga manual; y hace cuánto fue el último movimiento." },
        ]}
      />

      <DocH3>Cómo llegan</DocH3>
      <DocList>
        <li>
          <strong>Carga manual:</strong> «Nuevo cliente» con nombre, email y teléfono.
        </li>
        <li>
          <strong>Desde el portal o una oferta:</strong> cuando alguien te escribe, Tivvo crea el cliente (o lo reconoce
          por su email) y deja una nota en su historial con la propiedad u oferta que consultó.
        </li>
      </DocList>

      <DocH3>Etapas</DocH3>
      <DocTerms
        items={[
          [<DocPill key="l" tone="amber">Lead</DocPill>, "Recién llegó; todavía no hablaste con él."],
          [<DocPill key="c" tone="primary">Contactado</DocPill>, "Ya hubo un primer contacto."],
          [<DocPill key="n">Negociando</DocPill>, "Están conversando una propuesta concreta."],
          [<DocPill key="k" tone="primary">Cliente</DocPill>, "Cerró una operación con vos."],
          [<DocPill key="p">Perdido</DocPill>, "No avanzó. Se ve más tenue en la lista."],
        ]}
      />
      <DocP>
        Cambiá la etapa desde el menú <strong>⋯</strong> de cada cliente («Cambiar etapa») o desde su ficha. En ese mismo
        menú podés ver la ficha, mandarle un email, llamarlo o copiar su email.
      </DocP>

      <DocH3>La ficha del cliente</DocH3>
      <DocFigure
        src="/docs-media/clientes-ficha.webp"
        alt="La ficha de un cliente con notas, tareas e historial"
        width={1304}
        height={1651}
        markers={[
          { x: 4.6, y: 15.8, label: "Notas: lo que conviene recordar." },
          { x: 4.7, y: 34.3, label: "Tareas con fecha límite; las vencidas, en rojo." },
          { x: 5.6, y: 58.2, label: "Historial: notas, llamadas, emails y reuniones." },
          { x: 82.4, y: 12.8, label: "Cambiar la etapa." },
          { x: 82.4, y: 17.6, label: "El agente responsable." },
        ]}
      />
      <DocTerms
        items={[
          [
            "Notas",
            "Lo que conviene recordar: qué busca, presupuesto, preferencias. Admite títulos, negrita, listas y links. Cuando cambiás algo aparece «Guardar notas».",
          ],
          [
            "Tareas",
            "Lo que hay que hacer con este cliente: llamar, mandar fotos, coordinar una visita. Escribí la tarea, elegí una fecha límite opcional y tocá +. Marcá la casilla cuando la hagas. Las vencidas se ven en rojo («Vencida hace 2 días»), y las de hoy y mañana lo dicen.",
          ],
          [
            "Historial",
            "Elegí el tipo (nota, llamada, email o reunión), escribí qué pasó y tocá «Registrar». Se ordena del más reciente al más antiguo y muestra quién lo cargó.",
          ],
          ["Etapa", "Tocá la etapa nueva en el panel de la derecha; se guarda al momento."],
          [
            "Responsable",
            "El agente que lleva al cliente. Propietarios y administradores lo eligen de la lista del equipo; un agente puede tocar «Quedármelo» en un lead sin asignar.",
          ],
          ["Contacto", "Su email y teléfono, con un toque para escribirle o llamarlo."],
        ]}
      />
      <DocTip>
        Al eliminar una tarea no hay papelera: desaparece al momento. Si solo la terminaste, mejor marcala como hecha.
      </DocTip>
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
          disponibles y las secciones del editor.
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
        height={968}
        className="max-w-md"
        markers={[
          { x: 68.6, y: 29.3, label: "Venta o alquiler." },
          { x: 92, y: 47.2, label: "El título con el que la ven tus clientes." },
          { x: 92, y: 55.5, label: "La categoría; cambia según sea venta o alquiler." },
          { x: 79, y: 92.4, label: "Crea la propiedad y abre el editor." },
        ]}
      />
      <DocTip>
        ¿Tenés tus propiedades en otro sistema? Usá <strong>Importar</strong> para traerlas todas juntas. Ver «Importar
        propiedades» más abajo.
      </DocTip>

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
        width={1276}
        height={946}
        markers={[
          { x: 15.5, y: 6, label: "Buscador por título, zona, región, país o propietario." },
          { x: 38.4, y: 6, label: "Orden: más recientes, más antiguas, precio o título." },
          { x: 47.4, y: 6, label: "Filtros (tecla F)." },
          { x: 54.8, y: 6, label: "Vista tabla, lista o cuadrícula." },
          { x: 62.2, y: 6, label: "Papelera: lo borrado en los últimos 30 días." },
          { x: 69.9, y: 6, label: "Importar propiedades desde otro sistema (propietarios y administradores)." },
          { x: 83.7, y: 6, label: "Nueva propiedad (tecla N)." },
          { x: 37.3, y: 69.3, label: "El estado de cada propiedad." },
        ]}
      />
      <DocList>
        <li>
          Cada tarjeta muestra la foto de portada, la operación y categoría, la ubicación, el precio, dormitorios, baños,
          superficie, el propietario y hace cuánto se actualizó.
        </li>
        <li>Se muestran 25 por página. Al bajar, el buscador queda flotando arriba para que no tengas que volver.</li>
        <li>
          Desde el menú <strong>⋯</strong> de cada propiedad: editar, verla en el sitio (si está publicada), publicar,
          despublicar, archivar, volver a publicar o eliminar. El ícono de la flecha también abre la ficha pública.
        </li>
      </DocList>
      <DocFigure
        src="/docs-media/propiedades-filtros.webp"
        alt="El panel de filtros de propiedades"
        width={560}
        height={1604}
        className="max-w-xs"
        markers={[
          { x: 92, y: 3.8, label: "Estado, tipo y categoría: podés marcar más de uno; sin marcar, se ven todas." },
          { x: 92, y: 35.1, label: "Ubicación y propietario." },
          { x: 27.5, y: 55.8, label: "Rango de precio, en la moneda que elijas." },
          { x: 92, y: 60.7, label: "Mínimo de dormitorios y baños." },
          { x: 17.4, y: 96, label: "Limpiar vuelve todo a cero." },
          { x: 62.5, y: 96, label: "Aplica los filtros y te dice cuántas propiedades quedan." },
        ]}
      />
      <DocP>
        Los filtros activos aparecen como etiquetas arriba de la lista; tocá la cruz de una para quitarla.
      </DocP>

      <DocH3>Acciones en lote</DocH3>
      <DocP>
        En la vista tabla, marcá varias propiedades con la casilla de cada fila (o todas con la de arriba). Abajo aparece
        una barra para publicarlas, despublicarlas, archivarlas o eliminarlas juntas. <Kbd>Esc</Kbd> limpia la selección.
      </DocP>
      <DocFigure
        src="/docs-media/propiedades-lote.webp"
        alt="Dos propiedades seleccionadas y la barra de acciones en lote"
        width={1276}
        height={946}
        markers={[
          { x: 2.2, y: 30, label: "Marcá las propiedades." },
          { x: 47.9, y: 94.2, label: "La barra de acciones en lote." },
        ]}
      />

      <DocH3>El editor</DocH3>
      <DocP>
        Arriba está la barra del editor, con las secciones agrupadas: <strong>Información general</strong>,{" "}
        <strong>Multimedia</strong>, <strong>Alquiler</strong> (solo en alquileres), <strong>Gestión</strong> y{" "}
        <strong>Contacto</strong>. Pasá el mouse (o tocá) un grupo con flecha para ver sus secciones. Guardá con{" "}
        <strong>Guardar</strong> o <Kbd>Ctrl/⌘</Kbd> <Kbd>S</Kbd>. <strong>Publicar</strong> guarda y publica en un solo
        paso; si ya está publicada, el botón pasa a ser <strong>Despublicar</strong>. Si intentás salir con cambios sin
        guardar, te avisamos.
      </DocP>
      <DocFigure
        src="/docs-media/propiedades-editor.webp"
        alt="El editor de una propiedad en la sección Básico"
        width={1760}
        height={990}
        markers={[
          { x: 22.7, y: 5.1, label: "Volver a la lista de propiedades." },
          { x: 33.8, y: 5.1, label: "Las secciones del editor, agrupadas." },
          { x: 85.4, y: 5.1, label: "Ayuda, Cancelar, Guardar y Publicar o Despublicar." },
          { x: 39.7, y: 46.5, label: "El responsable: el agente que la atiende." },
          { x: 85.8, y: 27.8, label: "Así se ve la tarjeta en tu cartera, en vivo mientras editás." },
        ]}
      />
      <DocTerms
        items={[
          [
            "Básico",
            "Título, nombre privado (cómo la llama tu equipo; nunca lo ve el cliente), responsable, operación, categoría, dormitorios, baños, superficies, cocheras, depósitos, pisos, año de construcción y renovación, certificado energético. En alquileres también huéspedes y estrellas.",
          ],
          [
            "Ubicación",
            "Cómo se muestra (la ubicación visible para tus clientes), dónde está (la dirección exacta y el pin en el mapa, solo internos), el entorno (características de la zona y vistas) y enlaces (Google Maps, folleto en PDF y sitio web).",
          ],
          [
            "Amenities & Facilities",
            "Amenities generales (la lista corta de la ficha: escribí cada una y Enter), comodidades interiores y exteriores, piscinas y jacuzzis con tipo y medidas, dormitorios por tipo, distribución de ambientes y servicios y condiciones.",
          ],
          [
            "Content & Services",
            "El resumen (destacado arriba en la ficha) y la descripción, con títulos y listas. En alquileres, además, los servicios incluidos en el precio y las políticas de reserva y cancelación.",
          ],
          [
            "Precios",
            "Precio de venta o precio base por noche, y moneda. Si lo dejás vacío, la ficha muestra «Precio a consultar».",
          ],
          ["Fotos", "Ver más abajo. Los cambios de esta sección se guardan al momento, sin tocar Guardar."],
          [
            "Essentials",
            "Datos internos: quién administra la propiedad en el día a día, el proveedor y la licencia, la comisión y si se puede comercializar fuera de tu portal.",
          ],
          [
            "Recomendaciones",
            "Mejoras sugeridas con detalle, costo estimado, prioridad y estado (propuesta, aprobada o hecha). El propietario las ve en su página.",
          ],
          ["Rooms", "Solo en hoteles, dentro de Gestión: las habitaciones del hotel."],
          ["Propietario", "El dueño de la propiedad, su link de acceso y su estado de cuenta. Ver «Propietarios»."],
        ]}
      />
      <DocP>
        El <strong>responsable</strong> (en Básico) define qué agente la ve: un agente solo trabaja con las propiedades
        que tiene asignadas. Lo eligen propietarios y administradores, y se guarda al elegirlo.
      </DocP>

      <DocH3>Ubicación</DocH3>
      <DocFigure
        src="/docs-media/propiedades-ubicacion.webp"
        alt="La sección Ubicación con la ubicación visible, la dirección y el mapa"
        width={1452}
        height={1100}
        markers={[
          { x: 26.9, y: 14.1, label: "Lo que ven tus clientes: la ubicación visible." },
          { x: 26.9, y: 40.2, label: "La dirección exacta y el pin, solo para tu equipo." },
          { x: 80.5, y: 48.2, label: "Buscá la dirección, hacé clic en el mapa o arrastrá el pin." },
        ]}
      />
      <DocP>
        Para tomar las coordenadas también podés pegar un link de Google Maps. La dirección exacta nunca se muestra en el
        portal: tus clientes ven solo la ubicación visible (por ejemplo «Mallorca, Islas Baleares»).
      </DocP>

      <DocH3>Fotos y videos</DocH3>
      <DocFigure
        src="/docs-media/propiedades-fotos.webp"
        alt="La galería de fotos de una propiedad"
        width={1452}
        height={946}
        markers={[
          { x: 4.1, y: 16.3, label: "Lo que cargás acá se ve en el portal y se guarda al momento." },
          { x: 64.4, y: 29, label: "Las secciones de la galería; «Agregar» crea una nueva." },
          { x: 40.2, y: 46.6, label: "Arrastrá o elegí fotos: se suben a la sección marcada." },
          { x: 5.2, y: 64.3, label: "La foto de portada." },
        ]}
      />
      <DocList>
        <li>
          Arrastrá las fotos al recuadro o hacé clic para elegirlas (JPG, PNG, WebP o HEIC). Se optimizan solas antes de
          subirse.
        </li>
        <li>
          Las fotos se agrupan por sección (General, Dormitorios, Living interior, Pileta, Exterior, Instalaciones
          adicionales, Vistas o una tuya). Arrastralas para ordenarlas dentro de su sección, o usá «Mover a otra sección».
        </li>
        <li>La primera foto es la portada. Para cambiarla, usá «Hacer portada» sobre otra.</li>
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
            "Bloqueá fechas a mano con una nota opcional. Las reservas confirmadas bloquean sus fechas solas. Para no tener reservas dobles, pegá el link iCal de Airbnb o Booking y tocá «Sincronizar ahora». Si la propiedad está publicada, también tenés un link para exportar tu disponibilidad a esas plataformas.",
          ],
          [
            "Rates",
            "Períodos de tarifa (por ejemplo «Temporada alta») con fechas, precio oficial por noche, estadía mínima, fee de management y comisión de la agencia.",
          ],
        ]}
      />
      <DocFigure
        src="/docs-media/propiedades-disponibilidad.webp"
        alt="La sección Disponibilidad de un alquiler"
        width={1452}
        height={1331}
        markers={[
          { x: 23.3, y: 4, label: "Bloquear fechas a mano, con una nota opcional." },
          { x: 4.7, y: 22.7, label: "Las fechas tomadas: «BOOKING» viene de una reserva, «MANUAL» de un bloqueo tuyo, que podés quitar." },
          { x: 23.3, y: 31.2, label: "Pegá el link iCal de Airbnb o Booking y sincronizá." },
          { x: 23.3, y: 38.8, label: "Tu calendario, para cargarlo en esas plataformas." },
        ]}
      />
      <DocFigure
        src="/docs-media/propiedades-tarifas.webp"
        alt="La sección Rates con tres temporadas cargadas"
        width={1452}
        height={681}
        markers={[
          { x: 26.9, y: 10.5, label: "Un período nuevo: etiqueta, fechas, precio por noche y estadía mínima." },
          { x: 14.6, y: 41, label: "Fee de management (10 % por defecto) y comisión de la agencia (20 % por defecto), en %." },
          { x: 16.2, y: 90.3, label: "Las temporadas cargadas, con su precio y estadía mínima. «Quitar» borra una." },
        ]}
      />
      <DocTip>
        Para ver todas tus propiedades en alquiler en un solo calendario, usá <strong>Disponibilidad</strong> en el menú.
      </DocTip>

      <DocH3>Recomendaciones</DocH3>
      <DocFigure
        src="/docs-media/propiedades-recomendaciones.webp"
        alt="La sección Recomendaciones con dos mejoras cargadas"
        width={1452}
        height={847}
        markers={[{ x: 10.8, y: 64.5, label: "Cada mejora con su detalle, costo estimado y prioridad." }]}
      />
      <DocP>
        Sirven para proponerle mejoras al propietario: renovar el mobiliario, sumar un cargador para autos… Cada una tiene
        prioridad (alta, media o baja) y un estado que vas cambiando: propuesta, aprobada o hecha. El propietario las ve
        en su página, bajo «Mejoras sugeridas».
      </DocP>

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
      intro="Los dueños de las propiedades que comercializás. Cada uno tiene una página privada donde sigue sus propiedades, sus reservas y lo que le corresponde, sin necesitar usuario ni contraseña."
    >
      <DocH3>Asignar un propietario</DocH3>
      <DocSteps>
        <DocStep>
          En el editor de la propiedad, abrí <strong>Contacto</strong> → <strong>Propietario</strong>.
        </DocStep>
        <DocStep>Buscalo por nombre, email o teléfono, o tocá «Nuevo propietario» para cargarlo ahí mismo.</DocStep>
        <DocStep>Guardá la propiedad. Un mismo propietario puede tener varias propiedades.</DocStep>
      </DocSteps>
      <DocFigure
        src="/docs-media/propietarios-asignar.webp"
        alt="La sección Propietario con un propietario asignado y su link de acceso"
        width={1452}
        height={1111}
        markers={[
          { x: 25, y: 14.3, label: "El propietario asignado; «Quitar» lo desvincula." },
          { x: 37.1, y: 38.4, label: "Copiá su link personal para mandárselo." },
          { x: 47.6, y: 38.4, label: "Regenerar: el link anterior deja de funcionar." },
          { x: 7.9, y: 46.4, label: "Su estado de cuenta." },
        ]}
      />

      <DocH3>Estado de cuenta</DocH3>
      <DocP>
        Debajo del acceso está el estado de cuenta del propietario, con todas sus propiedades juntas. Lo ven solo
        propietarios y administradores de la agencia.
      </DocP>
      <DocFigure
        src="/docs-media/propietarios-cuenta.webp"
        alt="El estado de cuenta de un propietario con lo cobrado, la comisión, lo liquidado y el saldo"
        width={1100}
        height={1148}
        className="max-w-2xl"
        markers={[
          { x: 16.3, y: 18.1, label: "Lo cobrado en las reservas de sus propiedades, de lo reservado." },
          { x: 83.7, y: 18.1, label: "Lo que le corresponde: lo cobrado menos la comisión." },
          { x: 34, y: 30.4, label: "Lo que falta liquidarle." },
          { x: 20, y: 79.1, label: "Las liquidaciones: lo que ya le pagaste. El tacho borra una." },
          { x: 15.2, y: 96.4, label: "Registrar un pago al propietario." },
        ]}
      />
      <DocTerms
        items={[
          ["Cobrado", "La suma de los pagos marcados como cobrados en sus reservas (anticipos y saldos)."],
          ["Comisión", "La comisión de la agencia en esas reservas; se descuenta de lo cobrado."],
          ["Te corresponde", "Lo cobrado menos la comisión."],
          ["Ya liquidado", "La suma de las liquidaciones que registraste."],
          ["Saldo por liquidar", "Lo que todavía le debés. Si le pagaste de más, lo dice."],
          ["Por reserva", "El detalle de cada reserva: fechas, cuánto se cobró de cuánto y la comisión."],
        ]}
      />
      <DocSteps>
        <DocStep>
          Tocá <strong>Registrar liquidación</strong>. Ya viene cargado el saldo pendiente y su moneda.
        </DocStep>
        <DocStep>Ajustá el monto si hace falta y elegí la fecha.</DocStep>
        <DocStep>Escribí el medio (transferencia, efectivo…) y una nota si querés, y tocá «Registrar».</DocStep>
      </DocSteps>

      <DocH3>La página del propietario</DocH3>
      <DocP>
        En «Acceso del propietario» está su link personal: copialo y mandáselo. Desde ahí ve sus propiedades y su estado
        (publicada o no, con el precio publicado), la estadía en curso o la próxima, las reservas con sus fechas y pagos,
        su estado de cuenta y las mejoras sugeridas que cargaste en Recomendaciones. Un botón le permite escribirte por
        WhatsApp o email.
      </DocP>
      <DocFigure
        src="/docs-media/propietarios-pagina.webp"
        alt="La página del propietario con el resumen de sus propiedades y su estado de cuenta"
        width={1584}
        height={946}
        markers={[
          { x: 24, y: 38.9, label: "Cuántas de sus propiedades están publicadas." },
          { x: 50, y: 38.9, label: "La estadía en curso o la próxima." },
          { x: 75.2, y: 38.9, label: "Lo que le corresponde de lo cobrado." },
          { x: 25, y: 66.1, label: "Su estado de cuenta: lo liquidado, el saldo y el detalle por reserva." },
          { x: 84.3, y: 4.2, label: "Un botón para escribirte." },
        ]}
      />
      <DocP>
        Por defecto el propietario <strong>no ve tu comisión</strong>: ve cuánto le corresponde, pero no cuánto se
        descontó. Si querés mostrársela, activá «Mostrar la comisión de la agencia» en Configuración.
      </DocP>
      <DocTip>
        Si el link llegó a quien no debía, tocá «Regenerar»: el anterior deja de funcionar al instante.
      </DocTip>
    </DocSection>
  );
}

function Importer() {
  return (
    <DocSection
      id="importar"
      icon={Upload}
      title="Importar propiedades"
      adminOnly
      intro="Traé tu cartera desde otro sistema de una sola vez: un CRM, un portal o una planilla. Nada se guarda hasta que revisás qué va a pasar con cada propiedad."
    >
      <DocP>
        Se abre desde <strong>Importar</strong>, en la barra de Propiedades. El proceso tiene cuatro pasos: elegir de dónde
        venís, traer el archivo, decir qué es cada columna (solo en planillas) y revisar.
      </DocP>

      <DocH3>1. Elegí de dónde migrás</DocH3>
      <DocFigure
        src="/docs-media/importar-plataformas.webp"
        alt="El listado de plataformas desde las que se puede migrar"
        width={1276}
        height={946}
        markers={[
          { x: 16.5, y: 18.6, label: "Buscá tu sistema por nombre o país." },
          { x: 52.7, y: 18.6, label: "Filtrá por CRM, portales o agregadores." },
          { x: 35.8, y: 44, label: "Elegí tu plataforma: te mostramos cómo sacar tus datos de ahí." },
        ]}
      />
      <DocP>
        Hay casi 50 plataformas (Idealista, Inmovilla, Kyero, CASAFARI, Resales Online, Witei, Apimo, Rightmove y muchas
        más), las más usadas primero. Si la tuya no está, abajo podés usar un <strong>CSV o Excel</strong>, un{" "}
        <strong>XML de Kyero</strong> (el formato que exporta la mayoría de los CRM) o el <strong>XML de Tivvo</strong>,
        si tu sistema tiene API propia.
      </DocP>

      <DocH3>2. Traé tus datos</DocH3>
      <DocFigure
        src="/docs-media/importar-fuente.webp"
        alt="La guía para migrar desde Idealista, con el recuadro para subir el archivo"
        width={1276}
        height={946}
        markers={[
          { x: 28.6, y: 21.3, label: "Los pasos para sacar tus propiedades de esa plataforma." },
          { x: 9.8, y: 42.9, label: "Otra ruta, si tu plataforma te da un CSV o Excel." },
          { x: 28.6, y: 50, label: "¿Te trabás? Te armamos el pedido a la plataforma o te ayudamos nosotros." },
          { x: 70, y: 22.6, label: "Subí el archivo o pegá la URL del feed." },
          { x: 77.9, y: 39.5, label: "Leemos el archivo; todavía no se guarda nada." },
        ]}
      />
      <DocList>
        <li>
          Seguí los pasos de la guía de tu plataforma. Muchas piden el feed por soporte: en «¿Te trabás?» tocá{" "}
          <strong>Enviar pedido por email</strong> y se abre tu correo con el mensaje ya escrito, o copialo con «Ver
          mensaje».
        </li>
        <li>
          <strong>Subir archivo:</strong> CSV o Excel (.xlsx) de hasta 10 MB y 3.000 filas, o XML de hasta 10 MB.
        </li>
        <li>
          <strong>Usar una URL:</strong> pegá el link público del feed. Lo leemos una sola vez; no queda sincronizado.
        </li>
        <li>
          Si empezás de cero, tocá <strong>Descargar plantilla CSV</strong>: tiene las columnas que entendemos y una fila
          de ejemplo.
        </li>
        <li>
          «Pedir ayuda» te deja escribirnos con el mensaje ya armado: te ayudamos a migrar.
        </li>
      </DocList>

      <DocH3>3. Qué es cada columna</DocH3>
      <DocP>Solo en planillas (CSV o Excel). Tivvo reconoce solo la mayoría de las columnas; revisá las demás.</DocP>
      <DocFigure
        src="/docs-media/importar-mapeo.webp"
        alt="El paso para asignar cada columna del archivo a un dato de Tivvo"
        width={1304}
        height={1132}
        markers={[
          { x: 49, y: 14.4, label: "Cuántas filas y columnas reconocimos." },
          { x: 13.9, y: 27.2, label: "Las columnas que no reconocimos van primero, con ejemplos de tu archivo." },
          { x: 83.8, y: 27.2, label: "Elegí a qué dato de Tivvo corresponde, o «No importar»." },
          { x: 13, y: 95.5, label: "Ver qué va a pasar con cada fila, antes de guardar." },
        ]}
      />
      <DocList>
        <li>Cada dato sale de una sola columna: si lo elegís en otra, se libera en la anterior.</li>
        <li>Las columnas sin asignar se ignoran. Una celda vacía nunca borra lo que ya está cargado.</li>
        <li>
          Asigná una columna de <strong>referencia (ID)</strong>: así, si volvés a importar el archivo, las propiedades se
          actualizan en lugar de duplicarse. Si no hay, te avisamos.
        </li>
      </DocList>

      <DocH3>4. Revisá e importá</DocH3>
      <DocFigure
        src="/docs-media/importar-revision.webp"
        alt="La vista previa de la importación con el resumen y el detalle por fila"
        width={1304}
        height={853}
        markers={[
          { x: 9.4, y: 20.9, label: "El resumen: nuevas, a actualizar, sin cambios, omitidas y con error. Tocá una para filtrar." },
          { x: 22.7, y: 31.2, label: "Publicarlas directo o dejarlas como borrador." },
          { x: 25.9, y: 38.2, label: "Mandar a la papelera lo que ya no está en el archivo." },
          { x: 8.1, y: 49.3, label: "Fila por fila, con sus avisos, errores y qué cambia." },
          { x: 15.4, y: 94.1, label: "Recién acá se guarda todo." },
        ]}
      />
      <DocTerms
        items={[
          ["Nueva", "No estaba en Tivvo: se crea."],
          ["Actualiza", "Ya la habías importado (misma referencia): cambia lo que dice el detalle, por ejemplo precio o fotos."],
          ["Sin cambios", "Ya está igual en Tivvo."],
          ["Omitida", "No se importa, por ejemplo porque se repite en el archivo."],
          ["Con error", "Le falta algo obligatorio, como el título. El detalle dice qué."],
        ]}
      />
      <DocList>
        <li>
          <strong>Publicar las nuevas al importar:</strong> apagado, quedan como borrador para que las revises antes de
          mostrarlas en tu sitio.
        </li>
        <li>
          <strong>Mandar a la papelera lo que ya no está en el archivo:</strong> solo toca propiedades que trajiste antes
          desde esa misma plataforma, y te pedimos confirmación. Se pueden restaurar durante 30 días.
        </li>
        <li>
          Al tocar <strong>Importar</strong>, Tivvo guarda las propiedades y descarga sus fotos. Si son muchas puede tardar
          un par de minutos: no cierres la pestaña. Si intentás salir antes de terminar, te avisamos.
        </li>
      </DocList>
      <DocFigure
        src="/docs-media/importar-listo.webp"
        alt="La pantalla final de la importación con el resumen y los errores"
        width={1100}
        height={395}
        className="max-w-2xl"
        markers={[
          { x: 50, y: 47, label: "Lo que se hizo, con el detalle de los errores." },
          { x: 38.2, y: 68.5, label: "Bajá los errores en un CSV para corregirlos." },
          { x: 37.8, y: 81.5, label: "Revisá los borradores o mirá tu sitio; «Importar otro archivo» empieza de nuevo." },
        ]}
      />
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
          Tocá <strong>Nueva oferta</strong>, ponele un título (por ejemplo «Propuesta para la familia Pérez»), elegí la
          operación (venta, alquiler o ambas) y, si querés, un código de referencia. La operación define qué propiedades
          podés sumar.
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
        src="/docs-media/ofertas-nueva.webp"
        alt="El diálogo Nueva oferta"
        width={784}
        height={838}
        className="max-w-md"
        markers={[
          { x: 92, y: 31.1, label: "El título." },
          { x: 92, y: 48.6, label: "Un código de referencia opcional, como el de tu sistema." },
          { x: 92, y: 59, label: "Venta, alquiler o ambas: define qué propiedades podés sumar." },
        ]}
      />
      <DocFigure
        src="/docs-media/ofertas-lista.webp"
        alt="La lista de ofertas"
        width={1304}
        height={946}
        markers={[
          { x: 24.2, y: 6, label: "Buscador por título o cliente." },
          { x: 60.1, y: 6, label: "Filtros por operación y estado." },
          { x: 89.6, y: 6, label: "Nueva oferta." },
          { x: 5.8, y: 60.5, label: "El estado: acá, el cliente ya la abrió." },
          { x: 17, y: 47.3, label: "Tu código de referencia, si le pusiste uno." },
        ]}
      />

      <DocH3>El editor</DocH3>
      <DocFigure
        src="/docs-media/ofertas-editor.webp"
        alt="El editor de una oferta en la sección General"
        width={1480}
        height={1100}
        markers={[
          { x: 15, y: 4.6, label: "Las secciones: General, Bienvenida, Propiedades y Servicios." },
          { x: 30.3, y: 37.1, label: "El cliente que la recibe por email." },
          { x: 17.6, y: 76.2, label: "Mostrar u ocultar los precios." },
          { x: 18.2, y: 84.8, label: "Mostrar tu logo, encabezado y datos de contacto." },
          { x: 84.5, y: 25.4, label: "El resumen, el link para el cliente y «Ver cliente»." },
          { x: 90, y: 4.6, label: "Enviar, reenviar o publicar el link." },
        ]}
      />
      <DocP>
        A la derecha ves el estado, cuántas propiedades y servicios tiene y el total. En alquileres no hay total: son
        opciones para elegir, con precio por noche. Una vez enviada o publicada, ahí está el link para el cliente con
        «Copiar link».
      </DocP>

      <DocH3>Ajustar el precio de cada propiedad</DocH3>
      <DocFigure
        src="/docs-media/ofertas-propiedades.webp"
        alt="La sección Propiedades de una oferta con los ajustes de precio abiertos"
        width={1480}
        height={1292}
        markers={[
          { x: 28.6, y: 12.4, label: "Cada sección con su título y un texto." },
          { x: 17.1, y: 33, label: "Precio especial, descuento y depósito solo para esta oferta." },
          { x: 30.3, y: 50.4, label: "Un texto corto debajo de la propiedad." },
        ]}
      />
      <DocP>
        «Mostrar ajustes» en cada propiedad te deja poner un precio especial para esta oferta, un descuento (porcentaje o
        monto fijo), un depósito de seguridad y un texto corto como «Incluye limpieza final». El cliente ve el precio
        anterior tachado. El precio de la propiedad en tu cartera no cambia.
      </DocP>

      <DocH3>Servicios en la oferta</DocH3>
      <DocFigure
        src="/docs-media/ofertas-servicios.webp"
        alt="La sección Servicios de una oferta con un chef privado y un traslado"
        width={1480}
        height={814}
        markers={[
          { x: 7.9, y: 93.5, label: "Sumá un servicio de tu librería." },
          { x: 30.3, y: 9.9, label: "Ajustá precio, cantidad, fecha y una nota para el cliente." },
          { x: 52.6, y: 43.7, label: "El subtotal de cada servicio." },
        ]}
      />
      <DocP>
        Los servicios salen de tu librería (ver «Servicios»). Al sumarlo a la oferta podés cambiar el precio, la cantidad
        (personas, días, noches u horas, según cómo se cobre), la fecha y dejarle una nota. Sin precio, el cliente ve «A
        consultar».
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
        Cuando el cliente la abre, la oferta pasa a «Vista» y te llega una notificación. Desde la página de la oferta el
        cliente puede escribirte: esa consulta llega a Consultas.
      </DocP>

      <DocH3>Estados</DocH3>
      <DocTerms
        items={[
          [<DocPill key="d" tone="amber">Borrador</DocPill>, "Todavía no la ve nadie."],
          [<DocPill key="s" tone="primary">Enviada</DocPill>, "El link está activo y se le mandó al cliente."],
          [<DocPill key="v">Vista</DocPill>, "El cliente ya abrió la oferta."],
          [<DocPill key="e">Vencida</DocPill>, "Pasó su fecha de vencimiento; el cliente ve un aviso de que venció."],
        ]}
      />
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
      <DocFigure
        src="/docs-media/reservas-lista.webp"
        alt="La lista de reservas"
        width={1304}
        height={946}
        markers={[
          { x: 24, y: 6, label: "Buscá por propiedad o cliente." },
          { x: 50.2, y: 6, label: "Filtrá por estado o por ubicación de la propiedad." },
          { x: 89.2, y: 6, label: "Nueva reserva." },
          { x: 7, y: 40.5, label: "El estado de cada reserva." },
        ]}
      />

      <DocH3>Crear una reserva</DocH3>
      <DocSteps>
        <DocStep>
          Tocá <strong>Nueva reserva</strong> y elegí la propiedad.
        </DocStep>
        <DocStep>Asigná el cliente (opcional).</DocStep>
        <DocStep>En alquileres, elegí las fechas de entrada y salida. Una venta va sin fechas.</DocStep>
        <DocStep>Cargá el precio total y tu comisión, y tocá «Crear reserva».</DocStep>
      </DocSteps>
      <DocFigure
        src="/docs-media/reservas-nueva.webp"
        alt="El diálogo Nueva reserva"
        width={784}
        height={839}
        className="max-w-md"
        markers={[
          { x: 92, y: 23.9, label: "La propiedad." },
          { x: 92, y: 40, label: "El cliente (opcional)." },
          { x: 92, y: 55.3, label: "Entrada y salida, solo en alquileres." },
          { x: 72.9, y: 71.4, label: "Precio total y tu comisión." },
        ]}
      />

      <DocH3>Estados</DocH3>
      <DocTerms
        items={[
          [
            <DocPill key="p" tone="amber">Pendiente</DocPill>,
            "Recién creada, a la espera de confirmación. Todavía no bloquea las fechas, pero en Disponibilidad se ve en ámbar.",
          ],
          [<DocPill key="c" tone="primary">Confirmada</DocPill>, "Está en firme y bloquea sus fechas."],
          [<DocPill key="o">Completada</DocPill>, "La estadía terminó o la venta se cerró."],
          [<DocPill key="x">Cancelada</DocPill>, "No va a ocurrir: las fechas se liberan. Los pagos registrados no se borran."],
        ]}
      />
      <DocP>
        Cambiá el estado desde la ficha de la reserva o desde el menú ⋯ de la lista. Antes de cancelar te pedimos
        confirmación. «Eliminar» la manda a la papelera.
      </DocP>

      <DocH3>La ficha de la reserva</DocH3>
      <DocFigure
        src="/docs-media/reservas-ficha.webp"
        alt="La ficha de una reserva con la estadía, los pagos y el resumen"
        width={1304}
        height={1210}
        markers={[
          { x: 5.1, y: 21.5, label: "Las fechas y la cantidad de noches." },
          { x: 59.9, y: 51.3, label: "Registrar un anticipo, el saldo o tu comisión." },
          { x: 57.1, y: 64.9, label: "Marcar un pago como cobrado." },
          { x: 82.4, y: 12, label: "Total, comisión, cobrado y por cobrar." },
          { x: 82.4, y: 28.7, label: "La página que ve el cliente: copiá el link o abrila." },
          { x: 82.4, y: 40.5, label: "Confirmar, completar o cancelar." },
        ]}
      />

      <DocH3>Pagos</DocH3>
      <DocP>
        «Agregar pago» registra un <strong>anticipo</strong>, el <strong>saldo</strong> o tu <strong>comisión</strong>, en
        la moneda de la reserva. Cada pago queda pendiente hasta que lo marques como cobrado; al cobrarlo queda con la
        fecha. La barra muestra cuánto se cobró del total.
      </DocP>
      <DocFigure
        src="/docs-media/reservas-pago.webp"
        alt="El diálogo Agregar pago"
        width={700}
        height={544}
        className="max-w-sm"
        caption="Elegí el tipo, escribí el monto y guardá. Queda pendiente hasta que lo marques como cobrado."
      />
      <DocP>
        Los pagos cobrados alimentan el estado de cuenta del propietario: lo cobrado menos la comisión es lo que le
        corresponde.
      </DocP>

      <DocH3>La página del cliente</DocH3>
      <DocP>
        Cada reserva tiene una página para el cliente con la propiedad, su estadía, el estado y los pagos (anticipos y
        saldo, nunca la comisión). Si la reserva tiene cliente, le llega por email al crearla, confirmarla o cancelarla.
        Si no, copiá el link desde la ficha o desde el menú ⋯ y mandáselo vos. Ver «Lo que ven tus clientes».
      </DocP>
    </DocSection>
  );
}

function Availability() {
  return (
    <DocSection
      id="disponibilidad"
      icon={CalendarCheck}
      title="Disponibilidad"
      intro="Todas tus propiedades en alquiler en un solo calendario: qué está libre y qué ocupado, para responder rápido una consulta y bloquear fechas sin entrar a cada propiedad."
    >
      <DocP>
        Tiene dos vistas, que elegís a la derecha: <strong>Próximos 90 días</strong> (una grilla con una fila por
        propiedad) y <strong>Mensual</strong> (un calendario). Solo aparecen las propiedades en alquiler.
      </DocP>

      <DocH3>Próximos 90 días</DocH3>
      <DocFigure
        src="/docs-media/disponibilidad-grilla.webp"
        alt="La grilla de disponibilidad de los próximos 90 días"
        width={1304}
        height={704}
        markers={[
          { x: 12.8, y: 20, label: "Buscá una propiedad o filtrá por ubicación." },
          { x: 69.1, y: 20, label: "Elegí unas fechas para ver qué propiedades están libres." },
          { x: 88.5, y: 20, label: "Próximos 90 días o Mensual." },
          { x: 86.2, y: 8.1, label: "El link público de tu disponibilidad, para compartir." },
          { x: 37.4, y: 27.2, label: "Qué significa cada color." },
          { x: 13, y: 48.9, label: "Cada fila es una propiedad; tocá el nombre para abrirla." },
        ]}
      />
      <DocTerms
        items={[
          ["Verde", "Disponible."],
          ["Rojo", "Reservado o bloqueado."],
          ["Mitad y mitad", "Día de entrada (check-in, ocupado desde la tarde) o de salida (check-out, ocupado hasta la mañana)."],
          ["Ámbar", "Una reserva pendiente: todavía no bloquea las fechas, pero está pedida."],
          ["Gris", "Días pasados."],
        ]}
      />
      <DocList>
        <li>Las propiedades se agrupan por región. Pasá el mouse por un día para ver qué es.</li>
        <li>
          Al elegir fechas, esos días se resaltan y con <strong>Solo libres</strong> quedan únicamente las propiedades
          disponibles en todo el rango. «Quitar fechas» vuelve atrás.
        </li>
        <li>Se muestran 25 propiedades; «Ver más» carga las siguientes.</li>
      </DocList>

      <DocH3>Mensual</DocH3>
      <DocFigure
        src="/docs-media/disponibilidad-mes.webp"
        alt="El calendario mensual con la ocupación de cada día"
        width={1304}
        height={1298}
        markers={[
          { x: 6.4, y: 10.7, label: "Moverte de mes; «Hoy» vuelve al actual." },
          { x: 67.9, y: 10.7, label: "Elegí una propiedad para ver sus reservas y bloquear fechas." },
          { x: 67.7, y: 52.5, label: "Cuántas propiedades están ocupadas esa noche." },
          { x: 62.4, y: 54.9, label: "Cuáles: cada propiedad con su color. Las pendientes, con borde punteado." },
        ]}
      />
      <DocP>
        Con <strong>Todas las propiedades</strong>, cada día dice cuántas están ocupadas esa noche (en rojo si están
        todas) y cuáles, cada una siempre con el mismo color. Pasá el mouse para ver la lista completa. Al tocar un día,
        abajo aparecen las ocupadas, las pendientes y las libres:
      </DocP>
      <DocFigure
        src="/docs-media/disponibilidad-dia.webp"
        alt="El detalle de un día con las propiedades ocupadas y libres"
        width={1100}
        height={234}
        className="max-w-2xl"
        markers={[
          { x: 25.5, y: 29.5, label: "Qué está ocupado, pendiente y libre ese día." },
          { x: 46.5, y: 43, label: "«Ver mes» abre el calendario de esa propiedad; el nombre abre la propiedad." },
        ]}
      />

      <DocH3>Bloquear fechas desde el calendario</DocH3>
      <DocSteps>
        <DocStep>
          En la vista <strong>Mensual</strong>, elegí la propiedad arriba a la derecha.
        </DocStep>
        <DocStep>
          Arrastrá sobre las noches libres que querés bloquear. Con el teclado: <Kbd>Enter</Kbd> en el primer día y{" "}
          <Kbd>Enter</Kbd> en el último.
        </DocStep>
        <DocStep>
          Abajo aparece el resumen («4 noches, del 25 oct al 29 oct»). Escribí una nota si querés y tocá{" "}
          <strong>Bloquear</strong>.
        </DocStep>
      </DocSteps>
      <DocFigure
        src="/docs-media/disponibilidad-bloquear.webp"
        alt="El calendario de una propiedad con cuatro noches marcadas para bloquear"
        width={1304}
        height={1141}
        markers={[
          { x: 48.9, y: 89.2, label: "Los días de una reserva: entrada, noches ocupadas y salida." },
          { x: 89.2, y: 63.5, label: "Arrastrá sobre las noches libres para marcarlas." },
          { x: 24, y: 95.6, label: "Confirmá el bloqueo, con una nota opcional." },
        ]}
      />
      <DocP>
        No se pueden marcar noches pasadas ni ocupadas. El bloqueo aparece también en la sección Disponibilidad de la
        propiedad, donde lo podés quitar.
      </DocP>

      <DocH3>El link para compartir</DocH3>
      <DocP>
        «Copiar link para compartir» copia la dirección de tu disponibilidad pública: la misma grilla de 90 días, en tu
        portal, con tu marca. Sirve para mandársela a un cliente o a un colega. Muestra solo las propiedades publicadas y
        no muestra las reservas pendientes.
      </DocP>
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
      <DocFigure
        src="/docs-media/servicios-lista.webp"
        alt="La librería de servicios"
        width={1304}
        height={946}
        markers={[
          { x: 20.9, y: 6, label: "Buscá por nombre, tipo o zona." },
          { x: 89.1, y: 6, label: "Nuevo servicio." },
          { x: 73.3, y: 52.9, label: "Sin precio, se muestra «A consultar»." },
        ]}
      />

      <DocH3>Crear un servicio</DocH3>
      <DocSteps>
        <DocStep>
          Tocá <strong>Nuevo servicio</strong> y elegí el tipo: mayordomo, chef privado, yate, traslados, auto,
          excursiones, spa, niñera, limpieza extra, eventos u otro.
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
        alt="El formulario de un servicio: foto, zonas, precio, unidad de cobro, proveedor y disponibilidad"
        width={784}
        height={1628}
        className="max-w-md"
        markers={[
          { x: 92, y: 18.2, label: "La foto del servicio." },
          { x: 92, y: 51.9, label: "Las zonas donde se ofrece; vacío es en cualquier lugar." },
          { x: 78, y: 67.8, label: "Cómo se cobra: por servicio, persona, día, noche u hora." },
          { x: 92, y: 71.9, label: "El proveedor, solo para tu equipo." },
          { x: 89.6, y: 95.9, label: "Disponible para sumarlo a ofertas nuevas." },
        ]}
      />
      <DocList>
        <li>Tocá un servicio de la lista para editarlo o eliminarlo.</li>
        <li>El proveedor solo lo ve tu equipo, nunca el cliente.</li>
        <li>Si apagás «Disponible», el servicio no se puede sumar a ofertas nuevas, pero sigue en las que ya lo tienen.</li>
        <li>En cada oferta podés ajustar precio, cantidad y fecha del servicio para ese cliente, y dejarle una nota.</li>
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
        width={1760}
        height={990}
        markers={[
          { x: 14, y: 9.8, label: "Las pestañas: Diseño, Portada, Bloques y Agencia y contacto." },
          { x: 6.1, y: 28.8, label: "Elegí si estás configurando la versión de computadora o la de celular." },
          { x: 70.5, y: 3.5, label: "Ver la vista previa como computadora o como celular." },
          { x: 84.6, y: 3.5, label: "Ver el portal publicado." },
          { x: 94.4, y: 3.5, label: "Guardar cambios publica lo que editaste." },
          { x: 66, y: 57.1, label: "La vista previa, tal como la verán tus clientes." },
        ]}
      />
      <DocTerms
        items={[
          [
            "Diseño",
            "La plantilla de la página de inicio (Portada, Editorial, Compacto, Dividido o Mosaico), que puede ser distinta en celulares; el color de botones y enlaces (uno de la paleta u otro con su código, como #1F5F4A); y la tipografía (Moderna, Clásica, Sobria, Elegante, Editorial, Cálida, Urbana o Arquitectónica).",
          ],
          [
            "Portada",
            "La foto principal (mejor horizontal, de al menos 1920 px de ancho) y, en la plantilla Mosaico, las cuatro fotos del collage. También el titular y el texto de la portada.",
          ],
          [
            "Bloques",
            "Secciones propias entre la portada y el listado. Cada una tiene varios diseños y se puede ocultar sin borrarla.",
          ],
          [
            "Agencia y contacto",
            "El texto sobre tu agencia, teléfono, WhatsApp (activa el botón «Escribinos por WhatsApp»), Instagram y la dirección de la oficina.",
          ],
        ]}
      />

      <DocH3>Tipos de bloque</DocH3>
      <DocFigure
        src="/docs-media/portal-bloques.webp"
        alt="La pestaña Bloques con tres bloques del portal"
        width={896}
        height={1084}
        className="max-w-sm"
        markers={[
          { x: 36.7, y: 52.4, label: "Cada bloque, con su tipo y diseño. Tocalo para editarlo." },
          { x: 66.7, y: 53.9, label: "Ocultarlo sin borrarlo." },
          { x: 81.9, y: 53.9, label: "Subirlo o bajarlo." },
          { x: 89.5, y: 53.9, label: "Borrarlo." },
          { x: 49.9, y: 90.8, label: "Sumar un bloque nuevo: elegís el tipo, después su diseño y su contenido." },
        ]}
      />
      <DocTerms
        items={[
          ["Ubicación", "Una zona con foto, texto y sus propiedades. Diseños: Destacado, Banner o Carrusel."],
          [
            "Promoción",
            "Propiedades con una etiqueta como «15% OFF», con fecha de validez opcional. Diseños: Banda de color, Banner con foto o Carrusel.",
          ],
          ["Propiedades destacadas", "Una selección tuya: lo más nuevo, frente al mar, las más pedidas. Diseños: Grilla o Carrusel."],
          ["Destinos", "Varias zonas a la vez, cada una con su foto. Al tocar una, se filtra el listado. Diseños: Mosaico o Carrusel."],
          [
            "Texto e imagen",
            "Contá algo propio: tus servicios, tasaciones, cómo trabajan. Imagen a la izquierda, a la derecha o solo texto.",
          ],
          [
            "Llamado a la acción",
            "Una invitación con un botón que lleva al formulario de contacto, a WhatsApp o al listado. Diseños: Color o Con foto.",
          ],
        ]}
      />

      <DocH3>Agencia y contacto</DocH3>
      <DocFigure
        src="/docs-media/portal-agencia.webp"
        alt="La pestaña Agencia y contacto del editor del portal"
        width={896}
        height={1886}
        className="max-w-xs"
        caption="El texto «Sobre tu agencia» y los datos de contacto que aparecen en el pie y en el botón de contacto del portal."
      />
      <DocTip>
        Para ver cómo quedó, usá «Ver publicado» en el editor o «Ver mi portal» en el menú de tu perfil.
      </DocTip>
    </DocSection>
  );
}

function ClientPages() {
  return (
    <DocSection
      id="lo-que-ven-tus-clientes"
      icon={Eye}
      title="Lo que ven tus clientes"
      intro="Las páginas públicas que genera Tivvo: tu portal, la ficha de cada propiedad, las ofertas, las reservas, la página del propietario y tu disponibilidad. Ninguna pide usuario ni contraseña."
    >
      <DocH3>Tu portal</DocH3>
      <DocFigure
        src="/docs-media/portal-publico.webp"
        alt="El portal público de una agencia con la portada y el buscador"
        width={1584}
        height={946}
        caption="La portada con el buscador (operación, zona y tipo), tus bloques, el listado de propiedades publicadas y el contacto."
      />
      <DocList>
        <li>Muestra solo las propiedades publicadas. Las fichas tienen galería, mapa con la ubicación visible y formulario de consulta.</li>
        <li>Las consultas del formulario llegan a Consultas y crean el cliente.</li>
        <li>Lo cambiás desde Portal (ver «Portal web»); la dirección, desde Configuración.</li>
      </DocList>

      <DocH3>La oferta</DocH3>
      <DocFigure
        src="/docs-media/ofertas-cliente.webp"
        alt="La página de una oferta tal como la ve el cliente"
        width={1584}
        height={990}
        caption="El saludo, las secciones con sus propiedades (con el precio especial y el anterior tachado) y los servicios. Abajo, un formulario para escribirte."
      />

      <DocH3>La reserva</DocH3>
      <DocFigure
        src="/docs-media/reservas-cliente.webp"
        alt="La página de una reserva confirmada tal como la ve el cliente"
        width={1584}
        height={946}
        caption="El estado, la propiedad, las fechas y los pagos: total, pagado y lo que falta. Nunca muestra tu comisión."
      />

      <DocH3>Tu disponibilidad</DocH3>
      <DocFigure
        src="/docs-media/disponibilidad-publica.webp"
        alt="La disponibilidad pública de la agencia"
        width={1584}
        height={946}
        caption="Los próximos 90 días de tus alquileres publicados, con buscador, ubicación y fechas. No muestra reservas pendientes."
      />

      <DocH3>La página del propietario</DocH3>
      <DocP>Ver «Propietarios».</DocP>
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
      <DocFigure
        src="/docs-media/equipo.webp"
        alt="El equipo de la agencia"
        width={1304}
        height={946}
        markers={[
          { x: 63.9, y: 6, label: "Filtrá por rol." },
          { x: 88.8, y: 6, label: "Invitar a alguien." },
          { x: 12.4, y: 19.7, label: "El rol de cada persona." },
        ]}
      />
      <DocSteps>
        <DocStep>
          Tocá <strong>Invitar miembro</strong>, escribí su nombre y email y elegí el rol: administrador o agente.
        </DocStep>
        <DocStep>
          Le llega el acceso por email. Si ya tenía cuenta en Tivvo (por ejemplo, en otra agencia), lo sumamos a tu equipo
          y entra con su contraseña de siempre.
        </DocStep>
      </DocSteps>
      <DocFigure
        src="/docs-media/equipo-invitar.webp"
        alt="El diálogo Invitar miembro"
        width={784}
        height={769}
        className="max-w-md"
        markers={[{ x: 50, y: 72.7, label: "Administrador o agente. Ver «Roles» en Primeros pasos." }]}
      />
      <DocList>
        <li>
          Desde el menú ⋯ de cada persona podés cambiarle el rol, copiar su email, desactivar su acceso o quitarla del
          equipo.
        </li>
        <li>
          <strong>Desactivar el acceso</strong> le impide entrar pero conserva su lugar, sus propiedades y sus clientes; lo
          podés reactivar cuando quieras. Quienes no tienen acceso aparecen al final.
        </li>
        <li>
          <strong>Quitar del equipo</strong> le saca el acceso a esta agencia. Su cuenta no se borra: si pertenece a otra
          agencia, sigue entrando ahí.
        </li>
        <li>El propietario de la cuenta no se puede quitar ni cambiar de rol.</li>
      </DocList>
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
      <DocFigure
        src="/docs-media/configuracion.webp"
        alt="La página de Configuración"
        width={1304}
        height={1486}
        markers={[
          { x: 6.1, y: 16.8, label: "Tu logo y el nombre de la agencia." },
          { x: 30.4, y: 32.6, label: "La dirección de tu portal." },
          { x: 30.4, y: 39.1, label: "El email que recibe los avisos de consultas." },
          { x: 32.2, y: 51.8, label: "Si el propietario ve tu comisión. Se guarda al cambiarlo." },
          { x: 30.4, y: 67.6, label: "Idioma y moneda por defecto." },
          { x: 90.6, y: 3.4, label: "Guardar; al lado, atajos para copiar, ver y personalizar el portal." },
        ]}
      />
      <DocTerms
        items={[
          [
            "Tu agencia",
            "El nombre y el logo con los que te ven tus clientes. Tocá el logo para cambiarlo; se sube al momento.",
          ],
          [
            "Portal público",
            "La dirección de tu portal (solo minúsculas, números y guiones). Si la cambiás, el link anterior deja de funcionar: actualizalo donde lo hayas compartido. También el email de contacto, que recibe los avisos de consultas.",
          ],
          [
            "Portal del propietario",
            "«Mostrar la comisión de la agencia»: apagado, el propietario ve cuánto le corresponde pero no cuánto se descontó. Se guarda al cambiarlo, sin tocar Guardar.",
          ],
          [
            "Preferencias",
            "El idioma del portal (los links que compartís se abren en ese idioma, y tus clientes pueden cambiarlo desde la página) y la moneda por defecto de los precios.",
          ],
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
      <DocFigure
        src="/docs-media/perfil.webp"
        alt="La página Mi perfil"
        width={1304}
        height={1321}
        markers={[
          { x: 6.1, y: 18.9, label: "Tocá la foto para cambiarla; al lado, tu rol." },
          { x: 30.4, y: 30.1, label: "Tu nombre y email; se guardan con «Guardar», arriba." },
          { x: 30.4, y: 53, label: "Para cambiar la contraseña: la actual y la nueva, dos veces." },
        ]}
      />
      <DocList>
        <li>La foto se sube al momento; tu nombre se ve en el menú y en el historial de tus clientes.</li>
        <li>
          La contraseña nueva tiene que tener al menos 8 caracteres. El ojo de cada campo muestra lo que escribiste.
        </li>
        <li>
          El idioma del panel se cambia desde el menú de tu perfil, en «Idioma». Es personal: cada persona del equipo
          puede usar el suyo.
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
      title="Buscador, atajos y ayuda"
      intro="Para moverte por todo el panel sin soltar el teclado, y a quién recurrir si te trabás."
    >
      <DocH3>Buscador</DocH3>
      <DocP>
        <Kbd>Ctrl/⌘</Kbd> <Kbd>K</Kbd> abre un buscador que encuentra páginas, propiedades, ofertas y clientes por nombre.
        Desde ahí también podés crear una propiedad, oferta, cliente o reserva, invitar a alguien al equipo, abrir esta
        documentación, cambiar la apariencia, contraer el menú y cerrar sesión.
      </DocP>
      <DocFigure
        src="/docs-media/buscador.webp"
        alt="El buscador mostrando resultados al escribir «pérez»"
        width={960}
        height={347}
        className="max-w-lg"
        caption="Escribí parte de un nombre y elegí con las flechas y Enter. Esc lo cierra."
      />

      <DocH3>Atajos</DocH3>
      <DocP>
        <Kbd>?</Kbd> muestra todos los atajos en cualquier pantalla del panel.
      </DocP>
      <DocTerms
        items={[
          [<><Kbd>Ctrl/⌘</Kbd> <Kbd>K</Kbd></>, "Buscar y ejecutar comandos"],
          [<><Kbd>Ctrl/⌘</Kbd> <Kbd>S</Kbd></>, "Guardar el formulario abierto"],
          [<><Kbd>Ctrl/⌘</Kbd> <Kbd>B</Kbd></>, "Contraer o expandir el menú lateral"],
          [<Kbd key="q">?</Kbd>, "Ver todos los atajos"],
          [
            <><Kbd>G</Kbd> y una letra</>,
            "Ir a una sección: P propiedades, O ofertas, C clientes, I consultas, R reservas, D disponibilidad, E equipo, W portal, S configuración, M mi perfil",
          ],
          [<Kbd key="n">N</Kbd>, "Crear uno nuevo en la lista abierta"],
          [<Kbd key="s">/</Kbd>, "Ir al buscador de la lista"],
          [<Kbd key="f">F</Kbd>, "Abrir los filtros"],
          [<><Kbd>1</Kbd> <Kbd>2</Kbd> <Kbd>3</Kbd></>, "Vista cuadrícula, lista o tabla"],
          [<><Kbd>J</Kbd> <Kbd>K</Kbd></>, "Bajar y subir entre elementos; Enter abre el seleccionado"],
          [<Kbd key="e">Esc</Kbd>, "Limpiar la selección"],
        ]}
      />

      <DocH3>Ayuda y soporte</DocH3>
      <DocP>
        En el menú de tu perfil, <strong>Ayuda y soporte</strong> abre el centro de ayuda: preguntas frecuentes con
        buscador y un formulario para escribirle al equipo de Tivvo. Te respondemos por email.
      </DocP>
      <DocFigure
        src="/docs-media/ayuda.webp"
        alt="El centro de ayuda de Tivvo"
        width={1584}
        height={946}
        caption="Buscá tu duda; si no la encontrás, escribinos desde el formulario."
      />
    </DocSection>
  );
}

export const DOC_SECTIONS: DocEntry[] = [
  { id: "primeros-pasos", label: "Primeros pasos", Content: Basics },
  { id: "consultas", label: "Consultas", Content: Inquiries },
  { id: "clientes", label: "Clientes", Content: Clients },
  { id: "propiedades", label: "Propiedades", Content: Properties },
  { id: "propietarios", label: "Propietarios", Content: Owners },
  { id: "importar", label: "Importar propiedades", adminOnly: true, Content: Importer },
  { id: "ofertas", label: "Ofertas", Content: Offers },
  { id: "reservas", label: "Reservas", Content: Bookings },
  { id: "disponibilidad", label: "Disponibilidad", Content: Availability },
  { id: "servicios", label: "Servicios", Content: Services },
  { id: "portal", label: "Portal web", adminOnly: true, Content: Portal },
  { id: "lo-que-ven-tus-clientes", label: "Lo que ven tus clientes", Content: ClientPages },
  { id: "equipo", label: "Equipo", adminOnly: true, Content: Team },
  { id: "configuracion", label: "Configuración", adminOnly: true, Content: SettingsDoc },
  { id: "perfil", label: "Mi perfil", Content: Profile },
  { id: "atajos", label: "Buscador, atajos y ayuda", Content: Shortcuts },
];

/**
 * The help center's questions, grouped by what the person is trying to do
 * (not by screen). One list, three readers: the page, its search, and the
 * FAQPage structured data, which Google only accepts for answers a visitor can
 * read on the page.
 */

export interface HelpQuestion {
  q: string;
  a: string;
}

export interface HelpTopic {
  id: string;
  title: string;
  summary: string;
  questions: HelpQuestion[];
}

export const HELP_TOPICS: HelpTopic[] = [
  {
    id: "primeros-pasos",
    title: "Primeros pasos",
    summary: "Tu cuenta, tu equipo y cómo entrar.",
    questions: [
      {
        q: "¿Cómo creo mi cuenta y mi agencia?",
        a: "Desde «Registrarte» creás tu usuario y el nombre de tu agencia, y entrás al panel. La dirección de tu panel lleva el nombre de tu agencia.",
      },
      {
        q: "¿Cómo sumo a mi equipo?",
        a: "En Equipo agregás personas y les asignás un rol: propietario, administrador o agente. Solo propietarios y administradores ven esa sección.",
      },
      {
        q: "Olvidé mi contraseña, ¿qué hago?",
        a: "Desde la pantalla de ingreso usá la opción para recuperar la contraseña. Te enviamos un link por email para crear una nueva.",
      },
      {
        q: "¿Por qué se cerró mi sesión?",
        a: "Por seguridad, la sesión vence pasado un tiempo y hay que volver a ingresar. No se pierde nada de lo que ya guardaste.",
      },
    ],
  },
  {
    id: "propiedades",
    title: "Propiedades",
    summary: "Cargarlas, publicarlas y asignarlas.",
    questions: [
      {
        q: "¿Cómo cargo una propiedad?",
        a: "En Propiedades creás una nueva, completás los datos, subís las fotos (se reducen solas antes de subir) y la publicás cuando esté lista.",
      },
      {
        q: "¿Cómo asigno una propiedad a un agente?",
        a: "Propietarios y administradores pueden elegir el responsable de cada propiedad. Los agentes ven solo las que tienen asignadas.",
      },
      {
        q: "¿Se ve en mi sitio todo lo que cargo?",
        a: "Se muestran las propiedades que publicás. Lo que dejás sin publicar queda solo en el panel.",
      },
    ],
  },
  {
    id: "clientes-consultas",
    title: "Clientes y consultas",
    summary: "De la primera consulta al seguimiento.",
    questions: [
      {
        q: "¿Dónde llegan las consultas de mi sitio?",
        a: "A la bandeja de Consultas. Cada una crea un cliente (o reutiliza el que tenga ese email), deja una nota con la propiedad que miró y suma al contador del menú.",
      },
      {
        q: "¿Cómo me avisan de una consulta nueva?",
        a: "Por email a la agencia (al email de contacto o, si no hay, a propietarios y administradores) y con la campana del panel. El cliente recibe una confirmación.",
      },
      {
        q: "¿Cómo hago el seguimiento de un cliente?",
        a: "Dentro de cada cliente podés crear tareas con fecha y responsable. También podés ver a todos como tablero y arrastrarlos de una etapa a otra.",
      },
    ],
  },
  {
    id: "ofertas",
    title: "Ofertas",
    summary: "Armarlas, compartirlas y saber si las abrieron.",
    questions: [
      {
        q: "¿Cómo le mando una oferta a un cliente?",
        a: "Armás la oferta con una o varias propiedades, descuentos y servicios, y compartís el link. El cliente la ve sin necesidad de crear una cuenta.",
      },
      {
        q: "¿Cómo sé si abrieron mi oferta?",
        a: "La campana te avisa en cuanto la abren. En la oferta también ves cuándo la vieron y cuándo vence.",
      },
    ],
  },
  {
    id: "reservas-cobros",
    title: "Reservas y cobros",
    summary: "Fechas, pagos y lo que ve el cliente.",
    questions: [
      {
        q: "¿Qué ve el cliente de su reserva?",
        a: "Un link por email, que le llega al crear, confirmar o cancelar la reserva, con sus fechas, el total y el estado de los pagos. No muestra la comisión.",
      },
      {
        q: "¿Cómo registro un pago?",
        a: "En la reserva cargás el anticipo y el saldo con su estado. Ves lo cobrado, lo que falta y la comisión.",
      },
      {
        q: "¿Qué es una reserva pendiente?",
        a: "Una reserva sin confirmar. Aparece en el calendario para que la veas venir, pero todavía no bloquea las fechas.",
      },
    ],
  },
  {
    id: "disponibilidad",
    title: "Disponibilidad y tarifas",
    summary: "El calendario de tus alquileres temporarios.",
    questions: [
      {
        q: "¿Cómo bloqueo fechas?",
        a: "En Disponibilidad, vista mensual: elegí una propiedad y arrastrá sobre las noches libres. Las noches reservadas no se pueden tocar.",
      },
      {
        q: "¿Cómo cargo las tarifas por temporada?",
        a: "En cada propiedad definís períodos con su precio por noche. El total de la reserva se calcula con esos valores.",
      },
      {
        q: "¿Puedo ver solo las propiedades libres en unas fechas?",
        a: "Sí. En Disponibilidad elegís un rango de fechas y una ubicación, y te muestra solo las que están libres.",
      },
    ],
  },
  {
    id: "sitio-portales",
    title: "Sitio web y portales",
    summary: "Tu sitio público y los links para propietarios.",
    questions: [
      {
        q: "¿Cómo personalizo el sitio de mi agencia?",
        a: "En Portal elegís la plantilla, los colores, las tipografías y los bloques, y ves cómo queda en computadora, tableta y celular antes de publicar.",
      },
      {
        q: "¿Puedo usar mi propio dominio?",
        a: "Por ahora no. Tu sitio vive en un subdominio de Tivvo con el nombre de tu agencia.",
      },
      {
        q: "¿Qué ve el propietario en su portal?",
        a: "Sus propiedades, reservas y pagos, con lo cobrado, las liquidaciones y el saldo. La comisión queda oculta salvo que la muestres desde Configuración.",
      },
    ],
  },
  {
    id: "cuenta-datos",
    title: "Cuenta y datos",
    summary: "Quién ve qué y cómo cuidamos tu información.",
    questions: [
      {
        q: "¿Mis datos se mezclan con los de otras agencias?",
        a: "No. Cada agencia trabaja en su propio espacio y solo su equipo ve sus propiedades, clientes y reservas.",
      },
      {
        q: "¿Qué ve cada persona de mi equipo?",
        a: "Los agentes ven sus propiedades, ofertas y reservas, sus clientes y las consultas sin asignar. Propietarios y administradores ven todo y reasignan.",
      },
      {
        q: "¿Cómo ejerzo mis derechos sobre mis datos?",
        a: "Está explicado en la Política de privacidad, junto con el email al que escribirnos.",
      },
    ],
  },
];

/** Questions people ask most, shown before they type anything. */
export const POPULAR_SEARCHES = [
  "consultas",
  "oferta",
  "reserva",
  "tarifas",
  "portal del propietario",
  "equipo",
];

/** Lowercase and strip accents, so "reserva" finds "Reservá" and vice versa. */
export function normalize(text: string) {
  return text.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
}

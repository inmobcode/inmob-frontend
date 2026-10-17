/**
 * The copy behind the landing's plans and FAQ. It lives apart from the section
 * that paints it because the page also publishes it as structured data, and
 * Google only accepts an answer in schema.org that the visitor can read on the
 * page: one list, two readers.
 */

export interface Plan {
  name: string;
  price: string;
  period?: string;
  tagline: string;
  features: string[];
  cta: string;
  href: string;
  highlight?: boolean;
  /** What `price` means in numbers, for structured data. Left out when it's "Hablemos". */
  amount?: { value: number; currency: string };
}

export const PLANS: Plan[] = [
  {
    name: "Free",
    price: "Gratis",
    tagline: "Para arrancar y probar el sistema con pocas propiedades.",
    features: [
      "Hasta 5 propiedades",
      "1 usuario",
      "Clientes, consultas y ofertas",
      "Sitio con subdominio Tivvo, plantilla Portada y tu color",
    ],
    cta: "Empezar gratis",
    href: "/register",
    amount: { value: 0, currency: "USD" },
  },
  {
    name: "Pro",
    price: "USD 29,99",
    period: "/mes",
    tagline: "Para agencias que venden y alquilan todos los días.",
    features: [
      "Propiedades y equipo ilimitados",
      "Reservas, disponibilidad y tarifas por temporada",
      "Cobros y estado de cuenta del propietario",
      "Editor completo del sitio: 5 plantillas, 8 tipografías y 6 tipos de bloque",
      "Tareas, notificaciones y roles por equipo",
    ],
    cta: "Pedir una demo",
    href: "#demo",
    highlight: true,
    amount: { value: 29.99, currency: "USD" },
  },
  {
    name: "Enterprise",
    price: "Hablemos",
    tagline: "Para redes de agencias o equipos grandes.",
    features: [
      "Todo lo de Pro",
      "Múltiples sucursales",
      "Soporte prioritario",
      "Permisos avanzados por rol",
    ],
    cta: "Contactar ventas",
    href: "#demo",
  },
];

export const FAQ = [
  {
    q: "¿Sirve para ventas y alquileres a la vez?",
    a: "Sí. Las dos operaciones conviven en el mismo sistema: las ventas con ofertas y comisión, y los alquileres temporarios con disponibilidad, tarifas por temporada, reservas con fechas y pagos.",
  },
  {
    q: "¿Cuánto tarda la migración?",
    a: "Depende de cuántos datos tengas y en qué formato estén. En la demo lo vemos con tu caso y te damos una fecha concreta.",
  },
  {
    q: "¿Cómo es la dirección de mi sitio?",
    a: "Tu sitio vive en un subdominio de Tivvo con el nombre de tu agencia. Por ahora no ofrecemos dominio propio.",
  },
  {
    q: "¿Mis datos se mezclan con los de otras agencias?",
    a: "No. Cada agencia trabaja en su propio espacio y solo su equipo puede ver sus propiedades, clientes y reservas.",
  },
  {
    q: "¿Cuántos usuarios puedo tener?",
    a: "En el plan Free, uno. En Pro y Enterprise no hay límite: suma a todo tu equipo.",
  },
  {
    q: "¿Puedo personalizar el sitio de mi agencia?",
    a: "Sí. Elegís una plantilla, los colores y las tipografías, y sumás bloques propios como ubicación, promociones, propiedades destacadas, destinos, texto y llamados a la acción. Ves el resultado en pantalla de computadora, tableta y celular antes de publicar.",
  },
  {
    q: "¿Qué ve cada persona de mi equipo?",
    a: "Los agentes ven sus propiedades, sus clientes, sus ofertas y sus reservas, además de las consultas sin asignar. Propietarios y administradores ven todo y pueden reasignar.",
  },
  {
    q: "¿Qué ve el propietario en su portal?",
    a: "Sus propiedades, reservas y pagos, con lo cobrado, las liquidaciones y el saldo. La comisión de la agencia queda oculta salvo que decidas mostrarla.",
  },
];

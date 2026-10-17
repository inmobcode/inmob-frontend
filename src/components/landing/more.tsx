import {
  Bell,
  CalendarCheck,
  Inbox,
  KanbanSquare,
  ListChecks,
  Sparkles,
} from "lucide-react";

import { SECTION, WRAP } from "@/components/landing/layout";
import { Heading } from "@/components/landing/sections";
import { cn } from "@/lib/utils";

const EXTRAS = [
  {
    icon: Inbox,
    title: "Bandeja de consultas",
    text: "Nuevas y leídas, con un contador en el menú. Cada consulta crea o reutiliza al cliente y deja una nota con la propiedad.",
  },
  {
    icon: KanbanSquare,
    title: "Clientes en tablero",
    text: "Arrastrás cada cliente por etapa, o los ves en lista. Como prefiera cada uno.",
  },
  {
    icon: ListChecks,
    title: "Tareas de seguimiento",
    text: "Un recordatorio con fecha y responsable dentro de cada cliente, para que nadie quede sin respuesta.",
  },
  {
    icon: Bell,
    title: "Notificaciones",
    text: "Una campana avisa cuando entra una consulta, abren una oferta, se registra un pago o te asignan una tarea.",
  },
  {
    icon: Sparkles,
    title: "Servicios extra",
    text: "Chef, yate, traslados, excursiones, spa. Armás tu biblioteca con precio por persona, día, noche u hora y los sumás a la oferta.",
  },
  {
    icon: CalendarCheck,
    title: "Reservas pendientes",
    text: "Una reserva sin confirmar aparece en el calendario, aunque todavía no bloquea las fechas. La ves venir antes de decidir.",
  },
];

export function More() {
  return (
    <section
      id="y-ademas"
      aria-labelledby="y-ademas-titulo"
      className="scroll-mt-16 border-b border-line"
    >
      <div className={cn(WRAP, SECTION, "flex flex-col gap-14")}>
        <Heading
          id="y-ademas-titulo"
          claim="Y todo lo del día a día."
          rest="Los detalles que hacen que el equipo lo use de verdad."
          className="max-w-3xl"
        />
        <ul className="grid gap-x-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-10">
          {EXTRAS.map((item) => (
            <li
              key={item.title}
              className="flex flex-col gap-3 border-t border-line py-8"
            >
              <item.icon className="size-5 text-forest" aria-hidden />
              <h3 className="font-logo text-lg font-semibold">{item.title}</h3>
              <p className="text-base leading-snug text-pretty text-quiet">
                {item.text}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

import { Building2, CalendarCheck, FileText } from "lucide-react";
import Link from "next/link";

const POINTS = [
  { icon: Building2, text: "Propiedades, clientes y reservas en un solo lugar" },
  { icon: FileText, text: "Ofertas con link que ves cuándo abren" },
  { icon: CalendarCheck, text: "Cobros y comisiones siempre a la vista" },
];

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-svh flex-1 bg-background lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
      <div className="flex flex-col px-6 py-8 sm:px-12 lg:px-16">
        <Link href="/" className="w-fit font-display text-2xl leading-none tracking-tight outline-none focus-visible:underline">
          Inmobiliario
        </Link>
        <div className="flex flex-1 items-center justify-center py-10">
          <div className="w-full max-w-sm">{children}</div>
        </div>
      </div>

      <aside className="relative hidden p-4 lg:block">
        <div className="relative flex h-full flex-col justify-between overflow-hidden rounded-[2.5rem] bg-primary p-14 text-primary-foreground">
          {/* Photo: Pixasquare on Unsplash. The forest-green wash ties it to the palette and keeps the text readable. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://images.unsplash.com/photo-1523217582562-09d0def993a6?auto=format&fit=crop&w=1600&q=75"
            alt=""
            className="absolute inset-0 size-full object-cover object-[35%_60%]"
          />
          <div aria-hidden className="absolute inset-0 bg-primary/15 mix-blend-multiply" />
          <div
            aria-hidden
            className="absolute inset-0 bg-gradient-to-b from-primary/55 via-transparent to-primary/80"
          />
          <span className="relative inline-flex h-8 w-fit items-center rounded-full bg-primary-foreground/15 px-3.5 text-sm font-medium">
            Para inmobiliarias que ya crecieron
          </span>
          <div className="relative flex flex-col gap-10">
            <p className="max-w-lg font-display text-6xl leading-[1.02] tracking-tight text-balance">
              Toda tu inmobiliaria, bajo control.
            </p>
            <ul className="flex flex-col gap-4">
              {POINTS.map((point) => (
                <li key={point.text} className="flex items-center gap-3.5 text-lg text-primary-foreground/80">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary-foreground/15">
                    <point.icon className="size-5" />
                  </span>
                  {point.text}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </aside>
    </div>
  );
}

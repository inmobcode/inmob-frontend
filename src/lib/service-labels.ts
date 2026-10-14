import {
  Anchor,
  Baby,
  Car,
  ChefHat,
  ConciergeBell,
  Mountain,
  PartyPopper,
  Plane,
  Sparkles,
  SprayCan,
  type LucideIcon,
} from "lucide-react";

import type { ServiceType, ServiceUnit } from "@/lib/api/services";

export const SERVICE_TYPES: { value: ServiceType; label: string; icon: LucideIcon }[] = [
  { value: "BUTLER", label: "Mayordomo", icon: ConciergeBell },
  { value: "CHEF", label: "Chef privado", icon: ChefHat },
  { value: "YACHT", label: "Yate y barcos", icon: Anchor },
  { value: "TRANSFER", label: "Traslados", icon: Plane },
  { value: "CAR", label: "Alquiler de auto", icon: Car },
  { value: "EXCURSION", label: "Excursiones", icon: Mountain },
  { value: "SPA", label: "Spa y bienestar", icon: Sparkles },
  { value: "BABYSITTER", label: "Niñera", icon: Baby },
  { value: "HOUSEKEEPING", label: "Limpieza extra", icon: SprayCan },
  { value: "EVENT", label: "Eventos", icon: PartyPopper },
  { value: "OTHER", label: "Otro", icon: Sparkles },
];

export const SERVICE_TYPE_LABELS = Object.fromEntries(SERVICE_TYPES.map((type) => [type.value, type.label])) as Record<
  ServiceType,
  string
>;

export function serviceTypeIcon(type: ServiceType): LucideIcon {
  return SERVICE_TYPES.find((entry) => entry.value === type)?.icon ?? Sparkles;
}

export const SERVICE_UNITS: { value: ServiceUnit; label: string; per: string }[] = [
  { value: "SERVICE", label: "Por servicio", per: "" },
  { value: "PERSON", label: "Por persona", per: "por persona" },
  { value: "DAY", label: "Por día", per: "por día" },
  { value: "NIGHT", label: "Por noche", per: "por noche" },
  { value: "HOUR", label: "Por hora", per: "por hora" },
];

/** "por día", or "" for a one-off price. */
export function unitPer(unit: ServiceUnit) {
  return SERVICE_UNITS.find((entry) => entry.value === unit)?.per ?? "";
}

/** The quantity's word: 3 días, 2 personas… */
export function unitCount(unit: ServiceUnit, quantity: number) {
  const words: Record<ServiceUnit, [string, string]> = {
    SERVICE: ["vez", "veces"],
    PERSON: ["persona", "personas"],
    DAY: ["día", "días"],
    NIGHT: ["noche", "noches"],
    HOUR: ["hora", "horas"],
  };
  const [one, many] = words[unit];
  return `${quantity} ${quantity === 1 ? one : many}`;
}

export function formatMoney(currency: string, value: number) {
  return `${currency} ${value.toLocaleString("es-AR", { maximumFractionDigits: 0 })}`;
}

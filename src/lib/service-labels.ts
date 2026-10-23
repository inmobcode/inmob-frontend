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

// Their names live in the "labels.serviceType" / "labels.serviceUnit" messages: see useLabels().
export const SERVICE_TYPES: { value: ServiceType; icon: LucideIcon }[] = [
  { value: "BUTLER", icon: ConciergeBell },
  { value: "CHEF", icon: ChefHat },
  { value: "YACHT", icon: Anchor },
  { value: "TRANSFER", icon: Plane },
  { value: "CAR", icon: Car },
  { value: "EXCURSION", icon: Mountain },
  { value: "SPA", icon: Sparkles },
  { value: "BABYSITTER", icon: Baby },
  { value: "HOUSEKEEPING", icon: SprayCan },
  { value: "EVENT", icon: PartyPopper },
  { value: "OTHER", icon: Sparkles },
];

export function serviceTypeIcon(type: ServiceType): LucideIcon {
  return SERVICE_TYPES.find((entry) => entry.value === type)?.icon ?? Sparkles;
}

export const SERVICE_UNITS: ServiceUnit[] = ["SERVICE", "PERSON", "DAY", "NIGHT", "HOUR"];

import { createElement } from "react";

import type { ServiceType } from "@/lib/api/services";
import { serviceTypeIcon } from "@/lib/service-labels";

/** The icon of a service type (chef hat, anchor…). */
export function ServiceTypeIcon({
  type,
  className,
  strokeWidth,
}: {
  type: ServiceType;
  className?: string;
  strokeWidth?: number;
}) {
  return createElement(serviceTypeIcon(type), { className, strokeWidth, "aria-hidden": true });
}

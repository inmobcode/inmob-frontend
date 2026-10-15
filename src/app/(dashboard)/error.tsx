"use client";

import { ErrorScreen } from "@/components/shared/error-screen";

export default function DashboardError(props: { error: Error & { digest?: string }; reset: () => void }) {
  return <ErrorScreen {...props} homeHref="/login" />;
}

"use client";

import { ErrorScreen } from "@/components/shared/error-screen";

export default function PublicError(props: { error: Error & { digest?: string }; reset: () => void }) {
  return <ErrorScreen {...props} />;
}

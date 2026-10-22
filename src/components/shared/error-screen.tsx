"use client";

import { useEffect } from "react";

import { StatusAction, StatusButton, StatusScreen } from "./status-screen";

/** Shared body of every `error.tsx` boundary. */
export function ErrorScreen({
  error,
  reset,
  homeHref = "/",
  compact = false,
}: {
  error: Error & { digest?: string };
  reset: () => void;
  homeHref?: string;
  compact?: boolean;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <StatusScreen
      code="500"
      compact={compact}
      title="Algo salió mal de nuestro lado."
      tail="Probá de nuevo; si sigue igual, escribinos."
      actions={
        <>
          <StatusAction onClick={reset}>Reintentar</StatusAction>
          <StatusButton href={homeHref}>Ir al inicio</StatusButton>
        </>
      }
    />
  );
}

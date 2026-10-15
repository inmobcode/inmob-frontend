"use client";

import { useEffect } from "react";

import { StatusAction, StatusButton, StatusScreen } from "./status-screen";

/** Shared body of every `error.tsx` boundary. */
export function ErrorScreen({
  error,
  reset,
  homeHref = "/",
}: {
  error: Error & { digest?: string };
  reset: () => void;
  homeHref?: string;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <StatusScreen
      title="Algo salió mal"
      description="Ocurrió un error inesperado al cargar esta pantalla. Podés reintentar o volver al inicio."
      actions={
        <>
          <StatusAction onClick={reset}>Reintentar</StatusAction>
          <StatusButton href={homeHref}>Ir al inicio</StatusButton>
        </>
      }
    />
  );
}

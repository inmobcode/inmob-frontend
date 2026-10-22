"use client";

// Last resort: only renders if the root layout itself fails, so it can't use app styles or providers.
export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="es">
      <body style={{ fontFamily: "system-ui, sans-serif", textAlign: "center", padding: "4rem 1.5rem" }}>
        <h1>Algo salió mal</h1>
        <p>Ocurrió un error inesperado. Probá recargar la página.</p>
        <button type="button" onClick={reset}>
          Reintentar
        </button>
      </body>
    </html>
  );
}

"use client";

// Last resort: only renders if a root layout itself fails, so it can't use app
// styles, providers or the translation files. Its few words live here.
const TEXT = {
  es: ["Algo salió mal", "Ocurrió un error inesperado. Probá recargar la página.", "Reintentar"],
  en: ["Something went wrong", "An unexpected error occurred. Try reloading the page.", "Try again"],
  pt: ["Algo correu mal", "Ocorreu um erro inesperado. Experimente recarregar a página.", "Tentar novamente"],
  fr: ["Une erreur est survenue", "Une erreur inattendue s'est produite. Essayez de recharger la page.", "Réessayer"],
  de: ["Etwas ist schiefgelaufen", "Ein unerwarteter Fehler ist aufgetreten. Lade die Seite neu.", "Erneut versuchen"],
  it: ["Qualcosa è andato storto", "Si è verificato un errore imprevisto. Prova a ricaricare la pagina.", "Riprova"],
  el: ["Κάτι πήγε στραβά", "Παρουσιάστηκε ένα απρόσμενο σφάλμα. Δοκιμάστε να φορτώσετε ξανά τη σελίδα.", "Δοκιμάστε ξανά"],
  hr: ["Nešto je pošlo po zlu", "Došlo je do neočekivane pogreške. Pokušajte ponovno učitati stranicu.", "Pokušaj ponovno"],
} as const;

function pick(): keyof typeof TEXT {
  if (typeof document === "undefined") return "es";
  const fromPath = window.location.pathname.split("/")[1];
  if (fromPath in TEXT) return fromPath as keyof typeof TEXT;
  const fromCookie = document.cookie.match(/(?:^|; )NEXT_LOCALE=([^;]*)/)?.[1];
  if (fromCookie && fromCookie in TEXT) return fromCookie as keyof typeof TEXT;
  const fromBrowser = navigator.language.slice(0, 2);
  return fromBrowser in TEXT ? (fromBrowser as keyof typeof TEXT) : "es";
}

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const lang = pick();
  const [title, body, retry] = TEXT[lang];
  return (
    <html lang={lang}>
      <body style={{ fontFamily: "system-ui, sans-serif", textAlign: "center", padding: "4rem 1.5rem" }}>
        <h1>{title}</h1>
        <p>{body}</p>
        <button type="button" onClick={reset}>
          {retry}
        </button>
      </body>
    </html>
  );
}

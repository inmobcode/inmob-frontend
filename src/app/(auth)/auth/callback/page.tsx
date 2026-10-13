"use client";

import { LoaderCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { AuthHeading } from "@/components/auth/form-parts";
import type { AuthResponse } from "@/lib/api/auth";
import { consumeNext } from "@/lib/auth/oauth";
import { setSession } from "@/lib/auth/session";

// The API sends the person back here after Google or Apple, with the session in
// the URL fragment (`#accessToken=…&refreshToken=…&user=<base64 JSON>`) or a
// failure in the query (`?error=…`). The fragment never reaches any server.
function readAuth(): { auth: AuthResponse } | { error: string } {
  const query = new URLSearchParams(window.location.search);
  const failure = query.get("error");
  if (failure) return { error: failure };

  const fragment = new URLSearchParams(window.location.hash.slice(1));
  const accessToken = fragment.get("accessToken");
  const refreshToken = fragment.get("refreshToken");
  const encoded = fragment.get("user");
  if (!accessToken || !refreshToken || !encoded)
    return { error: "No recibimos los datos de tu cuenta." };

  try {
    const bytes = Uint8Array.from(
      window.atob(encoded.replace(/-/g, "+").replace(/_/g, "/")),
      (char) => char.charCodeAt(0),
    );
    const user = JSON.parse(new TextDecoder().decode(bytes));
    return { auth: { accessToken, refreshToken, user } };
  } catch {
    return { error: "No pudimos leer los datos de tu cuenta." };
  }
}

export default function OAuthCallbackPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const result = readAuth();
    if ("error" in result) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setError(result.error);
      return;
    }
    setSession(result.auth);
    // Take the tokens out of the address bar before moving on.
    window.history.replaceState(null, "", window.location.pathname);
    router.replace(consumeNext());
  }, [router]);

  if (error) {
    return (
      <div className="flex flex-col items-start gap-6">
        <AuthHeading title="No pudimos ingresarte" text={error} />
        <Link
          href="/login"
          className="inline-flex h-12 items-center rounded-lg bg-forest px-6 font-semibold text-paper outline-none transition-colors hover:bg-forest-deep focus-visible:ring-2 focus-visible:ring-forest focus-visible:ring-offset-2"
        >
          Volver a intentar
        </Link>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 text-quiet" role="status">
      <LoaderCircle className="size-5 animate-spin" />
      Ingresando a tu cuenta…
    </div>
  );
}

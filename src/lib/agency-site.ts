import { useQuery } from "@tanstack/react-query";

import { DEFAULT_LOCALE, isLocale, localePath, type Locale } from "@/i18n/config";
import { getAgency } from "@/lib/api/agency";
import { getAccessToken } from "@/lib/auth/session";

/** The language the agency picked for its site (Configuración → Idioma), Spanish if none. */
export function siteLocaleOf(agency: { locale?: string | null } | null | undefined): Locale {
  return isLocale(agency?.locale) ? agency.locale : DEFAULT_LOCALE;
}

/**
 * Builds links to the agency's public site in the language it picked, so what
 * the dashboard shares ("Copiar link del portal") opens in that language.
 */
export function useAgencySitePath() {
  const { data: agency } = useQuery({
    queryKey: ["agency"],
    queryFn: () => {
      const token = getAccessToken();
      if (!token) throw new Error("No autenticado");
      return getAgency(token);
    },
    staleTime: 5 * 60_000,
  });
  const locale = siteLocaleOf(agency);
  return (path: string) => localePath(locale, path);
}

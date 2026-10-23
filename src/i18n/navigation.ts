import { createNavigation } from "next-intl/navigation";

import { routing } from "./routing";

/**
 * Link, redirect and router for the public site (landing, legal pages, agency
 * sites): they add the language prefix on their own. The dashboard keeps using
 * next/link, since its URLs never carry one.
 */
export const { Link, redirect, usePathname, useRouter, getPathname } = createNavigation(routing);

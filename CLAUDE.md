# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Next.js no estándar

`AGENTS.md` advierte que esta versión de Next.js (16.x, React 19) tiene cambios incompatibles respecto a lo conocido. Antes de escribir código, lee la guía relevante en `node_modules/next/dist/docs/` (`01-app` es la que aplica; el proyecto usa App Router). Ejemplo: el antiguo `middleware.ts` ahora es `src/proxy.ts` y exporta una función `proxy`.

## Comandos

- `npm run dev` — servidor de desarrollo (http://localhost:3000)
- `npm run build` / `npm run start` — build y servidor de producción
- `npm run lint` — ESLint (`eslint-config-next`)
- No hay framework de tests configurado.

Requiere `NEXT_PUBLIC_API_URL` en `.env` (por defecto `http://127.0.0.1:5000`; se usa 127.0.0.1 y no `localhost` porque en macOS AirPlay Receiver ocupa el puerto 5000 en IPv6).

## Arquitectura

Frontend de una plataforma inmobiliaria (propiedades, ofertas, clientes, reservas, equipo) que consume una API Flask separada. UI en español. El navegador habla directamente con la API; no hay BFF.

**Grupos de rutas (`src/app`)**
- `(auth)` — `/login`, `/register`
- `(dashboard)` — área protegida: `properties`, `offers`, `clients`, `inquiries`, `bookings`, `team`, `settings` (con rutas `[id]`). Su layout monta `DashboardSidebar` y `ActionBar`.
- `(public)` — páginas públicas: el sitio de cada agencia en `/page/[agencySlug]` y `/page/[agencySlug]/properties/[propertySlug]`, más `/offer/[token]` y `/owner/[token]`.

**Sitio público de cada agencia**
- Es de la agencia, no de Tivvo: base neutra (scope `.site` en `globals.css`, utilidades `bg-site-*`, `text-site-*`, `border-site-*`) y personalización por agencia guardada en `agency.site` (backend: `PATCH /api/agency/site`, `POST /api/agency/cover`).
- `lib/site-theme.ts` define plantillas (`portada`, `editorial`, `compacto`), colores, tipografías y los valores por defecto (`resolveSite`); `siteThemeStyle` los pasa como variables CSS.
- Bloques propios en `site.sections`: `location`, `promo`, `featured`, `destinations`, `text` y `cta`, cada uno con sus diseños (`layout`; ver `SECTION_TYPES` en `lib/site-theme.ts`). Se renderizan en `components/public/portal-sections.tsx` entre la portada y el listado; las imágenes se suben con `POST /api/agency/site-image`.
- El editor está en `/portal` (entrada propia en el sidebar), en el grupo `(editor)`: pantalla completa sin el sidebar del dashboard, código en `components/portal-editor/`; su vista previa renderiza `AgencyPortal` dentro de un iframe del mismo origen para que los breakpoints respondan al ancho simulado.

**Autenticación**
- `lib/auth/session.ts` guarda el par JWT y el usuario en cookies **no httpOnly** (`access_token`, `refresh_token`, `tivvo_user`), para que `src/proxy.ts` pueda leer `access_token` en el servidor. Si falta, redirige a `/login?next=...`.
- Al añadir una nueva sección del dashboard hay que actualizar **dos veces** `DASHBOARD_PREFIXES` y `config.matcher` en `src/proxy.ts`.
- El proxy solo comprueba que exista la cookie; no valida el token.

**Consultas**
- Las consultas del portal, de las fichas y de las ofertas crean (o reutilizan por email) un cliente, una nota en su historial que nombra la propiedad u oferta, y un registro en `inquiries`. Se listan en `/inquiries` (bandeja con nuevas y leídas, `read_at`); el sidebar muestra cuántas hay sin leer.
- El backend avisa a la agencia por email (al email de contacto o, si no hay, a propietarios y administradores) y confirma al cliente, vía Resend (`RESEND_API_KEY`, `EMAIL_FROM`, `FRONTEND_URL` en el `.env` del backend). Sin clave, los emails solo se registran en el log.

**Capa de API (`src/lib/api`)**
- `client.ts` expone `apiFetch<T>(path, { token })`: añade `Authorization: Bearer`, fuerza `Content-Type: application/json` salvo con `FormData` (subida de archivos), lanza `ApiError(message, status)` y devuelve `undefined` en 204.
- Un módulo por dominio (`properties`, `offers`, `clients`, `bookings`, `pools`, `availability`, `rate-periods`, `recommendations`, `team`, `auth`) que contiene los tipos del dominio y las funciones de llamada. El token se pasa explícitamente desde `getAccessToken()`.
- Datos de servidor vía TanStack Query (`lib/query-provider.tsx`).

**Estado y formularios**
- `lib/store/action-bar-store.ts` (Zustand): las páginas de formulario (editores de propiedad/oferta) registran `onSave/onPublish/onCancel`, y el `ActionBar` del layout del dashboard renderiza los botones. Hay que llamar a `reset()` al desmontar.
- Formularios con react-hook-form + zod (`@hookform/resolvers`).
- Catálogos y etiquetas de propiedades en `lib/property-catalogs.ts` y `lib/properties-labels.ts`; compresión de imágenes antes de subir en `lib/image-compression.ts`.

**UI**
- shadcn/ui (estilo `radix-nova`, icon library lucide) en `src/components/ui`; añadir componentes con la CLI de `shadcn`. Alias `@/components`, `@/lib`, `@/hooks`.
- Tailwind v4 (configuración en `src/app/globals.css`, sin `tailwind.config`), `next-themes` para modo oscuro, `sonner` para toasts.
- Componentes de feature agrupados por dominio en `src/components/{clients,offers,bookings,properties,team,dashboard,public}`.
- Alias de importación: `@/*` → `src/*`.

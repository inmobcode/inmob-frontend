# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Next.js no estándar

`AGENTS.md` advierte que esta versión de Next.js (16.x, React 19) tiene cambios incompatibles respecto a lo conocido. Antes de escribir código, lee la guía relevante en `node_modules/next/dist/docs/` (`01-app` es la que aplica; el proyecto usa App Router). Ejemplo: el antiguo `middleware.ts` ahora es `src/proxy.ts` y exporta una función `proxy`.

## Comandos

- `npm run dev` — servidor de desarrollo (http://localhost:3000)
- `npm run build` / `npm run start` — build y servidor de producción
- `npm run lint` — ESLint (`eslint-config-next`); `public/` está ignorado (copia vendida del worker de maplibre)
- `npm run typecheck` — `next typegen && tsc --noEmit` (los tipos de rutas se generan; sin typegen falla `LayoutProps`)
- `npm test` — Vitest sobre `src/**/*.test.ts` (lógica pura de `lib/`: filtros, tema del sitio, rich text, claims del token…)
- CI en `.github/workflows/ci.yml`: lint + typecheck + test + build en cada push/PR. Dependabot semanal.

Requiere `NEXT_PUBLIC_API_URL` en `.env` (por defecto `http://127.0.0.1:5000`; se usa 127.0.0.1 y no `localhost` porque en macOS AirPlay Receiver ocupa el puerto 5000 en IPv6).

## Arquitectura

Frontend de una plataforma inmobiliaria (propiedades, ofertas, clientes, reservas, equipo) que consume una API Flask separada. UI en español. El navegador habla directamente con la API; no hay BFF.

**Grupos de rutas (`src/app`)**
- `(auth)` — `/login`, `/register`, `/forgot-password`, `/reset-password`, `/auth/callback`
- `(dashboard)/[agencySlug]/…` — área protegida, **con el slug de la agencia en la URL**. La raíz `/[agencySlug]` redirige a `properties`. Secciones: `properties`, `offers`, `clients`, `inquiries`, `bookings`, `services`, `team`, `settings`, `profile` (con rutas `[id]` y `trash` donde aplica). Su layout monta `DashboardSidebar`, `ActionBar` y `Shortcuts`.
- `(editor)/[agencySlug]/portal` — editor del sitio, pantalla completa sin sidebar.
- `(docs)/docs` — documentación del panel (requiere sesión); capturas en `public/docs-media`.
- `(legal)` — `/terms`, `/privacy` y `/help`. Términos y privacidad usan `components/legal/legal-document.tsx` (cabecera en bloque bosque, índice con sección activa, `brief` «En corto» opcional por sección, `action` opcional) y `legal-table.tsx` para tablas (plazos, proveedores, cookies, derechos). Datos de la empresa en `lib/legal.ts`.
- `(public)` — el sitio de cada agencia en `/page/[agencySlug]` y `/page/[agencySlug]/properties/[propertySlug]`, más `/offer/[token]`, `/owner/[token]` y `/booking/[token]` (la reserva vista por el cliente: sin comisión; el backend le manda el link por email al crear, confirmar o cancelar).
- `/` es la landing de marketing (maqueta de concepto) y `/landing-test` el marketplace en prueba. Además: `robots.ts`, `sitemap.ts`, `llms.txt`, `opengraph-image.tsx`, `lib/seo.ts`.
- `error.tsx` / `not-found.tsx` / `global-error.tsx` en la raíz, y `error.tsx` + `loading.tsx` en `(dashboard)` y `(public)`; comparten `components/shared/{status-screen,error-screen}.tsx`.

**Proxy (`src/proxy.ts`)**
- Dos hosts: el apex sirve landing, `(public)` y `(legal)`; `app.` sirve auth, dashboard, editor y docs. Una ruta de app pedida en el apex se redirige (308) a `app.<host>`, y `/` en `app.` va a `/login`.
- En rutas del dashboard lee el slug del claim `agency_slug` del `access_token` (sin verificar la firma) y, si la URL trae otro, corrige la URL.
- Archivos generados (`robots.txt`, `sitemap.xml`, `llms.txt`, `opengraph-image`) están excluidos del `matcher`; si se añade otro, excluirlo también o el proxy lo trata como ruta de app.

**Sitio público de cada agencia**
- Es de la agencia, no de Tivvo: base neutra (scope `.site` en `globals.css`, utilidades `bg-site-*`, `text-site-*`, `border-site-*`) y personalización por agencia guardada en `agency.site` (backend: `PATCH /api/agency/site`, `POST /api/agency/cover`).
- `lib/site-theme.ts` define plantillas (`portada`, `editorial`, `compacto`), colores, tipografías y los valores por defecto (`resolveSite`); `siteThemeStyle` los pasa como variables CSS.
- Bloques propios en `site.sections`: `location`, `promo`, `featured`, `destinations`, `text` y `cta`, cada uno con sus diseños (`layout`; ver `SECTION_TYPES` en `lib/site-theme.ts`). Se renderizan en `components/public/portal-sections.tsx` entre la portada y el listado; las imágenes se suben con `POST /api/agency/site-image`.
- Las lecturas públicas del sitio (`getPublicAgency`, `listPublicProperties`, `getPublicProperty`) se cachean en Next 5 min con la etiqueta `site:<slug>` (`lib/site-cache.ts`). Toda mutación del dashboard la expira vía `POST /api/site-cache` (desde el `MutationCache` de `lib/query-provider.tsx`); los links por token (oferta, reserva, propietario) no se cachean.
- El editor está en `/portal` (entrada propia en el sidebar), en el grupo `(editor)`: pantalla completa sin el sidebar del dashboard, código en `components/portal-editor/`; su vista previa renderiza `AgencyPortal` dentro de un iframe del mismo origen para que los breakpoints respondan al ancho simulado.

**Autenticación**
- `lib/auth/session.ts` guarda el par JWT y el usuario en cookies **no httpOnly** (`access_token`, `refresh_token`, `tivvo_user`), para que `src/proxy.ts` pueda leer `access_token` en el servidor. Si falta, redirige a `/login?next=...`.
- Al añadir una nueva sección del dashboard hay que agregarla a `DASHBOARD_SECTIONS` en `src/proxy.ts` (y, si no cuelga de `[agencySlug]`, a `UNSCOPED_APP_PREFIXES`/`APP_ONLY_PREFIXES`).
- El proxy solo comprueba que exista la cookie; no valida el token (la API sí). El refresh token se guarda pero no se usa: al vencer el access token, `SessionWatcher` cierra la sesión.

**Tareas, notificaciones y roles**
- Disponibilidad (`/availability`): grilla de 90 días y vista **Mensual** (`components/availability/availability-month-view.tsx`: ocupación por día, y con una propiedad elegida se arrastra sobre las noches libres para bloquearlas). El calendario viene de `GET /api/properties/calendar?from=&days=`; la lógica de noches vs. días bloqueados está en `lib/availability-range.ts` (un día está ocupado de check-in a check-out, y una noche se ocupa cuando ese día y el siguiente están bloqueados).
- Estado de cuenta del propietario: `components/owners/owner-account.tsx` (en la pestaña Propietario de la propiedad: cobrado, comisión, lo que le corresponde, liquidaciones y saldo, con formulario para registrar liquidaciones; solo OWNER/ADMIN) y `owner-statement.tsx` (la misma vista en el portal público `/owner/[token]`). La comisión se descuenta de lo cobrado; el portal la oculta salvo que la agencia active «Mostrar la comisión» en Configuración (`ownerPortalShowsCommission`). Datos de `GET /api/owner-accounts/<ownerId>` y `POST .../payouts`.
- Tareas de seguimiento (`lib/api/tasks.ts`, `components/tasks/task-list.tsx`): en el detalle del cliente. Clientes también se ven como **tablero** por etapa (`components/clients/client-board.tsx`, dnd-kit).
- Campana (`components/dashboard/notification-bell.tsx`, en el sidebar, consulta cada minuto `GET /api/notifications/`): consulta nueva, oferta abierta, pago registrado, tarea asignada. El backend escribe una fila por persona.
- Roles: `AGENT` ve solo sus propiedades (`assignedAgentId`), ofertas y reservas (`createdBy`), sus clientes y los leads sin asignar; `OWNER`/`ADMIN` ven todo y reasignan con `components/shared/assignee-select.tsx` (solo ellos pueden listar el equipo). El backend lo aplica; la UI solo oculta lo que no corresponde.

**Consultas**
- Las consultas del portal, de las fichas y de las ofertas crean (o reutilizan por email) un cliente, una nota en su historial que nombra la propiedad u oferta, y un registro en `inquiries`. Se listan en `/inquiries` (bandeja con nuevas y leídas, `read_at`); el sidebar muestra cuántas hay sin leer.
- El backend avisa a la agencia por email (al email de contacto o, si no hay, a propietarios y administradores) y confirma al cliente, vía Resend (`RESEND_API_KEY`, `EMAIL_FROM`, `FRONTEND_URL` en el `.env` del backend). Sin clave, los emails solo se registran en el log.

**Capa de API (`src/lib/api`)**
- `client.ts` expone `apiFetch<T>(path, { token })`: añade `Authorization: Bearer`, fuerza `Content-Type: application/json` salvo con `FormData` (subida de archivos), lanza `ApiError(message, status)` y devuelve `undefined` en 204.
- Un módulo por dominio (`properties`, `offers`, `clients`, `bookings`, `pools`, `availability`, `rate-periods`, `recommendations`, `team`, `auth`) que contiene los tipos del dominio y las funciones de llamada. El token se pasa explícitamente desde `getAccessToken()`.
- Datos de servidor vía TanStack Query (`lib/query-provider.tsx`). Toda mutación invalida las queries y expira la caché del sitio público; una mutación que no puede afectar al sitio (etapa de un cliente, leído de una consulta) lo evita con `meta: { affectsSite: false }`. Para cambios optimistas, devolver el snapshot desde `onMutate` y restaurarlo en `onError`.

**Estado y formularios**
- `lib/store/action-bar-store.ts` (Zustand): las páginas de formulario (editores de propiedad/oferta) registran `onSave/onPublish/onCancel`, y el `ActionBar` del layout del dashboard renderiza los botones. Hay que llamar a `reset()` al desmontar.
- Formularios con react-hook-form + zod (`@hookform/resolvers`).
- Catálogos y etiquetas de propiedades en `lib/property-catalogs.ts` y `lib/properties-labels.ts`; compresión de imágenes antes de subir en `lib/image-compression.ts`.

**UI**
- Fechas: un solo selector propio, `DatePicker` (un día) y `DateRangePicker` (rango, en noches o en días) de `components/ui/date-picker.tsx`. Nunca `<input type="date">` (ESLint lo prohíbe).
- shadcn/ui (estilo `radix-nova`, icon library lucide) en `src/components/ui`; añadir componentes con la CLI de `shadcn`. Alias `@/components`, `@/lib`, `@/hooks`.
- Imágenes en tarjetas y miniaturas: pasar la URL por `sizedImage(url, IMAGE_WIDTH.*)` (`lib/image-url.ts`), que pide a Supabase una copia reducida; el original (hasta 2048 px) solo para portadas, galería y lightbox.
- GSAP: importar desde `@/lib/gsap` (solo el núcleo); cada plugin en su módulo (`@/lib/gsap-flip`) para no cargarlo en todas las páginas. El editor de texto (Tiptap) se carga bajo demanda desde `components/rich-text/rich-text-editor.tsx`.
- Texto enriquecido: `richTextHtml` (`lib/rich-text.ts`) sanea con `sanitize-html` (lista blanca de lo que produce Tiptap) antes de cualquier `dangerouslySetInnerHTML`; no inyectar HTML sin pasar por ahí.
- Tailwind v4 (configuración en `src/app/globals.css`, sin `tailwind.config`), `next-themes` para modo oscuro, `sonner` para toasts.
- Componentes de feature agrupados por dominio en `src/components/{clients,offers,bookings,properties,team,dashboard,public}`.
- Alias de importación: `@/*` → `src/*`.

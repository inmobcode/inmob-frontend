# Tivvu — frontend

Plataforma de gestión para agencias inmobiliarias (propiedades, ofertas, clientes, reservas, equipo) y sitio público de cada agencia. Next.js 16 (App Router, React 19), Tailwind v4, TanStack Query. Consume una API Flask separada. UI en español.

## Puesta en marcha

```bash
npm install
cp .env.example .env   # ajustá NEXT_PUBLIC_API_URL
npm run dev            # http://localhost:3000
```

Variables (`.env.example`):

| Variable | Para qué |
| --- | --- |
| `NEXT_PUBLIC_API_URL` | URL de la API Flask (por defecto `http://127.0.0.1:5000`; 127.0.0.1 y no `localhost` por AirPlay en macOS) |
| `NEXT_PUBLIC_SUPPORT_EMAIL` | Email de soporte en el menú de usuario (opcional) |

## Scripts

| Comando | Qué hace |
| --- | --- |
| `npm run dev` / `build` / `start` | Desarrollo, build y servidor de producción |
| `npm run lint` | ESLint |
| `npm run typecheck` | Genera tipos de rutas y corre `tsc` |
| `npm test` | Tests unitarios (Vitest) |

CI (`.github/workflows/ci.yml`) corre lint, typecheck, tests y build en cada push y PR.

## Arquitectura

La guía completa (rutas, proxy, sesión, sitio público, capa de API, convenciones) está en [`CLAUDE.md`](./CLAUDE.md).

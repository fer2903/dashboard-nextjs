<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Convenciones del proyecto — Crypto Dashboard

Host app en Next.js 16 (App Router) + React 19 + TypeScript estricto + Tailwind v4 + MongoDB (Mongoose). Es un dashboard de cripto con autenticación JWT propia, pagos con Stripe y tres micro-frontends (MFE) embebidos. Este documento describe cómo está construido HOY el proyecto para que cualquier cambio mantenga las mismas convenciones.

## Stack y dependencias clave

- **Next.js** `^16` con App Router. Sin `pages/`.
- **React** `19.2` — Server Components por defecto; `"use client"` solo cuando se necesita estado/efectos/hooks del browser.
- **TypeScript** `^5` con `"strict": true`.
- **Tailwind CSS** `v4` (vía `@tailwindcss/postcss`), importado con `@import "tailwindcss"` en `app/globals.css`.
- **MongoDB** vía **Mongoose** `^9`.
- **Auth**: JWT firmado con **jose** (compatible Edge Runtime) + **bcryptjs** para hashing.
- **Pagos**: **stripe** `^17`.
- **Data fetching cliente**: conviven tres enfoques (ver sección de hooks): `@tanstack/react-query`, `swr`, y un hook propio `useFetchPro`.
- **MFEs** instalados como paquetes npm: `products-mfe`, `transactions-mfe` (y `alerts-mfe` local).

## Estructura de carpetas

```
app/
  layout.tsx                 # Root layout: <html> + ReactQueryProvider
  globals.css                # Design tokens (CSS vars) + utilidades MUI
  page.tsx                   # Landing / redirect
  (auth)/                    # Route group público: login, register, layout propio
    layout.tsx
    login/page.tsx
    register/page.tsx
  dashboard/                 # Área protegida (ver middleware.ts)
    layout.tsx               # Sidebar + TopBar + <main>
    page.tsx
    users/page.tsx
    transactions/            # Embebe transactions-mfe
    products/                # Embebe products-mfe
    alerts/                  # Embebe alerts-mfe
    payments/                # success / cancel + checkout
  api/                       # Route Handlers (backend)
    auth/{login,register,logout,me}/route.ts
    transactions/route.ts          # GET (lista) / POST
    transactions/[id]/route.ts     # PUT / DELETE
    transactions/[...slug]/route.ts# filtros catch-all (mock)
    products/route.ts, products/[id]/route.ts
    alerts/route.ts,   alerts/[id]/route.ts
    users/route.ts
    crypto/route.ts
    stripe/{checkout,webhook}/route.ts
  src/
    components/              # Atomic Design (ver más abajo)
      atoms/<Nombre>/index.tsx
      molecules/<Nombre>/index.tsx
      organisms/<Nombre>/index.tsx
    hooks/                   # use*.ts(x)
    models/                  # Esquemas Mongoose (PascalCase, singular)
    lib/                     # mongodb.ts, jwt.ts, stripe.ts
    providers/               # ReactQueryProvider, etc.
    context/                 # React Context (DashboardContext)
middleware.ts                # Protección de /dashboard/:path* con JWT
next.config.ts
```

Regla de oro de imports: usar el alias **`@/*`** mapeado a la raíz (`tsconfig.json`). Ejemplo real: `import { connectDB } from "@/app/src/lib/mongodb"`. Para imports relativos cercanos (atom desde molecule) se usan rutas relativas (`../../atoms/Badge`).

## Construcción de componentes — Atomic Design (arquitectura molecular)

Los componentes de UI viven en `app/src/components/` divididos en tres niveles. Cada componente es una **carpeta con `index.tsx`** y se exporta con **named export** (excepción: los organismos de layout como `Sidebar`/`TopBar` usan `export default`).

- **atoms/** — pieza visual mínima, sin lógica de datos. Ej. `Badge` recibe `{ value }`, mapea a una paleta y renderiza un chip. Sin estado, sin fetch.
- **molecules/** — componen átomos + un poco de formato/presentación. Ej. `TransactionRow` (usa `Badge` + sub-componente local `UserAvatar`) y `StatsCard` (KPI con variantes de color). Reciben datos por props; no hacen fetch.
- **organisms/** — secciones completas que orquestan datos. Ej. `TransactionTable` es `"use client"`, llama al hook `useTransactions()`, maneja estados `isPending`/`error`/vacío con sus propios skeletons y compone `TransactionRow`. `Sidebar`/`TopBar`/`CryptoChart` también son organismos.

Convenciones de componente observadas:

- Tipado de props inline: `type Props = { ... }` o destructuring tipado en la firma. Componentes como funciones flecha (`export const X = (props: Props) => ...`).
- **Estilo**: Tailwind utility classes para layout/espaciado + `style={{ ... }}` inline para colores, sombras y gradientes que referencian los **design tokens** (`var(--text-primary)`, `var(--primary)`, etc.) definidos en `globals.css`. Estética "MUI-inspired" (Material UI): cards con `--shadow-card`, badges tipo Chip, paleta indigo.
- Hover/interacción frecuentemente con handlers `onMouseEnter/onMouseLeave` que mutan `style` directamente (en vez de clases `:hover`).
- Iconos como **SVG inline** (componentes locales `IconX`), no librerías de iconos.
- Comentarios de cabecera en español describiendo el propósito del componente.
- Skeletons/loading y estados vacíos se manejan dentro del organismo, no en la página.

Al crear UI nueva: decide el nivel (¿es un átomo reutilizable, una composición, o una sección con datos?), crea `components/<nivel>/<Nombre>/index.tsx`, named export, props tipadas, tokens de color vía CSS vars.

## Hooks de datos (`app/src/hooks/`)

Conviven **tres estrategias** de fetching — respeta la que ya use el dominio que tocas en lugar de unificar sin pedirlo:

- **React Query** (`@tanstack/react-query`): `useTransaction.ts` exporta el tipo `Transaction` + `useTransactions()` con `queryKey`, `queryFn` (fetch a `/api/...`) y `staleTime`. El `QueryClientProvider` está en `app/src/providers/ReactQueryProvider.tsx`, montado en el root layout.
- **SWR** (`swr`): `useProducts.ts` define un `fetcher` y devuelve `{ products, loading, error, mutate }`.
- **Hook propio** `useFetchPro.ts`: fetch con `AbortController` + reintentos. (Tiene bugs conocidos de `loading`/recursión; no copiarlo como patrón de referencia.)

Otros hooks: `useAuth` (login/register contra `/api/auth/*`, maneja `loading`/`error` y redirige con `useRouter`), `useCrypto*` (variantes con/ sin React Query/SWR), `useDashboard`, `useUsers`, `useAlerts`. Todos siguen el prefijo `use` y, si tocan estado/router, llevan `"use client"`.

Tipos de dominio: se exportan **desde el hook** que los consume (ej. `export type Transaction` en `useTransaction.ts`, `AppProduct` en `useProducts.ts`), no en una carpeta `types/` central.

## Estructura de la API (Route Handlers en `app/api/`)

Cada recurso es una carpeta con `route.ts` que exporta funciones nombradas por método HTTP (`GET`, `POST`, `PUT`, `DELETE`, `OPTIONS`). Rutas dinámicas con `[id]` para un recurso, `[...slug]` para catch-all.

Patrón estándar de un handler de datos (ej. `transactions`):

```ts
import { NextResponse } from "next/server";
import { connectDB } from "@/app/src/lib/mongodb";
import { Transaction } from "@/app/src/models/Transaction";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin":  "http://localhost:3001", // origen del MFE
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

export async function GET() {
  await connectDB();
  const data = await Transaction.find().sort({ createdAt: -1 });
  return NextResponse.json(data, { headers: CORS_HEADERS });
}
```

Convenciones de API observadas:

- **Siempre** `await connectDB()` antes de tocar Mongoose. La conexión está cacheada en `global` para sobrevivir al hot-reload (`app/src/lib/mongodb.ts`); requiere `MONGO_URI`.
- **CORS manual**: se declara una const `CORS_HEADERS` por archivo y se incluye en cada respuesta + un handler `OPTIONS` (204) para el preflight, porque los MFEs llaman desde `localhost:3001`. En producción hay que cambiar el `Access-Control-Allow-Origin`.
- Rutas dinámicas reciben **`params` como Promise** (Next 16): `({ params }: { params: Promise<{ id: string }> })` y luego `const { id } = await params`.
- Respuestas con `NextResponse.json(data, { status?, headers? })`. POST devuelve `201`; updates/deletes devuelven `{ ..., message: "..." }`.
- Body con `await req.json()`.
- `[...slug]/route.ts` de transactions parsea segmentos manualmente (`slug[0] === "coin"`, etc.) para filtros tipo `/api/transactions/user/fer/coin/btc` — actualmente sobre datos mock en memoria.

### API de Auth

- `POST /api/auth/login`: valida campos → `connectDB()` → `User.findOne({ email })` → `bcrypt.compare` → `signToken()` → set cookie **httpOnly** `token` (`sameSite: "lax"`, `secure` en prod, `maxAge` 7d). Mensaje de error genérico ("Credenciales inválidas") para no filtrar qué emails existen. Todo envuelto en try/catch con `500` de fallback.
- `register`, `logout`, `me` siguen el mismo estilo bajo `app/api/auth/`.
- JWT en `app/src/lib/jwt.ts`: `signToken`/`verifyToken` con **jose** (HS256, exp 7d), `JWT_SECRET` desde env. Se usa jose (no `jsonwebtoken`) por compatibilidad con Edge Runtime.

### Protección de rutas

`middleware.ts` corre en Edge sobre `matcher: ["/dashboard/:path*"]`: lee la cookie `token`, si falta o `verifyToken` falla → `redirect("/login")`. Las rutas `/api` y `(auth)` quedan públicas.

## Control de acceso por suscripción (entitlements)

Los módulos micro-frontend (`transactions`, `products`, `alerts`) requieren que el usuario esté **suscrito** para acceder. La regla es única y vive en `app/src/lib/entitlements.ts`; todas las capas la reutilizan (defensa en profundidad).

Piezas:

- **`app/src/lib/modules.ts`** — registro canónico de módulos (`key`, `label`, `route`, `apiPrefix`, `requiresSubscription`). Única fuente de verdad; agrega aquí un MFE nuevo y el resto se alinea. Helpers: `MODULE_KEYS`, `SUBSCRIBABLE_KEYS`, `getModuleByKey`, `isModuleKey`.
- **`User.subscriptions: string[]`** — módulos a los que el usuario `user` tiene acceso (validado contra `MODULE_KEYS`). Un `admin` accede a todo sin importar este arreglo.
- **`app/src/lib/auth.ts` → `getCurrentUser()`** — resuelve el usuario fresco desde DB leyendo la cookie con `next/headers`. Sirve en Server Components y Route Handlers (NO en middleware/Edge).
- **`app/src/lib/entitlements.ts`** — `hasModuleAccess(user, key)` (puro), `requireModuleAccess(key)` (guard de página: redirige a `/dashboard/no-access?module=<key>`), `requireApiAccess(key, headers)` (guard de API: devuelve `401/403` o `null`), `requireAdminApi(headers)` y `requireAdminPage()` (guards de rol admin).

Dónde se enforce (todas las capas):

- **Páginas MFE** (`app/dashboard/<módulo>/page.tsx`): Server Components que llaman `await requireModuleAccess("<key>")` antes de renderizar. Para `products`, el MFE se monta en un wrapper `"use client"` (`ProductsClient.tsx`) porque su bundle requiere contexto cliente; la página servidor hace el guard.
- **APIs de módulo** (`api/<módulo>/...`): cada método llama `requireApiAccess` (excepto `OPTIONS`). Patrón: `const denied = await requireApiAccess("<key>", CORS_HEADERS); if (denied) return denied;`.
- **Middleware** (`middleware.ts`): corte temprano por ruta usando los claims del JWT (Edge, sin DB). Es un refuerzo; la verificación autoritativa/fresca está en página y API.
- **Sidebar** (`useSession` → `/api/auth/me`): oculta los items de módulo sin acceso y muestra el grupo "Administración" solo a admins.

Fuente de permisos y frescura: la verificación de página/API consulta la DB fresca (revocar acceso surte efecto sin re-login). El **JWT** lleva un snapshot de `subscriptions` solo para el middleware; `/api/auth/me` **re-emite el token** con datos frescos en cada llamada (self-healing), así que los claims se mantienen al día durante la navegación.

Administración: `GET /api/admin/users` y `PATCH /api/admin/users/[id]/subscriptions` (solo admin, vía `requireAdminApi`); UI en `app/dashboard/admin`. Para sembrar/migrar datos existe `scripts/seed-subscriptions.mjs` (requiere `MONGO_URI`).

Al añadir un módulo nuevo: regístralo en `modules.ts`, crea su página con `requireModuleAccess`, protege sus rutas API con `requireApiAccess`, y añade el item al Sidebar con su `moduleKey`.

## Modelos Mongoose (`app/src/models/`)

Un archivo por modelo, **PascalCase singular** (`User.ts`, `Transaction.ts`, `Product.ts`, `Alert.ts`). Patrón fijo:

```ts
import mongoose, { Schema, models } from "mongoose";

const XSchema = new Schema({ /* campos */ }, { timestamps: true });

export const X = models.X || mongoose.model("X", XSchema);
```

El `models.X || mongoose.model(...)` evita el error de recompilación en hot-reload. `timestamps: true` añade `createdAt`/`updatedAt`. Validaciones a nivel schema cuando aplica (`required`, `unique`, `lowercase`, `enum`, `minlength`) — ver `User.ts` como referencia completa.

## Micro-frontends (MFE)

`products-mfe` y `transactions-mfe` se instalan como dependencias npm; `alerts-mfe` está como carpeta local. Se **embeben vía iframe** desde las páginas del host (ej. `app/dashboard/transactions/page.tsx`), NO con rewrites multi-zone (ver comentario en `next.config.ts`). El MFE detecta el iframe y oculta su propio chrome (`EmbeddedShell.tsx`). En el `Sidebar`, los enlaces a rutas MFE usan `<a>` nativo (`mfe: true`) para forzar full page load; el resto usa `<Link>`. Hay instructivos en HTML en la raíz (`instructivo-*.html`, `guia-nuevo-mfe.html`) para crear/desplegar MFEs.

## Estilos y design tokens

`app/globals.css` define el sistema de diseño como **CSS custom properties** en `:root` (paleta MUI: `--primary`, `--text-primary/secondary/disabled`, `--background`, `--surface`, `--divider`, sombras `--shadow-card/sm/dialog`, colores semánticos `--success/danger/warning/info`, y tokens del sidebar). Hay clases utilitarias `.mui-card`, `.mui-paper`, `.mui-table`, `.mui-btn`, `.mui-input`. Usa estos tokens en lugar de hardcodear hex nuevos; mantén la estética Material UI / indigo.

## Reglas rápidas para agentes

- Lee la guía de Next 16 en `node_modules/next/dist/docs/` antes de escribir código de framework (ver bloque al inicio).
- Imports con alias `@/*`; componentes en `components/<atoms|molecules|organisms>/<Nombre>/index.tsx` con named export y props tipadas.
- En API: `connectDB()` primero, incluye `CORS_HEADERS` + `OPTIONS`, `params` es Promise, respuestas con `NextResponse.json`.
- Modelos con el patrón `models.X || mongoose.model(...)` + `timestamps`.
- No mezcles estrategias de fetching: usa la que el dominio ya emplea (React Query / SWR).
- Colores y sombras vía CSS vars de `globals.css`, no hex sueltos.
- Comentarios y textos de UI en español, igual que el resto del código.

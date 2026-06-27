# AGENTS.md — Plantilla de convenciones (React / Next.js)

Guía reutilizable de convenciones para proyectos React y Next.js (App Router). Copia este archivo como `AGENTS.md` en la raíz de tu proyecto y ajusta lo que esté marcado con `<...>`, borra las secciones que no apliquen y conserva solo las que reflejen cómo está construido tu proyecto. El objetivo es que cualquier agente o persona nueva mantenga las mismas convenciones.

> Cómo usar esta plantilla: completa los marcadores `<...>`, elimina las **Opciones** que no uses (p. ej. elige UNA estrategia de fetching), y mantén el documento describiendo lo que el proyecto hace HOY, no lo ideal.

## Stack

Lista las dependencias y versiones reales. Ejemplo:

- **Framework**: `<Next.js 16 (App Router) | Vite + React | Remix | ...>`
- **React** `<19>` — Server Components por defecto (si Next App Router); `"use client"` solo cuando haya estado/efectos/APIs del browser.
- **Lenguaje**: TypeScript `<5>` con `"strict": true` (recomendado).
- **Estilos**: `<Tailwind v4 | CSS Modules | styled-components | MUI | ...>`.
- **Datos/Backend**: `<Route Handlers + ORM | API REST externa | GraphQL | ...>`.
- **Estado servidor (fetching)**: elige UNA → `<@tanstack/react-query | swr | fetch nativo + Server Components>`.
- **Estado cliente**: `<Context | Zustand | Redux Toolkit | ninguno>`.
- **Auth**: `<JWT (jose/bcrypt) | NextAuth/Auth.js | Clerk | proveedor externo>`.

Regla: no introduzcas una librería nueva para algo que ya está resuelto. Si necesitas otra estrategia, propónlo antes de mezclarla con la existente.

## Estructura de carpetas

Documenta la estructura real. Ejemplo para Next.js App Router con `src/`:

```
app/                      # (o src/app/) App Router
  layout.tsx              # Root layout + providers globales
  globals.css             # Tokens de diseño + base styles
  (public)/               # Route group público (auth, landing)
  <area-protegida>/       # Layout propio (sidebar/topbar) + páginas
  api/                    # Route Handlers (si el backend vive aquí)
    <recurso>/route.ts
    <recurso>/[id]/route.ts
src/                      # (o app/src/) código compartido
  components/             # UI por niveles (ver "Componentes")
  hooks/                  # use*.ts(x)
  lib/                    # clientes/utilidades (db, auth, sdk externos)
  models/ | services/     # esquemas ORM o capa de acceso a datos
  providers/              # Providers de React (Query, theme, etc.)
  context/ | store/        # estado cliente
middleware.ts             # Protección de rutas (si aplica)
```

Convención de imports: define un alias de raíz en `tsconfig.json` (p. ej. `"@/*": ["./*"]` o `"@/*": ["./src/*"]`) y úsalo para imports no locales. Usa rutas relativas solo entre archivos vecinos.

## Componentes — Atomic Design

UI organizada en niveles dentro de `components/`. Cada componente es una carpeta con `index.tsx` (o `Componente.tsx`), **named export** y props tipadas.

- **atoms/** — pieza visual mínima, sin lógica de datos ni fetch (botón, badge, input). Recibe todo por props.
- **molecules/** — composición de átomos + formato/presentación. Recibe datos por props; tampoco hace fetch.
- **organisms/** — secciones completas que **orquestan datos**: llaman hooks, manejan `loading` / `error` / estado vacío (incluyendo skeletons) y componen moléculas. En Next, suelen llevar `"use client"`.

Reglas de componente:

- Props tipadas con `type Props = { ... }` o destructuring tipado en la firma.
- Mantén los átomos/moléculas "tontos" (presentacionales); el acceso a datos vive en organismos o páginas vía hooks.
- Estados de carga, error y vacío se manejan en el organismo, no en la página.
- Estilos: `<describe tu enfoque>`. Si usas tokens de diseño (CSS vars / theme), referencia los tokens en lugar de hardcodear colores/sombras nuevos.
- Iconos: `<librería (lucide-react, etc.) | SVG inline>` — sé consistente.
- Idioma de comentarios y textos de UI: `<español | inglés>`, consistente en todo el repo.

Al crear UI nueva: decide el nivel (¿átomo reutilizable, composición, o sección con datos?), crea `components/<nivel>/<Nombre>/index.tsx`, named export, props tipadas, colores vía tokens.

## Hooks de datos (`hooks/`)

Prefijo `use`; `"use client"` si tocan estado/router/browser. Tipos de dominio exportados desde el hook que los consume (o desde `types/` si tu proyecto lo centraliza — elige uno).

Elige UNA estrategia de fetching y documenta su patrón:

**Opción A — React Query** (`@tanstack/react-query`):

```ts
export type <Entidad> = { /* ... */ };

export function use<Entidades>() {
  return useQuery({
    queryKey: ["<entidad>"],
    queryFn: async () => (await fetch("/api/<recurso>")).json(),
    staleTime: <ms>,
  });
}
```
Monta `QueryClientProvider` en un provider cliente incluido en el root layout.

**Opción B — SWR** (`swr`):

```ts
const fetcher = (url: string) => fetch(url).then(r => r.json());

export const use<Entidades> = () => {
  const { data, error, isLoading, mutate } = useSWR<<Entidad>[]>("/api/<recurso>", fetcher);
  return { <entidades>: data, loading: isLoading, error, mutate };
};
```

**Opción C — Server Components / fetch nativo**: hacer fetch en el componente servidor y pasar datos por props; usar hooks de cliente solo para interacción.

No mezcles estrategias entre dominios sin una razón explícita.

## API / Backend (Route Handlers en `app/api/`)

> Omite esta sección si el backend es un servicio externo.

Un recurso = una carpeta con `route.ts` que exporta funciones por método HTTP (`GET`, `POST`, `PUT`, `DELETE`, `OPTIONS`). Rutas dinámicas con `[id]`; catch-all con `[...slug]`.

Patrón base:

```ts
import { NextResponse } from "next/server";
import { connectDB } from "@/<ruta>/lib/db";       // si usas ORM con conexión cacheada
import { <Modelo> } from "@/<ruta>/models/<Modelo>";

export async function GET() {
  await connectDB();
  const data = await <Modelo>.find().sort({ createdAt: -1 });
  return NextResponse.json(data);
}

export async function POST(req: Request) {
  await connectDB();
  const body = await req.json();
  const created = await <Modelo>.create(body);
  return NextResponse.json(created, { status: 201 });
}
```

Convenciones:

- Si usas ORM/DB, abre la conexión (`connectDB()` o equivalente) al inicio de cada handler; cachea la conexión en `global` para sobrevivir al hot-reload.
- En Next 15+/16 los `params` de rutas dinámicas son **Promise**: `({ params }: { params: Promise<{ id: string }> })` → `const { id } = await params`.
- Respuestas siempre con `NextResponse.json(data, { status?, headers? })`. POST → `201`; mutaciones → incluye `{ ..., message }` si tu front lo espera.
- Body con `await req.json()`.
- Maneja errores con try/catch y un fallback `500`; no filtres detalles internos en el mensaje.
- **CORS**: solo si otros orígenes (p. ej. micro-frontends) llaman a esta API. En ese caso declara `CORS_HEADERS` por archivo, inclúyelos en cada respuesta y añade un handler `OPTIONS` (204) para el preflight. Configura el `Access-Control-Allow-Origin` por entorno.

### Auth y protección de rutas

- `<NextAuth/Auth.js | Clerk | JWT propio>`. Si es JWT propio: firma/verifica con **jose** (compatible Edge), hashea contraseñas con **bcrypt**, guarda el token en cookie **httpOnly** (`sameSite: "lax"`, `secure` en prod, `maxAge` definido). Usa mensajes de error genéricos en login para no filtrar qué cuentas existen.
- `middleware.ts` protege rutas con un `matcher` (p. ej. `["/<area-protegida>/:path*"]`): lee la sesión/token, y si falta o es inválido → `redirect("/login")`. Recuerda que el middleware corre en Edge Runtime.

## Modelos / capa de datos

> Si usas Mongoose, un archivo por modelo en `models/`, **PascalCase singular**:

```ts
import mongoose, { Schema, models } from "mongoose";

const <Entidad>Schema = new Schema({ /* campos + validaciones */ }, { timestamps: true });

export const <Entidad> = models.<Entidad> || mongoose.model("<Entidad>", <Entidad>Schema);
```

El patrón `models.X || mongoose.model(...)` evita el error de recompilación en hot-reload; `timestamps: true` añade `createdAt`/`updatedAt`. Pon validaciones a nivel schema (`required`, `unique`, `enum`, etc.).

> Con Prisma/Drizzle u otro ORM: documenta dónde vive el cliente, cómo se instancia (singleton en `global` para dev) y dónde están los esquemas/migraciones.

## Estilos y design tokens

Define el sistema de diseño como tokens (CSS custom properties en `:root`, o theme de tu librería): colores (`--primary`, textos, fondos, bordes), sombras y colores semánticos (success/danger/warning/info). Usa los tokens en lugar de hardcodear valores nuevos, y mantén una estética consistente. Si tienes clases utilitarias propias (`.card`, `.btn`, etc.), documéntalas aquí.

## Reglas rápidas para agentes

- Imports con el alias de raíz; componentes en `components/<atoms|molecules|organisms>/<Nombre>/index.tsx` con named export y props tipadas.
- Mantén átomos/moléculas presentacionales; los datos viven en hooks usados por organismos/páginas.
- En API: conexión a DB primero, `params` es Promise, respuestas con `NextResponse.json`, errores con `500` de fallback (y CORS solo si hace falta).
- Modelos con el patrón anti-hot-reload + `timestamps` (si Mongoose).
- No mezcles estrategias de fetching ni introduzcas librerías redundantes.
- Colores/sombras vía tokens, no valores sueltos.
- Idioma de comentarios y UI consistente con el resto del repo.

<!-- Opcional: si tu Next.js o framework tiene breaking changes respecto al conocimiento del agente,
     añade aquí una nota indicando que lea la doc local antes de escribir código de framework. -->

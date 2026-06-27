# 01 · Crear un nuevo módulo MFE

Receta portable para agregar un módulo completo (CRUD) como MFE. Cubre el lado **host** (datos + API + integración) y el lado **MFE** (proyecto independiente). Por defecto usa el **patrón iframe** (B); al final hay notas para los patrones npm (A) y multi-zone (C).

## Variables a definir

```
MODULE        = {{MODULE}}          # ej. orders
MODULE_PASCAL = {{MODULE_PASCAL}}   # ej. Order
MFE_NAME      = {{MFE_NAME}}        # ej. orders-mfe
MFE_PORT      = {{MFE_PORT}}        # ej. 3005
HOST_URL      = {{HOST_URL}}        # ej. http://localhost:3000
FIELDS        = {{DB_MODEL_FIELDS}} # campos del modelo
```

## Resumen (qué se crea)

Host: modelo → API (route + [id]) con CORS → (hook opcional) → página contenedora → item en Sidebar.
MFE: package.json (puerto) → next.config (basePath) → tsconfig/postcss/.env → globals.css → EmbeddedShell → layout → page(s) CRUD → hook con URL absoluta.

---

## PARTE A — Host (dueño de los datos)

### A1. Modelo (Mongoose)
`app/src/models/{{MODULE_PASCAL}}.ts`
```ts
import mongoose, { Schema, models } from "mongoose";

const {{MODULE_PASCAL}}Schema = new Schema(
  {
    // define {{DB_MODEL_FIELDS}} con tipos/validaciones
    name:   { type: String, required: true, trim: true },
    status: { type: String, enum: ["active", "inactive"], default: "active" },
    // ...
  },
  { timestamps: true } // createdAt / updatedAt automáticos
);

// Evita "Cannot overwrite model" en hot-reload
export const {{MODULE_PASCAL}} =
  models.{{MODULE_PASCAL}} || mongoose.model("{{MODULE_PASCAL}}", {{MODULE_PASCAL}}Schema);
```

### A2. API con CORS — lista + crear
`app/api/{{MODULE}}/route.ts`
```ts
import { NextRequest, NextResponse } from "next/server";
import connectMongo from "@/app/src/lib/mongodb";
import { {{MODULE_PASCAL}} } from "@/app/src/models/{{MODULE_PASCAL}}";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": process.env.NEXT_PUBLIC_{{MODULE}}_MFE_URL ?? "http://localhost:{{MFE_PORT}}",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}
export async function GET() {
  await connectMongo();
  const items = await {{MODULE_PASCAL}}.find().sort({ createdAt: -1 }).lean();
  return NextResponse.json(items, { headers: CORS_HEADERS });
}
export async function POST(req: NextRequest) {
  await connectMongo();
  const body = await req.json();
  const created = await {{MODULE_PASCAL}}.create(body);
  return NextResponse.json(created, { status: 201, headers: CORS_HEADERS });
}
```

### A3. API por id — uno + actualizar + borrar
`app/api/{{MODULE}}/[id]/route.ts` — reutiliza `CORS_HEADERS` y `OPTIONS`.
```ts
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await connectMongo();
  const { id } = await params; // Next 15+: params es Promise
  const body = await req.json();
  const updated = await {{MODULE_PASCAL}}.findByIdAndUpdate(id, body, { new: true, runValidators: true }).lean();
  if (!updated) return NextResponse.json({ error: "No encontrado" }, { status: 404, headers: CORS_HEADERS });
  return NextResponse.json(updated, { headers: CORS_HEADERS });
}
export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await connectMongo();
  const { id } = await params;
  await {{MODULE_PASCAL}}.findByIdAndDelete(id);
  return NextResponse.json({ message: "eliminado" }, { headers: CORS_HEADERS });
}
```

### A4. Página contenedora (patrón iframe)
`app/dashboard/{{MODULE}}/page.tsx`
```tsx
const MFE_URL = process.env.NEXT_PUBLIC_{{MODULE}}_MFE_URL ?? "http://localhost:{{MFE_PORT}}";
export default function {{MODULE_PASCAL}}Page() {
  return (
    <iframe
      src={`${MFE_URL}/dashboard/{{MODULE}}`}
      title="Módulo {{MODULE_PASCAL}}"
      style={{ width: "100%", height: "calc(100vh - 64px)", border: "none", display: "block" }}
    />
  );
}
```

### A5. Sidebar — agregar el item
En el array de navegación, los links a MFE iframe/multi-zone usan `<a>` nativo (`mfe: true`); los que solo cargan una página del host (incl. iframe servido por el host) pueden usar `<Link>`. Para iframe directo a otro origen usa `mfe: true`.
```ts
{ href: "/dashboard/{{MODULE}}", label: "{{MODULE_PASCAL}}", icon: <Icon{{MODULE_PASCAL}} />, mfe: true }
```

---

## PARTE B — Proyecto MFE

Estructura mínima:
```
{{MFE_NAME}}/
├── app/
│   ├── components/EmbeddedShell.tsx
│   ├── globals.css
│   ├── layout.tsx
│   ├── page.tsx            # /dashboard/{{MODULE}}
│   ├── new/page.tsx        # crear
│   └── edit/[id]/page.tsx  # editar
├── .env.local
├── next.config.ts          # basePath (crítico)
├── package.json            # puerto {{MFE_PORT}}
├── postcss.config.mjs
└── tsconfig.json
```

### B1. package.json
```json
{
  "name": "{{MFE_NAME}}",
  "private": true,
  "scripts": {
    "dev": "next dev -p {{MFE_PORT}}",
    "build": "next build",
    "start": "next start -p {{MFE_PORT}}"
  },
  "dependencies": { "next": "^15.3.1", "react": "^19.0.0", "react-dom": "^19.0.0", "swr": "^2.3.3" },
  "devDependencies": { "typescript": "^5", "@types/node": "^20", "@types/react": "^19", "tailwindcss": "^4", "@tailwindcss/postcss": "^4" }
}
```

### B2. next.config.ts — basePath debe igualar la ruta del host
```ts
import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  basePath: "/dashboard/{{MODULE}}",
  // output: "standalone", // descomenta para Docker (ver playbook 03)
};
export default nextConfig;
```

### B3. .env.local
```
NEXT_PUBLIC_HOST_URL=http://localhost:{{HOST_PORT}}
```

### B4. tsconfig.json / postcss.config.mjs
Copia un tsconfig de Next estándar con `"paths": { "@/*": ["./app/*"] }`. PostCSS para Tailwind v4:
```js
const config = { plugins: { "@tailwindcss/postcss": {} } };
export default config;
```

### B5. globals.css — copiar tokens del host
```css
@import "tailwindcss";
:root {
  --primary: #4f46e5; --background: #F4F6F8; --surface: #ffffff;
  --text-primary: #212B36; --text-secondary: #637381; --text-disabled: #919EAB;
  --divider: rgba(145,158,171,0.24); --border: rgba(145,158,171,0.32);
  --shadow-card: 0 0 2px 0 rgba(145,158,171,0.20), 0 12px 24px -4px rgba(145,158,171,0.12);
}
body { background-color: var(--background); color: var(--text-primary); }
```

### B6. EmbeddedShell — detecta iframe vs standalone
`app/components/EmbeddedShell.tsx`
```tsx
"use client";
import { useState, useEffect } from "react";
export default function EmbeddedShell({ children }: { children: React.ReactNode }) {
  const [isEmbedded, setIsEmbedded] = useState(false);
  useEffect(() => {
    try { setIsEmbedded(window.self !== window.top); } catch { setIsEmbedded(true); }
  }, []);
  if (isEmbedded) return <div style={{ background: "var(--background)", minHeight: "100vh" }}>{children}</div>;
  return (
    <div style={{ minHeight: "100vh" }}>
      <header style={{ height: 56, background: "#fff", borderBottom: "1px solid #e5e7eb" }}>
        <span>MFE {{MODULE_PASCAL}} — standalone</span>
      </header>
      <main>{children}</main>
    </div>
  );
}
```

### B7. layout.tsx
```tsx
import "./globals.css";
import EmbeddedShell from "./components/EmbeddedShell";
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (<html lang="es"><body><EmbeddedShell>{children}</EmbeddedShell></body></html>);
}
```

### B8. Hook de datos (URL absoluta al host)
`app/src/hooks/use{{MODULE_PASCAL}}.ts`
```ts
import useSWR from "swr";
const HOST_URL = process.env.NEXT_PUBLIC_HOST_URL ?? "http://localhost:{{HOST_PORT}}";
const fetcher = (u: string) => fetch(u).then(r => r.json());
export const use{{MODULE_PASCAL}} = () => {
  const { data, error, isLoading, mutate } = useSWR(`${HOST_URL}/api/{{MODULE}}`, fetcher);
  return { items: data, loading: isLoading, error, mutate };
};
export const delete{{MODULE_PASCAL}} = (id: string) =>
  fetch(`${HOST_URL}/api/{{MODULE}}/${id}`, { method: "DELETE" });
```

### B9. Páginas CRUD
`app/page.tsx` (lista, usa el hook + `<Link href="/new">` y `<Link href={`/edit/${id}`}>` — el basePath añade el prefijo), `app/new/page.tsx` (form → POST), `app/edit/[id]/page.tsx` (form → PUT). Maneja loading/error/empty dentro de la página.

---

## Arrancar y probar
```
# Terminal 1 (host)
cd host && rm -rf .next && npm run dev
# Terminal 2 (MFE) — primera vez
cd {{MFE_NAME}} && npm install && npm run dev
```
- `http://localhost:{{MFE_PORT}}/dashboard/{{MODULE}}` → MFE standalone (con header propio).
- `http://localhost:{{HOST_PORT}}/dashboard/{{MODULE}}` → host + iframe (sin header del MFE).

## Variantes por patrón
- **A (npm)**: omite el iframe. La página del host hace `import { {{MODULE_PASCAL}}ListPage } from "{{MFE_NAME}}"; import "{{MFE_NAME}}/styles.css";` y lo renderiza. Si el bundle no trae `"use client"`, envuélvelo en un wrapper cliente. Publica el MFE con el playbook 02.
- **C (multi-zone)**: en vez del iframe, agrega 2 rewrites en `next.config.ts` del host (`/dashboard/{{MODULE}}` y `/dashboard/{{MODULE}}/:path*` → `http://localhost:{{MFE_PORT}}/...`) y limpia `.next` tras el cambio.

## Checklist
- [ ] Modelo con `models.X || mongoose.model(...)` y `timestamps`
- [ ] API `route.ts` + `[id]/route.ts` con `CORS_HEADERS` y `OPTIONS`; `params` con `await`
- [ ] Página contenedora (iframe) o import del componente (npm)
- [ ] Item agregado al Sidebar (`mfe: true` si iframe/multi-zone)
- [ ] MFE: `package.json` con puerto, `next.config.ts` con `basePath`, `.env.local` con `NEXT_PUBLIC_HOST_URL`
- [ ] `globals.css` con tokens del host; `EmbeddedShell` creado
- [ ] Hook con URL absoluta; páginas CRUD funcionando
- [ ] Host reiniciado (`rm -rf .next && npm run dev`) tras cambios de config
- [ ] Puerto registrado en la tabla del playbook 00

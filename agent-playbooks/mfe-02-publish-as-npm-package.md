# 02 · Publicar un MFE como paquete npm (dual: app + librería)

Convierte un MFE en un **paquete dual**: sigue siendo app Next.js standalone en su puerto, y además exporta sus páginas como componentes React para que el host las importe directo (patrón A, sin iframe ni multi-zone).

## Concepto

- Las páginas viven en `app/` como siempre → modo standalone (`npm run dev`).
- Un `lib/index.ts` re-exporta esas páginas/componentes.
- **tsup** compila ese entry a `dist/` (ESM + CJS + `.d.ts`).
- Tailwind se compila aparte a `dist/styles.css`.
- `next`, `react`, `react-dom` pasan a **peerDependencies** (los provee el host).

## Variables
```
MFE_NAME = {{MFE_NAME}}   # ej. orders-mfe
MFE_PORT = {{MFE_PORT}}
```

## Archivos a crear / modificar

| Archivo | Acción | Propósito |
|---------|--------|-----------|
| `package.json` | reescribir | exports, peerDeps, scripts de build |
| `lib/index.ts` | crear | entry point de la librería |
| `tsup.config.ts` | crear | bundler TS/TSX → ESM+CJS+d.ts |
| `tsconfig.build.json` | crear | tsconfig que sí emite tipos |
| `.npmignore` | crear | excluir fuente del tarball |
| `README.md` / `LICENSE` | crear | docs + licencia (MIT) |

`app/`, `next.config.ts`, `postcss.config.mjs`, etc. **no se tocan** (siguen sirviendo standalone).

### 1. package.json (reescribir)
```json
{
  "name": "{{MFE_NAME}}",
  "version": "1.0.0",
  "license": "MIT",
  "type": "module",
  "main": "./dist/index.cjs",
  "module": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": { "types": "./dist/index.d.ts", "import": "./dist/index.js", "require": "./dist/index.cjs" },
    "./styles.css": "./dist/styles.css"
  },
  "files": ["dist", "README.md", "LICENSE"],
  "sideEffects": ["**/*.css"],
  "publishConfig": { "access": "public" },
  "scripts": {
    "dev": "next dev -p {{MFE_PORT}}",
    "build": "next build",
    "start": "next start -p {{MFE_PORT}}",
    "build:lib": "tsup && npm run build:css",
    "build:css": "tailwindcss -i ./app/globals.css -o ./dist/styles.css --minify",
    "prepublishOnly": "npm run build:lib",
    "pack:dry": "npm pack --dry-run"
  },
  "peerDependencies": { "next": ">=15.0.0", "react": ">=19.0.0", "react-dom": ">=19.0.0" },
  "devDependencies": {
    "next": "^16.2.4", "react": "19.2.4", "react-dom": "19.2.4",
    "tsup": "^8.3.5", "@tailwindcss/cli": "^4.0.0", "@tailwindcss/postcss": "^4", "tailwindcss": "^4",
    "typescript": "^5", "@types/node": "^20", "@types/react": "^19", "@types/react-dom": "^19"
  }
}
```
> Quitar `"private": true` es obligatorio o `npm publish` rechaza el paquete.

### 2. lib/index.ts (re-exporta las páginas reales — revisa `app/` antes de escribir)
```ts
export { default as {{MODULE_PASCAL}}ListPage } from "../app/page";
export { default as New{{MODULE_PASCAL}}Page }  from "../app/new/page";
export { default as Edit{{MODULE_PASCAL}}Page } from "../app/edit/[id]/page";
export { default as EmbeddedShell }             from "../app/components/EmbeddedShell";
```

### 3. tsup.config.ts
```ts
import { defineConfig } from "tsup";
export default defineConfig({
  entry: ["lib/index.ts"],
  format: ["esm", "cjs"],
  dts: true, sourcemap: true, clean: true, splitting: false, treeshake: true, target: "es2020",
  external: ["react", "react-dom", "react/jsx-runtime", "next", "next/link", "next/navigation"],
  esbuildOptions(options) {
    options.banner = { js: '"use client";' }; // preserva "use client" para el host
    options.jsx = "automatic";
  },
});
```

### 4. tsconfig.build.json (el tsconfig principal tiene noEmit:true)
```json
{
  "extends": "./tsconfig.json",
  "compilerOptions": { "noEmit": false, "declaration": true, "declarationDir": "dist", "outDir": "dist", "emitDeclarationOnly": true },
  "include": ["lib/**/*", "app/**/*"],
  "exclude": ["node_modules", "dist", ".next"]
}
```

### 5. .npmignore (solo dist/ + README + LICENSE entran al tarball)
```
app/
lib/
public/
next.config.ts
next-env.d.ts
postcss.config.mjs
tailwind.config.ts
tsconfig.json
tsconfig.build.json
tsup.config.ts
eslint.config.mjs
.next/
node_modules/
.env*
.git
.DS_Store
*.log
```

## Build y publicación
```
npm install
npm run build:lib      # genera dist/
npm run pack:dry       # verifica el tarball (no sube nada)
npm publish            # prepublishOnly corre build:lib
```
`pack:dry` debe listar solo: `dist/index.js`, `dist/index.cjs`, `dist/index.d.ts`, `dist/styles.css`, `package.json`, `README.md`, `LICENSE`. Si aparece `app/` o `.next/`, revisa `.npmignore`.

## Consumir desde el host
```
npm install {{MFE_NAME}}
```
```tsx
// app/dashboard/{{MODULE}}/page.tsx
import { {{MODULE_PASCAL}}ListPage } from "{{MFE_NAME}}";
import "{{MFE_NAME}}/styles.css";
export default function Page() { return <{{MODULE_PASCAL}}ListPage />; }
```
> Si el bundle no incluyó `"use client"` y el componente usa hooks/SWR, envuélvelo en un wrapper `"use client"` y deja la página como Server Component.

## Manejo de dependencias propias del MFE
- Si el host usa la misma lib con misma versión (ej. `swr`, `@tanstack/react-query`) → ponla en `peerDependencies` para no duplicar.
- Si es específica del MFE → `dependencies`.

## Checklist por MFE
- [ ] `package.json` sin `private`, con `exports`, `files`, `peerDependencies`, scripts `build:lib` + `prepublishOnly`
- [ ] `lib/index.ts` con todos los exports de páginas/componentes reales
- [ ] `tsup.config.ts` con `react/react-dom/next/*` external y banner `"use client"`
- [ ] `tsconfig.build.json` con `declaration:true`, `noEmit:false`
- [ ] `.npmignore` excluyendo todo lo que no es `dist/`
- [ ] `README.md` (uso, exports, env vars) + `LICENSE`
- [ ] `npm run build:lib` produce los 4 artefactos en `dist/`
- [ ] `npm run pack:dry` lista solo lo esperado
- [ ] `npm run dev` sigue levantando la app standalone

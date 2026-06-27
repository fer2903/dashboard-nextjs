# 00 · Arquitectura y convenciones de Microfrontends

Objetivo: entender cómo se integran los MFEs al host y **elegir el patrón** antes de escribir código. Hay tres patrones probados; los tres comparten las mismas convenciones de datos y diseño.

## Concepto

Un **microfrontend (MFE)** es una app Next.js pequeña e independiente que hace una sola cosa (productos, alertas, transacciones…). El **host** (dashboard) provee sidebar/topbar y navegación; cada MFE se muestra como una sección. El usuario percibe una sola app.

Regla invariable: **el host es el dueño de los datos** (modelos + API + DB). El MFE solo consume la API del host por HTTP.

## Los tres patrones de integración

### A) Paquete npm (componentes React) — recomendado / estado actual del proyecto
El MFE se publica como paquete npm "dual": sigue siendo app standalone en su puerto, pero además exporta sus páginas como componentes React. El host hace `import { XListPage } from "{{MFE_NAME}}"` y lo renderiza dentro de su layout. Sin iframe, sin rewrites.

- **Pros**: misma sesión/cookies/estilos del host, navegación SPA, SSR, sin CORS para datos same-origin, mejor rendimiento.
- **Contras**: el MFE debe compilarse/publicarse (ver playbook 02); acoplado a versión de React/Next del host (peerDeps).
- **Cuándo**: producción real, equipos que pueden publicar paquetes, cuando quieres una sola app cohesiva.

### B) iframe embebido
La página del host (`/dashboard/{{MODULE}}`) solo renderiza un `<iframe src="{{MFE_URL}}/dashboard/{{MODULE}}">`. El MFE detecta si está embebido (`window.self !== window.top`) y oculta su propio chrome (componente `EmbeddedShell`).

- **Pros**: aislamiento total, despliegue 100% independiente, simple de razonar.
- **Contras**: CORS obligatorio para datos, sesión/cookies aisladas, el link del sidebar debe ser `<a>` nativo (no `<Link>`) para forzar full-load, hay que fijar `height: calc(100vh - {{TOPBAR}})`.
- **Cuándo**: equipos/datos muy separados, quieres desplegar el MFE en otro servidor sin tocar el host.

### C) Multi-zone (rewrites + basePath)
El host delega rutas al MFE vía `rewrites` en `next.config.ts`; el MFE define `basePath: "/dashboard/{{MODULE}}"`. La URL del navegador siempre muestra el host.

- **Pros**: URL unificada sin iframe, navegación entre zonas.
- **Contras**: configuración frágil (dos entradas de rewrite por MFE, limpiar `.next` tras cambios), links MFE como `<a>` nativo.
- **Cuándo**: quieres una sola URL pero mantener procesos separados sin empaquetar a npm.

## Tabla de decisión rápida

| Necesitas… | Patrón |
|------------|--------|
| Una app cohesiva, misma sesión, máximo rendimiento | A (npm) |
| Aislamiento fuerte / desplegar MFE aparte sin tocar host | B (iframe) |
| URL unificada sin empaquetar a npm | C (multi-zone) |

## Convenciones compartidas (los 3 patrones)

1. **Datos en el host**: `app/src/models/{{MODULE_PASCAL}}.ts` (Mongoose) + `app/api/{{MODULE}}/route.ts` y `[id]/route.ts`.
2. **CORS** en la API del host si el MFE llama directo (patrones B y C, y A en modo standalone): const `CORS_HEADERS` + handler `OPTIONS` (204). Origen = URL del MFE por env.
3. **URLs por env**: MFE usa `NEXT_PUBLIC_HOST_URL`/`NEXT_PUBLIC_API_URL`; host usa `NEXT_PUBLIC_{{MODULE}}_MFE_URL`. Fallbacks a `localhost` solo para dev.
4. **Tokens de diseño**: copiar las CSS variables del host (`globals.css`) al MFE.
5. **Hook de datos**: el host usa URL relativa (`/api/{{MODULE}}`); el MFE usa URL absoluta (`${HOST_URL}/api/{{MODULE}}`).
6. **Registro de puertos**: reserva un puerto fijo por MFE para evitar choques al levantar varios.
7. **Next 15/16**: `params` es `Promise`; modelo con `models.X || mongoose.model(...)`.

## Registro de puertos (mantener actualizado)

| Puerto | App | Ruta host | Patrón |
|--------|-----|-----------|--------|
| {{HOST_PORT}} | Host (dashboard) | `/` | — |
| 3001 | transactions-mfe | `/dashboard/transactions` | A (npm) |
| 3003 | products-mfe | `/dashboard/products` | A (npm) |
| 3004 | alerts-mfe | `/dashboard/alerts` | A (npm) |
| {{MFE_PORT}} | {{MFE_NAME}} | `/dashboard/{{MODULE}}` | elegir |

Siguiente paso: playbook `mfe-01-create-new-module.md`.

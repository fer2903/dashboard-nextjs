# alerts-mfe

Microfrontend de Alertas — paquete dual:

- **App Next.js standalone** en `:3004` para desarrollo aislado del MFE.
- **Librería npm** que un host Next.js puede instalar e importar como componentes React (sin iframe, sin multi-zone).

---

## Instalación

```bash
npm install alerts-mfe
```

`react`, `react-dom` y `next` son **peerDependencies** — los provee el host.

## Uso desde el host

```tsx
// app/dashboard/alerts/page.tsx
import { AlertsListPage } from "alerts-mfe";
import "alerts-mfe/styles.css";

export default function Page() {
  return <AlertsListPage />;
}
```

Componentes exportados:

| Export                | Origen en el repo                  |
|-----------------------|------------------------------------|
| `AlertsListPage`      | `app/page.tsx`                     |
| `NewAlertPage`        | `app/new/page.tsx`                 |
| `EmbeddedShell`       | `app/components/EmbeddedShell.tsx` |
| `useAlerts` / utils   | `app/src/hooks/useAlerts.ts`       |

### Variables de entorno requeridas en el host

```
NEXT_PUBLIC_HOST_URL=http://localhost:3000
```

El MFE llama a `${NEXT_PUBLIC_HOST_URL}/api/alerts`.

### Rutas que necesita el host

Los `<Link>` del MFE apuntan a `/dashboard/alerts/*`. El host debe exponer:

```
app/dashboard/alerts/page.tsx       → <AlertsListPage />
app/dashboard/alerts/new/page.tsx   → <NewAlertPage />
```

---

## Desarrollo local (standalone)

```bash
npm install
npm run dev      # http://localhost:3004
```

## Build y publicación

```bash
npm run build:lib   # tsup + tsc + tailwind → /dist
npm run pack:dry    # ver qué entraría al tarball
npm publish
```

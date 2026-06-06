# transactions-mfe

Microfrontend de Transacciones — paquete dual:

- **App Next.js standalone** en `:3001` para desarrollo aislado del MFE.
- **Librería npm** que un host Next.js puede instalar e importar como componentes React (sin iframe, sin multi-zone).

---

## Instalación (como librería en un host)

```bash
npm install transactions-mfe
```

`react`, `react-dom` y `next` son **peerDependencies** — los provee el host.

## Uso desde el host

```tsx
// app/dashboard/transactions/page.tsx
import { TransactionsListPage } from "transactions-mfe";
import "transactions-mfe/styles.css";

export default function Page() {
  return <TransactionsListPage />;
}
```

Componentes exportados:

| Export                | Origen en el repo            |
|-----------------------|------------------------------|
| `TransactionsListPage`| `app/page.tsx`               |
| `NewTransactionPage`  | `app/new/page.tsx`           |
| `EditTransactionPage` | `app/edit/[id]/page.tsx`     |
| `Sidebar`             | `app/components/Sidebar.tsx` |
| `EmbeddedShell`       | `app/components/EmbeddedShell.tsx` |

### Variables de entorno requeridas en el host

```
NEXT_PUBLIC_API_URL=http://localhost:3000
```

El MFE llama a `${NEXT_PUBLIC_API_URL}/api/transactions`.

---

## Desarrollo local (modo standalone)

```bash
npm install
npm run dev      # levanta el MFE en http://localhost:3001
```

Sigue funcionando como app Next.js completa, con sidebar/topbar propios.

---

## Empaquetado y publicación

```bash
npm run build:lib     # tsup → /dist (ESM + CJS + d.ts) + styles.css
npm run pack:dry      # ver qué entraría al tarball
npm publish           # publica al registry configurado
```

`prepublishOnly` corre `build:lib` automáticamente, así que `npm publish`
nunca sube código sin compilar.

### Estructura del tarball publicado

```
transactions-mfe-1.0.0.tgz
├── dist/
│   ├── index.js        ESM
│   ├── index.cjs       CommonJS
│   ├── index.d.ts      tipos
│   └── styles.css      Tailwind compilado
├── package.json
├── README.md
└── LICENSE
```

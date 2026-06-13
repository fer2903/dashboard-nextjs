/**
 * Entry point del paquete npm `alerts-mfe`.
 *
 * Re-exporta las páginas y componentes del microfrontend para que un
 * host Next.js los pueda importar directamente sin levantar el MFE
 * como app independiente ni embeberlo en un iframe.
 *
 * Uso típico desde el host:
 *
 *   // app/dashboard/alerts/page.tsx
 *   import { AlertsListPage } from "alerts-mfe";
 *   import "alerts-mfe/styles.css";
 *
 *   export default function Page() {
 *     return <AlertsListPage />;
 *   }
 *
 * Las páginas asumen un host que provea:
 *  - `next/navigation` (router)
 *  - `next/link`
 *  - `swr` (dep para useAlerts)
 *  - Una API en `process.env.NEXT_PUBLIC_HOST_URL` con los endpoints
 *    `/api/alerts` y `/api/alerts/:id`
 */

export { default as AlertsListPage } from "../app/page";
export { default as NewAlertPage } from "../app/new/page";
export { default as EmbeddedShell } from "../app/components/EmbeddedShell";

// Hook + utilidades de datos — el host puede reutilizarlos
export {
  useAlerts,
  createAlert,
  markAlertRead,
  deleteAlert,
} from "../app/src/hooks/useAlerts";
export type { AppAlert } from "../app/src/hooks/useAlerts";

import { AlertsListPage } from "alerts-mfe";
import "alerts-mfe/styles.css";
import { requireModuleAccess } from "@/app/src/lib/entitlements";
/**
 * Página: /dashboard/alerts
 *
 * Renderiza el MFE de Alertas dentro del layout del host.
 *
 * Control de acceso: solo los usuarios suscritos al módulo "alerts"
 * (o un admin) pueden ver esta página. `requireModuleAccess` redirige
 * antes de renderizar si el usuario no tiene acceso.
 */
export default async function Page() {
  await requireModuleAccess("alerts");
  return <AlertsListPage />;
}
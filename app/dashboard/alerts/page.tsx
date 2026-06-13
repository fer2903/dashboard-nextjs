import { AlertsListPage } from "alerts-mfe";
import "alerts-mfe/styles.css";
/**
 * Página: /dashboard/alerts
 *
 * Renderiza el MFE de Alertas dentro del layout del host
 * mediante un iframe. El MFE detecta que está embebido y oculta
 * su propio sidebar y topbar (ver EmbeddedShell.tsx en el MFE).
 *
 * Si el MFE no está corriendo en :3004, el iframe mostrará un error
 * de conexión del navegador.
 */
export default function Page() {
  return <AlertsListPage />;
}
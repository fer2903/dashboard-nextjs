/**
 * Ruta del host que monta la página de "Nueva Alerta" del MFE.
 * El paquete `alerts-mfe` provee el componente; el host solo
 * lo expone en la ruta `/dashboard/alerts/new`.
 */
import { NewAlertPage } from "alerts-mfe";

export default function Page() {
  return <NewAlertPage />;
}

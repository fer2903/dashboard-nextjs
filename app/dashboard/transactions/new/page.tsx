/**
 * Ruta del host que monta la página de "Nueva Transacción" del MFE.
 * El paquete `transactions-mfe` provee el componente; el host solo
 * lo expone en la ruta `/dashboard/transactions/new`.
 */
import { NewTransactionPage } from "transactions-mfe";

export default function Page() {
  return <NewTransactionPage />;
}

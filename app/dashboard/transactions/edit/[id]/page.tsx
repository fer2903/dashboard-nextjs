/**
 * Ruta del host que monta la página de "Editar Transacción" del MFE.
 * El paquete `transactions-mfe` provee el componente; el host solo
 * lo expone en la ruta `/dashboard/transactions/edit/[id]`.
 */
import { EditTransactionPage } from "transactions-mfe";

export default function Page() {
  return <EditTransactionPage />;
}

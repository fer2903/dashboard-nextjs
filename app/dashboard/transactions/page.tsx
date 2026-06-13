import { TransactionsListPage } from "transactions-mfe";
import "transactions-mfe/styles.css";

export default function Page() {
  return <TransactionsListPage />;
}
/**
 * Página: /dashboard/transactions
 *
 * Renderiza el MFE de Transacciones dentro del layout del host
 * mediante un iframe. El MFE detecta que está embebido y oculta
 * su propio sidebar y topbar (ver EmbeddedShell.tsx en el MFE).
 *
 * El host mantiene su Sidebar y TopBar visibles normalmente.
 *
 * Si el MFE no está corriendo en :3001, el iframe mostrará un error
 * de conexión del navegador.
 */
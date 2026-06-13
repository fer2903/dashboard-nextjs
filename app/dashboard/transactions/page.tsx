/**
 * Página: /dashboard/transactions
 *
 * Renderiza el MFE de Transacciones como componente React directamente
 * dentro del host. Reemplaza al iframe anterior que apuntaba a :3001
 * (causa del error "localhost rechazó la conexión" cuando el MFE no
 * estaba corriendo en standalone).
 *
 * El paquete `transactions-mfe` se instala vía npm y expone sus páginas
 * como componentes React. El bundle publicado ya trae `"use client"`
 * inyectado, así que esta página puede ser Server Component.
 *
 * El MFE llama a la API del host vía NEXT_PUBLIC_API_URL
 * (fallback http://localhost:3000).
 */
import { TransactionsListPage } from "transactions-mfe";
import "transactions-mfe/styles.css";

export default function TransactionsPage() {
  return <TransactionsListPage />;
}

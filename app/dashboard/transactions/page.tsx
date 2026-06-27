import { TransactionsListPage } from "transactions-mfe";
import "transactions-mfe/styles.css";
import { requireModuleAccess } from "@/app/src/lib/entitlements";

export default async function Page() {
  await requireModuleAccess("transactions");
  return <TransactionsListPage />;
}
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
 * Si el MFE no está corriendo en :3001, el iframe mostrará un error
 * de conexión del navegador.
 */

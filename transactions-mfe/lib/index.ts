/**
 * Entry point del paquete npm `transactions-mfe`.
 *
 * Re-exporta las páginas y componentes del microfrontend para que un
 * host Next.js los pueda importar directamente sin levantar el MFE
 * como app independiente ni embeberlo en un iframe.
 *
 * Uso típico desde el host:
 *
 *   // app/dashboard/transactions/page.tsx
 *   import { TransactionsListPage } from "transactions-mfe";
 *   import "transactions-mfe/styles.css";
 *
 *   export default function Page() {
 *     return <TransactionsListPage />;
 *   }
 *
 * Las páginas asumen un host que provea:
 *  - `next/navigation` (router, params)
 *  - `next/link`
 *  - Una API en `process.env.NEXT_PUBLIC_API_URL` con los endpoints
 *    `/api/transactions` y `/api/transactions/:id`
 */

export { default as TransactionsListPage } from "../app/page";
export { default as NewTransactionPage } from "../app/new/page";
export { default as EditTransactionPage } from "../app/edit/[id]/page";
export { default as Sidebar } from "../app/components/Sidebar";
export { default as EmbeddedShell } from "../app/components/EmbeddedShell";

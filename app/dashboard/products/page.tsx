"use client";

/**
 * Página: /dashboard/products
 *
 * Renderiza el MFE de Productos como componente React dentro del host.
 *
 * IMPORTANTE — directiva "use client":
 *   El bundle publicado de `products-mfe` no incluyó la directiva
 *   "use client" al inicio del archivo. Sin esa marca, Next.js lo
 *   compila en contexto RSC y resuelve `swr` contra su entry point
 *   `react-server.mjs`, que no expone el default export de useSWR
 *   (error: "Export default doesn't exist in target module").
 *
 *   Mientras no se republique el paquete con la directiva incluida,
 *   forzamos contexto cliente aquí.
 */
import { ProductsListPage } from "products-mfe";
import "products-mfe/styles.css";

export default function ProductsPage() {
  return <ProductsListPage />;
}

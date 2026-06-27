"use client";

/**
 * Wrapper cliente del MFE de Productos.
 *
 * El bundle publicado de `products-mfe` no incluye la directiva "use client",
 * por lo que debe renderizarse en contexto cliente (de lo contrario Next.js lo
 * compila en contexto RSC y `swr` resuelve contra react-server.mjs, sin default
 * export). Mantener este wrapper permite que la página (page.tsx) sea un Server
 * Component y pueda aplicar el guard de acceso server-side.
 */
import { ProductsListPage } from "products-mfe";
import "products-mfe/styles.css";

export default function ProductsClient() {
  return <ProductsListPage />;
}

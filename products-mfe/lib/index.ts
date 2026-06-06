/**
 * Entry point del paquete npm `products-mfe`.
 *
 * Re-exporta las páginas y componentes del microfrontend para que un
 * host Next.js los pueda importar directamente sin levantar el MFE
 * como app independiente ni embeberlo en un iframe.
 *
 * Uso típico desde el host:
 *
 *   // app/dashboard/products/page.tsx
 *   import { ProductsListPage } from "products-mfe";
 *   import "products-mfe/styles.css";
 *
 *   export default function Page() {
 *     return <ProductsListPage />;
 *   }
 *
 * Las páginas asumen un host que provea:
 *  - `next/navigation` (router, params)
 *  - `next/link`
 *  - `swr` (peer/dep para useProducts)
 *  - Una API en `process.env.NEXT_PUBLIC_HOST_URL` con los endpoints
 *    `/api/products` y `/api/products/:id`
 */

export { default as ProductsListPage } from "../app/page";
export { default as NewProductPage } from "../app/new/page";
export { default as EditProductPage } from "../app/edit/[id]/page";
export { default as EmbeddedShell } from "../app/components/EmbeddedShell";

// Hook + utilidades de datos — el host puede reutilizarlos
export {
  useProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../app/src/hooks/useProducts";
export type { AppProduct } from "../app/src/hooks/useProducts";

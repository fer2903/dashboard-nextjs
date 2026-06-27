/**
 * Página: /dashboard/products
 *
 * Server Component que aplica el control de acceso por suscripción antes de
 * renderizar el MFE de Productos. Solo los usuarios suscritos al módulo
 * "products" (o un admin) pueden verlo; en caso contrario `requireModuleAccess`
 * redirige antes de renderizar.
 *
 * El MFE en sí se monta dentro de ProductsClient ("use client"), porque su
 * bundle requiere contexto cliente (ver ProductsClient.tsx).
 */
import { requireModuleAccess } from "@/app/src/lib/entitlements";
import ProductsClient from "./ProductsClient";

export default async function ProductsPage() {
  await requireModuleAccess("products");
  return <ProductsClient />;
}

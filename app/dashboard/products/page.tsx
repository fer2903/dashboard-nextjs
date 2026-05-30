/**
 * Página: /dashboard/products
 *
 * Renderiza el MFE de Productos dentro del layout del host
 * mediante un iframe. El MFE detecta que está embebido y oculta
 * su propio sidebar y topbar (ver EmbeddedShell.tsx en el MFE).
 *
 * Si el MFE no está corriendo en :3003, el iframe mostrará un error
 * de conexión del navegador.
 */
const MFE_URL = process.env.NEXT_PUBLIC_PRODUCTS_MFE_URL ?? "http://localhost:3003";

export default function ProductsPage() {
  return (
    <iframe
      src={`${MFE_URL}/dashboard/products`}
      title="Módulo de Productos"
      style={{
        width: "100%",
        height: "calc(100vh - 64px)",
        border: "none",
        display: "block",
        backgroundColor: "var(--background)",
      }}
    />
  );
}

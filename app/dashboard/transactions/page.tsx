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
export default function TransactionsPage() {
  return (
    <iframe
      src="http://localhost:3001/dashboard/transactions"
      title="Módulo de Transacciones"
      style={{
        width: "100%",
        height: "calc(100vh - 64px)", // 100vh menos la altura del TopBar del host
        border: "none",
        display: "block",
        backgroundColor: "var(--background)",
      }}
    />
  );
}

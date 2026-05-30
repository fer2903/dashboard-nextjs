/**
 * Página: /dashboard/alerts
 *
 * Renderiza el MFE de Alertas dentro del layout del host
 * mediante un iframe. El MFE detecta que está embebido y oculta
 * su propio sidebar y topbar (ver EmbeddedShell.tsx en el MFE).
 *
 * Si el MFE no está corriendo en :3004, el iframe mostrará un error
 * de conexión del navegador.
 */
const MFE_URL = process.env.NEXT_PUBLIC_ALERTS_MFE_URL ?? "http://localhost:3004";

export default function AlertsPage() {
  return (
    <iframe
      src={`${MFE_URL}/dashboard/alerts`}
      title="Módulo de Alertas"
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

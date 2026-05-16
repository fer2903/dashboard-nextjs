import type { NextConfig } from "next";

/**
 * Configuración del Host App (dashboard-nextjs)
 *
 * Los rewrites Multi-zone fueron reemplazados por un iframe en
 * app/dashboard/transactions/page.tsx. El iframe carga el MFE
 * directamente desde localhost:3001, manteniendo el layout del
 * host (sidebar + topbar) intacto.
 *
 * El MFE detecta que está en un iframe y oculta su propio chrome
 * (ver transactions-mfe/app/components/EmbeddedShell.tsx).
 */
const nextConfig: NextConfig = {};

export default nextConfig;

import type { NextConfig } from "next";

/**
 * Configuración del Host App (dashboard-nextjs)
 *
 * Multi-zone Microfrontend Integration
 * ─────────────────────────────────────────────────────────────────
 * El patrón Multi-zone de Next.js permite que múltiples apps Next.js
 * se comporten como una sola desde el punto de vista del navegador.
 *
 * Aquí configuramos el HOST que delega /dashboard/transactions
 * al MFE que corre en puerto 3001.
 *
 * Flujo de una petición a /dashboard/transactions:
 *  1. Browser → localhost:3000/dashboard/transactions
 *  2. Next.js (host) aplica el rewrite
 *  3. Host → localhost:3001/dashboard/transactions (MFE)
 *  4. MFE responde con su HTML/JS
 *  5. Browser recibe el contenido del MFE pero la URL sigue siendo :3000
 */
const nextConfig: NextConfig = {
  async rewrites() {
    return [
      // Delegar /dashboard/transactions y todas sus sub-rutas al MFE
      {
        source: "/dashboard/transactions",
        destination: "http://localhost:3001/dashboard/transactions",
      },
      {
        source: "/dashboard/transactions/:path*",
        destination: "http://localhost:3001/dashboard/transactions/:path*",
      },
    ];
  },
};

export default nextConfig;

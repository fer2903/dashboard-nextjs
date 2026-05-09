import type { NextConfig } from "next";

/**
 * Configuración del Microfrontend de Transacciones
 *
 * Patrón: Next.js Multi-zone
 * ─────────────────────────────────────────────────────────
 * basePath: '/dashboard/transactions'
 *   → Todas las rutas de este MFE se sirven bajo ese prefijo.
 *     Next.js lo prepend automáticamente a los Links y router.push().
 *
 * assetPrefix: Solo necesario en producción si el MFE corre en
 *   un dominio distinto al host. En desarrollo localhost no hace falta.
 *
 * Integración en el host (dashboard-nextjs):
 *   El host tiene rewrites que redirigen:
 *   /dashboard/transactions/:path* → http://localhost:3001/dashboard/transactions/:path*
 */
const nextConfig: NextConfig = {
  basePath: "/dashboard/transactions",

  // Permite que el host (localhost:3000) llame a los assets del MFE
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "Access-Control-Allow-Origin", value: "http://localhost:3000" },
          { key: "Access-Control-Allow-Methods", value: "GET,POST,PUT,DELETE,OPTIONS" },
          { key: "Access-Control-Allow-Headers", value: "Content-Type, Authorization" },
        ],
      },
    ];
  },
};

export default nextConfig;

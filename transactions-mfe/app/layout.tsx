import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "./components/Sidebar";

export const metadata: Metadata = {
  title: "Transacciones — Crypto Dashboard MFE",
  description: "Microfrontend de gestión de transacciones",
};

/**
 * Layout raíz del MFE de Transacciones
 *
 * Estructura idéntica al host app:
 *  - Sidebar izquierdo (dark navy, MFE-specific nav)
 *  - Área de contenido principal con fondo gris
 *
 * Con basePath='/dashboard/transactions' configurado en next.config.ts,
 * este layout se sirve correctamente cuando el host lo proxea.
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>
        <div
          className="flex min-h-screen"
          style={{ backgroundColor: "var(--background)" }}
        >
          {/* Sidebar del MFE */}
          <Sidebar />

          {/* Contenido principal */}
          <div className="flex-1 flex flex-col min-w-0">
            {/* TopBar del MFE */}
            <header
              className="h-16 flex items-center px-6 shrink-0"
              style={{
                backgroundColor: "rgba(244,246,248,0.95)",
                borderBottom: "1px solid rgba(145,158,171,0.24)",
                position: "sticky",
                top: 0,
                zIndex: 40,
              }}
            >
              {/* Breadcrumb */}
              <div className="flex-1">
                <nav className="flex items-center gap-1.5 text-xs mb-0.5">
                  <span style={{ color: "var(--text-secondary)" }}>Inicio</span>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                  <span style={{ color: "var(--text-secondary)" }}>Gestión</span>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                  <span className="font-semibold" style={{ color: "var(--text-primary)" }}>
                    Transacciones
                  </span>
                </nav>
                <h1
                  className="text-xl font-bold leading-none"
                  style={{ color: "var(--text-primary)" }}
                >
                  Transacciones
                </h1>
              </div>

              {/* Badge de microfrontend */}
              <div
                className="hidden sm:flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full"
                style={{
                  backgroundColor: "rgba(79,70,229,0.10)",
                  color: "var(--primary)",
                  border: "1px solid rgba(79,70,229,0.20)",
                }}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
                Microfrontend · Puerto 3001
              </div>
            </header>

            {/* Página */}
            <main className="flex-1 overflow-auto">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}

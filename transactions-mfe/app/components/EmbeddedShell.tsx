"use client";

/**
 * EmbeddedShell
 *
 * Detecta si el MFE está corriendo dentro de un iframe (embebido en el host)
 * o de forma standalone en localhost:3001.
 *
 * - Standalone → muestra Sidebar + TopBar propios del MFE
 * - Embebido   → solo renderiza el contenido, sin chrome extra
 */

import { useState, useEffect } from "react";
import Sidebar from "./Sidebar";

export default function EmbeddedShell({ children }: { children: React.ReactNode }) {
  const [isEmbedded, setIsEmbedded] = useState(false);

  useEffect(() => {
    try {
      // Si window.self !== window.top → estamos dentro de un iframe
      setIsEmbedded(window.self !== window.top);
    } catch {
      // Si lanza error (cross-origin) → definitivamente en iframe
      setIsEmbedded(true);
    }
  }, []);

  // Modo embebido: solo el contenido, sin sidebar ni topbar propios
  if (isEmbedded) {
    return (
      <div style={{ backgroundColor: "var(--background)", minHeight: "100vh" }}>
        {children}
      </div>
    );
  }

  // Modo standalone (localhost:3001 directo): layout completo con sidebar
  return (
    <div className="flex min-h-screen" style={{ backgroundColor: "var(--background)" }}>
      <Sidebar />

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
            <h1 className="text-xl font-bold leading-none" style={{ color: "var(--text-primary)" }}>
              Transacciones
            </h1>
          </div>

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

        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

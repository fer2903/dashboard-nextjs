"use client";

import { useState, useEffect } from "react";

/**
 * EmbeddedShell
 *
 * Detecta si el MFE está corriendo dentro de un iframe (embedded)
 * o de forma standalone (acceso directo en el navegador).
 *
 * - Modo embedded (iframe): renderiza solo el contenido, sin chrome propio.
 * - Modo standalone: renderiza con un header básico para poder navegar.
 */
export default function EmbeddedShell({ children }: { children: React.ReactNode }) {
  const [isEmbedded, setIsEmbedded] = useState(false);

  useEffect(() => {
    try {
      setIsEmbedded(window.self !== window.top);
    } catch {
      // Si hay error de seguridad cross-origin, asumimos que estamos embebidos
      setIsEmbedded(true);
    }
  }, []);

  if (isEmbedded) {
    // Modo iframe: solo el contenido
    return (
      <div style={{ backgroundColor: "var(--background)", minHeight: "100vh" }}>
        {children}
      </div>
    );
  }

  // Modo standalone: mostrar un header básico
  return (
    <div style={{ minHeight: "100vh", backgroundColor: "var(--background)" }}>
      <header
        style={{
          height: 56,
          backgroundColor: "#fff",
          borderBottom: "1px solid var(--border)",
          display: "flex",
          alignItems: "center",
          padding: "0 24px",
          gap: 12,
        }}
      >
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: 8,
            background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
            <path d="M20 7H4c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2zm-1 11H5c-.55 0-1-.45-1-1V10c0-.55.45-1 1-1h14c.55 0 1 .45 1 1v7c0 .55-.45 1-1 1zm-7-9c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3zm0 4c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z"/>
          </svg>
        </div>
        <span style={{ fontWeight: 700, fontSize: 15, color: "var(--text-primary)" }}>
          MFE Productos
        </span>
        <span style={{ fontSize: 11, color: "var(--text-disabled)", marginLeft: 4 }}>
          modo standalone
        </span>
      </header>
      <main>{children}</main>
    </div>
  );
}

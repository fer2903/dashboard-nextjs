"use client";

import { useState, useEffect } from "react";

export default function EmbeddedShell({ children }: { children: React.ReactNode }) {
  const [isEmbedded, setIsEmbedded] = useState(false);

  useEffect(() => {
    try {
      setIsEmbedded(window.self !== window.top);
    } catch {
      setIsEmbedded(true);
    }
  }, []);

  if (isEmbedded) {
    return (
      <div style={{ backgroundColor: "var(--background)", minHeight: "100vh" }}>
        {children}
      </div>
    );
  }

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
            background: "linear-gradient(135deg, #e11d48, #be123c)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
        </div>
        <span style={{ fontWeight: 700, fontSize: 15, color: "var(--text-primary)" }}>
          MFE Alertas
        </span>
        <span style={{ fontSize: 11, color: "var(--text-disabled)", marginLeft: 4 }}>
          modo standalone
        </span>
      </header>
      <main>{children}</main>
    </div>
  );
}

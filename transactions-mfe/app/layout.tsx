import type { Metadata } from "next";
import "./globals.css";
import EmbeddedShell from "./components/EmbeddedShell";

export const metadata: Metadata = {
  title: "Transacciones — Crypto Dashboard MFE",
  description: "Microfrontend de gestión de transacciones",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>
        {/*
          EmbeddedShell detecta en el cliente si el MFE está dentro
          de un iframe (embebido en el host) o standalone en :3001.
          - Embebido  → solo renderiza children (sin sidebar/topbar propios)
          - Standalone → layout completo con sidebar y topbar
        */}
        <EmbeddedShell>{children}</EmbeddedShell>
      </body>
    </html>
  );
}

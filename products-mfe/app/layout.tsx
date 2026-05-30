import type { Metadata } from "next";
import "./globals.css";
import EmbeddedShell from "./components/EmbeddedShell";

export const metadata: Metadata = {
  title: "Productos MFE",
  description: "Módulo de gestión de productos",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>
        <EmbeddedShell>{children}</EmbeddedShell>
      </body>
    </html>
  );
}

import { defineConfig } from "tsup";

/**
 * Configuración de empaquetado del MFE como librería npm.
 *
 * - Genera bundle ESM (.js) y CJS (.cjs) en /dist
 * - Genera tipos (.d.ts) para autocompletado en el consumidor
 * - Externaliza React, React-DOM y Next para que los provea el host
 *   (evita duplicar React en runtime)
 * - Preserva la directiva "use client" de los componentes del App Router
 *
 * Los estilos (globals.css) se compilan aparte con Tailwind CLI
 * (`npm run build:css`).
 */
export default defineConfig({
  entry: ["lib/index.ts"],
  format: ["esm", "cjs"],
  dts: true,
  sourcemap: true,
  clean: true,
  splitting: false,
  treeshake: true,
  target: "es2020",
  external: [
    "react",
    "react-dom",
    "react/jsx-runtime",
    "next",
    "next/link",
    "next/navigation",
    "next/font/google",
  ],
  esbuildOptions(options) {
    // Preserva la directiva "use client" para que Next.js del host
    // la reconozca correctamente al hidratar los componentes.
    options.banner = { js: '"use client";' };
    options.jsx = "automatic";
  },
});

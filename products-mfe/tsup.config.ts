import { defineConfig } from "tsup";

/**
 * Empaquetado del MFE como librería npm.
 *
 * NOTA — Generación de .d.ts:
 *   tsup tiene su propio generador de tipos basado en rollup-plugin-dts.
 *   Falla cuando el código fuente usa:
 *     · `jsx: "preserve"` en tsconfig
 *     · path aliases (`@/...`)
 *     · imports profundos de paquetes con tipos complejos (ej. swr)
 *
 *   Por eso DESACTIVAMOS dts aquí (`dts: false`) y delegamos la
 *   emisión de tipos a `tsc -p tsconfig.build.json` en el script
 *   `build:lib` del package.json.
 */
export default defineConfig({
  entry: ["lib/index.ts"],
  format: ["esm", "cjs"],
  dts: false, // ← lo emite tsc
  sourcemap: true,
  clean: true,
  splitting: false,
  treeshake: true,
  target: "es2020",

  // ⚠️ CRÍTICO: el banner se aplica a nivel tsup (no en esbuildOptions)
  // para que se inyecte ANTES de cualquier import en ambos formatos
  // (ESM y CJS). Si no, Next.js compila el bundle como Server Component
  // y SWR se resuelve contra su entry `react-server.mjs` que no tiene
  // default export → "Export default doesn't exist in target module".
  banner: {
    js: '"use client";',
  },

  // El host provee estas libs en runtime
  external: [
    "react",
    "react-dom",
    "react/jsx-runtime",
    "next",
    "next/link",
    "next/navigation",
    "swr",
  ],
  esbuildOptions(options) {
    options.jsx = "automatic";
  },
});

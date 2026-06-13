import { defineConfig } from "tsup";
import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

/**
 * Empaquetado del MFE como librería npm.
 *
 * Notas:
 *
 * 1. Generación de .d.ts → desactivada aquí (`dts: false`).
 *    La emite `tsc -p tsconfig.build.json` en el script `build:lib`
 *    del package.json. El dts-builder de tsup tiende a fallar
 *    silenciosamente con configs de Next (incremental, paths, etc.)
 *    aunque los imports parezcan limpios.
 *
 * 2. Directiva `"use client"` → NO se puede inyectar con `banner` porque
 *    esbuild detecta "module level directives" en el bundle resultante
 *    y las strippea defensivamente (warning: "use client" was ignored).
 *    Solución: prepender la directiva por post-build en `onSuccess`.
 *    Sin esto Next.js compila el bundle como Server Component y los
 *    hooks de cliente (useState, useRouter) revientan en runtime.
 */
export default defineConfig({
  entry: ["lib/index.ts"],
  format: ["esm", "cjs"],
  dts: false,
  sourcemap: true,
  clean: true,
  splitting: false,
  treeshake: true,
  target: "es2020",

  // El host provee estas libs en runtime
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
    options.jsx = "automatic";
  },

  // Post-build: prepende `"use client";` como primera línea de cada
  // archivo de salida. Es la forma confiable de marcar el bundle como
  // Client Component cuando lo consume un host Next.js.
  async onSuccess() {
    const directive = '"use client";\n';
    const files = ["dist/index.js", "dist/index.cjs"];

    for (const relPath of files) {
      const filePath = resolve(process.cwd(), relPath);
      try {
        const content = await readFile(filePath, "utf8");
        if (!content.startsWith('"use client"')) {
          await writeFile(filePath, directive + content, "utf8");
          // eslint-disable-next-line no-console
          console.log(`[tsup] Inyectada "use client" en ${relPath}`);
        }
      } catch (err) {
        // eslint-disable-next-line no-console
        console.warn(`[tsup] No se pudo prepend "use client" a ${relPath}:`, err);
      }
    }
  },
});

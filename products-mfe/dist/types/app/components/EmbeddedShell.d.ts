/**
 * EmbeddedShell
 *
 * Detecta si el MFE está corriendo dentro de un iframe (embedded)
 * o de forma standalone (acceso directo en el navegador).
 *
 * - Modo embedded (iframe): renderiza solo el contenido, sin chrome propio.
 * - Modo standalone: renderiza con un header básico para poder navegar.
 */
export default function EmbeddedShell({ children }: {
    children: React.ReactNode;
}): import("react/jsx-runtime").JSX.Element;

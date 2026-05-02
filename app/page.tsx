import { redirect } from "next/navigation";

/**
 * Página raíz — /
 *
 * Redirige automáticamente a la página de login.
 *
 * redirect() en el App Router es una función del servidor que envía
 * una respuesta HTTP 307 (Temporary Redirect) al cliente.
 *
 * Si el usuario ya está autenticado, el middleware en middleware.ts
 * permitirá el acceso al dashboard cuando llegue allí desde el login.
 */
export default function Home() {
  redirect("/login");
}

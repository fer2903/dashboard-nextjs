import Stripe from "stripe";

/**
 * Cliente de Stripe — Server-side
 *
 * Stripe SOLO debe usarse en el servidor (API routes, Server Components,
 * Server Actions). Nunca expongas la `STRIPE_SECRET_KEY` al cliente.
 *
 * Este módulo crea una instancia única reutilizable.
 *
 * Variables de entorno requeridas (.env.local):
 *  - STRIPE_SECRET_KEY        → sk_test_... o sk_live_...
 *  - STRIPE_WEBHOOK_SECRET    → whsec_... (para verificar firmas del webhook)
 *  - NEXT_PUBLIC_APP_URL      → URL base de la app (ej: http://localhost:3000)
 *
 * La key publishable (pk_...) NO se usa aquí porque el flujo de Checkout
 * con sesión hospedada no requiere Stripe.js en el cliente — basta con
 * redirigir a la URL que devuelve la API.
 */

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || "";

if (!STRIPE_SECRET_KEY) {
  // Lanzamos el error en runtime cuando se intenta usar el módulo.
  // Así el build no falla si todavía no se han configurado las envs.
  console.warn(
    "[stripe] STRIPE_SECRET_KEY no está definida. Las llamadas a Stripe fallarán hasta configurarla en .env.local"
  );
}

/**
 * Cliente Stripe singleton.
 *
 * No fijamos `apiVersion` para que cada cuenta use la versión que tenga
 * configurada en su dashboard. Si quieres pinear una versión específica,
 * pásala aquí (ej: `apiVersion: "2025-09-30.clover"`).
 */
export const stripe = new Stripe(STRIPE_SECRET_KEY, {
  typescript: true,
});

/**
 * URL base de la aplicación. Se usa para construir las URLs de éxito y
 * cancelación que se le pasan a Stripe Checkout.
 */
export const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

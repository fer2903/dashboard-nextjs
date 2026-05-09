import Link from "next/link";
import { stripe } from "@/app/src/lib/stripe";

/**
 * Página de Éxito — /dashboard/payments/success?session_id=cs_...
 *
 * Server Component. Cuando Stripe completa el pago, redirige al usuario
 * aquí con el `session_id` en el query string. Lo usamos para recuperar
 * los detalles de la sesión y mostrar un resumen.
 *
 * Importante: NO uses esta página como única confirmación de pago en
 * producción — confía en el webhook (`checkout.session.completed`).
 * Aquí solo mostramos info al usuario; la lógica de "marcar como pagado"
 * debería vivir en el webhook.
 *
 * En Next 16, `searchParams` se entrega como Promise.
 */

type SearchParams = Promise<{ session_id?: string }>;

export default async function PaymentSuccessPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { session_id } = await searchParams;

  let amount: number | null = null;
  let currency = "";
  let customerEmail: string | null = null;
  let fetchError: string | null = null;

  if (session_id) {
    try {
      const session = await stripe.checkout.sessions.retrieve(session_id);
      amount = session.amount_total;
      currency = session.currency || "usd";
      customerEmail = session.customer_details?.email ?? null;
    } catch (err) {
      fetchError =
        err instanceof Error ? err.message : "No se pudo recuperar la sesión";
    }
  }

  return (
    <div className="p-6">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center mt-8">
        <div className="text-5xl mb-4">✅</div>
        <h1 className="text-2xl font-bold text-gray-900">¡Pago exitoso!</h1>
        <p className="text-gray-500 text-sm mt-2">
          Gracias por tu compra. Tu pago fue procesado correctamente.
        </p>

        {amount !== null && (
          <div className="bg-gray-50 rounded-lg p-4 mt-6 text-left text-sm">
            <div className="flex justify-between py-1">
              <span className="text-gray-500">Total</span>
              <span className="font-semibold text-gray-900 font-mono">
                ${(amount / 100).toFixed(2)} {currency.toUpperCase()}
              </span>
            </div>
            {customerEmail && (
              <div className="flex justify-between py-1">
                <span className="text-gray-500">Email</span>
                <span className="font-medium text-gray-700">
                  {customerEmail}
                </span>
              </div>
            )}
            {session_id && (
              <div className="flex justify-between py-1">
                <span className="text-gray-500">Sesión</span>
                <span className="font-mono text-xs text-gray-400">
                  {session_id.slice(0, 14)}…
                </span>
              </div>
            )}
          </div>
        )}

        {fetchError && (
          <div className="bg-amber-50 border border-amber-200 text-amber-700 rounded-lg p-3 mt-4 text-xs text-left">
            No se pudieron recuperar los detalles: {fetchError}
          </div>
        )}

        <Link
          href="/dashboard/payments"
          className="inline-block mt-6 px-6 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Volver a Pagos
        </Link>
      </div>
    </div>
  );
}

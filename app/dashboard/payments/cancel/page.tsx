import Link from "next/link";

/**
 * Página de Cancelación — /dashboard/payments/cancel
 *
 * Stripe redirige aquí si el usuario cierra el Checkout o cancela el pago.
 * No se cobró nada — simplemente damos feedback y un camino de regreso.
 */
export default function PaymentCancelPage() {
  return (
    <div className="p-6">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center mt-8">
        <div className="text-5xl mb-4">🚫</div>
        <h1 className="text-2xl font-bold text-gray-900">Pago cancelado</h1>
        <p className="text-gray-500 text-sm mt-2">
          No se realizó ningún cargo. Puedes intentarlo de nuevo cuando quieras.
        </p>

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

"use client";

/**
 * Módulo Payments — /dashboard/payments
 *
 * Demo de integración básica con Stripe Checkout.
 *
 * Flujo:
 *  1. El usuario ve una lista de "productos" demo.
 *  2. Hace clic en "Pagar con Stripe" en uno de ellos.
 *  3. La UI llama a POST /api/stripe/checkout con el item.
 *  4. El servidor crea una Checkout Session y devuelve `url`.
 *  5. Redirigimos al usuario a esa URL (página hospedada por Stripe).
 *  6. Stripe procesa el pago y redirige a /dashboard/payments/success o /cancel.
 *
 * Tarjeta de prueba (modo test):
 *  - Número: 4242 4242 4242 4242
 *  - Cualquier fecha futura, CVC y código postal cualquiera.
 */

import { useState } from "react";

type Product = {
  id: string;
  name: string;
  description: string;
  amount: number;
  icon: string;
};

const DEMO_PRODUCTS: Product[] = [
  {
    id: "starter",
    name: "Plan Starter",
    description: "Acceso básico al dashboard, hasta 100 transacciones",
    amount: 9.99,
    icon: "🌱",
  },
  {
    id: "pro",
    name: "Plan Pro",
    description: "Transacciones ilimitadas + gráficos avanzados",
    amount: 29.99,
    icon: "🚀",
  },
  {
    id: "enterprise",
    name: "Plan Enterprise",
    description: "Soporte prioritario y multi-usuario",
    amount: 99.99,
    icon: "🏢",
  },
];

export default function PaymentsPage() {
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  /**
   * Inicia el flujo de pago llamando a nuestro endpoint y redirigiendo
   * a la URL hospedada de Stripe.
   */
  const handleCheckout = async (product: Product) => {
    setLoadingId(product.id);
    setError(null);

    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: [
            {
              name: product.name,
              amount: product.amount,
              quantity: 1,
            },
          ],
          currency: "usd",
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al iniciar el pago");

      // Redirigir al Checkout hospedado de Stripe
      window.location.href = data.url;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Error desconocido";
      setError(message);
      setLoadingId(null);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Pagos</h1>
          <p className="text-gray-500 text-sm mt-0.5">
            Integración con Stripe Checkout — modo test
          </p>
        </div>

        <div className="flex items-center gap-2 bg-purple-50 border border-purple-200 text-purple-700 text-xs font-medium px-3 py-1.5 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
          Stripe Test Mode
        </div>
      </div>

      {/* Banner informativo con tarjeta de prueba */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-800">
        <p className="font-semibold mb-1">💳 Tarjeta de prueba</p>
        <p className="font-mono text-xs">
          4242 4242 4242 4242 · cualquier fecha futura · CVC 123 · ZIP 12345
        </p>
      </div>

      {/* ── Error ── */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-4 text-sm">
          <p className="font-semibold">⚠️ Error iniciando el pago</p>
          <p className="mt-1">{error}</p>
        </div>
      )}

      {/* ── Grid de productos ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {DEMO_PRODUCTS.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col"
          >
            <div className="text-4xl mb-3">{product.icon}</div>
            <h3 className="text-lg font-semibold text-gray-900">
              {product.name}
            </h3>
            <p className="text-sm text-gray-500 mt-1 flex-1">
              {product.description}
            </p>

            <div className="mt-4 mb-4">
              <span className="text-3xl font-bold text-gray-900">
                ${product.amount}
              </span>
              <span className="text-sm text-gray-400 ml-1">USD</span>
            </div>

            <button
              onClick={() => handleCheckout(product)}
              disabled={loadingId !== null}
              className={`
                w-full py-2.5 rounded-lg text-sm font-medium transition-colors
                ${
                  loadingId === product.id
                    ? "bg-gray-200 text-gray-400 cursor-wait"
                    : "bg-indigo-600 text-white hover:bg-indigo-700 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed"
                }
              `}
            >
              {loadingId === product.id ? "Redirigiendo..." : "Pagar con Stripe"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

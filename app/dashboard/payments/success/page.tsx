import Link from "next/link";
import { stripe } from "@/app/src/lib/stripe";

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
    <div className="p-6 flex items-start justify-center min-h-[70vh] pt-12">
      <div
        className="w-full max-w-md bg-white rounded-xl overflow-hidden"
        style={{
          boxShadow: "0 0 2px 0 rgba(145,158,171,0.2), 0 24px 48px -4px rgba(145,158,171,0.18)",
        }}
      >
        {/* Header verde de éxito */}
        <div
          className="px-8 py-10 text-center"
          style={{
            background: "linear-gradient(135deg, #34d399 0%, #059669 100%)",
          }}
        >
          {/* Icono circular */}
          <div
            className="w-16 h-16 rounded-full mx-auto flex items-center justify-center mb-4"
            style={{ backgroundColor: "rgba(255,255,255,0.24)" }}
          >
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <h1 className="text-2xl font-extrabold text-white">¡Pago Exitoso!</h1>
          <p className="text-green-100 text-sm mt-2">
            Tu pago fue procesado correctamente
          </p>
        </div>

        {/* Detalles */}
        <div className="px-8 py-6 space-y-4">
          {amount !== null && (
            <div
              className="rounded-xl p-4 space-y-3"
              style={{ backgroundColor: "#F4F6F8" }}
            >
              <p
                className="text-xs font-semibold uppercase tracking-[0.08em]"
                style={{ color: "var(--text-secondary)" }}
              >
                Resumen del pago
              </p>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm" style={{ color: "var(--text-secondary)" }}>Total pagado</span>
                  <span
                    className="text-sm font-bold font-mono"
                    style={{ color: "var(--text-primary)" }}
                  >
                    ${(amount / 100).toFixed(2)} {currency.toUpperCase()}
                  </span>
                </div>

                {customerEmail && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm" style={{ color: "var(--text-secondary)" }}>Email</span>
                    <span className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                      {customerEmail}
                    </span>
                  </div>
                )}

                {session_id && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm" style={{ color: "var(--text-secondary)" }}>Referencia</span>
                    <span className="text-xs font-mono" style={{ color: "var(--text-disabled)" }}>
                      {session_id.slice(0, 16)}…
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {fetchError && (
            <div
              className="rounded-lg p-3 text-xs"
              style={{
                backgroundColor: "rgba(245,158,11,0.08)",
                border: "1px solid rgba(245,158,11,0.24)",
                color: "#b45309",
              }}
            >
              No se pudieron recuperar los detalles: {fetchError}
            </div>
          )}

          <Link
            href="/dashboard/payments"
            className="flex items-center justify-center gap-2 w-full py-3 rounded-lg text-sm font-bold text-white transition-all duration-200"
            style={{
              background: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",
              boxShadow: "0 8px 16px 0 rgba(79,70,229,0.28)",
              letterSpacing: "0.04em",
            }}
          >
            VOLVER A PAGOS
          </Link>
        </div>
      </div>
    </div>
  );
}

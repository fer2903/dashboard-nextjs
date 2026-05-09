import Link from "next/link";

export default function PaymentCancelPage() {
  return (
    <div className="p-6 flex items-start justify-center min-h-[70vh] pt-12">
      <div
        className="w-full max-w-md bg-white rounded-xl overflow-hidden"
        style={{
          boxShadow: "0 0 2px 0 rgba(145,158,171,0.2), 0 24px 48px -4px rgba(145,158,171,0.18)",
        }}
      >
        {/* Header naranja/error */}
        <div
          className="px-8 py-10 text-center"
          style={{
            background: "linear-gradient(135deg, #fb923c 0%, #dc2626 100%)",
          }}
        >
          <div
            className="w-16 h-16 rounded-full mx-auto flex items-center justify-center mb-4"
            style={{ backgroundColor: "rgba(255,255,255,0.24)" }}
          >
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </div>
          <h1 className="text-2xl font-extrabold text-white">Pago Cancelado</h1>
          <p className="text-red-100 text-sm mt-2">
            No se realizó ningún cargo a tu cuenta
          </p>
        </div>

        {/* Contenido */}
        <div className="px-8 py-6 space-y-4">
          <div
            className="rounded-xl p-4"
            style={{ backgroundColor: "#F4F6F8" }}
          >
            <div className="flex items-start gap-3">
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
                style={{ backgroundColor: "rgba(245,158,11,0.12)" }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                  Pago no completado
                </p>
                <p className="text-xs mt-0.5" style={{ color: "var(--text-secondary)" }}>
                  Cerraste la ventana de pago o cancelaste el proceso.
                  Puedes intentarlo nuevamente cuando quieras.
                </p>
              </div>
            </div>
          </div>

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

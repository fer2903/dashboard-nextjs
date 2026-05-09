"use client";

import { useState } from "react";

type Product = {
  id: string;
  name: string;
  description: string;
  amount: number;
  icon: string;
  features: string[];
  accent: { gradient: string; shadow: string; badge: string; badgeText: string };
};

const DEMO_PRODUCTS: Product[] = [
  {
    id: "starter",
    name: "Plan Starter",
    description: "Perfecto para comenzar con el dashboard",
    amount: 9.99,
    icon: "🌱",
    features: [
      "Hasta 100 transacciones / mes",
      "Dashboard básico",
      "Soporte por email",
      "Exportación CSV",
    ],
    accent: {
      gradient: "linear-gradient(135deg, #34d399 0%, #059669 100%)",
      shadow: "rgba(5,150,105,0.28)",
      badge: "rgba(5,150,105,0.1)",
      badgeText: "#059669",
    },
  },
  {
    id: "pro",
    name: "Plan Pro",
    description: "Para equipos que necesitan más potencia",
    amount: 29.99,
    icon: "🚀",
    features: [
      "Transacciones ilimitadas",
      "Gráficos avanzados en tiempo real",
      "Soporte prioritario 24/7",
      "API access incluído",
    ],
    accent: {
      gradient: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",
      shadow: "rgba(79,70,229,0.28)",
      badge: "rgba(79,70,229,0.1)",
      badgeText: "#4f46e5",
    },
  },
  {
    id: "enterprise",
    name: "Plan Enterprise",
    description: "Solución completa para grandes empresas",
    amount: 99.99,
    icon: "🏢",
    features: [
      "Todo en Pro",
      "Multi-usuario y roles",
      "SLA garantizado 99.9%",
      "Onboarding dedicado",
    ],
    accent: {
      gradient: "linear-gradient(135deg, #a78bfa 0%, #7c3aed 100%)",
      shadow: "rgba(124,58,237,0.28)",
      badge: "rgba(124,58,237,0.1)",
      badgeText: "#7c3aed",
    },
  },
];

export default function PaymentsPage() {
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCheckout = async (product: Product) => {
    setLoadingId(product.id);
    setError(null);

    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: [{ name: product.name, amount: product.amount, quantity: 1 }],
          currency: "usd",
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al iniciar el pago");
      window.location.href = data.url;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Error desconocido";
      setError(message);
      setLoadingId(null);
    }
  };

  return (
    <div className="p-6 space-y-6">

      {/* ── Banner tarjeta de prueba ─────────────────────────── */}
      <div
        className="rounded-xl p-4 flex items-start gap-3"
        style={{
          backgroundColor: "rgba(59,130,246,0.08)",
          border: "1px solid rgba(59,130,246,0.24)",
        }}
      >
        <div
          className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 text-white"
          style={{ background: "linear-gradient(135deg, #60a5fa, #3b82f6)" }}
        >
          💳
        </div>
        <div>
          <p className="text-sm font-semibold" style={{ color: "#1d4ed8" }}>
            Modo de prueba — Stripe Test Mode
          </p>
          <p className="text-xs mt-0.5 font-mono" style={{ color: "#3b82f6" }}>
            Tarjeta: 4242 4242 4242 4242 · cualquier fecha futura · CVC 123 · ZIP 12345
          </p>
        </div>
        <div
          className="ml-auto flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full shrink-0"
          style={{
            backgroundColor: "rgba(168,85,247,0.12)",
            color: "#9333ea",
          }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
          Test Mode
        </div>
      </div>

      {/* ── Error ───────────────────────────────────────────────── */}
      {error && (
        <div
          className="rounded-xl p-4"
          style={{
            backgroundColor: "rgba(239,68,68,0.08)",
            border: "1px solid rgba(239,68,68,0.24)",
          }}
        >
          <p className="font-semibold text-sm" style={{ color: "#dc2626" }}>
            ⚠️ Error iniciando el pago
          </p>
          <p className="text-sm mt-0.5" style={{ color: "#b91c1c" }}>{error}</p>
        </div>
      )}

      {/* ── Grid de planes ──────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {DEMO_PRODUCTS.map((product, idx) => {
          const isPro = idx === 1; // Plan Pro = destacado
          return (
            <div
              key={product.id}
              className="bg-white rounded-xl flex flex-col relative overflow-hidden transition-all duration-200"
              style={{
                boxShadow: isPro
                  ? `0 0 2px 0 rgba(145,158,171,0.20), 0 20px 40px -4px rgba(79,70,229,0.20)`
                  : "0 0 2px 0 rgba(145,158,171,0.2), 0 12px 24px -4px rgba(145,158,171,0.12)",
                border: isPro ? "2px solid rgba(79,70,229,0.3)" : "none",
              }}
            >
              {/* Badge "Popular" para plan Pro */}
              {isPro && (
                <div
                  className="absolute top-4 right-4 text-[10px] font-bold px-2.5 py-1 rounded-full text-white"
                  style={{ background: "linear-gradient(135deg, #6366f1, #4f46e5)" }}
                >
                  Popular
                </div>
              )}

              {/* Header del card */}
              <div
                className="p-6 pb-4"
                style={{ borderBottom: "1px dashed rgba(145,158,171,0.24)" }}
              >
                {/* Icono */}
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-4"
                  style={{
                    background: product.accent.gradient,
                    boxShadow: `0 8px 16px 0 ${product.accent.shadow}`,
                  }}
                >
                  {product.icon}
                </div>

                {/* Nombre y descripción */}
                <h3
                  className="text-lg font-bold leading-none"
                  style={{ color: "var(--text-primary)" }}
                >
                  {product.name}
                </h3>
                <p className="text-sm mt-1.5" style={{ color: "var(--text-secondary)" }}>
                  {product.description}
                </p>

                {/* Precio */}
                <div className="mt-5 flex items-baseline gap-1.5">
                  <span
                    className="text-4xl font-extrabold"
                    style={{ color: "var(--text-primary)" }}
                  >
                    ${product.amount}
                  </span>
                  <span className="text-sm" style={{ color: "var(--text-disabled)" }}>
                    USD / mes
                  </span>
                </div>
              </div>

              {/* Features */}
              <div className="px-6 py-4 flex-1 space-y-2.5">
                {product.features.map((f, i) => (
                  <div key={i} className="flex items-center gap-2.5">
                    <div
                      className="w-4 h-4 rounded-full flex items-center justify-center shrink-0"
                      style={{ backgroundColor: product.accent.badge }}
                    >
                      <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke={product.accent.badgeText} strokeWidth="3">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                    <span className="text-sm" style={{ color: "var(--text-secondary)" }}>
                      {f}
                    </span>
                  </div>
                ))}
              </div>

              {/* Botón */}
              <div className="px-6 pb-6">
                <button
                  onClick={() => handleCheckout(product)}
                  disabled={loadingId !== null}
                  className="w-full py-3 rounded-lg text-sm font-bold tracking-wide transition-all duration-200"
                  style={{
                    background: loadingId === product.id || loadingId !== null
                      ? "#e5e7eb"
                      : product.accent.gradient,
                    color: loadingId !== null ? "#9ca3af" : "white",
                    cursor: loadingId !== null ? "not-allowed" : "pointer",
                    boxShadow: loadingId === null ? `0 8px 16px 0 ${product.accent.shadow}` : "none",
                    letterSpacing: "0.04em",
                  }}
                >
                  {loadingId === product.id ? (
                    <span className="flex items-center justify-center gap-2">
                      <span
                        className="w-4 h-4 border-2 rounded-full animate-spin"
                        style={{ borderColor: "rgba(156,163,175,0.3)", borderTopColor: "#9ca3af" }}
                      />
                      Redirigiendo...
                    </span>
                  ) : (
                    `CONTRATAR ${product.name.split(" ")[1].toUpperCase()}`
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

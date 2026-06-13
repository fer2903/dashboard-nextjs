"use client";

/**
 * Página: Nueva Transacción — /dashboard/transactions/new
 *
 * Formulario para crear una transacción llamando a:
 * POST {NEXT_PUBLIC_API_URL}/api/transactions
 *
 * Body: { user, coin, amount }
 */

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const COINS = [
  { value: "BTC",  label: "Bitcoin (BTC)"  },
  { value: "ETH",  label: "Ethereum (ETH)" },
  { value: "SOL",  label: "Solana (SOL)"   },
  { value: "BNB",  label: "BNB Chain (BNB)"},
  { value: "XRP",  label: "XRP"            },
  { value: "USDT", label: "Tether (USDT)"  },
  { value: "USDC", label: "USD Coin (USDC)"},
  { value: "DOGE", label: "Dogecoin (DOGE)"},
  { value: "ADA",  label: "Cardano (ADA)"  },
  { value: "MATIC",label: "Polygon (MATIC)"},
];

// ── Campo de formulario ─────────────────────────────────────────────
const Field = ({
  id, label, children, hint,
}: {
  id: string; label: string; hint?: string; children: React.ReactNode;
}) => (
  <div>
    <div className="flex items-center justify-between mb-1.5">
      <label htmlFor={id} className="text-xs font-semibold"
        style={{ color: "var(--text-secondary)" }}>
        {label}
      </label>
      {hint && <span className="text-[10px]" style={{ color: "var(--text-disabled)" }}>{hint}</span>}
    </div>
    {children}
  </div>
);

// ── Página ──────────────────────────────────────────────────────────
export default function NewTransactionPage() {
  const router = useRouter();
  const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

  const [user, setUser] = useState("");
  const [coin, setCoin] = useState("BTC");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const inputStyle = (focused: boolean) => ({
    width: "100%",
    padding: focused ? "11px 13px" : "12px 14px",
    border: `${focused ? 2 : 1}px solid ${focused ? "var(--primary)" : "var(--border)"}`,
    borderRadius: 8,
    fontSize: "0.875rem",
    color: "var(--text-primary)",
    backgroundColor: "white",
    boxShadow: focused ? "0 0 0 3px rgba(79,70,229,0.08)" : "none",
    outline: "none",
    transition: "all 0.2s",
  });

  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!user.trim()) { setError("El nombre de usuario es requerido"); return; }
    if (!coin)        { setError("Selecciona una moneda"); return; }
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      setError("Ingresa un monto válido mayor a 0");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API}/api/transactions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user: user.trim(), coin, amount: Number(amount) }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message ?? `Error ${res.status}`);
      }

      setSuccess(true);
      // Redirigir a lista después de 1.2s
      setTimeout(() => router.push("/dashboard/transactions"), 1200);

    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al crear la transacción");
    } finally {
      setLoading(false);
    }
  };

  // ── Pantalla de éxito ─────────────────────────────────────────────
  if (success) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #34d399, #059669)" }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <h2 className="text-xl font-bold mb-1" style={{ color: "var(--text-primary)" }}>
            ¡Transacción creada!
          </h2>
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            Redirigiendo a la lista...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="max-w-lg mx-auto">

        {/* Volver */}
        <Link href="/dashboard/transactions"
          className="inline-flex items-center gap-2 text-sm mb-6 transition-colors"
          style={{ color: "var(--text-secondary)" }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          Volver a la lista
        </Link>

        {/* Card del formulario */}
        <div className="bg-white rounded-xl overflow-hidden" style={{ boxShadow: "var(--shadow-card)" }}>

          {/* Header */}
          <div className="px-6 py-5" style={{ borderBottom: "1px solid rgba(145,158,171,0.16)" }}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white"
                style={{ background: "linear-gradient(135deg, #6366f1, #4f46e5)", boxShadow: "0 8px 16px rgba(79,70,229,0.28)" }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
              </div>
              <div>
                <h2 className="text-base font-bold" style={{ color: "var(--text-primary)" }}>
                  Nueva Transacción
                </h2>
                <p className="text-xs mt-0.5" style={{ color: "var(--text-secondary)" }}>
                  POST {API}/api/transactions
                </p>
              </div>
            </div>
          </div>

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="px-6 py-6 space-y-5">

            {/* Error global */}
            {error && (
              <div className="rounded-xl px-4 py-3 text-sm flex items-center gap-2.5"
                style={{ backgroundColor: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.24)", color: "#dc2626" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                {error}
              </div>
            )}

            {/* Usuario */}
            <Field id="user" label="Nombre de usuario" hint="Quien realiza la transacción">
              <input
                id="user" type="text" required
                value={user}
                onChange={e => setUser(e.target.value)}
                onFocus={() => setFocusedField("user")}
                onBlur={() => setFocusedField(null)}
                placeholder="ej. Juan Pérez"
                style={inputStyle(focusedField === "user")}
              />
            </Field>

            {/* Moneda */}
            <Field id="coin" label="Criptomoneda">
              <select
                id="coin" required
                value={coin}
                onChange={e => setCoin(e.target.value)}
                onFocus={() => setFocusedField("coin")}
                onBlur={() => setFocusedField(null)}
                style={inputStyle(focusedField === "coin")}
              >
                {COINS.map(c => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </Field>

            {/* Monto */}
            <Field id="amount" label="Monto" hint="Número de unidades de la criptomoneda">
              <input
                id="amount" type="number" required min="0.000001" step="any"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                onFocus={() => setFocusedField("amount")}
                onBlur={() => setFocusedField(null)}
                placeholder="ej. 0.5"
                style={inputStyle(focusedField === "amount")}
              />
            </Field>

            {/* Preview del body que se enviará */}
            {(user || amount) && (
              <div className="rounded-xl p-4" style={{ backgroundColor: "#F4F6F8" }}>
                <p className="text-[10px] font-semibold uppercase tracking-[0.08em] mb-2"
                  style={{ color: "var(--text-disabled)" }}>
                  Request body (JSON)
                </p>
                <pre className="text-xs font-mono" style={{ color: "var(--text-primary)" }}>
{JSON.stringify({
  user: user || "...",
  coin: coin,
  amount: amount ? Number(amount) : "...",
}, null, 2)}
                </pre>
              </div>
            )}

            {/* Botones */}
            <div className="flex gap-3 pt-1">
              <Link href="/dashboard/transactions"
                className="flex-1 py-3 rounded-lg text-sm font-bold text-center transition-all duration-150"
                style={{ border: "1px solid var(--border)", color: "var(--text-secondary)", backgroundColor: "white" }}>
                Cancelar
              </Link>

              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-3 rounded-lg text-sm font-bold text-white transition-all duration-200"
                style={{
                  background: loading ? "rgba(79,70,229,0.6)" : "linear-gradient(135deg, #6366f1, #4f46e5)",
                  boxShadow: loading ? "none" : "0 8px 16px rgba(79,70,229,0.28)",
                  cursor: loading ? "not-allowed" : "pointer",
                  letterSpacing: "0.04em",
                }}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 rounded-full animate-spin"
                      style={{ borderColor: "rgba(255,255,255,0.3)", borderTopColor: "white" }} />
                    Creando...
                  </span>
                ) : (
                  "CREAR TRANSACCIÓN"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

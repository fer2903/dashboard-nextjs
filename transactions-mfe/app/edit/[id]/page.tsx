"use client";

/**
 * Página: Editar Transacción — /dashboard/transactions/edit/:id
 *
 * Carga la transacción existente y envía un PUT al host:
 * PUT {NEXT_PUBLIC_API_URL}/api/transactions/:id
 */

import { useState, useEffect, FormEvent } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";

const COINS = [
  "BTC","ETH","SOL","BNB","XRP","USDT","USDC","DOGE","ADA","MATIC",
];

type Transaction = {
  _id: string;
  user: string;
  coin: string;
  amount: number;
};

export default function EditTransactionPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

  const [user, setUser]     = useState("");
  const [coin, setCoin]     = useState("BTC");
  const [amount, setAmount] = useState("");
  const [loading, setLoading]   = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError]       = useState<string | null>(null);
  const [success, setSuccess]   = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  // Cargar datos actuales
  useEffect(() => {
    const load = async () => {
      try {
        // La API del host devuelve todas las transacciones; buscamos la que coincide con id
        const res = await fetch(`${API}/api/transactions`);
        if (!res.ok) throw new Error(`Error ${res.status}`);
        const data: Transaction[] = await res.json();
        const tx = data.find(t => t._id === id);
        if (!tx) throw new Error("Transacción no encontrada");
        setUser(tx.user);
        setCoin(tx.coin.toUpperCase());
        setAmount(String(tx.amount));
      } catch (e) {
        setError(e instanceof Error ? e.message : "Error cargando datos");
      } finally {
        setFetching(false);
      }
    };
    load();
  }, [id, API]);

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

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!user.trim()) { setError("El nombre de usuario es requerido"); return; }
    if (isNaN(Number(amount)) || Number(amount) <= 0) {
      setError("Ingresa un monto válido mayor a 0");
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API}/api/transactions/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user: user.trim(), coin, amount: Number(amount) }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message ?? `Error ${res.status}`);
      }
      setSuccess(true);
      setTimeout(() => router.push("/"), 1200);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al actualizar");
    } finally {
      setLoading(false);
    }
  };

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
            ¡Transacción actualizada!
          </h2>
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>Redirigiendo...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="max-w-lg mx-auto">

        <Link href="/" className="inline-flex items-center gap-2 text-sm mb-6 transition-colors"
          style={{ color: "var(--text-secondary)" }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
          </svg>
          Volver a la lista
        </Link>

        <div className="bg-white rounded-xl overflow-hidden" style={{ boxShadow: "var(--shadow-card)" }}>

          {/* Header */}
          <div className="px-6 py-5" style={{ borderBottom: "1px solid rgba(145,158,171,0.16)" }}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white"
                style={{ background: "linear-gradient(135deg, #a78bfa, #7c3aed)", boxShadow: "0 8px 16px rgba(124,58,237,0.28)" }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
              </div>
              <div>
                <h2 className="text-base font-bold" style={{ color: "var(--text-primary)" }}>
                  Editar Transacción
                </h2>
                <p className="text-xs mt-0.5 font-mono" style={{ color: "var(--text-disabled)" }}>
                  ID: {id?.slice(-12)}
                </p>
              </div>
            </div>
          </div>

          {/* Cargando datos */}
          {fetching ? (
            <div className="px-6 py-12 animate-pulse space-y-4">
              {[1,2,3].map(i => (
                <div key={i}>
                  <div className="h-3 w-20 bg-gray-200 rounded mb-2" />
                  <div className="h-11 bg-gray-100 rounded-lg" />
                </div>
              ))}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="px-6 py-6 space-y-5">

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
              <div>
                <label htmlFor="user" className="block text-xs font-semibold mb-1.5"
                  style={{ color: "var(--text-secondary)" }}>Nombre de usuario</label>
                <input id="user" type="text" required value={user}
                  onChange={e => setUser(e.target.value)}
                  onFocus={() => setFocusedField("user")}
                  onBlur={() => setFocusedField(null)}
                  style={inputStyle(focusedField === "user")} />
              </div>

              {/* Moneda */}
              <div>
                <label htmlFor="coin" className="block text-xs font-semibold mb-1.5"
                  style={{ color: "var(--text-secondary)" }}>Criptomoneda</label>
                <select id="coin" required value={coin}
                  onChange={e => setCoin(e.target.value)}
                  onFocus={() => setFocusedField("coin")}
                  onBlur={() => setFocusedField(null)}
                  style={inputStyle(focusedField === "coin")}>
                  {COINS.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              {/* Monto */}
              <div>
                <label htmlFor="amount" className="block text-xs font-semibold mb-1.5"
                  style={{ color: "var(--text-secondary)" }}>Monto</label>
                <input id="amount" type="number" required min="0.000001" step="any"
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  onFocus={() => setFocusedField("amount")}
                  onBlur={() => setFocusedField(null)}
                  style={inputStyle(focusedField === "amount")} />
              </div>

              <div className="flex gap-3 pt-1">
                <Link href="/"
                  className="flex-1 py-3 rounded-lg text-sm font-bold text-center"
                  style={{ border: "1px solid var(--border)", color: "var(--text-secondary)", backgroundColor: "white" }}>
                  Cancelar
                </Link>
                <button type="submit" disabled={loading}
                  className="flex-1 py-3 rounded-lg text-sm font-bold text-white"
                  style={{
                    background: loading ? "rgba(124,58,237,0.6)" : "linear-gradient(135deg, #a78bfa, #7c3aed)",
                    boxShadow: loading ? "none" : "0 8px 16px rgba(124,58,237,0.28)",
                    cursor: loading ? "not-allowed" : "pointer",
                    letterSpacing: "0.04em",
                  }}>
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-4 h-4 border-2 rounded-full animate-spin"
                        style={{ borderColor: "rgba(255,255,255,0.3)", borderTopColor: "white" }} />
                      Guardando...
                    </span>
                  ) : "GUARDAR CAMBIOS"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

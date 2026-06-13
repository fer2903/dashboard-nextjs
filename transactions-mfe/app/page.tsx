"use client";

/**
 * Página principal del MFE — Lista de Transacciones
 *
 * Funcionalidades:
 *  - Listar todas las transacciones (GET /api/transactions)
 *  - Eliminar transacción (DELETE /api/transactions/:id)
 *  - Filtrar por moneda y usuario
 *  - Link a crear nueva transacción
 *  - Link a editar transacción
 *
 * Llama a la API del host: process.env.NEXT_PUBLIC_API_URL/api/transactions
 * En desarrollo: http://localhost:3000/api/transactions
 */

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";

// ── Tipos ───────────────────────────────────────────────────────────
type Transaction = {
  _id: string;
  user: string;
  coin: string;
  amount: number;
  createdAt: string;
};

// ── Colores por moneda (badge) ──────────────────────────────────────
const COIN_STYLES: Record<string, { bg: string; color: string; border: string }> = {
  btc:      { bg: "rgba(217,119,6,0.10)",  color: "#b45309", border: "rgba(217,119,6,0.20)"  },
  bitcoin:  { bg: "rgba(217,119,6,0.10)",  color: "#b45309", border: "rgba(217,119,6,0.20)"  },
  eth:      { bg: "rgba(79,70,229,0.10)",  color: "#4338ca", border: "rgba(79,70,229,0.20)"  },
  ethereum: { bg: "rgba(79,70,229,0.10)",  color: "#4338ca", border: "rgba(79,70,229,0.20)"  },
  sol:      { bg: "rgba(124,58,237,0.10)", color: "#6d28d9", border: "rgba(124,58,237,0.20)" },
  solana:   { bg: "rgba(124,58,237,0.10)", color: "#6d28d9", border: "rgba(124,58,237,0.20)" },
  usdt:     { bg: "rgba(5,150,105,0.10)",  color: "#047857", border: "rgba(5,150,105,0.20)"  },
  usdc:     { bg: "rgba(2,132,199,0.10)",  color: "#0369a1", border: "rgba(2,132,199,0.20)"  },
  bnb:      { bg: "rgba(202,138,4,0.10)",  color: "#a16207", border: "rgba(202,138,4,0.20)"  },
  xrp:      { bg: "rgba(37,99,235,0.10)",  color: "#1d4ed8", border: "rgba(37,99,235,0.20)"  },
  doge:     { bg: "rgba(234,88,12,0.10)",  color: "#c2410c", border: "rgba(234,88,12,0.20)"  },
};
const DEFAULT_COIN = { bg: "rgba(145,158,171,0.12)", color: "#637381", border: "rgba(145,158,171,0.24)" };

const CoinBadge = ({ coin }: { coin: string }) => {
  const s = COIN_STYLES[coin.toLowerCase()] ?? DEFAULT_COIN;
  return (
    <span
      className="inline-flex items-center text-[11px] font-bold px-2.5 py-0.5 rounded-full"
      style={{ backgroundColor: s.bg, color: s.color, border: `1px solid ${s.border}`, letterSpacing: "0.05em" }}
    >
      {coin.toUpperCase()}
    </span>
  );
};

// ── Avatar ──────────────────────────────────────────────────────────
const GRADIENTS = [
  "linear-gradient(135deg,#6366f1,#4f46e5)", "linear-gradient(135deg,#a78bfa,#7c3aed)",
  "linear-gradient(135deg,#38bdf8,#0284c7)", "linear-gradient(135deg,#34d399,#059669)",
  "linear-gradient(135deg,#fb7185,#e11d48)", "linear-gradient(135deg,#fbbf24,#d97706)",
];
const Avatar = ({ name }: { name: string }) => {
  const ch = name?.charAt(0)?.toUpperCase() ?? "?";
  const g = GRADIENTS[(ch.charCodeAt(0) - 65) % GRADIENTS.length];
  return (
    <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
      style={{ background: g, boxShadow: "0 3px 6px rgba(0,0,0,0.12)" }}>
      {ch}
    </div>
  );
};

// ── Skeleton ────────────────────────────────────────────────────────
const Skeleton = () => (
  <div className="animate-pulse">
    {[1,2,3,4,5,6].map(i => (
      <div key={i} className="flex items-center gap-4 px-6 py-4"
        style={{ borderBottom: "1px solid rgba(145,158,171,0.12)" }}>
        <div className="w-8 h-8 rounded-full bg-gray-200 shrink-0" />
        <div className="flex-1 h-4 bg-gray-200 rounded w-28" />
        <div className="h-5 bg-gray-100 rounded-full w-14" />
        <div className="h-4 bg-gray-100 rounded w-20 ml-auto" />
        <div className="h-4 bg-gray-100 rounded w-24" />
        <div className="flex gap-2">
          <div className="w-7 h-7 bg-gray-100 rounded-lg" />
          <div className="w-7 h-7 bg-gray-100 rounded-lg" />
        </div>
      </div>
    ))}
  </div>
);

// ── Página principal ────────────────────────────────────────────────
export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [filterCoin, setFilterCoin] = useState("");
  const [filterUser, setFilterUser] = useState("");

  const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

  // ── Cargar transacciones ──────────────────────────────────────────
  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API}/api/transactions`);
      if (!res.ok) throw new Error(`Error ${res.status}`);
      const data = await res.json();
      setTransactions(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  }, [API]);

  useEffect(() => { load(); }, [load]);

  // ── Eliminar ──────────────────────────────────────────────────────
  const handleDelete = async (id: string) => {
    if (!confirm("¿Eliminar esta transacción? Esta acción no se puede deshacer.")) return;
    setDeletingId(id);
    try {
      const res = await fetch(`${API}/api/transactions/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("No se pudo eliminar");
      setTransactions(prev => prev.filter(t => t._id !== id));
    } catch (e) {
      alert(e instanceof Error ? e.message : "Error al eliminar");
    } finally {
      setDeletingId(null);
    }
  };

  // ── Filtrado ──────────────────────────────────────────────────────
  const filtered = transactions.filter(t => {
    const matchCoin = !filterCoin || t.coin.toLowerCase().includes(filterCoin.toLowerCase());
    const matchUser = !filterUser || t.user.toLowerCase().includes(filterUser.toLowerCase());
    return matchCoin && matchUser;
  });

  // Monedas únicas para el selector
  const coins = [...new Set(transactions.map(t => t.coin))].sort();

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString("es-MX", { day: "numeric", month: "short", year: "numeric" });
  const formatTime = (iso: string) =>
    new Date(iso).toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" });

  return (
    <div className="p-6 space-y-5">

      {/* ── Barra de acciones ────────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-3">

        {/* Filtro por moneda */}
        <select
          value={filterCoin}
          onChange={e => setFilterCoin(e.target.value)}
          className="text-sm px-3 py-2 rounded-lg transition-all outline-none"
          style={{
            border: "1px solid var(--border)",
            backgroundColor: "white",
            color: "var(--text-primary)",
            minWidth: 140,
          }}
        >
          <option value="">Todas las monedas</option>
          {coins.map(c => (
            <option key={c} value={c}>{c.toUpperCase()}</option>
          ))}
        </select>

        {/* Filtro por usuario */}
        <input
          type="text"
          value={filterUser}
          onChange={e => setFilterUser(e.target.value)}
          placeholder="Buscar usuario..."
          className="text-sm px-3 py-2 rounded-lg transition-all outline-none"
          style={{
            border: "1px solid var(--border)",
            backgroundColor: "white",
            color: "var(--text-primary)",
            minWidth: 180,
          }}
        />

        {/* Contador */}
        {!loading && (
          <span className="text-xs ml-1" style={{ color: "var(--text-disabled)" }}>
            {filtered.length} de {transactions.length} transacciones
          </span>
        )}

        {/* Spacer */}
        <div className="flex-1" />

        {/* Refresh */}
        <button
          onClick={load}
          disabled={loading}
          className="w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-150"
          style={{ backgroundColor: "white", border: "1px solid var(--border)", color: "var(--text-secondary)" }}
          title="Refrescar"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
            className={loading ? "animate-spin" : ""}>
            <polyline points="23 4 23 10 17 10" />
            <polyline points="1 20 1 14 7 14" />
            <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
          </svg>
        </button>

        {/* Botón nueva transacción */}
        <Link
          href="/dashboard/transactions/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-bold text-white transition-all duration-200"
          style={{
            background: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",
            boxShadow: "0 8px 16px 0 rgba(79,70,229,0.28)",
            letterSpacing: "0.03em",
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Nueva Transacción
        </Link>
      </div>

      {/* ── Card contenedora ─────────────────────────────────── */}
      <div className="bg-white rounded-xl overflow-hidden" style={{ boxShadow: "var(--shadow-card)" }}>

        {/* Header de la card */}
        <div className="px-6 py-4 flex items-center justify-between"
          style={{ borderBottom: "1px solid rgba(145,158,171,0.16)" }}>
          <div>
            <h2 className="text-base font-bold" style={{ color: "var(--text-primary)" }}>
              Historial de Transacciones
            </h2>
            <p className="text-xs mt-0.5" style={{ color: "var(--text-secondary)" }}>
              CRUD completo · Llamando a {API}/api/transactions
            </p>
          </div>
          {/* Indicador de estado de la API */}
          {!loading && !error && (
            <div className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full"
              style={{ backgroundColor: "rgba(34,197,94,0.10)", color: "#16a34a", border: "1px solid rgba(34,197,94,0.24)" }}>
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              API conectada
            </div>
          )}
        </div>

        {/* ── Loading ──────────────────────────────────────────── */}
        {loading && <Skeleton />}

        {/* ── Error ────────────────────────────────────────────── */}
        {!loading && error && (
          <div className="px-6 py-12 text-center">
            <div className="w-14 h-14 rounded-full mx-auto mb-3 flex items-center justify-center"
              style={{ backgroundColor: "rgba(239,68,68,0.08)" }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>
            <p className="font-semibold mb-1" style={{ color: "#dc2626" }}>{error}</p>
            <p className="text-xs mb-4" style={{ color: "var(--text-secondary)" }}>
              Verifica que el servidor principal esté corriendo en {API}
            </p>
            <button onClick={load}
              className="px-4 py-2 rounded-lg text-sm font-semibold text-white"
              style={{ background: "var(--primary)" }}>
              Reintentar
            </button>
          </div>
        )}

        {/* ── Sin resultados ────────────────────────────────────── */}
        {!loading && !error && filtered.length === 0 && (
          <div className="px-6 py-14 text-center">
            <div className="w-14 h-14 rounded-full mx-auto mb-3 flex items-center justify-center"
              style={{ backgroundColor: "rgba(145,158,171,0.08)" }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--text-disabled)" strokeWidth="1.5">
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 1 0 0 7h5a3.5 3.5 0 1 1 0 7H6" />
              </svg>
            </div>
            <p className="font-semibold" style={{ color: "var(--text-primary)" }}>
              {transactions.length === 0 ? "Sin transacciones" : "Sin resultados para los filtros aplicados"}
            </p>
            {transactions.length === 0 && (
              <Link href="/dashboard/transactions/new"
                className="inline-block mt-4 px-4 py-2 rounded-lg text-sm font-semibold text-white"
                style={{ background: "var(--primary)" }}>
                Crear primera transacción
              </Link>
            )}
          </div>
        )}

        {/* ── Tabla ─────────────────────────────────────────────── */}
        {!loading && !error && filtered.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[700px]">
              <thead>
                <tr style={{ backgroundColor: "#F4F6F8", borderBottom: "1px solid rgba(145,158,171,0.24)" }}>
                  {["Usuario", "Moneda", "Monto", "Fecha", "Acciones"].map((h, i) => (
                    <th key={h}
                      className="px-6 py-3 text-xs font-semibold uppercase tracking-[0.08em]"
                      style={{
                        color: "var(--text-secondary)",
                        textAlign: i >= 2 ? (i === 4 ? "center" : "right") : "left"
                      }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((tx, idx) => {
                  const isLast = idx === filtered.length - 1;
                  return (
                    <tr key={tx._id}
                      className="transition-colors"
                      style={{ borderBottom: isLast ? "none" : "1px solid rgba(145,158,171,0.10)" }}
                      onMouseEnter={e => (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(145,158,171,0.04)"}
                      onMouseLeave={e => (e.currentTarget as HTMLElement).style.backgroundColor = "transparent"}
                    >
                      {/* Usuario */}
                      <td className="px-6 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <Avatar name={tx.user} />
                          <span className="font-medium truncate max-w-[140px]"
                            style={{ color: "var(--text-primary)" }}>
                            {tx.user}
                          </span>
                        </div>
                      </td>

                      {/* Moneda */}
                      <td className="px-6 py-3.5">
                        <CoinBadge coin={tx.coin} />
                      </td>

                      {/* Monto */}
                      <td className="px-6 py-3.5 text-right">
                        <span className="font-semibold font-mono text-sm"
                          style={{ color: "var(--text-primary)" }}>
                          {typeof tx.amount === "number"
                            ? tx.amount.toLocaleString("en-US", { maximumFractionDigits: 6 })
                            : tx.amount}
                        </span>
                      </td>

                      {/* Fecha */}
                      <td className="px-6 py-3.5 text-right">
                        <p className="text-xs font-medium" style={{ color: "var(--text-primary)" }}>
                          {formatDate(tx.createdAt)}
                        </p>
                        <p className="text-[10px] mt-0.5" style={{ color: "var(--text-disabled)" }}>
                          {formatTime(tx.createdAt)}
                        </p>
                      </td>

                      {/* Acciones */}
                      <td className="px-6 py-3.5">
                        <div className="flex items-center justify-center gap-1.5">
                          {/* Editar */}
                          <Link
                            href={`/dashboard/transactions/edit/${tx._id}`}
                            className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-150"
                            style={{ color: "var(--text-secondary)", border: "1px solid var(--border)" }}
                            onMouseEnter={e => {
                              const el = e.currentTarget as HTMLElement;
                              el.style.backgroundColor = "rgba(79,70,229,0.08)";
                              el.style.borderColor = "rgba(79,70,229,0.30)";
                              el.style.color = "var(--primary)";
                            }}
                            onMouseLeave={e => {
                              const el = e.currentTarget as HTMLElement;
                              el.style.backgroundColor = "transparent";
                              el.style.borderColor = "var(--border)";
                              el.style.color = "var(--text-secondary)";
                            }}
                            title="Editar"
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                            </svg>
                          </Link>

                          {/* Eliminar */}
                          <button
                            onClick={() => handleDelete(tx._id)}
                            disabled={deletingId === tx._id}
                            className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-150"
                            style={{ color: "var(--text-secondary)", border: "1px solid var(--border)" }}
                            onMouseEnter={e => {
                              const el = e.currentTarget as HTMLElement;
                              el.style.backgroundColor = "rgba(239,68,68,0.08)";
                              el.style.borderColor = "rgba(239,68,68,0.30)";
                              el.style.color = "#dc2626";
                            }}
                            onMouseLeave={e => {
                              const el = e.currentTarget as HTMLElement;
                              el.style.backgroundColor = "transparent";
                              el.style.borderColor = "var(--border)";
                              el.style.color = "var(--text-secondary)";
                            }}
                            title="Eliminar"
                          >
                            {deletingId === tx._id ? (
                              <span className="w-3 h-3 border-2 border-gray-300 border-t-red-500 rounded-full animate-spin" />
                            ) : (
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <polyline points="3 6 5 6 21 6" />
                                <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                                <path d="M10 11v6M14 11v6" />
                                <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                              </svg>
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* Footer de tabla */}
            <div className="px-6 py-3 flex items-center justify-between"
              style={{ borderTop: "1px solid rgba(145,158,171,0.16)", backgroundColor: "#FAFAFA" }}>
              <p className="text-xs" style={{ color: "var(--text-disabled)" }}>
                {filtered.length} {filtered.length === 1 ? "transacción" : "transacciones"}
                {filterCoin || filterUser ? ` (filtradas de ${transactions.length})` : " en total"}
              </p>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                <span className="text-xs font-medium" style={{ color: "var(--text-secondary)" }}>
                  {API}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

"use client";

import { useTransactions } from "@/app/src/hooks/useTransaction";
import { TransactionRow } from "../../molecules/TransactionRow";

// Skeleton de carga para la tabla
const TableSkeleton = () => (
  <div className="animate-pulse">
    {[1, 2, 3, 4, 5].map((i) => (
      <div key={i} className="flex items-center gap-4 px-5 py-3.5 border-b border-slate-50">
        <div className="w-8 h-8 bg-slate-200 rounded-full" />
        <div className="flex-1 h-4 bg-slate-100 rounded w-32" />
        <div className="h-5 bg-slate-100 rounded-full w-14" />
        <div className="ml-auto h-4 bg-slate-100 rounded w-24" />
        <div className="h-4 bg-slate-100 rounded w-16" />
      </div>
    ))}
  </div>
);

export const TransactionTable = () => {
  const { data, isPending, error } = useTransactions();

  // ── Carga ──────────────────────────────────────────────────────────────
  if (isPending) return <TableSkeleton />;

  // ── Error ──────────────────────────────────────────────────────────────
  if (error) {
    return (
      <div className="rounded-xl bg-red-50 border border-red-100 px-6 py-8 text-center">
        <p className="text-2xl mb-2">⚠️</p>
        <p className="text-sm font-semibold text-red-700">Error al cargar transacciones</p>
        <p className="text-xs text-red-500 mt-1">Verifica la conexión con el servidor</p>
      </div>
    );
  }

  // ── Sin datos ──────────────────────────────────────────────────────────
  if (!data || data.length === 0) {
    return (
      <div className="rounded-xl bg-slate-50 border border-slate-100 px-6 py-10 text-center">
        <p className="text-3xl mb-3">📭</p>
        <p className="text-sm font-semibold text-slate-600">Sin transacciones registradas</p>
        <p className="text-xs text-slate-400 mt-1">Las operaciones aparecerán aquí</p>
      </div>
    );
  }

  // ── Tabla ──────────────────────────────────────────────────────────────
  return (
    <div className="overflow-x-auto -mx-1">
      <table className="w-full text-sm min-w-[560px]">
        <thead>
          <tr className="border-b border-slate-100">
            <th className="text-left px-5 pb-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
              Usuario
            </th>
            <th className="text-left px-5 pb-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
              Moneda
            </th>
            <th className="text-right px-5 pb-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
              Monto
            </th>
            <th className="text-right px-5 pb-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
              Fecha
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {data.map((tx: any) => (
            <TransactionRow key={tx._id ?? tx.id} tx={tx} />
          ))}
        </tbody>
      </table>

      {/* Footer con conteo */}
      <div className="px-5 py-3 border-t border-slate-50 mt-1">
        <p className="text-xs text-slate-400">
          {data.length} {data.length === 1 ? "transacción" : "transacciones"} en total
        </p>
      </div>
    </div>
  );
};

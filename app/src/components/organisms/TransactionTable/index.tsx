"use client";

import { useTransactions } from "@/app/src/hooks/useTransaction";
import { TransactionRow } from "../../molecules/TransactionRow";

// ── Skeleton MUI-style ──────────────────────────────────────────────
const TableSkeleton = () => (
  <div className="animate-pulse">
    {[1, 2, 3, 4, 5].map((i) => (
      <div
        key={i}
        className="flex items-center gap-4 px-6 py-4"
        style={{ borderBottom: "1px solid rgba(145,158,171,0.12)" }}
      >
        <div className="w-8 h-8 bg-gray-200 rounded-full shrink-0" />
        <div className="flex-1 space-y-1.5">
          <div className="h-3.5 bg-gray-200 rounded w-28" />
        </div>
        <div className="h-5 bg-gray-100 rounded-full w-14" />
        <div className="ml-auto h-3.5 bg-gray-100 rounded w-20" />
        <div className="h-3.5 bg-gray-100 rounded w-14" />
      </div>
    ))}
  </div>
);

export const TransactionTable = () => {
  const { data, isPending, error } = useTransactions();

  if (isPending) return <TableSkeleton />;

  if (error) {
    return (
      <div
        className="mx-4 mb-4 rounded-xl px-6 py-8 text-center"
        style={{
          backgroundColor: "rgba(239,68,68,0.06)",
          border: "1px solid rgba(239,68,68,0.20)",
        }}
      >
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3"
          style={{ backgroundColor: "rgba(239,68,68,0.10)" }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>
        <p className="text-sm font-semibold" style={{ color: "#dc2626" }}>
          Error al cargar transacciones
        </p>
        <p className="text-xs mt-1" style={{ color: "#b91c1c" }}>
          Verifica la conexión con el servidor
        </p>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="px-6 py-12 text-center">
        <div
          className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3"
          style={{ backgroundColor: "rgba(145,158,171,0.08)" }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--text-disabled)" strokeWidth="1.5">
            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 1 0 0 7h5a3.5 3.5 0 1 1 0 7H6" />
          </svg>
        </div>
        <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
          Sin transacciones registradas
        </p>
        <p className="text-xs mt-1" style={{ color: "var(--text-secondary)" }}>
          Las operaciones aparecerán aquí
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm min-w-[560px]">
        <thead>
          <tr style={{ backgroundColor: "#F4F6F8", borderBottom: "1px solid rgba(145,158,171,0.24)" }}>
            <th className="text-left px-6 py-3 text-xs font-semibold uppercase tracking-[0.08em]"
              style={{ color: "var(--text-secondary)" }}>
              Usuario
            </th>
            <th className="text-left px-6 py-3 text-xs font-semibold uppercase tracking-[0.08em]"
              style={{ color: "var(--text-secondary)" }}>
              Moneda
            </th>
            <th className="text-right px-6 py-3 text-xs font-semibold uppercase tracking-[0.08em]"
              style={{ color: "var(--text-secondary)" }}>
              Monto
            </th>
            <th className="text-right px-6 py-3 text-xs font-semibold uppercase tracking-[0.08em]"
              style={{ color: "var(--text-secondary)" }}>
              Fecha
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((tx: any, idx: number) => (
            <TransactionRow key={tx._id ?? tx.id} tx={tx} isLast={idx === data.length - 1} />
          ))}
        </tbody>
      </table>

      {/* Footer */}
      <div
        className="px-6 py-3"
        style={{ borderTop: "1px solid rgba(145,158,171,0.16)", backgroundColor: "#FAFAFA" }}
      >
        <p className="text-xs" style={{ color: "var(--text-disabled)" }}>
          {data.length} {data.length === 1 ? "transacción" : "transacciones"} en total
        </p>
      </div>
    </div>
  );
};

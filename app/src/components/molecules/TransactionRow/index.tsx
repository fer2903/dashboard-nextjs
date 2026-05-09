import { Transaction } from "@/app/src/hooks/useTransaction";
import { Badge } from "../../atoms/Badge";

// Avatar con color por nombre
const GRADIENTS = [
  "linear-gradient(135deg, #6366f1, #4f46e5)",
  "linear-gradient(135deg, #a78bfa, #7c3aed)",
  "linear-gradient(135deg, #38bdf8, #0284c7)",
  "linear-gradient(135deg, #34d399, #059669)",
  "linear-gradient(135deg, #fb7185, #e11d48)",
  "linear-gradient(135deg, #fbbf24, #d97706)",
];

const UserAvatar = ({ name }: { name: string }) => {
  const initial = name?.charAt(0)?.toUpperCase() ?? "?";
  const idx = (initial.charCodeAt(0) - 65) % GRADIENTS.length;
  return (
    <div
      className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
      style={{
        background: GRADIENTS[Math.max(0, idx)],
        boxShadow: "0 3px 6px 0 rgba(0,0,0,0.12)",
      }}
    >
      {initial}
    </div>
  );
};

export const TransactionRow = ({
  tx,
  isLast,
}: {
  tx: Transaction;
  isLast?: boolean;
}) => {
  const date = new Date(tx.createdAt);
  const dateStr = date.toLocaleDateString("es-MX", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  const timeStr = date.toLocaleTimeString("es-MX", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <tr
      className="transition-colors"
      style={{ borderBottom: isLast ? "none" : "1px solid rgba(145,158,171,0.12)" }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(145,158,171,0.04)";
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLElement).style.backgroundColor = "transparent";
      }}
    >
      {/* Usuario */}
      <td className="px-6 py-3.5">
        <div className="flex items-center gap-2.5">
          <UserAvatar name={tx.user} />
          <span
            className="text-sm font-medium truncate max-w-[120px]"
            style={{ color: "var(--text-primary)" }}
          >
            {tx.user}
          </span>
        </div>
      </td>

      {/* Moneda */}
      <td className="px-6 py-3.5">
        <Badge value={tx.coin} />
      </td>

      {/* Monto */}
      <td className="px-6 py-3.5 text-right">
        <span
          className="text-sm font-semibold font-mono"
          style={{ color: "var(--text-primary)" }}
        >
          {typeof tx.amount === "number"
            ? tx.amount.toLocaleString("en-US", { maximumFractionDigits: 6 })
            : tx.amount}
        </span>
      </td>

      {/* Fecha */}
      <td className="px-6 py-3.5 text-right">
        <p className="text-xs font-medium" style={{ color: "var(--text-primary)" }}>
          {dateStr}
        </p>
        <p className="text-[10px] mt-0.5" style={{ color: "var(--text-disabled)" }}>
          {timeStr}
        </p>
      </td>
    </tr>
  );
};

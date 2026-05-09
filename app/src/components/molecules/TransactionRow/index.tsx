import { Transaction } from "@/app/src/hooks/useTransaction";
import { Badge } from "../../atoms/Badge";

// Avatar con inicial del usuario
const UserAvatar = ({ name }: { name: string }) => {
  const initial = name?.charAt(0)?.toUpperCase() ?? "?";
  // Color basado en el primer carácter del nombre
  const colors = [
    "from-indigo-500 to-indigo-600",
    "from-violet-500 to-violet-600",
    "from-sky-500 to-sky-600",
    "from-emerald-500 to-emerald-600",
    "from-rose-500 to-rose-600",
    "from-amber-500 to-amber-600",
  ];
  const idx = (initial.charCodeAt(0) - 65) % colors.length;
  const gradient = colors[Math.max(0, idx)];

  return (
    <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-sm`}>
      {initial}
    </div>
  );
};

export const TransactionRow = ({ tx }: { tx: Transaction }) => {
  const date = new Date(tx.createdAt);
  const dateStr = date.toLocaleDateString("es-MX", { day: "numeric", month: "short", year: "numeric" });
  const timeStr = date.toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" });

  return (
    <tr className="group hover:bg-slate-50 transition-colors">
      {/* Usuario */}
      <td className="px-5 py-3.5">
        <div className="flex items-center gap-2.5">
          <UserAvatar name={tx.user} />
          <span className="text-sm font-medium text-slate-800 truncate max-w-[120px]">
            {tx.user}
          </span>
        </div>
      </td>

      {/* Moneda */}
      <td className="px-5 py-3.5">
        <Badge value={tx.coin} />
      </td>

      {/* Monto */}
      <td className="px-5 py-3.5 text-right">
        <span className="text-sm font-semibold text-slate-900 font-mono">
          {typeof tx.amount === "number"
            ? tx.amount.toLocaleString("en-US", { maximumFractionDigits: 6 })
            : tx.amount}
        </span>
      </td>

      {/* Fecha */}
      <td className="px-5 py-3.5 text-right">
        <div className="text-right">
          <p className="text-xs font-medium text-slate-600">{dateStr}</p>
          <p className="text-xs text-slate-400">{timeStr}</p>
        </div>
      </td>
    </tr>
  );
};

/**
 * StatsCard — Tarjeta de estadística (KPI)
 *
 * Variante moderna con:
 *  - Ícono en círculo con color de acento
 *  - Barra de gradiente superior
 *  - Indicador de cambio con color semántico
 */

type Props = {
  icon: string;
  label: string;
  value: string;
  change?: number | null;
  subtitle?: string;
  accent?: "indigo" | "violet" | "emerald" | "amber" | "rose" | "sky";
};

// Mapa de variantes de color para el acento
const ACCENT = {
  indigo:  { bar: "from-indigo-500 to-indigo-400",  ring: "bg-indigo-50",  text: "text-indigo-600" },
  violet:  { bar: "from-violet-500 to-violet-400",  ring: "bg-violet-50",  text: "text-violet-600" },
  emerald: { bar: "from-emerald-500 to-emerald-400", ring: "bg-emerald-50", text: "text-emerald-600" },
  amber:   { bar: "from-amber-500 to-amber-400",    ring: "bg-amber-50",   text: "text-amber-600"   },
  rose:    { bar: "from-rose-500 to-rose-400",      ring: "bg-rose-50",    text: "text-rose-600"    },
  sky:     { bar: "from-sky-500 to-sky-400",        ring: "bg-sky-50",     text: "text-sky-600"     },
};

export const StatsCard = ({
  icon,
  label,
  value,
  change,
  subtitle,
  accent = "indigo",
}: Props) => {
  const isPositive = (change ?? 0) >= 0;
  const colors = ACCENT[accent];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group">
      {/* Barra de color superior */}
      <div className={`h-1 w-full bg-gradient-to-r ${colors.bar}`} />

      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            {/* Label */}
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide truncate">
              {label}
            </p>

            {/* Valor principal */}
            <p className="text-2xl font-bold text-slate-900 mt-1.5 truncate leading-none">
              {value}
            </p>

            {/* Subtítulo */}
            {subtitle && (
              <p className="text-xs text-slate-400 mt-1 truncate">{subtitle}</p>
            )}
          </div>

          {/* Ícono en círculo de color */}
          <div className={`w-10 h-10 rounded-xl ${colors.ring} flex items-center justify-center shrink-0 text-xl`}>
            {icon}
          </div>
        </div>

        {/* Indicador de cambio */}
        {change !== undefined && change !== null && (
          <div className="mt-4 pt-3 border-t border-slate-50 flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${
                isPositive
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-red-50 text-red-600"
              }`}
            >
              {isPositive ? "↑" : "↓"} {Math.abs(change).toFixed(2)}%
            </span>
            <span className="text-xs text-slate-400">últimas 24h</span>
          </div>
        )}
      </div>
    </div>
  );
};

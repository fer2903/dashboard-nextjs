/**
 * StatsCard — Tarjeta de KPI estilo Material UI
 *
 * Diseño MUI Card con:
 *  - Sombra de elevación estilo MUI (shadow-card)
 *  - Icono en caja de color con gradiente
 *  - Tipografía clara con jerarquía visual
 *  - Badge de cambio porcentual con color semántico
 *  - Hover con elevación aumentada
 */

type Props = {
  icon: string;
  label: string;
  value: string;
  change?: number | null;
  subtitle?: string;
  accent?: "indigo" | "violet" | "emerald" | "amber" | "rose" | "sky";
};

// Paleta de colores por variante — gradientes e iconbox colors
const ACCENT: Record<
  NonNullable<Props["accent"]>,
  { gradient: string; bg: string; text: string; shadow: string }
> = {
  indigo:  {
    gradient: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",
    bg: "rgba(99,102,241,0.12)",
    text: "#4f46e5",
    shadow: "rgba(99,102,241,0.35)",
  },
  violet:  {
    gradient: "linear-gradient(135deg, #a78bfa 0%, #7c3aed 100%)",
    bg: "rgba(124,58,237,0.12)",
    text: "#7c3aed",
    shadow: "rgba(124,58,237,0.35)",
  },
  emerald: {
    gradient: "linear-gradient(135deg, #34d399 0%, #059669 100%)",
    bg: "rgba(5,150,105,0.12)",
    text: "#059669",
    shadow: "rgba(5,150,105,0.35)",
  },
  amber:   {
    gradient: "linear-gradient(135deg, #fbbf24 0%, #d97706 100%)",
    bg: "rgba(217,119,6,0.12)",
    text: "#d97706",
    shadow: "rgba(217,119,6,0.35)",
  },
  rose:    {
    gradient: "linear-gradient(135deg, #fb7185 0%, #e11d48 100%)",
    bg: "rgba(225,29,72,0.12)",
    text: "#e11d48",
    shadow: "rgba(225,29,72,0.35)",
  },
  sky:     {
    gradient: "linear-gradient(135deg, #38bdf8 0%, #0284c7 100%)",
    bg: "rgba(2,132,199,0.12)",
    text: "#0284c7",
    shadow: "rgba(2,132,199,0.35)",
  },
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
    <div
      className="bg-white rounded-xl p-5 transition-all duration-200 hover:-translate-y-0.5 cursor-default"
      style={{
        boxShadow: "0 0 2px 0 rgba(145,158,171,0.2), 0 12px 24px -4px rgba(145,158,171,0.12)",
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLElement).style.boxShadow =
          "0 0 2px 0 rgba(145,158,171,0.24), 0 16px 32px -4px rgba(145,158,171,0.16)";
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLElement).style.boxShadow =
          "0 0 2px 0 rgba(145,158,171,0.2), 0 12px 24px -4px rgba(145,158,171,0.12)";
      }}
    >
      <div className="flex items-start justify-between gap-3">
        {/* Contenido de texto */}
        <div className="flex-1 min-w-0">
          {/* Label */}
          <p
            className="text-xs font-semibold uppercase tracking-[0.08em] mb-1.5 truncate"
            style={{ color: "var(--text-secondary)" }}
          >
            {label}
          </p>

          {/* Valor principal */}
          <p
            className="text-2xl font-bold leading-none truncate"
            style={{ color: "var(--text-primary)" }}
          >
            {value}
          </p>

          {/* Subtítulo */}
          {subtitle && (
            <p
              className="text-xs mt-1.5 truncate"
              style={{ color: "var(--text-disabled)" }}
            >
              {subtitle}
            </p>
          )}
        </div>

        {/* Icono con gradiente estilo MUI */}
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 text-xl text-white"
          style={{
            background: colors.gradient,
            boxShadow: `0 8px 16px 0 ${colors.shadow}`,
          }}
        >
          {icon}
        </div>
      </div>

      {/* Indicador de cambio ── al final */}
      {change !== undefined && change !== null && (
        <div
          className="mt-4 pt-3 flex items-center gap-2"
          style={{ borderTop: "1px dashed rgba(145,158,171,0.24)" }}
        >
          {/* Badge de cambio */}
          <span
            className="inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full"
            style={{
              backgroundColor: isPositive
                ? "rgba(34,197,94,0.12)"
                : "rgba(239,68,68,0.12)",
              color: isPositive ? "#16a34a" : "#dc2626",
            }}
          >
            {isPositive ? (
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="18 15 12 9 6 15" />
              </svg>
            ) : (
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            )}
            {Math.abs(change).toFixed(2)}%
          </span>
          <span className="text-xs" style={{ color: "var(--text-disabled)" }}>
            últimas 24h
          </span>
        </div>
      )}
    </div>
  );
};

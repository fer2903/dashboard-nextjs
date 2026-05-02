/**
 * Componente StatsCard — Tarjeta de estadística individual
 *
 * Muestra un indicador clave (KPI) con:
 *  - Ícono
 *  - Etiqueta descriptiva
 *  - Valor principal
 *  - Cambio porcentual con color (verde/rojo)
 *
 * Es un Server Component (sin "use client") ya que no tiene interactividad.
 * Recibe todos sus datos por props.
 */

type Props = {
  icon: string;
  label: string;
  value: string;
  change?: number | null; // porcentaje de cambio 24h (puede ser null si no aplica)
  subtitle?: string;
};

export const StatsCard = ({ icon, label, value, change, subtitle }: Props) => {
  const isPositive = (change ?? 0) >= 0;

  return (
    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          {/* Etiqueta */}
          <p className="text-sm text-gray-500 font-medium">{label}</p>

          {/* Valor principal */}
          <p className="text-2xl font-bold text-gray-900 mt-1 truncate">{value}</p>

          {/* Subtítulo opcional */}
          {subtitle && (
            <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>
          )}
        </div>

        {/* Ícono */}
        <span className="text-2xl ml-3">{icon}</span>
      </div>

      {/* Indicador de cambio 24h */}
      {change !== undefined && change !== null && (
        <div className="mt-3 pt-3 border-t border-gray-50">
          <span
            className={`text-sm font-semibold ${
              isPositive ? "text-green-600" : "text-red-500"
            }`}
          >
            {isPositive ? "▲" : "▼"} {Math.abs(change).toFixed(2)}%
          </span>
          <span className="text-xs text-gray-400 ml-1">en 24h</span>
        </div>
      )}
    </div>
  );
};

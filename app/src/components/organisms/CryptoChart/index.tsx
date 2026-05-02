"use client";

/**
 * Componente CryptoChart — Gráfico de barras SVG
 *
 * Muestra la variación de precio en 24h de las principales criptomonedas.
 *
 * Tecnología: SVG puro + Tailwind (sin librerías de gráficos externas)
 * Esto es didáctico — en producción se usaría Recharts o Chart.js.
 *
 * Conceptos de SVG usados:
 *  - <rect>    : rectángulo (las barras del gráfico)
 *  - <line>    : línea (la línea base del 0%)
 *  - <text>    : texto (etiquetas de los ejes)
 *  - viewBox   : sistema de coordenadas interno del SVG
 *
 * El gráfico muestra barras verdes para cambios positivos y rojas para negativos.
 * Las barras se miden desde la línea central (0%).
 */

// Dimensiones del canvas SVG
const CHART_HEIGHT = 200;
const BAR_WIDTH = 44;
const BAR_GAP = 12;
const MIDLINE = CHART_HEIGHT / 2; // línea del 0% — punto medio del gráfico
const MAX_BAR_HEIGHT = MIDLINE - 28; // altura máxima de barra (dejando espacio para etiquetas)

type CoinData = {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  price_change_percentage_24h: number;
};

type Props = {
  coins: CoinData[];
};

export const CryptoChart = ({ coins }: Props) => {
  // Tomamos solo los primeros 8 coins para que el gráfico sea legible
  const chartCoins = coins.slice(0, 8);

  // Encontrar el mayor cambio absoluto para normalizar las barras
  // (la coin con mayor cambio tendrá la barra más alta)
  const maxAbsChange = Math.max(
    ...chartCoins.map((c) => Math.abs(c.price_change_percentage_24h || 0)),
    1 // evitar división por cero
  );

  // Ancho total del SVG basado en la cantidad de barras
  const totalWidth = chartCoins.length * (BAR_WIDTH + BAR_GAP) + BAR_GAP;

  return (
    <div className="w-full overflow-x-auto">
      {/* viewBox define el sistema de coordenadas interno del SVG */}
      {/* preserveAspectRatio="xMidYMid meet" escala el SVG manteniendo la proporción */}
      <svg
        viewBox={`0 0 ${totalWidth} ${CHART_HEIGHT + 36}`}
        className="w-full min-w-[400px]"
        aria-label="Gráfico de variación de precio 24h"
      >
        {/* ── Línea base (0%) ── */}
        <line
          x1={0}
          y1={MIDLINE}
          x2={totalWidth}
          y2={MIDLINE}
          stroke="#e5e7eb"
          strokeWidth="1.5"
          strokeDasharray="4,3"
        />

        {/* Etiqueta del eje Y */}
        <text
          x={totalWidth - 2}
          y={MIDLINE - 6}
          fontSize="8"
          fill="#9ca3af"
          textAnchor="end"
        >
          0%
        </text>

        {/* ── Barras del gráfico ── */}
        {chartCoins.map((coin, i) => {
          const change = coin.price_change_percentage_24h || 0;

          // Normalizar la altura: (cambio / máximo) * altura_máxima
          const barHeight = (Math.abs(change) / maxAbsChange) * MAX_BAR_HEIGHT;

          const isPositive = change >= 0;
          const x = BAR_GAP + i * (BAR_WIDTH + BAR_GAP);

          // Las barras positivas van hacia ARRIBA (y decrece en SVG)
          // Las barras negativas van hacia ABAJO (y aumenta en SVG)
          const barY = isPositive ? MIDLINE - barHeight : MIDLINE;

          const color = isPositive ? "#22c55e" : "#ef4444";
          const lightColor = isPositive ? "#dcfce7" : "#fee2e2";

          return (
            <g key={coin.id}>
              {/* Barra con gradiente visual (rectángulo más claro detrás) */}
              <rect
                x={x + 2}
                y={isPositive ? barY + 2 : barY}
                width={BAR_WIDTH - 4}
                height={Math.max(barHeight - 2, 2)}
                fill={lightColor}
                rx={3}
              />
              <rect
                x={x}
                y={barY}
                width={BAR_WIDTH}
                height={Math.max(barHeight, 2)}
                fill={color}
                rx={3}
                opacity={0.85}
              />

              {/* Etiqueta de porcentaje encima/debajo de la barra */}
              <text
                x={x + BAR_WIDTH / 2}
                y={
                  isPositive
                    ? Math.max(barY - 5, 10) // encima de la barra positiva
                    : barY + barHeight + 12   // debajo de la barra negativa
                }
                fontSize="8.5"
                fill={color}
                textAnchor="middle"
                fontWeight="600"
              >
                {change > 0 ? "+" : ""}
                {change.toFixed(1)}%
              </text>

              {/* Símbolo de la moneda (eje X) */}
              <text
                x={x + BAR_WIDTH / 2}
                y={CHART_HEIGHT + 24}
                fontSize="9"
                fill="#6b7280"
                textAnchor="middle"
                fontWeight="500"
              >
                {coin.symbol.toUpperCase()}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Leyenda */}
      <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
        <span className="flex items-center gap-1">
          <span className="inline-block w-3 h-3 rounded-sm bg-green-500" />
          Subida 24h
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block w-3 h-3 rounded-sm bg-red-500" />
          Bajada 24h
        </span>
      </div>
    </div>
  );
};

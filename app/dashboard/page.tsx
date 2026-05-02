"use client";

/**
 * Página Dashboard — /dashboard
 *
 * Módulo principal del sistema. Muestra estadísticas y gráficos
 * basados en datos de criptomonedas en tiempo real.
 *
 * Fuente de datos: useCryptoSwr (hook que consume CoinGecko API vía SWR)
 *
 * SWR (Stale-While-Revalidate):
 *  - Muestra datos cacheados inmediatamente (stale)
 *  - Revalida en background trayendo datos frescos (revalidate)
 *  - Actualización automática cuando el usuario vuelve al tab
 *
 * Estructura de la página:
 *  1. Header con saludo
 *  2. Stats Cards — 4 métricas clave
 *  3. Gráfico de barras — cambio de precio 24h
 *  4. Tabla top 10 criptomonedas
 */

import { useCryptoSwr } from "@/app/src/hooks/useCryptoSwr";
import { StatsCard } from "@/app/src/components/molecules/StatsCard";
import { CryptoChart } from "@/app/src/components/organisms/CryptoChart";
import { TransactionTable } from "@/app/src/components/organisms/TransactionTable";

// Tipo para los datos que devuelve la API de CoinGecko
type CoinData = {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  price_change_percentage_24h: number;
  total_volume: number;
  circulating_supply: number;
};

export default function DashboardPage() {
  // useCryptoSwr fetcha: https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd
  const { data, loading, error } = useCryptoSwr();

  // ── Estado de carga ──
  if (loading) {
    return (
      <div className="p-6 animate-pulse">
        {/* Skeleton de cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-gray-200 rounded-xl" />
          ))}
        </div>
        {/* Skeleton del gráfico */}
        <div className="h-72 bg-gray-200 rounded-xl" />
      </div>
    );
  }

  // ── Estado de error ──
  if (error || !data) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-6 text-center">
          <p className="text-2xl mb-2">⚠️</p>
          <p className="font-semibold">Error al cargar datos de mercado</p>
          <p className="text-sm mt-1">
            Verifica tu conexión o intenta de nuevo más tarde
          </p>
        </div>
      </div>
    );
  }

  // ── Procesamiento de datos para las stats ──
  const coins = data as CoinData[];

  // Encontrar coins específicas
  const bitcoin = coins.find((c) => c.id === "bitcoin");
  const ethereum = coins.find((c) => c.id === "ethereum");

  // Calcular ganancias y pérdidas del día
  const topGainer = [...coins].sort(
    (a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h
  )[0];

  const topLoser = [...coins].sort(
    (a, b) => a.price_change_percentage_24h - b.price_change_percentage_24h
  )[0];

  // Formatear precio en USD con separadores de miles
  const formatPrice = (price: number) => {
    if (price >= 1000) return `$${price.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
    if (price >= 1) return `$${price.toFixed(2)}`;
    return `$${price.toFixed(6)}`; // para monedas de poco valor
  };

  // Formatear market cap en notación abreviada
  const formatMarketCap = (mc: number) => {
    if (mc >= 1e12) return `$${(mc / 1e12).toFixed(2)}T`;
    if (mc >= 1e9) return `$${(mc / 1e9).toFixed(2)}B`;
    if (mc >= 1e6) return `$${(mc / 1e6).toFixed(2)}M`;
    return `$${mc.toLocaleString()}`;
  };

  return (
    <div className="p-6 space-y-6">
      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 text-sm mt-0.5">
            Datos de mercado en tiempo real • CoinGecko API
          </p>
        </div>
        {/* Indicador de datos en vivo */}
        <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 text-xs font-medium px-3 py-1.5 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          En vivo
        </div>
      </div>

      {/* ── Stats Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Bitcoin */}
        <StatsCard
          icon="₿"
          label="Bitcoin (BTC)"
          value={formatPrice(bitcoin?.current_price ?? 0)}
          change={bitcoin?.price_change_percentage_24h}
          subtitle={`Market cap: ${formatMarketCap(bitcoin?.market_cap ?? 0)}`}
        />

        {/* Ethereum */}
        <StatsCard
          icon="⟠"
          label="Ethereum (ETH)"
          value={formatPrice(ethereum?.current_price ?? 0)}
          change={ethereum?.price_change_percentage_24h}
          subtitle={`Market cap: ${formatMarketCap(ethereum?.market_cap ?? 0)}`}
        />

        {/* Top Gainer */}
        <StatsCard
          icon="🚀"
          label="Mayor subida 24h"
          value={topGainer?.name ?? "—"}
          change={topGainer?.price_change_percentage_24h}
          subtitle={formatPrice(topGainer?.current_price ?? 0)}
        />

        {/* Top Loser */}
        <StatsCard
          icon="📉"
          label="Mayor bajada 24h"
          value={topLoser?.name ?? "—"}
          change={topLoser?.price_change_percentage_24h}
          subtitle={formatPrice(topLoser?.current_price ?? 0)}
        />
      </div>

      {/* ── Sección: Gráfico + Tabla Top 10 ── */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Gráfico de barras 24h */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="mb-4">
            <h2 className="text-base font-semibold text-gray-900">
              Variación de Precio — 24h
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Top 8 criptomonedas por capitalización de mercado
            </p>
          </div>
          {/* Componente de gráfico SVG */}
          <CryptoChart coins={coins} />
        </div>

        {/* Tabla top 10 */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="mb-4">
            <h2 className="text-base font-semibold text-gray-900">
              Top 10 Criptomonedas
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Ordenadas por capitalización de mercado
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left pb-2 text-gray-500 font-medium text-xs">#</th>
                  <th className="text-left pb-2 text-gray-500 font-medium text-xs">Moneda</th>
                  <th className="text-right pb-2 text-gray-500 font-medium text-xs">Precio</th>
                  <th className="text-right pb-2 text-gray-500 font-medium text-xs">24h</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {coins.slice(0, 10).map((coin) => {
                  const isPositive = coin.price_change_percentage_24h >= 0;
                  return (
                    <tr key={coin.id} className="hover:bg-gray-50 transition-colors">
                      {/* Rank */}
                      <td className="py-2.5 pr-2 text-gray-400 text-xs font-mono">
                        {coin.market_cap_rank}
                      </td>
                      {/* Nombre y símbolo */}
                      <td className="py-2.5">
                        <div className="flex items-center gap-2">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={coin.image}
                            alt={coin.name}
                            className="w-6 h-6 rounded-full"
                          />
                          <div>
                            <p className="font-medium text-gray-900 leading-none">
                              {coin.name}
                            </p>
                            <p className="text-xs text-gray-400 uppercase mt-0.5">
                              {coin.symbol}
                            </p>
                          </div>
                        </div>
                      </td>
                      {/* Precio */}
                      <td className="py-2.5 text-right font-mono text-gray-900">
                        {formatPrice(coin.current_price)}
                      </td>
                      {/* Cambio 24h */}
                      <td className="py-2.5 text-right">
                        <span
                          className={`inline-block text-xs font-semibold px-1.5 py-0.5 rounded ${
                            isPositive
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-600"
                          }`}
                        >
                          {isPositive ? "+" : ""}
                          {coin.price_change_percentage_24h?.toFixed(2)}%
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ── Sección: Transacciones recientes ── */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="mb-4">
          <h2 className="text-base font-semibold text-gray-900">
            Transacciones Recientes
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Últimas operaciones registradas en el sistema
          </p>
        </div>
        {/* Reutilizamos el componente existente de la clase anterior */}
        <TransactionTable />
      </div>
    </div>
  );
}

"use client";

import { useCryptoSwr } from "@/app/src/hooks/useCryptoSwr";
import { StatsCard } from "@/app/src/components/molecules/StatsCard";
import { CryptoChart } from "@/app/src/components/organisms/CryptoChart";
import { TransactionTable } from "@/app/src/components/organisms/TransactionTable";

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

// ── Skeleton de carga estilo MUI ──────────────────────────────────
const LoadingSkeleton = () => (
  <div className="p-6 space-y-6 animate-pulse">
    {/* Stats cards skeleton */}
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {[1,2,3,4].map(i => (
        <div key={i} className="bg-white rounded-xl p-5 h-36" style={{ boxShadow: "0 0 2px 0 rgba(145,158,171,0.2), 0 12px 24px -4px rgba(145,158,171,0.12)" }}>
          <div className="flex items-start justify-between">
            <div className="space-y-2 flex-1">
              <div className="h-3 w-20 rounded bg-gray-100" />
              <div className="h-7 w-28 rounded bg-gray-200" />
              <div className="h-3 w-24 rounded bg-gray-100" />
            </div>
            <div className="w-12 h-12 rounded-xl bg-gray-200" />
          </div>
        </div>
      ))}
    </div>
    {/* Chart + table skeleton */}
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
      <div className="bg-white rounded-xl h-80" style={{ boxShadow: "0 0 2px 0 rgba(145,158,171,0.2), 0 12px 24px -4px rgba(145,158,171,0.12)" }} />
      <div className="bg-white rounded-xl h-80" style={{ boxShadow: "0 0 2px 0 rgba(145,158,171,0.2), 0 12px 24px -4px rgba(145,158,171,0.12)" }} />
    </div>
  </div>
);

export default function DashboardPage() {
  const { data, loading, error } = useCryptoSwr();

  if (loading) return <LoadingSkeleton />;

  if (error || !data) {
    return (
      <div className="p-6">
        <div
          className="rounded-xl p-6 text-center"
          style={{
            backgroundColor: "rgba(239,68,68,0.08)",
            border: "1px solid rgba(239,68,68,0.24)",
          }}
        >
          <p className="text-3xl mb-3">⚠️</p>
          <p className="font-semibold" style={{ color: "#dc2626" }}>Error al cargar datos de mercado</p>
          <p className="text-sm mt-1" style={{ color: "#b91c1c" }}>
            Verifica tu conexión o intenta de nuevo más tarde
          </p>
        </div>
      </div>
    );
  }

  const coins = data as CoinData[];
  const bitcoin = coins.find(c => c.id === "bitcoin");
  const ethereum = coins.find(c => c.id === "ethereum");

  const topGainer = [...coins].sort(
    (a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h
  )[0];

  const topLoser = [...coins].sort(
    (a, b) => a.price_change_percentage_24h - b.price_change_percentage_24h
  )[0];

  const formatPrice = (price: number) => {
    if (price >= 1000) return `$${price.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
    if (price >= 1) return `$${price.toFixed(2)}`;
    return `$${price.toFixed(6)}`;
  };

  const formatMarketCap = (mc: number) => {
    if (mc >= 1e12) return `$${(mc / 1e12).toFixed(2)}T`;
    if (mc >= 1e9) return `$${(mc / 1e9).toFixed(2)}B`;
    if (mc >= 1e6) return `$${(mc / 1e6).toFixed(2)}M`;
    return `$${mc.toLocaleString()}`;
  };

  return (
    <div className="p-6 space-y-6">

      {/* ── Indicador En Vivo ─────────────────────────────────── */}
      <div className="flex items-center justify-end">
        <div
          className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full"
          style={{
            backgroundColor: "rgba(34,197,94,0.12)",
            color: "#16a34a",
            border: "1px solid rgba(34,197,94,0.24)",
          }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          En vivo · CoinGecko API
        </div>
      </div>

      {/* ── Stats Cards ──────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          icon="₿"
          label="Bitcoin (BTC)"
          value={formatPrice(bitcoin?.current_price ?? 0)}
          change={bitcoin?.price_change_percentage_24h}
          subtitle={`Market cap: ${formatMarketCap(bitcoin?.market_cap ?? 0)}`}
          accent="amber"
        />
        <StatsCard
          icon="⟠"
          label="Ethereum (ETH)"
          value={formatPrice(ethereum?.current_price ?? 0)}
          change={ethereum?.price_change_percentage_24h}
          subtitle={`Market cap: ${formatMarketCap(ethereum?.market_cap ?? 0)}`}
          accent="indigo"
        />
        <StatsCard
          icon="🚀"
          label="Mayor subida 24h"
          value={topGainer?.name ?? "—"}
          change={topGainer?.price_change_percentage_24h}
          subtitle={formatPrice(topGainer?.current_price ?? 0)}
          accent="emerald"
        />
        <StatsCard
          icon="📉"
          label="Mayor bajada 24h"
          value={topLoser?.name ?? "—"}
          change={topLoser?.price_change_percentage_24h}
          subtitle={formatPrice(topLoser?.current_price ?? 0)}
          accent="rose"
        />
      </div>

      {/* ── Gráfico + Tabla Top 10 ────────────────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

        {/* Gráfico de barras 24h */}
        <div
          className="bg-white rounded-xl p-6"
          style={{ boxShadow: "0 0 2px 0 rgba(145,158,171,0.2), 0 12px 24px -4px rgba(145,158,171,0.12)" }}
        >
          {/* Card Header estilo MUI */}
          <div className="flex items-start justify-between mb-5">
            <div>
              <h2
                className="text-base font-bold"
                style={{ color: "var(--text-primary)" }}
              >
                Variación de Precio — 24h
              </h2>
              <p className="text-xs mt-0.5" style={{ color: "var(--text-secondary)" }}>
                Top 8 criptomonedas por capitalización
              </p>
            </div>
            <span
              className="text-xs px-2.5 py-1 rounded-full font-medium"
              style={{
                backgroundColor: "rgba(79,70,229,0.1)",
                color: "var(--primary)",
              }}
            >
              Últimas 24h
            </span>
          </div>
          <CryptoChart coins={coins} />
        </div>

        {/* Tabla Top 10 */}
        <div
          className="bg-white rounded-xl overflow-hidden"
          style={{ boxShadow: "0 0 2px 0 rgba(145,158,171,0.2), 0 12px 24px -4px rgba(145,158,171,0.12)" }}
        >
          {/* Card Header */}
          <div className="px-6 py-5 flex items-start justify-between"
            style={{ borderBottom: "1px solid rgba(145,158,171,0.16)" }}
          >
            <div>
              <h2
                className="text-base font-bold"
                style={{ color: "var(--text-primary)" }}
              >
                Top 10 Criptomonedas
              </h2>
              <p className="text-xs mt-0.5" style={{ color: "var(--text-secondary)" }}>
                Ordenadas por capitalización de mercado
              </p>
            </div>
            <span
              className="text-xs px-2.5 py-1 rounded-full font-medium"
              style={{
                backgroundColor: "rgba(34,197,94,0.1)",
                color: "#16a34a",
              }}
            >
              En vivo
            </span>
          </div>

          {/* MUI-style table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm mui-table">
              <thead>
                <tr>
                  <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide"
                    style={{ color: "var(--text-secondary)", backgroundColor: "#F4F6F8", borderBottom: "1px solid rgba(145,158,171,0.24)" }}>
                    #
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide"
                    style={{ color: "var(--text-secondary)", backgroundColor: "#F4F6F8", borderBottom: "1px solid rgba(145,158,171,0.24)" }}>
                    Moneda
                  </th>
                  <th className="text-right px-4 py-3 text-xs font-semibold uppercase tracking-wide"
                    style={{ color: "var(--text-secondary)", backgroundColor: "#F4F6F8", borderBottom: "1px solid rgba(145,158,171,0.24)" }}>
                    Precio
                  </th>
                  <th className="text-right px-4 py-3 text-xs font-semibold uppercase tracking-wide"
                    style={{ color: "var(--text-secondary)", backgroundColor: "#F4F6F8", borderBottom: "1px solid rgba(145,158,171,0.24)" }}>
                    24h
                  </th>
                </tr>
              </thead>
              <tbody>
                {coins.slice(0, 10).map((coin, idx) => {
                  const isPositive = coin.price_change_percentage_24h >= 0;
                  const isLast = idx === 9;
                  return (
                    <tr
                      key={coin.id}
                      className="transition-colors"
                      style={{ borderBottom: isLast ? "none" : "1px solid rgba(145,158,171,0.12)" }}
                      onMouseEnter={e => {
                        (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(145,158,171,0.04)";
                      }}
                      onMouseLeave={e => {
                        (e.currentTarget as HTMLElement).style.backgroundColor = "transparent";
                      }}
                    >
                      <td className="px-4 py-3 text-xs font-mono" style={{ color: "var(--text-disabled)" }}>
                        {coin.market_cap_rank}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={coin.image}
                            alt={coin.name}
                            className="w-7 h-7 rounded-full"
                            style={{ boxShadow: "0 0 0 2px rgba(145,158,171,0.16)" }}
                          />
                          <div>
                            <p className="text-xs font-semibold leading-none" style={{ color: "var(--text-primary)" }}>
                              {coin.name}
                            </p>
                            <p className="text-[10px] uppercase mt-0.5 font-mono" style={{ color: "var(--text-secondary)" }}>
                              {coin.symbol}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right text-xs font-mono font-semibold" style={{ color: "var(--text-primary)" }}>
                        {formatPrice(coin.current_price)}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span
                          className="inline-flex items-center gap-0.5 text-xs font-bold px-2 py-0.5 rounded-full"
                          style={{
                            backgroundColor: isPositive ? "rgba(34,197,94,0.12)" : "rgba(239,68,68,0.12)",
                            color: isPositive ? "#16a34a" : "#dc2626",
                          }}
                        >
                          {isPositive ? "▲" : "▼"}
                          {Math.abs(coin.price_change_percentage_24h)?.toFixed(2)}%
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

      {/* ── Transacciones Recientes ───────────────────────────── */}
      <div
        className="bg-white rounded-xl overflow-hidden"
        style={{ boxShadow: "0 0 2px 0 rgba(145,158,171,0.2), 0 12px 24px -4px rgba(145,158,171,0.12)" }}
      >
        {/* Card Header */}
        <div
          className="px-6 py-5 flex items-start justify-between"
          style={{ borderBottom: "1px solid rgba(145,158,171,0.16)" }}
        >
          <div>
            <h2
              className="text-base font-bold"
              style={{ color: "var(--text-primary)" }}
            >
              Transacciones Recientes
            </h2>
            <p className="text-xs mt-0.5" style={{ color: "var(--text-secondary)" }}>
              Últimas operaciones registradas en el sistema
            </p>
          </div>
        </div>

        <div className="px-2 pb-2">
          <TransactionTable />
        </div>
      </div>
    </div>
  );
}

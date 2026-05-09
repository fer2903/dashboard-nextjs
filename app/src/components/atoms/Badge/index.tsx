/**
 * Badge — Chip colorido para identificar criptomonedas u otros valores
 *
 * Asigna colores basados en las monedas más comunes;
 * el resto recibe un color neutro.
 */

type Props = {
  value: string;
};

// Paleta de colores por símbolo/nombre de moneda (lowercase)
const COIN_COLORS: Record<string, string> = {
  btc:      "bg-amber-100 text-amber-800 ring-1 ring-amber-200",
  bitcoin:  "bg-amber-100 text-amber-800 ring-1 ring-amber-200",
  eth:      "bg-indigo-100 text-indigo-800 ring-1 ring-indigo-200",
  ethereum: "bg-indigo-100 text-indigo-800 ring-1 ring-indigo-200",
  usdt:     "bg-emerald-100 text-emerald-800 ring-1 ring-emerald-200",
  usdc:     "bg-sky-100 text-sky-800 ring-1 ring-sky-200",
  bnb:      "bg-yellow-100 text-yellow-800 ring-1 ring-yellow-200",
  sol:      "bg-violet-100 text-violet-800 ring-1 ring-violet-200",
  solana:   "bg-violet-100 text-violet-800 ring-1 ring-violet-200",
  xrp:      "bg-blue-100 text-blue-800 ring-1 ring-blue-200",
  ada:      "bg-cyan-100 text-cyan-800 ring-1 ring-cyan-200",
  doge:     "bg-orange-100 text-orange-800 ring-1 ring-orange-200",
};

const DEFAULT_COLOR = "bg-slate-100 text-slate-700 ring-1 ring-slate-200";

export const Badge = ({ value }: Props) => {
  const key = value?.toLowerCase() ?? "";
  const colorClass = COIN_COLORS[key] ?? DEFAULT_COLOR;

  return (
    <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${colorClass}`}>
      {value?.toUpperCase()}
    </span>
  );
};

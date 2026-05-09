/**
 * Badge — MUI Chip estilo para criptomonedas
 *
 * Chip colorido con estilo Material UI (filled variant).
 */

type Props = { value: string };

// Paleta de colores por moneda — background, text, border
const COIN_STYLES: Record<string, { bg: string; color: string; border: string }> = {
  btc:      { bg: "rgba(217,119,6,0.10)",  color: "#b45309", border: "rgba(217,119,6,0.20)"  },
  bitcoin:  { bg: "rgba(217,119,6,0.10)",  color: "#b45309", border: "rgba(217,119,6,0.20)"  },
  eth:      { bg: "rgba(79,70,229,0.10)",  color: "#4338ca", border: "rgba(79,70,229,0.20)"  },
  ethereum: { bg: "rgba(79,70,229,0.10)",  color: "#4338ca", border: "rgba(79,70,229,0.20)"  },
  usdt:     { bg: "rgba(5,150,105,0.10)",  color: "#047857", border: "rgba(5,150,105,0.20)"  },
  usdc:     { bg: "rgba(2,132,199,0.10)",  color: "#0369a1", border: "rgba(2,132,199,0.20)"  },
  bnb:      { bg: "rgba(202,138,4,0.10)",  color: "#a16207", border: "rgba(202,138,4,0.20)"  },
  sol:      { bg: "rgba(124,58,237,0.10)", color: "#6d28d9", border: "rgba(124,58,237,0.20)" },
  solana:   { bg: "rgba(124,58,237,0.10)", color: "#6d28d9", border: "rgba(124,58,237,0.20)" },
  xrp:      { bg: "rgba(37,99,235,0.10)",  color: "#1d4ed8", border: "rgba(37,99,235,0.20)"  },
  ada:      { bg: "rgba(8,145,178,0.10)",  color: "#0e7490", border: "rgba(8,145,178,0.20)"  },
  doge:     { bg: "rgba(234,88,12,0.10)",  color: "#c2410c", border: "rgba(234,88,12,0.20)"  },
};

const DEFAULT_STYLE = {
  bg: "rgba(145,158,171,0.12)",
  color: "#637381",
  border: "rgba(145,158,171,0.24)",
};

export const Badge = ({ value }: Props) => {
  const key = value?.toLowerCase() ?? "";
  const style = COIN_STYLES[key] ?? DEFAULT_STYLE;

  return (
    <span
      className="inline-flex items-center text-[11px] font-bold px-2.5 py-0.5 rounded-full"
      style={{
        backgroundColor: style.bg,
        color: style.color,
        border: `1px solid ${style.border}`,
        letterSpacing: "0.05em",
      }}
    >
      {value?.toUpperCase()}
    </span>
  );
};

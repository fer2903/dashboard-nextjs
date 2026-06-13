"use client";
import { useState, useCallback, useEffect } from 'react';
import Link from 'next/link';
import { jsxs, jsx } from 'react/jsx-runtime';
import { useRouter, useParams, usePathname } from 'next/navigation';

// app/page.tsx
var COIN_STYLES = {
  btc: { bg: "rgba(217,119,6,0.10)", color: "#b45309", border: "rgba(217,119,6,0.20)" },
  bitcoin: { bg: "rgba(217,119,6,0.10)", color: "#b45309", border: "rgba(217,119,6,0.20)" },
  eth: { bg: "rgba(79,70,229,0.10)", color: "#4338ca", border: "rgba(79,70,229,0.20)" },
  ethereum: { bg: "rgba(79,70,229,0.10)", color: "#4338ca", border: "rgba(79,70,229,0.20)" },
  sol: { bg: "rgba(124,58,237,0.10)", color: "#6d28d9", border: "rgba(124,58,237,0.20)" },
  solana: { bg: "rgba(124,58,237,0.10)", color: "#6d28d9", border: "rgba(124,58,237,0.20)" },
  usdt: { bg: "rgba(5,150,105,0.10)", color: "#047857", border: "rgba(5,150,105,0.20)" },
  usdc: { bg: "rgba(2,132,199,0.10)", color: "#0369a1", border: "rgba(2,132,199,0.20)" },
  bnb: { bg: "rgba(202,138,4,0.10)", color: "#a16207", border: "rgba(202,138,4,0.20)" },
  xrp: { bg: "rgba(37,99,235,0.10)", color: "#1d4ed8", border: "rgba(37,99,235,0.20)" },
  doge: { bg: "rgba(234,88,12,0.10)", color: "#c2410c", border: "rgba(234,88,12,0.20)" }
};
var DEFAULT_COIN = { bg: "rgba(145,158,171,0.12)", color: "#637381", border: "rgba(145,158,171,0.24)" };
var CoinBadge = ({ coin }) => {
  const s = COIN_STYLES[coin.toLowerCase()] ?? DEFAULT_COIN;
  return /* @__PURE__ */ jsx(
    "span",
    {
      className: "inline-flex items-center text-[11px] font-bold px-2.5 py-0.5 rounded-full",
      style: { backgroundColor: s.bg, color: s.color, border: `1px solid ${s.border}`, letterSpacing: "0.05em" },
      children: coin.toUpperCase()
    }
  );
};
var GRADIENTS = [
  "linear-gradient(135deg,#6366f1,#4f46e5)",
  "linear-gradient(135deg,#a78bfa,#7c3aed)",
  "linear-gradient(135deg,#38bdf8,#0284c7)",
  "linear-gradient(135deg,#34d399,#059669)",
  "linear-gradient(135deg,#fb7185,#e11d48)",
  "linear-gradient(135deg,#fbbf24,#d97706)"
];
var Avatar = ({ name }) => {
  const ch = name?.charAt(0)?.toUpperCase() ?? "?";
  const g = GRADIENTS[(ch.charCodeAt(0) - 65) % GRADIENTS.length];
  return /* @__PURE__ */ jsx(
    "div",
    {
      className: "w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0",
      style: { background: g, boxShadow: "0 3px 6px rgba(0,0,0,0.12)" },
      children: ch
    }
  );
};
var Skeleton = () => /* @__PURE__ */ jsx("div", { className: "animate-pulse", children: [1, 2, 3, 4, 5, 6].map((i) => /* @__PURE__ */ jsxs(
  "div",
  {
    className: "flex items-center gap-4 px-6 py-4",
    style: { borderBottom: "1px solid rgba(145,158,171,0.12)" },
    children: [
      /* @__PURE__ */ jsx("div", { className: "w-8 h-8 rounded-full bg-gray-200 shrink-0" }),
      /* @__PURE__ */ jsx("div", { className: "flex-1 h-4 bg-gray-200 rounded w-28" }),
      /* @__PURE__ */ jsx("div", { className: "h-5 bg-gray-100 rounded-full w-14" }),
      /* @__PURE__ */ jsx("div", { className: "h-4 bg-gray-100 rounded w-20 ml-auto" }),
      /* @__PURE__ */ jsx("div", { className: "h-4 bg-gray-100 rounded w-24" }),
      /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ jsx("div", { className: "w-7 h-7 bg-gray-100 rounded-lg" }),
        /* @__PURE__ */ jsx("div", { className: "w-7 h-7 bg-gray-100 rounded-lg" })
      ] })
    ]
  },
  i
)) });
function TransactionsPage() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [filterCoin, setFilterCoin] = useState("");
  const [filterUser, setFilterUser] = useState("");
  const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";
  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API}/api/transactions`);
      if (!res.ok) throw new Error(`Error ${res.status}`);
      const data = await res.json();
      setTransactions(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  }, [API]);
  useEffect(() => {
    load();
  }, [load]);
  const handleDelete = async (id) => {
    if (!confirm("\xBFEliminar esta transacci\xF3n? Esta acci\xF3n no se puede deshacer.")) return;
    setDeletingId(id);
    try {
      const res = await fetch(`${API}/api/transactions/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("No se pudo eliminar");
      setTransactions((prev) => prev.filter((t) => t._id !== id));
    } catch (e) {
      alert(e instanceof Error ? e.message : "Error al eliminar");
    } finally {
      setDeletingId(null);
    }
  };
  const filtered = transactions.filter((t) => {
    const matchCoin = !filterCoin || t.coin.toLowerCase().includes(filterCoin.toLowerCase());
    const matchUser = !filterUser || t.user.toLowerCase().includes(filterUser.toLowerCase());
    return matchCoin && matchUser;
  });
  const coins = [...new Set(transactions.map((t) => t.coin))].sort();
  const formatDate = (iso) => new Date(iso).toLocaleDateString("es-MX", { day: "numeric", month: "short", year: "numeric" });
  const formatTime = (iso) => new Date(iso).toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" });
  return /* @__PURE__ */ jsxs("div", { className: "p-6 space-y-5", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-3", children: [
      /* @__PURE__ */ jsxs(
        "select",
        {
          value: filterCoin,
          onChange: (e) => setFilterCoin(e.target.value),
          className: "text-sm px-3 py-2 rounded-lg transition-all outline-none",
          style: {
            border: "1px solid var(--border)",
            backgroundColor: "white",
            color: "var(--text-primary)",
            minWidth: 140
          },
          children: [
            /* @__PURE__ */ jsx("option", { value: "", children: "Todas las monedas" }),
            coins.map((c) => /* @__PURE__ */ jsx("option", { value: c, children: c.toUpperCase() }, c))
          ]
        }
      ),
      /* @__PURE__ */ jsx(
        "input",
        {
          type: "text",
          value: filterUser,
          onChange: (e) => setFilterUser(e.target.value),
          placeholder: "Buscar usuario...",
          className: "text-sm px-3 py-2 rounded-lg transition-all outline-none",
          style: {
            border: "1px solid var(--border)",
            backgroundColor: "white",
            color: "var(--text-primary)",
            minWidth: 180
          }
        }
      ),
      !loading && /* @__PURE__ */ jsxs("span", { className: "text-xs ml-1", style: { color: "var(--text-disabled)" }, children: [
        filtered.length,
        " de ",
        transactions.length,
        " transacciones"
      ] }),
      /* @__PURE__ */ jsx("div", { className: "flex-1" }),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: load,
          disabled: loading,
          className: "w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-150",
          style: { backgroundColor: "white", border: "1px solid var(--border)", color: "var(--text-secondary)" },
          title: "Refrescar",
          children: /* @__PURE__ */ jsxs(
            "svg",
            {
              width: "16",
              height: "16",
              viewBox: "0 0 24 24",
              fill: "none",
              stroke: "currentColor",
              strokeWidth: "2",
              className: loading ? "animate-spin" : "",
              children: [
                /* @__PURE__ */ jsx("polyline", { points: "23 4 23 10 17 10" }),
                /* @__PURE__ */ jsx("polyline", { points: "1 20 1 14 7 14" }),
                /* @__PURE__ */ jsx("path", { d: "M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" })
              ]
            }
          )
        }
      ),
      /* @__PURE__ */ jsxs(
        Link,
        {
          href: "/dashboard/transactions/new",
          className: "inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-bold text-white transition-all duration-200",
          style: {
            background: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",
            boxShadow: "0 8px 16px 0 rgba(79,70,229,0.28)",
            letterSpacing: "0.03em"
          },
          children: [
            /* @__PURE__ */ jsxs("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.5", children: [
              /* @__PURE__ */ jsx("line", { x1: "12", y1: "5", x2: "12", y2: "19" }),
              /* @__PURE__ */ jsx("line", { x1: "5", y1: "12", x2: "19", y2: "12" })
            ] }),
            "Nueva Transacci\xF3n"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-xl overflow-hidden", style: { boxShadow: "var(--shadow-card)" }, children: [
      /* @__PURE__ */ jsxs(
        "div",
        {
          className: "px-6 py-4 flex items-center justify-between",
          style: { borderBottom: "1px solid rgba(145,158,171,0.16)" },
          children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("h2", { className: "text-base font-bold", style: { color: "var(--text-primary)" }, children: "Historial de Transacciones" }),
              /* @__PURE__ */ jsxs("p", { className: "text-xs mt-0.5", style: { color: "var(--text-secondary)" }, children: [
                "CRUD completo \xB7 Llamando a ",
                API,
                "/api/transactions"
              ] })
            ] }),
            !loading && !error && /* @__PURE__ */ jsxs(
              "div",
              {
                className: "flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full",
                style: { backgroundColor: "rgba(34,197,94,0.10)", color: "#16a34a", border: "1px solid rgba(34,197,94,0.24)" },
                children: [
                  /* @__PURE__ */ jsx("span", { className: "w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" }),
                  "API conectada"
                ]
              }
            )
          ]
        }
      ),
      loading && /* @__PURE__ */ jsx(Skeleton, {}),
      !loading && error && /* @__PURE__ */ jsxs("div", { className: "px-6 py-12 text-center", children: [
        /* @__PURE__ */ jsx(
          "div",
          {
            className: "w-14 h-14 rounded-full mx-auto mb-3 flex items-center justify-center",
            style: { backgroundColor: "rgba(239,68,68,0.08)" },
            children: /* @__PURE__ */ jsxs("svg", { width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "#dc2626", strokeWidth: "2", children: [
              /* @__PURE__ */ jsx("circle", { cx: "12", cy: "12", r: "10" }),
              /* @__PURE__ */ jsx("line", { x1: "12", y1: "8", x2: "12", y2: "12" }),
              /* @__PURE__ */ jsx("line", { x1: "12", y1: "16", x2: "12.01", y2: "16" })
            ] })
          }
        ),
        /* @__PURE__ */ jsx("p", { className: "font-semibold mb-1", style: { color: "#dc2626" }, children: error }),
        /* @__PURE__ */ jsxs("p", { className: "text-xs mb-4", style: { color: "var(--text-secondary)" }, children: [
          "Verifica que el servidor principal est\xE9 corriendo en ",
          API
        ] }),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: load,
            className: "px-4 py-2 rounded-lg text-sm font-semibold text-white",
            style: { background: "var(--primary)" },
            children: "Reintentar"
          }
        )
      ] }),
      !loading && !error && filtered.length === 0 && /* @__PURE__ */ jsxs("div", { className: "px-6 py-14 text-center", children: [
        /* @__PURE__ */ jsx(
          "div",
          {
            className: "w-14 h-14 rounded-full mx-auto mb-3 flex items-center justify-center",
            style: { backgroundColor: "rgba(145,158,171,0.08)" },
            children: /* @__PURE__ */ jsx("svg", { width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "var(--text-disabled)", strokeWidth: "1.5", children: /* @__PURE__ */ jsx("path", { d: "M12 2v20M17 5H9.5a3.5 3.5 0 1 0 0 7h5a3.5 3.5 0 1 1 0 7H6" }) })
          }
        ),
        /* @__PURE__ */ jsx("p", { className: "font-semibold", style: { color: "var(--text-primary)" }, children: transactions.length === 0 ? "Sin transacciones" : "Sin resultados para los filtros aplicados" }),
        transactions.length === 0 && /* @__PURE__ */ jsx(
          Link,
          {
            href: "/dashboard/transactions/new",
            className: "inline-block mt-4 px-4 py-2 rounded-lg text-sm font-semibold text-white",
            style: { background: "var(--primary)" },
            children: "Crear primera transacci\xF3n"
          }
        )
      ] }),
      !loading && !error && filtered.length > 0 && /* @__PURE__ */ jsxs("div", { className: "overflow-x-auto", children: [
        /* @__PURE__ */ jsxs("table", { className: "w-full text-sm min-w-[700px]", children: [
          /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsx("tr", { style: { backgroundColor: "#F4F6F8", borderBottom: "1px solid rgba(145,158,171,0.24)" }, children: ["Usuario", "Moneda", "Monto", "Fecha", "Acciones"].map((h, i) => /* @__PURE__ */ jsx(
            "th",
            {
              className: "px-6 py-3 text-xs font-semibold uppercase tracking-[0.08em]",
              style: {
                color: "var(--text-secondary)",
                textAlign: i >= 2 ? i === 4 ? "center" : "right" : "left"
              },
              children: h
            },
            h
          )) }) }),
          /* @__PURE__ */ jsx("tbody", { children: filtered.map((tx, idx) => {
            const isLast = idx === filtered.length - 1;
            return /* @__PURE__ */ jsxs(
              "tr",
              {
                className: "transition-colors",
                style: { borderBottom: isLast ? "none" : "1px solid rgba(145,158,171,0.10)" },
                onMouseEnter: (e) => e.currentTarget.style.backgroundColor = "rgba(145,158,171,0.04)",
                onMouseLeave: (e) => e.currentTarget.style.backgroundColor = "transparent",
                children: [
                  /* @__PURE__ */ jsx("td", { className: "px-6 py-3.5", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2.5", children: [
                    /* @__PURE__ */ jsx(Avatar, { name: tx.user }),
                    /* @__PURE__ */ jsx(
                      "span",
                      {
                        className: "font-medium truncate max-w-[140px]",
                        style: { color: "var(--text-primary)" },
                        children: tx.user
                      }
                    )
                  ] }) }),
                  /* @__PURE__ */ jsx("td", { className: "px-6 py-3.5", children: /* @__PURE__ */ jsx(CoinBadge, { coin: tx.coin }) }),
                  /* @__PURE__ */ jsx("td", { className: "px-6 py-3.5 text-right", children: /* @__PURE__ */ jsx(
                    "span",
                    {
                      className: "font-semibold font-mono text-sm",
                      style: { color: "var(--text-primary)" },
                      children: typeof tx.amount === "number" ? tx.amount.toLocaleString("en-US", { maximumFractionDigits: 6 }) : tx.amount
                    }
                  ) }),
                  /* @__PURE__ */ jsxs("td", { className: "px-6 py-3.5 text-right", children: [
                    /* @__PURE__ */ jsx("p", { className: "text-xs font-medium", style: { color: "var(--text-primary)" }, children: formatDate(tx.createdAt) }),
                    /* @__PURE__ */ jsx("p", { className: "text-[10px] mt-0.5", style: { color: "var(--text-disabled)" }, children: formatTime(tx.createdAt) })
                  ] }),
                  /* @__PURE__ */ jsx("td", { className: "px-6 py-3.5", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center gap-1.5", children: [
                    /* @__PURE__ */ jsx(
                      Link,
                      {
                        href: `/dashboard/transactions/edit/${tx._id}`,
                        className: "w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-150",
                        style: { color: "var(--text-secondary)", border: "1px solid var(--border)" },
                        onMouseEnter: (e) => {
                          const el = e.currentTarget;
                          el.style.backgroundColor = "rgba(79,70,229,0.08)";
                          el.style.borderColor = "rgba(79,70,229,0.30)";
                          el.style.color = "var(--primary)";
                        },
                        onMouseLeave: (e) => {
                          const el = e.currentTarget;
                          el.style.backgroundColor = "transparent";
                          el.style.borderColor = "var(--border)";
                          el.style.color = "var(--text-secondary)";
                        },
                        title: "Editar",
                        children: /* @__PURE__ */ jsxs("svg", { width: "14", height: "14", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: [
                          /* @__PURE__ */ jsx("path", { d: "M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" }),
                          /* @__PURE__ */ jsx("path", { d: "M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" })
                        ] })
                      }
                    ),
                    /* @__PURE__ */ jsx(
                      "button",
                      {
                        onClick: () => handleDelete(tx._id),
                        disabled: deletingId === tx._id,
                        className: "w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-150",
                        style: { color: "var(--text-secondary)", border: "1px solid var(--border)" },
                        onMouseEnter: (e) => {
                          const el = e.currentTarget;
                          el.style.backgroundColor = "rgba(239,68,68,0.08)";
                          el.style.borderColor = "rgba(239,68,68,0.30)";
                          el.style.color = "#dc2626";
                        },
                        onMouseLeave: (e) => {
                          const el = e.currentTarget;
                          el.style.backgroundColor = "transparent";
                          el.style.borderColor = "var(--border)";
                          el.style.color = "var(--text-secondary)";
                        },
                        title: "Eliminar",
                        children: deletingId === tx._id ? /* @__PURE__ */ jsx("span", { className: "w-3 h-3 border-2 border-gray-300 border-t-red-500 rounded-full animate-spin" }) : /* @__PURE__ */ jsxs("svg", { width: "14", height: "14", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: [
                          /* @__PURE__ */ jsx("polyline", { points: "3 6 5 6 21 6" }),
                          /* @__PURE__ */ jsx("path", { d: "M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" }),
                          /* @__PURE__ */ jsx("path", { d: "M10 11v6M14 11v6" }),
                          /* @__PURE__ */ jsx("path", { d: "M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" })
                        ] })
                      }
                    )
                  ] }) })
                ]
              },
              tx._id
            );
          }) })
        ] }),
        /* @__PURE__ */ jsxs(
          "div",
          {
            className: "px-6 py-3 flex items-center justify-between",
            style: { borderTop: "1px solid rgba(145,158,171,0.16)", backgroundColor: "#FAFAFA" },
            children: [
              /* @__PURE__ */ jsxs("p", { className: "text-xs", style: { color: "var(--text-disabled)" }, children: [
                filtered.length,
                " ",
                filtered.length === 1 ? "transacci\xF3n" : "transacciones",
                filterCoin || filterUser ? ` (filtradas de ${transactions.length})` : " en total"
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5", children: [
                /* @__PURE__ */ jsx("div", { className: "w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" }),
                /* @__PURE__ */ jsx("span", { className: "text-xs font-medium", style: { color: "var(--text-secondary)" }, children: API })
              ] })
            ]
          }
        )
      ] })
    ] })
  ] });
}
var COINS = [
  { value: "BTC", label: "Bitcoin (BTC)" },
  { value: "ETH", label: "Ethereum (ETH)" },
  { value: "SOL", label: "Solana (SOL)" },
  { value: "BNB", label: "BNB Chain (BNB)" },
  { value: "XRP", label: "XRP" },
  { value: "USDT", label: "Tether (USDT)" },
  { value: "USDC", label: "USD Coin (USDC)" },
  { value: "DOGE", label: "Dogecoin (DOGE)" },
  { value: "ADA", label: "Cardano (ADA)" },
  { value: "MATIC", label: "Polygon (MATIC)" }
];
var Field = ({
  id,
  label,
  children,
  hint
}) => /* @__PURE__ */ jsxs("div", { children: [
  /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-1.5", children: [
    /* @__PURE__ */ jsx(
      "label",
      {
        htmlFor: id,
        className: "text-xs font-semibold",
        style: { color: "var(--text-secondary)" },
        children: label
      }
    ),
    hint && /* @__PURE__ */ jsx("span", { className: "text-[10px]", style: { color: "var(--text-disabled)" }, children: hint })
  ] }),
  children
] });
function NewTransactionPage() {
  const router = useRouter();
  const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";
  const [user, setUser] = useState("");
  const [coin, setCoin] = useState("BTC");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const inputStyle = (focused) => ({
    width: "100%",
    padding: focused ? "11px 13px" : "12px 14px",
    border: `${focused ? 2 : 1}px solid ${focused ? "var(--primary)" : "var(--border)"}`,
    borderRadius: 8,
    fontSize: "0.875rem",
    color: "var(--text-primary)",
    backgroundColor: "white",
    boxShadow: focused ? "0 0 0 3px rgba(79,70,229,0.08)" : "none",
    outline: "none",
    transition: "all 0.2s"
  });
  const [focusedField, setFocusedField] = useState(null);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user.trim()) {
      setError("El nombre de usuario es requerido");
      return;
    }
    if (!coin) {
      setError("Selecciona una moneda");
      return;
    }
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      setError("Ingresa un monto v\xE1lido mayor a 0");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API}/api/transactions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user: user.trim(), coin, amount: Number(amount) })
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message ?? `Error ${res.status}`);
      }
      setSuccess(true);
      setTimeout(() => router.push("/dashboard/transactions"), 1200);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al crear la transacci\xF3n");
    } finally {
      setLoading(false);
    }
  };
  if (success) {
    return /* @__PURE__ */ jsx("div", { className: "p-6 flex items-center justify-center min-h-[60vh]", children: /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
      /* @__PURE__ */ jsx(
        "div",
        {
          className: "w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center",
          style: { background: "linear-gradient(135deg, #34d399, #059669)" },
          children: /* @__PURE__ */ jsx("svg", { width: "28", height: "28", viewBox: "0 0 24 24", fill: "none", stroke: "white", strokeWidth: "2.5", children: /* @__PURE__ */ jsx("polyline", { points: "20 6 9 17 4 12" }) })
        }
      ),
      /* @__PURE__ */ jsx("h2", { className: "text-xl font-bold mb-1", style: { color: "var(--text-primary)" }, children: "\xA1Transacci\xF3n creada!" }),
      /* @__PURE__ */ jsx("p", { className: "text-sm", style: { color: "var(--text-secondary)" }, children: "Redirigiendo a la lista..." })
    ] }) });
  }
  return /* @__PURE__ */ jsx("div", { className: "p-6", children: /* @__PURE__ */ jsxs("div", { className: "max-w-lg mx-auto", children: [
    /* @__PURE__ */ jsxs(
      Link,
      {
        href: "/dashboard/transactions",
        className: "inline-flex items-center gap-2 text-sm mb-6 transition-colors",
        style: { color: "var(--text-secondary)" },
        children: [
          /* @__PURE__ */ jsxs("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: [
            /* @__PURE__ */ jsx("line", { x1: "19", y1: "12", x2: "5", y2: "12" }),
            /* @__PURE__ */ jsx("polyline", { points: "12 19 5 12 12 5" })
          ] }),
          "Volver a la lista"
        ]
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-xl overflow-hidden", style: { boxShadow: "var(--shadow-card)" }, children: [
      /* @__PURE__ */ jsx("div", { className: "px-6 py-5", style: { borderBottom: "1px solid rgba(145,158,171,0.16)" }, children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsx(
          "div",
          {
            className: "w-10 h-10 rounded-xl flex items-center justify-center text-white",
            style: { background: "linear-gradient(135deg, #6366f1, #4f46e5)", boxShadow: "0 8px 16px rgba(79,70,229,0.28)" },
            children: /* @__PURE__ */ jsxs("svg", { width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", stroke: "white", strokeWidth: "2.5", children: [
              /* @__PURE__ */ jsx("line", { x1: "12", y1: "5", x2: "12", y2: "19" }),
              /* @__PURE__ */ jsx("line", { x1: "5", y1: "12", x2: "19", y2: "12" })
            ] })
          }
        ),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h2", { className: "text-base font-bold", style: { color: "var(--text-primary)" }, children: "Nueva Transacci\xF3n" }),
          /* @__PURE__ */ jsxs("p", { className: "text-xs mt-0.5", style: { color: "var(--text-secondary)" }, children: [
            "POST ",
            API,
            "/api/transactions"
          ] })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "px-6 py-6 space-y-5", children: [
        error && /* @__PURE__ */ jsxs(
          "div",
          {
            className: "rounded-xl px-4 py-3 text-sm flex items-center gap-2.5",
            style: { backgroundColor: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.24)", color: "#dc2626" },
            children: [
              /* @__PURE__ */ jsxs("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.5", children: [
                /* @__PURE__ */ jsx("circle", { cx: "12", cy: "12", r: "10" }),
                /* @__PURE__ */ jsx("line", { x1: "12", y1: "8", x2: "12", y2: "12" }),
                /* @__PURE__ */ jsx("line", { x1: "12", y1: "16", x2: "12.01", y2: "16" })
              ] }),
              error
            ]
          }
        ),
        /* @__PURE__ */ jsx(Field, { id: "user", label: "Nombre de usuario", hint: "Quien realiza la transacci\xF3n", children: /* @__PURE__ */ jsx(
          "input",
          {
            id: "user",
            type: "text",
            required: true,
            value: user,
            onChange: (e) => setUser(e.target.value),
            onFocus: () => setFocusedField("user"),
            onBlur: () => setFocusedField(null),
            placeholder: "ej. Juan P\xE9rez",
            style: inputStyle(focusedField === "user")
          }
        ) }),
        /* @__PURE__ */ jsx(Field, { id: "coin", label: "Criptomoneda", children: /* @__PURE__ */ jsx(
          "select",
          {
            id: "coin",
            required: true,
            value: coin,
            onChange: (e) => setCoin(e.target.value),
            onFocus: () => setFocusedField("coin"),
            onBlur: () => setFocusedField(null),
            style: inputStyle(focusedField === "coin"),
            children: COINS.map((c) => /* @__PURE__ */ jsx("option", { value: c.value, children: c.label }, c.value))
          }
        ) }),
        /* @__PURE__ */ jsx(Field, { id: "amount", label: "Monto", hint: "N\xFAmero de unidades de la criptomoneda", children: /* @__PURE__ */ jsx(
          "input",
          {
            id: "amount",
            type: "number",
            required: true,
            min: "0.000001",
            step: "any",
            value: amount,
            onChange: (e) => setAmount(e.target.value),
            onFocus: () => setFocusedField("amount"),
            onBlur: () => setFocusedField(null),
            placeholder: "ej. 0.5",
            style: inputStyle(focusedField === "amount")
          }
        ) }),
        (user || amount) && /* @__PURE__ */ jsxs("div", { className: "rounded-xl p-4", style: { backgroundColor: "#F4F6F8" }, children: [
          /* @__PURE__ */ jsx(
            "p",
            {
              className: "text-[10px] font-semibold uppercase tracking-[0.08em] mb-2",
              style: { color: "var(--text-disabled)" },
              children: "Request body (JSON)"
            }
          ),
          /* @__PURE__ */ jsx("pre", { className: "text-xs font-mono", style: { color: "var(--text-primary)" }, children: JSON.stringify({
            user: user || "...",
            coin,
            amount: amount ? Number(amount) : "..."
          }, null, 2) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex gap-3 pt-1", children: [
          /* @__PURE__ */ jsx(
            Link,
            {
              href: "/dashboard/transactions",
              className: "flex-1 py-3 rounded-lg text-sm font-bold text-center transition-all duration-150",
              style: { border: "1px solid var(--border)", color: "var(--text-secondary)", backgroundColor: "white" },
              children: "Cancelar"
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "submit",
              disabled: loading,
              className: "flex-1 py-3 rounded-lg text-sm font-bold text-white transition-all duration-200",
              style: {
                background: loading ? "rgba(79,70,229,0.6)" : "linear-gradient(135deg, #6366f1, #4f46e5)",
                boxShadow: loading ? "none" : "0 8px 16px rgba(79,70,229,0.28)",
                cursor: loading ? "not-allowed" : "pointer",
                letterSpacing: "0.04em"
              },
              children: loading ? /* @__PURE__ */ jsxs("span", { className: "flex items-center justify-center gap-2", children: [
                /* @__PURE__ */ jsx(
                  "span",
                  {
                    className: "w-4 h-4 border-2 rounded-full animate-spin",
                    style: { borderColor: "rgba(255,255,255,0.3)", borderTopColor: "white" }
                  }
                ),
                "Creando..."
              ] }) : "CREAR TRANSACCI\xD3N"
            }
          )
        ] })
      ] })
    ] })
  ] }) });
}
var COINS2 = [
  "BTC",
  "ETH",
  "SOL",
  "BNB",
  "XRP",
  "USDT",
  "USDC",
  "DOGE",
  "ADA",
  "MATIC"
];
function EditTransactionPage() {
  const { id } = useParams();
  const router = useRouter();
  const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";
  const [user, setUser] = useState("");
  const [coin, setCoin] = useState("BTC");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`${API}/api/transactions`);
        if (!res.ok) throw new Error(`Error ${res.status}`);
        const data = await res.json();
        const tx = data.find((t) => t._id === id);
        if (!tx) throw new Error("Transacci\xF3n no encontrada");
        setUser(tx.user);
        setCoin(tx.coin.toUpperCase());
        setAmount(String(tx.amount));
      } catch (e) {
        setError(e instanceof Error ? e.message : "Error cargando datos");
      } finally {
        setFetching(false);
      }
    };
    load();
  }, [id, API]);
  const inputStyle = (focused) => ({
    width: "100%",
    padding: focused ? "11px 13px" : "12px 14px",
    border: `${focused ? 2 : 1}px solid ${focused ? "var(--primary)" : "var(--border)"}`,
    borderRadius: 8,
    fontSize: "0.875rem",
    color: "var(--text-primary)",
    backgroundColor: "white",
    boxShadow: focused ? "0 0 0 3px rgba(79,70,229,0.08)" : "none",
    outline: "none",
    transition: "all 0.2s"
  });
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user.trim()) {
      setError("El nombre de usuario es requerido");
      return;
    }
    if (isNaN(Number(amount)) || Number(amount) <= 0) {
      setError("Ingresa un monto v\xE1lido mayor a 0");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API}/api/transactions/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user: user.trim(), coin, amount: Number(amount) })
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message ?? `Error ${res.status}`);
      }
      setSuccess(true);
      setTimeout(() => router.push("/dashboard/transactions"), 1200);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al actualizar");
    } finally {
      setLoading(false);
    }
  };
  if (success) {
    return /* @__PURE__ */ jsx("div", { className: "p-6 flex items-center justify-center min-h-[60vh]", children: /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
      /* @__PURE__ */ jsx(
        "div",
        {
          className: "w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center",
          style: { background: "linear-gradient(135deg, #34d399, #059669)" },
          children: /* @__PURE__ */ jsx("svg", { width: "28", height: "28", viewBox: "0 0 24 24", fill: "none", stroke: "white", strokeWidth: "2.5", children: /* @__PURE__ */ jsx("polyline", { points: "20 6 9 17 4 12" }) })
        }
      ),
      /* @__PURE__ */ jsx("h2", { className: "text-xl font-bold mb-1", style: { color: "var(--text-primary)" }, children: "\xA1Transacci\xF3n actualizada!" }),
      /* @__PURE__ */ jsx("p", { className: "text-sm", style: { color: "var(--text-secondary)" }, children: "Redirigiendo..." })
    ] }) });
  }
  return /* @__PURE__ */ jsx("div", { className: "p-6", children: /* @__PURE__ */ jsxs("div", { className: "max-w-lg mx-auto", children: [
    /* @__PURE__ */ jsxs(
      Link,
      {
        href: "/dashboard/transactions",
        className: "inline-flex items-center gap-2 text-sm mb-6 transition-colors",
        style: { color: "var(--text-secondary)" },
        children: [
          /* @__PURE__ */ jsxs("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: [
            /* @__PURE__ */ jsx("line", { x1: "19", y1: "12", x2: "5", y2: "12" }),
            /* @__PURE__ */ jsx("polyline", { points: "12 19 5 12 12 5" })
          ] }),
          "Volver a la lista"
        ]
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-xl overflow-hidden", style: { boxShadow: "var(--shadow-card)" }, children: [
      /* @__PURE__ */ jsx("div", { className: "px-6 py-5", style: { borderBottom: "1px solid rgba(145,158,171,0.16)" }, children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsx(
          "div",
          {
            className: "w-10 h-10 rounded-xl flex items-center justify-center text-white",
            style: { background: "linear-gradient(135deg, #a78bfa, #7c3aed)", boxShadow: "0 8px 16px rgba(124,58,237,0.28)" },
            children: /* @__PURE__ */ jsxs("svg", { width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", stroke: "white", strokeWidth: "2.5", children: [
              /* @__PURE__ */ jsx("path", { d: "M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" }),
              /* @__PURE__ */ jsx("path", { d: "M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" })
            ] })
          }
        ),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h2", { className: "text-base font-bold", style: { color: "var(--text-primary)" }, children: "Editar Transacci\xF3n" }),
          /* @__PURE__ */ jsxs("p", { className: "text-xs mt-0.5 font-mono", style: { color: "var(--text-disabled)" }, children: [
            "ID: ",
            id?.slice(-12)
          ] })
        ] })
      ] }) }),
      fetching ? /* @__PURE__ */ jsx("div", { className: "px-6 py-12 animate-pulse space-y-4", children: [1, 2, 3].map((i) => /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("div", { className: "h-3 w-20 bg-gray-200 rounded mb-2" }),
        /* @__PURE__ */ jsx("div", { className: "h-11 bg-gray-100 rounded-lg" })
      ] }, i)) }) : /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "px-6 py-6 space-y-5", children: [
        error && /* @__PURE__ */ jsxs(
          "div",
          {
            className: "rounded-xl px-4 py-3 text-sm flex items-center gap-2.5",
            style: { backgroundColor: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.24)", color: "#dc2626" },
            children: [
              /* @__PURE__ */ jsxs("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.5", children: [
                /* @__PURE__ */ jsx("circle", { cx: "12", cy: "12", r: "10" }),
                /* @__PURE__ */ jsx("line", { x1: "12", y1: "8", x2: "12", y2: "12" }),
                /* @__PURE__ */ jsx("line", { x1: "12", y1: "16", x2: "12.01", y2: "16" })
              ] }),
              error
            ]
          }
        ),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx(
            "label",
            {
              htmlFor: "user",
              className: "block text-xs font-semibold mb-1.5",
              style: { color: "var(--text-secondary)" },
              children: "Nombre de usuario"
            }
          ),
          /* @__PURE__ */ jsx(
            "input",
            {
              id: "user",
              type: "text",
              required: true,
              value: user,
              onChange: (e) => setUser(e.target.value),
              onFocus: () => setFocusedField("user"),
              onBlur: () => setFocusedField(null),
              style: inputStyle(focusedField === "user")
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx(
            "label",
            {
              htmlFor: "coin",
              className: "block text-xs font-semibold mb-1.5",
              style: { color: "var(--text-secondary)" },
              children: "Criptomoneda"
            }
          ),
          /* @__PURE__ */ jsx(
            "select",
            {
              id: "coin",
              required: true,
              value: coin,
              onChange: (e) => setCoin(e.target.value),
              onFocus: () => setFocusedField("coin"),
              onBlur: () => setFocusedField(null),
              style: inputStyle(focusedField === "coin"),
              children: COINS2.map((c) => /* @__PURE__ */ jsx("option", { value: c, children: c }, c))
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx(
            "label",
            {
              htmlFor: "amount",
              className: "block text-xs font-semibold mb-1.5",
              style: { color: "var(--text-secondary)" },
              children: "Monto"
            }
          ),
          /* @__PURE__ */ jsx(
            "input",
            {
              id: "amount",
              type: "number",
              required: true,
              min: "0.000001",
              step: "any",
              value: amount,
              onChange: (e) => setAmount(e.target.value),
              onFocus: () => setFocusedField("amount"),
              onBlur: () => setFocusedField(null),
              style: inputStyle(focusedField === "amount")
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex gap-3 pt-1", children: [
          /* @__PURE__ */ jsx(
            Link,
            {
              href: "/dashboard/transactions",
              className: "flex-1 py-3 rounded-lg text-sm font-bold text-center",
              style: { border: "1px solid var(--border)", color: "var(--text-secondary)", backgroundColor: "white" },
              children: "Cancelar"
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "submit",
              disabled: loading,
              className: "flex-1 py-3 rounded-lg text-sm font-bold text-white",
              style: {
                background: loading ? "rgba(124,58,237,0.6)" : "linear-gradient(135deg, #a78bfa, #7c3aed)",
                boxShadow: loading ? "none" : "0 8px 16px rgba(124,58,237,0.28)",
                cursor: loading ? "not-allowed" : "pointer",
                letterSpacing: "0.04em"
              },
              children: loading ? /* @__PURE__ */ jsxs("span", { className: "flex items-center justify-center gap-2", children: [
                /* @__PURE__ */ jsx(
                  "span",
                  {
                    className: "w-4 h-4 border-2 rounded-full animate-spin",
                    style: { borderColor: "rgba(255,255,255,0.3)", borderTopColor: "white" }
                  }
                ),
                "Guardando..."
              ] }) : "GUARDAR CAMBIOS"
            }
          )
        ] })
      ] })
    ] })
  ] }) });
}
var IconList = () => /* @__PURE__ */ jsxs("svg", { width: "19", height: "19", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.8", strokeLinecap: "round", strokeLinejoin: "round", children: [
  /* @__PURE__ */ jsx("line", { x1: "8", y1: "6", x2: "21", y2: "6" }),
  /* @__PURE__ */ jsx("line", { x1: "8", y1: "12", x2: "21", y2: "12" }),
  /* @__PURE__ */ jsx("line", { x1: "8", y1: "18", x2: "21", y2: "18" }),
  /* @__PURE__ */ jsx("line", { x1: "3", y1: "6", x2: "3.01", y2: "6" }),
  /* @__PURE__ */ jsx("line", { x1: "3", y1: "12", x2: "3.01", y2: "12" }),
  /* @__PURE__ */ jsx("line", { x1: "3", y1: "18", x2: "3.01", y2: "18" })
] });
var IconPlus = () => /* @__PURE__ */ jsxs("svg", { width: "19", height: "19", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.8", strokeLinecap: "round", strokeLinejoin: "round", children: [
  /* @__PURE__ */ jsx("circle", { cx: "12", cy: "12", r: "10" }),
  /* @__PURE__ */ jsx("line", { x1: "12", y1: "8", x2: "12", y2: "16" }),
  /* @__PURE__ */ jsx("line", { x1: "8", y1: "12", x2: "16", y2: "12" })
] });
var IconArrowLeft = () => /* @__PURE__ */ jsxs("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [
  /* @__PURE__ */ jsx("line", { x1: "19", y1: "12", x2: "5", y2: "12" }),
  /* @__PURE__ */ jsx("polyline", { points: "12 19 5 12 12 5" })
] });
var IconLogo = () => /* @__PURE__ */ jsx("svg", { width: "20", height: "20", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: /* @__PURE__ */ jsx("path", { d: "M12 2v20M17 5H9.5a3.5 3.5 0 1 0 0 7h5a3.5 3.5 0 1 1 0 7H6" }) });
var NAV_ITEMS = [
  { href: "/dashboard/transactions", label: "Lista de Transacciones", icon: /* @__PURE__ */ jsx(IconList, {}) },
  { href: "/dashboard/transactions/new", label: "Nueva Transacci\xF3n", icon: /* @__PURE__ */ jsx(IconPlus, {}) }
];
function Sidebar() {
  const pathname = usePathname();
  return /* @__PURE__ */ jsxs(
    "aside",
    {
      className: "w-64 min-h-screen flex flex-col shrink-0",
      style: {
        backgroundColor: "var(--sidebar-bg)",
        borderRight: "1px solid var(--sidebar-border)"
      },
      children: [
        /* @__PURE__ */ jsxs(
          "div",
          {
            className: "px-5 py-5",
            style: { borderBottom: "1px solid var(--sidebar-border)" },
            children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 mb-3", children: [
                /* @__PURE__ */ jsx(
                  "div",
                  {
                    className: "w-9 h-9 rounded-lg flex items-center justify-center text-white shrink-0",
                    style: {
                      background: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",
                      boxShadow: "0 8px 16px 0 rgba(79,70,229,0.35)"
                    },
                    children: /* @__PURE__ */ jsx(IconLogo, {})
                  }
                ),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("h1", { className: "text-sm font-bold text-white leading-none", children: "Crypto Dashboard" }),
                  /* @__PURE__ */ jsx("p", { className: "text-[11px] mt-0.5 leading-none", style: { color: "#637381" }, children: "Panel de Control" })
                ] })
              ] }),
              /* @__PURE__ */ jsxs(
                "div",
                {
                  className: "inline-flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-full",
                  style: {
                    backgroundColor: "rgba(79,70,229,0.20)",
                    color: "#818CF8",
                    border: "1px solid rgba(79,70,229,0.30)"
                  },
                  children: [
                    /* @__PURE__ */ jsx("span", { className: "w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" }),
                    "MFE \xB7 Transacciones \xB7 :3001"
                  ]
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsxs("nav", { className: "flex-1 px-3 py-5", children: [
          /* @__PURE__ */ jsx(
            "p",
            {
              className: "text-[10px] font-bold uppercase tracking-[0.1em] px-3 mb-2",
              style: { color: "rgba(145,158,171,0.48)" },
              children: "M\xF3dulo"
            }
          ),
          /* @__PURE__ */ jsx("div", { className: "space-y-0.5", children: NAV_ITEMS.map((item) => {
            const fullPath = `/dashboard/transactions${item.href === "/" ? "" : item.href}`;
            const isActive = pathname === fullPath;
            return /* @__PURE__ */ jsxs(
              Link,
              {
                href: item.href,
                className: "group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 relative",
                style: {
                  color: isActive ? "var(--sidebar-text-active)" : "var(--sidebar-text)",
                  backgroundColor: isActive ? "var(--sidebar-active-bg)" : "transparent"
                },
                onMouseEnter: (e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.06)";
                    e.currentTarget.style.color = "#C4CDD5";
                  }
                },
                onMouseLeave: (e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = "transparent";
                    e.currentTarget.style.color = "var(--sidebar-text)";
                  }
                },
                children: [
                  isActive && /* @__PURE__ */ jsx(
                    "span",
                    {
                      className: "absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 rounded-r-full",
                      style: { backgroundColor: "#818CF8" }
                    }
                  ),
                  /* @__PURE__ */ jsx("span", { style: { color: isActive ? "#818CF8" : "#637381" }, children: item.icon }),
                  /* @__PURE__ */ jsx("span", { children: item.label })
                ]
              },
              item.href
            );
          }) })
        ] }),
        /* @__PURE__ */ jsx(
          "div",
          {
            className: "px-3 py-4",
            style: { borderTop: "1px solid var(--sidebar-border)" },
            children: /* @__PURE__ */ jsxs(
              "a",
              {
                href: "http://localhost:3000/dashboard",
                className: "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 w-full",
                style: { color: "#637381" },
                onMouseEnter: (e) => {
                  e.currentTarget.style.color = "#C4CDD5";
                  e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.06)";
                },
                onMouseLeave: (e) => {
                  e.currentTarget.style.color = "#637381";
                  e.currentTarget.style.backgroundColor = "transparent";
                },
                children: [
                  /* @__PURE__ */ jsx(IconArrowLeft, {}),
                  /* @__PURE__ */ jsx("span", { children: "Dashboard Principal" })
                ]
              }
            )
          }
        )
      ]
    }
  );
}
function EmbeddedShell({ children }) {
  const [isEmbedded, setIsEmbedded] = useState(false);
  useEffect(() => {
    try {
      setIsEmbedded(window.self !== window.top);
    } catch {
      setIsEmbedded(true);
    }
  }, []);
  if (isEmbedded) {
    return /* @__PURE__ */ jsx("div", { style: { backgroundColor: "var(--background)", minHeight: "100vh" }, children });
  }
  return /* @__PURE__ */ jsxs("div", { className: "flex min-h-screen", style: { backgroundColor: "var(--background)" }, children: [
    /* @__PURE__ */ jsx(Sidebar, {}),
    /* @__PURE__ */ jsxs("div", { className: "flex-1 flex flex-col min-w-0", children: [
      /* @__PURE__ */ jsxs(
        "header",
        {
          className: "h-16 flex items-center px-6 shrink-0",
          style: {
            backgroundColor: "rgba(244,246,248,0.95)",
            borderBottom: "1px solid rgba(145,158,171,0.24)",
            position: "sticky",
            top: 0,
            zIndex: 40
          },
          children: [
            /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
              /* @__PURE__ */ jsxs("nav", { className: "flex items-center gap-1.5 text-xs mb-0.5", children: [
                /* @__PURE__ */ jsx("span", { style: { color: "var(--text-secondary)" }, children: "Inicio" }),
                /* @__PURE__ */ jsx("svg", { width: "10", height: "10", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: /* @__PURE__ */ jsx("polyline", { points: "9 18 15 12 9 6" }) }),
                /* @__PURE__ */ jsx("span", { style: { color: "var(--text-secondary)" }, children: "Gesti\xF3n" }),
                /* @__PURE__ */ jsx("svg", { width: "10", height: "10", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: /* @__PURE__ */ jsx("polyline", { points: "9 18 15 12 9 6" }) }),
                /* @__PURE__ */ jsx("span", { className: "font-semibold", style: { color: "var(--text-primary)" }, children: "Transacciones" })
              ] }),
              /* @__PURE__ */ jsx("h1", { className: "text-xl font-bold leading-none", style: { color: "var(--text-primary)" }, children: "Transacciones" })
            ] }),
            /* @__PURE__ */ jsxs(
              "div",
              {
                className: "hidden sm:flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full",
                style: {
                  backgroundColor: "rgba(79,70,229,0.10)",
                  color: "var(--primary)",
                  border: "1px solid rgba(79,70,229,0.20)"
                },
                children: [
                  /* @__PURE__ */ jsx("span", { className: "w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" }),
                  "Microfrontend \xB7 Puerto 3001"
                ]
              }
            )
          ]
        }
      ),
      /* @__PURE__ */ jsx("main", { className: "flex-1 overflow-auto", children })
    ] })
  ] });
}

export { EditTransactionPage, EmbeddedShell, NewTransactionPage, Sidebar, TransactionsPage as TransactionsListPage };
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map
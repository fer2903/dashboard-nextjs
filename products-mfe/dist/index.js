"use client";
import Link from 'next/link';
import useSWR from 'swr';
import { jsxs, jsx } from 'react/jsx-runtime';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';

// app/page.tsx
var HOST_URL = process.env.NEXT_PUBLIC_HOST_URL ?? "http://localhost:3000";
var fetcher = (url) => fetch(url).then((r) => r.json());
var useProducts = () => {
  const { data, error, isLoading, mutate } = useSWR(
    `${HOST_URL}/api/products`,
    fetcher
  );
  return { products: data, loading: isLoading, error, mutate };
};
var createProduct = async (data) => {
  const res = await fetch(`${HOST_URL}/api/products`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error ?? "Error al crear producto");
  }
  return res.json();
};
var updateProduct = async (id, data) => {
  const res = await fetch(`${HOST_URL}/api/products/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error ?? "Error al actualizar producto");
  }
  return res.json();
};
var deleteProduct = async (id) => {
  const res = await fetch(`${HOST_URL}/api/products/${id}`, {
    method: "DELETE"
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error ?? "Error al eliminar producto");
  }
  return res.json();
};
var CATEGORY_COLORS = {
  DeFi: { bg: "rgba(79,70,229,0.1)", text: "#4f46e5", border: "rgba(79,70,229,0.2)" },
  NFT: { bg: "rgba(124,58,237,0.1)", text: "#7c3aed", border: "rgba(124,58,237,0.2)" },
  Layer1: { bg: "rgba(2,132,199,0.1)", text: "#0284c7", border: "rgba(2,132,199,0.2)" },
  Layer2: { bg: "rgba(5,150,105,0.1)", text: "#059669", border: "rgba(5,150,105,0.2)" },
  Stablecoin: { bg: "rgba(217,119,6,0.1)", text: "#d97706", border: "rgba(217,119,6,0.2)" },
  Exchange: { bg: "rgba(225,29,72,0.1)", text: "#e11d48", border: "rgba(225,29,72,0.2)" },
  Otro: { bg: "rgba(107,114,128,0.1)", text: "#6b7280", border: "rgba(107,114,128,0.2)" }
};
var CategoryBadge = ({ category }) => {
  const colors = CATEGORY_COLORS[category] ?? CATEGORY_COLORS["Otro"];
  return /* @__PURE__ */ jsx(
    "span",
    {
      className: "inline-flex items-center text-xs font-bold px-2.5 py-1 rounded-full",
      style: { backgroundColor: colors.bg, color: colors.text, border: `1px solid ${colors.border}` },
      children: category
    }
  );
};
var StatusBadge = ({ status }) => {
  const isActive = status === "active";
  return /* @__PURE__ */ jsxs(
    "span",
    {
      className: "inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full",
      style: {
        backgroundColor: isActive ? "rgba(5,150,105,0.1)" : "rgba(107,114,128,0.1)",
        color: isActive ? "#059669" : "#6b7280",
        border: `1px solid ${isActive ? "rgba(5,150,105,0.2)" : "rgba(107,114,128,0.2)"}`
      },
      children: [
        /* @__PURE__ */ jsx(
          "span",
          {
            className: "w-1.5 h-1.5 rounded-full",
            style: { backgroundColor: isActive ? "#059669" : "#9ca3af" }
          }
        ),
        isActive ? "Activo" : "Inactivo"
      ]
    }
  );
};
var formatPrice = (price) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(price);
var formatDate = (iso) => new Date(iso).toLocaleDateString("es-MX", { year: "numeric", month: "short", day: "numeric" });
var TableSkeleton = () => /* @__PURE__ */ jsx("div", { className: "animate-pulse divide-y", style: { borderColor: "rgba(145,158,171,0.12)" }, children: [1, 2, 3, 4].map((i) => /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4 px-6 py-4", children: [
  /* @__PURE__ */ jsx("div", { className: "h-4 bg-gray-200 rounded w-8" }),
  /* @__PURE__ */ jsx("div", { className: "h-4 bg-gray-200 rounded flex-1" }),
  /* @__PURE__ */ jsx("div", { className: "h-6 bg-gray-100 rounded-full w-20" }),
  /* @__PURE__ */ jsx("div", { className: "h-4 bg-gray-200 rounded w-16" }),
  /* @__PURE__ */ jsx("div", { className: "h-4 bg-gray-200 rounded w-10" }),
  /* @__PURE__ */ jsx("div", { className: "h-6 bg-gray-100 rounded-full w-16" }),
  /* @__PURE__ */ jsx("div", { className: "h-4 bg-gray-100 rounded w-24" })
] }, i)) });
function ProductsListPage() {
  const { products, loading, error, mutate } = useProducts();
  const handleDelete = async (product) => {
    if (!confirm(`\xBFEliminar "${product.name}"?`)) return;
    try {
      await deleteProduct(product._id);
      mutate();
    } catch (e) {
      alert(e.message);
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "p-6 space-y-5", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
      products && !loading && /* @__PURE__ */ jsxs(
        "div",
        {
          className: "inline-flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-full",
          style: {
            backgroundColor: "rgba(79,70,229,0.10)",
            color: "#4f46e5",
            border: "1px solid rgba(79,70,229,0.20)"
          },
          children: [
            /* @__PURE__ */ jsxs("svg", { width: "14", height: "14", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.5", children: [
              /* @__PURE__ */ jsx("path", { d: "M20 7H4c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2z" }),
              /* @__PURE__ */ jsx("path", { d: "M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" })
            ] }),
            products.length,
            " ",
            products.length === 1 ? "producto" : "productos"
          ]
        }
      ),
      !loading && /* @__PURE__ */ jsx("div", {}),
      /* @__PURE__ */ jsxs(
        Link,
        {
          href: "/new",
          className: "inline-flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-lg text-white",
          style: { backgroundColor: "#4f46e5" },
          children: [
            /* @__PURE__ */ jsxs("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.5", children: [
              /* @__PURE__ */ jsx("line", { x1: "12", y1: "5", x2: "12", y2: "19" }),
              /* @__PURE__ */ jsx("line", { x1: "5", y1: "12", x2: "19", y2: "12" })
            ] }),
            "Nuevo Producto"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxs(
      "div",
      {
        className: "bg-white rounded-xl overflow-hidden",
        style: { boxShadow: "0 0 2px 0 rgba(145,158,171,0.2), 0 12px 24px -4px rgba(145,158,171,0.12)" },
        children: [
          /* @__PURE__ */ jsxs("div", { className: "px-6 py-5", style: { borderBottom: "1px solid rgba(145,158,171,0.16)" }, children: [
            /* @__PURE__ */ jsx("h2", { className: "text-base font-bold", style: { color: "var(--text-primary)" }, children: "Cat\xE1logo de Productos" }),
            /* @__PURE__ */ jsx("p", { className: "text-xs mt-0.5", style: { color: "var(--text-secondary)" }, children: "Gesti\xF3n de activos digitales disponibles" })
          ] }),
          loading && /* @__PURE__ */ jsx(TableSkeleton, {}),
          error && !loading && /* @__PURE__ */ jsxs("div", { className: "px-6 py-12 text-center", children: [
            /* @__PURE__ */ jsx("p", { className: "font-semibold text-red-600", children: "Error al cargar productos" }),
            /* @__PURE__ */ jsxs("p", { className: "text-sm mt-1", style: { color: "var(--text-secondary)" }, children: [
              "Verifica la conexi\xF3n con el host (",
              process.env.NEXT_PUBLIC_HOST_URL,
              ")"
            ] })
          ] }),
          !loading && !error && products && products.length === 0 && /* @__PURE__ */ jsxs("div", { className: "px-6 py-16 text-center", children: [
            /* @__PURE__ */ jsx("p", { className: "font-semibold", style: { color: "var(--text-primary)" }, children: "No hay productos registrados" }),
            /* @__PURE__ */ jsx("p", { className: "text-sm mt-1", style: { color: "var(--text-secondary)" }, children: 'Crea el primer producto usando el bot\xF3n "Nuevo Producto"' })
          ] }),
          !loading && !error && products && products.length > 0 && /* @__PURE__ */ jsxs("div", { className: "overflow-x-auto", children: [
            /* @__PURE__ */ jsxs("table", { className: "w-full text-sm", children: [
              /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsx("tr", { style: { backgroundColor: "#F4F6F8", borderBottom: "1px solid rgba(145,158,171,0.24)" }, children: ["S\xEDmbolo", "Nombre", "Categor\xEDa", "Precio", "Stock", "Status", "Creado", ""].map((h) => /* @__PURE__ */ jsx(
                "th",
                {
                  className: "text-left px-4 py-3 text-xs font-semibold uppercase tracking-[0.08em]",
                  style: { color: "var(--text-secondary)" },
                  children: h
                },
                h
              )) }) }),
              /* @__PURE__ */ jsx("tbody", { children: products.map((product, idx) => {
                const isLast = idx === products.length - 1;
                return /* @__PURE__ */ jsxs(
                  "tr",
                  {
                    style: { borderBottom: isLast ? "none" : "1px solid rgba(145,158,171,0.12)" },
                    onMouseEnter: (e) => {
                      e.currentTarget.style.backgroundColor = "rgba(145,158,171,0.04)";
                    },
                    onMouseLeave: (e) => {
                      e.currentTarget.style.backgroundColor = "transparent";
                    },
                    children: [
                      /* @__PURE__ */ jsx("td", { className: "px-4 py-4", children: /* @__PURE__ */ jsx("span", { className: "font-mono text-xs font-bold px-2 py-1 rounded", style: { backgroundColor: "rgba(79,70,229,0.08)", color: "#4f46e5" }, children: product.symbol }) }),
                      /* @__PURE__ */ jsx("td", { className: "px-4 py-4 font-semibold", style: { color: "var(--text-primary)" }, children: product.name }),
                      /* @__PURE__ */ jsx("td", { className: "px-4 py-4", children: /* @__PURE__ */ jsx(CategoryBadge, { category: product.category }) }),
                      /* @__PURE__ */ jsx("td", { className: "px-4 py-4 font-medium", style: { color: "var(--text-primary)" }, children: formatPrice(product.price) }),
                      /* @__PURE__ */ jsx("td", { className: "px-4 py-4", style: { color: "var(--text-secondary)" }, children: product.stock.toLocaleString() }),
                      /* @__PURE__ */ jsx("td", { className: "px-4 py-4", children: /* @__PURE__ */ jsx(StatusBadge, { status: product.status }) }),
                      /* @__PURE__ */ jsx("td", { className: "px-4 py-4 text-xs", style: { color: "var(--text-disabled)" }, children: formatDate(product.createdAt) }),
                      /* @__PURE__ */ jsx("td", { className: "px-4 py-4", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                        /* @__PURE__ */ jsxs(
                          Link,
                          {
                            href: `/edit/${product._id}`,
                            className: "inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1.5 rounded-lg",
                            style: { color: "#4f46e5", backgroundColor: "rgba(79,70,229,0.08)" },
                            children: [
                              /* @__PURE__ */ jsxs("svg", { width: "12", height: "12", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.5", children: [
                                /* @__PURE__ */ jsx("path", { d: "M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" }),
                                /* @__PURE__ */ jsx("path", { d: "M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" })
                              ] }),
                              "Editar"
                            ]
                          }
                        ),
                        /* @__PURE__ */ jsxs(
                          "button",
                          {
                            onClick: () => handleDelete(product),
                            className: "inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1.5 rounded-lg",
                            style: { color: "#e11d48", backgroundColor: "rgba(225,29,72,0.08)" },
                            children: [
                              /* @__PURE__ */ jsxs("svg", { width: "12", height: "12", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.5", children: [
                                /* @__PURE__ */ jsx("polyline", { points: "3 6 5 6 21 6" }),
                                /* @__PURE__ */ jsx("path", { d: "M19 6l-1 14H6L5 6" }),
                                /* @__PURE__ */ jsx("path", { d: "M10 11v6" }),
                                /* @__PURE__ */ jsx("path", { d: "M14 11v6" }),
                                /* @__PURE__ */ jsx("path", { d: "M9 6V4h6v2" })
                              ] }),
                              "Eliminar"
                            ]
                          }
                        )
                      ] }) })
                    ]
                  },
                  product._id
                );
              }) })
            ] }),
            /* @__PURE__ */ jsx(
              "div",
              {
                className: "px-6 py-3",
                style: { borderTop: "1px solid rgba(145,158,171,0.16)", backgroundColor: "#FAFAFA" },
                children: /* @__PURE__ */ jsxs("p", { className: "text-xs", style: { color: "var(--text-disabled)" }, children: [
                  "Mostrando ",
                  products.length,
                  " ",
                  products.length === 1 ? "producto" : "productos"
                ] })
              }
            )
          ] })
        ]
      }
    )
  ] });
}
var CATEGORIES = ["DeFi", "NFT", "Layer1", "Layer2", "Stablecoin", "Exchange", "Otro"];
function NewProductPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    symbol: "",
    category: "Otro",
    price: "",
    stock: "",
    status: "active"
  });
  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.symbol || !form.price) {
      setError("Nombre, s\xEDmbolo y precio son requeridos.");
      return;
    }
    setSaving(true);
    try {
      await createProduct({
        name: form.name,
        symbol: form.symbol.toUpperCase(),
        category: form.category,
        price: parseFloat(form.price),
        stock: parseInt(form.stock || "0", 10),
        status: form.status
      });
      router.push("/");
    } catch (err) {
      setError(err.message);
      setSaving(false);
    }
  };
  const inputStyle = {
    width: "100%",
    padding: "10px 14px",
    borderRadius: 8,
    border: "1px solid rgba(145,158,171,0.32)",
    fontSize: 14,
    outline: "none",
    backgroundColor: "#fff",
    color: "var(--text-primary)"
  };
  const labelStyle = {
    display: "block",
    fontSize: 13,
    fontWeight: 600,
    color: "var(--text-secondary)",
    marginBottom: 6
  };
  return /* @__PURE__ */ jsxs("div", { className: "p-6 max-w-xl mx-auto space-y-5", children: [
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: () => router.push("/"),
          className: "inline-flex items-center gap-1.5 text-sm font-medium mb-4",
          style: { color: "var(--text-secondary)" },
          children: [
            /* @__PURE__ */ jsx("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: /* @__PURE__ */ jsx("polyline", { points: "15 18 9 12 15 6" }) }),
            "Volver"
          ]
        }
      ),
      /* @__PURE__ */ jsx("h1", { className: "text-xl font-bold", style: { color: "var(--text-primary)" }, children: "Nuevo Producto" }),
      /* @__PURE__ */ jsx("p", { className: "text-sm mt-0.5", style: { color: "var(--text-secondary)" }, children: "Agrega un nuevo activo digital al cat\xE1logo" })
    ] }),
    /* @__PURE__ */ jsxs(
      "div",
      {
        className: "bg-white rounded-xl p-6",
        style: { boxShadow: "0 0 2px 0 rgba(145,158,171,0.2), 0 12px 24px -4px rgba(145,158,171,0.12)" },
        children: [
          error && /* @__PURE__ */ jsx(
            "div",
            {
              className: "mb-4 px-4 py-3 rounded-lg text-sm",
              style: { backgroundColor: "rgba(225,29,72,0.08)", color: "#e11d48" },
              children: error
            }
          ),
          /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "space-y-5", children: [
            /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
              /* @__PURE__ */ jsxs("div", { className: "col-span-2", children: [
                /* @__PURE__ */ jsx("label", { style: labelStyle, children: "Nombre del Activo *" }),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    name: "name",
                    value: form.name,
                    onChange: handleChange,
                    placeholder: "Ej: Bitcoin",
                    style: inputStyle
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("label", { style: labelStyle, children: "S\xEDmbolo *" }),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    name: "symbol",
                    value: form.symbol,
                    onChange: handleChange,
                    placeholder: "Ej: BTC",
                    style: { ...inputStyle, textTransform: "uppercase" }
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("label", { style: labelStyle, children: "Categor\xEDa" }),
                /* @__PURE__ */ jsx("select", { name: "category", value: form.category, onChange: handleChange, style: inputStyle, children: CATEGORIES.map((c) => /* @__PURE__ */ jsx("option", { value: c, children: c }, c)) })
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("label", { style: labelStyle, children: "Precio (USD) *" }),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    name: "price",
                    type: "number",
                    min: "0",
                    step: "0.01",
                    value: form.price,
                    onChange: handleChange,
                    placeholder: "0.00",
                    style: inputStyle
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("label", { style: labelStyle, children: "Stock" }),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    name: "stock",
                    type: "number",
                    min: "0",
                    value: form.stock,
                    onChange: handleChange,
                    placeholder: "0",
                    style: inputStyle
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("label", { style: labelStyle, children: "Status" }),
                /* @__PURE__ */ jsxs("select", { name: "status", value: form.status, onChange: handleChange, style: inputStyle, children: [
                  /* @__PURE__ */ jsx("option", { value: "active", children: "Activo" }),
                  /* @__PURE__ */ jsx("option", { value: "inactive", children: "Inactivo" })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex gap-3 pt-2", children: [
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  onClick: () => router.push("/"),
                  className: "flex-1 py-2.5 rounded-lg text-sm font-semibold",
                  style: { border: "1px solid rgba(145,158,171,0.32)", color: "var(--text-secondary)" },
                  children: "Cancelar"
                }
              ),
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "submit",
                  disabled: saving,
                  className: "flex-1 py-2.5 rounded-lg text-sm font-semibold text-white",
                  style: { backgroundColor: saving ? "#a5b4fc" : "#4f46e5" },
                  children: saving ? "Guardando\u2026" : "Crear Producto"
                }
              )
            ] })
          ] })
        ]
      }
    )
  ] });
}
var CATEGORIES2 = ["DeFi", "NFT", "Layer1", "Layer2", "Stablecoin", "Exchange", "Otro"];
var HOST_URL2 = process.env.NEXT_PUBLIC_HOST_URL ?? "http://localhost:3000";
function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id;
  const [product, setProduct] = useState(null);
  const [loadingProduct, setLoadingProduct] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    symbol: "",
    category: "Otro",
    price: "",
    stock: "",
    status: "active"
  });
  useEffect(() => {
    if (!id) return;
    fetch(`${HOST_URL2}/api/products/${id}`).then((r) => r.json()).then((data) => {
      setProduct(data);
      setForm({
        name: data.name,
        symbol: data.symbol,
        category: data.category,
        price: String(data.price),
        stock: String(data.stock),
        status: data.status
      });
      setLoadingProduct(false);
    }).catch(() => {
      setError("No se pudo cargar el producto.");
      setLoadingProduct(false);
    });
  }, [id]);
  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.symbol || !form.price) {
      setError("Nombre, s\xEDmbolo y precio son requeridos.");
      return;
    }
    setSaving(true);
    try {
      await updateProduct(id, {
        name: form.name,
        symbol: form.symbol.toUpperCase(),
        category: form.category,
        price: parseFloat(form.price),
        stock: parseInt(form.stock || "0", 10),
        status: form.status
      });
      router.push("/");
    } catch (err) {
      setError(err.message);
      setSaving(false);
    }
  };
  const inputStyle = {
    width: "100%",
    padding: "10px 14px",
    borderRadius: 8,
    border: "1px solid rgba(145,158,171,0.32)",
    fontSize: 14,
    outline: "none",
    backgroundColor: "#fff",
    color: "var(--text-primary)"
  };
  const labelStyle = {
    display: "block",
    fontSize: 13,
    fontWeight: 600,
    color: "var(--text-secondary)",
    marginBottom: 6
  };
  if (loadingProduct) {
    return /* @__PURE__ */ jsx("div", { className: "p-6 max-w-xl mx-auto", children: /* @__PURE__ */ jsxs("div", { className: "animate-pulse space-y-4", children: [
      /* @__PURE__ */ jsx("div", { className: "h-6 bg-gray-200 rounded w-48" }),
      /* @__PURE__ */ jsx("div", { className: "bg-white rounded-xl p-6 space-y-4", children: [1, 2, 3, 4].map((i) => /* @__PURE__ */ jsx("div", { className: "h-10 bg-gray-100 rounded" }, i)) })
    ] }) });
  }
  if (!product && !loadingProduct) {
    return /* @__PURE__ */ jsxs("div", { className: "p-6 max-w-xl mx-auto text-center", children: [
      /* @__PURE__ */ jsx("p", { className: "text-red-600 font-semibold", children: "Producto no encontrado" }),
      /* @__PURE__ */ jsx("button", { onClick: () => router.push("/"), className: "mt-4 text-sm underline", style: { color: "var(--text-secondary)" }, children: "Volver al listado" })
    ] });
  }
  return /* @__PURE__ */ jsxs("div", { className: "p-6 max-w-xl mx-auto space-y-5", children: [
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: () => router.push("/"),
          className: "inline-flex items-center gap-1.5 text-sm font-medium mb-4",
          style: { color: "var(--text-secondary)" },
          children: [
            /* @__PURE__ */ jsx("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: /* @__PURE__ */ jsx("polyline", { points: "15 18 9 12 15 6" }) }),
            "Volver"
          ]
        }
      ),
      /* @__PURE__ */ jsx("h1", { className: "text-xl font-bold", style: { color: "var(--text-primary)" }, children: "Editar Producto" }),
      /* @__PURE__ */ jsxs("p", { className: "text-sm mt-0.5", style: { color: "var(--text-secondary)" }, children: [
        "Modifica los datos de ",
        /* @__PURE__ */ jsx("strong", { children: product?.name })
      ] })
    ] }),
    /* @__PURE__ */ jsxs(
      "div",
      {
        className: "bg-white rounded-xl p-6",
        style: { boxShadow: "0 0 2px 0 rgba(145,158,171,0.2), 0 12px 24px -4px rgba(145,158,171,0.12)" },
        children: [
          error && /* @__PURE__ */ jsx(
            "div",
            {
              className: "mb-4 px-4 py-3 rounded-lg text-sm",
              style: { backgroundColor: "rgba(225,29,72,0.08)", color: "#e11d48" },
              children: error
            }
          ),
          /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "space-y-5", children: [
            /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
              /* @__PURE__ */ jsxs("div", { className: "col-span-2", children: [
                /* @__PURE__ */ jsx("label", { style: labelStyle, children: "Nombre del Activo *" }),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    name: "name",
                    value: form.name,
                    onChange: handleChange,
                    placeholder: "Ej: Bitcoin",
                    style: inputStyle
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("label", { style: labelStyle, children: "S\xEDmbolo *" }),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    name: "symbol",
                    value: form.symbol,
                    onChange: handleChange,
                    placeholder: "Ej: BTC",
                    style: { ...inputStyle, textTransform: "uppercase" }
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("label", { style: labelStyle, children: "Categor\xEDa" }),
                /* @__PURE__ */ jsx("select", { name: "category", value: form.category, onChange: handleChange, style: inputStyle, children: CATEGORIES2.map((c) => /* @__PURE__ */ jsx("option", { value: c, children: c }, c)) })
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("label", { style: labelStyle, children: "Precio (USD) *" }),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    name: "price",
                    type: "number",
                    min: "0",
                    step: "0.01",
                    value: form.price,
                    onChange: handleChange,
                    placeholder: "0.00",
                    style: inputStyle
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("label", { style: labelStyle, children: "Stock" }),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    name: "stock",
                    type: "number",
                    min: "0",
                    value: form.stock,
                    onChange: handleChange,
                    placeholder: "0",
                    style: inputStyle
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("label", { style: labelStyle, children: "Status" }),
                /* @__PURE__ */ jsxs("select", { name: "status", value: form.status, onChange: handleChange, style: inputStyle, children: [
                  /* @__PURE__ */ jsx("option", { value: "active", children: "Activo" }),
                  /* @__PURE__ */ jsx("option", { value: "inactive", children: "Inactivo" })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex gap-3 pt-2", children: [
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  onClick: () => router.push("/"),
                  className: "flex-1 py-2.5 rounded-lg text-sm font-semibold",
                  style: { border: "1px solid rgba(145,158,171,0.32)", color: "var(--text-secondary)" },
                  children: "Cancelar"
                }
              ),
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "submit",
                  disabled: saving,
                  className: "flex-1 py-2.5 rounded-lg text-sm font-semibold text-white",
                  style: { backgroundColor: saving ? "#a5b4fc" : "#4f46e5" },
                  children: saving ? "Guardando\u2026" : "Actualizar Producto"
                }
              )
            ] })
          ] })
        ]
      }
    )
  ] });
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
  return /* @__PURE__ */ jsxs("div", { style: { minHeight: "100vh", backgroundColor: "var(--background)" }, children: [
    /* @__PURE__ */ jsxs(
      "header",
      {
        style: {
          height: 56,
          backgroundColor: "#fff",
          borderBottom: "1px solid var(--border)",
          display: "flex",
          alignItems: "center",
          padding: "0 24px",
          gap: 12
        },
        children: [
          /* @__PURE__ */ jsx(
            "div",
            {
              style: {
                width: 32,
                height: 32,
                borderRadius: 8,
                background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              },
              children: /* @__PURE__ */ jsx("svg", { width: "18", height: "18", viewBox: "0 0 24 24", fill: "white", children: /* @__PURE__ */ jsx("path", { d: "M20 7H4c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2zm-1 11H5c-.55 0-1-.45-1-1V10c0-.55.45-1 1-1h14c.55 0 1 .45 1 1v7c0 .55-.45 1-1 1zm-7-9c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3zm0 4c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z" }) })
            }
          ),
          /* @__PURE__ */ jsx("span", { style: { fontWeight: 700, fontSize: 15, color: "var(--text-primary)" }, children: "MFE Productos" }),
          /* @__PURE__ */ jsx("span", { style: { fontSize: 11, color: "var(--text-disabled)", marginLeft: 4 }, children: "modo standalone" })
        ]
      }
    ),
    /* @__PURE__ */ jsx("main", { children })
  ] });
}

export { EditProductPage, EmbeddedShell, NewProductPage, ProductsListPage, createProduct, deleteProduct, updateProduct, useProducts };
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map
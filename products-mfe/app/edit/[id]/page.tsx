"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { updateProduct, AppProduct } from "@/app/src/hooks/useProducts";

const CATEGORIES = ["DeFi", "NFT", "Layer1", "Layer2", "Stablecoin", "Exchange", "Otro"] as const;
const HOST_URL = process.env.NEXT_PUBLIC_HOST_URL ?? "http://localhost:3000";

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [product, setProduct] = useState<AppProduct | null>(null);
  const [loadingProduct, setLoadingProduct] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    symbol: "",
    category: "Otro" as (typeof CATEGORIES)[number],
    price: "",
    stock: "",
    status: "active" as "active" | "inactive",
  });

  useEffect(() => {
    if (!id) return;
    fetch(`${HOST_URL}/api/products/${id}`)
      .then((r) => r.json())
      .then((data: AppProduct) => {
        setProduct(data);
        setForm({
          name: data.name,
          symbol: data.symbol,
          category: data.category,
          price: String(data.price),
          stock: String(data.stock),
          status: data.status,
        });
        setLoadingProduct(false);
      })
      .catch(() => {
        setError("No se pudo cargar el producto.");
        setLoadingProduct(false);
      });
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.symbol || !form.price) {
      setError("Nombre, símbolo y precio son requeridos.");
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
        status: form.status,
      });
      router.push("/");
    } catch (err) {
      setError((err as Error).message);
      setSaving(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "10px 14px",
    borderRadius: 8,
    border: "1px solid rgba(145,158,171,0.32)",
    fontSize: 14,
    outline: "none",
    backgroundColor: "#fff",
    color: "var(--text-primary)",
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: 13,
    fontWeight: 600,
    color: "var(--text-secondary)",
    marginBottom: 6,
  };

  if (loadingProduct) {
    return (
      <div className="p-6 max-w-xl mx-auto">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-48" />
          <div className="bg-white rounded-xl p-6 space-y-4">
            {[1, 2, 3, 4].map((i) => <div key={i} className="h-10 bg-gray-100 rounded" />)}
          </div>
        </div>
      </div>
    );
  }

  if (!product && !loadingProduct) {
    return (
      <div className="p-6 max-w-xl mx-auto text-center">
        <p className="text-red-600 font-semibold">Producto no encontrado</p>
        <button onClick={() => router.push("/")} className="mt-4 text-sm underline" style={{ color: "var(--text-secondary)" }}>
          Volver al listado
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-xl mx-auto space-y-5">
      <div>
        <button
          onClick={() => router.push("/")}
          className="inline-flex items-center gap-1.5 text-sm font-medium mb-4"
          style={{ color: "var(--text-secondary)" }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Volver
        </button>
        <h1 className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>
          Editar Producto
        </h1>
        <p className="text-sm mt-0.5" style={{ color: "var(--text-secondary)" }}>
          Modifica los datos de <strong>{product?.name}</strong>
        </p>
      </div>

      <div
        className="bg-white rounded-xl p-6"
        style={{ boxShadow: "0 0 2px 0 rgba(145,158,171,0.2), 0 12px 24px -4px rgba(145,158,171,0.12)" }}
      >
        {error && (
          <div
            className="mb-4 px-4 py-3 rounded-lg text-sm"
            style={{ backgroundColor: "rgba(225,29,72,0.08)", color: "#e11d48" }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label style={labelStyle}>Nombre del Activo *</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Ej: Bitcoin"
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>Símbolo *</label>
              <input
                name="symbol"
                value={form.symbol}
                onChange={handleChange}
                placeholder="Ej: BTC"
                style={{ ...inputStyle, textTransform: "uppercase" }}
              />
            </div>

            <div>
              <label style={labelStyle}>Categoría</label>
              <select name="category" value={form.category} onChange={handleChange} style={inputStyle}>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={labelStyle}>Precio (USD) *</label>
              <input
                name="price"
                type="number"
                min="0"
                step="0.01"
                value={form.price}
                onChange={handleChange}
                placeholder="0.00"
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>Stock</label>
              <input
                name="stock"
                type="number"
                min="0"
                value={form.stock}
                onChange={handleChange}
                placeholder="0"
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>Status</label>
              <select name="status" value={form.status} onChange={handleChange} style={inputStyle}>
                <option value="active">Activo</option>
                <option value="inactive">Inactivo</option>
              </select>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => router.push("/")}
              className="flex-1 py-2.5 rounded-lg text-sm font-semibold"
              style={{ border: "1px solid rgba(145,158,171,0.32)", color: "var(--text-secondary)" }}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 py-2.5 rounded-lg text-sm font-semibold text-white"
              style={{ backgroundColor: saving ? "#a5b4fc" : "#4f46e5" }}
            >
              {saving ? "Guardando…" : "Actualizar Producto"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

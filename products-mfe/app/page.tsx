"use client";

import Link from "next/link";
import { useProducts, deleteProduct, AppProduct } from "@/app/src/hooks/useProducts";

// ── Badge de Categoría ──────────────────────────────────────────────
const CATEGORY_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  DeFi:       { bg: "rgba(79,70,229,0.1)",  text: "#4f46e5", border: "rgba(79,70,229,0.2)" },
  NFT:        { bg: "rgba(124,58,237,0.1)", text: "#7c3aed", border: "rgba(124,58,237,0.2)" },
  Layer1:     { bg: "rgba(2,132,199,0.1)",  text: "#0284c7", border: "rgba(2,132,199,0.2)" },
  Layer2:     { bg: "rgba(5,150,105,0.1)",  text: "#059669", border: "rgba(5,150,105,0.2)" },
  Stablecoin: { bg: "rgba(217,119,6,0.1)",  text: "#d97706", border: "rgba(217,119,6,0.2)" },
  Exchange:   { bg: "rgba(225,29,72,0.1)",  text: "#e11d48", border: "rgba(225,29,72,0.2)" },
  Otro:       { bg: "rgba(107,114,128,0.1)",text: "#6b7280", border: "rgba(107,114,128,0.2)" },
};

const CategoryBadge = ({ category }: { category: string }) => {
  const colors = CATEGORY_COLORS[category] ?? CATEGORY_COLORS["Otro"];
  return (
    <span
      className="inline-flex items-center text-xs font-bold px-2.5 py-1 rounded-full"
      style={{ backgroundColor: colors.bg, color: colors.text, border: `1px solid ${colors.border}` }}
    >
      {category}
    </span>
  );
};

// ── Badge de Status ─────────────────────────────────────────────────
const StatusBadge = ({ status }: { status: string }) => {
  const isActive = status === "active";
  return (
    <span
      className="inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full"
      style={{
        backgroundColor: isActive ? "rgba(5,150,105,0.1)" : "rgba(107,114,128,0.1)",
        color: isActive ? "#059669" : "#6b7280",
        border: `1px solid ${isActive ? "rgba(5,150,105,0.2)" : "rgba(107,114,128,0.2)"}`,
      }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full"
        style={{ backgroundColor: isActive ? "#059669" : "#9ca3af" }}
      />
      {isActive ? "Activo" : "Inactivo"}
    </span>
  );
};

// ── Formateo ─────────────────────────────────────────────────────────
const formatPrice = (price: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(price);

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("es-MX", { year: "numeric", month: "short", day: "numeric" });

// ── Skeleton ─────────────────────────────────────────────────────────
const TableSkeleton = () => (
  <div className="animate-pulse divide-y" style={{ borderColor: "rgba(145,158,171,0.12)" }}>
    {[1, 2, 3, 4].map((i) => (
      <div key={i} className="flex items-center gap-4 px-6 py-4">
        <div className="h-4 bg-gray-200 rounded w-8" />
        <div className="h-4 bg-gray-200 rounded flex-1" />
        <div className="h-6 bg-gray-100 rounded-full w-20" />
        <div className="h-4 bg-gray-200 rounded w-16" />
        <div className="h-4 bg-gray-200 rounded w-10" />
        <div className="h-6 bg-gray-100 rounded-full w-16" />
        <div className="h-4 bg-gray-100 rounded w-24" />
      </div>
    ))}
  </div>
);

// ── Página principal ──────────────────────────────────────────────────
export default function ProductsListPage() {
  const { products, loading, error, mutate } = useProducts();

  const handleDelete = async (product: AppProduct) => {
    if (!confirm(`¿Eliminar "${product.name}"?`)) return;
    try {
      await deleteProduct(product._id);
      mutate();
    } catch (e) {
      alert((e as Error).message);
    }
  };

  return (
    <div className="p-6 space-y-5">

      {/* ── Header con contador y botón nuevo ─────────────────── */}
      <div className="flex items-center justify-between">
        {products && !loading && (
          <div
            className="inline-flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-full"
            style={{
              backgroundColor: "rgba(79,70,229,0.10)",
              color: "#4f46e5",
              border: "1px solid rgba(79,70,229,0.20)",
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M20 7H4c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2z" />
              <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
            </svg>
            {products.length} {products.length === 1 ? "producto" : "productos"}
          </div>
        )}
        {!loading && <div />}
        <Link
          href="/new"
          className="inline-flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-lg text-white"
          style={{ backgroundColor: "#4f46e5" }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Nuevo Producto
        </Link>
      </div>

      {/* ── Card ─────────────────────────────────────────────── */}
      <div
        className="bg-white rounded-xl overflow-hidden"
        style={{ boxShadow: "0 0 2px 0 rgba(145,158,171,0.2), 0 12px 24px -4px rgba(145,158,171,0.12)" }}
      >
        <div className="px-6 py-5" style={{ borderBottom: "1px solid rgba(145,158,171,0.16)" }}>
          <h2 className="text-base font-bold" style={{ color: "var(--text-primary)" }}>
            Catálogo de Productos
          </h2>
          <p className="text-xs mt-0.5" style={{ color: "var(--text-secondary)" }}>
            Gestión de activos digitales disponibles
          </p>
        </div>

        {loading && <TableSkeleton />}

        {error && !loading && (
          <div className="px-6 py-12 text-center">
            <p className="font-semibold text-red-600">Error al cargar productos</p>
            <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
              Verifica la conexión con el host ({process.env.NEXT_PUBLIC_HOST_URL})
            </p>
          </div>
        )}

        {!loading && !error && products && products.length === 0 && (
          <div className="px-6 py-16 text-center">
            <p className="font-semibold" style={{ color: "var(--text-primary)" }}>
              No hay productos registrados
            </p>
            <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
              Crea el primer producto usando el botón &quot;Nuevo Producto&quot;
            </p>
          </div>
        )}

        {!loading && !error && products && products.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ backgroundColor: "#F4F6F8", borderBottom: "1px solid rgba(145,158,171,0.24)" }}>
                  {["Símbolo", "Nombre", "Categoría", "Precio", "Stock", "Status", "Creado", ""].map((h) => (
                    <th
                      key={h}
                      className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-[0.08em]"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {products.map((product, idx) => {
                  const isLast = idx === products.length - 1;
                  return (
                    <tr
                      key={product._id}
                      style={{ borderBottom: isLast ? "none" : "1px solid rgba(145,158,171,0.12)" }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(145,158,171,0.04)";
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLElement).style.backgroundColor = "transparent";
                      }}
                    >
                      <td className="px-4 py-4">
                        <span className="font-mono text-xs font-bold px-2 py-1 rounded" style={{ backgroundColor: "rgba(79,70,229,0.08)", color: "#4f46e5" }}>
                          {product.symbol}
                        </span>
                      </td>
                      <td className="px-4 py-4 font-semibold" style={{ color: "var(--text-primary)" }}>
                        {product.name}
                      </td>
                      <td className="px-4 py-4">
                        <CategoryBadge category={product.category} />
                      </td>
                      <td className="px-4 py-4 font-medium" style={{ color: "var(--text-primary)" }}>
                        {formatPrice(product.price)}
                      </td>
                      <td className="px-4 py-4" style={{ color: "var(--text-secondary)" }}>
                        {product.stock.toLocaleString()}
                      </td>
                      <td className="px-4 py-4">
                        <StatusBadge status={product.status} />
                      </td>
                      <td className="px-4 py-4 text-xs" style={{ color: "var(--text-disabled)" }}>
                        {formatDate(product.createdAt)}
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/edit/${product._id}`}
                            className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1.5 rounded-lg"
                            style={{ color: "#4f46e5", backgroundColor: "rgba(79,70,229,0.08)" }}
                          >
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                            </svg>
                            Editar
                          </Link>
                          <button
                            onClick={() => handleDelete(product)}
                            className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1.5 rounded-lg"
                            style={{ color: "#e11d48", backgroundColor: "rgba(225,29,72,0.08)" }}
                          >
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                              <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14H6L5 6" />
                              <path d="M10 11v6" /><path d="M14 11v6" /><path d="M9 6V4h6v2" />
                            </svg>
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <div
              className="px-6 py-3"
              style={{ borderTop: "1px solid rgba(145,158,171,0.16)", backgroundColor: "#FAFAFA" }}
            >
              <p className="text-xs" style={{ color: "var(--text-disabled)" }}>
                Mostrando {products.length} {products.length === 1 ? "producto" : "productos"}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

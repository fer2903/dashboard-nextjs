"use client";

/**
 * Componente Sidebar — Barra lateral de navegación
 *
 * Marcado como "use client" porque usa:
 *  - usePathname() para resaltar el enlace activo
 *  - useRouter() para redirigir después del logout
 *
 * En el App Router de Next.js, los componentes del servidor (Server Components)
 * son el default. Para usar hooks de React o APIs del browser, necesitamos
 * marcar el componente como "use client".
 */

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

// Definición de los enlaces de navegación del sidebar
const NAV_LINKS = [
  { href: "/dashboard", label: "Dashboard", icon: "📊" },
  { href: "/dashboard/users", label: "Usuarios", icon: "👥" },
  { href: "/dashboard/transactions", label: "Transacciones", icon: "💸" },
];

export default function Sidebar() {
  // usePathname() devuelve la ruta actual, ej: "/dashboard/users"
  const pathname = usePathname();
  const router = useRouter();

  /**
   * Manejador de logout
   * Llama al endpoint POST /api/auth/logout que elimina la cookie del token.
   * Luego redirige al login.
   */
  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  };

  return (
    <aside className="w-64 min-h-screen bg-slate-900 text-white flex flex-col shrink-0">
      {/* Logo / Título del sistema */}
      <div className="px-6 py-5 border-b border-slate-700">
        <h1 className="text-lg font-bold tracking-tight">🪙 Crypto Dashboard</h1>
        <p className="text-xs text-slate-400 mt-0.5">Panel de Control</p>
      </div>

      {/* Sección: Menú de navegación */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest px-3 mb-2">
          Módulos
        </p>

        {NAV_LINKS.map((link) => {
          // Verificar si este enlace es la ruta activa
          // Para /dashboard usamos igualdad exacta, para subrutas usamos startsWith
          const isActive =
            link.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(link.href);

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`
                flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
                transition-all duration-150
                ${
                  isActive
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }
              `}
            >
              <span className="text-base">{link.icon}</span>
              <span>{link.label}</span>
              {isActive && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-white opacity-70" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer del sidebar — Botón de logout */}
      <div className="px-3 py-4 border-t border-slate-700">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
            text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <span className="text-base">🚪</span>
          <span>Cerrar sesión</span>
        </button>
      </div>
    </aside>
  );
}

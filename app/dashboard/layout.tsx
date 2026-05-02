import Sidebar from "@/app/src/components/organisms/Sidebar";

/**
 * Layout del Dashboard — App Router Nested Layout
 *
 * En el App Router de Next.js, los layouts se anidan automáticamente.
 * Este layout se aplica a TODAS las rutas bajo /dashboard:
 *  - /dashboard        → app/dashboard/page.tsx
 *  - /dashboard/users  → app/dashboard/users/page.tsx
 *
 * La jerarquía de layouts es:
 *  app/layout.tsx (root — ReactQueryProvider)
 *    └── app/dashboard/layout.tsx (dashboard — Sidebar)
 *          ├── app/dashboard/page.tsx
 *          └── app/dashboard/users/page.tsx
 *
 * El Sidebar se renderiza una sola vez y el {children} cambia
 * según la página activa — sin recargar el sidebar.
 */
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar fijo a la izquierda */}
      <Sidebar />

      {/* Contenido principal — ocupa el espacio restante */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}

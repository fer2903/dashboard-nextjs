import Sidebar from "@/app/src/components/organisms/Sidebar";
import TopBar from "@/app/src/components/organisms/TopBar";

/**
 * Layout del Dashboard — App Router Nested Layout
 *
 * Estructura con Sidebar (MUI Drawer dark) + TopBar (MUI AppBar) + Main Content
 *
 * Jerarquía:
 *  app/layout.tsx (root — ReactQueryProvider)
 *    └── app/dashboard/layout.tsx (Sidebar + TopBar)
 *          ├── app/dashboard/page.tsx
 *          ├── app/dashboard/users/page.tsx
 *          ├── app/dashboard/transactions/page.tsx
 *          └── app/dashboard/payments/page.tsx
 */
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen" style={{ backgroundColor: "var(--background)" }}>
      {/* Sidebar fijo izquierdo (MUI Drawer dark variant) */}
      <Sidebar />

      {/* Área de contenido principal */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* TopBar sticky (MUI AppBar) */}
        <TopBar />

        {/* Contenido de la página */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

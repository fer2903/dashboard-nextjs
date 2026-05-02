/**
 * Layout de Autenticación — App Router Route Group: (auth)
 *
 * Los Route Groups en Next.js App Router se crean con carpetas entre paréntesis.
 * El nombre "(auth)" NO aparece en la URL:
 *  - app/(auth)/login/page.tsx   → accesible en /login
 *  - app/(auth)/register/page.tsx → accesible en /register
 *
 * Este layout se aplica SOLO a las páginas dentro de (auth).
 * No incluye sidebar ni header — solo centra el contenido en pantalla.
 *
 * La jerarquía de layouts es:
 *  app/layout.tsx (root)
 *    └── app/(auth)/layout.tsx (auth)
 *          ├── /login
 *          └── /register
 */
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 flex items-center justify-center p-4">
      {children}
    </div>
  );
}

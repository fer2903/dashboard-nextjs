/**
 * Página: /dashboard/no-access
 *
 * Pantalla a la que se redirige cuando un usuario con sesión válida intenta
 * abrir un módulo al que NO está suscrito (ver requireModuleAccess y el
 * middleware). Muestra el módulo solicitado y un CTA para volver o solicitar
 * acceso.
 *
 * Server Component: lee el módulo desde searchParams (Promise en Next 16).
 */
import Link from "next/link";
import { getModuleByKey } from "@/app/src/lib/modules";

export default async function NoAccessPage({
  searchParams,
}: {
  searchParams: Promise<{ module?: string }>;
}) {
  const { module } = await searchParams;
  const mod = module ? getModuleByKey(module) : undefined;
  const label = mod?.label ?? "este módulo";

  return (
    <div className="flex items-center justify-center min-h-[70vh] p-6">
      <div
        className="bg-white rounded-2xl px-8 py-10 max-w-md w-full text-center"
        style={{ boxShadow: "0 0 2px 0 rgba(145,158,171,0.2), 0 12px 24px -4px rgba(145,158,171,0.12)" }}
      >
        {/* Icono candado */}
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5"
          style={{ backgroundColor: "rgba(79,70,229,0.10)" }}
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        </div>

        <h1 className="text-xl font-bold mb-2" style={{ color: "var(--text-primary)" }}>
          Sin acceso a {label}
        </h1>
        <p className="text-sm mb-6" style={{ color: "var(--text-secondary)" }}>
          Tu cuenta no tiene una suscripción activa para ver {label.toLowerCase()}.
          Solicita acceso a un administrador para habilitar este módulo.
        </p>

        <div className="flex items-center justify-center gap-3">
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg text-sm font-bold text-white"
            style={{ background: "var(--primary)", boxShadow: "0 8px 16px 0 rgba(79,70,229,0.24)" }}
          >
            Volver al dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}

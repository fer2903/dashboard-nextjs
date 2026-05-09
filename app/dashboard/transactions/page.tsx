/**
 * Página Fallback — /dashboard/transactions
 *
 * Esta página SOLO se muestra si el MFE (transactions-mfe)
 * NO está corriendo en localhost:3001.
 *
 * Cuando el MFE está activo, el rewrite en next.config.ts lo
 * intercepta antes de que esta página se renderice.
 *
 * ¿Por qué existe?
 *  - Evita el error 502 cuando el MFE no está disponible
 *  - Da instrucciones claras al desarrollador
 *  - Permite probar el host sin necesitar el MFE
 */
export default function TransactionsFallbackPage() {
  return (
    <div className="p-6 flex items-start justify-center min-h-[70vh] pt-16">
      <div
        className="w-full max-w-lg bg-white rounded-xl overflow-hidden"
        style={{ boxShadow: "0 0 2px 0 rgba(145,158,171,0.2), 0 24px 48px -4px rgba(145,158,171,0.18)" }}
      >
        {/* Header naranja — advertencia */}
        <div
          className="px-8 py-8 text-center"
          style={{ background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)" }}
        >
          <div
            className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
            style={{ backgroundColor: "rgba(255,255,255,0.24)" }}
          >
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="12 2 22 20 2 20" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          </div>
          <h1 className="text-xl font-extrabold text-white">MFE no disponible</h1>
          <p className="text-amber-100 text-sm mt-1.5">
            El microfrontend de transacciones no está corriendo
          </p>
        </div>

        {/* Instrucciones */}
        <div className="px-8 py-6 space-y-5">

          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            El módulo de <strong>Transacciones</strong> es un microfrontend independiente
            que debe correr en el <strong>puerto 3001</strong>. Cuando está activo, esta
            ruta se delega automáticamente vía Multi-zone rewrite.
          </p>

          {/* Pasos para iniciar */}
          <div className="rounded-xl p-4 space-y-3" style={{ backgroundColor: "#F4F6F8" }}>
            <p
              className="text-[10px] font-bold uppercase tracking-[0.08em]"
              style={{ color: "var(--text-disabled)" }}
            >
              Cómo iniciar el MFE
            </p>

            {[
              { step: "1", label: "Navega a la carpeta del MFE", code: "cd transactions-mfe" },
              { step: "2", label: "Instala dependencias (solo la primera vez)", code: "npm install" },
              { step: "3", label: "Inicia el servidor en puerto 3001", code: "npm run dev" },
            ].map(({ step, label, code }) => (
              <div key={step} className="flex items-start gap-3">
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0 mt-0.5"
                  style={{ background: "linear-gradient(135deg, #6366f1, #4f46e5)" }}
                >
                  {step}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs mb-1" style={{ color: "var(--text-secondary)" }}>{label}</p>
                  <code
                    className="block text-xs px-3 py-2 rounded-lg font-mono"
                    style={{
                      backgroundColor: "#1C2536",
                      color: "#818CF8",
                    }}
                  >
                    {code}
                  </code>
                </div>
              </div>
            ))}
          </div>

          {/* Arquitectura */}
          <div
            className="rounded-xl p-4 text-xs"
            style={{ backgroundColor: "rgba(79,70,229,0.06)", border: "1px solid rgba(79,70,229,0.16)" }}
          >
            <p className="font-semibold mb-2" style={{ color: "var(--primary)" }}>
              Arquitectura Multi-zone
            </p>
            <div className="space-y-1 font-mono" style={{ color: "var(--text-secondary)" }}>
              <p>localhost:3000 → Host (dashboard-nextjs)</p>
              <p style={{ color: "var(--primary)" }}>
                localhost:3000/dashboard/transactions
                <span style={{ color: "var(--text-disabled)" }}> → rewrite →</span>
              </p>
              <p>localhost:3001/dashboard/transactions → MFE</p>
            </div>
          </div>

          {/* Botón de refresh */}
          <a
            href="/dashboard/transactions"
            className="flex items-center justify-center gap-2 w-full py-3 rounded-lg text-sm font-bold text-white"
            style={{
              background: "linear-gradient(135deg, #6366f1, #4f46e5)",
              boxShadow: "0 8px 16px rgba(79,70,229,0.28)",
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="23 4 23 10 17 10" />
              <polyline points="1 20 1 14 7 14" />
              <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
            </svg>
            Reintentar conexión
          </a>
        </div>
      </div>
    </div>
  );
}

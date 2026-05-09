/**
 * Auth Layout — MUI-inspired split screen
 *
 * Lado izquierdo: branding / ilustración (oculto en móvil)
 * Lado derecho: formulario centrado con fondo blanco limpio
 */
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex">

      {/* ── Panel izquierdo — Branding (solo en desktop) ───── */}
      <div
        className="hidden lg:flex flex-col justify-between w-[45%] shrink-0 p-12 relative overflow-hidden"
        style={{
          background: "linear-gradient(160deg, #1C2536 0%, #0d1117 100%)",
        }}
      >
        {/* Patrón de puntos decorativo */}
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage: "radial-gradient(circle, #818cf8 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />

        {/* Orbes de fondo */}
        <div
          className="absolute top-1/4 -left-20 w-72 h-72 rounded-full blur-3xl pointer-events-none opacity-20"
          style={{ backgroundColor: "#6366f1" }}
        />
        <div
          className="absolute bottom-1/4 right-1/4 w-56 h-56 rounded-full blur-3xl pointer-events-none opacity-15"
          style={{ backgroundColor: "#a78bfa" }}
        />

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-white"
            style={{
              background: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",
              boxShadow: "0 8px 16px 0 rgba(79,70,229,0.4)",
            }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
            </svg>
          </div>
          <div>
            <p className="text-white font-bold text-sm leading-none">Crypto Dashboard</p>
            <p className="text-[11px] leading-none mt-0.5" style={{ color: "#637381" }}>Panel de Control</p>
          </div>
        </div>

        {/* Ilustración / texto central */}
        <div className="relative z-10 space-y-6">
          <div>
            <h2 className="text-3xl font-extrabold text-white leading-tight">
              Gestiona tus{" "}
              <span style={{ color: "#818CF8" }}>criptomonedas</span>
              {" "}en tiempo real
            </h2>
            <p className="text-sm mt-3" style={{ color: "#637381" }}>
              Dashboard financiero con datos en vivo de CoinGecko, gestión
              de transacciones y pagos integrados con Stripe.
            </p>
          </div>

          {/* Feature pills */}
          <div className="flex flex-wrap gap-2">
            {[
              { icon: "📊", label: "Datos en tiempo real" },
              { icon: "🔐", label: "Autenticación JWT" },
              { icon: "💳", label: "Stripe Payments" },
            ].map(({ icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-full"
                style={{
                  backgroundColor: "rgba(255,255,255,0.08)",
                  color: "#C4CDD5",
                  border: "1px solid rgba(255,255,255,0.12)",
                }}
              >
                <span>{icon}</span>
                {label}
              </div>
            ))}
          </div>
        </div>

        {/* Footer del panel */}
        <div className="relative z-10">
          <p className="text-xs" style={{ color: "#455669" }}>
            © 2025 Crypto Dashboard · Powered by Next.js & MongoDB
          </p>
        </div>
      </div>

      {/* ── Panel derecho — Formulario ────────────────────────── */}
      <div
        className="flex-1 flex items-center justify-center p-6 lg:p-12"
        style={{ backgroundColor: "#F4F6F8" }}
      >
        {/* Logo para móvil (solo se muestra en pantallas pequeñas) */}
        <div className="w-full max-w-[440px]">
          <div className="lg:hidden flex items-center gap-2.5 mb-8">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center text-white"
              style={{
                background: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",
                boxShadow: "0 8px 16px 0 rgba(79,70,229,0.35)",
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
              </svg>
            </div>
            <p className="font-bold text-sm" style={{ color: "var(--text-primary)" }}>
              Crypto Dashboard
            </p>
          </div>

          {children}
        </div>
      </div>
    </div>
  );
}

/**
 * Layout de Autenticación — fondo con patrón de puntos y gradiente moderno
 */
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{
        background: "radial-gradient(ellipse at 60% 20%, #312e81 0%, #1e1b4b 40%, #0f0a1e 100%)",
      }}
    >
      {/* Patrón de puntos decorativos */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: "radial-gradient(circle, #818cf8 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      {/* Orbes decorativos */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-violet-600/20 rounded-full blur-3xl pointer-events-none" />

      {/* Contenido centrado */}
      <div className="relative z-10 w-full max-w-md">
        {children}
      </div>
    </div>
  );
}

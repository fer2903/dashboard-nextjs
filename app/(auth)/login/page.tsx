"use client";

import { useState, FormEvent, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/app/src/hooks/useAuth";

// ── Campo de formulario MUI outlined ────────────────────────────────
const Field = ({
  id, label, type, value, onChange, placeholder, autoComplete,
}: {
  id: string; label: string; type: string;
  value: string; onChange: (v: string) => void;
  placeholder?: string; autoComplete?: string;
}) => {
  const [focused, setFocused] = useState(false);
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-xs font-semibold mb-1.5"
        style={{ color: "var(--text-secondary)" }}
      >
        {label}
      </label>
      <input
        id={id}
        type={type}
        required
        autoComplete={autoComplete}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className="w-full px-3.5 py-3 rounded-lg text-sm transition-all duration-200 outline-none"
        style={{
          border: focused
            ? "2px solid var(--primary)"
            : "1px solid rgba(145,158,171,0.32)",
          padding: focused ? "11px 13px" : "12px 14px",
          color: "var(--text-primary)",
          backgroundColor: "white",
          boxShadow: focused ? "0 0 0 3px rgba(79,70,229,0.08)" : "none",
        }}
      />
    </div>
  );
};

// ── Componente del formulario ────────────────────────────────────────
function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, loading, error } = useAuth();
  const searchParams = useSearchParams();
  const justRegistered = searchParams.get("registered") === "true";

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await login(email, password);
  };

  return (
    <div
      className="bg-white rounded-2xl p-8"
      style={{ boxShadow: "0 0 2px 0 rgba(145,158,171,0.2), 0 20px 40px -4px rgba(145,158,171,0.15)" }}
    >
      {/* Encabezado */}
      <div className="mb-7">
        <h1
          className="text-2xl font-extrabold"
          style={{ color: "var(--text-primary)" }}
        >
          Iniciar Sesión
        </h1>
        <p className="text-sm mt-1.5" style={{ color: "var(--text-secondary)" }}>
          Ingresa tus credenciales para continuar
        </p>
      </div>

      {/* Banner de registro exitoso */}
      {justRegistered && (
        <div
          className="mb-5 rounded-xl px-4 py-3 text-sm flex items-center gap-2.5"
          style={{
            backgroundColor: "rgba(34,197,94,0.08)",
            border: "1px solid rgba(34,197,94,0.24)",
            color: "#16a34a",
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          Cuenta creada exitosamente. Inicia sesión para continuar.
        </div>
      )}

      {/* Error */}
      {error && (
        <div
          className="mb-5 rounded-xl px-4 py-3 text-sm flex items-center gap-2.5"
          style={{
            backgroundColor: "rgba(239,68,68,0.08)",
            border: "1px solid rgba(239,68,68,0.24)",
            color: "#dc2626",
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          {error}
        </div>
      )}

      {/* Formulario */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <Field
          id="email" label="Correo electrónico" type="email"
          value={email} onChange={setEmail}
          placeholder="tu@email.com" autoComplete="email"
        />

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label
              htmlFor="password"
              className="text-xs font-semibold"
              style={{ color: "var(--text-secondary)" }}
            >
              Contraseña
            </label>
            <button
              type="button"
              className="text-xs font-medium transition-colors"
              style={{ color: "var(--primary)" }}
            >
              ¿Olvidaste tu contraseña?
            </button>
          </div>
          <Field
            id="password" label="" type="password"
            value={password} onChange={setPassword}
            placeholder="••••••••" autoComplete="current-password"
          />
        </div>

        {/* Botón de login — estilo MUI contained */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 rounded-lg text-sm font-bold text-white transition-all duration-200 mt-2"
          style={{
            background: loading
              ? "rgba(79,70,229,0.6)"
              : "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",
            boxShadow: loading ? "none" : "0 8px 16px 0 rgba(79,70,229,0.28)",
            cursor: loading ? "not-allowed" : "pointer",
            letterSpacing: "0.04em",
          }}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <span
                className="w-4 h-4 border-2 rounded-full animate-spin"
                style={{ borderColor: "rgba(255,255,255,0.3)", borderTopColor: "white" }}
              />
              Iniciando sesión...
            </span>
          ) : (
            "INICIAR SESIÓN"
          )}
        </button>
      </form>

      {/* Divider */}
      <div className="my-6 flex items-center gap-3">
        <div className="flex-1 h-px" style={{ backgroundColor: "rgba(145,158,171,0.24)" }} />
        <span className="text-xs" style={{ color: "var(--text-disabled)" }}>o</span>
        <div className="flex-1 h-px" style={{ backgroundColor: "rgba(145,158,171,0.24)" }} />
      </div>

      {/* Enlace a registro */}
      <p className="text-center text-sm" style={{ color: "var(--text-secondary)" }}>
        ¿No tienes cuenta?{" "}
        <Link
          href="/register"
          className="font-semibold transition-colors"
          style={{ color: "var(--primary)" }}
        >
          Regístrate aquí
        </Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div
          className="bg-white rounded-2xl p-8 text-center text-sm animate-pulse"
          style={{
            boxShadow: "0 0 2px 0 rgba(145,158,171,0.2), 0 20px 40px -4px rgba(145,158,171,0.15)",
            color: "var(--text-secondary)",
          }}
        >
          Cargando...
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}

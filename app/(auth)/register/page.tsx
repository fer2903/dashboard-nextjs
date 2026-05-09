"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { useAuth } from "@/app/src/hooks/useAuth";

// ── Campo de formulario MUI outlined ────────────────────────────────
const Field = ({
  id, label, type, value, onChange, placeholder, autoComplete,
  hint, error: fieldError, success,
}: {
  id: string; label: string; type: string;
  value: string; onChange: (v: string) => void;
  placeholder?: string; autoComplete?: string;
  hint?: string; error?: string; success?: string;
}) => {
  const [focused, setFocused] = useState(false);
  const hasError = !!fieldError;
  const hasSuccess = !!success;

  const borderColor = hasError
    ? "#dc2626"
    : hasSuccess
    ? "#16a34a"
    : focused
    ? "var(--primary)"
    : "rgba(145,158,171,0.32)";

  const shadowColor = hasError
    ? "rgba(220,38,38,0.08)"
    : hasSuccess
    ? "rgba(22,163,74,0.08)"
    : focused
    ? "rgba(79,70,229,0.08)"
    : "transparent";

  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label
          htmlFor={id}
          className="text-xs font-semibold"
          style={{ color: "var(--text-secondary)" }}
        >
          {label}
        </label>
        {hint && (
          <span className="text-[10px]" style={{ color: "var(--text-disabled)" }}>
            {hint}
          </span>
        )}
      </div>
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
        className="w-full rounded-lg text-sm transition-all duration-200 outline-none"
        style={{
          border: `${hasError || hasSuccess ? "2" : focused ? "2" : "1"}px solid ${borderColor}`,
          padding: focused || hasError || hasSuccess ? "11px 13px" : "12px 14px",
          color: "var(--text-primary)",
          backgroundColor: "white",
          boxShadow: `0 0 0 3px ${shadowColor}`,
        }}
      />
      {/* Mensaje de feedback */}
      {(fieldError || success) && (
        <p
          className="text-xs mt-1.5 flex items-center gap-1"
          style={{ color: hasError ? "#dc2626" : "#16a34a" }}
        >
          {hasError ? "✗" : "✓"} {fieldError || success}
        </p>
      )}
    </div>
  );
};

// ── Página principal ─────────────────────────────────────────────────
export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [clientError, setClientError] = useState<string | null>(null);
  const { register, loading, error: apiError } = useAuth();

  const validate = (): boolean => {
    setClientError(null);
    if (!name.trim())               { setClientError("El nombre es requerido"); return false; }
    if (!email.trim())              { setClientError("El email es requerido"); return false; }
    if (password.length < 6)       { setClientError("La contraseña debe tener al menos 6 caracteres"); return false; }
    if (password !== confirmPassword) { setClientError("Las contraseñas no coinciden"); return false; }
    return true;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate()) return;
    await register(name, email, password);
  };

  const errorMessage = clientError || apiError;
  const passwordsMatch = confirmPassword.length > 0 && password === confirmPassword;
  const passwordsMismatch = confirmPassword.length > 0 && password !== confirmPassword;

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
          Crear Cuenta
        </h1>
        <p className="text-sm mt-1.5" style={{ color: "var(--text-secondary)" }}>
          Regístrate para acceder al dashboard
        </p>
      </div>

      {/* Error global */}
      {errorMessage && (
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
          {errorMessage}
        </div>
      )}

      {/* Formulario */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <Field
          id="name" label="Nombre completo" type="text"
          value={name} onChange={setName}
          placeholder="Juan Pérez" autoComplete="name"
        />

        <Field
          id="email" label="Correo electrónico" type="email"
          value={email} onChange={setEmail}
          placeholder="tu@email.com" autoComplete="email"
        />

        <Field
          id="password" label="Contraseña" type="password"
          value={password} onChange={setPassword}
          placeholder="••••••••" autoComplete="new-password"
          hint="mín. 6 caracteres"
        />

        <Field
          id="confirmPassword" label="Confirmar contraseña" type="password"
          value={confirmPassword} onChange={setConfirmPassword}
          placeholder="••••••••" autoComplete="new-password"
          error={passwordsMismatch ? "Las contraseñas no coinciden" : undefined}
          success={passwordsMatch ? "Las contraseñas coinciden" : undefined}
        />

        {/* Botón — MUI contained con gradiente violeta */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 rounded-lg text-sm font-bold text-white transition-all duration-200 mt-2"
          style={{
            background: loading
              ? "rgba(124,58,237,0.6)"
              : "linear-gradient(135deg, #a78bfa 0%, #7c3aed 100%)",
            boxShadow: loading ? "none" : "0 8px 16px 0 rgba(124,58,237,0.28)",
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
              Creando cuenta...
            </span>
          ) : (
            "CREAR CUENTA"
          )}
        </button>
      </form>

      {/* Divider */}
      <div className="my-6 flex items-center gap-3">
        <div className="flex-1 h-px" style={{ backgroundColor: "rgba(145,158,171,0.24)" }} />
        <span className="text-xs" style={{ color: "var(--text-disabled)" }}>o</span>
        <div className="flex-1 h-px" style={{ backgroundColor: "rgba(145,158,171,0.24)" }} />
      </div>

      {/* Enlace a login */}
      <p className="text-center text-sm" style={{ color: "var(--text-secondary)" }}>
        ¿Ya tienes cuenta?{" "}
        <Link
          href="/login"
          className="font-semibold transition-colors"
          style={{ color: "var(--primary)" }}
        >
          Inicia sesión
        </Link>
      </p>
    </div>
  );
}

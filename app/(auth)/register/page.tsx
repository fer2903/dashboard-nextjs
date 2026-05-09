"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { useAuth } from "@/app/src/hooks/useAuth";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [clientError, setClientError] = useState<string | null>(null);
  const { register, loading, error: apiError } = useAuth();

  const validate = (): boolean => {
    setClientError(null);
    if (!name.trim()) { setClientError("El nombre es requerido"); return false; }
    if (!email.trim()) { setClientError("El email es requerido"); return false; }
    if (password.length < 6) { setClientError("La contraseña debe tener al menos 6 caracteres"); return false; }
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
    <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl p-8">
      {/* Encabezado */}
      <div className="text-center mb-7">
        <div className="w-14 h-14 rounded-2xl bg-violet-600 flex items-center justify-center text-2xl mx-auto mb-4 shadow-lg shadow-violet-500/40">
          ✨
        </div>
        <h1 className="text-2xl font-bold text-white">Crear Cuenta</h1>
        <p className="text-indigo-300/80 text-sm mt-1.5">
          Registra tus datos para comenzar
        </p>
      </div>

      {/* Error */}
      {errorMessage && (
        <div className="mb-5 bg-red-500/20 border border-red-400/30 text-red-300 rounded-xl px-4 py-3 text-sm flex items-center gap-2">
          <span>❌</span>
          {errorMessage}
        </div>
      )}

      {/* Formulario */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Nombre */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-indigo-200 mb-1.5">
            Nombre completo
          </label>
          <input
            id="name"
            type="text"
            required
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl
              text-white placeholder-indigo-300/50 text-sm
              focus:outline-none focus:ring-2 focus:ring-violet-400/60 focus:border-transparent
              transition-all"
            placeholder="Juan Pérez"
          />
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-indigo-200 mb-1.5">
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl
              text-white placeholder-indigo-300/50 text-sm
              focus:outline-none focus:ring-2 focus:ring-violet-400/60 focus:border-transparent
              transition-all"
            placeholder="tu@email.com"
          />
        </div>

        {/* Contraseña */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-indigo-200 mb-1.5">
            Contraseña
            <span className="text-indigo-400/60 font-normal ml-1 text-xs">(mín. 6 caracteres)</span>
          </label>
          <input
            id="password"
            type="password"
            required
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl
              text-white placeholder-indigo-300/50 text-sm
              focus:outline-none focus:ring-2 focus:ring-violet-400/60 focus:border-transparent
              transition-all"
            placeholder="••••••••"
          />
        </div>

        {/* Confirmar contraseña */}
        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-indigo-200 mb-1.5">
            Confirmar contraseña
          </label>
          <input
            id="confirmPassword"
            type="password"
            required
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className={`w-full px-4 py-3 bg-white/10 rounded-xl text-white placeholder-indigo-300/50 text-sm
              focus:outline-none focus:ring-2 focus:border-transparent transition-all
              ${passwordsMismatch
                ? "border border-red-400/50 focus:ring-red-400/50"
                : "border border-white/20 focus:ring-violet-400/60"
              }`}
            placeholder="••••••••"
          />
          {confirmPassword && (
            <p className={`text-xs mt-1.5 ${passwordsMatch ? "text-emerald-400" : "text-red-400"}`}>
              {passwordsMatch ? "✓ Las contraseñas coinciden" : "✗ Las contraseñas no coinciden"}
            </p>
          )}
        </div>

        {/* Botón */}
        <button
          type="submit"
          disabled={loading}
          className="w-full mt-2 bg-violet-600 hover:bg-violet-500 disabled:bg-violet-700/60 disabled:cursor-not-allowed
            text-white font-semibold py-3 rounded-xl transition-all duration-150
            shadow-lg shadow-violet-500/30 hover:shadow-violet-500/50
            focus:outline-none focus:ring-2 focus:ring-violet-400 focus:ring-offset-2 focus:ring-offset-transparent"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Creando cuenta...
            </span>
          ) : (
            "Crear Cuenta"
          )}
        </button>
      </form>

      {/* Enlace */}
      <p className="text-center text-sm text-indigo-300/70 mt-6">
        ¿Ya tienes cuenta?{" "}
        <Link
          href="/login"
          className="text-indigo-300 hover:text-white font-semibold transition-colors hover:underline"
        >
          Inicia sesión
        </Link>
      </p>
    </div>
  );
}

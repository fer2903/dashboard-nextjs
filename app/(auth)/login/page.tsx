"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/app/src/hooks/useAuth";
import { Suspense } from "react";

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
    <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl p-8">
      {/* Encabezado */}
      <div className="text-center mb-8">
        <div className="w-14 h-14 rounded-2xl bg-indigo-600 flex items-center justify-center text-2xl mx-auto mb-4 shadow-lg shadow-indigo-500/40">
          🪙
        </div>
        <h1 className="text-2xl font-bold text-white">Iniciar Sesión</h1>
        <p className="text-indigo-300/80 text-sm mt-1.5">
          Ingresa tus credenciales para acceder
        </p>
      </div>

      {/* Mensaje de registro exitoso */}
      {justRegistered && (
        <div className="mb-5 bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 rounded-xl px-4 py-3 text-sm flex items-center gap-2">
          <span>✅</span>
          Cuenta creada exitosamente. Inicia sesión para continuar.
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="mb-5 bg-red-500/20 border border-red-400/30 text-red-300 rounded-xl px-4 py-3 text-sm flex items-center gap-2">
          <span>❌</span>
          {error}
        </div>
      )}

      {/* Formulario */}
      <form onSubmit={handleSubmit} className="space-y-4">
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
              focus:outline-none focus:ring-2 focus:ring-indigo-400/60 focus:border-transparent
              transition-all"
            placeholder="tu@email.com"
          />
        </div>

        {/* Contraseña */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-indigo-200 mb-1.5">
            Contraseña
          </label>
          <input
            id="password"
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl
              text-white placeholder-indigo-300/50 text-sm
              focus:outline-none focus:ring-2 focus:ring-indigo-400/60 focus:border-transparent
              transition-all"
            placeholder="••••••••"
          />
        </div>

        {/* Botón */}
        <button
          type="submit"
          disabled={loading}
          className="w-full mt-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-700/60 disabled:cursor-not-allowed
            text-white font-semibold py-3 rounded-xl transition-all duration-150
            shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50
            focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 focus:ring-offset-transparent"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Iniciando sesión...
            </span>
          ) : (
            "Iniciar Sesión"
          )}
        </button>
      </form>

      {/* Enlace */}
      <p className="text-center text-sm text-indigo-300/70 mt-6">
        ¿No tienes cuenta?{" "}
        <Link
          href="/register"
          className="text-indigo-300 hover:text-white font-semibold transition-colors hover:underline"
        >
          Regístrate aquí
        </Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 text-center text-indigo-300 text-sm">
        Cargando...
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}

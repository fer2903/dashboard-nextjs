"use client";

/**
 * Página de Login — /login
 *
 * Componente cliente ("use client") porque:
 *  - Usa estado local (useState) para los campos del formulario
 *  - Maneja eventos del usuario (onSubmit, onChange)
 *  - Usa el hook useAuth que internamente usa useRouter
 *
 * Nota: En el App Router, los componentes son Server Components por defecto.
 * Solo marcamos como "use client" cuando necesitamos interactividad.
 */

import { useState, FormEvent } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/app/src/hooks/useAuth";
import { Suspense } from "react";

// Componente interno para leer searchParams (requiere Suspense)
function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // useAuth encapsula toda la lógica de autenticación
  const { login, loading, error } = useAuth();

  // Detectar si el usuario llegó desde el registro exitoso
  const searchParams = useSearchParams();
  const justRegistered = searchParams.get("registered") === "true";

  /**
   * Manejador del submit del formulario
   * e.preventDefault() evita que el formulario recargue la página
   */
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await login(email, password);
  };

  return (
    <div className="w-full max-w-md">
      <div className="bg-white rounded-2xl shadow-2xl p-8">
        {/* Encabezado */}
        <div className="text-center mb-8">
          <div className="text-4xl mb-3">🪙</div>
          <h1 className="text-2xl font-bold text-gray-900">Iniciar Sesión</h1>
          <p className="text-gray-500 text-sm mt-1">
            Ingresa tus credenciales para acceder
          </p>
        </div>

        {/* Mensaje de registro exitoso */}
        {justRegistered && (
          <div className="mb-4 bg-green-50 border border-green-200 text-green-700 rounded-lg px-4 py-3 text-sm">
            ✅ Cuenta creada exitosamente. Inicia sesión para continuar.
          </div>
        )}

        {/* Mensaje de error de la API */}
        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-600 rounded-lg px-4 py-3 text-sm">
            ❌ {error}
          </div>
        )}

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Campo Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg
                focus:ring-2 focus:ring-blue-500 focus:border-transparent
                outline-none transition text-gray-900"
              placeholder="tu@email.com"
            />
          </div>

          {/* Campo Contraseña */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg
                focus:ring-2 focus:ring-blue-500 focus:border-transparent
                outline-none transition text-gray-900"
              placeholder="••••••••"
            />
          </div>

          {/* Botón de submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400
              text-white font-semibold py-2.5 rounded-lg transition-colors
              focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
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

        {/* Enlace al registro */}
        <p className="text-center text-sm text-gray-500 mt-6">
          ¿No tienes cuenta?{" "}
          <Link
            href="/register"
            className="text-blue-600 hover:text-blue-700 font-medium hover:underline"
          >
            Regístrate aquí
          </Link>
        </p>
      </div>
    </div>
  );
}

// Envolvemos en Suspense porque useSearchParams requiere un boundary
export default function LoginPage() {
  return (
    <Suspense fallback={<div className="text-white">Cargando...</div>}>
      <LoginForm />
    </Suspense>
  );
}

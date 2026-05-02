"use client";

/**
 * Página de Registro — /register
 *
 * Permite crear una nueva cuenta de usuario.
 * Incluye validaciones del lado del cliente antes de enviar al servidor:
 *  - Todos los campos son requeridos
 *  - La contraseña debe tener al menos 6 caracteres
 *  - La confirmación de contraseña debe coincidir
 *
 * El servidor realiza sus propias validaciones adicionales (email único, etc.)
 */

import { useState, FormEvent } from "react";
import Link from "next/link";
import { useAuth } from "@/app/src/hooks/useAuth";

export default function RegisterPage() {
  // Estado del formulario — un estado por campo para controlled inputs
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Error de validación del lado cliente (antes de llamar a la API)
  const [clientError, setClientError] = useState<string | null>(null);

  // useAuth maneja la llamada a la API y sus errores
  const { register, loading, error: apiError } = useAuth();

  /**
   * Validaciones del lado del cliente
   * Importante: el servidor también valida, pero validar en el cliente
   * mejora la experiencia del usuario (respuesta inmediata sin round-trip)
   */
  const validate = (): boolean => {
    setClientError(null);

    if (!name.trim()) {
      setClientError("El nombre es requerido");
      return false;
    }

    if (!email.trim()) {
      setClientError("El email es requerido");
      return false;
    }

    if (password.length < 6) {
      setClientError("La contraseña debe tener al menos 6 caracteres");
      return false;
    }

    if (password !== confirmPassword) {
      setClientError("Las contraseñas no coinciden");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Primero validar en el cliente
    if (!validate()) return;

    // Si pasa las validaciones, llamar a la API
    await register(name, email, password);
  };

  // Mostrar el error del cliente o de la API (el del cliente tiene prioridad)
  const errorMessage = clientError || apiError;

  return (
    <div className="w-full max-w-md">
      <div className="bg-white rounded-2xl shadow-2xl p-8">
        {/* Encabezado */}
        <div className="text-center mb-8">
          <div className="text-4xl mb-3">✨</div>
          <h1 className="text-2xl font-bold text-gray-900">Crear Cuenta</h1>
          <p className="text-gray-500 text-sm mt-1">
            Registra tus datos para comenzar
          </p>
        </div>

        {/* Mensaje de error */}
        {errorMessage && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-600 rounded-lg px-4 py-3 text-sm">
            ❌ {errorMessage}
          </div>
        )}

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nombre completo */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Nombre completo
            </label>
            <input
              id="name"
              type="text"
              required
              autoComplete="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg
                focus:ring-2 focus:ring-blue-500 focus:border-transparent
                outline-none transition text-gray-900"
              placeholder="Juan Pérez"
            />
          </div>

          {/* Email */}
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

          {/* Contraseña */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Contraseña
              <span className="text-gray-400 font-normal ml-1">(mín. 6 caracteres)</span>
            </label>
            <input
              id="password"
              type="password"
              required
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg
                focus:ring-2 focus:ring-blue-500 focus:border-transparent
                outline-none transition text-gray-900"
              placeholder="••••••••"
            />
          </div>

          {/* Confirmar Contraseña */}
          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Confirmar contraseña
            </label>
            <input
              id="confirmPassword"
              type="password"
              required
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={`w-full px-4 py-2.5 border rounded-lg
                focus:ring-2 focus:ring-blue-500 focus:border-transparent
                outline-none transition text-gray-900
                ${
                  confirmPassword && confirmPassword !== password
                    ? "border-red-400 bg-red-50"
                    : "border-gray-300"
                }`}
              placeholder="••••••••"
            />
            {/* Indicador visual de coincidencia */}
            {confirmPassword && (
              <p
                className={`text-xs mt-1 ${
                  confirmPassword === password
                    ? "text-green-600"
                    : "text-red-500"
                }`}
              >
                {confirmPassword === password
                  ? "✓ Las contraseñas coinciden"
                  : "✗ Las contraseñas no coinciden"}
              </p>
            )}
          </div>

          {/* Botón submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400
              text-white font-semibold py-2.5 rounded-lg transition-colors
              focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mt-2"
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

        {/* Enlace al login */}
        <p className="text-center text-sm text-gray-500 mt-6">
          ¿Ya tienes cuenta?{" "}
          <Link
            href="/login"
            className="text-blue-600 hover:text-blue-700 font-medium hover:underline"
          >
            Inicia sesión
          </Link>
        </p>
      </div>
    </div>
  );
}

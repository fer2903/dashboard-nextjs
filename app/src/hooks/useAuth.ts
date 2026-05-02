"use client";

/**
 * Hook useAuth — Lógica de autenticación reutilizable
 *
 * Encapsula las llamadas a la API de auth para ser usada
 * en cualquier componente de formulario.
 *
 * Patrón: Custom Hook
 * Un hook personalizado es una función que empieza con "use" y puede
 * llamar otros hooks de React. Permite extraer lógica compleja de los
 * componentes y reutilizarla en múltiples lugares.
 *
 * Marcado con "use client" porque usa useState y useRouter.
 */

import { useState } from "react";
import { useRouter } from "next/navigation";

export const useAuth = () => {
  // Estado de carga: true mientras se espera la respuesta de la API
  const [loading, setLoading] = useState(false);
  // Estado de error: null si no hay error, string con el mensaje si lo hay
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  /**
   * Función de login
   * Llama a POST /api/auth/login
   * Si es exitoso, redirige al dashboard
   *
   * @returns true si el login fue exitoso, false si hubo error
   */
  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    setError(null); // limpiar errores anteriores

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        // La API devolvió un error (4xx)
        setError(data.error || "Error al iniciar sesión");
        return false;
      }

      // Login exitoso — el token ya fue guardado en la cookie por la API
      router.push("/dashboard");
      return true;
    } catch {
      // Error de red o de conexión
      setError("Error de conexión. Verifica tu internet.");
      return false;
    } finally {
      // El bloque finally siempre se ejecuta, éxito o error
      setLoading(false);
    }
  };

  /**
   * Función de registro
   * Llama a POST /api/auth/register
   * Si es exitoso, redirige al login para que el usuario inicie sesión
   *
   * @returns true si el registro fue exitoso, false si hubo error
   */
  const register = async (
    name: string,
    email: string,
    password: string
  ): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Error al registrar usuario");
        return false;
      }

      // Registro exitoso → redirigir al login
      router.push("/login?registered=true");
      return true;
    } catch {
      setError("Error de conexión. Verifica tu internet.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { login, register, loading, error };
};

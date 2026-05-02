import useSWR from "swr";

/**
 * Hook useUsers — Obtiene la lista de usuarios del sistema
 *
 * Usa SWR para fetching con caché automático.
 * Llama a GET /api/users que consulta MongoDB.
 *
 * SWR se encarga de:
 *  - Caché de datos
 *  - Revalidación automática
 *  - Deduplicación de requests (si varios componentes usan este hook, SWR
 *    solo hace UN request a la API)
 */

// Fetcher genérico: recibe una URL y devuelve la respuesta en JSON
const fetcher = (url: string) => fetch(url).then((r) => r.json());

export type AppUser = {
  _id: string;
  name: string;
  email: string;
  role: "admin" | "user";
  createdAt: string;
  updatedAt: string;
};

export const useUsers = () => {
  const { data, error, isLoading } = useSWR<AppUser[]>("/api/users", fetcher);

  return {
    users: data,
    loading: isLoading,
    error,
  };
};

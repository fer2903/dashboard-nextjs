import useSWR from "swr";

const HOST_URL = process.env.NEXT_PUBLIC_HOST_URL ?? "http://localhost:3000";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export type AppAlert = {
  _id: string;
  title: string;
  message: string;
  type: "info" | "warning" | "error" | "success";
  status: "unread" | "read";
  source: string;
  createdAt: string;
  updatedAt: string;
};

export const useAlerts = () => {
  const { data, error, isLoading, mutate } = useSWR<AppAlert[]>(
    `${HOST_URL}/api/alerts`,
    fetcher
  );
  return { alerts: data, loading: isLoading, error, mutate };
};

export const createAlert = async (
  data: Omit<AppAlert, "_id" | "createdAt" | "updatedAt">
) => {
  const res = await fetch(`${HOST_URL}/api/alerts`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error ?? "Error al crear alerta");
  }
  return res.json();
};

export const markAlertRead = async (id: string) => {
  const res = await fetch(`${HOST_URL}/api/alerts/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status: "read" }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error ?? "Error al actualizar alerta");
  }
  return res.json();
};

export const deleteAlert = async (id: string) => {
  const res = await fetch(`${HOST_URL}/api/alerts/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error ?? "Error al eliminar alerta");
  }
  return res.json();
};

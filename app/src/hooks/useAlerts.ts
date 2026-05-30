import useSWR from "swr";

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
  const { data, error, isLoading, mutate } = useSWR<AppAlert[]>("/api/alerts", fetcher);
  return { alerts: data, loading: isLoading, error, mutate };
};

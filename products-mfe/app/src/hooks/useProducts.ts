import useSWR from "swr";

const HOST_URL = process.env.NEXT_PUBLIC_HOST_URL ?? "http://localhost:3000";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export type AppProduct = {
  _id: string;
  name: string;
  category: "DeFi" | "NFT" | "Layer1" | "Layer2" | "Stablecoin" | "Exchange" | "Otro";
  symbol: string;
  price: number;
  stock: number;
  status: "active" | "inactive";
  createdAt: string;
  updatedAt: string;
};

export const useProducts = () => {
  const { data, error, isLoading, mutate } = useSWR<AppProduct[]>(
    `${HOST_URL}/api/products`,
    fetcher
  );
  return { products: data, loading: isLoading, error, mutate };
};

export const createProduct = async (
  data: Omit<AppProduct, "_id" | "createdAt" | "updatedAt">
) => {
  const res = await fetch(`${HOST_URL}/api/products`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error ?? "Error al crear producto");
  }
  return res.json();
};

export const updateProduct = async (
  id: string,
  data: Partial<Omit<AppProduct, "_id" | "createdAt" | "updatedAt">>
) => {
  const res = await fetch(`${HOST_URL}/api/products/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error ?? "Error al actualizar producto");
  }
  return res.json();
};

export const deleteProduct = async (id: string) => {
  const res = await fetch(`${HOST_URL}/api/products/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error ?? "Error al eliminar producto");
  }
  return res.json();
};

import useSWR from "swr";

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
  const { data, error, isLoading, mutate } = useSWR<AppProduct[]>("/api/products", fetcher);
  return { products: data, loading: isLoading, error, mutate };
};

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
export declare const useProducts: () => {
    products: AppProduct[] | undefined;
    loading: boolean;
    error: any;
    mutate: import("swr").KeyedMutator<AppProduct[]>;
};
export declare const createProduct: (data: Omit<AppProduct, "_id" | "createdAt" | "updatedAt">) => Promise<any>;
export declare const updateProduct: (id: string, data: Partial<Omit<AppProduct, "_id" | "createdAt" | "updatedAt">>) => Promise<any>;
export declare const deleteProduct: (id: string) => Promise<any>;

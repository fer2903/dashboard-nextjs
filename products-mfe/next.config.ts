import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  basePath: "/dashboard/products",
  // Necesario para despliegue con Docker
  // output: "standalone",
};

export default nextConfig;

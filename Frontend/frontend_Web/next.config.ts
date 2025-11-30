import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ⚙️ Optimizado para VPS / PM2
  output: "standalone",

  // ⚠️ Evita que el build falle por ESLint (ideal para despliegue rápido)
  eslint: {
    ignoreDuringBuilds: true,
  },

  reactStrictMode: true,

  // 🖼️ Configuración para imágenes desde tu API (IP del VPS)
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "72.61.71.9",
        port: "22",
        pathname: "/**",
      },
      // Si luego usas dominio, solo agrego otro patrón aquí
    ],
  },

  basePath: "",
  trailingSlash: false,
};

export default nextConfig;


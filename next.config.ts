import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Necesario para servir con next/image las imágenes subidas a Sanity (p. ej.
    // siteSettings.heroImage) — sin esto, cualquier <Image src={urlFor(...)...}> lanza un error
    // en tiempo de ejecución por host externo no permitido.
    remotePatterns: [{ protocol: "https", hostname: "cdn.sanity.io" }],
  },
};

export default nextConfig;

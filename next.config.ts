import type { NextConfig } from "next";

// Cabeceras de seguridad básicas para todas las rutas. No se añade Content-Security-Policy: GTM
// carga scripts de terceros que se configuran desde su interfaz, y una CSP estricta rompería las
// etiquetas en cuanto alguien añada una nueva sin tocar este archivo.
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

const nextConfig: NextConfig = {
  images: {
    // Necesario para servir con next/image las imágenes subidas a Sanity (p. ej.
    // siteSettings.heroImage) — sin esto, cualquier <Image src={urlFor(...)...}> lanza un error
    // en tiempo de ejecución por host externo no permitido.
    remotePatterns: [{ protocol: "https", hostname: "cdn.sanity.io" }],
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;

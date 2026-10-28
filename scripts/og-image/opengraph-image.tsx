import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

// Diseño fuente de public/og-image.jpg, la imagen que se ve al compartir la web (WhatsApp, estados,
// redes): 1200×630, el formato estándar de Open Graph. No está en app/ a propósito: generada al
// vuelo sale un PNG de ~700 KB (WhatsApp puede no mostrar imágenes tan pesadas), y además Next no
// la añade a páginas que ya definen su propio openGraph. Por eso se sirve un JPG estático (~80 KB)
// que lib/seo.ts referencia en todas las páginas.
//
// Para regenerarla (si cambia la foto o el mensaje): copiar este archivo a app/opengraph-image.tsx,
// `npm run build && npx next start`, abrir /opengraph-image, guardarlo como JPG 1200×630 (calidad
// ~85) en public/og-image.jpg y borrar la copia de app/.
//
// El logo se dibuja con bloques en vez de usar Docs/branding/LogoLRC.jpg porque ese archivo tiene
// fondo blanco y aquí va sobre la foto. Colores = tokens brand-* de Docs/FRONTEND.md sección 2.
export const alt = "La Reina de la Casa · Encimeras y reformas en Madrid";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const brand = {
  beige: "#D6A99A",
  gray: "#9FA5AA",
  taupe: "#AD8E7F",
  grayPale: "#CECBC4",
};

export default async function OpengraphImage() {
  const root = process.cwd();
  const [fraunces, interMedium, interSemiBold, photo] = await Promise.all([
    readFile(join(root, "scripts/og-image/fonts/Fraunces-SemiBold.ttf")),
    readFile(join(root, "scripts/og-image/fonts/Inter-Medium.ttf")),
    readFile(join(root, "scripts/og-image/fonts/Inter-SemiBold.ttf")),
    readFile(join(root, "public/images/servicios/encimeras-de-cocina.jpg")),
  ]);
  const photoSrc = `data:image/jpeg;base64,${photo.toString("base64")}`;

  return new ImageResponse(
    (
      <div style={{ position: "relative", display: "flex", width: "100%", height: "100%", fontFamily: "Inter" }}>
        {/* eslint-disable-next-line @next/next/no-img-element -- ImageResponse no admite next/image */}
        <img
          src={photoSrc}
          alt=""
          width={1200}
          height={630}
          style={{ position: "absolute", top: 0, left: 0, width: 1200, height: 630, objectFit: "cover" }}
        />
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: 1200,
            height: 630,
            display: "flex",
            backgroundImage: "linear-gradient(90deg, rgba(34,31,27,0.92) 0%, rgba(34,31,27,0.78) 55%, rgba(34,31,27,0.35) 100%)",
          }}
        />

        <div style={{ position: "relative", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "64px 72px", width: "100%" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
            <LogoMark />
            <div style={{ display: "flex", flexDirection: "column", fontFamily: "Fraunces", fontSize: 30, lineHeight: 1.05, letterSpacing: 2, color: "#FFFFFF" }}>
              <span>LA REINA</span>
              <span>DE LA CASA</span>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", maxWidth: 760 }}>
            <div style={{ display: "flex", width: 72, height: 4, backgroundColor: brand.beige, marginBottom: 28 }} />
            <div style={{ display: "flex", fontFamily: "Fraunces", fontSize: 74, lineHeight: 1.05, color: "#FFFFFF" }}>
              Encimeras y reformas en Madrid
            </div>
            <div style={{ display: "flex", marginTop: 24, fontSize: 30, fontWeight: 500, color: "rgba(255,255,255,0.85)" }}>
              Fabricación propia · Presupuesto sin compromiso
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center" }}>
            <div
              style={{
                display: "flex",
                padding: "14px 26px",
                backgroundColor: brand.taupe,
                color: "#FFFFFF",
                fontSize: 26,
                fontWeight: 600,
              }}
            >
              lareinadelacasa.com
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Fraunces", data: fraunces, weight: 600, style: "normal" },
        { name: "Inter", data: interMedium, weight: 500, style: "normal" },
        { name: "Inter", data: interSemiBold, weight: 600, style: "normal" },
      ],
    },
  );
}

// Símbolo del logo: bloque alto a la izquierda, dos a la derecha y uno ancho abajo.
function LogoMark() {
  const block = (style: React.CSSProperties) => <div style={{ display: "flex", borderRadius: 4, ...style }} />;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4, width: 66 }}>
      <div style={{ display: "flex", gap: 4, height: 50 }}>
        {block({ width: 26, height: 50, backgroundColor: brand.beige })}
        <div style={{ display: "flex", flexDirection: "column", gap: 4, width: 36 }}>
          {block({ height: 23, backgroundColor: brand.gray })}
          {block({ height: 23, backgroundColor: brand.taupe })}
        </div>
      </div>
      {block({ height: 16, backgroundColor: brand.grayPale })}
    </div>
  );
}

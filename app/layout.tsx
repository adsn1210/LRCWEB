import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "La Reina de la Casa | Encimeras y reformas en Madrid",
  description:
    "Encimeras de cocina (porcelánico, cuarzo compacto, granito), muebles a medida y reformas integrales de cocina, baño y vivienda en Madrid.",
};

// Cabecera/pie/WhatsApp/cookies viven en app/(marketing)/layout.tsx, no aquí: este layout raíz
// también envuelve /studio (Sanity), que necesita el lienzo completo sin cromo de marketing.
export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className={`${fraunces.variable} ${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans">
        {/* Consent Mode v2: todo denegado por defecto hasta que el usuario decida en el
            CookieBanner (Docs/BACKEND.md sección 6, Docs/07-pendientes-lanzamiento.md). Tiene que
            ir en beforeInteractive dentro del layout raíz para ejecutarse antes que GTM. */}
        {GTM_ID && (
          <Script id="consent-default" strategy="beforeInteractive">
            {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('consent', 'default', {
  'ad_storage': 'denied',
  'analytics_storage': 'denied',
  'ad_user_data': 'denied',
  'ad_personalization': 'denied',
  'wait_for_update': 500
});`}
          </Script>
        )}
        {children}
      </body>
    </html>
  );
}

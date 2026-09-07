import Script from "next/script";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";
import { ProjectWizardButton } from "@/components/layout/ProjectWizardButton";
import { CookieBanner } from "@/components/layout/CookieBanner";
import { SITE_URL } from "@/lib/site";

const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;

// JSON-LD LocalBusiness (Docs/BACKEND.md sección 5). TODO: añadir teléfono real y dirección
// completa (address/geo) en cuanto LRC facilite los datos del showroom.
const localBusinessJsonLd = {
  "@context": "https://schema.org",
  "@type": "HomeAndConstructionBusiness",
  name: "La Reina de la Casa",
  url: SITE_URL,
  image: `${SITE_URL}/logo.webp`,
  telephone: "+34900000000",
  areaServed: "Comunidad de Madrid",
  priceRange: "$$",
};

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* GTM solo en las páginas de marketing (no en /studio, que cuelga de app/layout.tsx
          directamente). El consentimiento por defecto (denegado) ya se fijó en app/layout.tsx
          con beforeInteractive, antes de que este script pueda ejecutarse. */}
      {GTM_ID && (
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
      )}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }} />
      {GTM_ID && (
        <Script id="gtm-loader" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_ID}');`}
        </Script>
      )}
      <Header />
      {children}
      <Footer />
      <WhatsAppButton />
      <ProjectWizardButton />
      <CookieBanner />
    </>
  );
}

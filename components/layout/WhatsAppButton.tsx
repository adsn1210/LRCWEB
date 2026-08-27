import { WhatsAppIcon } from "@/components/ui/icons";

// TODO: sustituir "#" por el enlace real https://wa.me/34XXXXXXXXX en cuanto LRC confirme el número.
// El verde (#25D366/#1DA851) es el color de marca de WhatsApp, fuera de la paleta de LRC a propósito,
// para que el botón se reconozca al instante como acceso directo a WhatsApp.
export function WhatsAppButton() {
  return (
    <a
      href="#"
      aria-label="Escríbenos por WhatsApp"
      className="fixed right-6 bottom-6 z-[90] flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-[#25D366]/40 transition hover:bg-[#1DA851]"
    >
      <WhatsAppIcon className="h-7 w-7" />
    </a>
  );
}

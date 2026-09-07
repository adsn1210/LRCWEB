"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { ProjectWizard } from "@/components/forms/ProjectWizard";
import { trackEvent } from "@/lib/analytics";
import { XIcon } from "@/components/ui/icons";

export function ProjectWizardButton() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  if (pathname === "/contacto") return null;

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setOpen(true);
          trackEvent("lead_widget_open");
        }}
        className="fixed left-6 top-[55%] z-[90] flex h-14 items-center justify-center bg-accent-500 px-6 text-center text-[15px] font-semibold text-base-50 shadow-lg shadow-accent-500/30 transition hover:bg-accent-600"
      >
        Cuéntanos tu proyecto
      </button>

      {open && (
        <div
          role="presentation"
          onClick={(event) => {
            if (event.target === event.currentTarget) setOpen(false);
          }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-ink-900/60 p-4"
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Cuéntanos tu proyecto"
            className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto bg-white p-6 md:p-8"
          >
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Cerrar"
              className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center text-ink-700 hover:text-ink-900"
            >
              <XIcon className="h-5 w-5" />
            </button>
            <ProjectWizard sourcePage="widget-flotante" />
          </div>
        </div>
      )}
    </>
  );
}

import Image from "next/image";

// TODO: reemplazar por el contenido real de la home (Docs/03-arquitectura-informacion-sitemap.md)
// cuando arranque la Fase 2 (Desarrollo core) — este placeholder solo confirma que el
// andamiaje de Next.js + Tailwind + fuentes + paleta de marca funciona correctamente.
export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-6 bg-base-50 px-6 py-24 text-center">
      <Image src="/logo.webp" alt="La Reina de la Casa" width={220} height={47} priority />
      <h1 className="font-serif text-3xl font-semibold text-ink-900 md:text-4xl">
        Encimeras y reformas en Madrid
      </h1>
      <p className="max-w-md text-base text-ink-700">
        Web en construcción — Fase 1 (setup técnico) completada.
      </p>
    </main>
  );
}

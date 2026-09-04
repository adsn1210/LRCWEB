type Step = { title: string; description: string };

type ProcessStepsProps = {
  eyebrow: string;
  title: string;
  steps: Step[];
  className?: string;
};

// Extraído de la sección "Cómo trabajamos" de la Home para reutilizar en páginas de servicio.
export function ProcessSteps({ eyebrow, title, steps, className }: ProcessStepsProps) {
  return (
    <section className={`py-14 md:py-24 ${className ?? ""}`}>
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="mb-14">
          <p className="text-sm font-semibold uppercase tracking-wide text-accent-600">{eyebrow}</p>
          <h2 className="mt-2.5 font-serif text-3xl font-semibold text-ink-900 md:text-4xl">{title}</h2>
        </div>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, i) => (
            <div key={step.title} className="flex flex-col gap-4">
              <div className="flex h-12 w-12 items-center justify-center border border-accent-500 font-serif text-lg font-semibold text-accent-600">
                {i + 1}
              </div>
              <h3 className="font-sans text-xl font-semibold text-ink-900">{step.title}</h3>
              <p className="text-base leading-relaxed text-ink-700">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

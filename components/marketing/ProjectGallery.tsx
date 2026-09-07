"use client";

import { useMemo, useState } from "react";
import { ProjectCard } from "@/components/marketing/ProjectCard";
import { toProjectCardData, type SanityProject } from "@/lib/sanity-projects";
import type { MaterialSlug, ServiceSlug } from "@/lib/slugs";

type Option<T extends string> = { slug: T; label: string };

type ProjectGalleryProps = {
  projects: SanityProject[];
  serviceOptions: Option<ServiceSlug>[];
  materialOptions: Option<MaterialSlug>[];
};

export function ProjectGallery({ projects, serviceOptions, materialOptions }: ProjectGalleryProps) {
  const [service, setService] = useState<ServiceSlug | "todos">("todos");
  const [material, setMaterial] = useState<MaterialSlug | "todos">("todos");

  const filtered = useMemo(() => {
    return projects.filter((p) => {
      if (service !== "todos" && p.serviceSlug !== service) return false;
      if (material !== "todos" && p.materialSlug !== material) return false;
      return true;
    });
  }, [projects, service, material]);

  return (
    <div>
      <div className="mb-10 flex flex-wrap gap-8">
        <FilterGroup label="Servicio" value={service} onChange={setService} options={[{ slug: "todos" as const, label: "Todos" }, ...serviceOptions]} />
        <FilterGroup label="Material" value={material} onChange={setMaterial} options={[{ slug: "todos" as const, label: "Todos" }, ...materialOptions]} />
      </div>

      {filtered.length === 0 ? (
        <p className="text-base text-ink-700">No hay proyectos todavía con esta combinación de filtros.</p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => (
            <ProjectCard key={p.id} {...toProjectCardData(p)} />
          ))}
        </div>
      )}
    </div>
  );
}

function FilterGroup<T extends string>({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: T | "todos";
  onChange: (value: T | "todos") => void;
  options: Option<T | "todos">[];
}) {
  return (
    <div>
      <p className="mb-2.5 text-xs font-bold uppercase tracking-wide text-ink-900">{label}</p>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => {
          const active = value === opt.slug;
          return (
            <button
              key={opt.slug}
              type="button"
              onClick={() => onChange(opt.slug)}
              aria-pressed={active}
              className={`flex h-10 items-center border px-4 text-sm font-medium transition ${
                active
                  ? "border-accent-500 bg-accent-500 text-base-50"
                  : "border-base-200 text-ink-700 hover:border-accent-500 hover:text-accent-600"
              }`}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

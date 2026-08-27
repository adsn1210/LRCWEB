import Link from "next/link";
import type { ComponentType, SVGProps } from "react";
import { ArrowRightIcon } from "@/components/ui/icons";

type ServiceCardProps = {
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  title: string;
  description: string;
  href: string;
};

export function ServiceCard({ icon: Icon, title, description, href }: ServiceCardProps) {
  return (
    <div className="group flex flex-col gap-4 border border-base-200 bg-white p-7 transition hover:-translate-y-0.5 hover:border-accent-500">
      <span className="flex h-12 w-12 items-center justify-center bg-base-100 text-accent-600">
        <Icon className="h-6 w-6" />
      </span>
      <h3 className="font-sans text-xl font-semibold text-ink-900">{title}</h3>
      <p className="text-base leading-relaxed text-ink-700">{description}</p>
      <Link href={href} className="mt-auto inline-flex items-center gap-1.5 text-sm font-semibold text-accent-600">
        Ver más
        <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
      </Link>
    </div>
  );
}

import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon } from "@/components/ui/icons";

type MaterialCardProps = {
  title: string;
  description: string;
  href: string;
  gradient: string;
  imageUrl?: string;
};

export function MaterialCard({ title, description, href, gradient, imageUrl }: MaterialCardProps) {
  return (
    <div className="border border-base-200 bg-white">
      <div className="relative h-44 overflow-hidden" style={imageUrl ? undefined : { background: gradient }}>
        {imageUrl && (
          <Image
            src={imageUrl}
            alt={`Textura de ${title.toLowerCase()}`}
            fill
            sizes="(min-width: 768px) 33vw, 100vw"
            className="object-cover"
          />
        )}
      </div>
      <div className="p-6">
        <h3 className="font-sans text-xl font-semibold text-ink-900">{title}</h3>
        <p className="mt-2 text-base leading-relaxed text-ink-700">{description}</p>
        <Link href={href} className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-accent-600">
          Ver acabados
          <ArrowRightIcon className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}

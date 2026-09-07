"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowRightIcon } from "@/components/ui/icons";

export type ProjectCardData = {
  title: string;
  tagLine: string;
  beforeImageUrl: string;
  afterImageUrl: string;
};

export function ProjectCard({ title, tagLine, beforeImageUrl, afterImageUrl }: ProjectCardData) {
  const [showBefore, setShowBefore] = useState(false);

  return (
    <div className="border border-base-200 bg-white">
      <div className="relative h-60">
        <Image
          src={showBefore ? beforeImageUrl : afterImageUrl}
          alt={`${title} — ${showBefore ? "antes" : "después"}`}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover"
        />
        <div className="absolute inset-x-3 top-3 flex items-center justify-between">
          <span className="inline-flex h-7 items-center bg-ink-900/70 px-3 text-xs font-bold tracking-wide text-white backdrop-blur-sm">
            {showBefore ? "ANTES" : "DESPUÉS"}
          </span>
          <button
            type="button"
            onClick={() => setShowBefore((v) => !v)}
            className="inline-flex h-11 items-center gap-1.5 bg-white px-3.5 text-xs font-semibold text-ink-900 shadow-md"
          >
            <ArrowRightIcon className="h-3.5 w-3.5" />
            {showBefore ? "Ver después" : "Ver antes"}
          </button>
        </div>
      </div>
      <div className="p-5">
        <p className="text-base font-semibold text-ink-900">{title}</p>
        <p className="mt-1.5 text-sm font-medium text-ink-700">{tagLine}</p>
      </div>
    </div>
  );
}

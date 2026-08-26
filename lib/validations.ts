import { z } from "zod";

// Ver Docs/BACKEND.md sección 4.
export const leadSchema = z.object({
  name: z.string().min(2),
  phoneOrEmail: z.string().min(6),
  service: z.enum(["encimeras", "reforma-cocina", "reforma-bano", "reforma-integral", "otro"]),
  message: z.string().max(1000).optional(),
  honeypot: z.string().max(0), // debe llegar vacío; si no, es spam → descartar en silencio
});

export type LeadInput = z.infer<typeof leadSchema>;

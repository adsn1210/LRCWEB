import { z } from "zod";

// Ver Docs/BACKEND.md sección 4.
export const leadSchema = z.object({
  name: z.string().min(2),
  phoneOrEmail: z.string().min(6),
  service: z.enum(["encimeras", "reforma-cocina", "reforma-bano", "reforma-integral", "otro"]),
  message: z.string().max(1000).optional(),
  honeypot: z.string().max(0), // debe llegar vacío; si no, es spam → descartar en silencio
  budget: z.coerce.number().min(1000).max(30000).optional(),
  urgency: z.enum(["mas-3-meses", "menos-3-meses", "lo-antes-posible"]).optional(),
});

export type LeadInput = z.infer<typeof leadSchema>;

export type SubmitLeadState = {
  status: "idle" | "success" | "error";
  message?: string;
};

import { z } from "zod";

// Ver Docs/BACKEND.md sección 4. Los límites de longitud no son de UX (el formulario ya pone los
// suyos) sino de defensa: la server action es un endpoint público y no debe aceptar textos de
// tamaño arbitrario que acaben en la base de datos y en el email de aviso.
export const leadSchema = z.object({
  name: z.string().trim().min(2).max(100),
  phoneOrEmail: z.string().trim().min(6).max(254),
  service: z.enum(["encimeras", "reforma-cocina", "reforma-bano", "reforma-integral", "otro"]),
  message: z.string().trim().max(1000).optional(),
  honeypot: z.string().max(0), // debe llegar vacío; si no, es spam → descartar en silencio
  budget: z.coerce.number().min(1000).max(30000).optional(),
  urgency: z.enum(["mas-3-meses", "menos-3-meses", "lo-antes-posible"]).optional(),
  // Ruta interna desde la que se envió (p. ej. "/contacto"); se usa para el enlace del email de
  // aviso, así que solo se aceptan rutas relativas del propio sitio.
  sourcePage: z
    .string()
    .max(200)
    .regex(/^\/[^\s]*$/)
    .catch("/contacto"),
});

export type LeadInput = z.infer<typeof leadSchema>;

// Solo para decidir si se puede usar como `replyTo` y para el botón "Responder por email": un
// "@" suelto no basta, Resend rechaza el envío entero si el replyTo no es un email válido.
export function isEmail(value: string) {
  return z.email().safeParse(value).success;
}

export type SubmitLeadState = {
  status: "idle" | "success" | "error";
  message?: string;
};

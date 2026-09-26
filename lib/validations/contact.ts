import { z } from "zod";
import type { ContactFieldErrors, ContactMessage } from "@/types/contact";

export const CONTACT_LIMITS = {
  name: 80,
  email: 254,
  message: 5000,
} as const;

const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Please enter your name.")
    .max(CONTACT_LIMITS.name, "Please keep your name under 80 characters."),
  email: z
    .string()
    .trim()
    .max(CONTACT_LIMITS.email, "Please use a shorter email address.")
    .pipe(z.email({ error: "Please enter a valid email address." })),
  message: z
    .string()
    .trim()
    .min(10, "Please add a little more detail (at least 10 characters).")
    .max(
      CONTACT_LIMITS.message,
      "Please keep your message under 5,000 characters.",
    ),
});

export function validateContactMessage(
  input: unknown,
):
  | { success: true; data: ContactMessage }
  | { success: false; errors: ContactFieldErrors } {
  const result = contactSchema.safeParse(input);
  if (result.success) return { success: true, data: result.data };

  const errors: ContactFieldErrors = {};
  for (const issue of result.error.issues) {
    const field = issue.path[0];
    if (field === "name" || field === "email" || field === "message") {
      errors[field] ??= issue.message;
    }
  }
  return { success: false, errors };
}

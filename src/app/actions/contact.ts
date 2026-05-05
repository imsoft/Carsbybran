"use server";

import { z } from "zod/v4";
import { Resend } from "resend";

const ContactSchema = z.object({
  name: z.string().min(2, { error: "Nombre requerido." }).trim(),
  email: z.email({ error: "Email inválido." }).trim(),
  subject: z.string().min(3, { error: "Asunto requerido." }).trim(),
  message: z.string().min(10, { error: "Mensaje muy corto." }).trim(),
});

export type ContactFormState = {
  status: "idle" | "success" | "error";
  errors?: Partial<Record<"name" | "email" | "subject" | "message", string>>;
};

export async function sendContactMessage(
  _prev: ContactFormState,
  formData: FormData
): Promise<ContactFormState> {
  const raw = {
    name: formData.get("name"),
    email: formData.get("email"),
    subject: formData.get("subject"),
    message: formData.get("message"),
  };

  const result = ContactSchema.safeParse(raw);
  if (!result.success) {
    const errors: ContactFormState["errors"] = {};
    for (const issue of result.error.issues) {
      const key = String(issue.path[0]) as keyof typeof errors;
      if (!errors[key]) errors[key] = issue.message;
    }
    return { status: "error", errors };
  }

  const { name, email, subject, message } = result.data;

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const { error } = await resend.emails.send({
      from: process.env.EMAIL_FROM!,
      to: ["editorial@carsbybran.com"],
      replyTo: email,
      subject: `[Contacto] ${subject}`,
      html: `<p><strong>De:</strong> ${name} &lt;${email}&gt;</p><p><strong>Asunto:</strong> ${subject}</p><hr/><p>${message.replace(/\n/g, "<br/>")}</p>`,
    });
    if (error) return { status: "error" };
  } catch {
    return { status: "error" };
  }

  return { status: "success" };
}

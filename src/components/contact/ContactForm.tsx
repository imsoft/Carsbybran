"use client";

import { useActionState, useEffect } from "react";
import { Send, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { joinFormErrorMessages } from "@/lib/form-errors";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  sendContactMessage,
  type ContactFormState,
} from "@/app/actions/contact";

interface ContactFormProps {
  dict: {
    name: string;
    email: string;
    subject: string;
    message: string;
    send: string;
    sending: string;
    success: string;
  };
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-foreground">
        {label} <span className="text-accent" aria-hidden="true">*</span>
      </label>
      {children}
    </div>
  );
}

const inputClass =
  "w-full rounded-md border border-border bg-card px-3 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-accent focus:ring-2 focus:ring-accent/20";

const initialState: ContactFormState = { status: "idle" };

export function ContactForm({ dict }: ContactFormProps) {
  const [state, formAction, isPending] = useActionState(
    sendContactMessage,
    initialState
  );

  useEffect(() => {
    if (state.status !== "success") return;
    toast.success(dict.success, { id: "contact-success" });
  }, [state.status, dict.success]);

  useEffect(() => {
    if (state.status !== "error") return;
    const desc = joinFormErrorMessages(state.errors);
    if (desc) {
      toast.error("Revisa el formulario", {
        id: "contact-validation",
        description: desc,
      });
      return;
    }
    toast.error("No se pudo enviar el mensaje", {
      id: "contact-server",
      description: "Intenta de nuevo en unos minutos o escríbenos por redes sociales.",
    });
  }, [state.status, state.errors]);

  if (state.status === "success") {
    return (
      <div className="flex flex-col items-center gap-3 rounded-xl border border-border bg-card px-8 py-12 text-center">
        <CheckCircle className="h-10 w-10 text-emerald-500" aria-hidden="true" />
        <p className="text-base font-medium text-foreground">{dict.success}</p>
      </div>
    );
  }

  return (
    <form action={formAction} noValidate className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label={dict.name}>
          <input
            type="text"
            name="name"
            required
            aria-invalid={!!state.errors?.name}
            className={cn(inputClass, state.errors?.name && "border-destructive")}
          />
        </Field>
        <Field label={dict.email}>
          <input
            type="email"
            name="email"
            required
            aria-invalid={!!state.errors?.email}
            className={cn(inputClass, state.errors?.email && "border-destructive")}
          />
        </Field>
      </div>

      <Field label={dict.subject}>
        <input
          type="text"
          name="subject"
          required
          aria-invalid={!!state.errors?.subject}
          className={cn(inputClass, state.errors?.subject && "border-destructive")}
        />
      </Field>

      <Field label={dict.message}>
        <textarea
          name="message"
          required
          rows={5}
          aria-invalid={!!state.errors?.message}
          className={cn(inputClass, "resize-none", state.errors?.message && "border-destructive")}
        />
      </Field>

      <Button
        type="submit"
        disabled={isPending}
        className="w-full sm:w-auto gap-2 bg-accent text-white hover:bg-accent/90"
      >
        {isPending ? (
          <>
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            {dict.sending}
          </>
        ) : (
          <>
            <Send className="h-4 w-4" />
            {dict.send}
          </>
        )}
      </Button>
    </form>
  );
}

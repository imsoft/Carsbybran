"use client";

import { useActionState } from "react";
import { Send, CheckCircle } from "lucide-react";
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
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-foreground">
        {label} <span className="text-accent" aria-hidden="true">*</span>
      </label>
      {children}
      {error && (
        <p className="text-xs text-destructive" role="alert">
          {error}
        </p>
      )}
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
        <Field label={dict.name} error={state.errors?.name}>
          <input
            type="text"
            name="name"
            required
            className={cn(inputClass, state.errors?.name && "border-destructive")}
          />
        </Field>
        <Field label={dict.email} error={state.errors?.email}>
          <input
            type="email"
            name="email"
            required
            className={cn(inputClass, state.errors?.email && "border-destructive")}
          />
        </Field>
      </div>

      <Field label={dict.subject} error={state.errors?.subject}>
        <input
          type="text"
          name="subject"
          required
          className={cn(inputClass, state.errors?.subject && "border-destructive")}
        />
      </Field>

      <Field label={dict.message} error={state.errors?.message}>
        <textarea
          name="message"
          required
          rows={5}
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

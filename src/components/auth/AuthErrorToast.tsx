"use client";

import { useEffect } from "react";
import { toast } from "sonner";

/** Muestra un toast para errores OAuth / URL (p. ej. ?error=google_denied). */
export function AuthErrorToast({
  message,
  toastId,
}: {
  message: string;
  toastId: string;
}) {
  useEffect(() => {
    toast.error(message, { id: toastId, duration: 6000 });
  }, [message, toastId]);
  return null;
}

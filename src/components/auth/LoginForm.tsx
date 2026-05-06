"use client";

import { useEffect, useState } from "react";
import { useActionState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { login } from "@/app/actions/auth";
import type { LoginFormState } from "@/lib/definitions";
import { joinFormErrorMessages } from "@/lib/form-errors";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

type Dict = {
  emailLabel: string;
  passwordLabel: string;
  submit: string;
  submitting: string;
};

const initialState: LoginFormState = {};

export function LoginForm({ dict }: { dict: Dict }) {
  const [state, action, pending] = useActionState(login, initialState);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (state.message) {
      toast.error(state.message, { id: "login-form-message" });
    }
  }, [state.message]);

  useEffect(() => {
    const desc = joinFormErrorMessages(state.errors);
    if (desc) {
      toast.error("Revisa el formulario", {
        id: "login-form-validation",
        description: desc,
      });
    }
  }, [state.errors]);

  return (
    <Card>
      <CardContent className="pt-6">
        <form action={action} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="email">{dict.emailLabel}</Label>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              aria-invalid={!!state.errors?.email}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="password">{dict.passwordLabel}</Label>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                aria-invalid={!!state.errors?.password}
                className="pr-10"
              />
              <button
                type="button"
                tabIndex={-1}
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              >
                {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={pending}>
            {pending ? dict.submitting : dict.submit}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

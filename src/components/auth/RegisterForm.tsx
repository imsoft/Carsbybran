"use client";

import { useState } from "react";
import { useActionState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { register } from "@/app/actions/auth";
import type { RegisterFormState } from "@/lib/definitions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

type Dict = {
  nameLabel: string;
  emailLabel: string;
  passwordLabel: string;
  submit: string;
  submitting: string;
};

const initialState: RegisterFormState = {};

export function RegisterForm({ dict }: { dict: Dict }) {
  const [state, action, pending] = useActionState(register, initialState);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Card>
      <CardContent className="pt-6">
        <form action={action} className="space-y-4">
          {state.message && (
            <p className="text-sm text-center text-muted-foreground">{state.message}</p>
          )}

          <div className="space-y-1.5">
            <Label htmlFor="name">{dict.nameLabel}</Label>
            <Input
              id="name"
              name="name"
              autoComplete="name"
              aria-describedby="name-error"
            />
            {state.errors?.name && (
              <p id="name-error" className="text-xs text-destructive">
                {state.errors.name[0]}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="email">{dict.emailLabel}</Label>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              aria-describedby="reg-email-error"
            />
            {state.errors?.email && (
              <p id="reg-email-error" className="text-xs text-destructive">
                {state.errors.email[0]}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="password">{dict.passwordLabel}</Label>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                aria-describedby="reg-password-error"
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
            {state.errors?.password && (
              <ul id="reg-password-error" className="text-xs text-destructive space-y-0.5">
                {state.errors.password.map((e) => (
                  <li key={e}>· {e}</li>
                ))}
              </ul>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={pending}>
            {pending ? dict.submitting : dict.submit}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

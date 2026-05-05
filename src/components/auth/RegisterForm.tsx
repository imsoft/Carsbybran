"use client";

import { useActionState } from "react";
import { register } from "@/app/actions/auth";
import type { RegisterFormState } from "@/lib/definitions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

type Dict = {
  nameLabel: string;
  namePlaceholder: string;
  emailLabel: string;
  passwordLabel: string;
  passwordPlaceholder: string;
  submit: string;
  submitting: string;
};

const initialState: RegisterFormState = {};

export function RegisterForm({ dict }: { dict: Dict }) {
  const [state, action, pending] = useActionState(register, initialState);

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
              placeholder={dict.namePlaceholder}
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
              placeholder="tu@email.com"
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
            <Input
              id="password"
              name="password"
              type="password"
              placeholder={dict.passwordPlaceholder}
              autoComplete="new-password"
              aria-describedby="reg-password-error"
            />
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

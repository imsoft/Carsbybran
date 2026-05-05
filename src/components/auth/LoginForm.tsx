"use client";

import { useActionState } from "react";
import { login } from "@/app/actions/auth";
import type { LoginFormState } from "@/lib/definitions";
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

  return (
    <Card>
      <CardContent className="pt-6">
        <form action={action} className="space-y-4">
          {state.message && (
            <p className="text-sm text-destructive text-center">{state.message}</p>
          )}

          <div className="space-y-1.5">
            <Label htmlFor="email">{dict.emailLabel}</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="admin@carsbybran.com"
              autoComplete="email"
              aria-describedby="email-error"
            />
            {state.errors?.email && (
              <p id="email-error" className="text-xs text-destructive">
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
              placeholder="••••••••"
              autoComplete="current-password"
              aria-describedby="password-error"
            />
            {state.errors?.password && (
              <p id="password-error" className="text-xs text-destructive">
                {state.errors.password[0]}
              </p>
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

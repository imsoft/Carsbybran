import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDictionary, hasLocale } from "../dictionaries";
import { LoginForm } from "@/components/auth/LoginForm";
import { GoogleButton } from "@/components/auth/GoogleButton";
import { AuthPageShell } from "@/components/auth/AuthPageShell";
import { AuthErrorToast } from "@/components/auth/AuthErrorToast";

type Props = PageProps<"/[lang]/login"> & {
  searchParams: Promise<{ from?: string; error?: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = await getDictionary(lang);
  return { title: `${dict.auth.login.title} — Carsbybran` };
}

export default async function LoginPage({ params, searchParams }: Props) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  const { from, error } = await searchParams;
  const dict = await getDictionary(lang);
  const d = dict.auth.login;

  return (
    <AuthPageShell lang={lang}>
      <div className="w-full max-w-sm space-y-6">
        <div className="space-y-1.5 text-center">
          <h1 className="text-2xl font-bold tracking-tight">{d.title}</h1>
          <p className="text-sm text-muted-foreground">{d.subtitle}</p>
        </div>

        {error && d.errors[error as keyof typeof d.errors] && (
          <AuthErrorToast
            message={d.errors[error as keyof typeof d.errors]}
            toastId={`login-url-${error}`}
          />
        )}

        <div className="space-y-3">
          <GoogleButton from={from} label={d.googleCta} />

          <div className="flex items-center gap-3">
            <div className="flex-1 border-t border-border" />
            <span className="text-xs text-muted-foreground">{d.orEmail}</span>
            <div className="flex-1 border-t border-border" />
          </div>

          <LoginForm dict={d} />
        </div>

        <p className="text-center text-sm text-muted-foreground">
          {d.noAccount}{" "}
          <Link
            href={`/${lang}/register`}
            className="font-medium text-foreground underline underline-offset-4 hover:text-accent"
          >
            {d.signUpLink}
          </Link>
        </p>
      </div>
    </AuthPageShell>
  );
}

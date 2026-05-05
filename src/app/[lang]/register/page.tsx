import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDictionary, hasLocale } from "../dictionaries";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { GoogleButton } from "@/components/auth/GoogleButton";
import { AuthPageShell } from "@/components/auth/AuthPageShell";

type Props = PageProps<"/[lang]/register"> & {
  searchParams: Promise<{ from?: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = await getDictionary(lang);
  return { title: `${dict.auth.register.title} — Carsbybran` };
}

export default async function RegisterPage({ params, searchParams }: Props) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  const { from } = await searchParams;
  const dict = await getDictionary(lang);
  const d = dict.auth.register;

  return (
    <AuthPageShell lang={lang}>
      <div className="w-full max-w-sm space-y-6">
        <div className="space-y-1.5 text-center">
          <h1 className="text-2xl font-bold tracking-tight">{d.title}</h1>
          <p className="text-sm text-muted-foreground">{d.subtitle}</p>
        </div>

        <div className="space-y-3">
          <GoogleButton from={from} label={d.googleCta} />

          <div className="flex items-center gap-3">
            <div className="flex-1 border-t border-border" />
            <span className="text-xs text-muted-foreground">{d.orEmail}</span>
            <div className="flex-1 border-t border-border" />
          </div>

          <RegisterForm dict={d} />
        </div>

        <p className="text-center text-sm text-muted-foreground">
          {d.hasAccount}{" "}
          <Link
            href={`/${lang}/login`}
            className="font-medium text-foreground underline underline-offset-4 hover:text-accent"
          >
            {d.signInLink}
          </Link>
        </p>
      </div>
    </AuthPageShell>
  );
}

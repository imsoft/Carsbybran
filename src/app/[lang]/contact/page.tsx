import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Mail, MapPin, Clock } from "lucide-react";
import { getDictionary, hasLocale } from "../dictionaries";
import { pageMeta } from "@/lib/seo";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ContactForm } from "@/components/contact/ContactForm";

export async function generateMetadata({ params }: PageProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = await getDictionary(lang);
  const title = `${dict.contact.title} — Carsbybran`;
  return { title, description: dict.meta.description, ...pageMeta(lang, "/contact", title, dict.meta.description) };
}

export default async function ContactPage({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);
  const d = dict.contact;

  return (
    <>
      <Navbar lang={lang} dict={dict.nav} />
      <main className="flex-1 container mx-auto max-w-7xl px-4 py-10 md:px-8">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-foreground">{d.title}</h1>
          <p className="mt-2 text-muted-foreground">{d.subtitle}</p>
        </div>

        <div className="grid gap-10 lg:grid-cols-[1fr_2fr]">
          {/* Side info */}
          <aside className="space-y-6">
            <div className="rounded-xl border border-border bg-card p-6 space-y-5">
              <InfoRow
                icon={<Mail className="h-4 w-4 text-accent" />}
                label="Email"
                value="carsbybran@gmail.com"
              />
              <InfoRow
                icon={<MapPin className="h-4 w-4 text-accent" />}
                label={lang === "es-MX" ? "Ubicación" : "Location"}
                value={
                  lang === "es-MX"
                    ? "Ciudad de México, MX"
                    : "Mexico City, MX"
                }
              />
              <InfoRow
                icon={<Clock className="h-4 w-4 text-accent" />}
                label={lang === "es-MX" ? "Respuesta" : "Response time"}
                value={
                  lang === "es-MX"
                    ? "Menos de 48 horas"
                    : "Within 48 hours"
                }
              />
            </div>
          </aside>

          {/* Form */}
          <div>
            <ContactForm dict={d} />
          </div>
        </div>
      </main>
      <Footer lang={lang} dict={dict.footer} />
    </>
  );
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 shrink-0">{icon}</span>
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {label}
        </p>
        <p className="mt-0.5 text-sm text-foreground">{value}</p>
      </div>
    </div>
  );
}

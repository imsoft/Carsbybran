import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary, hasLocale } from "../dictionaries";
import { pageMeta } from "@/lib/seo";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export async function generateMetadata({ params }: PageProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = await getDictionary(lang);
  const title = `${dict.about.title} — Carsbybran`;
  return { title, description: dict.meta.description, ...pageMeta(lang, "/about", title, dict.meta.description) };
}

export default async function AboutPage({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);
  const d = dict.about;

  return (
    <>
      <Navbar lang={lang} dict={dict.nav} />
      <main className="flex-1">
        {/* Hero */}
        <section className="border-b border-border bg-card">
          <div className="container mx-auto max-w-4xl px-4 py-16 md:px-8 text-center">
            <p className="text-xs font-bold uppercase tracking-widest text-accent mb-3">
              {d.eyebrow}
            </p>
            <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
              {d.title}
            </h1>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              {d.subtitle}
            </p>
          </div>
        </section>

        {/* Mission */}
        <section className="container mx-auto max-w-3xl px-4 py-14 md:px-8">
          <h2 className="text-xl font-bold text-foreground mb-4">
            {d.missionTitle}
          </h2>
          <p className="text-base leading-relaxed text-muted-foreground">
            {d.mission}
          </p>
        </section>
      </main>
      <Footer lang={lang} dict={dict.footer} />
    </>
  );
}

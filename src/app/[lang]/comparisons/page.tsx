import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary, hasLocale } from "../dictionaries";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CarComparisonTool } from "@/components/comparisons/CarComparisonTool";
import { allReviews } from "@/lib/mock-data";

export async function generateMetadata({ params }: PageProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = await getDictionary(lang);
  return { title: `${dict.comparisons.title} — Carsbybran`, description: dict.meta.description };
}

export default async function ComparisonsPage({
  params,
}: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);

  return (
    <>
      <Navbar lang={lang} dict={dict.nav} />
      <main className="flex-1 container mx-auto max-w-7xl px-4 py-10 md:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">
            {dict.comparisons.title}
          </h1>
          <p className="mt-2 text-muted-foreground">
            {dict.comparisons.subtitle}
          </p>
        </div>
        <CarComparisonTool
          cars={allReviews}
          lang={lang}
          dict={dict.comparisons}
        />
      </main>
      <Footer lang={lang} dict={dict.footer} />
    </>
  );
}

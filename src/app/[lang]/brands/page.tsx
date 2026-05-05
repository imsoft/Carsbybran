import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary, hasLocale } from "../dictionaries";
import { pageMeta } from "@/lib/seo";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { BrandFilter } from "@/components/home/BrandFilter";
import { getBrands } from "@/lib/articles";

export async function generateMetadata({ params }: PageProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = await getDictionary(lang);
  const title = `${dict.brands.title} — Carsbybran`;
  return { title, description: dict.meta.description, ...pageMeta(lang, "/brands", title, dict.meta.description) };
}

export default async function BrandsPage({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const [dict, brands] = await Promise.all([getDictionary(lang), getBrands()]);

  return (
    <>
      <Navbar lang={lang} dict={dict.nav} />
      <main className="flex-1 container mx-auto max-w-7xl px-4 py-10 md:px-8">
        <BrandFilter brands={brands} lang={lang} dict={dict.brands} />
      </main>
      <Footer lang={lang} dict={dict.footer} />
    </>
  );
}

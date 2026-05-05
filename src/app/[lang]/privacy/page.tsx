import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary, hasLocale } from "../dictionaries";
import { pageMeta } from "@/lib/seo";
import { LegalDocument } from "@/components/legal/LegalDocument";

export async function generateMetadata({ params }: PageProps<"/[lang]/privacy">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = await getDictionary(lang);
  const doc = dict.legalDocs.privacy;
  const title = `${doc.title} — Carsbybran`;
  return {
    title,
    description: doc.description,
    ...pageMeta(lang, "/privacy", title, doc.description),
    robots: { index: true, follow: true },
  };
}

export default async function PrivacyPage({ params }: PageProps<"/[lang]/privacy">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);
  const doc = dict.legalDocs.privacy;

  return (
    <LegalDocument
      lang={lang}
      dict={dict}
      title={doc.title}
      description={doc.description}
      lastUpdated={doc.lastUpdated}
      intro={doc.intro}
      sections={doc.sections}
    />
  );
}

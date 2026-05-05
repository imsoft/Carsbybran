import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import type { Dictionary } from "@/app/[lang]/dictionaries";

type Section = {
  heading: string;
  paragraphs: string[];
};

type Props = {
  lang: string;
  dict: Dictionary;
  title: string;
  description: string;
  lastUpdated: string;
  intro: string;
  sections: Section[];
};

export function LegalDocument({
  lang,
  dict,
  title,
  description: _description,
  lastUpdated,
  intro,
  sections,
}: Props) {
  return (
    <>
      <Navbar lang={lang} dict={dict.nav} />
      <main className="flex-1">
        <section className="border-b border-border bg-card">
          <div className="container mx-auto max-w-3xl px-4 py-14 md:px-8">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">
              {lastUpdated}
            </p>
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
              {title}
            </h1>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground">{intro}</p>
          </div>
        </section>

        <article className="container mx-auto max-w-3xl px-4 py-12 md:px-8 space-y-10">
          {sections.map((section) => (
            <section key={section.heading}>
              <h2 className="text-lg font-bold text-foreground mb-3">{section.heading}</h2>
              <div className="space-y-3 text-sm leading-relaxed text-muted-foreground">
                {section.paragraphs.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </section>
          ))}
        </article>
      </main>
      <Footer lang={lang} dict={dict.footer} />
    </>
  );
}

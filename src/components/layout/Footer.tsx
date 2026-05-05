import Link from "next/link";
import { Car } from "lucide-react";

interface FooterProps {
  lang: string;
  dict: {
    tagline: string;
    sections: {
      reviews: string;
      brands: string;
      about: string;
      contact: string;
    };
    legal: {
      privacy: string;
      terms: string;
    };
    copyright: string;
  };
}

export function Footer({ lang, dict }: FooterProps) {
  const sectionLinks = [
    { label: dict.sections.reviews, href: `/${lang}/reviews` },
    { label: dict.sections.brands, href: `/${lang}/brands` },
    { label: dict.sections.about, href: `/${lang}/about` },
    { label: dict.sections.contact, href: `/${lang}/contact` },
  ];

  return (
    <footer className="border-t border-border bg-card mt-16">
      <div className="container mx-auto max-w-7xl px-4 py-12 md:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand + tagline */}
          <div className="lg:col-span-2">
            <Link
              href={`/${lang}`}
              className="inline-flex items-center gap-2 mb-3"
            >
              <Car className="h-5 w-5 text-accent" aria-hidden="true" />
              <span className="font-bold text-foreground">
                Carsby<span className="text-accent">bran</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
              {dict.tagline}
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="mb-3 text-sm font-semibold text-foreground">
              {dict.sections.reviews}
            </h4>
            <ul className="space-y-2">
              {sectionLinks.map(({ label, href }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="mb-3 text-sm font-semibold text-foreground">
              Legal
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href={`/${lang}/privacy`}
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {dict.legal.privacy}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${lang}/terms`}
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {dict.legal.terms}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-border pt-6 flex items-center justify-center gap-4 text-xs text-muted-foreground">
          <span>© {new Date().getFullYear()} Carsbybran. {dict.copyright}</span>
          <Link
            href="/login"
            className="opacity-40 hover:opacity-80 transition-opacity"
            aria-label="Acceso administrador"
          >
            Admin
          </Link>
        </div>
      </div>
    </footer>
  );
}

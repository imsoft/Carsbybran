import Link from "next/link";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { SiteLogo } from "@/components/layout/SiteLogo";
import { LangSwitcher } from "./LangSwitcher";
import { NavbarAuthSection } from "./NavbarAuthSection";
import { NavbarSearch } from "./NavbarSearch";
import { NavbarMobileMenu } from "./NavbarMobileMenu";
import { getSession } from "@/lib/session";

interface NavbarProps {
  lang: string;
  dict: {
    reviews: string;
    brands: string;
    comparisons: string;
    about: string;
    contact: string;
    search: string;
    login: string;
    register: string;
    dashboard: string;
    profile: string;
    favorites: string;
    myReviews: string;
    logout: string;
    openMenu: string;
  };
}

export async function Navbar({ lang, dict }: NavbarProps) {
  const session = await getSession();

  const navLinks = [
    { href: `/${lang}/reviews`, label: dict.reviews },
    { href: `/${lang}/brands`, label: dict.brands },
    { href: `/${lang}/comparisons`, label: dict.comparisons },
    { href: `/${lang}/about`, label: dict.about },
    { href: `/${lang}/contact`, label: dict.contact },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur-sm">
      <nav className="container mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 md:px-8">
        <SiteLogo
          href={`/${lang}`}
          priority
          className="mr-2"
          imageClassName="h-8 w-auto md:h-9"
        />

        {/* Desktop nav links */}
        <ul className="hidden lg:flex items-center gap-0.5">
          {navLinks.map(({ href, label }) => (
            <li key={href}>
              <Link
                href={href}
                className="rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Right actions */}
        <div className="ml-auto flex items-center gap-1">
          <NavbarSearch lang={lang} placeholder={dict.search} />
          <LangSwitcher lang={lang} />
          <ThemeToggle />
          <NavbarMobileMenu lang={lang} navLinks={navLinks} ariaLabel={dict.openMenu} />
          <NavbarAuthSection session={session} lang={lang} dict={dict} />
        </div>
      </nav>
    </header>
  );
}

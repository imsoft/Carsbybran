import type { ReactNode } from "react";
import { SiteLogo } from "@/components/layout/SiteLogo";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

export function AuthPageShell({ lang, children }: { lang: string; children: ReactNode }) {
  return (
    <>
      <header className="border-b px-4 h-14 flex items-center justify-between">
        <SiteLogo href={`/${lang}`} imageClassName="h-7 w-auto" />
        <ThemeToggle />
      </header>

      <main className="flex-1 flex items-center justify-center p-4">
        {children}
      </main>

      <footer className="py-4 text-center text-xs text-muted-foreground border-t">
        © {new Date().getFullYear()} Carsbybran
      </footer>
    </>
  );
}
